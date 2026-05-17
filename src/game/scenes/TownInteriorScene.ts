import Phaser from 'phaser';
import { AtlasFrame, ATLAS_KEY } from '../data/atlas';
import { getRuntimeAnimationClip, type RuntimeAnimationClipEntry } from '../data/runtimeAnimationAssets';
import {
  getShopHeaderIconKey,
  getShopInteriorFloorPropKey,
  SHOP_RUNTIME_IMAGE_KEYS,
} from '../data/shopRuntimeArt';
import { getTownInterior, type TownShopId } from '../data/town';
import { getTownInteriorFloorTileKeys, TOWN_RUNTIME_IMAGE_KEYS } from '../data/townRuntimeArt';
import { t } from '../services/i18n';
import { loadSnapshot } from '../services/save';
import { buildDebugState } from '../ui/debugHud';
import { VirtualJoystick } from '../ui/virtualJoystick';
import type { SaveSnapshot } from '../types';

interface TownInteriorSceneData {
  shopId?: TownShopId;
}

interface InteriorInteraction {
  kind: 'merchant' | 'exit';
  label: string;
  prompt: string;
  x: number;
  y: number;
}

const ROOM_WIDTH = 720;
const ROOM_HEIGHT = 720;
const PLAYER_RADIUS = 16;
const DEPTH_SCALE = 0.1;
const INTERIOR_EXIT_RADIUS = 58;
const INTERIOR_COUNTER_Y = 184;
const INTERIOR_MERCHANT_Y = 164;
const INTERIOR_EXIT_Y = 628;
const INTERIOR_PLAYER_START_Y = 520;
const INTERIOR_DECOR: Partial<Record<TownShopId, ReadonlyArray<{ key: string; x: number; y: number; displayHeight: number }>>> = {
  weapon_shop: [
    { key: TOWN_RUNTIME_IMAGE_KEYS.bench, x: 126, y: 206, displayHeight: 48 },
    { key: TOWN_RUNTIME_IMAGE_KEYS.crateStack, x: 616, y: 220, displayHeight: 56 },
  ],
  armor_shop: [
    { key: TOWN_RUNTIME_IMAGE_KEYS.planter, x: 126, y: 210, displayHeight: 46 },
    { key: TOWN_RUNTIME_IMAGE_KEYS.bench, x: 616, y: 208, displayHeight: 48 },
  ],
  item_shop: [
    { key: TOWN_RUNTIME_IMAGE_KEYS.crateStack, x: 118, y: 220, displayHeight: 58 },
    { key: TOWN_RUNTIME_IMAGE_KEYS.noticeBoard, x: 612, y: 212, displayHeight: 66 },
  ],
  forge_shop: [
    { key: TOWN_RUNTIME_IMAGE_KEYS.crateStack, x: 118, y: 224, displayHeight: 62 },
    { key: TOWN_RUNTIME_IMAGE_KEYS.lampPost, x: 618, y: 224, displayHeight: 80 },
  ],
  relic_shop: [
    { key: TOWN_RUNTIME_IMAGE_KEYS.planter, x: 128, y: 214, displayHeight: 48 },
    { key: TOWN_RUNTIME_IMAGE_KEYS.noticeBoard, x: 616, y: 214, displayHeight: 64 },
  ],
};

const INTERIOR_FLOOR_PROPS: Partial<Record<TownShopId, { x: number; y: number; displayHeight: number; flipX?: boolean }>> = {
  weapon_shop: { x: 224, y: 626, displayHeight: 78 },
  armor_shop: { x: 490, y: 624, displayHeight: 70 },
  item_shop: { x: 498, y: 626, displayHeight: 82 },
  forge_shop: { x: 218, y: 630, displayHeight: 66 },
  relic_shop: { x: 226, y: 628, displayHeight: 74 },
};

