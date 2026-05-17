import Phaser from 'phaser';
import {
  getAnimationViewerAction,
  getAnimationViewerCategories,
  getAnimationViewerSubject,
  getAnimationViewerSubjects,
  getDefaultAnimationViewerSelection,
  type AnimationClipDefinition,
  type AnimationPreviewKind,
  type AnimationSubjectDefinition,
  type AnimationViewerCategory,
  type AnimationViewerSelection,
} from '../data/animationCatalog';
import { AtlasFrame, ATLAS_KEY } from '../data/atlas';
import {
  getRuntimeAnimationState,
  getRuntimeAnimationClip,
  loadRuntimeAnimationAssets,
  setRuntimeAnimationState,
  type RuntimeAnimationClipEntry,
} from '../data/runtimeAnimationAssets';
import { t } from '../services/i18n';
import { loadSnapshot } from '../services/save';
import { buildDebugState } from '../ui/debugHud';
import { createButton, createPanel, paintBackdrop } from '../ui/widgets';
import type { BattleRole, SaveSnapshot } from '../types';

interface CharacterPoseState {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  alpha: number;
  showTarget: boolean;
}

export class AnimationViewerScene extends Phaser.Scene {
  private snapshot!: SaveSnapshot;
  private selection: AnimationViewerSelection = getDefaultAnimationViewerSelection();
  private lastRuntimeClipSignature = '';
  private runtimeAnimationLoadPromise: Promise<void> | null = null;
  private elapsedMs = 0;
  private controlsDom!: Phaser.GameObjects.DOMElement;
  private controlsRoot!: HTMLDivElement;
  private categorySelect!: HTMLSelectElement;
  private subjectSelect!: HTMLSelectElement;
  private actionSelect!: HTMLSelectElement;
  private sourceContainer!: Phaser.GameObjects.Container;
  private previewGraphics!: Phaser.GameObjects.Graphics;
  private previewActor!: Phaser.GameObjects.Image;
  private previewTarget!: Phaser.GameObjects.Image;
  private previewAnchor!: Phaser.GameObjects.Image;
  private previewMetaText!: Phaser.GameObjects.Text;
  private previewHintText!: Phaser.GameObjects.Text;

  constructor() {
    super('animation-viewer');
  }

  create(): void {
    this.snapshot = loadSnapshot();
    paintBackdrop(this, AtlasFrame.StoneTile, 0xcfd6e2);
    createPanel(this, 180, 88, 332, 144, t(this, 'Animation Viewer'));
    createPanel(this, 180, 236, 332, 152, t(this, 'Source Frames'));
    createPanel(this, 180, 474, 332, 306, t(this, 'Live Preview'));

    this.add.text(26, 42, t(this, '종류1/종류2/종류3 셀렉트로 캐릭터와 이펙트의 동작을 바로 확인합니다.'), {
      fontFamily: 'Segoe UI',
      fontSize: '13px',
      color: '#2f241a',
      wordWrap: { width: 308 },
    });

    this.buildControls();

    this.previewMetaText = this.add.text(28, 140, '', {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      color: '#5a4a39',
      wordWrap: { width: 304 },
      lineSpacing: 2,
    });
    this.previewHintText = this.add.text(28, 608, t(this, '상단 셀렉트 변경 즉시 갱신 | B: 옵션으로 복귀'), {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#f7efd6',
      stroke: '#1b140f',
      strokeThickness: 3,
    });

    this.sourceContainer = this.add.container(0, 0);
    this.add.rectangle(180, 446, 292, 194, 0x1b140f, 0.2).setStrokeStyle(2, 0xf6edd0, 0.14);
    this.add.line(0, 0, 42, 536, 318, 536, 0x4c3f31, 0.32).setOrigin(0, 0);
    this.add.line(0, 0, 42, 552, 318, 552, 0xf6edd0, 0.2).setOrigin(0, 0);

    this.previewGraphics = this.add.graphics().setDepth(5);
    this.previewActor = this.add
      .image(116, 520, ATLAS_KEY, AtlasFrame.Hero)
      .setDisplaySize(52, 52)
      .setOrigin(0.5, 1)
      .setDepth(6);
    this.previewAnchor = this.add
      .image(108, 522, ATLAS_KEY, AtlasFrame.Star)
      .setDisplaySize(38, 38)
      .setOrigin(0.5)
      .setDepth(6)
      .setVisible(false);
    this.previewTarget = this.add
      .image(264, 500, ATLAS_KEY, AtlasFrame.StageNode)
      .setDisplaySize(44, 44)
      .setOrigin(0.5)
      .setDepth(6);

    createButton(this, 88, 582, {
      width: 124,
      height: 36,
      label: t(this, 'ui.options'),
      iconFrame: AtlasFrame.HomeIcon,
      onClick: () => this.scene.start('options'),
    });
    createButton(this, 236, 582, {
      width: 124,
      height: 36,
      label: t(this, 'ui.village'),
      iconFrame: AtlasFrame.MapIcon,
      backgroundFrame: AtlasFrame.GoldButton,
      onClick: () => this.scene.start('village'),
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.controlsDom.destroy();
      this.controlsRoot.remove();
    });

    this.syncSelection(true);
    this.ensureRuntimeAnimationState();
  }

  update(_: number, delta: number): void {
    this.stepSimulation(delta);
  }

  public stepSimulation(deltaMs: number): void {
    this.elapsedMs += deltaMs;

    this.refreshRuntimeDependentPanels();
    this.renderPreview();
  }

