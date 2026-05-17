import Phaser from 'phaser';
import { appMetadata } from '../../config/appMetadata';
import { isAnimationViewerMenuEnabled, isAssetStatusMenuEnabled } from '../../config/runtime';
import { openExternalHttpsUrl } from '../../platform/externalLinks';
import { AtlasFrame } from '../data/atlas';
import { type LanguageCode, LANGUAGE_OPTIONS, getLanguage, setLanguage, t } from '../services/i18n';
import { loadSnapshot } from '../services/save';
import { buildDebugState } from '../ui/debugHud';
import { createButton, createPanel } from '../ui/widgets';
import type { SaveSnapshot } from '../types';

export class OptionsScene extends Phaser.Scene {
  private snapshot!: SaveSnapshot;
  private statusText!: Phaser.GameObjects.Text;

  constructor() {
    super('options');
  }

  create(): void {
    this.snapshot = loadSnapshot();
    this.add.rectangle(180, 320, 360, 640, 0x162218, 1).setDepth(-12);
    createPanel(this, 180, 154, 320, 250, t(this, 'Options'));
    createPanel(this, 180, 442, 320, 272, t(this, 'Development Tools'));

    this.add.text(26, 58, t(this, 'This panel collects the internal tools and settings used while building the game.'), {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      color: '#2f241a',
      wordWrap: { width: 294 },
    });
    this.add.text(26, 104, t(this, 'Developer-only menus stay hidden in production builds.'), {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#6e5c49',
      wordWrap: { width: 294 },
    });
    this.add.text(28, 154, t(this, 'Select Language'), {
      fontFamily: 'Segoe UI',
      fontSize: '14px',
      color: '#35291f',
      fontStyle: 'bold',
    });
    this.add.text(28, 176, t(this, 'Choose the default display language for menus and UI text.'), {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      color: '#6e5c49',
      wordWrap: { width: 292 },
    });

    this.createLanguageButtons();
    createButton(this, 180, 286, {
      width: 220,
      height: 36,
      label: t(this, 'Privacy Policy', undefined, '개인정보처리방침'),
      iconFrame: AtlasFrame.MapIcon,
      backgroundFrame: AtlasFrame.BlueButton,
      onClick: () => this.openPrivacyPolicy(),
    });

    createButton(this, 180, 334, {
      width: 220,
      height: 44,
      label: t(this, 'Animation Viewer'),
      iconFrame: AtlasFrame.Star,
      backgroundFrame: AtlasFrame.GoldButton,
      disabled: !isAnimationViewerMenuEnabled(),
      onClick: () => this.openAnimationViewer(),
    });

    createButton(this, 180, 390, {
      width: 220,
      height: 44,
      label: t(this, 'Asset Status'),
      iconFrame: AtlasFrame.BagIcon,
      disabled: !isAssetStatusMenuEnabled(),
      onClick: () => this.openAssetStatus(),
    });

    createButton(this, 180, 594, {
      width: 180,
      height: 40,
      label: t(this, 'Return to Village'),
      iconFrame: AtlasFrame.HomeIcon,
      onClick: () => this.scene.start('village'),
    });

    this.statusText = this.add.text(34, 452, '', {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      color: '#3a2f24',
      wordWrap: { width: 292 },
      lineSpacing: 3,
    });
    this.refreshStatus();
  }

  update(_: number, delta: number): void {
    this.stepSimulation(delta);
  }

  public stepSimulation(_: number): void {
  }

  public renderGameToText(): string {
    return JSON.stringify(
      buildDebugState('options', this.snapshot, {
        language: getLanguage(this),
        devAnimationViewerVisible: isAnimationViewerMenuEnabled(),
        devAssetStatusVisible: isAssetStatusMenuEnabled(),
        availableActions: [
          'change_language',
          'open_privacy_policy',
          'back_to_village',
          'open_animation_viewer',
          'open_asset_status',
        ],
      }),
    );
  }

  private refreshStatus(): void {
    this.statusText.setText(
      isAnimationViewerMenuEnabled() || isAssetStatusMenuEnabled()
        ? t(this, 'A: Animation Viewer | S: Asset Status | B: Return to Village')
        : t(this, 'Developer menus are currently hidden in this build.'),
    );
  }

  private createLanguageButtons(): void {
    const currentLanguage = getLanguage(this);
    LANGUAGE_OPTIONS.forEach((option, index) => {
      const x = 70 + index * 74;
      createButton(this, x, 232, {
        width: 68,
        height: 34,
        label: t(this, option.labelKey),
        backgroundFrame: option.value === currentLanguage ? AtlasFrame.GoldButton : AtlasFrame.BlueButton,
        labelColor: option.value === currentLanguage ? '#fff7d6' : '#f7f4ea',
        contentOffsetY: 1,
        onClick: () => {
          setLanguage(this, option.value as LanguageCode);
          this.scene.restart();
        },
      });
    });
  }

  private openPrivacyPolicy(): void {
    openExternalHttpsUrl(appMetadata.privacyPolicyUrl);
  }

  private openAnimationViewer(): void {
    if (!isAnimationViewerMenuEnabled()) {
      return;
    }

    this.scene.start('animation-viewer');
  }

  private openAssetStatus(): void {
    if (!isAssetStatusMenuEnabled()) {
      return;
    }

    this.scene.start('asset-status');
  }
}