export class TownInteriorScene extends Phaser.Scene {
  private sceneData: TownInteriorSceneData = {};
  private snapshot!: SaveSnapshot;
  private player = { x: 360, y: INTERIOR_PLAYER_START_Y, moving: false };
  private hero!: Phaser.GameObjects.Image;
  private heroShadow!: Phaser.GameObjects.Ellipse;
  private heroFacing: -1 | 1 = 1;
  private merchant: Phaser.GameObjects.Image | null = null;
  private merchantShadow: Phaser.GameObjects.Ellipse | null = null;
  private counterBlock!: Phaser.GameObjects.Rectangle;
  private infoText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private interactionText!: Phaser.GameObjects.Text;
  private markerText!: Phaser.GameObjects.Text;
  private markerImage: Phaser.GameObjects.Image | null = null;
  private markerGraphics!: Phaser.GameObjects.Graphics;
  private exitWarpImage: Phaser.GameObjects.Image | null = null;
  private joystick!: VirtualJoystick;
  private interior = getTownInterior('item_shop');
  private animationElapsedMs = 0;
  private activeInteraction: InteriorInteraction | null = null;

  constructor() {
    super('town-interior');
  }

  init(data: TownInteriorSceneData = {}): void {
    this.sceneData = data;
    this.interior = getTownInterior(data.shopId);
  }

