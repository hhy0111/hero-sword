import Phaser from 'phaser';
import { ATLAS_KEY, AtlasFrame } from '../data/atlas';
import { SCREEN_RUNTIME_IMAGE_KEYS } from '../data/screenRuntimeArt';
import { t } from '../services/i18n';
import { loadSnapshot } from '../services/save';
import { buildDebugState } from '../ui/debugHud';
import { createButton, paintBackdrop } from '../ui/widgets';

export class TitleScene extends Phaser.Scene {
  private elapsedMs = 0;
  private finalized = false;
  private logoGroup!: Phaser.GameObjects.Container;
  private swordIcon!: Phaser.GameObjects.Image;
  private promptText!: Phaser.GameObjects.Text;
  private glowRing!: Phaser.GameObjects.Arc;
  private usesRuntimeTitleLogo = false;

  constructor() {
    super('title');
  }

  create(): void {
    this.elapsedMs = 0;
    this.finalized = false;

    paintBackdrop(this, AtlasFrame.StoneTile, 0x101a13);
    this.add.rectangle(180, 320, 360, 640, 0x06100b, 0.84);
    this.add.rectangle(180, 320, 326, 570, 0x081118, 0.72).setStrokeStyle(2, 0xe0c78b, 0.22);

    this.glowRing = this.add.circle(180, 206, 82, 0x6da5ff, 0.05).setStrokeStyle(2, 0xe9d08b, 0.18);

    this.usesRuntimeTitleLogo = this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.titleHeroSwordLogo);
    this.swordIcon = this.usesRuntimeTitleLogo
      ? this.add.image(0, -80, SCREEN_RUNTIME_IMAGE_KEYS.titleHeroSwordLogo).setDisplaySize(220, 220)
      : this.add
          .image(0, -48, ATLAS_KEY, AtlasFrame.SwordIcon)
          .setDisplaySize(86, 86)
          .setTint(0xf8e7a7);

    const titleText = this.add.text(0, this.usesRuntimeTitleLogo ? 38 : 22, t(this, 'ui.title_logo'), {
      fontFamily: 'Segoe UI',
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#fff0be',
      stroke: '#24180b',
      strokeThickness: 5,
      align: 'center',
    }).setOrigin(0.5);

    const subtitleText = this.add.text(0, this.usesRuntimeTitleLogo ? 78 : 62, t(this, 'ui.title_subtitle'), {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      color: '#d8c092',
      stroke: '#15100a',
      strokeThickness: 2,
      align: 'center',
    }).setOrigin(0.5);

    this.logoGroup = this.add.container(180, this.usesRuntimeTitleLogo ? 218 : 230, [this.swordIcon, titleText, subtitleText]);
    this.logoGroup.setAlpha(0);

    this.add.text(180, 418, t(this, 'ui.title_opening_complete'), {
      fontFamily: 'Segoe UI',
      fontSize: '13px',
      color: '#e8d5aa',
      stroke: '#15100a',
      strokeThickness: 2,
      align: 'center',
      wordWrap: { width: 280 },
      lineSpacing: 4,
    }).setOrigin(0.5);

    this.promptText = this.add.text(180, 488, t(this, 'ui.press_enter_to_start'), {
      fontFamily: 'Segoe UI',
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#fff3ce',
      stroke: '#15100a',
      strokeThickness: 3,
      align: 'center',
    }).setOrigin(0.5);

    createButton(this, 180, 548, {
      width: 186,
      height: 42,
      label: t(this, 'ui.start_game'),
      iconFrame: AtlasFrame.SwordIcon,
      onClick: () => this.startGame(),
    });

    this.input.on('pointerdown', () => {
      if (this.elapsedMs > 900) {
        this.startGame();
      }
    });
  }

  update(_: number, delta: number): void {
    this.stepSimulation(delta);
  }

  public stepSimulation(deltaMs: number): void {
    if (this.finalized) {
      return;
    }

    this.elapsedMs += deltaMs;
    const introProgress = Phaser.Math.Clamp(this.elapsedMs / 1000, 0, 1);
    const pulse = 0.5 + Math.sin(this.elapsedMs / 220) * 0.5;
    const logoScale = 0.92 + introProgress * 0.08 + Math.sin(this.elapsedMs / 380) * 0.012;

    this.logoGroup.setAlpha(introProgress);
    this.logoGroup.setScale(logoScale);
    this.swordIcon.setRotation(Math.sin(this.elapsedMs / 520) * (this.usesRuntimeTitleLogo ? 0.015 : 0.08));
    this.glowRing.setAlpha(0.06 + pulse * 0.08);
    this.glowRing.setScale(0.95 + pulse * 0.08);
    this.promptText.setAlpha(0.58 + pulse * 0.42);

  }

  public renderGameToText(): string {
    return JSON.stringify(
      buildDebugState('title', loadSnapshot(), {
        elapsedMs: Math.round(this.elapsedMs),
        prompt: t(this, 'ui.press_enter_to_start'),
        availableActions: ['tap_to_start_game'],
      }),
    );
  }

  private startGame(): void {
    if (this.finalized) {
      return;
    }

    this.finalized = true;
    this.scene.start('village', { spawnId: 'starter_square' });
  }
}
