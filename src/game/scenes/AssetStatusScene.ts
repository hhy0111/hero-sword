import Phaser from 'phaser';
import { isAnimationViewerMenuEnabled } from '../../config/runtime';
import { ATLAS_ASSET_PATH, ATLAS_KEY, AtlasFrame } from '../data/atlas';
import { getRuntimeAnimationState } from '../data/runtimeAnimationAssets';
import { t } from '../services/i18n';
import { loadSnapshot } from '../services/save';
import { buildDebugState } from '../ui/debugHud';
import { createButton, createPanel, paintBackdrop } from '../ui/widgets';
import type { SaveSnapshot } from '../types';

export class AssetStatusScene extends Phaser.Scene {
  private snapshot!: SaveSnapshot;
  private statusText!: Phaser.GameObjects.Text;
  private loadedClipsText!: Phaser.GameObjects.Text;

  constructor() {
    super('asset-status');
  }

  create(): void {
    this.snapshot = loadSnapshot();
    paintBackdrop(this, AtlasFrame.StoneTile, 0xd8d4c4);
    createPanel(this, 180, 102, 332, 146, t(this, 'Asset Status'));
    createPanel(this, 180, 352, 332, 400, t(this, 'Runtime Animation Load'));

    this.add.text(26, 50, t(this, '최종 캐릭터/적/VFX 프레임 시트가 들어오면 manifest만 채워 바로 연결할 수 있는 상태를 확인합니다.'), {
      fontFamily: 'Segoe UI',
      fontSize: '13px',
      color: '#2f241a',
      wordWrap: { width: 304 },
    });

    this.statusText = this.add.text(28, 134, '', {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      color: '#5e4b3a',
      wordWrap: { width: 300 },
      lineSpacing: 2,
    });

    this.loadedClipsText = this.add.text(28, 202, '', {
      fontFamily: 'Consolas, monospace',
      fontSize: '11px',
      color: '#2f241a',
      wordWrap: { width: 300 },
      lineSpacing: 2,
    });

    createButton(this, 98, 590, {
      width: 144,
      height: 38,
      label: t(this, 'ui.options'),
      iconFrame: AtlasFrame.HomeIcon,
      onClick: () => this.scene.start('options'),
    });
    createButton(this, 262, 590, {
      width: 144,
      height: 38,
      label: t(this, 'Animation Viewer'),
      iconFrame: AtlasFrame.Star,
      backgroundFrame: AtlasFrame.GoldButton,
      disabled: !isAnimationViewerMenuEnabled(),
      onClick: () => this.scene.start('animation-viewer'),
    });

    this.refreshText();
  }

  update(_: number, delta: number): void {
    this.stepSimulation(delta);
  }

  public stepSimulation(_: number): void {
  }

  public renderGameToText(): string {
    const runtimeState = getRuntimeAnimationState(this);

    return JSON.stringify(
      buildDebugState('asset_status', this.snapshot, {
        runtimeAtlasLoaded: this.textures.exists(ATLAS_KEY),
        runtimeAtlasPath: ATLAS_ASSET_PATH,
        runtimeManifestFound: runtimeState.manifestFound,
        runtimeManifestVersion: runtimeState.manifestVersion,
        runtimeClipCount: runtimeState.clipCount,
        runtimeAvailableClipCount: runtimeState.availableClipCount,
        runtimeFailedClipCount: runtimeState.failedTextureKeys.length,
        runtimeValidationErrorCount: runtimeState.validationErrors.length,
        availableActions: ['back_to_options', 'open_animation_viewer'],
      }),
    );
  }

  private refreshText(): void {
    const runtimeState = getRuntimeAnimationState(this);
    const atlasLoaded = this.textures.exists(ATLAS_KEY);

    this.statusText.setText([
      t(this, '기본 atlas: {status} ({path})', {
        status: t(this, atlasLoaded ? 'ui.loaded' : 'ui.missing'),
        path: ATLAS_ASSET_PATH,
      }),
      t(this, 'runtime manifest: {status} ({path})', {
        status: t(this, runtimeState.manifestFound ? 'ui.loaded' : 'ui.missing'),
        path: runtimeState.manifestPath,
      }),
      t(this, 'subjects: {subjectCount} | clips: {clipCount} | loaded: {loadedCount}', {
        subjectCount: runtimeState.subjectCount,
        clipCount: runtimeState.clipCount,
        loadedCount: runtimeState.availableClipCount,
      }),
      t(this, 'failed: {failedCount} | validation issues: {issueCount}', {
        failedCount: runtimeState.failedTextureKeys.length,
        issueCount: runtimeState.validationErrors.length,
      }),
      runtimeState.manifestFound && runtimeState.availableClipCount === 0
        ? t(this, '현재는 manifest scaffold만 준비된 상태입니다. 최종 프레임 시트와 path만 채우면 됩니다.')
        : t(this, 'clip이 로드되면 Animation Viewer가 실제 strip 프레임을 우선 사용합니다.'),
    ]);

    const previewLines = [
      t(this, 'loaded clip keys:'),
      ...(runtimeState.loadedTextureKeys.length > 0
        ? runtimeState.loadedTextureKeys.slice(0, 10)
        : [t(this, '(none)')]),
    ];

    if (runtimeState.validationErrors.length > 0) {
      previewLines.push('', t(this, 'validation:'));
      previewLines.push(...runtimeState.validationErrors.slice(0, 6));
    }

    if (runtimeState.failedTextureKeys.length > 0) {
      previewLines.push('', t(this, 'failed texture keys:'));
      previewLines.push(...runtimeState.failedTextureKeys.slice(0, 6));
    }

    this.loadedClipsText.setText(previewLines.join('\n'));
  }
}