  create(): void {
    this.snapshot = loadSnapshot();
    this.player = { x: 360, y: INTERIOR_PLAYER_START_Y, moving: false };
    this.animationElapsedMs = 0;
    this.activeInteraction = null;

    this.drawInterior();
    this.createHero();
    this.createHud();
    this.input.on('pointerup', this.handlePointerInput, this);

    this.cameras.main.setBounds(0, 0, ROOM_WIDTH, ROOM_HEIGHT);
    this.cameras.main.startFollow(this.hero, true, 0.18, 0.18);
    this.cameras.main.setDeadzone(48, 80);
    this.cameras.main.roundPixels = true;

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.joystick.destroy();
      this.input.off('pointerup', this.handlePointerInput, this);
    });

    this.refreshHud();
  }

  update(_: number, delta: number): void {
    this.stepSimulation(delta);
  }

  public stepSimulation(deltaMs: number): void {
    this.animationElapsedMs += deltaMs;
    this.handleMovement(deltaMs);
    this.resolveInteraction();
    this.updateInteriorEffects();
    if (this.handleAutoExit()) {
      return;
    }
    this.refreshHud();
  }

  public renderGameToText(): string {
    return JSON.stringify(
      buildDebugState('town_interior', this.snapshot, {
        shopId: this.interior.id,
        title: this.interior.title,
        player: {
          x: Number(this.player.x.toFixed(1)),
          y: Number(this.player.y.toFixed(1)),
          moving: this.player.moving,
        },
        activeInteraction: this.activeInteraction,
        availableActions: ['interact', 'exit_to_town', 'open_shop_menu'],
      }),
    );
  }

  private drawInterior(): void {
    this.cameras.main.setBackgroundColor('#21180f');
    const runtimeFloorKeys = getTownInteriorFloorTileKeys(this.interior.id).filter((key) => this.textures.exists(key));
    if (runtimeFloorKeys.length > 0) {
      this.fillRuntimeTileRect({ x: 0, y: 0, width: ROOM_WIDTH, height: ROOM_HEIGHT }, runtimeFloorKeys, 1);
    } else {
      for (let y = 32; y < ROOM_HEIGHT; y += 64) {
        for (let x = 32; x < ROOM_WIDTH; x += 64) {
          const tint = (Math.floor(x / 64) + Math.floor(y / 64)) % 2 === 0
            ? this.interior.floorTint
            : Phaser.Display.Color.ValueToColor(this.interior.floorTint).darken(10).color;
          this.add.image(x, y, ATLAS_KEY, AtlasFrame.StoneTile).setDisplaySize(64, 64).setTint(tint);
        }
      }
    }

    this.add.rectangle(360, 42, ROOM_WIDTH, 84, this.interior.wallTint).setDepth(10);
    this.add.rectangle(360, ROOM_HEIGHT - 42, ROOM_WIDTH, 84, this.interior.wallTint).setDepth(10);
    this.add.rectangle(28, ROOM_HEIGHT / 2, 56, ROOM_HEIGHT, this.interior.wallTint).setDepth(10);
    this.add.rectangle(692, ROOM_HEIGHT / 2, 56, ROOM_HEIGHT, this.interior.wallTint).setDepth(10);
    this.add.rectangle(360, 90, 580, 18, Phaser.Display.Color.ValueToColor(this.interior.wallTint).lighten(8).color, 0.92).setDepth(11);

    if (this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.interiorTopShadow)) {
      this.add.image(360, 218, SHOP_RUNTIME_IMAGE_KEYS.interiorTopShadow)
        .setDisplaySize(520, 18)
        .setAlpha(0.56)
        .setDepth(17);
    }

    const usesBuiltInCounterArt = this.usesBuiltInCounterArt();
    this.counterBlock = this.add.rectangle(360, INTERIOR_COUNTER_Y, 332, 52, this.interior.counterTint, 0).setDepth(18);
    this.counterBlock.setStrokeStyle(3, 0xe7d2aa, 0.45);
    if (!usesBuiltInCounterArt) {
      this.drawVisibleCounter();
    }

    for (const decor of INTERIOR_DECOR[this.interior.id] ?? []) {
      if (!this.textures.exists(decor.key)) {
        continue;
      }

      const prop = this.add.image(decor.x, decor.y, decor.key)
        .setOrigin(0.5, 1)
        .setDepth(depthForBottom(decor.y));
      setImageToHeight(prop, decor.displayHeight);
    }

    const floorPropKey = getShopInteriorFloorPropKey(this.interior.id);
    const propLayout = INTERIOR_FLOOR_PROPS[this.interior.id];
    if (propLayout && this.textures.exists(floorPropKey)) {
      const floorProp = this.add.image(propLayout.x, propLayout.y, floorPropKey)
        .setOrigin(0.5, 1)
        .setDepth(depthForBottom(propLayout.y));
      if (propLayout.flipX) {
        floorProp.setFlipX(true);
      }
      setImageToHeight(floorProp, propLayout.displayHeight);
    }

    this.add.rectangle(360, INTERIOR_EXIT_Y, 84, 18, 0x3a2a1a).setDepth(12).setStrokeStyle(2, 0xd2c18d, 0.45);
    this.add.text(330, INTERIOR_EXIT_Y + 12, t(this, 'Town Exit'), {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      color: '#efe1b8',
      stroke: '#281d12',
      strokeThickness: 3,
    }).setDepth(13);

    const merchantArtKey = this.getStaticMerchantArtKey();
    if (merchantArtKey && this.textures.exists(merchantArtKey)) {
      const merchantBottomY = INTERIOR_COUNTER_Y + 24;
      this.merchantShadow = this.add.ellipse(360, merchantBottomY - 4, 112, 20, 0x111111, 0.18)
        .setDepth(depthForBottom(merchantBottomY) - 0.4);
      this.merchant = this.add.image(360, merchantBottomY, merchantArtKey)
        .setOrigin(0.5, 1)
        .setDepth(depthForBottom(merchantBottomY));
      setImageToHeight(this.merchant, 124);
    } else {
      const counterClip = this.getMerchantCounterClip();
      if (counterClip && this.textures.exists(counterClip.textureKey)) {
        const merchantBottomY = INTERIOR_COUNTER_Y + 36;
        this.merchantShadow = this.add.ellipse(360, merchantBottomY - 8, 72, 16, 0x111111, 0.16)
          .setDepth(17.55);
        this.merchant = this.add.image(360, merchantBottomY, counterClip.textureKey, 0)
          .setOrigin(0.5, 1)
          .setDepth(17.8);
        const scale = 112 / counterClip.frameHeight;
        this.merchant.setDisplaySize(
          Math.round(counterClip.frameWidth * scale),
          Math.round(counterClip.frameHeight * scale),
        );
      }
    }

    this.markerGraphics = this.add.graphics().setDepth(30);
    this.exitWarpImage = null;
    const markerKey = getShopHeaderIconKey(this.interior.id);
    this.markerImage = markerKey && this.textures.exists(markerKey)
      ? this.add.image(0, 0, markerKey).setOrigin(0.5).setDepth(31).setVisible(false)
      : null;
    this.markerText = this.add.text(0, 0, '"', {
      fontFamily: 'Segoe UI',
      fontSize: '20px',
      color: '#fff4cf',
      stroke: '#2b2118',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(31).setVisible(false);
  }

  private createHero(): void {
    this.heroShadow = this.add.ellipse(this.player.x, this.player.y - 4, 24, 10, 0x111111, 0.3).setDepth(depthForBottom(this.player.y) - 0.4);
    this.hero = this.add.image(this.player.x, this.player.y, ATLAS_KEY, AtlasFrame.Hero)
      .setDisplaySize(44, 44)
      .setOrigin(0.5, 1)
      .setDepth(depthForBottom(this.player.y));
    this.applyHeroRuntimeTexture();
  }

  private createHud(): void {
    this.infoText = this.pinHud(
      this.add.text(20, 36, '', {
        fontFamily: 'Segoe UI',
        fontSize: '13px',
        color: '#f4ead0',
        lineSpacing: 3,
        wordWrap: { width: 312 },
      }).setVisible(false),
      1001,
    );
    this.statusText = this.pinHud(
      this.add.text(18, 520, '', {
        fontFamily: 'Segoe UI',
        fontSize: '12px',
        color: '#fff0c7',
        backgroundColor: 'rgba(24, 16, 10, 0.84)',
        padding: { left: 10, right: 10, top: 6, bottom: 6 },
        wordWrap: { width: 324 },
      }).setVisible(false),
      1001,
    );
    this.interactionText = this.pinHud(
      this.add.text(180, 470, '', {
        fontFamily: 'Segoe UI',
        fontSize: '12px',
        color: '#f9efce',
        align: 'center',
      }).setOrigin(0.5).setVisible(false),
      1001,
    );

    this.joystick = new VirtualJoystick(this, 82, 566, 42);
  }

  private handleMovement(deltaMs: number): void {
    const speed = 0.18 * deltaMs;
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
      const nextX = Phaser.Math.Clamp(this.player.x + dx, 62, ROOM_WIDTH - 62);
      if (!this.isBlocked(nextX, this.player.y)) {
        this.player.x = nextX;
      }
    }

    if (dy !== 0) {
      const nextY = Phaser.Math.Clamp(this.player.y + dy, 110, ROOM_HEIGHT - 70);
      if (!this.isBlocked(this.player.x, nextY)) {
        this.player.y = nextY;
      }
    }
  }

  private isBlocked(x: number, y: number): boolean {
    const counterRect = {
      x: this.counterBlock.x - this.counterBlock.width / 2,
      y: this.counterBlock.y - this.counterBlock.height / 2,
      width: this.counterBlock.width,
      height: this.counterBlock.height + 10,
    };

    return circleIntersectsRect(x, y, PLAYER_RADIUS, counterRect);
  }

  private resolveInteraction(): void {
    const merchantDistance = Math.hypot(this.player.x - 360, this.player.y - INTERIOR_MERCHANT_Y);
    const exitDistance = Math.hypot(this.player.x - 360, this.player.y - INTERIOR_EXIT_Y);

    if (merchantDistance <= 84 && merchantDistance <= exitDistance) {
      this.activeInteraction = {
        kind: 'merchant',
        label: t(this, this.interior.npcName),
        prompt: t(this, 'Tap merchant to open the shop'),
        x: 360,
        y: INTERIOR_MERCHANT_Y - 54,
      };
    } else if (exitDistance <= 72) {
      this.activeInteraction = {
        kind: 'exit',
        label: t(this, 'Town Exit'),
        prompt: t(this, 'Walk into the warp to leave'),
        x: 360,
        y: INTERIOR_EXIT_Y - 52,
      };
    } else {
      this.activeInteraction = null;
    }

    const pulse = (Math.sin(this.animationElapsedMs / 240) + 1) * 0.5;
    this.markerGraphics.clear();
    if (this.exitWarpImage) {
      const baseWidth = this.exitWarpImage.getData('baseWidth') as number;
      const baseHeight = this.exitWarpImage.getData('baseHeight') as number;
      const factor = 0.94 + pulse * 0.12;
      this.exitWarpImage
        .setAlpha(0.58 + pulse * 0.24)
        .setDisplaySize(baseWidth * factor, baseHeight * factor);
    } else {
      this.markerGraphics.lineStyle(2, 0xffefb0, 0.42 + pulse * 0.25);
      this.markerGraphics.strokeCircle(360, INTERIOR_EXIT_Y, 18 + pulse * 7);
      this.markerGraphics.lineStyle(2, 0xaed7ff, 0.4 + pulse * 0.2);
      this.markerGraphics.strokeEllipse(360, INTERIOR_EXIT_Y + 8, 64 + pulse * 10, 24 + pulse * 6);
    }

    if (this.activeInteraction) {
      if (this.activeInteraction.kind === 'merchant' && this.markerImage) {
        const factor = 0.92 + pulse * 0.08;
        this.markerGraphics.lineStyle(2, 0xffefb0, 0.3 + pulse * 0.16);
        this.markerGraphics.strokeCircle(this.activeInteraction.x, this.activeInteraction.y + 2, 13 + pulse * 3);
        this.markerImage
          .setPosition(this.activeInteraction.x, this.activeInteraction.y + 2)
          .setDisplaySize(24 * factor, 24 * factor)
          .setAlpha(0.9 + pulse * 0.08)
          .setVisible(true);
        this.markerText.setVisible(false);
      } else {
        this.markerImage?.setVisible(false);
        this.markerText.setPosition(this.activeInteraction.x, this.activeInteraction.y).setVisible(true);
      }
      this.interactionText.setText(`${this.activeInteraction.label}\n${this.activeInteraction.prompt}`).setVisible(true);
    } else {
      this.markerImage?.setVisible(false);
      this.markerText.setVisible(false);
      this.interactionText.setVisible(false);
    }
  }

  private handlePointerInput(pointer: Phaser.Input.Pointer): void {
    if (this.isPointerOnVirtualControls(pointer)) {
      return;
    }

    this.handleInteraction();
  }

  private isPointerOnVirtualControls(pointer: Phaser.Input.Pointer): boolean {
    return pointer.x <= 150 && pointer.y >= this.scale.height - 150;
  }

  private handleInteraction(): void {
    if (!this.activeInteraction) {
      return;
    }

    if (this.activeInteraction.kind === 'merchant') {
      this.scene.start('shop', {
        shopId: this.interior.id,
        returnScene: 'town-interior',
      });
      return;
    }

    this.exitInterior();
  }

  private updateInteriorEffects(): void {
  }

  private handleAutoExit(): boolean {
    const exitDistance = Math.hypot(this.player.x - 360, this.player.y - INTERIOR_EXIT_Y);
    if (exitDistance > INTERIOR_EXIT_RADIUS) {
      return false;
    }

    this.exitInterior();
    return true;
  }

  private exitInterior(): void {
    this.scene.start('village', { spawnId: this.interior.returnSpawnId });
  }

  private refreshHud(): void {
    this.infoText.setText([
      `${t(this, this.interior.npcName)}: ${t(this, this.interior.greeting)}`,
      t(this, this.interior.flavorText),
    ]);
    this.statusText.setText([
      t(this, 'ui.space_interact'),
      t(this, 'Walk into the exit warp to leave'),
      this.activeInteraction
        ? t(this, 'Nearby: {label}', { label: this.activeInteraction.label })
        : t(this, 'Move close to the merchant or the exit'),
    ].join('\n'));
  }

  private getStaticMerchantArtKey(): string | null {
    switch (this.interior.id) {
      case 'weapon_shop':
        return SHOP_RUNTIME_IMAGE_KEYS.merchantWeaponCounter;
      case 'armor_shop':
        return SHOP_RUNTIME_IMAGE_KEYS.merchantArmorCounter;
      case 'item_shop':
        return SHOP_RUNTIME_IMAGE_KEYS.merchantItemCounter;
      case 'forge_shop':
        return SHOP_RUNTIME_IMAGE_KEYS.merchantForgeCounter;
      case 'relic_shop':
        return SHOP_RUNTIME_IMAGE_KEYS.merchantRelicCounter;
      default:
        return null;
    }
  }

  private getMerchantCounterClip(): RuntimeAnimationClipEntry | null {
    const subjectId = this.getMerchantRuntimeSubjectId();
    return (
      getRuntimeAnimationClip(this, 'npc', subjectId, 'counter_stand') ??
      getRuntimeAnimationClip(this, 'npc', subjectId, 'idle') ??
      null
    );
  }

  private getMerchantRuntimeSubjectId(): string {
    switch (this.interior.id) {
      case 'weapon_shop':
        return 'weapon_merchant';
      case 'armor_shop':
        return 'armor_merchant';
      case 'item_shop':
        return 'item_merchant';
      case 'forge_shop':
        return 'blacksmith';
      case 'relic_shop':
        return 'relic_merchant';
      default:
        return 'item_merchant';
    }
  }

  private usesBuiltInCounterArt(): boolean {
    const merchantArtKey = this.getStaticMerchantArtKey();
    return Boolean(merchantArtKey && this.textures.exists(merchantArtKey));
  }

  private drawVisibleCounter(): void {
    const topTint = Phaser.Display.Color.ValueToColor(this.interior.counterTint).lighten(18).color;
    const faceTint = Phaser.Display.Color.ValueToColor(this.interior.counterTint).darken(8).color;
    const shadowTint = Phaser.Display.Color.ValueToColor(this.interior.counterTint).darken(28).color;

    this.add.rectangle(360, INTERIOR_COUNTER_Y - 18, 340, 12, topTint, 0.94)
      .setStrokeStyle(2, 0xf0d9a8, 0.28)
      .setDepth(18.3);
    this.add.rectangle(360, INTERIOR_COUNTER_Y - 6, 330, 12, shadowTint, 0.3)
      .setDepth(18.2);
    this.add.rectangle(360, INTERIOR_COUNTER_Y + 14, 330, 38, faceTint, 0.96)
      .setStrokeStyle(2, 0xe7d2aa, 0.22)
      .setDepth(18.1);

    for (const offsetX of [-120, -40, 40, 120]) {
      this.add.rectangle(360 + offsetX, INTERIOR_COUNTER_Y + 14, 2, 34, shadowTint, 0.42)
        .setDepth(18.15);
    }
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
    const scale = 68 / clip.frameHeight;
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

  private fillRuntimeTileRect(bounds: { x: number; y: number; width: number; height: number }, tileKeys: readonly string[], depth: number): void {
    const startX = bounds.x + 32;
    const startY = bounds.y + 32;
    const cols = Math.ceil(bounds.width / 64);
    const rows = Math.ceil(bounds.height / 64);

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const key = tileKeys[Math.abs((row * 3 + col * 5 + row * col) % tileKeys.length)];
        this.add.image(startX + col * 64, startY + row * 64, key)
          .setDisplaySize(66, 66)
          .setDepth(depth);
      }
    }
  }
}

