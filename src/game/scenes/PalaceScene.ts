import Phaser from 'phaser';
import { AtlasFrame, ATLAS_KEY } from '../data/atlas';
import { STORY_FLAG_PALACE_FIRST_AUDIENCE, hasStoryFlag, markStoryFlag } from '../data/storyFlags';
import {
  getPalaceArrivalLine,
  getPalaceDialogue,
  getPalaceNpc,
  getPalaceNpcFallbackName,
  getPalaceNpcRuntimeSubjectId,
  getPalaceStoryTier,
  LUMEN_PALACE_EXIT,
  LUMEN_PALACE_NPCS,
  LUMEN_PALACE_ROOM,
  type PalaceNpcDefinition,
} from '../data/palace';
import { PALACE_RUNTIME_IMAGE_KEYS } from '../data/palaceRuntimeArt';
import { TOWN_RUNTIME_IMAGE_KEYS } from '../data/townRuntimeArt';
import { getRuntimeAnimationClip, type RuntimeAnimationClipEntry } from '../data/runtimeAnimationAssets';
import { t } from '../services/i18n';
import { loadSnapshot, saveSnapshot } from '../services/save';
import { buildDebugState } from '../ui/debugHud';
import { DialogueOverlay } from '../ui/dialogueOverlay';
import { VirtualJoystick } from '../ui/virtualJoystick';
import type { DialogueLine, SaveSnapshot } from '../types';

interface PalaceNpcRuntime {
  definition: PalaceNpcDefinition;
  sprite: Phaser.GameObjects.Image;
  shadow: Phaser.GameObjects.Ellipse;
  talkMarker?: Phaser.GameObjects.Text;
  facing: -1 | 1;
}

interface PalaceInteraction {
  kind: 'npc' | 'exit';
  label: string;
  prompt: string;
  x: number;
  y: number;
  npcId?: string;
}

const PLAYER_RADIUS = 16;
const DEPTH_SCALE = 0.1;
const THRONE_DAIS = { x: 428, y: 132, width: 328, height: 132 };
const PALACE_EXIT_RADIUS = 58;
const CARPET_BOUNDS = { x: 492, y: 108, width: 200, height: 684 };

export class PalaceScene extends Phaser.Scene {
  private snapshot!: SaveSnapshot;
  private storyTier = 0;
  private player: { x: number; y: number; moving: boolean } = { x: LUMEN_PALACE_EXIT.x, y: 692, moving: false };
  private animationElapsedMs = 0;
  private hero!: Phaser.GameObjects.Image;
  private heroShadow!: Phaser.GameObjects.Ellipse;
  private heroFacing: -1 | 1 = 1;
  private palaceNpcs: PalaceNpcRuntime[] = [];
  private activeInteraction: PalaceInteraction | null = null;
  private statusText!: Phaser.GameObjects.Text;
  private interactionText!: Phaser.GameObjects.Text;
  private interactionMarker!: Phaser.GameObjects.Text;
  private markerGraphics!: Phaser.GameObjects.Graphics;
  private dialogueOverlay!: DialogueOverlay;
  private joystick!: VirtualJoystick;

  constructor() {
    super('palace');
  }

