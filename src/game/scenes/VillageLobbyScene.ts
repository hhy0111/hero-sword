import Phaser from 'phaser';
import { calculatePartyPower } from '../core/party';
import {
  AD_FALLBACK_FATIGUE,
  AD_REWARD_FATIGUE,
  FATIGUE_COST_PER_STAGE,
  claimAdFallbackReward,
  claimAdReward,
  hasStarterCompanionUnlocked,
  recoverFatigue,
  unlockStarterCompanion,
} from '../core/state';
import { AtlasFrame, ATLAS_KEY } from '../data/atlas';
import { getCharacter } from '../data/characters';
import {
  getTownSpawnDefinition,
  LUMEN_AMBIENT_NPCS,
  LUMEN_BUILDINGS,
  LUMEN_FOUNTAIN,
  LUMEN_PLAZA,
  LUMEN_STORY_NPCS,
  LUMEN_STATIC_BLOCKERS,
  LUMEN_TOWN_BOUNDS,
  LUMEN_WORLD_GATE,
  type Point2D,
  type TownAmbientNpcDefinition,
  type TownBuildingDefinition,
  type TownStoryNpcDefinition,
} from '../data/town';
import { LUMEN_PALACE_GATE } from '../data/palace';
import { PALACE_RUNTIME_IMAGE_KEYS } from '../data/palaceRuntimeArt';
import {
  STORY_FLAG_VILLAGE_ARCHIVE_EVENT,
  STORY_FLAG_VILLAGE_HARBOR_EVENT,
  STORY_FLAG_VILLAGE_MAYOR_INTRO_SEEN,
  STORY_FLAG_VILLAGE_SUPPLY_EVENT,
  hasStoryFlag,
  markStoryFlag,
} from '../data/storyFlags';
import {
  getTownAmbientArtKey,
  getTownBuildingArtKey,
  TOWN_RUNTIME_IMAGE_KEYS,
} from '../data/townRuntimeArt';
import { getShopInteractionMarkerKey } from '../data/shopRuntimeArt';
import { getRuntimeAnimationClip, type RuntimeAnimationClipEntry } from '../data/runtimeAnimationAssets';
import { t } from '../services/i18n';
import { loadSnapshot, saveSnapshot } from '../services/save';
import { clearVillageReturn, getSelectedContinent, getVillageReturn, setSelectedContinent, setVillageReturn } from '../services/session';
import { buildDebugState } from '../ui/debugHud';
import { DialogueOverlay } from '../ui/dialogueOverlay';
import { applyCharacterFacePortrait, getRarityBorderColor } from '../ui/collectionArt';
import { VirtualJoystick } from '../ui/virtualJoystick';
import { createButton, createPanel } from '../ui/widgets';
import { showRewardedFatigueAd, showVillageBanner, hideVillageBanner } from '../../platform/ads';
import type { CharacterRarity, SaveSnapshot } from '../types';

interface VillageSceneData {
  spawnId?: string;
  x?: number;
  y?: number;
}

interface AmbientNpcRuntime {
  definition: TownAmbientNpcDefinition;
  sprite: Phaser.GameObjects.Image;
  shadow: Phaser.GameObjects.Ellipse;
  pathIndex: number;
  position: Point2D;
  waitUntilMs: number;
  facing: -1 | 1;
  moving: boolean;
}

interface StoryNpcRuntime {
  definition: TownStoryNpcDefinition;
  sprite: Phaser.GameObjects.Image;
  shadow: Phaser.GameObjects.Ellipse;
  talkMarker?: Phaser.GameObjects.Text;
  facing: -1 | 1;
}

interface ActiveInteraction {
  kind: 'gate' | 'shop' | 'npc' | 'story_npc' | 'palace';
  label: string;
  prompt: string;
  interactX: number;
  interactY: number;
  targetX: number;
  targetY: number;
  shopId?: TownBuildingDefinition['id'];
  npcId?: string;
}

const PLAYER_RADIUS = 18;
const HUD_DEPTH = 1000;
const DEPTH_SCALE = 0.1;
const SHOP_INTERACT_RADIUS = 60;
const SHOP_AUTO_ENTER_RADIUS = 58;
const SHOP_AUTO_ENTER_REARM_RADIUS = 86;
const TOWN_PROP_LAYOUT = [
  { key: TOWN_RUNTIME_IMAGE_KEYS.noticeBoard, x: 430, y: 410, displayHeight: 84 },
  { key: TOWN_RUNTIME_IMAGE_KEYS.bench, x: 980, y: 410, displayHeight: 58 },
  { key: TOWN_RUNTIME_IMAGE_KEYS.bench, x: 738, y: 706, displayHeight: 54 },
  { key: TOWN_RUNTIME_IMAGE_KEYS.planter, x: 704, y: 660, displayHeight: 54 },
  { key: TOWN_RUNTIME_IMAGE_KEYS.planter, x: 1002, y: 660, displayHeight: 54 },
  { key: TOWN_RUNTIME_IMAGE_KEYS.planter, x: 428, y: 900, displayHeight: 50 },
  { key: TOWN_RUNTIME_IMAGE_KEYS.planter, x: 1110, y: 900, displayHeight: 50 },
  { key: TOWN_RUNTIME_IMAGE_KEYS.crateStack, x: 170, y: 622, displayHeight: 64 },
  { key: TOWN_RUNTIME_IMAGE_KEYS.crateStack, x: 1360, y: 660, displayHeight: 66 },
  { key: TOWN_RUNTIME_IMAGE_KEYS.crateStack, x: 1342, y: 932, displayHeight: 66 },
  { key: TOWN_RUNTIME_IMAGE_KEYS.lampPost, x: 620, y: 270, displayHeight: 96 },
  { key: TOWN_RUNTIME_IMAGE_KEYS.lampPost, x: 916, y: 270, displayHeight: 96 },
  { key: TOWN_RUNTIME_IMAGE_KEYS.lampPost, x: 696, y: 792, displayHeight: 96 },
  { key: TOWN_RUNTIME_IMAGE_KEYS.lampPost, x: 1022, y: 784, displayHeight: 96 },
] as const;

export class VillageLobbyScene extends Phaser.Scene {
  private sceneData: VillageSceneData = {};
  private snapshot!: SaveSnapshot;
  private player = { x: 0, y: 0, moving: false };
  private animationElapsedMs = 0;
  private hero!: Phaser.GameObjects.Image;
  private heroShadow!: Phaser.GameObjects.Ellipse;
  private heroFacing: -1 | 1 = 1;
  private ambientNpcs: AmbientNpcRuntime[] = [];
  private storyNpcs: StoryNpcRuntime[] = [];
  private worldGateEffect: Phaser.GameObjects.Image | null = null;
  private menuButton!: Phaser.GameObjects.Container;
  private menuPanel!: Phaser.GameObjects.Container;
  private menuEntries: Phaser.GameObjects.Container[] = [];
  private fatigueHudFill!: Phaser.GameObjects.Rectangle;
  private fatigueHudText!: Phaser.GameObjects.Text;
  private infoText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private dialogueText!: Phaser.GameObjects.Text;
  private npcDialogue!: DialogueOverlay;
  private interactionText!: Phaser.GameObjects.Text;
  private interactionMarker!: Phaser.GameObjects.Text;
  private markerGraphics!: Phaser.GameObjects.Graphics;
  private portalGraphics!: Phaser.GameObjects.Graphics;
  private fountainWaterImage: Phaser.GameObjects.Image | null = null;
  private palaceGateEffect: Phaser.GameObjects.Image | null = null;
  private shopEntranceEffects: Phaser.GameObjects.Image[] = [];
  private visibleShopIds = new Set<TownBuildingDefinition['id']>();
  private palaceEntranceVisible = false;
  private worldGateVisible = false;
  private joystick!: VirtualJoystick;
  private rewardBusy = false;
  private fallbackReadyAt: number | null = null;
  private dialogueExpiresAt = 0;
  private activeInteraction: ActiveInteraction | null = null;
  private blockedShopAutoEnterIds = new Set<TownBuildingDefinition['id']>();
  private blockedPalaceAutoEnter = false;
  private blockedWorldGateAutoEnter = false;

  constructor() {
    super('village');
  }

  init(data: VillageSceneData = {}): void {
    this.sceneData = data;
  }