  public renderGameToText(): string {
    const subject = this.getSelectedSubject();
    const action = this.getSelectedAction();
    const runtimeClip = this.getSelectedRuntimeClip();
    const resolvedFrameCount = runtimeClip?.frameCount ?? action.frameCount;
    const resolvedFps = runtimeClip?.fps ?? action.fps;

    return JSON.stringify(
      buildDebugState('animation_viewer', this.snapshot, {
        category: this.selection.category,
        subjectId: subject.id,
        subjectName: subject.name,
        actionId: action.id,
        frameCount: resolvedFrameCount,
        fps: resolvedFps,
        loopMode: action.loopMode,
        availableActions: ['change_category', 'change_subject', 'change_action', 'back_to_options'],
      }),
    );
  }

  private buildControls(): void {
    const wrapper = document.createElement('div');
    wrapper.style.width = '320px';
    wrapper.style.display = 'block';
    wrapper.style.whiteSpace = 'nowrap';
    wrapper.style.fontSize = '0';
    wrapper.style.pointerEvents = 'auto';
    wrapper.style.fontFamily = 'Segoe UI, sans-serif';

    const categoryField = this.createSelectField(t(this, '종류1'), 'category');
    const subjectField = this.createSelectField(t(this, '종류2'), 'subject');
    const actionField = this.createSelectField(t(this, '종류3'), 'action');

    wrapper.append(categoryField.root, subjectField.root, actionField.root);
    this.controlsRoot = wrapper;
    this.categorySelect = categoryField.select;
    this.subjectSelect = subjectField.select;
    this.actionSelect = actionField.select;

    this.categorySelect.addEventListener('change', () => {
      this.selection.category = this.categorySelect.value as AnimationViewerCategory;
      this.syncSelection(true);
    });
    this.subjectSelect.addEventListener('change', () => {
      this.selection.subjectId = this.subjectSelect.value;
      this.syncSelection(false, true);
    });
    this.actionSelect.addEventListener('change', () => {
      this.selection.actionId = this.actionSelect.value;
      this.syncSelection(false);
    });

    this.controlsDom = this.add.dom(180, 102, wrapper).setDepth(20);
  }

  private createSelectField(labelText: string, fieldId: string): {
    root: HTMLDivElement;
    select: HTMLSelectElement;
  } {
    const root = document.createElement('div');
    root.style.display = 'inline-flex';
    root.style.flexDirection = 'column';
    root.style.gap = '4px';
    root.style.width = '102px';
    root.style.marginRight = fieldId === 'action' ? '0' : '7px';
    root.style.verticalAlign = 'top';

    const label = document.createElement('label');
    label.textContent = labelText;
    label.style.fontSize = '12px';
    label.style.fontWeight = '600';
    label.style.color = '#3b3128';
    label.style.whiteSpace = 'nowrap';
    label.htmlFor = `animation-viewer-${fieldId}`;

    const select = document.createElement('select');
    select.id = `animation-viewer-${fieldId}`;
    select.setAttribute('data-viewer-field', fieldId);
    select.setAttribute('aria-label', labelText);
    select.style.width = '100%';
    select.style.minWidth = '0';
    select.style.height = '32px';
    select.style.border = '1px solid #8f7d69';
    select.style.borderRadius = '6px';
    select.style.background = '#fbf6e5';
    select.style.color = '#2f241a';
    select.style.padding = '4px 6px';
    select.style.fontSize = '12px';

    root.append(label, select);
    return { root, select };
  }

  private syncSelection(resetSubject = false, resetAction = false): void {
    this.populateSelect(
      this.categorySelect,
      getAnimationViewerCategories().map((entry) => ({ value: entry.id, label: t(this, entry.name) })),
      this.selection.category,
    );

    const subjects = getAnimationViewerSubjects(this.selection.category);
    if (resetSubject || !subjects.some((entry) => entry.id === this.selection.subjectId)) {
      this.selection.subjectId = subjects[0]?.id ?? '';
    }

    this.populateSelect(
      this.subjectSelect,
      subjects.map((entry) => ({ value: entry.id, label: t(this, entry.name) })),
      this.selection.subjectId,
    );

    const subject = this.getSelectedSubject();
    if (resetAction || !subject.actions.some((entry) => entry.id === this.selection.actionId)) {
      this.selection.actionId = subject.actions[0]?.id ?? '';
    }

    this.populateSelect(
      this.actionSelect,
      subject.actions.map((entry) => ({ value: entry.id, label: t(this, entry.name) })),
      this.selection.actionId,
    );

    this.elapsedMs = 0;
    this.refreshRuntimeDependentPanels(true);
    this.renderPreview();
  }

  private refreshRuntimeDependentPanels(force = false): void {
    this.ensureRuntimeAnimationState();
    const runtimeClip = this.getSelectedRuntimeClip();
    const nextSignature = runtimeClip
      ? `${runtimeClip.textureKey}:${runtimeClip.frameCount}:${runtimeClip.frameWidth}x${runtimeClip.frameHeight}`
      : 'none';

    if (!force && nextSignature === this.lastRuntimeClipSignature) {
      return;
    }

    this.lastRuntimeClipSignature = nextSignature;
    this.refreshSourceFrames();
    this.refreshMetaText();
  }

  private ensureRuntimeAnimationState(): void {
    const runtimeState = getRuntimeAnimationState(this);
    const hasRuntimeData =
      runtimeState.manifestFound || runtimeState.subjectCount > 0 || runtimeState.availableClipCount > 0;

    if (hasRuntimeData || this.runtimeAnimationLoadPromise) {
      return;
    }

    this.runtimeAnimationLoadPromise = loadRuntimeAnimationAssets(this)
      .then((state) => {
        setRuntimeAnimationState(this, state);
      })
      .finally(() => {
        this.runtimeAnimationLoadPromise = null;
        this.refreshRuntimeDependentPanels(true);
        this.renderPreview();
      });
  }