  create(): void {
    this.snapshot = loadSnapshot();
    this.storyTier = getPalaceStoryTier(this.snapshot.world.unlockedContinents);
    this.animationElapsedMs = 0;
    this.player = { x: LUMEN_PALACE_EXIT.x, y: 692, moving: false };
    this.heroFacing = 1;
    this.activeInteraction = null;

    this.drawPalace();
    this.createHero();
    this.createHud();
    this.dialogueOverlay = new DialogueOverlay(this, 1100);
    this.input.on('pointerup', this.handlePointerInteract, this);
    this.playArrivalEvent();

    this.cameras.main.setBounds(0, 0, LUMEN_PALACE_ROOM.width, LUMEN_PALACE_ROOM.height);
    this.cameras.main.startFollow(this.hero, true, 0.16, 0.16);
    this.cameras.main.setDeadzone(56, 84);
    this.cameras.main.roundPixels = true;

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.joystick.destroy();
      this.dialogueOverlay.destroy();
      this.input.off('pointerup', this.handlePointerInteract, this);
      this.palaceNpcs = [];
    });

    this.refreshHud();
  }

  update(_: number, delta: number): void {
    this.stepSimulation(delta);
  }

  public stepSimulation(deltaMs: number): void {
    this.animationElapsedMs += deltaMs;
    this.dialogueOverlay.update();

    if (this.handleDialoguePauseInput()) {
      this.resolveInteraction();
      this.updateNpcRuntimeTextures();
      this.updatePalaceEffects();
      this.refreshHud();
      return;
    }

    this.handleMovement(deltaMs);
    this.resolveInteraction();
    this.updateNpcRuntimeTextures();
    this.updatePalaceEffects();

    if (this.handleAutoExit()) {
      return;
    }

    this.refreshHud();
  }

  public renderGameToText(): string {
    return JSON.stringify(
      buildDebugState('palace', this.snapshot, {
        player: {
          x: Number(this.player.x.toFixed(1)),
          y: Number(this.player.y.toFixed(1)),
          moving: this.player.moving,
        },
        storyTier: this.storyTier,
        activeInteraction: this.activeInteraction,
        availableActions: ['talk', 'return_to_village'],
      }),
    );
  }

  private drawPalace(): void {
    this.cameras.main.setBackgroundColor('#171d24');

    const wallBand = 96;
    const sideBand = 108;
    const topDaisBounds = { x: 374, y: 108, width: 436, height: 124 };
    const throneStepBounds = { x: 438, y: 136, width: 308, height: 86 };

    const useHallBackdrop = false;
    if (useHallBackdrop) {
      const backdrop = this.add.image(LUMEN_PALACE_ROOM.width / 2, LUMEN_PALACE_ROOM.height / 2, PALACE_RUNTIME_IMAGE_KEYS.royalAudienceHall)
        .setOrigin(0.5)
        .setDepth(-8);
      const source = this.textures.get(PALACE_RUNTIME_IMAGE_KEYS.royalAudienceHall).getSourceImage() as {
        width?: number;
        height?: number;
      } | null;
      const sourceWidth = Math.max(1, source?.width ?? LUMEN_PALACE_ROOM.width);
      const sourceHeight = Math.max(1, source?.height ?? LUMEN_PALACE_ROOM.height);
      const scale = Math.max(LUMEN_PALACE_ROOM.width / sourceWidth, LUMEN_PALACE_ROOM.height / sourceHeight);
      backdrop.setScale(scale);
      this.add.rectangle(LUMEN_PALACE_ROOM.width / 2, LUMEN_PALACE_ROOM.height / 2, LUMEN_PALACE_ROOM.width, LUMEN_PALACE_ROOM.height, 0x071017, 0.16)
        .setDepth(-7);
      this.add.rectangle(LUMEN_PALACE_ROOM.width / 2, LUMEN_PALACE_ROOM.height - 74, LUMEN_PALACE_ROOM.width - 240, 86, 0x05070a, 0.16)
        .setDepth(-6.5)
        .setStrokeStyle(2, 0xe0c17a, 0.14);
    } else {
      if (this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.indoorWarmStoneTile)) {
      this.fillRuntimeTileRectWithResolver(
        { x: 0, y: 0, width: LUMEN_PALACE_ROOM.width, height: LUMEN_PALACE_ROOM.height },
        -6,
        (row, col, rows, cols) => {
          const border = row < 2 || col < 2 || row >= rows - 2 || col >= cols - 2;
          if (border && this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.indoorCleanBrickTile)) {
            return TOWN_RUNTIME_IMAGE_KEYS.indoorCleanBrickTile;
          }
          if (
            this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.indoorWornBrickTile) &&
            (row * 3 + col * 5) % 17 === 0 &&
            !border
          ) {
            return TOWN_RUNTIME_IMAGE_KEYS.indoorWornBrickTile;
          }
          return TOWN_RUNTIME_IMAGE_KEYS.indoorWarmStoneTile;
        },
      );
    } else {
      for (let y = 32; y < LUMEN_PALACE_ROOM.height; y += 64) {
        for (let x = 32; x < LUMEN_PALACE_ROOM.width; x += 64) {
          const tint = (Math.floor(x / 64) + Math.floor(y / 64)) % 2 === 0 ? 0xc7c1b3 : 0xb6aea1;
          this.add.image(x, y, ATLAS_KEY, AtlasFrame.StoneTile)
            .setDisplaySize(64, 64)
            .setTint(tint)
            .setDepth(-6);
        }
      }
    }

    if (this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.indoorCleanBrickTile)) {
      this.fillRuntimeTileRect({ x: 0, y: 0, width: LUMEN_PALACE_ROOM.width, height: wallBand }, [TOWN_RUNTIME_IMAGE_KEYS.indoorCleanBrickTile], -5);
      this.fillRuntimeTileRect({ x: 0, y: LUMEN_PALACE_ROOM.height - wallBand, width: LUMEN_PALACE_ROOM.width, height: wallBand }, [TOWN_RUNTIME_IMAGE_KEYS.indoorCleanBrickTile], -5);
      this.fillRuntimeTileRect({ x: 0, y: 0, width: sideBand, height: LUMEN_PALACE_ROOM.height }, [TOWN_RUNTIME_IMAGE_KEYS.indoorCleanBrickTile], -5);
      this.fillRuntimeTileRect({ x: LUMEN_PALACE_ROOM.width - sideBand, y: 0, width: sideBand, height: LUMEN_PALACE_ROOM.height }, [TOWN_RUNTIME_IMAGE_KEYS.indoorCleanBrickTile], -5);
    }

    this.add.rectangle(LUMEN_PALACE_ROOM.width / 2, wallBand + 10, LUMEN_PALACE_ROOM.width - sideBand * 2 - 28, 8, 0x8a744f, 0.76)
      .setDepth(-4);
    this.add.rectangle(LUMEN_PALACE_ROOM.width / 2, LUMEN_PALACE_ROOM.height - wallBand - 10, LUMEN_PALACE_ROOM.width - sideBand * 2 - 28, 8, 0x8a744f, 0.56)
      .setDepth(-4);

    const carpetCenterX = CARPET_BOUNDS.x + CARPET_BOUNDS.width / 2;
    const carpetCenterY = CARPET_BOUNDS.y + CARPET_BOUNDS.height / 2;
    this.drawCenterCarpet(carpetCenterX, carpetCenterY);

    if (this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.indoorWornBrickTile)) {
      this.fillRuntimeTileRect(topDaisBounds, [TOWN_RUNTIME_IMAGE_KEYS.indoorWornBrickTile], 11);
      this.fillRuntimeTileRect(throneStepBounds, [TOWN_RUNTIME_IMAGE_KEYS.indoorWarmStoneTile], 12);
    } else {
      this.add.rectangle(
        topDaisBounds.x + topDaisBounds.width / 2,
        topDaisBounds.y + topDaisBounds.height / 2,
        topDaisBounds.width,
        topDaisBounds.height,
        0x6f6356,
        0.98,
      ).setDepth(11).setStrokeStyle(3, 0xd3b87e, 0.42);
      this.add.rectangle(
        throneStepBounds.x + throneStepBounds.width / 2,
        throneStepBounds.y + throneStepBounds.height / 2,
        throneStepBounds.width,
        throneStepBounds.height,
        0x85796b,
        0.98,
      ).setDepth(12).setStrokeStyle(3, 0xe7c98c, 0.34);
    }

    for (const x of [188, 300, 884, 996]) {
      this.add.rectangle(x, 232, 36, 220, 0xd9c2a0)
        .setDepth(12)
        .setStrokeStyle(2, 0x534335, 0.38);
      this.add.rectangle(x, 114, 50, 22, 0xf2dec0).setDepth(13);
    }

    if (this.textures.exists(PALACE_RUNTIME_IMAGE_KEYS.decorBannerBlue)) {
      const leftBanner = this.add.image(260, 176, PALACE_RUNTIME_IMAGE_KEYS.decorBannerBlue)
        .setOrigin(0.5, 0.5)
        .setDepth(12);
      setImageToHeight(leftBanner, 132);
    } else {
      this.add.rectangle(260, 174, 74, 144, 0x24436e, 0.96)
        .setDepth(11)
        .setStrokeStyle(2, 0xe0c17a, 0.42);
      this.add.rectangle(260, 228, 30, 78, 0xe0c17a, 0.84).setDepth(12);
    }

    if (this.textures.exists(PALACE_RUNTIME_IMAGE_KEYS.decorBannerWhite)) {
      const rightBanner = this.add.image(924, 176, PALACE_RUNTIME_IMAGE_KEYS.decorBannerWhite)
        .setOrigin(0.5, 0.5)
        .setDepth(12);
      setImageToHeight(rightBanner, 132);
    } else {
      this.add.rectangle(924, 174, 74, 144, 0x24436e, 0.96)
        .setDepth(11)
        .setStrokeStyle(2, 0xe0c17a, 0.42);
      this.add.rectangle(924, 228, 30, 78, 0xe0c17a, 0.84).setDepth(12);
    }

    this.add.rectangle(592, 164, 188, 66, 0x6b2a37)
      .setDepth(13)
      .setStrokeStyle(3, 0xe2ca95, 0.38);
    this.add.rectangle(592, 136, 96, 56, 0x8d3345)
      .setDepth(14)
      .setStrokeStyle(3, 0xf0d9ad, 0.38);

    if (this.textures.exists(PALACE_RUNTIME_IMAGE_KEYS.thronePlatform)) {
      this.add.image(592, 198, PALACE_RUNTIME_IMAGE_KEYS.thronePlatform)
        .setOrigin(0.5, 1)
        .setDisplaySize(420, 272)
        .setDepth(15);
    }

    if (this.textures.exists(PALACE_RUNTIME_IMAGE_KEYS.decorTorchBowl)) {
      for (const [x, y, height] of [
        [146, 334, 96],
        [1038, 334, 96],
        [146, 706, 92],
        [1038, 706, 92],
      ] as Array<[number, number, number]>) {
        const prop = this.add.image(x, y, PALACE_RUNTIME_IMAGE_KEYS.decorTorchBowl).setOrigin(0.5, 1).setDepth(depthForBottom(y));
        setImageToHeight(prop, height);
      }
    } else if (this.textures.exists(TOWN_RUNTIME_IMAGE_KEYS.lampPost)) {
      for (const [x, y, height] of [
        [146, 334, 120],
        [1038, 334, 120],
        [146, 706, 116],
        [1038, 706, 116],
      ] as Array<[number, number, number]>) {
        const prop = this.add.image(x, y, TOWN_RUNTIME_IMAGE_KEYS.lampPost).setOrigin(0.5, 1).setDepth(depthForBottom(y));
        setImageToHeight(prop, height);
      }
    }

    if (this.textures.exists(PALACE_RUNTIME_IMAGE_KEYS.decorBench)) {
      for (const [x, y, height, flipX] of [
        [202, 620, 54, false],
        [982, 620, 54, true],
      ] as Array<[number, number, number, boolean]>) {
        const prop = this.add.image(x, y, PALACE_RUNTIME_IMAGE_KEYS.decorBench).setOrigin(0.5, 1).setDepth(depthForBottom(y));
        prop.setFlipX(flipX);
        setImageToHeight(prop, height);
      }
    }
    }

    this.add.text(592, 66, t(this, 'ui.palace_hall', undefined, 'Lumen Palace / Audience Hall'), {
      fontFamily: 'Segoe UI',
      fontSize: '18px',
      color: '#fff0c9',
      stroke: '#241814',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(30);

    this.add.text(LUMEN_PALACE_EXIT.x, LUMEN_PALACE_EXIT.y + 18, t(this, 'ui.palace_exit_label', undefined, 'Return to Village'), {
      fontFamily: 'Segoe UI',
      fontSize: '13px',
      color: '#f1e2bb',
      stroke: '#261913',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(30);

    this.palaceNpcs = LUMEN_PALACE_NPCS.map((definition) => {
      const depth = depthForBottom(definition.y);
      const shadow = this.add.ellipse(definition.x, definition.y - 4, 24, 10, 0x111111, 0.28).setDepth(depth - 0.4);
      const runtimeClip = this.getPalaceNpcRuntimeClip(definition);
      const fallbackKey = this.getPalaceNpcFallbackTextureKey(definition.id);
      const sprite = runtimeClip && this.textures.exists(runtimeClip.textureKey)
        ? this.add.image(definition.x, definition.y, runtimeClip.textureKey, 0).setOrigin(0.5, 1).setDepth(depth)
        : fallbackKey && this.textures.exists(fallbackKey)
          ? this.add.image(definition.x, definition.y, fallbackKey).setOrigin(0.5, 1).setDepth(depth)
          : this.add.image(definition.x, definition.y, ATLAS_KEY, AtlasFrame.Hero).setDisplaySize(46, 46).setOrigin(0.5, 1).setDepth(depth);

      const displaySize = this.getPalaceNpcDisplaySize(definition.id);
      if (runtimeClip && this.textures.exists(runtimeClip.textureKey)) {
        const scale = displaySize / runtimeClip.frameHeight;
        sprite.setDisplaySize(Math.round(runtimeClip.frameWidth * scale), Math.round(runtimeClip.frameHeight * scale));
      } else if (fallbackKey && this.textures.exists(fallbackKey)) {
        setImageToHeight(sprite, displaySize);
      } else {
        sprite.setDisplaySize(displaySize, displaySize);
      }

      const facing: -1 | 1 = definition.x < LUMEN_PALACE_ROOM.width / 2 ? 1 : -1;
      sprite.setFlipX(facing < 0);
      const talkMarker = this.shouldShowPalaceTalkMarker(definition.id)
        ? this.createTalkMarker(definition.x, definition.y - displaySize - 12, depth)
        : undefined;

      return {
        definition,
        sprite,
        shadow,
        talkMarker,
        facing,
      };
    });

    this.markerGraphics = this.add.graphics().setDepth(32);
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

  private shouldShowPalaceTalkMarker(_npcId: string): boolean {
    return false;
  }

  private shouldShowInteractionMarker(interaction: PalaceInteraction): boolean {
    return interaction.kind !== 'npc';
  }

  private createHero(): void {
    this.heroShadow = this.add.ellipse(this.player.x, this.player.y - 4, 24, 10, 0x111111, 0.3)
      .setDepth(depthForBottom(this.player.y) - 0.4);
    this.hero = this.add.image(this.player.x, this.player.y, ATLAS_KEY, AtlasFrame.Hero)
      .setOrigin(0.5, 1)
      .setDisplaySize(60, 60)
      .setDepth(depthForBottom(this.player.y));
    this.applyHeroRuntimeTexture();
  }

  private createHud(): void {
    this.interactionText = this.pinHud(
      this.add.text(196, 536, '', {
        fontFamily: 'Segoe UI',
        fontSize: '12px',
        color: '#fff0c7',
        backgroundColor: 'rgba(18, 14, 16, 0.86)',
        padding: { left: 10, right: 10, top: 6, bottom: 6 },
        align: 'center',
        wordWrap: { width: 340 },
      }).setOrigin(0.5, 0.5).setVisible(false),
      1001,
    );
    this.interactionMarker = this.pinHud(
      this.add.text(0, 0, '[!]', {
        fontFamily: 'Segoe UI',
        fontSize: '18px',
        fontStyle: 'bold',
        color: '#fff1be',
        stroke: '#241814',
        strokeThickness: 4,
      }).setOrigin(0.5).setVisible(false),
      1002,
    );
    this.statusText = this.pinHud(
      this.add.text(18, 18, '', {
        fontFamily: 'Segoe UI',
        fontSize: '12px',
        color: '#f7e9c9',
        backgroundColor: 'rgba(18, 14, 16, 0.74)',
        padding: { left: 8, right: 8, top: 6, bottom: 6 },
        wordWrap: { width: 264 },
      }),
      1000,
    );

    this.joystick = new VirtualJoystick(this, 62, this.scale.height - 76, 32);
  }

  private playArrivalEvent(): void {
    if (hasStoryFlag(this.snapshot, STORY_FLAG_PALACE_FIRST_AUDIENCE)) {
      this.dialogueOverlay.showTimed(this.translateDialogueLine(getPalaceArrivalLine(this.storyTier)), 3600);
      return;
    }

    this.dialogueOverlay.showSequence(
      [
        this.translateDialogueLine(getPalaceArrivalLine(this.storyTier)),
        this.translateDialogueLine({
          speaker: { category: 'npc', subjectId: 'queen_regent_celestine', name: 'Queen Regent Celestine' },
          text: 'If the town begins to hope, the palace must begin to listen.',
        }),
        {
          speaker: { category: 'character', subjectId: 'hero', name: 'Kain' },
          text: 'Then I will bring you proof from the roads, not rumors from the court.',
        },
      ],
      () => {
        this.snapshot = markStoryFlag(this.snapshot, STORY_FLAG_PALACE_FIRST_AUDIENCE, Date.now());
        saveSnapshot(this.snapshot);
      },
    );
  }

  private handleDialoguePauseInput(): boolean {
    if (!this.dialogueOverlay.isVisible()) {
      return false;
    }

    this.player.moving = false;
    this.hero.setPosition(this.player.x, this.player.y);
    this.heroShadow.setPosition(this.player.x, this.player.y - 4);
    this.hero.setDepth(depthForBottom(this.player.y));
    this.heroShadow.setDepth(depthForBottom(this.player.y) - 0.4);
    this.applyHeroRuntimeTexture();

    return this.dialogueOverlay.isVisible();
  }

  private handleMovement(deltaMs: number): void {
    const axis = this.joystick.getVector();
    let dx = axis.x;
    let dy = axis.y;

    const magnitude = Math.hypot(dx, dy);
    this.player.moving = magnitude > 0.12;
    if (!this.player.moving) {
      this.applyHeroRuntimeTexture();
      return;
    }

    const speed = 152 * (deltaMs / 1000);
    const normalizedX = dx / magnitude;
    const normalizedY = dy / magnitude;
    const nextX = this.player.x + normalizedX * speed;
    const nextY = this.player.y + normalizedY * speed;

    if (normalizedX < -0.1) {
      this.heroFacing = -1;
    } else if (normalizedX > 0.1) {
      this.heroFacing = 1;
    }

    const resolvedX = Phaser.Math.Clamp(nextX, 78 + PLAYER_RADIUS, LUMEN_PALACE_ROOM.width - 78 - PLAYER_RADIUS);
    const resolvedY = Phaser.Math.Clamp(nextY, 112 + PLAYER_RADIUS, LUMEN_PALACE_ROOM.height - 54 - PLAYER_RADIUS);

    if (!this.isBlocked(resolvedX, resolvedY)) {
      this.player.x = resolvedX;
      this.player.y = resolvedY;
    }

    this.hero.setPosition(this.player.x, this.player.y);
    this.heroShadow.setPosition(this.player.x, this.player.y - 4);
    this.hero.setDepth(depthForBottom(this.player.y));
    this.heroShadow.setDepth(depthForBottom(this.player.y) - 0.4);
    this.applyHeroRuntimeTexture();
  }

  private isBlocked(x: number, y: number): boolean {
    return (
      x >= THRONE_DAIS.x &&
      x <= THRONE_DAIS.x + THRONE_DAIS.width &&
      y >= THRONE_DAIS.y &&
      y <= THRONE_DAIS.y + THRONE_DAIS.height
    );
  }

  private resolveInteraction(): void {
    const candidates: PalaceInteraction[] = [];

    for (const npc of this.palaceNpcs) {
      if (distance(this.player.x, this.player.y, npc.definition.x, npc.definition.y) <= 88) {
        candidates.push({
          kind: 'npc',
          label: this.localizePalaceNpcName(npc.definition.id, npc.definition.name),
          prompt: t(this, 'ui.palace_talk_prompt', undefined, '터치해서 대화'),
          x: npc.definition.x,
          y: npc.definition.y - 52,
          npcId: npc.definition.id,
        });
      }
    }

    if (distance(this.player.x, this.player.y, LUMEN_PALACE_EXIT.interactX, LUMEN_PALACE_EXIT.interactY) <= 92) {
      candidates.push({
        kind: 'exit',
        label: cleanUiText(t(this, 'ui.palace_exit', undefined, '궁궐 출구'), '궁궐 출구'),
        prompt: cleanUiText(t(this, 'ui.palace_exit_prompt', undefined, '워프에 들어가면 마을로 돌아갑니다'), '워프에 들어가면 마을로 돌아갑니다'),
        x: LUMEN_PALACE_EXIT.interactX,
        y: LUMEN_PALACE_EXIT.interactY - 44,
      });
    }

    candidates.sort(
      (left, right) =>
        distance(this.player.x, this.player.y, left.x, left.y) -
        distance(this.player.x, this.player.y, right.x, right.y),
    );

    this.activeInteraction = candidates[0] ?? null;

    if (this.activeInteraction) {
      this.interactionMarker
        .setPosition(this.activeInteraction.x, this.activeInteraction.y)
        .setVisible(this.shouldShowInteractionMarker(this.activeInteraction));
      this.interactionText
        .setText(`${this.activeInteraction.label}\n${this.activeInteraction.prompt}`)
        .setVisible(true);
      return;
    }

    this.interactionMarker.setVisible(false);
    this.interactionText.setVisible(false);
  }

  private handlePointerInteract(pointer: Phaser.Input.Pointer): void {
    if (this.isPointerOnVirtualControls(pointer)) {
      return;
    }

    if (this.dialogueOverlay.isVisible()) {
      this.dialogueOverlay.advance();
      return;
    }

    this.triggerActiveInteraction();
  }

  private isPointerOnVirtualControls(pointer: Phaser.Input.Pointer): boolean {
    return pointer.x <= 150 && pointer.y >= this.scale.height - 150;
  }

  private triggerActiveInteraction(): void {
    if (!this.activeInteraction) {
      return;
    }

    if (this.activeInteraction.kind === 'exit') {
      this.returnToVillage();
      return;
    }

    if (!this.activeInteraction.npcId) {
      return;
    }

    const npc = getPalaceNpc(this.activeInteraction.npcId);
    if (!npc) {
      return;
    }

    this.dialogueOverlay.showSequence(
      getPalaceDialogue(npc.id, this.storyTier).map((line) => this.translateDialogueLine(line)),
    );
  }

  private handleAutoExit(): boolean {
    if (distance(this.player.x, this.player.y, LUMEN_PALACE_EXIT.interactX, LUMEN_PALACE_EXIT.interactY) > PALACE_EXIT_RADIUS) {
      return false;
    }

    this.returnToVillage();
    return true;
  }

  private refreshHud(): void {
    const lines = [
      t(this, 'ui.palace_hall', undefined, '루멘 궁궐 / 접견실'),
      t(this, 'ui.palace_status_hint', undefined, '터치: 대화, 하단 문으로 마을 복귀'),
    ];

    if (this.activeInteraction) {
      lines.unshift(t(this, 'Nearby: {label}', { label: this.activeInteraction.label }));
    }

    this.statusText.setText(lines.join('\n'));
  }

  private updateNpcRuntimeTextures(): void {
    this.palaceNpcs.forEach((npc, index) => {
      const runtimeClip = this.getPalaceNpcRuntimeClip(npc.definition);
      const fallbackKey = this.getPalaceNpcFallbackTextureKey(npc.definition.id);
      const displaySize = this.getPalaceNpcDisplaySize(npc.definition.id);
      const bob = Math.sin(this.animationElapsedMs / 280 + index * 0.7) * (npc.definition.id === 'king_aldren' ? 0.4 : 1.0);

      if (runtimeClip && this.textures.exists(runtimeClip.textureKey)) {
        const frameIndex = getRuntimeClipFrameIndex(runtimeClip, this.animationElapsedMs);
        const scale = displaySize / runtimeClip.frameHeight;
        npc.sprite
          .setTexture(runtimeClip.textureKey, frameIndex)
          .setDisplaySize(Math.round(runtimeClip.frameWidth * scale), Math.round(runtimeClip.frameHeight * scale));
      } else if (fallbackKey && this.textures.exists(fallbackKey)) {
        npc.sprite.setTexture(fallbackKey);
        setImageToHeight(npc.sprite, displaySize);
      }

      npc.sprite
        .setPosition(npc.definition.x, npc.definition.y + bob)
        .setDepth(depthForBottom(npc.definition.y))
        .setFlipX(npc.facing < 0);
      npc.shadow
        .setPosition(npc.definition.x, npc.definition.y - 4)
        .setDepth(depthForBottom(npc.definition.y) - 0.4)
        .setAlpha(0.24 + (Math.sin(this.animationElapsedMs / 280 + index * 0.7) + 1) * 0.04);
      npc.talkMarker
        ?.setVisible(this.shouldShowPalaceTalkMarker(npc.definition.id))
        .setPosition(npc.definition.x, npc.definition.y - displaySize - 12 + bob * 0.25)
        .setDepth(Math.max(depthForBottom(npc.definition.y) + 0.9, 220))
        .setAlpha(0.86 + Math.sin(this.animationElapsedMs / 220 + index) * 0.12);
    });
  }

  private updatePalaceEffects(): void {
    const pulse = (Math.sin(this.animationElapsedMs / 240) + 1) * 0.5;
    this.markerGraphics.clear();
    this.markerGraphics.lineStyle(3, 0xe6d49a, 0.28 + pulse * 0.18);
    this.markerGraphics.strokeEllipse(
      LUMEN_PALACE_EXIT.interactX,
      LUMEN_PALACE_EXIT.interactY + 10,
      112 + pulse * 12,
      28 + pulse * 5,
    );

    if (this.activeInteraction && this.shouldShowInteractionMarker(this.activeInteraction)) {
      this.markerGraphics.lineStyle(2, 0xffefb0, 0.24 + pulse * 0.14);
      this.markerGraphics.strokeCircle(this.activeInteraction.x, this.activeInteraction.y + 8, 14 + pulse * 4);
    }
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
      getRuntimeAnimationClip(this, 'character', 'hero', 'walk') ??
      null
    );
  }

  private applyHeroRuntimeTexture(): void {
    const clip = this.getHeroRuntimeClip();
    if (!clip || !this.textures.exists(clip.textureKey)) {
      this.hero.setTexture(ATLAS_KEY, AtlasFrame.Hero).setDisplaySize(52, 52).setFlipX(this.heroFacing < 0);
      return;
    }

    const frameIndex = getRuntimeClipFrameIndex(clip, this.animationElapsedMs);
    const scale = 88 / clip.frameHeight;
    this.hero
      .setTexture(clip.textureKey, frameIndex)
      .setDisplaySize(Math.round(clip.frameWidth * scale), Math.round(clip.frameHeight * scale))
      .setFlipX(this.heroFacing < 0);
  }

  private getPalaceNpcRuntimeClip(definition: PalaceNpcDefinition): RuntimeAnimationClipEntry | null {
    const subjectId = getPalaceNpcRuntimeSubjectId(definition.id);
    for (const clipId of ['talk', 'idle', 'counter_stand', 'patrol_walk', 'walk']) {
      const clip = getRuntimeAnimationClip(this, 'npc', subjectId, clipId);
      if (clip) {
        return clip;
      }
    }
    return null;
  }

  private getPalaceNpcFallbackTextureKey(npcId: string): string | null {
    switch (npcId) {
      case 'king_aldren':
        return PALACE_RUNTIME_IMAGE_KEYS.npcKing;
      case 'queen_regent_celestine':
        return PALACE_RUNTIME_IMAGE_KEYS.npcQueen;
      case 'captain_rowan':
      case 'sanctum_knight':
        return PALACE_RUNTIME_IMAGE_KEYS.npcGuard;
      case 'archivist_mirel':
        return PALACE_RUNTIME_IMAGE_KEYS.npcScholar;
      case 'chamberlain_orla':
        return TOWN_RUNTIME_IMAGE_KEYS.villager;
      default:
        return TOWN_RUNTIME_IMAGE_KEYS.guardSword;
    }
  }

  private getPalaceNpcDisplaySize(npcId: string): number {
    switch (npcId) {
      case 'king_aldren':
        return 84;
      case 'queen_regent_celestine':
        return 78;
      default:
        return 72;
    }
  }

  private drawCenterCarpet(carpetCenterX: number, carpetCenterY: number): void {
    this.add.rectangle(carpetCenterX, carpetCenterY, CARPET_BOUNDS.width + 18, CARPET_BOUNDS.height + 14, 0x14131f, 0.24)
      .setDepth(-4.2)
      .setStrokeStyle(3, 0xc7a860, 0.2);

    if (this.textures.exists(PALACE_RUNTIME_IMAGE_KEYS.centerCarpetSegment)) {
      const segmentHeight = 174;
      const overlap = 18;
      for (let y = CARPET_BOUNDS.y + segmentHeight / 2; y < CARPET_BOUNDS.y + CARPET_BOUNDS.height; y += segmentHeight - overlap) {
        const segment = this.add.image(carpetCenterX, y, PALACE_RUNTIME_IMAGE_KEYS.centerCarpetSegment)
          .setOrigin(0.5)
          .setDepth(-3.9);
        segment.setDisplaySize(CARPET_BOUNDS.width, segmentHeight);
      }
      return;
    }

    this.add.rectangle(carpetCenterX, carpetCenterY, CARPET_BOUNDS.width, CARPET_BOUNDS.height, 0x183963, 0.82)
      .setDepth(-4)
      .setStrokeStyle(3, 0xdabd7c, 0.5);
    this.add.rectangle(carpetCenterX, carpetCenterY, CARPET_BOUNDS.width - 48, CARPET_BOUNDS.height - 18, 0x244f7e, 0.34)
      .setDepth(-3.9);
    this.add.rectangle(carpetCenterX, carpetCenterY, 18, CARPET_BOUNDS.height - 40, 0xe0c17a, 0.24)
      .setDepth(-3.8);
    for (const y of [CARPET_BOUNDS.y + 72, CARPET_BOUNDS.y + CARPET_BOUNDS.height - 72]) {
      this.add.rectangle(carpetCenterX, y, CARPET_BOUNDS.width - 34, 22, 0x8d3345, 0.78)
        .setDepth(-3.7)
        .setStrokeStyle(2, 0xe8c779, 0.38);
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
        if (!this.textures.exists(key)) {
          continue;
        }
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

  private translateDialogueLine(line: DialogueLine): DialogueLine {
    const speakerName = line.speaker.category === 'npc'
      ? this.localizePalaceNpcName(line.speaker.subjectId, line.speaker.name)
      : t(this, line.speaker.name, undefined, line.speaker.name);

    return {
      ...line,
      speaker: {
        ...line.speaker,
        name: speakerName,
      },
      text: t(this, line.text, undefined, line.text),
    };
  }

  private localizePalaceNpcName(npcId: string, fallback?: string): string {
    return t(this, `npc.palace.${npcId}`, undefined, fallback ?? getPalaceNpcFallbackName(npcId));
  }

  private returnToVillage(): void {
    this.scene.start('village', { spawnId: 'palace_gate' });
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
}

function setImageToHeight(image: Phaser.GameObjects.Image, displayHeight: number): void {
  image.setDisplaySize(Math.round((image.width / image.height) * displayHeight), displayHeight);
}

function depthForBottom(bottomY: number): number {
  return Math.round(bottomY * DEPTH_SCALE);
}

function distance(ax: number, ay: number, bx: number, by: number): number {
  return Phaser.Math.Distance.Between(ax, ay, bx, by);
}

function cleanUiText(value: string, fallback: string): string {
  return /[�沅媛異뚰]/u.test(value) ? fallback : value;
}

function getRuntimeClipFrameIndex(clip: RuntimeAnimationClipEntry, elapsedMs: number): number {
  const fps = clip.fps ?? 8;
  const elapsedFrames = Math.max(0, Math.floor((elapsedMs / 1000) * fps));
  return clip.frameCount <= 1 ? 0 : elapsedFrames % clip.frameCount;
}
