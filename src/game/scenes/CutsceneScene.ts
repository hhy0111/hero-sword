import Phaser from 'phaser';
import { AtlasFrame } from '../data/atlas';
import { getCutsceneDefinition, markCutsceneSeen } from '../data/cutscenes';
import { t } from '../services/i18n';
import { loadSnapshot, saveSnapshot } from '../services/save';
import { buildDebugState } from '../ui/debugHud';
import { createButton, paintBackdrop } from '../ui/widgets';

interface CutsceneSceneData {
  cutsceneId?: string;
  nextScene?: string;
}

export class CutsceneScene extends Phaser.Scene {
  private sceneData: CutsceneSceneData = {};
  private cutsceneId: string | null = null;
  private nextScene = 'village';
  private statusText!: Phaser.GameObjects.Text;
  private promptText!: Phaser.GameObjects.Text;
  private overlayRoot: HTMLDivElement | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private videoLayoutHandler: (() => void) | null = null;
  private playbackStarted = false;
  private finalized = false;

  constructor() {
    super('cutscene');
  }

  init(data?: CutsceneSceneData): void {
    this.sceneData = data ?? {};
    this.cutsceneId = this.sceneData.cutsceneId ?? null;
    this.nextScene = this.sceneData.nextScene ?? 'village';
    this.playbackStarted = false;
    this.finalized = false;
  }

  create(): void {
    paintBackdrop(this, AtlasFrame.StoneTile, 0x081118);
    this.add.rectangle(180, 320, 360, 640, 0x02040a, 0.96);
    this.add.rectangle(180, 320, 340, 608, 0x0a1017, 0.92).setStrokeStyle(2, 0xe0c78b, 0.18);
    this.add.text(28, 32, t(this, 'Story Cutscene'), {
      fontFamily: 'Segoe UI',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 3,
    });
    this.add.text(28, 58, t(this, 'Tap if autoplay is blocked. Use Skip to leave.'), {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#d4c29f',
      stroke: '#17110c',
      strokeThickness: 2,
    });

    this.statusText = this.add.text(28, 558, '', {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#efe1ba',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 304 },
      lineSpacing: 3,
    });
    this.promptText = this.add.text(180, 586, '', {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#f7efd6',
      stroke: '#17110c',
      strokeThickness: 2,
      align: 'center',
    }).setOrigin(0.5, 0.5);

    createButton(this, 286, 38, {
      width: 92,
      height: 28,
      label: t(this, 'Skip'),
      iconFrame: AtlasFrame.HomeIcon,
      onClick: () => this.finishCutscene(),
    }).setDepth(20);

    const definition = this.cutsceneId ? getCutsceneDefinition(this.cutsceneId) : null;
    if (!definition) {
      this.statusText.setText(t(this, 'Cutscene asset is missing. Returning to the next scene.'));
      this.time.delayedCall(250, () => this.finishCutscene());
      return;
    }

    this.statusText.setText(t(this, 'Now playing: {label}', { label: t(this, definition.label, undefined, definition.label) }));
    this.promptText.setText(t(this, 'Loading video...'));
    this.mountVideo(definition.path);
  }

  update(_: number, delta: number): void {
    this.stepSimulation(delta);
  }

  public stepSimulation(_: number): void {
    if (this.finalized) {
      return;
    }

    if (!this.playbackStarted && this.videoElement && this.videoElement.readyState >= 2) {
      this.promptText.setText(t(this, 'Tap to start if sound did not begin.'));
    } else if (this.playbackStarted) {
      this.promptText.setText(t(this, 'Use Skip to leave'));
    }
  }

  public renderGameToText(): string {
    return JSON.stringify(
      buildDebugState('cutscene', loadSnapshot(), {
        cutsceneId: this.cutsceneId,
        nextScene: this.nextScene,
        playbackStarted: this.playbackStarted,
        availableActions: ['skip_cutscene'],
      }),
    );
  }