  private populateSelect(
    select: HTMLSelectElement,
    options: Array<{ value: string; label: string }>,
    selectedValue: string,
  ): void {
    select.innerHTML = '';

    for (const option of options) {
      const nextOption = document.createElement('option');
      nextOption.value = option.value;
      nextOption.textContent = option.label;
      nextOption.selected = option.value === selectedValue;
      select.append(nextOption);
    }
  }

  private refreshSourceFrames(): void {
    this.sourceContainer.removeAll(true);
    const subject = this.getSelectedSubject();
    const action = this.getSelectedAction();
    const runtimeClip = this.getSelectedRuntimeClip();
    const sampleCount = runtimeClip
      ? Math.min(6, Math.max(4, runtimeClip.frameCount))
      : Math.min(6, Math.max(4, action.frameCount));

    for (let index = 0; index < sampleCount; index += 1) {
      const progress = sampleCount === 1 ? 0 : index / (sampleCount - 1);
      const centerX = 48 + index * 52;
      const centerY = 236;

      const cell = this.add.container(0, 0);
      cell.add(
        this.add
          .rectangle(centerX, centerY, 44, 92, 0x1b140f, 0.08)
          .setStrokeStyle(1, 0x8f7d69, 0.4),
      );
      cell.add(
        this.add.text(centerX - 14, centerY - 40, `${index + 1}`, {
          fontFamily: 'Segoe UI',
          fontSize: '10px',
          color: '#5a4a39',
        }),
      );

      if (runtimeClip) {
        this.drawRuntimeFrameSnapshot(cell, runtimeClip, action, progress, centerX, centerY + 18);
      } else if (this.selection.category === 'character') {
        this.drawCharacterSnapshot(cell, subject, action, progress, centerX, centerY + 18, 0.48);
      } else if (this.selection.category === 'npc') {
        this.drawNpcSnapshot(cell, subject, action, progress, centerX, centerY + 18, 0.48);
      } else if (this.selection.category === 'enemy') {
        this.drawEnemySnapshot(cell, subject, action, progress, centerX, centerY + 18, 0.54);
      } else {
        this.drawEffectSnapshot(cell, subject, action, progress, centerX, centerY + 10, 0.54);
      }

      this.sourceContainer.add(cell);
    }
  }

  private drawRuntimeFrameSnapshot(
    parent: Phaser.GameObjects.Container,
    runtimeClip: RuntimeAnimationClipEntry,
    action: AnimationClipDefinition,
    progress: number,
    centerX: number,
    centerY: number,
  ): void {
    const frameIndex = this.getRuntimeFrameIndex(runtimeClip, action, progress);
    const maxWidth = 36;
    const maxHeight = 72;
    const scale = Math.min(maxWidth / runtimeClip.frameWidth, maxHeight / runtimeClip.frameHeight);
    const originY = runtimeClip.category === 'effect' ? 0.5 : 1;

    parent.add(
      this.add
        .image(centerX, centerY, runtimeClip.textureKey, frameIndex)
        .setOrigin(0.5, originY)
        .setDisplaySize(runtimeClip.frameWidth * scale, runtimeClip.frameHeight * scale),
    );
  }

  private drawCharacterSnapshot(
    parent: Phaser.GameObjects.Container,
    subject: AnimationSubjectDefinition,
    action: AnimationClipDefinition,
    progress: number,
    centerX: number,
    centerY: number,
    scale: number,
  ): void {
    const pose = this.sampleCharacterPose(subject.role ?? 'leader', action.previewKind, progress);
    const graphics = this.add.graphics();

    graphics.fillStyle(0x000000, 0.12);
    graphics.fillEllipse(centerX, centerY + 18, 24, 8);
    this.drawPreviewEffects(graphics, subject, action.previewKind, progress, centerX, centerY, scale);

    const sprite = this.add
      .image(centerX + pose.x * scale, centerY + pose.y * scale, ATLAS_KEY, subject.atlasFrame)
      .setDisplaySize(48 * scale, 48 * scale)
      .setOrigin(0.5, 1)
      .setTint(subject.tint)
      .setAlpha(pose.alpha)
      .setScale(pose.scaleX, pose.scaleY)
      .setRotation(pose.rotation);

    parent.add(graphics);
    parent.add(sprite);

    if (pose.showTarget) {
      parent.add(
        this.add
          .image(centerX + 18, centerY - 2, ATLAS_KEY, this.getTargetFrame(subject, action.previewKind))
          .setDisplaySize(18, 18)
          .setTint(0xffffff)
          .setAlpha(0.9),
      );
    }
  }