function setImageToHeight(image: Phaser.GameObjects.Image, displayHeight: number): void {
  image.setDisplaySize(Math.round((image.width / image.height) * displayHeight), displayHeight);
}

function setImageToWidth(image: Phaser.GameObjects.Image, displayWidth: number): void {
  image.setDisplaySize(displayWidth, Math.round((image.height / image.width) * displayWidth));
}

function depthForBottom(bottomY: number): number {
  return Math.round(bottomY * DEPTH_SCALE);
}

function getRuntimeClipFrameIndex(clip: RuntimeAnimationClipEntry, elapsedMs: number): number {
  const fps = clip.fps ?? 8;
  const elapsedFrames = Math.max(0, Math.floor((elapsedMs / 1000) * fps));
  return clip.frameCount <= 1 ? 0 : elapsedFrames % clip.frameCount;
}

function circleIntersectsRect(cx: number, cy: number, radius: number, rect: { x: number; y: number; width: number; height: number }): boolean {
  const nearestX = Phaser.Math.Clamp(cx, rect.x, rect.x + rect.width);
  const nearestY = Phaser.Math.Clamp(cy, rect.y, rect.y + rect.height);
  const dx = cx - nearestX;
  const dy = cy - nearestY;
  return dx * dx + dy * dy < radius * radius;
}
