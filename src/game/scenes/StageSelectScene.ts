import Phaser from 'phaser';
import { calculatePartyPower } from '../core/party';
import {
  AD_REWARD_FATIGUE,
  FATIGUE_COST_PER_STAGE,
  canAccessDifficulty,
  canEnterStage,
  enterStage,
  isStageUnlocked,
} from '../core/state';
import { AtlasFrame, ATLAS_KEY } from '../data/atlas';
import { getStageRouteMarkerKey } from '../data/stageSelectRuntimeArt';
import { getWorldMapLandmarkKey } from '../data/worldMapRuntimeArt';
import { getContinent, getStageBackgroundKey, getStagesForContinent } from '../data/world';
import { t, translateDifficulty } from '../services/i18n';
import { loadSnapshot, saveSnapshot } from '../services/save';
import {
  getSelectedContinent,
  getSelectedDifficulty,
  setSelectedDifficulty,
  setStageSelection,
} from '../services/session';
import { buildDebugState } from '../ui/debugHud';
import { createButton, paintBackdrop } from '../ui/widgets';
import type { SaveSnapshot, StageDefinition, StageDifficulty } from '../types';

interface StageNodeView {
  stage: StageDefinition;
  container: Phaser.GameObjects.Container;
  cardFill: Phaser.GameObjects.Rectangle;
  icon: Phaser.GameObjects.Image;
  statePip: Phaser.GameObjects.Arc;
  frame: Phaser.GameObjects.Image | null;
  border: Phaser.GameObjects.Rectangle;
  titleText: Phaser.GameObjects.Text;
  starsText: Phaser.GameObjects.Text;
  stateText: Phaser.GameObjects.Text;
  row: number;
  column: number;
}

const DIFFICULTY_ORDER: StageDifficulty[] = ['normal', 'hard', 'hell'];
const ROUTE_LIST_BOUNDS = new Phaser.Geom.Rectangle(14, 298, 332, 286);

export class StageSelectScene extends Phaser.Scene {
  private snapshot!: SaveSnapshot;
  private continentId!: string;
  private stages!: StageDefinition[];
  private selectedIndex = 0;
  private selectedDifficulty: StageDifficulty = 'normal';
  private detailText!: Phaser.GameObjects.Text;
  private fatigueText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private previewImage!: Phaser.GameObjects.Image;
  private nodes: StageNodeView[] = [];
  private stageScrollRow = 0;
  private readonly visibleStageRows = 5;
  private scrollTrack!: Phaser.GameObjects.Rectangle;
  private scrollThumb!: Phaser.GameObjects.Rectangle;
  private routeDragStartY: number | null = null;
  private routeDragStartIndex = 0;

  constructor() {
    super('stage-select');
  }