  private drawEnemySnapshot(
    parent: Phaser.GameObjects.Container,
    subject: AnimationSubjectDefinition,
    action: AnimationClipDefinition,
    progress: number,
    centerX: number,
    centerY: number,
    scale: number,
  ): void {
    const pose = this.sampleEnemyPose(action.previewKind, progress, subject.atlasFrame === AtlasFrame.BossNode);
    const graphics = this.add.graphics();
    const baseSize = subject.atlasFrame === AtlasFrame.BossNode ? 56 : 48;

    graphics.fillStyle(0x000000, 0.12);
    graphics.fillEllipse(centerX, centerY + 18, subject.atlasFrame === AtlasFrame.BossNode ? 32 : 26, 8);
    this.drawPreviewEffects(graphics, subject, action.previewKind, progress, centerX, centerY, scale);

    const sprite = this.add
      .image(centerX + pose.x * scale, centerY + pose.y * scale, ATLAS_KEY, subject.atlasFrame)
      .setDisplaySize(baseSize * scale, baseSize * scale)
      .setOrigin(0.5, 1)
      .setTint(subject.tint)
      .setAlpha(pose.alpha)
      .setScale(pose.scaleX, pose.scaleY)
      .setRotation(pose.rotation);

    parent.add(graphics);
    parent.add(sprite);

    if (pose.showTarget) {
      parent.add(
        this.add
          .image(centerX + 18, centerY - 2, ATLAS_KEY, this.getTargetFrame(subject, action.previewKind))
          .setDisplaySize(subject.atlasFrame === AtlasFrame.BossNode ? 22 : 18, subject.atlasFrame === AtlasFrame.BossNode ? 22 : 18)
          .setTint(0xffffff)
          .setAlpha(0.9),
      );
    }
  }

  private drawNpcSnapshot(
    parent: Phaser.GameObjects.Container,
    subject: AnimationSubjectDefinition,
    action: AnimationClipDefinition,
    progress: number,
    centerX: number,
    centerY: number,
    scale: number,
  ): void {
    const pose = this.sampleNpcPose(action.previewKind, progress);
    const graphics = this.add.graphics();

    graphics.fillStyle(0x000000, 0.12);
    graphics.fillEllipse(centerX, centerY + 18, 22, 8);
    this.drawPreviewEffects(graphics, subject, action.previewKind, progress, centerX, centerY, scale * 0.84);

    const sprite = this.add
      .image(centerX + pose.x * scale, centerY + pose.y * scale, ATLAS_KEY, subject.atlasFrame)
      .setDisplaySize(44 * scale, 44 * scale)
      .setOrigin(0.5, 1)
      .setTint(subject.tint)
      .setAlpha(pose.alpha)
      .setScale(pose.scaleX, pose.scaleY)
      .setRotation(pose.rotation);

    parent.add(graphics);
    parent.add(sprite);
  }