  create(): void {
    this.snapshot = loadSnapshot();
    this.animationElapsedMs = 0;
    this.rewardBusy = false;
    this.fallbackReadyAt = null;
    this.activeInteraction = null;
    this.dialogueExpiresAt = 0;
    this.blockedShopAutoEnterIds = new Set();
    this.blockedPalaceAutoEnter = false;
    this.blockedWorldGateAutoEnter = false;
    this.worldGateEffect = null;
    this.palaceGateEffect = null;
    this.shopEntranceEffects = [];
    this.fountainWaterImage = null;
    this.visibleShopIds = new Set();
    this.palaceEntranceVisible = false;
    this.worldGateVisible = false;
    this.menuEntries = [];
    this.player = { ...this.resolveStartPosition(), moving: false };
    this.ambientNpcs = [];
    this.storyNpcs = [];

    this.drawTown();
    this.createHero();
    this.createHud();
    this.npcDialogue = new DialogueOverlay(this, HUD_DEPTH + 5);
    this.input.on('pointerup', this.handlePointerInteract, this);
    this.primeBlockedShopAutoEntry();
    this.primeBlockedPalaceAutoEntry();
    this.primeBlockedWorldGateAutoEntry();

    this.cameras.main.setBounds(0, 0, LUMEN_TOWN_BOUNDS.width, LUMEN_TOWN_BOUNDS.height);
    this.cameras.main.startFollow(this.hero, true, 0.14, 0.14);
    this.cameras.main.setDeadzone(64, 96);
    this.cameras.main.roundPixels = true;

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.joystick.destroy();
      this.input.off('pointerup', this.handlePointerInteract, this);
      this.ambientNpcs = [];
      this.storyNpcs = [];
      this.npcDialogue?.destroy();
      void hideVillageBanner();
    });

    void showVillageBanner();
    this.playArrivalStoryIfNeeded();
    this.refreshHud();
  }

  update(_: number, delta: number): void {
    this.stepSimulation(delta);
  }

  public stepSimulation(deltaMs: number): void {
    this.animationElapsedMs += deltaMs;
    this.npcDialogue?.update();
    if (this.handleDialoguePauseInput()) {
      this.updateAmbientNpcs(deltaMs);
      this.updateWorldEffects();
      this.resolveInteraction();
      this.refreshRecoveryState();
      this.refreshHud();
      return;
    }
    this.handleMovement(deltaMs);
    this.updateAmbientNpcs(deltaMs);
    this.updateWorldEffects();
    this.resolveInteraction();
    this.handleAutoShopEntry();
    this.handleAutoPalaceEntry();
    this.handleAutoWorldGateEntry();
    this.refreshRecoveryState();
    this.refreshHud();
  }

  private handleDialoguePauseInput(): boolean {
    if (!this.npcDialogue?.isVisible()) {
      return false;
    }

    this.player.moving = false;
    this.hero.setPosition(this.player.x, this.player.y);
    this.heroShadow.setPosition(this.player.x, this.player.y - 4);
    this.hero.setDepth(depthForBottom(this.player.y));
    this.heroShadow.setDepth(depthForBottom(this.player.y) - 0.4);
    this.applyHeroRuntimeTexture();

    return this.npcDialogue.isVisible();
  }

  public renderGameToText(): string {
    return JSON.stringify(
      buildDebugState('village_explore', this.snapshot, {
        town: 'lumen_village',
        player: {
          x: Number(this.player.x.toFixed(1)),
          y: Number(this.player.y.toFixed(1)),
          moving: this.player.moving,
        },
        activeInteraction: this.activeInteraction
          ? {
              kind: this.activeInteraction.kind,
              label: this.activeInteraction.label,
              prompt: this.activeInteraction.prompt,
            }
          : null,
        ambientNpcs: this.ambientNpcs.map((npc) => ({
          id: npc.definition.id,
          x: Number(npc.position.x.toFixed(1)),
          y: Number(npc.position.y.toFixed(1)),
        })),
        dialogueActive: this.npcDialogue?.isVisible() ?? false,
        starterCompanionUnlocked: hasStarterCompanionUnlocked(this.snapshot),
        storyFlags: [...this.snapshot.story.flags],
        selectedContinent: getSelectedContinent(this) ?? 'continent_01',
        availableActions: [
          'interact',
          'reward_ad',
          'reward_fallback',
          'open_party',
          'open_equipment',
          'open_gacha',
          'open_cash_shop',
          'open_housing',
          'open_options',
          'enter_palace',
          'enter_world_map',
        ],
      }),
    );
  }

  private resolveStartPosition(): Point2D {
    if (typeof this.sceneData.x === 'number' && typeof this.sceneData.y === 'number') {
      clearVillageReturn(this);
      return { x: this.sceneData.x, y: this.sceneData.y };
    }

    if (this.sceneData.spawnId) {
      clearVillageReturn(this);
      return getTownSpawnDefinition(this.sceneData.spawnId);
    }

    const villageReturn = getVillageReturn(this);
    clearVillageReturn(this);

    if (villageReturn?.spawnId) {
      return getTownSpawnDefinition(villageReturn.spawnId);
    }

    if (typeof villageReturn?.x === 'number' && typeof villageReturn.y === 'number') {
      return { x: villageReturn.x, y: villageReturn.y };
    }

    return getTownSpawnDefinition('starter_square');
  }

  private drawTown(): void {
    this.cameras.main.setBackgroundColor('#1e2e1e');
    this.drawGroundTiles();
    this.drawRoadNetwork();
    this.drawWalls();
    this.drawFountain();
    this.drawBuildings();
    this.drawTownProps();
    this.createEntranceEffects();
    this.createAmbientNpcs();
    this.createStoryNpcs();
    this.markerGraphics = this.add.graphics().setDepth(40);
    this.portalGraphics = this.add.graphics().setDepth(depthForBottom(LUMEN_WORLD_GATE.y) + 0.2);
  }

  private drawGroundTiles(): void {
    if (this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.grassPlainTile)) {
      this.fillRuntimeTileRectWithResolver(
        { x: 0, y: 0, width: LUMEN_TOWN_BOUNDS.width, height: LUMEN_TOWN_BOUNDS.height },
        1,
        (row, col, rows, cols) => {
          const edgeBand = row < 2 || col < 2 || row >= rows - 2 || col >= cols - 2;
          const plazaBand =
            row >= Math.floor(rows * 0.3) &&
            row <= Math.ceil(rows * 0.68) &&
            col >= Math.floor(cols * 0.24) &&
            col <= Math.ceil(cols * 0.78);
          if (edgeBand && this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.grassWildTile) && (row * 3 + col * 5) % 11 === 0) {
            return TOWN_RUNTIME_IMAGE_KEYS.grassWildTile;
          }
          if (!plazaBand && this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.grassWhiteFlowersTile) && (row * 7 + col * 11) % 43 === 0) {
            return TOWN_RUNTIME_IMAGE_KEYS.grassWhiteFlowersTile;
          }
          if (!plazaBand && this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.grassYellowFlowersTile) && (row * 5 + col * 3) % 47 === 0) {
            return TOWN_RUNTIME_IMAGE_KEYS.grassYellowFlowersTile;
          }
          if (!plazaBand && this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.grassWildTile) && (row + col * 2) % 29 === 0) {
            return TOWN_RUNTIME_IMAGE_KEYS.grassWildTile;
          }
          return TOWN_RUNTIME_IMAGE_KEYS.grassPlainTile;
        },
      );
      return;
    }
  }

  private drawRoadNetwork(): void {
    const mainEastWestRoad = { x: 120, y: 456, width: 1296, height: 108 };
    const palaceRoad = { x: 692, y: 96, width: 152, height: 384 };
    const southRoad = { x: 692, y: 644, width: 152, height: 440 };
    const sideLanes = [
      { x: 194, y: 608, width: 132, height: 132 },
      { x: 214, y: 938, width: 132, height: 118 },
      { x: 1194, y: 646, width: 136, height: 118 },
      { x: 1216, y: 934, width: 142, height: 116 },
      { x: 706, y: 792, width: 124, height: 116 },
      { x: 1004, y: 568, width: 160, height: 116 },
    ] as const;

    const hasRoadBase = this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.roadStoneTile);
    const hasRoadAccent = this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.roadStoneAltTile);
    const hasPlazaBase = this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.plazaStoneTile);

    if (hasRoadBase) {
      for (const bounds of [mainEastWestRoad, palaceRoad, southRoad] as const) {
        this.fillRuntimeTileRectWithResolver(bounds, 3, (row, col) => {
          if (hasRoadAccent && (row + col * 2) % 12 === 0) {
            return TOWN_RUNTIME_IMAGE_KEYS.roadStoneAltTile;
          }
          return TOWN_RUNTIME_IMAGE_KEYS.roadStoneTile;
        });
      }
    }

    if (hasPlazaBase) {
      this.fillRuntimeTileRectWithResolver(LUMEN_PLAZA, 4, (row, col) => {
        if (hasRoadAccent && (row * 2 + col * 3) % 15 === 0) {
          return TOWN_RUNTIME_IMAGE_KEYS.roadStoneAltTile;
        }
        return TOWN_RUNTIME_IMAGE_KEYS.plazaStoneTile;
      });
    }

    if (hasRoadBase) {
      for (const lane of sideLanes) {
        this.fillRuntimeTileRectWithResolver(lane, 3, (row, col) => {
          if (hasRoadAccent && (row * 5 + col * 3) % 10 === 0) {
            return TOWN_RUNTIME_IMAGE_KEYS.roadStoneAltTile;
          }
          return TOWN_RUNTIME_IMAGE_KEYS.roadStoneTile;
        });
      }
    }
  }

  private drawWalls(): void {
    const hasSquareWallTiles =
      this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.wallHorizontalTile) &&
      this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.wallVerticalTile);

    if (hasSquareWallTiles) {
      const drawHorizontalWallTiles = (startX: number, endX: number, y: number, tint = 0xffffff): void => {
        for (let x = startX; x <= endX; x += 64) {
          this.add.image(x + 32, y + 32, TOWN_RUNTIME_IMAGE_KEYS.wallHorizontalTile)
            .setDisplaySize(64, 64)
            .setTint(tint)
            .setDepth(depthForBottom(y + 64) - 1.6);
        }
      };
      const drawVerticalWallTiles = (x: number, startY: number, endY: number, tint = 0xffffff): void => {
        for (let y = startY; y <= endY; y += 64) {
          this.add.image(x + 32, y + 32, TOWN_RUNTIME_IMAGE_KEYS.wallVerticalTile)
            .setDisplaySize(64, 64)
            .setTint(tint)
            .setDepth(depthForBottom(y + 64) - 1.6);
        }
      };

      drawHorizontalWallTiles(0, 1472, 96);
      drawHorizontalWallTiles(0, 1472, 1088);
      drawVerticalWallTiles(0, 160, 1024);
      drawVerticalWallTiles(1472, 160, 1024);

      if (this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.wallTower)) {
        for (const position of [
          { x: 64, y: 196 },
          { x: 1472, y: 196 },
          { x: 64, y: 1168 },
          { x: 1472, y: 1168 },
        ]) {
          const tower = this.add.image(position.x, position.y, TOWN_RUNTIME_IMAGE_KEYS.wallTower)
            .setOrigin(0.5, 1)
            .setDepth(depthForBottom(position.y) + 0.4);
          setImageToHeight(tower, 136);
        }
      }
    } else if (this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.wallSegment)) {
      for (const segment of [
        { x: 342, y: 102, width: 300 },
        { x: 1194, y: 102, width: 300 },
        { x: 768, y: 1098, width: 720 },
      ]) {
        const wall = this.add.image(segment.x, segment.y, TOWN_RUNTIME_IMAGE_KEYS.wallSegment)
          .setOrigin(0.5, 1)
          .setDepth(depthForBottom(segment.y) - 1.5);
        setImageToWidthWithHeightCap(wall, segment.width, 70);
      }
    }

    if (this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.gateArch)) {
      const gateArch = this.add.image(LUMEN_WORLD_GATE.x, 1120, TOWN_RUNTIME_IMAGE_KEYS.gateArch)
        .setOrigin(0.5, 1)
        .setDepth(depthForBottom(1140) + 1.05);
      setImageToHeight(gateArch, 222);
      if (this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.wallTower)) {
        for (const x of [LUMEN_WORLD_GATE.x - 138, LUMEN_WORLD_GATE.x + 138]) {
          const tower = this.add.image(x, 1158, TOWN_RUNTIME_IMAGE_KEYS.wallTower)
            .setOrigin(0.5, 1)
            .setDepth(depthForBottom(1158) + 0.82)
            .setTint(0xdfe9ff);
          setImageToHeight(tower, 184);
        }
      }
      this.worldGateVisible = true;
    }

    const palaceDepth = depthForBottom(LUMEN_PALACE_GATE.y - 136) - 3.4;
    if (hasSquareWallTiles) {
      const wallY = 96;
      const gateDepth = palaceDepth + 0.35;
      drawPalaceWallTiles(this, LUMEN_PALACE_GATE.x - 256, LUMEN_PALACE_GATE.x + 192, wallY, palaceDepth);
      if (this.textures.exists(PALACE_RUNTIME_IMAGE_KEYS.exterior)) {
        const palaceFacade = this.add.image(LUMEN_PALACE_GATE.x, LUMEN_PALACE_GATE.y + 62, PALACE_RUNTIME_IMAGE_KEYS.exterior)
          .setOrigin(0.5, 1)
          .setDepth(gateDepth);
        setImageToWidthWithHeightCap(palaceFacade, 430, 300);
      } else {
        this.add.rectangle(LUMEN_PALACE_GATE.x, LUMEN_PALACE_GATE.y - 62, 122, 72, 0x17283a, 0.88)
          .setStrokeStyle(2, 0xdcc175, 0.58)
          .setDepth(gateDepth);
        this.add.rectangle(LUMEN_PALACE_GATE.x - 62, LUMEN_PALACE_GATE.y - 50, 18, 78, 0xded2b3, 0.96)
          .setStrokeStyle(2, 0x6b5a38, 0.58)
          .setDepth(gateDepth + 0.02);
        this.add.rectangle(LUMEN_PALACE_GATE.x + 62, LUMEN_PALACE_GATE.y - 50, 18, 78, 0xded2b3, 0.96)
          .setStrokeStyle(2, 0x6b5a38, 0.58)
          .setDepth(gateDepth + 0.02);
        this.add.rectangle(LUMEN_PALACE_GATE.x, LUMEN_PALACE_GATE.y - 52, 62, 56, 0x315981, 0.9)
          .setStrokeStyle(2, 0xf3dd91, 0.72)
          .setDepth(gateDepth + 0.04);
        this.add.rectangle(LUMEN_PALACE_GATE.x, LUMEN_PALACE_GATE.y - 96, 144, 14, 0xc8aa57, 0.94)
          .setStrokeStyle(1, 0xffefd1, 0.54)
          .setDepth(gateDepth + 0.06);
        this.add.triangle(LUMEN_PALACE_GATE.x, LUMEN_PALACE_GATE.y - 118, 0, 28, 62, 28, 31, 0, 0x2d5f98, 0.92)
          .setStrokeStyle(2, 0xf1d487, 0.72)
          .setDepth(gateDepth + 0.08);
      }
      this.palaceEntranceVisible = true;
    } else if (this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.wallSegment)) {
      const palaceBackWall = this.add.image(LUMEN_PALACE_GATE.x, LUMEN_PALACE_GATE.y - 164, TOWN_RUNTIME_IMAGE_KEYS.wallSegment)
        .setOrigin(0.5, 1)
        .setDepth(palaceDepth)
        .setTint(0xd9e8ff);
      setImageToWidthWithHeightCap(palaceBackWall, 430, 76);
      this.palaceEntranceVisible = true;
    }
    if (this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.wallTower)) {
      for (const x of [LUMEN_PALACE_GATE.x - 158, LUMEN_PALACE_GATE.x + 158]) {
        const tower = this.add.image(x, LUMEN_PALACE_GATE.y + 6, TOWN_RUNTIME_IMAGE_KEYS.wallTower)
          .setOrigin(0.5, 1)
          .setDepth(palaceDepth + 0.24)
          .setTint(0xd9e8ff);
        setImageToHeight(tower, 132);
        this.palaceEntranceVisible = true;
      }
    }
    if (this.palaceEntranceVisible) {
      this.add.text(LUMEN_PALACE_GATE.x, Math.max(42, LUMEN_PALACE_GATE.y - 236), t(this, 'ui.palace', undefined, '궁전'), {
        fontFamily: 'Segoe UI',
        fontSize: '14px',
        color: '#fff0c9',
        stroke: '#261913',
        strokeThickness: 4,
      }).setOrigin(0.5).setDepth(depthForBottom(120) - 1.5);
    }

  }
  private drawFountain(): void {
    const centerX = LUMEN_FOUNTAIN.centerX;
    const centerY = LUMEN_FOUNTAIN.centerY;
    this.fountainWaterImage = null;

    if (!this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.fountainBase)) {
      return;
    }

    this.add.ellipse(centerX, centerY + 64, 176, 30, 0x18202d, 0.22).setDepth(18);

    const fountain = this.add.image(centerX, centerY + 18, TOWN_RUNTIME_IMAGE_KEYS.fountainBase)
      .setOrigin(0.5, 0.5)
      .setDepth(24);
    setImageToWidth(fountain, 250);

    if (this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.fountainWater)) {
      this.fountainWaterImage = this.add.image(centerX, centerY + 12, TOWN_RUNTIME_IMAGE_KEYS.fountainWater)
        .setOrigin(0.5, 0.5)
        .setDepth(25);
      setImageToWidth(this.fountainWaterImage, 250);
      this.fountainWaterImage.setData('baseWidth', this.fountainWaterImage.displayWidth);
      this.fountainWaterImage.setData('baseHeight', this.fountainWaterImage.displayHeight);
    }
  }

  private drawBuildings(): void {
    this.visibleShopIds.clear();
    for (const building of LUMEN_BUILDINGS) {
      if (this.drawRuntimeBuilding(building)) {
        this.visibleShopIds.add(building.id);
      }
    }
  }

  private drawRuntimeBuilding(building: TownBuildingDefinition): boolean {
    const artKey = getTownBuildingArtKey(building.id);
    if (!artKey || !this.textures.exists(artKey)) {
      return false;
    }

    const bottomY = building.body.y + building.body.height;
    const centerX = building.body.x + building.body.width / 2;
    const depth = depthForBottom(bottomY);
    this.add.ellipse(centerX, bottomY + 10, building.body.width + 46, 26, 0x111111, 0.2)
      .setDepth(depth - 4);

    const buildingImage = this.add.image(centerX, bottomY, artKey)
      .setOrigin(0.5, 1)
      .setDepth(depth);
    fitImageWithin(buildingImage, building.body.width + 76, building.body.height + 88);
    return true;
  }

  private drawProceduralBuilding(building: TownBuildingDefinition): void {
    const depth = depthForBottom(building.body.y + building.body.height);
    const config = this.getBuildingTileConfig(building.id);
    const foundationHeight = 20;
    const wallBandHeight = 34;
    const roofInset = 12;
    const roofTop = building.body.y + 10;
    const roofHeight = Math.max(60, building.body.height - foundationHeight - wallBandHeight - 16);
    const wallTop = building.body.y + building.body.height - foundationHeight - wallBandHeight;
    const wallHeight = wallBandHeight;
    const roofCenterX = building.body.x + building.body.width / 2;
    const signY = wallTop + 10;
    const leftWindowX = building.body.x + 48;
    const rightWindowX = building.body.x + building.body.width - 48;
    const windowY = wallTop + 14;
    const roofWidth = building.body.width - roofInset * 2;

    this.add.ellipse(roofCenterX, building.body.y + building.body.height + 10, building.body.width + 42, 26, 0x111111, 0.2)
      .setDepth(depth - 4);

    this.paintTileRect(
      building.body.x - 6,
      building.body.y + building.body.height - 20,
      building.body.width + 12,
      20,
      [TOWN_RUNTIME_IMAGE_KEYS.plazaStoneTile, TOWN_RUNTIME_IMAGE_KEYS.roadStoneTile],
      depth - 3,
      0x9a8b75,
    );
    this.add.rectangle(roofCenterX, building.body.y + building.body.height - 10, building.body.width + 16, 20, 0x4f443c, 0.54)
      .setDepth(depth - 2)
      .setStrokeStyle(2, 0x2a211c, 0.28);

    this.paintTileRect(
      building.body.x,
      wallTop,
      building.body.width,
      wallHeight,
      config.wallTiles,
      depth - 1,
      config.wallTint,
    );
    this.add.rectangle(roofCenterX, wallTop + wallHeight / 2, building.body.width, wallHeight, 0xffffff, 0)
      .setDepth(depth)
      .setStrokeStyle(3, 0x41342a, 0.34);

    this.paintTileRect(
      building.body.x + roofInset,
      roofTop,
      roofWidth,
      roofHeight,
      config.roofTiles,
      depth - 2,
      config.roofTint,
    );
    this.add.rectangle(roofCenterX, roofTop + roofHeight / 2, roofWidth, roofHeight, 0xffffff, 0)
      .setDepth(depth - 1.5)
      .setStrokeStyle(3, 0x34261d, 0.44);
    this.add.rectangle(roofCenterX, roofTop + roofHeight - 10, roofWidth - 18, 14, 0x2f241c, 0.24)
      .setDepth(depth - 1.2);
    this.add.rectangle(building.body.x + building.body.width - 26, roofTop + 22, 14, 24, 0x6a5848, 0.92)
      .setDepth(depth - 1.2)
      .setStrokeStyle(2, 0x31251d, 0.34);
    this.add.rectangle(roofCenterX, wallTop - 4, roofWidth - 12, 8, 0x201813, 0.22)
      .setDepth(depth - 0.9);

    this.drawWindow(leftWindowX, windowY, depth - 0.2, config.windowGlow);
    this.drawWindow(rightWindowX, windowY, depth - 0.2, config.windowGlow);

    this.add.rectangle(building.door.x, building.body.y + building.body.height - 24, 54, 34, 0x403127, 1)
      .setDepth(depth + 0.1)
      .setStrokeStyle(3, 0xd2b67a, 0.42);
    this.add.rectangle(building.door.x, building.body.y + building.body.height - 20, 30, 24, 0x241813, 1)
      .setDepth(depth + 0.2)
      .setStrokeStyle(2, 0x8c6a40, 0.36);
    this.add.rectangle(building.door.x, building.body.y + building.body.height - 42, 66, 10, config.trimTint, 0.94)
      .setDepth(depth + 0.24)
      .setStrokeStyle(2, 0x3a2b20, 0.28);

    this.add.rectangle(roofCenterX, signY, 110, 24, 0x25313f, 0.96)
      .setDepth(depth + 0.3)
      .setStrokeStyle(2, config.trimTint, 0.4);
    this.add.image(roofCenterX - 34, signY, ATLAS_KEY, building.iconFrame)
      .setDisplaySize(20, 20)
      .setDepth(depth + 0.4);
    this.add.text(roofCenterX + 8, signY + 1, this.formatBuildingSignLabel(building.label), {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#efe4c5',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(depth + 0.4);

    this.drawWallLantern(building.body.x + 26, building.body.y + building.body.height - 36, depth + 0.2);
    this.drawWallLantern(building.body.x + building.body.width - 26, building.body.y + building.body.height - 36, depth + 0.2);
  }

  private formatBuildingSignLabel(label: string): string {
    return t(this, label, undefined, label).replace(/\s*(?:Shop|상점|商店|ショップ)$/u, '');
  }

  private paintTileRect(
    x: number,
    y: number,
    width: number,
    height: number,
    tileKeys: readonly string[],
    depth: number,
    tint = 0xffffff,
  ): void {
    const tileSize = 32;
    const right = x + width;
    const bottom = y + height;

    for (let tileY = y; tileY < bottom; tileY += tileSize) {
      for (let tileX = x; tileX < right; tileX += tileSize) {
        const tileWidth = Math.min(tileSize, right - tileX);
        const tileHeight = Math.min(tileSize, bottom - tileY);
        const key = tileKeys[(Math.floor((tileX - x) / tileSize) + Math.floor((tileY - y) / tileSize)) % tileKeys.length];

        if (this.textures.exists(key)) {
          this.add.image(tileX + tileWidth / 2, tileY + tileHeight / 2, key)
            .setDisplaySize(tileWidth, tileHeight)
            .setTint(tint)
            .setDepth(depth);
          continue;
        }

        this.add.rectangle(tileX + tileWidth / 2, tileY + tileHeight / 2, tileWidth, tileHeight, tint, 1)
          .setDepth(depth);
      }
    }
  }

  private drawWindow(x: number, y: number, depth: number, glowTint: number): void {
    this.add.rectangle(x, y, 28, 34, 0x33261d, 1)
      .setDepth(depth + 0.02)
      .setStrokeStyle(2, 0x8a6a45, 0.38);
    this.add.rectangle(x, y, 18, 22, glowTint, 0.72)
      .setDepth(depth + 0.03);
    this.add.rectangle(x, y, 20, 24, 0xffffff, 0)
      .setDepth(depth + 0.04)
      .setStrokeStyle(1, 0xead28a, 0.28);
  }

  private drawWallLantern(x: number, y: number, depth: number): void {
    this.add.rectangle(x, y, 8, 16, 0x4e3929, 1)
      .setDepth(depth)
      .setStrokeStyle(1, 0x261c15, 0.34);
    this.add.circle(x, y + 4, 8, 0xf0cc72, 0.18).setDepth(depth - 0.02);
    this.add.circle(x, y + 4, 4, 0xffefb2, 0.9).setDepth(depth + 0.02);
  }

  private getBuildingTileConfig(buildingId: TownBuildingDefinition['id']): {
    wallTiles: readonly string[];
    roofTiles: readonly string[];
    wallTint: number;
    roofTint: number;
    gableTint: number;
    trimTint: number;
    windowGlow: number;
  } {
    switch (buildingId) {
      case 'weapon_shop':
        return {
          wallTiles: [TOWN_RUNTIME_IMAGE_KEYS.indoorWarmStoneTile, TOWN_RUNTIME_IMAGE_KEYS.indoorCleanBrickTile],
          roofTiles: [TOWN_RUNTIME_IMAGE_KEYS.indoorDarkWoodTile, TOWN_RUNTIME_IMAGE_KEYS.indoorWoodTile],
          wallTint: 0xd4c4a6,
          roofTint: 0x8a5c3a,
          gableTint: 0x5d7687,
          trimTint: 0xd0b36f,
          windowGlow: 0xf0cf82,
        };
      case 'armor_shop':
        return {
          wallTiles: [TOWN_RUNTIME_IMAGE_KEYS.indoorCleanBrickTile, TOWN_RUNTIME_IMAGE_KEYS.indoorWornBrickTile],
          roofTiles: [TOWN_RUNTIME_IMAGE_KEYS.indoorDarkWoodTile, TOWN_RUNTIME_IMAGE_KEYS.indoorWorkshopStoneTile],
          wallTint: 0xc6c5cf,
          roofTint: 0x596575,
          gableTint: 0x6d8194,
          trimTint: 0xc9b57b,
          windowGlow: 0xcfdcf1,
        };
      case 'item_shop':
        return {
          wallTiles: [TOWN_RUNTIME_IMAGE_KEYS.indoorWoodTile, TOWN_RUNTIME_IMAGE_KEYS.indoorDarkWoodTile],
          roofTiles: [TOWN_RUNTIME_IMAGE_KEYS.indoorDarkWoodTile, TOWN_RUNTIME_IMAGE_KEYS.indoorWoodTile],
          wallTint: 0xc2a97b,
          roofTint: 0x7d6b43,
          gableTint: 0x8a7c52,
          trimTint: 0xd6c17f,
          windowGlow: 0xf0d98d,
        };
      case 'forge_shop':
        return {
          wallTiles: [TOWN_RUNTIME_IMAGE_KEYS.indoorWorkshopStoneTile, TOWN_RUNTIME_IMAGE_KEYS.indoorWornBrickTile],
          roofTiles: [TOWN_RUNTIME_IMAGE_KEYS.indoorDarkWoodTile, TOWN_RUNTIME_IMAGE_KEYS.indoorWorkshopStoneTile],
          wallTint: 0x9f9086,
          roofTint: 0x6f4b40,
          gableTint: 0x865644,
          trimTint: 0xcfb072,
          windowGlow: 0xffcf7e,
        };
      case 'relic_shop':
        return {
          wallTiles: [TOWN_RUNTIME_IMAGE_KEYS.indoorCleanBrickTile, TOWN_RUNTIME_IMAGE_KEYS.indoorWornBrickTile],
          roofTiles: [TOWN_RUNTIME_IMAGE_KEYS.indoorDarkWoodTile, TOWN_RUNTIME_IMAGE_KEYS.indoorDarkWoodTile],
          wallTint: 0xb9b0d1,
          roofTint: 0x5e4a71,
          gableTint: 0x6f5c8a,
          trimTint: 0xd8c184,
          windowGlow: 0xd5c8ff,
        };
      default:
        return {
          wallTiles: [TOWN_RUNTIME_IMAGE_KEYS.indoorWarmStoneTile],
          roofTiles: [TOWN_RUNTIME_IMAGE_KEYS.indoorDarkWoodTile],
          wallTint: 0xd2c0a6,
          roofTint: 0x745b43,
          gableTint: 0x625245,
          trimTint: 0xcab478,
          windowGlow: 0xf0d58b,
        };
    }
  }

  private drawTownProps(): void {
    for (const definition of TOWN_PROP_LAYOUT) {
      if (!this.textures.exists(definition.key)) {
        continue;
      }

      const prop = this.add.image(definition.x, definition.y, definition.key)
        .setOrigin(0.5, 1)
        .setDepth(depthForBottom(definition.y));
      setImageToHeight(prop, definition.displayHeight);
    }
  }

  private drawProceduralNoticeBoard(x: number, y: number): void {
    const depth = depthForBottom(y);
    this.add.rectangle(x - 24, y - 2, 8, 44, 0x5f4129).setOrigin(0.5, 1).setDepth(depth - 0.1);
    this.add.rectangle(x + 24, y - 2, 8, 44, 0x5f4129).setOrigin(0.5, 1).setDepth(depth - 0.1);
    this.add.rectangle(x, y - 42, 92, 58, 0x7a5334).setOrigin(0.5, 1).setDepth(depth);
    this.add.rectangle(x, y - 42, 80, 46, 0xd8c7a6).setOrigin(0.5, 1).setDepth(depth + 0.1).setStrokeStyle(2, 0x5f4129, 0.5);
    this.add.rectangle(x - 18, y - 64, 18, 8, 0xffffff, 0.76).setOrigin(0.5, 1).setDepth(depth + 0.2);
    this.add.rectangle(x + 4, y - 64, 24, 8, 0xffffff, 0.58).setOrigin(0.5, 1).setDepth(depth + 0.2);
    this.add.rectangle(x, y - 52, 58, 12, 0xb28c51, 0.88).setOrigin(0.5, 1).setDepth(depth + 0.2);
    this.add.text(x, y - 51, t(this, 'ui.world_map_board', undefined, 'Route Board'), {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#2e2117',
      fontStyle: 'bold',
    }).setOrigin(0.5, 1).setDepth(depth + 0.3);
  }

  private drawProceduralWayfindingPost(x: number, y: number): void {
    const depth = depthForBottom(y);
    this.add.rectangle(x, y - 2, 8, 42, 0x6e4d33)
      .setOrigin(0.5, 1)
      .setDepth(depth - 0.1)
      .setStrokeStyle(1, 0x3a291d, 0.48);
    this.add.rectangle(x + 2, y - 34, 50, 14, 0x8f633d)
      .setOrigin(0.5, 1)
      .setDepth(depth)
      .setStrokeStyle(2, 0x4b3321, 0.48);
    this.add.rectangle(x + 10, y - 50, 44, 12, 0x7e5737)
      .setOrigin(0.5, 1)
      .setDepth(depth + 0.05)
      .setStrokeStyle(2, 0x4b3321, 0.48);
    this.add.triangle(x + 30, y - 34, -10, -8, 16, -8, 0, 0, 0xc79b5c, 0.92)
      .setDepth(depth + 0.1)
      .setStrokeStyle(1, 0x594029, 0.42);
    this.add.triangle(x + 30, y - 50, -10, -7, 14, -7, 0, 0, 0xc79b5c, 0.88)
      .setDepth(depth + 0.12)
      .setStrokeStyle(1, 0x594029, 0.42);
  }

  private createEntranceEffects(): void {
    this.worldGateEffect = null;
    this.palaceGateEffect = null;
    this.shopEntranceEffects = [];

    for (const building of LUMEN_BUILDINGS) {
      if (!this.visibleShopIds.has(building.id)) {
        continue;
      }
      const markerKey = getShopInteractionMarkerKey(building.id);
      const key = this.textures.exists(markerKey)
        ? markerKey
        : this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.shopEntrance)
        ? TOWN_RUNTIME_IMAGE_KEYS.shopEntrance
        : null;
      if (!key) {
        continue;
      }

      const entrance = this.add.image(building.door.x, building.door.y + 8, key)
        .setOrigin(0.5)
        .setDepth(depthForBottom(building.door.y) + 0.35)
        .setAlpha(0.68);
      setImageToWidth(entrance, 60);
      entrance.setData('baseWidth', entrance.displayWidth);
      entrance.setData('baseHeight', entrance.displayHeight);
      entrance.setData('phase', this.shopEntranceEffects.length * 0.55);
      this.shopEntranceEffects.push(entrance);
    }

    const gateEffectKey = this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.worldGateSheet)
      ? TOWN_RUNTIME_IMAGE_KEYS.worldGateSheet
      : this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.shopEntrance)
      ? TOWN_RUNTIME_IMAGE_KEYS.shopEntrance
      : null;
    const palaceGateEffectKey = this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.palaceWarpMarker)
      ? TOWN_RUNTIME_IMAGE_KEYS.palaceWarpMarker
      : gateEffectKey;

    if (this.worldGateVisible && gateEffectKey) {
      this.worldGateEffect = this.add.image(
        LUMEN_WORLD_GATE.interactX,
        LUMEN_WORLD_GATE.interactY,
        gateEffectKey,
        gateEffectKey === TOWN_RUNTIME_IMAGE_KEYS.worldGateSheet ? 0 : undefined,
      )
        .setOrigin(0.5)
        .setDepth(depthForBottom(LUMEN_WORLD_GATE.y) + 0.25);
      setImageToWidth(this.worldGateEffect, gateEffectKey === TOWN_RUNTIME_IMAGE_KEYS.worldGateSheet ? 104 : 88);
      if (gateEffectKey === TOWN_RUNTIME_IMAGE_KEYS.worldGateSheet) {
        this.worldGateEffect.setData('frameCount', 4);
      }
      this.worldGateEffect.setData('baseWidth', this.worldGateEffect.displayWidth);
      this.worldGateEffect.setData('baseHeight', this.worldGateEffect.displayHeight);
    }

    if (this.palaceEntranceVisible && palaceGateEffectKey) {
      this.palaceGateEffect = this.add.image(LUMEN_PALACE_GATE.interactX, LUMEN_PALACE_GATE.interactY + 2, palaceGateEffectKey)
        .setOrigin(0.5)
        .setDepth(depthForBottom(LUMEN_PALACE_GATE.interactY) + 0.3);
      setImageToWidth(this.palaceGateEffect, 82);
      this.palaceGateEffect.setData('baseWidth', this.palaceGateEffect.displayWidth);
      this.palaceGateEffect.setData('baseHeight', this.palaceGateEffect.displayHeight);
    }
  }

  private createTalkMarker(x: number, y: number, depth: number): Phaser.GameObjects.Text {
    return this.add.text(x, y, '[!]', {
      fontFamily: 'Segoe UI',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#ffe38a',
      stroke: '#251910',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(Math.max(depth + 0.8, 220));
  }

  private playCharacterJoinEffect(characterId: string, fallbackName: string): void {
    let title = fallbackName;
    let rarity: CharacterRarity = 3;
    try {
      const character = getCharacter(characterId);
      title = t(this, character.name, undefined, character.name);
      rarity = character.rarity;
    } catch {
      // Keep the fallback message if the roster definition is not available yet.
    }

    const borderColor = getRarityBorderColor(rarity);
    const layer = this.add.container(0, 0).setScrollFactor(0).setDepth(HUD_DEPTH + 60);
    const veil = this.add.rectangle(180, 320, 360, 640, 0x02060a, 0.64);
    const card = this.add.container(-96, 306);
    const glow = this.add.rectangle(0, 0, 132, 170, borderColor, 0.14);
    const frame = this.add.rectangle(0, 0, 116, 154, 0x17131b, 0.96).setStrokeStyle(3, borderColor, 0.82);
    const portrait = this.add.image(0, -16, ATLAS_KEY, AtlasFrame.Hero);
    applyCharacterFacePortrait(this, portrait, characterId, 96, 112, this.animationElapsedMs, 1);
    const nameText = this.add.text(0, 58, title, {
      fontFamily: 'Segoe UI',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#1a110b',
      strokeThickness: 4,
    }).setOrigin(0.5);
    card.add([glow, frame, portrait, nameText]);
    card.setAngle(-42).setScale(0.72);

    const message = this.add.text(180, 430, `${title} 합류`, {
      fontFamily: 'Segoe UI',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#130d09',
      strokeThickness: 5,
    }).setOrigin(0.5).setAlpha(0);
    const subMessage = this.add.text(180, 462, '새 동료가 로스터에 들어왔습니다.', {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      color: '#ead7a6',
      stroke: '#130d09',
      strokeThickness: 3,
    }).setOrigin(0.5).setAlpha(0);

    layer.add([veil, card, message, subMessage]);
    this.tweens.add({
      targets: card,
      x: 180,
      y: 306,
      angle: 720,
      scaleX: 1,
      scaleY: 1,
      duration: 760,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        this.tweens.add({ targets: [message, subMessage], alpha: 1, duration: 180 });
      },
    });
    this.tweens.add({
      targets: glow,
      alpha: { from: 0.14, to: 0.5 },
      yoyo: true,
      repeat: 3,
      duration: 160,
      delay: 500,
    });
    this.time.delayedCall(2600, () => {
      this.tweens.add({
        targets: layer,
        alpha: 0,
        duration: 240,
        onComplete: () => layer.destroy(true),
      });
    });
  }

  private createAmbientNpcs(): void {
    const ambientNpcs: AmbientNpcRuntime[] = [];
    for (const definition of LUMEN_AMBIENT_NPCS) {
      const start = definition.patrol[0];
      const initialTarget = definition.patrol[1] ?? start;
      const facing: -1 | 1 = initialTarget.x < start.x ? -1 : 1;
      const depth = depthForBottom(start.y);
      const runtimeClip = this.getTownNpcRuntimeClip(definition.runtimeSubjectId ?? definition.id, true);
      const ambientArtKey = getTownAmbientArtKey(definition.id);
      const sprite = runtimeClip && this.textures.exists(runtimeClip.textureKey)
        ? this.add.image(start.x, start.y, runtimeClip.textureKey, 0)
          .setOrigin(0.5, 1)
          .setDepth(depth)
        : ambientArtKey && this.textures.exists(ambientArtKey)
        ? this.add.image(start.x, start.y, ambientArtKey)
          .setOrigin(0.5, 1)
          .setDepth(depth)
        : null;

      if (!sprite) {
        continue;
      }

      const shadow = this.add.ellipse(start.x, start.y - 4, 20, 8, 0x111111, 0.28).setDepth(depth - 0.4);
      const displayHeight = this.getAmbientNpcDisplayHeight(definition);

      if (runtimeClip && this.textures.exists(runtimeClip.textureKey)) {
        const scale = displayHeight / runtimeClip.frameHeight;
        sprite.setDisplaySize(Math.round(runtimeClip.frameWidth * scale), Math.round(runtimeClip.frameHeight * scale));
      } else if (ambientArtKey && this.textures.exists(ambientArtKey)) {
        setImageToHeight(sprite, displayHeight - 4);
      }

      sprite.setFlipX(facing < 0);

      ambientNpcs.push({
        definition,
        sprite,
        shadow,
        pathIndex: 1 % definition.patrol.length,
        position: { x: start.x, y: start.y },
        waitUntilMs: 0,
        facing,
        moving: false,
      });
    }
    this.ambientNpcs = ambientNpcs;
  }

  private createStoryNpcs(): void {
    const storyNpcs: StoryNpcRuntime[] = [];
    for (const definition of LUMEN_STORY_NPCS) {
      if (definition.id === 'bram_recruit' && hasStarterCompanionUnlocked(this.snapshot)) {
        continue;
      }

      const depth = depthForBottom(definition.position.y);
      const clip = this.getTownNpcRuntimeClip(definition.runtimeSubjectId, false);
      const sprite = clip && this.textures.exists(clip.textureKey)
        ? this.add.image(definition.position.x, definition.position.y, clip.textureKey, 0)
          .setOrigin(0.5, 1)
          .setDepth(depth)
        : null;

      if (!sprite) {
        continue;
      }

      const shadow = this.add.ellipse(definition.position.x, definition.position.y - 4, 22, 8, 0x111111, 0.28)
        .setDepth(depth - 0.4);
      const displayHeight = this.getStoryNpcDisplayHeight(definition);
      const talkMarker = this.shouldShowStoryTalkMarker(definition.id)
        ? this.createTalkMarker(definition.position.x, definition.position.y - displayHeight - 12, depth)
        : undefined;

      if (clip && this.textures.exists(clip.textureKey)) {
        const scale = displayHeight / clip.frameHeight;
        sprite.setDisplaySize(Math.round(clip.frameWidth * scale), Math.round(clip.frameHeight * scale));
      }

      const facing: -1 | 1 = definition.position.x < LUMEN_TOWN_BOUNDS.width / 2 ? 1 : -1;
      sprite.setFlipX(facing < 0);

      storyNpcs.push({
        definition,
        sprite,
        shadow,
        talkMarker,
        facing,
      });
    }
    this.storyNpcs = storyNpcs;
  }

  private removeStoryNpc(npcId: string): void {
    const npc = this.storyNpcs.find((entry) => entry.definition.id === npcId);
    if (!npc) {
      return;
    }

    npc.sprite.destroy();
    npc.shadow.destroy();
    npc.talkMarker?.destroy();
    this.storyNpcs = this.storyNpcs.filter((entry) => entry.definition.id !== npcId);
    if (this.activeInteraction?.npcId === npcId) {
      this.activeInteraction = null;
    }
  }

  private shouldShowStoryTalkMarker(npcId: string): boolean {
    return npcId === 'bram_recruit' && !hasStarterCompanionUnlocked(this.snapshot);
  }

  private shouldShowInteractionMarker(interaction: ActiveInteraction): boolean {
    return interaction.kind === 'shop';
  }

  private createHero(): void {
    this.heroShadow = this.add.ellipse(this.player.x, this.player.y - 4, 24, 10, 0x111111, 0.3).setDepth(depthForBottom(this.player.y) - 0.4);
    this.hero = this.add
      .image(this.player.x, this.player.y, ATLAS_KEY, AtlasFrame.Hero)
      .setDisplaySize(48, 48)
      .setOrigin(0.5, 1)
      .setDepth(depthForBottom(this.player.y));
    this.applyHeroRuntimeTexture();
  }

  private createHud(): void {
    this.pinHud(
      this.add.rectangle(118, 24, 210, 34, 0x071018, 0.84).setStrokeStyle(1, 0xe3cf93, 0.28),
      HUD_DEPTH + 2,
    );
    this.pinHud(
      this.add.rectangle(30, 36, 176, 7, 0x1d2530, 0.92).setOrigin(0, 0.5).setStrokeStyle(1, 0xe3cf93, 0.18),
      HUD_DEPTH + 3,
    );
    this.fatigueHudFill = this.pinHud(
      this.add.rectangle(30, 36, 176, 5, 0x6fc4ff, 0.92).setOrigin(0, 0.5),
      HUD_DEPTH + 4,
    );
    this.fatigueHudText = this.pinHud(
      this.add.text(26, 11, '', {
        fontFamily: 'Segoe UI',
        fontSize: '11px',
        fontStyle: 'bold',
        color: '#f7eed4',
        stroke: '#1b120c',
        strokeThickness: 3,
        fixedWidth: 184,
      }),
      HUD_DEPTH + 4,
    );

    this.infoText = this.pinHud(
      this.add.text(20, 32, '', {
        fontFamily: 'Segoe UI',
        fontSize: '13px',
        color: '#f4ead0',
        lineSpacing: 3,
        wordWrap: { width: 212 },
      }).setVisible(false),
      HUD_DEPTH + 1,
    );
    this.statusText = this.pinHud(
      this.add.text(20, 120, '', {
        fontFamily: 'Segoe UI',
        fontSize: '12px',
        color: '#ffe5a6',
        wordWrap: { width: 310 },
      }).setVisible(false),
      HUD_DEPTH + 1,
    );
    this.dialogueText = this.pinHud(
      this.add.text(18, 86, '', {
        fontFamily: 'Segoe UI',
        fontSize: '13px',
        color: '#fff1d1',
        backgroundColor: 'rgba(28, 19, 15, 0.84)',
        padding: { left: 10, right: 10, top: 8, bottom: 8 },
        wordWrap: { width: 324 },
      }).setVisible(false),
      HUD_DEPTH + 2,
    );
    this.interactionText = this.pinHud(
      this.add.text(176, 404, '', {
        fontFamily: 'Segoe UI',
        fontSize: '12px',
        color: '#f8efc8',
        align: 'center',
      }).setOrigin(0.5).setVisible(false),
      HUD_DEPTH + 1,
    );
    this.interactionMarker = this.add.text(0, 0, '[!]', {
      fontFamily: 'Segoe UI',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffe38a',
      stroke: '#2b2118',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(90).setVisible(false);

    this.menuButton = this.pinHud(createButton(this, 304, 38, {
      width: 96,
      height: 30,
      label: t(this, 'ui.menu'),
      iconFrame: AtlasFrame.MapIcon,
      backgroundFrame: AtlasFrame.GoldButton,
      onClick: () => this.toggleVillageMenu(),
    }), HUD_DEPTH + 3);

    this.menuPanel = this.pinHud(createPanel(this, 248, 224, 194, 354, t(this, 'ui.menu')), HUD_DEPTH + 2).setVisible(false);

    this.menuEntries = [
      createButton(this, 248, 98, {
        width: 148,
        height: 30,
        label: t(this, 'ui.party'),
        iconFrame: AtlasFrame.StageNode,
        backgroundFrame: AtlasFrame.GoldButton,
        onClick: () => {
          this.toggleVillageMenu(false);
          this.openLinkedScene('party');
        },
      }),
      createButton(this, 248, 134, {
        width: 148,
        height: 30,
        label: t(this, 'ui.gear'),
        iconFrame: AtlasFrame.SwordIcon,
        backgroundFrame: AtlasFrame.GoldButton,
        onClick: () => {
          this.toggleVillageMenu(false);
          this.openLinkedScene('equipment');
        },
      }),
      createButton(this, 248, 170, {
        width: 148,
        height: 30,
        label: t(this, 'ui.gacha'),
        iconFrame: AtlasFrame.Star,
        backgroundFrame: AtlasFrame.GoldButton,
        onClick: () => {
          this.toggleVillageMenu(false);
          this.openLinkedScene('gacha');
        },
      }),
      createButton(this, 248, 206, {
        width: 148,
        height: 30,
        label: t(this, 'ui.home'),
        iconFrame: AtlasFrame.HomeIcon,
        backgroundFrame: AtlasFrame.GoldButton,
        onClick: () => {
          this.toggleVillageMenu(false);
          this.openLinkedScene('housing');
        },
      }),
      createButton(this, 248, 242, {
        width: 148,
        height: 30,
        label: '창고',
        iconFrame: AtlasFrame.BagIcon,
        backgroundFrame: AtlasFrame.GoldButton,
        onClick: () => {
          this.toggleVillageMenu(false);
          this.openLinkedScene('storage');
        },
      }),
      createButton(this, 248, 278, {
        width: 148,
        height: 30,
        label: t(this, 'ui.cash_shop', undefined, '유료 결제'),
        iconFrame: AtlasFrame.Star,
        backgroundFrame: AtlasFrame.GoldButton,
        onClick: () => {
          this.toggleVillageMenu(false);
          this.openLinkedScene('cash_shop');
        },
      }),
      createButton(this, 248, 314, {
        width: 148,
        height: 30,
        label: `피로도 광고 +${AD_REWARD_FATIGUE}`,
        iconFrame: AtlasFrame.BagIcon,
        backgroundFrame: AtlasFrame.BlueButton,
        onClick: () => {
          this.toggleVillageMenu(false);
          void this.claimFatigueReward();
        },
      }),
      createButton(this, 248, 350, {
        width: 148,
        height: 30,
        label: t(this, 'ui.options'),
        iconFrame: AtlasFrame.MapIcon,
        backgroundFrame: AtlasFrame.GoldButton,
        onClick: () => {
          this.toggleVillageMenu(false);
          this.openLinkedScene('options');
        },
      }),
    ];

    this.menuEntries = this.menuEntries.map((button, index) => this.pinHud(button, HUD_DEPTH + 3 + index).setVisible(false));
    this.joystick = new VirtualJoystick(this, 80, 558, 42);
  }

  private toggleVillageMenu(force?: boolean): void {
    const nextVisible = force ?? !this.menuPanel.visible;
    this.menuPanel.setVisible(nextVisible);
    this.menuEntries.forEach((entry) => entry.setVisible(nextVisible));
  }

  private handleMovement(deltaMs: number): void {
    const speed = 0.19 * deltaMs;
    const joystickVector = this.joystick.getVector();
    let moveX = 0;
    let moveY = 0;

    if (joystickVector.active) {
      moveX += joystickVector.x;
      moveY += joystickVector.y;
    }

    const magnitude = Math.hypot(moveX, moveY);
    let dx = 0;
    let dy = 0;

    if (magnitude > 0.001) {
      dx = (moveX / magnitude) * speed;
      dy = (moveY / magnitude) * speed;
    }

    this.player.moving = Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001;
    if (Math.abs(dx) > 0.001) {
      this.heroFacing = dx < 0 ? -1 : 1;
    }
    this.tryMove(dx, dy);
    this.hero.setPosition(this.player.x, this.player.y);
    this.heroShadow.setPosition(this.player.x, this.player.y - 4);
    this.hero.setDepth(depthForBottom(this.player.y));
    this.heroShadow.setDepth(depthForBottom(this.player.y) - 0.4);
    this.applyHeroRuntimeTexture();
  }

  private tryMove(dx: number, dy: number): void {
    if (dx !== 0) {
      const nextX = this.player.x + dx;
      if (!this.isBlocked(nextX, this.player.y)) {
        this.player.x = Phaser.Math.Clamp(nextX, 32, LUMEN_TOWN_BOUNDS.width - 32);
      }
    }

    if (dy !== 0) {
      const nextY = this.player.y + dy;
      if (!this.isBlocked(this.player.x, nextY)) {
        this.player.y = Phaser.Math.Clamp(nextY, 64, LUMEN_TOWN_BOUNDS.height - 36);
      }
    }
  }

  private isBlocked(x: number, y: number): boolean {
    return LUMEN_STATIC_BLOCKERS.some((rect) => circleIntersectsRect(x, y, PLAYER_RADIUS, rect));
  }

  private updateAmbientNpcs(deltaMs: number): void {
    const now = this.time.now;
    const deltaSeconds = deltaMs / 1000;

    for (const npc of this.ambientNpcs) {
      if (now < npc.waitUntilMs) {
        continue;
      }

      const target = npc.definition.patrol[npc.pathIndex];
      const dx = target.x - npc.position.x;
      const dy = target.y - npc.position.y;
      const distance = Math.hypot(dx, dy);

      if (distance <= npc.definition.speed * deltaSeconds + 1) {
        npc.position.x = target.x;
        npc.position.y = target.y;
        npc.pathIndex = (npc.pathIndex + 1) % npc.definition.patrol.length;
        npc.waitUntilMs = now + npc.definition.pauseMs;
        npc.moving = false;
      } else {
        if (Math.abs(dx) > 0.5) {
          npc.facing = dx < 0 ? -1 : 1;
        }
        npc.position.x += (dx / distance) * npc.definition.speed * deltaSeconds;
        npc.position.y += (dy / distance) * npc.definition.speed * deltaSeconds;
        npc.moving = true;
      }

      const bob = npc.moving
        ? Math.sin(this.animationElapsedMs / 120 + npc.pathIndex * 0.9) * 1.1
        : Math.sin(this.animationElapsedMs / 240 + npc.pathIndex * 0.9) * 0.75;
      npc.sprite.setPosition(npc.position.x, npc.position.y + bob);
      npc.shadow.setPosition(npc.position.x, npc.position.y - 4);
      npc.sprite.setDepth(depthForBottom(npc.position.y));
      npc.shadow.setDepth(depthForBottom(npc.position.y) - 0.4);
      npc.shadow.setAlpha(npc.moving ? 0.22 : 0.26);
      this.applyAmbientRuntimeTexture(npc, npc.moving);
    }

    for (const [index, npc] of this.storyNpcs.entries()) {
      const bob = Math.sin(this.animationElapsedMs / 320 + index * 0.7) * 1.2;
      npc.sprite
        .setPosition(npc.definition.position.x, npc.definition.position.y + bob)
        .setDepth(depthForBottom(npc.definition.position.y));
      npc.shadow
        .setPosition(npc.definition.position.x, npc.definition.position.y - 4)
        .setDepth(depthForBottom(npc.definition.position.y) - 0.4)
        .setAlpha(0.24 + (Math.sin(this.animationElapsedMs / 300 + index * 0.7) + 1) * 0.03);
      npc.talkMarker
        ?.setVisible(this.shouldShowStoryTalkMarker(npc.definition.id))
        .setPosition(npc.definition.position.x, npc.definition.position.y - this.getStoryNpcDisplayHeight(npc.definition) - 12 + bob * 0.25)
        .setDepth(Math.max(depthForBottom(npc.definition.position.y) + 0.9, 220))
        .setAlpha(0.86 + Math.sin(this.animationElapsedMs / 220 + index) * 0.12);
      this.applyStoryRuntimeTexture(npc);
    }
  }

  private updateWorldEffects(): void {
    const pulse = (Math.sin(this.animationElapsedMs / 240) + 1) * 0.5;
    this.markerGraphics.clear();
    this.portalGraphics.clear();

    if (this.worldGateVisible) {
      const x = LUMEN_WORLD_GATE.interactX;
      const y = LUMEN_WORLD_GATE.interactY + 18;
      this.portalGraphics.fillStyle(0x1b73ff, 0.32 + pulse * 0.12);
      this.portalGraphics.fillEllipse(x, y, 104 + pulse * 9, 32 + pulse * 3);
      this.portalGraphics.fillStyle(0x70e8ff, 0.42 + pulse * 0.16);
      this.portalGraphics.fillEllipse(x, y, 72 + pulse * 7, 22 + pulse * 3);
      this.portalGraphics.lineStyle(2, 0xd9fbff, 0.64 + pulse * 0.2);
      this.portalGraphics.strokeEllipse(x, y, 114 + pulse * 8, 36 + pulse * 3);
      this.portalGraphics.lineStyle(2, 0x67b9ff, 0.5 + pulse * 0.18);
      this.portalGraphics.strokeEllipse(x, y - 3, 82 + pulse * 6, 26 + pulse * 3);

      for (let index = 0; index < 5; index += 1) {
        const angle = this.animationElapsedMs / 360 + index * 1.047;
        const particleX = x + Math.cos(angle) * (34 + pulse * 5);
        const particleY = y - 11 + Math.sin(angle * 1.3) * 14;
        this.portalGraphics.fillStyle(index % 2 === 0 ? 0xcaf9ff : 0x68c7ff, 0.46 + pulse * 0.28);
        this.portalGraphics.fillCircle(particleX, particleY, 1.8 + pulse * 0.8);
      }
    }

    if (this.activeInteraction?.kind === 'shop') {
      this.markerGraphics.lineStyle(2, 0xffefb0, 0.28 + pulse * 0.16);
      this.markerGraphics.strokeCircle(this.activeInteraction.interactX, this.activeInteraction.interactY - 10, 14 + pulse * 7);
      this.markerGraphics.strokeCircle(this.activeInteraction.interactX, this.activeInteraction.interactY - 10, 24 + pulse * 4);
      this.markerGraphics.lineStyle(2, 0xffd67a, 0.3 + pulse * 0.2);
      this.markerGraphics.strokeEllipse(this.activeInteraction.interactX, this.activeInteraction.interactY + 2, 74 + pulse * 10, 26 + pulse * 4);
    }

    if (this.palaceGateEffect) {
      const baseWidth = this.palaceGateEffect.getData('baseWidth') as number;
      const baseHeight = this.palaceGateEffect.getData('baseHeight') as number;
      const factor = 0.94 + pulse * 0.1;
      this.palaceGateEffect
        .setAlpha(0.52 + pulse * 0.22)
        .setDisplaySize(baseWidth * factor, baseHeight * factor);
    }

    if (this.worldGateEffect) {
      const baseWidth = this.worldGateEffect.getData('baseWidth') as number;
      const baseHeight = this.worldGateEffect.getData('baseHeight') as number;
      const frameCount = this.worldGateEffect.getData('frameCount') as number | undefined;
      const factor = 0.96 + pulse * 0.12;
      if (frameCount && frameCount > 1) {
        this.worldGateEffect.setFrame(Math.floor(this.animationElapsedMs / 140) % frameCount);
      }
      this.worldGateEffect
        .setAlpha(0.22 + pulse * 0.14)
        .setDisplaySize(baseWidth * factor, baseHeight * factor);
    }

    for (const entrance of this.shopEntranceEffects) {
      const baseWidth = entrance.getData('baseWidth') as number;
      const baseHeight = entrance.getData('baseHeight') as number;
      const phase = entrance.getData('phase') as number;
      const localPulse = (Math.sin(this.animationElapsedMs / 260 + phase) + 1) * 0.5;
      const factor = 0.94 + localPulse * 0.08;
      entrance
        .setAlpha(0.42 + localPulse * 0.2)
        .setDisplaySize(baseWidth * factor, baseHeight * factor);
    }

    if (this.fountainWaterImage) {
      const baseWidth = this.fountainWaterImage.getData('baseWidth') as number;
      const baseHeight = this.fountainWaterImage.getData('baseHeight') as number;
      const factor = 0.98 + pulse * 0.04;
      this.fountainWaterImage
        .setAlpha(0.78 + pulse * 0.18)
        .setDisplaySize(baseWidth * factor, baseHeight * factor);
    }
  }

  private resolveInteraction(): void {
    const candidates: ActiveInteraction[] = [];
    this.refreshBlockedShopAutoEntry();
    this.refreshBlockedPalaceAutoEntry();
    this.refreshBlockedWorldGateAutoEntry();

    for (const building of LUMEN_BUILDINGS) {
      if (!this.visibleShopIds.has(building.id)) {
        continue;
      }
      if (distance(this.player.x, this.player.y, building.door.x, building.door.y) <= SHOP_INTERACT_RADIUS) {
        candidates.push({
          kind: 'shop',
          label: building.label,
          prompt: t(this, 'Walk into the warp to enter'),
          interactX: building.door.x,
          interactY: building.door.y,
          targetX: building.door.x,
          targetY: building.door.y - 46,
          shopId: building.id,
        });
      }
    }

    if (this.worldGateVisible && distance(this.player.x, this.player.y, LUMEN_WORLD_GATE.interactX, LUMEN_WORLD_GATE.interactY) <= SHOP_INTERACT_RADIUS) {
      const starterUnlocked = hasStarterCompanionUnlocked(this.snapshot);
      candidates.push({
        kind: 'gate',
        label: starterUnlocked ? t(this, 'Stage Gate') : t(this, 'Sealed Route Gate'),
        prompt: starterUnlocked ? t(this, 'Walk into the warp to enter') : t(this, 'Recruit Bram before leaving the village.'),
        interactX: LUMEN_WORLD_GATE.interactX,
        interactY: LUMEN_WORLD_GATE.interactY,
        targetX: LUMEN_WORLD_GATE.interactX,
        targetY: LUMEN_WORLD_GATE.interactY - 26,
      });
    }

    if (this.palaceEntranceVisible && distance(this.player.x, this.player.y, LUMEN_PALACE_GATE.interactX, LUMEN_PALACE_GATE.interactY) <= SHOP_INTERACT_RADIUS) {
      candidates.push({
        kind: 'palace',
        label: t(this, 'ui.palace', undefined, '궁궐'),
        prompt: t(this, 'ui.palace_enter_prompt', undefined, '빛기둥에 닿으면 궁궐로 들어갑니다'),
        interactX: LUMEN_PALACE_GATE.interactX,
        interactY: LUMEN_PALACE_GATE.interactY,
        targetX: LUMEN_PALACE_GATE.interactX,
        targetY: LUMEN_PALACE_GATE.interactY + 58,
      });
    }

    for (const npc of this.ambientNpcs) {
      if (distance(this.player.x, this.player.y, npc.position.x, npc.position.y) <= 78) {
        candidates.push({
          kind: 'npc',
          label: t(this, npc.definition.name),
          prompt: t(this, 'Tap to talk'),
          interactX: npc.position.x,
          interactY: npc.position.y,
          targetX: npc.position.x,
          targetY: npc.position.y - 54,
          npcId: npc.definition.id,
        });
      }
    }

    for (const npc of this.storyNpcs) {
      if (distance(this.player.x, this.player.y, npc.definition.position.x, npc.definition.position.y) <= 82) {
      candidates.push({
        kind: 'story_npc',
        label: t(this, npc.definition.name, undefined, npc.definition.name),
        prompt: npc.definition.id === 'bram_recruit' && !hasStarterCompanionUnlocked(this.snapshot)
          ? t(this, 'Tap to recruit Bram')
          : t(this, 'Tap to talk'),
          interactX: npc.definition.position.x,
          interactY: npc.definition.position.y,
          targetX: npc.definition.position.x,
          targetY: npc.definition.position.y - 56,
          npcId: npc.definition.id,
        });
      }
    }

    candidates.sort(
      (left, right) =>
        distance(this.player.x, this.player.y, left.interactX, left.interactY) -
        distance(this.player.x, this.player.y, right.interactX, right.interactY),
    );

    this.activeInteraction = candidates[0] ?? null;

    if (this.activeInteraction) {
      this.interactionMarker
        .setPosition(this.activeInteraction.targetX, this.activeInteraction.targetY)
        .setVisible(this.shouldShowInteractionMarker(this.activeInteraction));
      this.interactionText.setVisible(false);
    } else {
      this.interactionMarker.setVisible(false);
      this.interactionText.setVisible(false);
    }
  }

  private handlePointerInteract(pointer: Phaser.Input.Pointer): void {
    if (this.isPointerOnVirtualControls(pointer) || this.isPointerOnMenu(pointer)) {
      return;
    }

    if (this.npcDialogue?.isVisible()) {
      this.npcDialogue.advance();
      return;
    }

    this.triggerActiveInteraction();
  }

  private isPointerOnVirtualControls(pointer: Phaser.Input.Pointer): boolean {
    return pointer.x <= 150 && pointer.y >= this.scale.height - 150;
  }

  private isPointerOnMenu(pointer: Phaser.Input.Pointer): boolean {
    return this.menuPanel?.visible === true && pointer.x >= this.scale.width - 260 && pointer.y <= 420;
  }

  private triggerActiveInteraction(): void {
    if (!this.activeInteraction) {
      return;
    }

    switch (this.activeInteraction.kind) {
      case 'gate':
      case 'palace':
      case 'shop':
        return;
      case 'npc': {
        const npc = this.ambientNpcs.find((entry) => entry.definition.id === this.activeInteraction?.npcId);
        if (npc) {
          this.showNpcDialogue(npc.definition.id, npc.definition.name, npc.definition.greeting);
        }
        break;
      }
      case 'story_npc':
        if (this.activeInteraction.npcId) {
          this.handleStoryNpcInteraction(this.activeInteraction.npcId);
        }
        break;
    }
  }

  private refreshRecoveryState(): void {
    const now = Date.now();
    const recovered = recoverFatigue(this.snapshot, now);

    if (recovered !== this.snapshot) {
      this.snapshot = recovered;
      saveSnapshot(this.snapshot);
    }
  }

  private refreshHud(): void {
    const fatigue = this.snapshot.profile.fatigue;
    const maxFatigue = this.snapshot.profile.maxFatigue;
    const fatigueRatio = Phaser.Math.Clamp(fatigue / Math.max(1, maxFatigue), 0, 1);
    const fatigueColor = fatigue < FATIGUE_COST_PER_STAGE ? 0xff8f72 : 0x6fc4ff;
    this.fatigueHudFill.setFillStyle(fatigueColor, 0.94).setDisplaySize(Math.max(2, 176 * fatigueRatio), 5);
    this.fatigueHudText.setText(`피로도 ${fatigue}/${maxFatigue}  전투 -${FATIGUE_COST_PER_STAGE}`);

    this.infoText.setText([
      `Pos ${this.player.x.toFixed(0)}, ${this.player.y.toFixed(0)}`,
      `${t(this, 'ui.fatigue')} ${fatigue}/${maxFatigue}`,
      `${t(this, 'ui.gold')} ${this.snapshot.profile.gold} | ${t(this, 'ui.gems')} ${this.snapshot.profile.premiumCurrency}`,
      `${t(this, 'ui.hero_stone')} ${this.snapshot.profile.heroStones}`,
      t(this, 'ui.party_power', { power: calculatePartyPower(this.snapshot) }),
    ]);

    const statusLines = [
      t(this, 'ui.touch_move_hint', undefined, '하단 방향키를 터치하거나 드래그해 이동합니다'),
      t(this, 'Walk into a shop doorway to enter'),
      `피로도 회복: 메뉴 > 광고 +${AD_REWARD_FATIGUE}`,
      t(this, 'P/E/G/H/O: party / gear / gacha / home / options'),
    ];

    if (!hasStarterCompanionUnlocked(this.snapshot)) {
      statusLines.unshift('Route gate sealed: recruit Bram in the starter square first.');
    }

    if (this.activeInteraction) {
      statusLines.unshift(t(this, 'Nearby: {label}', { label: this.activeInteraction.label }));
    }

    if (this.fallbackReadyAt !== null) {
      const remainingMs = this.fallbackReadyAt - Date.now();
      statusLines.push(
        remainingMs <= 0
          ? t(this, 'ui.fallback_ready', { amount: AD_FALLBACK_FATIGUE })
          : t(this, 'ui.fallback_in_seconds', { seconds: Math.ceil(remainingMs / 1000) }),
      );
    }

    this.statusText.setText(statusLines.join('\n'));

    const showDialogue = this.dialogueExpiresAt > this.time.now && this.dialogueText.text.length > 0;
    this.dialogueText.setVisible(showDialogue);
  }

  private async claimFatigueReward(): Promise<void> {
    if (this.rewardBusy) {
      return;
    }

    this.rewardBusy = true;
    this.showDialogue(t(this, 'ui.reward_route_preparing'));

    try {
      const rewarded = await showRewardedFatigueAd();

      if (!rewarded.granted) {
        this.fallbackReadyAt = Date.now() + 15000;
        this.showDialogue(t(this, 'ui.reward_not_granted'));
        return;
      }

      this.fallbackReadyAt = null;
      this.snapshot = claimAdReward(this.snapshot, Date.now());
      saveSnapshot(this.snapshot);
      this.refreshHud();
      this.showDialogue(t(this, 'ui.reward_granted_fatigue', { amount: rewarded.amount }));
    } catch {
      this.fallbackReadyAt = Date.now() + 15000;
      this.showDialogue(t(this, 'ui.reward_route_failed'));
    } finally {
      this.rewardBusy = false;
    }
  }

  private claimFallbackReward(): void {
    if (this.fallbackReadyAt === null) {
      this.showDialogue(t(this, 'ui.fallback_only_after_failure'));
      return;
    }

    const remainingMs = this.fallbackReadyAt - Date.now();
    if (remainingMs > 0) {
      this.showDialogue(t(this, 'ui.fallback_unlocks_in_seconds', { seconds: Math.ceil(remainingMs / 1000) }));
      return;
    }

    this.snapshot = claimAdFallbackReward(this.snapshot, Date.now());
    saveSnapshot(this.snapshot);
    this.fallbackReadyAt = null;
    this.showDialogue(t(this, 'ui.fallback_granted', { amount: AD_FALLBACK_FATIGUE }));
  }

  private openLinkedScene(sceneKey: string): void {
    setVillageReturn(this, { x: this.player.x, y: this.player.y });
    this.scene.start(sceneKey);
  }

  private openWorldMap(): void {
    if (!hasStarterCompanionUnlocked(this.snapshot)) {
      this.showStoryDialogueSequence([
        this.makeNpcLine('elder_haru', 'The route does not open for a lone blade. Speak with Bram first.'),
        this.makeNpcLine('bram_recruit', 'I join you, then the gate opens. Until then, the village keeps you here.'),
      ]);
      return;
    }

    const firstUnlocked = this.snapshot.world.unlockedContinents.find((entry) => entry.startsWith('continent_'));
    setVillageReturn(this, { spawnId: 'world_gate_return' });
    setSelectedContinent(this, firstUnlocked ?? 'continent_01');
    this.scene.start('world-map');
  }

  private openPalace(): void {
    this.scene.start('palace');
  }

  private playArrivalStoryIfNeeded(): void {
    if (hasStarterCompanionUnlocked(this.snapshot) || hasStoryFlag(this.snapshot, STORY_FLAG_VILLAGE_MAYOR_INTRO_SEEN)) {
      return;
    }

    this.showStoryDialogueSequence(
      [
        this.makeNpcLine('elder_haru', 'Kain, the outer route is unstable again. I cannot let you leave alone.'),
        this.makeNpcLine('elder_haru', 'Lumen needs the road reopened, but it also needs someone to come back after trying.'),
        this.makeNpcLine('bram_recruit', 'Then send me with him. The gate holds better when the front line has a shield.'),
        this.makeHeroLine('All right. I speak with Bram, we form the first squad, and then we move.'),
      ],
      () => {
        this.snapshot = markStoryFlag(this.snapshot, STORY_FLAG_VILLAGE_MAYOR_INTRO_SEEN, Date.now());
        saveSnapshot(this.snapshot);
      },
    );
  }

  private handleStoryNpcInteraction(npcId: string): void {
    const unlockedContinents = this.getUnlockedContinentCount();

    switch (npcId) {
      case 'elder_haru':
        if (!hasStarterCompanionUnlocked(this.snapshot)) {
          this.showStoryDialogueSequence(
            [
              this.makeNpcLine('elder_haru', 'The first sortie is not a test of courage. It is a test of whether the village can spare you.'),
              this.makeNpcLine('elder_haru', 'Take Bram with you. If the route opens, Lumen starts breathing again.'),
            ],
            () => {
              this.snapshot = markStoryFlag(this.snapshot, STORY_FLAG_VILLAGE_MAYOR_INTRO_SEEN, Date.now());
              saveSnapshot(this.snapshot);
            },
          );
          return;
        }

        this.showStoryDialogueSequence([
          this.makeNpcLine(
            'elder_haru',
            unlockedContinents >= 4
              ? 'Every road you reclaim changes how this town wakes up in the morning. People are planning ahead again.'
              : unlockedContinents >= 2
                ? 'The village sounds less frightened after each route you clear. Keep that rhythm going.'
                : 'One open road can keep a town alive. Do not underestimate what the first victory already bought us.',
          ),
        ]);
        return;
      case 'bram_recruit':
        if (!hasStarterCompanionUnlocked(this.snapshot)) {
          this.showStoryDialogueSequence(
            [
              this.makeNpcLine('bram_recruit', 'You take point, I take the hit that would stop you. Simple enough.'),
              this.makeHeroLine('Then you are with me from this step onward.'),
              this.makeNpcLine('bram_recruit', 'Good. Open the gate. Lumen needs a squad, not a martyr.'),
            ],
            () => {
              const now = Date.now();
              let next = unlockStarterCompanion(this.snapshot, now);
              next = markStoryFlag(next, STORY_FLAG_VILLAGE_MAYOR_INTRO_SEEN, now);
              this.snapshot = next;
              saveSnapshot(this.snapshot);
              this.removeStoryNpc('bram_recruit');
              this.playCharacterJoinEffect('bram', '브람');
              this.showDialogue(t(this, 'Bram joined the party. The route gate is now open.'));
            },
          );
          return;
        }

        this.showStoryDialogueSequence([
          this.makeNpcLine(
            'bram_recruit',
            unlockedContinents >= 3
              ? 'The squad is bigger now, but my job is still the same. Hold the line until the route stays open.'
              : 'Once the gate opens, hesitation is more dangerous than the first blow. Keep moving.',
          ),
        ]);
        return;
      case 'quartermaster_dina':
        if (unlockedContinents >= 2 && !hasStoryFlag(this.snapshot, STORY_FLAG_VILLAGE_SUPPLY_EVENT)) {
          this.showStoryDialogueSequence(
            [
              this.makeNpcLine('quartermaster_dina', 'Two routes are stable enough for wagons now. That means medicine reaches the lower ward by dawn.'),
              this.makeNpcLine('quartermaster_dina', 'Clearing stages is one thing. Watching the town change because of it is another.'),
            ],
            () => {
              this.snapshot = markStoryFlag(this.snapshot, STORY_FLAG_VILLAGE_SUPPLY_EVENT, Date.now());
              saveSnapshot(this.snapshot);
            },
          );
          return;
        }
        this.showStoryDialogueSequence([
          this.makeNpcLine(
            'quartermaster_dina',
            unlockedContinents >= 4
              ? 'I am routing food, steel, and letters along roads that were dead a week ago.'
              : 'The moment a road clears, I start deciding which wagon line gets the miracle first.',
          ),
        ]);
        return;
      case 'scribe_len':
        if (unlockedContinents >= 4 && !hasStoryFlag(this.snapshot, STORY_FLAG_VILLAGE_ARCHIVE_EVENT)) {
          this.showStoryDialogueSequence(
            [
              this.makeNpcLine('scribe_len', 'The route logs are starting to match old archive warnings. That is worse than a rumor.'),
              this.makeNpcLine('scribe_len', 'If the fragments are echoing through the roads, the palace archives may know why.'),
            ],
            () => {
              this.snapshot = markStoryFlag(this.snapshot, STORY_FLAG_VILLAGE_ARCHIVE_EVENT, Date.now());
              saveSnapshot(this.snapshot);
            },
          );
          return;
        }
        this.showStoryDialogueSequence([
          this.makeNpcLine(
            'scribe_len',
            unlockedContinents >= 2
              ? 'I am pinning every route report to the same ledger now. Patterns show up faster than panic that way.'
              : 'I write down names before I write down numbers. A town remembers losses in that order.',
          ),
        ]);
        return;
      case 'captain_ysold':
        if (unlockedContinents >= 3 && !hasStoryFlag(this.snapshot, STORY_FLAG_VILLAGE_HARBOR_EVENT)) {
          this.showStoryDialogueSequence(
            [
              this.makeNpcLine('captain_ysold', 'The harbor side started moving the moment the third route settled. That means the war is widening.'),
              this.makeNpcLine('captain_ysold', 'Expect the palace to lean harder on you now. Everyone can see the map changing.'),
            ],
            () => {
              this.snapshot = markStoryFlag(this.snapshot, STORY_FLAG_VILLAGE_HARBOR_EVENT, Date.now());
              saveSnapshot(this.snapshot);
            },
          );
          return;
        }
        this.showStoryDialogueSequence([
          this.makeNpcLine(
            'captain_ysold',
            unlockedContinents >= 5
              ? 'You are no longer just clearing roads. You are changing how the palace allocates soldiers.'
              : 'Every route you open pushes the palace to react. That is why I keep watching both maps at once.',
          ),
        ]);
        return;
      default: {
        const npc = this.storyNpcs.find((entry) => entry.definition.id === npcId);
        if (npc) {
          this.showStoryDialogueSequence([this.makeNpcLine(npcId, npc.definition.greeting)]);
        }
      }
    }
  }

  private getUnlockedContinentCount(): number {
    return this.snapshot.world.unlockedContinents.filter((entry) => entry.startsWith('continent_')).length;
  }

  private showStoryDialogueSequence(lines: { speaker: { category: 'npc' | 'character'; subjectId: string; name: string }; text: string }[], onComplete?: () => void): void {
    this.npcDialogue.showSequence(lines, onComplete);
  }

  private makeNpcLine(npcId: string, text: string) {
    const storyNpc = this.storyNpcs.find((entry) => entry.definition.id === npcId);
    const ambientNpc = this.ambientNpcs.find((entry) => entry.definition.id === npcId);
    return {
      speaker: {
        category: 'npc' as const,
        subjectId: npcId,
        name: storyNpc?.definition.name ?? ambientNpc?.definition.name ?? npcId,
      },
      text,
    };
  }

  private makeHeroLine(text: string) {
    return {
      speaker: {
        category: 'character' as const,
        subjectId: 'hero',
        name: 'Kain',
      },
      text,
    };
  }

  private applyHeroRuntimeTexture(): void {
    const clip = this.getHeroRuntimeClip();

    if (!clip || !this.textures.exists(clip.textureKey)) {
      this.hero
        .setTexture(ATLAS_KEY, AtlasFrame.Hero)
        .setDisplaySize(44, 44)
        .setFlipX(this.heroFacing < 0);
      return;
    }

    const frameIndex = getRuntimeClipFrameIndex(clip, this.animationElapsedMs);
    const scale = 82 / clip.frameHeight;
    this.hero
      .setTexture(clip.textureKey, frameIndex)
      .setDisplaySize(Math.round(clip.frameWidth * scale), Math.round(clip.frameHeight * scale))
      .setFlipX(this.heroFacing < 0);
  }

  private getHeroRuntimeClip(): RuntimeAnimationClipEntry | null {
    if (this.player.moving) {
      return (
        getRuntimeAnimationClip(this, 'character', 'hero', 'walk') ??
        getRuntimeAnimationClip(this, 'character', 'hero', 'run') ??
        getRuntimeAnimationClip(this, 'character', 'hero', 'town_idle') ??
        null
      );
    }

    return (
      getRuntimeAnimationClip(this, 'character', 'hero', 'town_idle') ??
      getRuntimeAnimationClip(this, 'character', 'hero', 'idle') ??
      null
    );
  }

  private getTownNpcRuntimeClip(subjectId: string, moving: boolean): RuntimeAnimationClipEntry | null {
    const preferredClipIds = moving
      ? ['patrol_walk', 'walk', 'idle', 'talk']
      : ['talk', 'idle', 'counter_stand', 'walk', 'patrol_walk'];

    for (const clipId of preferredClipIds) {
      const clip = getRuntimeAnimationClip(this, 'npc', subjectId, clipId);
      if (clip) {
        return clip;
      }
    }

    return null;
  }

  private applyAmbientRuntimeTexture(npc: AmbientNpcRuntime, moving: boolean): void {
    const clip = this.getTownNpcRuntimeClip(npc.definition.runtimeSubjectId ?? npc.definition.id, moving);

    if (!clip || !this.textures.exists(clip.textureKey)) {
      npc.sprite.setFlipX(npc.facing < 0);
      return;
    }

    const frameIndex = getRuntimeClipFrameIndex(clip, this.animationElapsedMs);
    const scale = this.getAmbientNpcDisplayHeight(npc.definition) / clip.frameHeight;
    npc.sprite
      .setTexture(clip.textureKey, frameIndex)
      .setDisplaySize(Math.round(clip.frameWidth * scale), Math.round(clip.frameHeight * scale))
      .setFlipX(npc.facing < 0);
  }

  private applyStoryRuntimeTexture(npc: StoryNpcRuntime): void {
    const clip = this.getTownNpcRuntimeClip(npc.definition.runtimeSubjectId, false);

    if (!clip || !this.textures.exists(clip.textureKey)) {
      npc.sprite.setFlipX(npc.facing < 0);
      return;
    }

    const frameIndex = getRuntimeClipFrameIndex(clip, this.animationElapsedMs);
    const scale = this.getStoryNpcDisplayHeight(npc.definition) / clip.frameHeight;
    npc.sprite
      .setTexture(clip.textureKey, frameIndex)
      .setDisplaySize(Math.round(clip.frameWidth * scale), Math.round(clip.frameHeight * scale))
      .setFlipX(npc.facing < 0);
  }

  private fillTileRect(
    bounds: { x: number; y: number; width: number; height: number },
    frame: number,
    tint: number,
    depth?: number,
  ): void {
    const startX = bounds.x + 32;
    const startY = bounds.y + 32;
    const cols = Math.ceil(bounds.width / 64);
    const rows = Math.ceil(bounds.height / 64);

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const tile = this.add
          .image(startX + col * 64, startY + row * 64, ATLAS_KEY, frame)
          .setDisplaySize(64, 64)
          .setTint((row + col) % 2 === 0 ? tint : Phaser.Display.Color.ValueToColor(tint).darken(8).color);
        if (typeof depth === 'number') {
          tile.setDepth(depth);
        }
      }
    }
  }

  private fillRuntimeTileRect(bounds: { x: number; y: number; width: number; height: number }, tileKeys: readonly string[], depth: number): void {
    const startX = bounds.x + 32;
    const startY = bounds.y + 32;
    const cols = Math.ceil(bounds.width / 64);
    const rows = Math.ceil(bounds.height / 64);

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const key = tileKeys[Math.abs((row * 5 + col * 7 + row * col) % tileKeys.length)];
        this.add.image(startX + col * 64, startY + row * 64, key)
          .setDisplaySize(64, 64)
          .setDepth(depth);
      }
    }
  }

  private fillRuntimeTileRectWithResolver(
    bounds: { x: number; y: number; width: number; height: number },
    depth: number,
    resolveKey: (row: number, col: number, rows: number, cols: number) => string | null,
  ): void {
    const startX = bounds.x + 32;
    const startY = bounds.y + 32;
    const cols = Math.ceil(bounds.width / 64);
    const rows = Math.ceil(bounds.height / 64);

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const key = resolveKey(row, col, rows, cols);
        if (!key || !this.textures.exists(key)) {
          continue;
        }
        this.add.image(startX + col * 64, startY + row * 64, key)
          .setDisplaySize(64, 64)
          .setDepth(depth);
      }
    }
  }

  private getAmbientNpcDisplayHeight(definition: TownAmbientNpcDefinition): number {
    const subjectId = definition.runtimeSubjectId ?? definition.id;
    if (subjectId.includes('child')) {
      return 58;
    }
    if (subjectId.includes('guard') || subjectId.includes('captain')) {
      return 74;
    }
    if (subjectId.includes('runner') || subjectId.includes('courier')) {
      return 68;
    }
    return 70;
  }

  private getStoryNpcDisplayHeight(definition: TownStoryNpcDefinition): number {
    const subjectId = definition.runtimeSubjectId;
    if (subjectId.includes('elder') || subjectId.includes('quartermaster')) {
      return 76;
    }
    if (subjectId.includes('captain')) {
      return 78;
    }
    return 74;
  }

  private pinHud<T extends Phaser.GameObjects.GameObject>(gameObject: T, depth: number): T {
    const applyPin = (entry: Phaser.GameObjects.GameObject) => {
      const withScroll = entry as Phaser.GameObjects.GameObject & { setScrollFactor?: (x?: number, y?: number) => unknown };
      const withDepth = entry as Phaser.GameObjects.GameObject & { setDepth?: (value: number) => unknown };
      if (typeof withScroll.setScrollFactor === 'function') {
        withScroll.setScrollFactor(0, 0);
      }
      if (typeof withDepth.setDepth === 'function') {
        withDepth.setDepth(depth);
      }
    };

    applyPin(gameObject);

    if (gameObject instanceof Phaser.GameObjects.Container) {
      gameObject.list.forEach((child) => applyPin(child));
    }

    return gameObject;
  }

  private showDialogue(text: string): void {
    this.dialogueText.setText(text);
    this.dialogueExpiresAt = this.time.now + 4200;
    this.dialogueText.setVisible(true);
  }

  private showNpcDialogue(npcId: string, name: string, greeting: string): void {
    this.npcDialogue.showTimed(
      {
        speaker: {
          category: 'npc',
          subjectId: npcId,
          name: t(this, name, undefined, name),
        },
        text: t(this, greeting, undefined, greeting),
      },
      4200,
    );
  }

  private primeBlockedShopAutoEntry(): void {
    for (const building of LUMEN_BUILDINGS) {
      if (!this.visibleShopIds.has(building.id)) {
        continue;
      }
      if (distance(this.player.x, this.player.y, building.door.x, building.door.y) <= SHOP_AUTO_ENTER_RADIUS) {
        this.blockedShopAutoEnterIds.add(building.id);
      }
    }
  }

  private primeBlockedPalaceAutoEntry(): void {
    if (!this.palaceEntranceVisible) {
      this.blockedPalaceAutoEnter = false;
      return;
    }
    this.blockedPalaceAutoEnter =
      distance(this.player.x, this.player.y, LUMEN_PALACE_GATE.interactX, LUMEN_PALACE_GATE.interactY) <= SHOP_AUTO_ENTER_RADIUS;
  }

  private primeBlockedWorldGateAutoEntry(): void {
    if (!this.worldGateVisible) {
      this.blockedWorldGateAutoEnter = false;
      return;
    }
    this.blockedWorldGateAutoEnter =
      distance(this.player.x, this.player.y, LUMEN_WORLD_GATE.interactX, LUMEN_WORLD_GATE.interactY) <= SHOP_AUTO_ENTER_RADIUS;
  }

  private refreshBlockedShopAutoEntry(): void {
    for (const building of LUMEN_BUILDINGS) {
      if (!this.visibleShopIds.has(building.id)) {
        this.blockedShopAutoEnterIds.delete(building.id);
        continue;
      }
      if (distance(this.player.x, this.player.y, building.door.x, building.door.y) > SHOP_AUTO_ENTER_REARM_RADIUS) {
        this.blockedShopAutoEnterIds.delete(building.id);
      }
    }
  }

  private refreshBlockedPalaceAutoEntry(): void {
    if (!this.palaceEntranceVisible) {
      this.blockedPalaceAutoEnter = false;
      return;
    }
    if (distance(this.player.x, this.player.y, LUMEN_PALACE_GATE.interactX, LUMEN_PALACE_GATE.interactY) > SHOP_AUTO_ENTER_REARM_RADIUS) {
      this.blockedPalaceAutoEnter = false;
    }
  }

  private refreshBlockedWorldGateAutoEntry(): void {
    if (!this.worldGateVisible) {
      this.blockedWorldGateAutoEnter = false;
      return;
    }
    if (distance(this.player.x, this.player.y, LUMEN_WORLD_GATE.interactX, LUMEN_WORLD_GATE.interactY) > SHOP_AUTO_ENTER_REARM_RADIUS) {
      this.blockedWorldGateAutoEnter = false;
    }
  }

  private handleAutoShopEntry(): void {
    if (!this.activeInteraction || this.activeInteraction.kind !== 'shop' || !this.activeInteraction.shopId) {
      return;
    }

    const shopId = this.activeInteraction.shopId;
    if (this.blockedShopAutoEnterIds.has(shopId)) {
      return;
    }

    if (distance(this.player.x, this.player.y, this.activeInteraction.interactX, this.activeInteraction.interactY) > SHOP_AUTO_ENTER_RADIUS) {
      return;
    }

    this.blockedShopAutoEnterIds.add(shopId);
    setVillageReturn(this, { spawnId: shopId });
    this.scene.start('town-interior', { shopId });
  }

  private handleAutoPalaceEntry(): void {
    if (!this.activeInteraction || this.activeInteraction.kind !== 'palace') {
      return;
    }

    if (this.blockedPalaceAutoEnter) {
      return;
    }

    if (distance(this.player.x, this.player.y, this.activeInteraction.interactX, this.activeInteraction.interactY) > SHOP_AUTO_ENTER_RADIUS) {
      return;
    }

    this.blockedPalaceAutoEnter = true;
    this.openPalace();
  }

  private handleAutoWorldGateEntry(): void {
    if (!this.activeInteraction || this.activeInteraction.kind !== 'gate') {
      return;
    }

    if (!hasStarterCompanionUnlocked(this.snapshot) || this.blockedWorldGateAutoEnter) {
      return;
    }

    if (distance(this.player.x, this.player.y, this.activeInteraction.interactX, this.activeInteraction.interactY) > SHOP_AUTO_ENTER_RADIUS) {
      return;
    }

    this.blockedWorldGateAutoEnter = true;
    this.openWorldMap();
  }
}