  create(): void {
    this.nodes = [];
    this.snapshot = loadSnapshot();
    this.continentId = getSelectedContinent(this) ?? 'continent_01';
    this.stages = getStagesForContinent(this.continentId);
    this.selectedDifficulty = getSelectedDifficulty(this) ?? 'normal';
    this.selectedIndex = Phaser.Math.Clamp(this.selectedIndex, 0, Math.max(0, this.stages.length - 1));
    this.routeDragStartY = null;

    this.drawLayout();
    this.input.on(Phaser.Input.Events.POINTER_DOWN, this.handleRoutePointerDown, this);
    this.input.on(Phaser.Input.Events.POINTER_MOVE, this.handleRoutePointerMove, this);
    this.input.on(Phaser.Input.Events.POINTER_UP, this.handleRoutePointerUp, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off(Phaser.Input.Events.POINTER_DOWN, this.handleRoutePointerDown, this);
      this.input.off(Phaser.Input.Events.POINTER_MOVE, this.handleRoutePointerMove, this);
      this.input.off(Phaser.Input.Events.POINTER_UP, this.handleRoutePointerUp, this);
    });
    this.refreshView();
  }

  update(_: number, delta: number): void {
    this.stepSimulation(delta);
  }

  public stepSimulation(_: number): void {
  }

  public renderGameToText(): string {
    const stage = this.stages[this.selectedIndex];
    return JSON.stringify(
      buildDebugState('stage_select', this.snapshot, {
        continentId: this.continentId,
        selectedStageId: stage.id,
        selectedDifficulty: this.selectedDifficulty,
        availableActions: ['cycle_difficulty', 'start_stage', 'back_to_map'],
      }),
    );
  }

  private drawLayout(): void {
    const selectedStage = this.stages[this.selectedIndex] ?? this.stages[0];
    const stageBackgroundKey = selectedStage ? getStageBackgroundKey(selectedStage.id) : '';

    if (stageBackgroundKey && this.textures.exists(stageBackgroundKey)) {
      this.add.image(180, 320, stageBackgroundKey).setDisplaySize(360, 640).setDepth(-6);
      this.add.rectangle(180, 320, 360, 640, 0x081018, 0.44).setDepth(-5);
    } else {
      paintBackdrop(this, AtlasFrame.GrassTile, 0xd4dfbc);
      this.add.rectangle(180, 320, 360, 640, 0x132233, 0.32).setDepth(-5);
    }

    this.add.rectangle(180, 128, 332, 240, 0x081018, 0.74).setStrokeStyle(1, 0xe3cf93, 0.16);
    this.add.rectangle(180, 128, 332, 240, 0x000000, 0.06);
    this.add.text(28, 26, t(this, 'ui.stage_select'), {
      fontFamily: 'Segoe UI',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#fff1cf',
      stroke: '#18120c',
      strokeThickness: 4,
    });

    const previewKey = this.getHeaderPreviewTextureKey();
    this.previewImage = this.add.image(180, 96, previewKey).setDepth(1);
    this.fitImageWithin(this.previewImage, previewKey, 252, 112);
    this.add.rectangle(180, 96, 270, 120, 0x05090d, 0.14).setStrokeStyle(1, 0xe2d0a5, 0.1);

    this.detailText = this.add.text(28, 156, '', {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#fff4d7',
      stroke: '#17110c',
      strokeThickness: 3,
      lineSpacing: 2,
      wordWrap: { width: 304 },
    });

    this.statusText = this.add.text(28, 224, '', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#f1ddb0',
      stroke: '#17110c',
      strokeThickness: 3,
      lineSpacing: 2,
      wordWrap: { width: 304 },
    });
    this.fatigueText = this.add.text(28, 250, '', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#bfffc8',
      stroke: '#17110c',
      strokeThickness: 3,
      wordWrap: { width: 304 },
    });

    this.add.rectangle(180, 440, 332, 302, 0x091119, 0.66).setStrokeStyle(1, 0xe3cf93, 0.14);
    this.add.text(28, 278, t(this, 'ui.route_progress'), {
      fontFamily: 'Segoe UI',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#fff1c8',
      stroke: '#18120c',
      strokeThickness: 4,
    });
    this.add.text(274, 280, '목록', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#b9c7ba',
      stroke: '#11170f',
      strokeThickness: 2,
    }).setOrigin(0.5);
    this.scrollTrack = this.add.rectangle(340, 440, 8, 250, 0x24303b, 0.72)
      .setStrokeStyle(1, 0xdac785, 0.2);
    this.scrollThumb = this.add.rectangle(340, 318, 8, 42, 0x9fd680, 0.92)
      .setStrokeStyle(1, 0xfff1bd, 0.45);
    this.add.text(340, 302, '^', {
      fontFamily: 'Segoe UI',
      fontSize: '13px',
      color: '#f2df9d',
      stroke: '#11170f',
      strokeThickness: 2,
    }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
      this.selectedIndex = Math.max(0, this.selectedIndex - this.visibleStageRows);
      this.refreshView();
    });
    this.add.text(340, 578, 'v', {
      fontFamily: 'Segoe UI',
      fontSize: '13px',
      color: '#f2df9d',
      stroke: '#11170f',
      strokeThickness: 2,
    }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
      this.selectedIndex = Math.min(this.stages.length - 1, this.selectedIndex + this.visibleStageRows);
      this.refreshView();
    });

    createButton(this, 86, 606, {
      width: 96,
      height: 36,
      label: t(this, 'ui.world'),
      iconFrame: AtlasFrame.MapIcon,
      onClick: () => this.scene.start('world-map'),
    });
    createButton(this, 180, 606, {
      width: 96,
      height: 36,
      label: t(this, 'ui.difficulty'),
      iconFrame: AtlasFrame.SwordIcon,
      backgroundFrame: AtlasFrame.GoldButton,
      onClick: () => this.cycleDifficulty(),
    });
    createButton(this, 274, 606, {
      width: 96,
      height: 36,
      label: t(this, 'ui.start'),
      iconFrame: AtlasFrame.StageNode,
      backgroundFrame: AtlasFrame.GoldButton,
      onClick: () => this.attemptStageEntry(),
    });

    this.stages.forEach((stage, index) => {
      const column = 0;
      const row = index;
      const x = 180;
      const y = 322 + row * 50;
      const card = this.add.container(x, y);
      const frame: Phaser.GameObjects.Image | null = null;
      const cardFill = this.add.rectangle(0, 0, 292, 44, 0x0c141d, frame ? 0.18 : 0.9);
      const icon = this.add
        .image(-128, 0, ATLAS_KEY, stage.stageType === 'final_boss' ? AtlasFrame.BossNode : AtlasFrame.StageNode)
        .setDisplaySize(22, 22);
      const statePip = this.add.circle(126, 0, 7, 0x66d17c, 1)
        .setStrokeStyle(2, 0xf4e6ad, 0.35);
      const titleText = this.add.text(-104, -8, `${stage.order}. ${this.truncateStageLabel(t(this, stage.name, undefined, stage.name), 22)}`, {
        fontFamily: 'Segoe UI',
        fontSize: '10px',
        color: '#fff4d7',
        stroke: '#18120c',
        strokeThickness: 2,
        fixedWidth: 214,
      }).setOrigin(0, 0.5);
      const starsText = this.add.text(-104, 4, '', {
        fontFamily: 'Segoe UI',
        fontSize: '1px',
        color: '#f1ddb0',
        stroke: '#16110c',
        strokeThickness: 0,
        fixedWidth: 214,
      }).setOrigin(0, 0.5);
      const stateText = this.add.text(-104, 10, '', {
        fontFamily: 'Segoe UI',
        fontSize: '9px',
        color: '#f9dfaa',
        stroke: '#16110c',
        strokeThickness: 2,
        fixedWidth: 214,
      }).setOrigin(0, 0.5);
      const border = this.add.rectangle(0, 0, 292, 44).setStrokeStyle(2, 0xd7c27c, 0.2).setFillStyle(0x000000, 0);

      card.add(frame ? [frame, cardFill, icon, statePip, titleText, starsText, stateText, border] : [cardFill, icon, statePip, titleText, starsText, stateText, border]);
      card.setSize(292, 44);
      card.setInteractive(
        new Phaser.Geom.Rectangle(-146, -22, 292, 44),
        Phaser.Geom.Rectangle.Contains,
      );
      card.on('pointerdown', () => {
        this.selectedIndex = index;
        this.refreshView();
      });

      this.nodes.push({
        stage,
        container: card,
        cardFill,
        icon,
        statePip,
        frame,
        border,
        titleText,
        starsText,
        stateText,
        row,
        column,
      });
    });
  }

  private cycleDifficulty(): void {
    const index = DIFFICULTY_ORDER.indexOf(this.selectedDifficulty);
    this.selectedDifficulty = DIFFICULTY_ORDER[(index + 1) % DIFFICULTY_ORDER.length];
    setSelectedDifficulty(this, this.selectedDifficulty);
    this.refreshView();
  }

  private handleRoutePointerDown(pointer: Phaser.Input.Pointer): void {
    if (!ROUTE_LIST_BOUNDS.contains(pointer.x, pointer.y)) {
      this.routeDragStartY = null;
      return;
    }

    this.routeDragStartY = pointer.y;
    this.routeDragStartIndex = this.selectedIndex;
  }

  private handleRoutePointerMove(pointer: Phaser.Input.Pointer): void {
    if (this.routeDragStartY === null || !pointer.isDown) {
      return;
    }

    const deltaRows = Math.trunc((this.routeDragStartY - pointer.y) / 42);
    if (deltaRows === 0) {
      return;
    }

    const nextIndex = Phaser.Math.Clamp(
      this.routeDragStartIndex + deltaRows,
      0,
      Math.max(0, this.stages.length - 1),
    );

    if (nextIndex === this.selectedIndex) {
      return;
    }

    this.selectedIndex = nextIndex;
    this.refreshView();
  }

  private handleRoutePointerUp(): void {
    this.routeDragStartY = null;
  }

  private refreshView(): void {
    const continent = getContinent(this.continentId);
    const selectedStage = this.stages[this.selectedIndex];
    const selectedProgress = this.snapshot.world.stageStars[selectedStage.id] ?? { normal: 0, hard: 0, hell: 0 };
    const previewKey = this.getHeaderPreviewTextureKey();
    const totalRows = this.stages.length;
    const selectedRow = this.selectedIndex;
    this.stageScrollRow = Phaser.Math.Clamp(
      selectedRow - 2,
      0,
      Math.max(0, totalRows - this.visibleStageRows),
    );

    if (this.textures.exists(previewKey)) {
      this.previewImage.clearTint();
      this.previewImage.setTexture(previewKey);
      this.fitImageWithin(this.previewImage, previewKey, 248, 104);
    } else {
      this.previewImage.setTexture(ATLAS_KEY, AtlasFrame.GrassTile).setDisplaySize(248, 104).setTint(0xbfae78);
    }

    this.nodes.forEach((node, index) => {
      const unlocked = isStageUnlocked(this.snapshot, node.stage.id);
      const selected = index === this.selectedIndex;
      const nodeProgress = this.snapshot.world.stageStars[node.stage.id] ?? { normal: 0, hard: 0, hell: 0 };
      const cleared = Math.max(nodeProgress.normal, nodeProgress.hard, nodeProgress.hell) > 0;
      const visibleRow = node.row - this.stageScrollRow;
      const visible = visibleRow >= 0 && visibleRow < this.visibleStageRows;
      node.container.setVisible(visible);
      node.container.setPosition(180, 322 + visibleRow * 50);
      node.frame?.setVisible(false);
      node.cardFill.setFillStyle(
        unlocked
          ? selected
            ? 0x213520
            : 0x111f18
          : 0x101116,
        node.frame ? (selected ? 0.24 : 0.12) : unlocked ? (selected ? 0.98 : 0.9) : 0.72,
      );
      node.border.setStrokeStyle(2, unlocked ? (selected ? 0xf4d986 : 0x6f8d65) : 0x50535a, selected ? 1 : 0.46);
      const markerKey = getStageRouteMarkerKey(!unlocked ? 'locked' : cleared ? 'cleared' : 'available');
      if (this.textures.exists(markerKey)) {
        node.icon
          .setTexture(markerKey)
          .setDisplaySize(28, 28)
          .clearTint();
      } else {
        node.icon
          .setTexture(
            ATLAS_KEY,
            !unlocked
              ? AtlasFrame.ContinentLocked
              : cleared
                ? AtlasFrame.Star
                : node.stage.stageType === 'final_boss'
                  ? AtlasFrame.BossNode
                  : AtlasFrame.ContinentUnlocked,
          )
          .setDisplaySize(22, 22)
          .setTint(unlocked ? (selected ? 0xffeb9c : cleared ? 0xe7f4b8 : 0xdfe8c0) : 0x6e7076);
      }
      node.statePip.setFillStyle(unlocked ? 0x72d87d : 0x555a61, unlocked ? 1 : 0.9);
      node.statePip.setStrokeStyle(2, unlocked ? 0xf5edb5 : 0x9a9a9a, unlocked ? 0.5 : 0.2);
      node.starsText.setText('');
      node.starsText.setVisible(false);
      node.stateText.setText(unlocked ? t(this, 'ui.enter_available') : t(this, 'ui.locked'));
      node.titleText.setColor(unlocked ? (selected ? '#fff8df' : '#fff0cf') : '#9c9da2');
      node.stateText.setColor(unlocked ? '#c8ffc0' : '#a8a8ad');
    });

    const scrollRange = Math.max(0, totalRows - this.visibleStageRows);
    const trackHeight = 250;
    const thumbHeight = Math.max(36, Math.round(trackHeight * Math.min(1, this.visibleStageRows / Math.max(1, totalRows))));
    const thumbProgress = scrollRange > 0 ? this.stageScrollRow / scrollRange : 0;
    const thumbY = 315 + thumbHeight / 2 + (trackHeight - thumbHeight) * thumbProgress;
    this.scrollTrack.setVisible(totalRows > this.visibleStageRows);
    this.scrollThumb.setVisible(totalRows > this.visibleStageRows);
    this.scrollThumb.setSize(8, thumbHeight).setPosition(340, thumbY);

    const stageUnlocked = isStageUnlocked(this.snapshot, selectedStage.id);
    const difficultyUnlocked = canAccessDifficulty(selectedProgress, this.selectedDifficulty);

    this.detailText.setText([
      `${t(this, continent.storyAct, undefined, continent.storyAct)} / ${t(this, continent.name, undefined, continent.name)}`,
      `${selectedStage.order}/${this.stages.length}. ${t(this, selectedStage.name, undefined, selectedStage.name)}`,
      t(this, 'ui.stage_power_line', {
        difficulty: translateDifficulty(this, this.selectedDifficulty),
        recommendedPower: selectedStage.recommendedPower,
        currentPower: calculatePartyPower(this.snapshot),
      }),
      t(this, 'ui.stage_fatigue_time', { fatigue: FATIGUE_COST_PER_STAGE, seconds: selectedStage.baseTimeSeconds }),
    ]);
    const fatigue = this.snapshot.profile.fatigue;
    const maxFatigue = this.snapshot.profile.maxFatigue;
    const afterEntry = Math.max(0, fatigue - FATIGUE_COST_PER_STAGE);
    this.fatigueText
      .setColor(fatigue < FATIGUE_COST_PER_STAGE ? '#ffb39b' : '#bfffc8')
      .setText(`현재 피로도 ${fatigue}/${maxFatigue} | 입장 -${FATIGUE_COST_PER_STAGE} -> ${afterEntry} | 광고 +${AD_REWARD_FATIGUE}`);
    const stageBeat = this.truncateStageLabel(t(this, selectedStage.storyBeat, undefined, selectedStage.storyBeat), 34);

    if (!stageUnlocked) {
      this.statusText.setText(`${stageBeat}\n${t(this, 'ui.previous_stage_normal_required')}`);
    } else if (!difficultyUnlocked) {
      this.statusText.setText(`${stageBeat}\n${t(this, 'ui.previous_difficulty_three_star_required', {
        difficulty: translateDifficulty(this, this.selectedDifficulty),
      })}`);
    } else {
      this.statusText.setText(`${stageBeat}\n준비 완료`);
    }
  }

  private attemptStageEntry(): void {
    this.snapshot = loadSnapshot();
    const stage = this.stages[this.selectedIndex];
    const request = {
      continentId: this.continentId,
      stageId: stage.id,
      difficulty: this.selectedDifficulty,
      now: Date.now(),
    } as const;

    if (!canEnterStage(this.snapshot, request)) {
      const failed = enterStage(this.snapshot, request);
      this.statusText.setText(this.mapEntryFailureReason(failed.ok ? '' : failed.reason));
      return;
    }

    const result = enterStage(this.snapshot, request);
    if (!result.ok) {
      this.statusText.setText(this.mapEntryFailureReason(result.reason));
      return;
    }

    saveSnapshot(result.snapshot);
    setStageSelection(this, {
      continentId: this.continentId,
      stageId: stage.id,
      difficulty: this.selectedDifficulty,
    });
    this.scene.start('battle');
  }

  private mapEntryFailureReason(reason: string): string {
    switch (reason) {
      case 'stage_locked':
        return t(this, 'ui.clear_previous_stage_first');
      case 'difficulty_locked':
        return t(this, 'ui.difficulty_still_locked');
      case 'fatigue_low':
        return `피로도 부족: 광고 회복 +${AD_REWARD_FATIGUE} 또는 피로도 아이템을 사용하세요.`;
      case 'continent_locked':
        return t(this, 'ui.continent_still_locked');
      case 'starter_companion_locked':
        return t(this, 'ui.starter_companion_required');
      default:
        return t(this, 'ui.unable_to_enter_now');
    }
  }

  private getHeaderPreviewTextureKey(): string {
    const landmarkKey = getWorldMapLandmarkKey(this.continentId);
    if (landmarkKey && this.textures.exists(landmarkKey)) {
      return landmarkKey;
    }

    const selectedStage = this.stages[this.selectedIndex];
    return selectedStage ? getStageBackgroundKey(selectedStage.id) : ATLAS_KEY;
  }

  private fitImageWithin(
    image: Phaser.GameObjects.Image,
    textureKey: string,
    maxWidth: number,
    maxHeight: number,
  ): void {
    if (!this.textures.exists(textureKey)) {
      image.setDisplaySize(maxWidth, maxHeight);
      return;
    }

    const source = this.textures.get(textureKey).getSourceImage() as { width?: number; height?: number };
    const width = source.width ?? maxWidth;
    const height = source.height ?? maxHeight;

    if (width <= 0 || height <= 0) {
      image.setDisplaySize(maxWidth, maxHeight);
      return;
    }

    const scale = Math.min(maxWidth / width, maxHeight / height);
    image.setDisplaySize(Math.round(width * scale), Math.round(height * scale));
  }

  private truncateStageLabel(label: string, maxChars: number): string {
    return label.length > maxChars ? `${label.slice(0, Math.max(1, maxChars - 1))}\u2026` : label;
  }
}