  private drawEffectSnapshot(
    parent: Phaser.GameObjects.Container,
    subject: AnimationSubjectDefinition,
    action: AnimationClipDefinition,
    progress: number,
    centerX: number,
    centerY: number,
    scale: number,
  ): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 0.12);
    graphics.fillEllipse(centerX, centerY + 24, 26, 8);
    graphics.fillStyle(subject.tint, 0.18);
    graphics.fillCircle(centerX - 14, centerY + 12, 8);
    graphics.fillCircle(centerX + 14, centerY - 10, 8);
    this.drawPreviewEffects(graphics, subject, action.previewKind, progress, centerX, centerY, scale * 1.2);

    parent.add(graphics);
    parent.add(
      this.add
        .image(centerX - 14, centerY + 12, ATLAS_KEY, subject.atlasFrame)
        .setDisplaySize(18, 18)
        .setTint(subject.tint),
    );
    parent.add(
      this.add
        .image(centerX + 14, centerY - 10, ATLAS_KEY, this.getTargetFrame(subject, action.previewKind))
        .setDisplaySize(18, 18),
    );
  }

  private refreshMetaText(): void {
    const subject = this.getSelectedSubject();
    const action = this.getSelectedAction();
    const runtimeClip = this.getSelectedRuntimeClip();
    const categoryLabel = this.getCategoryLabel(this.selection.category);

    this.previewMetaText.setText([
      t(this, '선택: {category} / {subject} / {action}', {
        category: categoryLabel,
        subject: t(this, subject.name),
        action: t(this, action.name),
      }),
      t(this, '프레임: {frameCount}f @ {fps}fps / 재생: {loopMode}', {
        frameCount: action.frameCount,
        fps: action.fps,
        loopMode: t(this, action.loopMode),
      }),
      runtimeClip
        ? t(this, 'runtime clip: {textureKey} ({frameCount}f {frameSize})', {
            textureKey: runtimeClip.textureKey,
            frameCount: runtimeClip.frameCount,
            frameSize: `${runtimeClip.frameWidth}x${runtimeClip.frameHeight}`,
          })
        : t(this, 'runtime clip: none, placeholder preview fallback'),
      t(this, '용도: 개발 단계에서 도트 동작과 효과를 빠르게 확인하는 내부 검수 화면'),
    ]);
  }

  private renderPreview(): void {
    const subject = this.getSelectedSubject();
    const action = this.getSelectedAction();
    const runtimeClip = this.getSelectedRuntimeClip();
    const durationMs = Math.max(
      500,
      ((runtimeClip?.frameCount ?? action.frameCount) / (runtimeClip?.fps ?? action.fps)) * 1000,
    );
    const progress =
      action.loopMode === 'loop'
        ? (this.elapsedMs % durationMs) / durationMs
        : Math.min(1, this.elapsedMs / durationMs);

    this.previewGraphics.clear();

    if (this.selection.category === 'character') {
      const pose = this.sampleCharacterPose(subject.role ?? 'leader', action.previewKind, progress);
      this.previewActor.setVisible(true);
      this.previewAnchor.setVisible(false);
      this.previewTarget.setVisible(pose.showTarget);
      if (runtimeClip) {
        const frameIndex = this.getRuntimeFrameIndex(runtimeClip, action, progress);
        const scale = Math.min(60 / runtimeClip.frameWidth, 72 / runtimeClip.frameHeight);

        this.previewActor
          .setTexture(runtimeClip.textureKey, frameIndex)
          .clearTint()
          .setDisplaySize(runtimeClip.frameWidth * scale, runtimeClip.frameHeight * scale);
      } else {
        this.previewActor
          .setTexture(ATLAS_KEY, subject.atlasFrame)
          .setTint(subject.tint)
          .setDisplaySize(52, 52);
      }
      this.previewActor
        .setPosition(116 + pose.x, 520 + pose.y)
        .setRotation(pose.rotation)
        .setAlpha(pose.alpha)
        .setScale(pose.scaleX, pose.scaleY);
      this.previewTarget
        .setFrame(this.getTargetFrame(subject, action.previewKind))
        .setPosition(262, action.previewKind === 'fx_burst' ? 468 : 500)
        .setDisplaySize(this.getTargetFrame(subject, action.previewKind) === AtlasFrame.BossNode ? 52 : 44, this.getTargetFrame(subject, action.previewKind) === AtlasFrame.BossNode ? 52 : 44);

      this.previewGraphics.fillStyle(0x000000, 0.14);
      this.previewGraphics.fillEllipse(118, 540, 64, 14);
      this.drawPreviewEffects(this.previewGraphics, subject, action.previewKind, progress, 116 + pose.x, 488 + pose.y, 1);
      return;
    }

    if (this.selection.category === 'npc') {
      const pose = this.sampleNpcPose(action.previewKind, progress);
      this.previewActor.setVisible(true);
      this.previewAnchor.setVisible(false);
      this.previewTarget.setVisible(false);
      if (runtimeClip) {
        const frameIndex = this.getRuntimeFrameIndex(runtimeClip, action, progress);
        const scale = Math.min(52 / runtimeClip.frameWidth, 68 / runtimeClip.frameHeight);

        this.previewActor
          .setTexture(runtimeClip.textureKey, frameIndex)
          .clearTint()
          .setDisplaySize(runtimeClip.frameWidth * scale, runtimeClip.frameHeight * scale);
      } else {
        this.previewActor
          .setTexture(ATLAS_KEY, subject.atlasFrame)
          .setTint(subject.tint)
          .setDisplaySize(48, 48);
      }
      this.previewActor
        .setPosition(116 + pose.x, 520 + pose.y)
        .setRotation(pose.rotation)
        .setAlpha(pose.alpha)
        .setScale(pose.scaleX, pose.scaleY);

      this.previewGraphics.fillStyle(0x000000, 0.14);
      this.previewGraphics.fillEllipse(118, 540, 50, 12);
      this.drawPreviewEffects(this.previewGraphics, subject, action.previewKind, progress, 116 + pose.x, 492 + pose.y, 0.92);
      return;
    }

    if (this.selection.category === 'enemy') {
      const pose = this.sampleEnemyPose(action.previewKind, progress, subject.atlasFrame === AtlasFrame.BossNode);
      this.previewActor.setVisible(true);
      this.previewAnchor.setVisible(false);
      this.previewTarget.setVisible(pose.showTarget);
      if (runtimeClip) {
        const maxWidth = subject.atlasFrame === AtlasFrame.BossNode ? 84 : 60;
        const maxHeight = subject.atlasFrame === AtlasFrame.BossNode ? 84 : 72;
        const scale = Math.min(maxWidth / runtimeClip.frameWidth, maxHeight / runtimeClip.frameHeight);
        const frameIndex = this.getRuntimeFrameIndex(runtimeClip, action, progress);

        this.previewActor
          .setTexture(runtimeClip.textureKey, frameIndex)
          .clearTint()
          .setDisplaySize(runtimeClip.frameWidth * scale, runtimeClip.frameHeight * scale);
      } else {
        const baseSize = subject.atlasFrame === AtlasFrame.BossNode ? 68 : 56;
        this.previewActor
          .setTexture(ATLAS_KEY, subject.atlasFrame)
          .setTint(subject.tint)
          .setDisplaySize(baseSize, baseSize);
      }
      this.previewActor
        .setPosition(124 + pose.x, 520 + pose.y)
        .setRotation(pose.rotation)
        .setAlpha(pose.alpha)
        .setScale(pose.scaleX, pose.scaleY);
      this.previewTarget
        .setFrame(this.getTargetFrame(subject, action.previewKind))
        .setPosition(262, action.previewKind === 'heavy' ? 492 : 500)
        .setDisplaySize(this.getTargetFrame(subject, action.previewKind) === AtlasFrame.BossNode ? 52 : 44, this.getTargetFrame(subject, action.previewKind) === AtlasFrame.BossNode ? 52 : 44);

      this.previewGraphics.fillStyle(0x000000, 0.14);
      this.previewGraphics.fillEllipse(124, 540, subject.atlasFrame === AtlasFrame.BossNode ? 74 : 58, 14);
      this.drawPreviewEffects(this.previewGraphics, subject, action.previewKind, progress, 124 + pose.x, 490 + pose.y, 1.08);
      return;
    }

    this.previewActor.setVisible(false);
    this.previewAnchor.setVisible(true);
    this.previewTarget.setVisible(true);
    if (runtimeClip) {
      const frameIndex = this.getRuntimeFrameIndex(runtimeClip, action, progress);
      const scale = Math.min(64 / runtimeClip.frameWidth, 64 / runtimeClip.frameHeight);

      this.previewAnchor
        .setTexture(runtimeClip.textureKey, frameIndex)
        .clearTint()
        .setPosition(104, 500)
        .setDisplaySize(runtimeClip.frameWidth * scale, runtimeClip.frameHeight * scale);
    } else {
      this.previewAnchor
        .setTexture(ATLAS_KEY, subject.atlasFrame)
        .setTint(subject.tint)
        .setPosition(104, 500)
        .setDisplaySize(42, 42);
    }
    this.previewTarget
      .setFrame(this.getTargetFrame(subject, action.previewKind))
      .setPosition(262, action.previewKind === 'fx_burst' ? 478 : 500)
      .setDisplaySize(this.getTargetFrame(subject, action.previewKind) === AtlasFrame.BossNode ? 52 : 44, this.getTargetFrame(subject, action.previewKind) === AtlasFrame.BossNode ? 52 : 44);

    this.previewGraphics.fillStyle(0x000000, 0.14);
    this.previewGraphics.fillEllipse(104, 540, 48, 12);
    this.previewGraphics.fillEllipse(262, 540, 54, 12);
    this.drawPreviewEffects(this.previewGraphics, subject, action.previewKind, progress, 182, 498, 1.2);
  }

  private sampleCharacterPose(
    role: BattleRole,
    previewKind: AnimationPreviewKind,
    progress: number,
  ): CharacterPoseState {
    const cycle = Math.sin(progress * Math.PI * 2);
    const bounce = Math.abs(cycle);
    const roleScale =
      role === 'guardian' ? 1.08 : role === 'assassin' ? 0.96 : role === 'mage' || role === 'healer' ? 0.98 : 1;

    switch (previewKind) {
      case 'idle':
      case 'talk':
        return { x: 0, y: -bounce * 4, scaleX: roleScale, scaleY: roleScale, rotation: cycle * 0.03, alpha: 1, showTarget: false };
      case 'walk':
        return { x: -18 + progress * 36, y: -bounce * 6, scaleX: roleScale, scaleY: roleScale, rotation: cycle * 0.05, alpha: 1, showTarget: false };
      case 'run':
        return { x: -28 + progress * 56, y: -bounce * 9, scaleX: roleScale * 1.02, scaleY: roleScale * 0.98, rotation: cycle * 0.08, alpha: 1, showTarget: false };
      case 'attack':
        return {
          x: progress < 0.4 ? -8 : progress < 0.72 ? 28 : 10,
          y: -bounce * 5,
          scaleX: roleScale * (progress < 0.5 ? 0.98 : 1.05),
          scaleY: roleScale,
          rotation: progress < 0.3 ? -0.24 : progress < 0.72 ? 0.32 : 0.05,
          alpha: 1,
          showTarget: true,
        };
      case 'heavy':
        return {
          x: progress < 0.34 ? -18 : progress < 0.76 ? 34 : 12,
          y: -bounce * 4,
          scaleX: roleScale * 1.06,
          scaleY: roleScale * 0.96,
          rotation: progress < 0.34 ? -0.36 : progress < 0.76 ? 0.48 : 0.12,
          alpha: 1,
          showTarget: true,
        };
      case 'cast':
      case 'cast_release':
        return {
          x: 4,
          y: -bounce * 4,
          scaleX: roleScale,
          scaleY: roleScale,
          rotation: -0.08 + cycle * 0.04,
          alpha: 1,
          showTarget: true,
        };
      case 'cast_loop':
      case 'heal':
      case 'buff':
      case 'pray':
        return {
          x: 0,
          y: -6 - bounce * 4,
          scaleX: roleScale,
          scaleY: roleScale,
          rotation: cycle * 0.02,
          alpha: 1,
          showTarget: previewKind === 'heal' || previewKind === 'buff',
        };
      case 'hit':
        return { x: -22 + progress * 8, y: 4, scaleX: roleScale, scaleY: roleScale, rotation: -0.28, alpha: 1, showTarget: false };
      case 'dash':
      case 'charge':
        return {
          x: -34 + progress * 82,
          y: -bounce * 2,
          scaleX: roleScale * 1.05,
          scaleY: roleScale * 0.95,
          rotation: 0.12,
          alpha: previewKind === 'dash' ? 0.72 + progress * 0.28 : 1,
          showTarget: true,
        };
      case 'victory':
        return { x: 0, y: -bounce * 14, scaleX: roleScale * 1.04, scaleY: roleScale * 0.98, rotation: cycle * 0.06, alpha: 1, showTarget: false };
      case 'down':
        return { x: 6, y: 12, scaleX: roleScale, scaleY: roleScale, rotation: 1.2 * progress, alpha: 1 - progress * 0.2, showTarget: false };
      case 'guard':
        return { x: -8, y: 0, scaleX: roleScale, scaleY: roleScale, rotation: -0.14, alpha: 1, showTarget: false };
      case 'aim':
      case 'shoot':
        return { x: -4, y: -bounce * 2, scaleX: roleScale, scaleY: roleScale, rotation: -0.08, alpha: 1, showTarget: true };
      case 'reload':
        return { x: -10 + progress * 18, y: 2, scaleX: roleScale, scaleY: roleScale, rotation: 0.12 - progress * 0.12, alpha: 1, showTarget: false };
      case 'taunt':
        return { x: 0, y: -bounce * 8, scaleX: roleScale * 1.04, scaleY: roleScale, rotation: cycle * 0.08, alpha: 1, showTarget: false };
      case 'interact':
        return { x: 6, y: -progress * 8, scaleX: roleScale, scaleY: roleScale, rotation: 0.04, alpha: 1, showTarget: false };
      case 'stealth':
        return { x: -18 + progress * 40, y: -4, scaleX: roleScale, scaleY: roleScale, rotation: 0, alpha: 0.28 + progress * 0.72, showTarget: false };
      default:
        return { x: 0, y: 0, scaleX: roleScale, scaleY: roleScale, rotation: 0, alpha: 1, showTarget: false };
    }
  }

  private sampleEnemyPose(
    previewKind: AnimationPreviewKind,
    progress: number,
    isBoss: boolean,
  ): CharacterPoseState {
    const cycle = Math.sin(progress * Math.PI * 2);
    const bounce = Math.abs(cycle);
    const baseScale = isBoss ? 1.12 : 1;

    switch (previewKind) {
      case 'idle':
      case 'talk':
        return { x: 0, y: -bounce * 3, scaleX: baseScale, scaleY: baseScale, rotation: cycle * 0.02, alpha: 1, showTarget: false };
      case 'walk':
        return { x: -14 + progress * 28, y: -bounce * 4, scaleX: baseScale, scaleY: baseScale, rotation: cycle * 0.04, alpha: 1, showTarget: false };
      case 'run':
        return { x: -22 + progress * 44, y: -bounce * 6, scaleX: baseScale * 1.02, scaleY: baseScale * 0.98, rotation: cycle * 0.06, alpha: 1, showTarget: false };
      case 'attack':
        return { x: progress < 0.4 ? -6 : progress < 0.74 ? 18 : 8, y: -bounce * 2, scaleX: baseScale * 1.02, scaleY: baseScale, rotation: progress < 0.4 ? -0.14 : 0.22, alpha: 1, showTarget: true };
      case 'heavy':
        return { x: progress < 0.36 ? -12 : progress < 0.78 ? 24 : 10, y: -bounce * 2, scaleX: baseScale * 1.04, scaleY: baseScale * 0.98, rotation: progress < 0.36 ? -0.22 : 0.3, alpha: 1, showTarget: true };
      case 'cast':
      case 'cast_release':
        return { x: 4, y: -bounce * 2, scaleX: baseScale, scaleY: baseScale, rotation: cycle * 0.02, alpha: 1, showTarget: true };
      case 'hit':
        return { x: -14 + progress * 6, y: 4, scaleX: baseScale, scaleY: baseScale, rotation: -0.18, alpha: 1, showTarget: false };
      case 'dash':
      case 'charge':
        return { x: -28 + progress * 60, y: -bounce * 2, scaleX: baseScale * 1.04, scaleY: baseScale * 0.96, rotation: 0.12, alpha: 1, showTarget: true };
      case 'victory':
      case 'taunt':
        return { x: 0, y: -bounce * 10, scaleX: baseScale * 1.04, scaleY: baseScale, rotation: cycle * 0.04, alpha: 1, showTarget: false };
      case 'down':
        return { x: 6, y: 12, scaleX: baseScale, scaleY: baseScale, rotation: 1.1 * progress, alpha: 1 - progress * 0.18, showTarget: false };
      default:
        return { x: 0, y: 0, scaleX: baseScale, scaleY: baseScale, rotation: 0, alpha: 1, showTarget: false };
    }
  }

  private sampleNpcPose(
    previewKind: AnimationPreviewKind,
    progress: number,
  ): CharacterPoseState {
    const cycle = Math.sin(progress * Math.PI * 2);
    const bounce = Math.abs(cycle);

    switch (previewKind) {
      case 'walk':
        return { x: -14 + progress * 28, y: -bounce * 4, scaleX: 1, scaleY: 1, rotation: cycle * 0.03, alpha: 1, showTarget: false };
      case 'talk':
      case 'interact':
        return { x: 0, y: -bounce * 4, scaleX: 1, scaleY: 1, rotation: cycle * 0.03, alpha: 1, showTarget: false };
      case 'guard':
        return { x: 0, y: -bounce * 2, scaleX: 1, scaleY: 1, rotation: -0.05, alpha: 1, showTarget: false };
      default:
        return { x: 0, y: -bounce * 2, scaleX: 1, scaleY: 1, rotation: cycle * 0.02, alpha: 1, showTarget: false };
    }
  }

  private drawPreviewEffects(
    graphics: Phaser.GameObjects.Graphics,
    subject: AnimationSubjectDefinition,
    previewKind: AnimationPreviewKind,
    progress: number,
    originX: number,
    originY: number,
    scale: number,
  ): void {
    const eased = Phaser.Math.Easing.Sine.InOut(progress);
    const alpha = 1 - Math.max(0, progress - 0.7);
    const startX = this.selection.category === 'effect' ? 104 : originX - 12;
    const endX = this.selection.category === 'effect' ? 262 : 262;
    const endY = this.selection.category === 'effect' ? 500 : 498;

    switch (previewKind) {
      case 'attack':
      case 'fx_slash': {
        graphics.lineStyle(4 * scale, subject.tint, 0.88);
        graphics.beginPath();
        graphics.moveTo(originX - 14 * scale, originY + 10 * scale);
        graphics.lineTo(endX - 12 * scale + eased * 8, endY - 18 * scale);
        graphics.strokePath();
        break;
      }
      case 'heavy':
      case 'fx_impact': {
        graphics.fillStyle(subject.tint, 0.18 * alpha);
        graphics.fillCircle(endX, endY, (18 + eased * 20) * scale);
        graphics.lineStyle(3 * scale, subject.tint, 0.9 * alpha);
        graphics.strokeCircle(endX, endY, (16 + eased * 18) * scale);
        break;
      }
      case 'cast':
      case 'cast_release':
      case 'shoot':
      case 'fx_projectile': {
        const projectileX = Phaser.Math.Linear(startX, endX, eased);
        const projectileY = Phaser.Math.Linear(originY - 12 * scale, endY - 10 * scale, eased);
        graphics.lineStyle(2 * scale, subject.tint, 0.46);
        graphics.beginPath();
        graphics.moveTo(startX, originY - 12 * scale);
        graphics.lineTo(projectileX, projectileY);
        graphics.strokePath();
        graphics.fillStyle(subject.tint, 0.9);
        graphics.fillCircle(projectileX, projectileY, 6 * scale);
        break;
      }
      case 'cast_loop':
      case 'fx_telegraph': {
        graphics.fillStyle(subject.tint, 0.1);
        graphics.fillCircle(endX, endY, (20 + eased * 18) * scale);
        graphics.lineStyle(3 * scale, subject.tint, 0.82);
        graphics.strokeCircle(endX, endY, (18 + eased * 16) * scale);
        break;
      }
      case 'buff':
      case 'fx_buff': {
        graphics.lineStyle(3 * scale, 0xffdf8f, 0.86);
        graphics.strokeCircle(originX, originY - 4 * scale, (20 + eased * 8) * scale);
        graphics.strokeCircle(originX, originY - 4 * scale, (12 + eased * 12) * scale);
        break;
      }
      case 'heal':
      case 'fx_heal': {
        graphics.lineStyle(3 * scale, 0x8fe4a3, 0.88);
        graphics.strokeCircle(originX, originY - 6 * scale, (16 + eased * 10) * scale);
        graphics.fillStyle(0x8fe4a3, 0.12);
        graphics.fillCircle(originX, originY - 6 * scale, (12 + eased * 8) * scale);
        break;
      }
      case 'guard':
      case 'fx_shield': {
        graphics.lineStyle(3 * scale, 0x8ec7ff, 0.86);
        graphics.strokeCircle(originX, originY - 4 * scale, (20 + eased * 4) * scale);
        graphics.strokeCircle(originX, originY - 4 * scale, (12 + eased * 6) * scale);
        break;
      }
      case 'dash':
      case 'charge':
      case 'fx_charge': {
        graphics.lineStyle(4 * scale, subject.tint, 0.78);
        graphics.beginPath();
        graphics.moveTo(originX - 36 * scale + eased * 24 * scale, originY + 4 * scale);
        graphics.lineTo(originX, originY - 2 * scale);
        graphics.strokePath();
        graphics.fillStyle(subject.tint, 0.28);
        graphics.fillCircle(originX, originY - 2 * scale, 10 * scale);
        break;
      }
      case 'aim': {
        graphics.lineStyle(2 * scale, 0xffdf8f, 0.7);
        graphics.strokeCircle(endX, endY, (14 + eased * 6) * scale);
        break;
      }
      case 'victory':
      case 'fx_burst': {
        graphics.fillStyle(subject.tint, 0.14 * alpha);
        graphics.fillCircle(endX, endY, (18 + eased * 18) * scale);
        graphics.lineStyle(3 * scale, subject.tint, 0.86 * alpha);
        graphics.strokeCircle(endX, endY, (16 + eased * 20) * scale);
        graphics.strokeCircle(endX + 14 * scale, endY - 14 * scale, (8 + eased * 6) * scale);
        break;
      }
      case 'taunt': {
        graphics.lineStyle(3 * scale, 0xffb27d, 0.86);
        graphics.strokeCircle(originX, originY - 6 * scale, (20 + eased * 12) * scale);
        graphics.strokeCircle(originX + 16 * scale, originY - 12 * scale, (8 + eased * 6) * scale);
        break;
      }
      case 'talk':
      case 'interact':
      case 'pray':
      case 'stealth':
      case 'hit':
      case 'reload': {
        graphics.fillStyle(subject.tint, 0.12);
        graphics.fillCircle(originX + 16 * scale, originY - 24 * scale, 8 * scale);
        break;
      }
    }
  }

  private getSelectedSubject(): AnimationSubjectDefinition {
    return getAnimationViewerSubject(this.selection.category, this.selection.subjectId);
  }

  private getSelectedAction(): AnimationClipDefinition {
    return getAnimationViewerAction(this.selection.category, this.selection.subjectId, this.selection.actionId);
  }

  private getTargetFrame(
    subject: AnimationSubjectDefinition,
    previewKind: AnimationPreviewKind,
  ): number {
    if (subject.id === 'boss_battle' || previewKind === 'fx_burst') {
      return AtlasFrame.BossNode;
    }

    if (previewKind === 'cast' || previewKind === 'cast_release' || previewKind === 'shoot' || previewKind === 'fx_projectile') {
      return AtlasFrame.StageNode;
    }

    return AtlasFrame.StageNode;
  }

  private getSelectedRuntimeClip(): RuntimeAnimationClipEntry | null {
    if (
      this.selection.category === 'character' ||
      this.selection.category === 'enemy' ||
      this.selection.category === 'npc' ||
      this.selection.category === 'effect'
    ) {
      return getRuntimeAnimationClip(
        this,
        this.selection.category,
        this.selection.subjectId,
        this.selection.actionId,
      );
    }

    return null;
  }

  private getCategoryLabel(category: AnimationViewerCategory): string {
    switch (category) {
      case 'character':
        return t(this, 'category.character');
      case 'enemy':
        return t(this, 'category.enemy');
      case 'npc':
        return t(this, 'category.npc');
      case 'effect':
        return t(this, 'category.effect');
      default:
        return t(this, category);
    }
  }

  private getRuntimeFrameIndex(
    runtimeClip: RuntimeAnimationClipEntry,
    action: AnimationClipDefinition,
    progress: number,
  ): number {
    const unclamped = Math.floor(progress * runtimeClip.frameCount);

    if (action.loopMode === 'loop') {
      return Phaser.Math.Wrap(unclamped, 0, runtimeClip.frameCount);
    }

    return Math.min(runtimeClip.frameCount - 1, unclamped);
  }
}