function setImageToHeight(image: Phaser.GameObjects.Image, displayHeight: number): void {
  image.setDisplaySize(Math.round((image.width / image.height) * displayHeight), displayHeight);
}

function setImageToWidth(image: Phaser.GameObjects.Image, displayWidth: number): void {
  image.setDisplaySize(displayWidth, Math.round((image.height / image.width) * displayWidth));
}

function setImageToWidthWithHeightCap(image: Phaser.GameObjects.Image, displayWidth: number, maxHeight: number): void {
  setImageToWidth(image, displayWidth);
  if (image.displayHeight > maxHeight) {
    image.setDisplaySize(displayWidth, maxHeight);
  }
}

function fitImageWithin(image: Phaser.GameObjects.Image, maxWidth: number, maxHeight: number): void {
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
  image.setDisplaySize(Math.round(image.width * scale), Math.round(image.height * scale));
}

function drawPalaceWallTiles(scene: Phaser.Scene, startX: number, endX: number, y: number, depth: number): void {
  for (let x = startX; x <= endX; x += 64) {
    scene.add.image(x + 32, y + 32, TOWN_RUNTIME_IMAGE_KEYS.wallHorizontalTile)
      .setDisplaySize(64, 64)
      .setTint(0xd9e8ff)
      .setDepth(depth);
  }
}

function depthForBottom(bottomY: number): number {
  return Math.round(bottomY * DEPTH_SCALE);
}

function getRuntimeClipFrameIndex(clip: RuntimeAnimationClipEntry, elapsedMs: number): number {
  const fps = clip.fps ?? 8;
  const elapsedFrames = Math.max(0, Math.floor((elapsedMs / 1000) * fps));
  return clip.frameCount <= 1 ? 0 : elapsedFrames % clip.frameCount;
}

function distance(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(ax - bx, ay - by);
}

function circleIntersectsRect(cx: number, cy: number, radius: number, rect: { x: number; y: number; width: number; height: number }): boolean {
  const nearestX = Phaser.Math.Clamp(cx, rect.x, rect.x + rect.width);
  const nearestY = Phaser.Math.Clamp(cy, rect.y, rect.y + rect.height);
  const dx = cx - nearestX;
  const dy = cy - nearestY;
  return dx * dx + dy * dy < radius * radius;
}