  private mountVideo(sourcePath: string): void {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '0';
    overlay.style.height = '0';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.overflow = 'hidden';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';

    const wrapper = document.createElement('div');
    wrapper.style.width = '0';
    wrapper.style.height = '0';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.background = '#05080d';
    wrapper.style.border = '1px solid rgba(224, 199, 139, 0.18)';
    wrapper.style.borderRadius = '16px';
    wrapper.style.overflow = 'hidden';
    wrapper.style.pointerEvents = 'auto';

    const video = document.createElement('video');
    video.src = sourcePath.startsWith('/') ? sourcePath : `/${sourcePath}`;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'contain';
    video.style.background = '#000000';
    video.setAttribute('playsinline', 'true');
    video.preload = 'auto';
    video.controls = false;
    video.muted = true;

    wrapper.appendChild(video);
    overlay.appendChild(wrapper);
    document.body.appendChild(overlay);
    this.overlayRoot = overlay;
    this.videoElement = video;

    this.videoLayoutHandler = () => this.layoutVideoOverlay(overlay, wrapper);
    this.videoLayoutHandler();
    window.addEventListener('resize', this.videoLayoutHandler);
    window.addEventListener('orientationchange', this.videoLayoutHandler);

    video.addEventListener('ended', () => this.finishCutscene());
    video.addEventListener('error', () => {
      this.statusText.setText(t(this, 'The video could not be played. Returning to the next scene.'));
      this.finishCutscene();
    });

    const tryPlay = () => {
      if (this.videoElement && this.playbackStarted && this.videoElement.muted) {
        this.videoElement.muted = false;
        this.promptText.setText(t(this, 'Sound enabled. Use Skip to leave'));
        return;
      }
      void this.tryPlayVideo();
    };
    wrapper.addEventListener('pointerdown', tryPlay);
    this.input.on('pointerdown', tryPlay);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanupVideo();
      this.input.off('pointerdown', tryPlay);
    });
    this.events.once(Phaser.Scenes.Events.DESTROY, () => {
      this.cleanupVideo();
      this.input.off('pointerdown', tryPlay);
    });

    void this.tryPlayVideo();
  }

  private async tryPlayVideo(): Promise<void> {
    if (!this.videoElement || this.finalized) {
      return;
    }

    try {
      await this.videoElement.play();
      if (this.finalized || !this.videoElement || !this.promptText.active) {
        return;
      }
      this.playbackStarted = true;
      this.promptText.setText(t(this, 'Tap once to enable sound. Use Skip to leave'));
    } catch {
      if (this.finalized || !this.videoElement || !this.promptText.active) {
        return;
      }
      this.playbackStarted = false;
      this.promptText.setText(t(this, 'Tap the video to start playback'));
    }
  }

  private layoutVideoOverlay(overlay: HTMLDivElement, wrapper: HTMLDivElement): void {
    const canvasRect = this.game.canvas.getBoundingClientRect();
    if (canvasRect.width <= 0 || canvasRect.height <= 0) {
      return;
    }

    const topMargin = canvasRect.height * (82 / 640);
    const bottomMargin = canvasRect.height * (104 / 640);
    const horizontalMargin = canvasRect.width * (18 / 360);
    const safeWidth = Math.max(1, canvasRect.width - horizontalMargin * 2);
    const safeHeight = Math.max(1, canvasRect.height - topMargin - bottomMargin);
    const portraitRatio = 9 / 16;

    let targetHeight = safeHeight;
    let targetWidth = targetHeight * portraitRatio;
    if (targetWidth > safeWidth) {
      targetWidth = safeWidth;
      targetHeight = targetWidth / portraitRatio;
    }

    overlay.style.left = `${Math.round(canvasRect.left)}px`;
    overlay.style.top = `${Math.round(canvasRect.top + topMargin)}px`;
    overlay.style.width = `${Math.round(canvasRect.width)}px`;
    overlay.style.height = `${Math.round(safeHeight)}px`;
    wrapper.style.width = `${Math.round(targetWidth)}px`;
    wrapper.style.height = `${Math.round(targetHeight)}px`;
  }

  private finishCutscene(): void {
    if (this.finalized) {
      return;
    }

    this.finalized = true;

    if (this.cutsceneId) {
      const snapshot = loadSnapshot();
      saveSnapshot(markCutsceneSeen(snapshot, this.cutsceneId));
    }

    this.cleanupVideo();
    this.scene.start(this.nextScene);
  }

  private cleanupVideo(): void {
    if (this.videoLayoutHandler) {
      window.removeEventListener('resize', this.videoLayoutHandler);
      window.removeEventListener('orientationchange', this.videoLayoutHandler);
      this.videoLayoutHandler = null;
    }

    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.removeAttribute('src');
      this.videoElement.load();
      this.videoElement.remove();
      this.videoElement = null;
    }

    if (this.overlayRoot) {
      this.overlayRoot.remove();
      this.overlayRoot = null;
    }
  }
}
