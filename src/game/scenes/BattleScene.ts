import Phaser from 'phaser';
import {
  applyLeaderManualMovement,
  calculateBattleStars,
  canCastLeaderCommandSkill,
  canCastLeaderSkill,
  castLeaderCommandSkill,
  castLeaderSkill,
  createBattleSimulation,
  getPartyHpRatio,
  setAutoBattleMode,
  stepBattleSimulation,
  toggleAutoBattle,
  type BattleSimulationState,
} from '../core/battle';
import { calculatePartyPower } from '../core/party';
import { getStageClearRewardRate, grantStageExperience } from '../core/progression';
import { completeStage } from '../core/state';
import { AtlasFrame, ATLAS_KEY } from '../data/atlas';
import { BATTLE_UI_IMAGE_KEYS } from '../data/battleUiRuntimeArt';
import { getStageClearCutsceneId, hasSeenCutscene } from '../data/cutscenes';
import { applyStageRecruitmentReward } from '../data/stageRecruitEvents';
import { getStageStoryEvent, hasSeenStageStoryEvent, markStageStoryEventSeen } from '../data/stageStoryEvents';
import {
  getRuntimeAnimationClip,
  type RuntimeAnimationClipEntry,
} from '../data/runtimeAnimationAssets';
import { getContinent, getStage, getStageBackgroundKey, getStageRewardGold } from '../data/world';
import { t, translateDifficulty } from '../services/i18n';
import { loadSnapshot, saveSnapshot } from '../services/save';
import { getStageSelection, setBattleResult } from '../services/session';
import { buildDebugState } from '../ui/debugHud';
import { DialogueOverlay } from '../ui/dialogueOverlay';
import { VirtualJoystick } from '../ui/virtualJoystick';
import { createButton, paintBackdrop } from '../ui/widgets';
import { hideVillageBanner } from '../../platform/ads';
import type { BattleResult, SaveSnapshot, StageDefinition, StageSelection } from '../types';

export class BattleScene extends Phaser.Scene {
  private snapshot!: SaveSnapshot;
  private selection!: StageSelection;
  private stage!: StageDefinition;
  private battle!: BattleSimulationState;
  private enemyBar!: Phaser.GameObjects.Rectangle;
  private enemyText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private skillText!: Phaser.GameObjects.Text;
  private autoText!: Phaser.GameObjects.Text;
  private effectLayer!: Phaser.GameObjects.Graphics;
  private effectSpriteLayer!: Phaser.GameObjects.Layer;
  private heroBars: Phaser.GameObjects.Rectangle[] = [];
  private heroBarBacks: Phaser.GameObjects.Rectangle[] = [];
  private heroBarFrames: Array<Phaser.GameObjects.Image | null> = [];
  private heroLabels: Phaser.GameObjects.Text[] = [];
  private heroSprites: Phaser.GameObjects.Image[] = [];
  private enemyBars: Phaser.GameObjects.Rectangle[] = [];
  private enemyBarBacks: Phaser.GameObjects.Rectangle[] = [];
  private enemyBarFrames: Array<Phaser.GameObjects.Image | null> = [];
  private enemyLabels: Phaser.GameObjects.Text[] = [];
  private enemySprites: Phaser.GameObjects.Image[] = [];
  private effectSprites = new Map<string, Phaser.GameObjects.Image>();
  private slashButton!: Phaser.GameObjects.Container;
  private resonanceButton!: Phaser.GameObjects.Container;
  private autoButton!: Phaser.GameObjects.Container;
  private retreatButton!: Phaser.GameObjects.Container;
  private slashCooldownText!: Phaser.GameObjects.Text;
  private resonanceCooldownText!: Phaser.GameObjects.Text;
  private joystick!: VirtualJoystick;
  private dialogueOverlay!: DialogueOverlay;
  private resolved = false;

  constructor() {
    super('battle');
  }

  create(): void {
    this.resolved = false;
    this.heroBars = [];
    this.heroBarBacks = [];
    this.heroBarFrames = [];
    this.heroLabels = [];
    this.heroSprites = [];
    this.enemyBars = [];
    this.enemyBarBacks = [];
    this.enemyBarFrames = [];
    this.enemyLabels = [];
    this.enemySprites = [];
    this.effectSprites.clear();
    const selection = getStageSelection(this);

    if (!selection) {
      this.scene.start('stage-select');
      return;
    }

    this.selection = selection;
    this.snapshot = loadSnapshot();
    this.stage = getStage(selection.stageId);
    this.battle = createBattleSimulation(this.stage, selection.difficulty, this.snapshot);

    void hideVillageBanner();
    this.drawLayoutClean();
    this.dialogueOverlay = new DialogueOverlay(this, 1450);
    this.input.on('pointerup', this.handlePointerInput, this);
    this.tryShowPreStageStory();
    this.refreshCombatViewClean();
  }

  update(_: number, delta: number): void {
    this.stepSimulation(delta);
  }

  public stepSimulation(deltaMs: number): void {
    if (this.resolved) {
      return;
    }

    this.dialogueOverlay?.update();
    if (this.dialogueOverlay?.isBlocking()) {
      return;
    }

    this.applyLeaderControl(deltaMs);
    this.battle = stepBattleSimulation(this.battle, deltaMs);
    this.refreshCombatViewClean();

    if (this.battle.result === 'clear') {
      this.finishBattle();
      return;
    }

    if (this.battle.result === 'fail') {
      this.failBattle();
    }
  }

  public renderGameToText(): string {
    return JSON.stringify(
      buildDebugState('battle', this.snapshot, {
        stageId: this.stage.id,
        stageName: this.stage.name,
        difficulty: this.selection.difficulty,
        elapsedMs: Math.round(this.battle.elapsedMs),
        autoPlayer: this.battle.autoPlayer,
        enemyHp: this.battle.enemy.hp,
        enemyMaxHp: this.battle.enemy.maxHp,
        party: this.battle.party.map((member) => ({
          id: member.id,
          hp: member.hp,
          maxHp: member.maxHp,
          shieldHp: member.shieldHp,
          damageBoostMs: Math.round(member.damageBoostMs),
          guardTauntMs: Math.round(member.guardTauntMs),
          x: Number(member.x.toFixed(1)),
          y: Number(member.y.toFixed(1)),
        })),
        enemies: this.battle.enemies.map((enemy) => ({
          id: enemy.id,
          pattern: enemy.pattern,
          hp: enemy.hp,
          active: enemy.active,
          x: Number(enemy.x.toFixed(1)),
          y: Number(enemy.y.toFixed(1)),
        })),
        effects: this.battle.effects.map((effect) => ({
          kind: effect.kind,
          source: effect.source,
          x: Number(effect.x.toFixed(1)),
          y: Number(effect.y.toFixed(1)),
          ttlMs: Math.round(effect.ttlMs),
        })),
        skillReady: canCastLeaderSkill(this.battle),
        commandSkillReady: canCastLeaderCommandSkill(this.battle),
        resonanceCooldownMs: Math.max(0, Math.round(this.battle.leaderSkillMaxMs - this.battle.leaderSkillChargeMs)),
        slashCooldownMs: Math.max(0, Math.round(this.battle.leaderCommandSkillMaxMs - this.battle.leaderCommandSkillChargeMs)),
        autoControlsHidden: this.battle.autoPlayer,
        availableActions: ['move_leader', 'cast_command_skill', 'cast_resonance_skill', 'toggle_auto', 'retreat'],
        partyPower: calculatePartyPower(this.snapshot),
        dialogueActive: this.dialogueOverlay?.isVisible() ?? false,
      }),
    );
  }

  private tryShowPreStageStory(): void {
    const event = getStageStoryEvent(this.selection.stageId, 'pre_stage');
    if (!event || hasSeenStageStoryEvent(this.snapshot, event.id)) {
      return;
    }

    this.dialogueOverlay.showSequence(
      event.lines.map((line) => ({
        ...line,
        speaker: {
          ...line.speaker,
          name: t(this, line.speaker.name),
        },
        text: t(this, line.text),
      })),
      () => {
        this.snapshot = markStageStoryEventSeen(this.snapshot, event.id);
        saveSnapshot(this.snapshot);
      },
    );
  }

  private drawLayoutClean(): void {
    const continent = getContinent(this.selection.continentId);
    const backgroundKey = getStageBackgroundKey(this.stage.id);
    const useRuntimeTopHudFrame = this.textures.exists(BATTLE_UI_IMAGE_KEYS.topHudFrame);
    const useRuntimeBottomCommandFrame = this.textures.exists(BATTLE_UI_IMAGE_KEYS.commandDockBackground);

    this.add.rectangle(180, 320, 360, 640, 0x061018, 1).setDepth(-30);

    if (this.textures.exists(backgroundKey)) {
      this.add.image(180, 320, backgroundKey).setDisplaySize(360, 640).setAlpha(0.42).setDepth(-24);
      this.add.rectangle(180, 320, 360, 640, 0x061018, 0.42).setDepth(-23);
    } else {
      paintBackdrop(this, AtlasFrame.StoneTile, continent.accentColor);
    }

    this.drawPixelBattlefield(continent.accentColor);

    if (useRuntimeTopHudFrame) {
      this.add.image(180, 88, BATTLE_UI_IMAGE_KEYS.topHudFrame).setDisplaySize(332, 136).setDepth(0);
    }
    this.add.rectangle(180, 84, 336, 124, 0x081019, useRuntimeTopHudFrame ? 0.58 : 0.82).setStrokeStyle(2, 0xe0ca94, 0.26).setDepth(0.5);
    this.add.rectangle(180, 48, 304, 28, 0x182430, 0.84).setStrokeStyle(1, 0xf0dfb4, 0.26).setDepth(1);
    this.add.rectangle(180, 152, 300, 4, 0xe2ce9d, 0.18).setDepth(1);
    this.add.rectangle(180, 88, 324, 104, 0x0b1117, 0.54).setStrokeStyle(1, 0xe2ce9d, 0.18).setDepth(1);
    this.add.rectangle(180, 352, 332, 316, 0x071018, 0.08).setStrokeStyle(1, 0xe2ce9d, 0.08).setDepth(0);
    if (useRuntimeBottomCommandFrame) {
      this.add.image(180, 588, BATTLE_UI_IMAGE_KEYS.commandDockBackground).setDisplaySize(336, 112).setDepth(1);
      this.add.rectangle(180, 586, 322, 100, 0x060a0f, 0.22).setDepth(1.05);
    } else {
      this.add.rectangle(180, 584, 336, 110, 0x060a0f, 0.82).setStrokeStyle(2, 0xcdb882, 0.18).setDepth(1);
    }
    this.add.rectangle(180, 320, 360, 640, 0x04080c, 0.04).setDepth(-1);

    this.add
      .image(
        308,
        88,
        ATLAS_KEY,
        this.stage.stageType === 'final_boss' ? AtlasFrame.BossNode : AtlasFrame.StageNode,
      )
      .setDisplaySize(44, 44)
      .setTint(continent.accentColor)
      .setDepth(3);

    this.add.text(22, 34, truncateHudLabel(`${t(this, continent.name)} / ${t(this, this.stage.name)}`, 28), {
      fontFamily: 'Segoe UI',
      fontSize: '14px',
      color: '#f7efd6',
      stroke: '#1b140f',
      strokeThickness: 3,
      fixedWidth: 236,
    }).setDepth(3);
    this.add.text(22, 58, `${translateDifficulty(this, this.selection.difficulty)} | ${t(this, 'ui.goal_time', { seconds: this.stage.baseTimeSeconds })}`, {
      fontFamily: 'Segoe UI',
      fontSize: '13px',
      color: '#f1dec2',
      stroke: '#1b140f',
      strokeThickness: 2,
    }).setDepth(3);
    this.add.text(22, 80, t(this, 'ui.party_power', { power: calculatePartyPower(this.snapshot) }), {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      color: '#ffe3a2',
      stroke: '#1b140f',
      strokeThickness: 2,
    }).setDepth(3);

    for (let laneIndex = 0; laneIndex < 4; laneIndex += 1) {
      this.add.line(0, 0, 18, 246 + laneIndex * 56, 342, 246 + laneIndex * 56, 0xf6edd0, 0.05).setOrigin(0, 0);
    }

    this.effectLayer = this.add.graphics().setDepth(3);
    this.effectSpriteLayer = this.add.layer().setDepth(4);

    this.enemyText = this.add.text(24, 128, '', {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      color: '#fff1cd',
      stroke: '#1b140f',
      strokeThickness: 3,
      wordWrap: { width: 298 },
      fixedWidth: 298,
    }).setDepth(3);
    this.add.rectangle(180, 154, 286, 16, 0x22170f, 0.94).setOrigin(0.5).setDepth(2);
    this.enemyBar = this.add.rectangle(39, 154, 282, 12, 0xcf5442).setOrigin(0, 0.5).setDepth(3);

    for (let index = 0; index < this.battle.party.length; index += 1) {
      const member = this.battle.party[index];
      const initialClip = this.getPartyRuntimeClip(member);
      const sprite = this.add
        .image(member.x, member.y, initialClip?.textureKey ?? ATLAS_KEY, initialClip ? 0 : AtlasFrame.Hero)
        .setDisplaySize(54, 54);
      const label = this.add.text(member.x - 30, member.y + 36, t(this, member.name, undefined, member.name), {
        fontFamily: 'Segoe UI',
        fontSize: '11px',
        color: '#f7efd6',
        stroke: '#1b140f',
        strokeThickness: 3,
      });
      const hpFrame = this.textures.exists(BATTLE_UI_IMAGE_KEYS.allyHpFrame)
        ? this.add.image(member.x, member.y + 58, BATTLE_UI_IMAGE_KEYS.allyHpFrame).setDisplaySize(70, 18)
        : null;
      const hpBack = this.add.rectangle(member.x, member.y + 58, 54, 8, 0x201710, 0.82).setOrigin(0.5);
      const hpBar = this.add.rectangle(member.x - 26, member.y + 58, 52, 6, 0x77c26f).setOrigin(0, 0.5);

      this.heroSprites.push(sprite);
      this.heroLabels.push(label);
      this.heroBarFrames.push(hpFrame);
      this.heroBarBacks.push(hpBack);
      this.heroBars.push(hpBar);
    }

    for (let index = 0; index < this.battle.enemies.length; index += 1) {
      const enemy = this.battle.enemies[index];
      const frame = enemy.kind === 'boss' ? AtlasFrame.BossNode : AtlasFrame.StageNode;
      const sprite = this.add
        .image(enemy.x, enemy.y, ATLAS_KEY, frame)
        .setDisplaySize(enemy.kind === 'boss' ? 66 : 50, enemy.kind === 'boss' ? 66 : 50);
      const label = this.add.text(enemy.x - 30, enemy.y - 40, t(this, enemy.name, undefined, enemy.name), {
        fontFamily: 'Segoe UI',
        fontSize: '10px',
        color: '#ffd7c4',
        stroke: '#1b140f',
        strokeThickness: 3,
      });
      const hpFrame = this.textures.exists(BATTLE_UI_IMAGE_KEYS.enemyHpFrame)
        ? this.add.image(enemy.x, enemy.y + 38, BATTLE_UI_IMAGE_KEYS.enemyHpFrame).setDisplaySize(66, 16)
        : null;
      const hpBack = this.add.rectangle(enemy.x, enemy.y + 38, 52, 6, 0x201710, 0.84).setOrigin(0.5);
      const hpBar = this.add.rectangle(enemy.x - 25, enemy.y + 38, 50, 4, 0xcf5442).setOrigin(0, 0.5);

      this.enemySprites.push(sprite);
      this.enemyLabels.push(label);
      this.enemyBarFrames.push(hpFrame);
      this.enemyBarBacks.push(hpBack);
      this.enemyBars.push(hpBar);
    }

    this.statusText = this.add.text(24, 522, '', {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#f7efd6',
      stroke: '#1b140f',
      strokeThickness: 3,
      wordWrap: { width: 164 },
    });
    this.timerText = this.add.text(24, 546, '', {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#f7efd6',
      stroke: '#1b140f',
      strokeThickness: 3,
    });
    this.skillText = this.add.text(24, 568, '', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#ffe5a6',
      stroke: '#1b140f',
      strokeThickness: 3,
    });
    this.autoText = this.add.text(24, 588, '', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#f7efd6',
      stroke: '#1b140f',
      strokeThickness: 3,
    });

    this.joystick = new VirtualJoystick(this, 64, 588, 34);

    this.slashButton = createButton(this, 214, 574, {
      width: 72,
      height: 28,
      label: t(this, 'ui.slash'),
      iconFrame: AtlasFrame.SwordIcon,
      backgroundFrame: AtlasFrame.GoldButton,
      onClick: () => this.tryCommandSkill(),
    }).setDepth(6);
    this.resonanceButton = createButton(this, 292, 574, {
      width: 72,
      height: 28,
      label: t(this, 'ui.resonance'),
      iconFrame: AtlasFrame.Star,
      backgroundFrame: AtlasFrame.GoldButton,
      onClick: () => this.tryManualSkill(),
    }).setDepth(6);
    this.autoButton = createButton(this, 214, 610, {
      width: 72,
      height: 28,
      label: t(this, 'ui.auto'),
      iconFrame: AtlasFrame.StageNode,
      onClick: () => {
        this.battle = toggleAutoBattle(this.battle);
        this.refreshCombatViewClean();
      },
    }).setDepth(6);
    this.retreatButton = createButton(this, 306, 36, {
      width: 84,
      height: 26,
      label: t(this, 'ui.retreat'),
      iconFrame: AtlasFrame.HomeIcon,
      onClick: () => this.failBattle(),
    }).setDepth(9);
    this.slashCooldownText = this.add.text(214, 554, '', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#fff4cf',
      stroke: '#1b140f',
      strokeThickness: 3,
      align: 'center',
    }).setOrigin(0.5).setDepth(8);
    this.resonanceCooldownText = this.add.text(292, 554, '', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#fff4cf',
      stroke: '#1b140f',
      strokeThickness: 3,
      align: 'center',
    }).setOrigin(0.5).setDepth(8);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.joystick?.destroy();
      this.input.off('pointerup', this.handlePointerInput, this);
      this.effectSprites.forEach((sprite) => sprite.destroy());
      this.effectSprites.clear();
    });
  }

  private handlePointerInput(): void {
    if (this.dialogueOverlay?.isBlocking()) {
      this.dialogueOverlay.advance();
    }
  }

  private refreshCombatViewClean(): void {
    const enemyRatio = this.battle.enemy.hp / this.battle.enemy.maxHp;

    this.enemyBar.width = 282 * Phaser.Math.Clamp(enemyRatio, 0, 1);
    this.enemyBar.fillColor = this.battle.enemy.castingMs > 0 ? 0xe57b45 : 0xcf5442;
    this.enemyText.setText(
      t(this, 'ui.hp_line', {
        name: t(this, this.battle.enemy.name, undefined, this.battle.enemy.name),
        hp: this.battle.enemy.hp,
        maxHp: this.battle.enemy.maxHp,
      }),
    );
    const modeLabel = this.battle.autoPlayer ? t(this, 'ui.battle_mode_auto') : t(this, 'ui.battle_mode_manual');
    const threatLabel =
      this.battle.enemy.castingMs > 0
        ? t(this, 'ui.enemy_special_ready')
        : this.battle.enemy.highlightMs > 0
          ? t(this, 'ui.enemy_focus_attack')
          : t(this, 'ui.frontline_holding');
    this.statusText.setText(`${modeLabel}\n${threatLabel}`);
    this.timerText.setText(
      t(this, 'ui.battle_timer_party_hp', {
        seconds: Math.max(1, Math.round(this.battle.elapsedMs / 1000)),
        hpRatio: Math.round(getPartyHpRatio(this.battle) * 100),
      }),
    );
    this.skillText.setText('');
    this.autoText.setText(this.battle.autoPlayer ? t(this, 'ui.auto_on_hint') : '');
    this.refreshCombatControlState();

    this.battle.party.forEach((member, index) => {
      const ratio = member.hp / member.maxHp;
      const sprite = this.heroSprites[index];
      const hpFrame = this.heroBarFrames[index];
      const hpBack = this.heroBarBacks[index];
      const hpBar = this.heroBars[index];
      const label = this.heroLabels[index];

      const tint =
        member.hp <= 0
          ? 0x666666
          : member.shieldHp > 0
            ? 0xb6d9ff
            : member.damageBoostMs > 0
              ? 0xffe19a
              : member.highlightMs > 0
                ? 0xf8df8e
                : 0xffffff;

      this.applyPartyRuntimeTexturePolished(sprite, member);
      sprite.setTint(tint);
      sprite.setPosition(member.x, member.highlightMs > 0 ? member.y - 4 : member.y);
      hpFrame?.setPosition(member.x, member.y + 58);
      hpBack.setPosition(member.x, member.y + 58);
      hpBar.width = 52 * Phaser.Math.Clamp(ratio, 0, 1);
      hpBar.fillColor = ratio > 0.5 ? 0x77c26f : ratio > 0.25 ? 0xe0b35b : 0xd95a4e;
      hpBar.setPosition(member.x - 26, member.y + 58);
      label.setVisible(false);
    });

    this.battle.enemies.forEach((enemy, index) => {
      const ratio = enemy.hp / enemy.maxHp;
      const sprite = this.enemySprites[index];
      const hpFrame = this.enemyBarFrames[index];
      const hpBack = this.enemyBarBacks[index];
      const hpBar = this.enemyBars[index];
      const label = this.enemyLabels[index];

      sprite.setVisible(enemy.active);
      hpFrame?.setVisible(enemy.active && enemy.hp > 0);
      hpBack.setVisible(enemy.active && enemy.hp > 0);
      hpBar.setVisible(enemy.active && enemy.hp > 0);
      label.setVisible(false);

      if (!enemy.active) {
        return;
      }

      const defeated = enemy.hp <= 0;
      this.applyEnemyRuntimeTexturePolished(sprite, enemy);
      sprite.setFlipX(true);
      sprite.setPosition(enemy.x, defeated ? enemy.y + 8 : enemy.highlightMs > 0 ? enemy.y - 4 : enemy.y);
      hpFrame?.setPosition(enemy.x, enemy.y + 38);

      if (defeated) {
        sprite.setTint(0x666666).setAlpha(0.78);
        return;
      }

      sprite.setAlpha(1);
      sprite.setTint(
        enemy.kind === 'boss'
          ? enemy.highlightMs > 0
            ? 0xffd27d
            : 0xffc7b0
          : enemy.highlightMs > 0
            ? 0xffd27d
            : 0xffffff,
      );
      hpBack.setPosition(enemy.x, enemy.y + 38);
      hpBar.width = 50 * Phaser.Math.Clamp(ratio, 0, 1);
      hpBar.fillColor = enemy.kind === 'boss' ? 0xf07d68 : 0xcf5442;
      hpBar.setPosition(enemy.x - 25, enemy.y + 38);
    });

    this.renderEffects();
  }

  private applyPartyRuntimeTexturePolished(
    sprite: Phaser.GameObjects.Image,
    member: BattleSimulationState['party'][number],
  ): void {
    if (!sprite.scene) {
      return;
    }

    const clip = this.getPartyRuntimeClip(member);

    if (!clip || !this.textures.exists(clip.textureKey)) {
      sprite.setTexture(ATLAS_KEY, AtlasFrame.Hero).setDisplaySize(54, 54);
      return;
    }

    const fps = clip.fps ?? 8;
    const elapsedFrames = Math.max(0, Math.floor((this.battle.elapsedMs / 1000) * fps));
    const frameIndex = clip.frameCount <= 1 ? 0 : elapsedFrames % clip.frameCount;
    const maxSize = 78;
    const scale = Math.min(maxSize / clip.frameWidth, maxSize / clip.frameHeight);

    sprite.setTexture(clip.textureKey, frameIndex).setDisplaySize(clip.frameWidth * scale, clip.frameHeight * scale);
  }

  private applyEnemyRuntimeTexturePolished(
    sprite: Phaser.GameObjects.Image,
    enemy: BattleSimulationState['enemies'][number],
  ): void {
    if (!sprite.scene) {
      return;
    }

    const clip = this.getEnemyRuntimeClip(enemy);

    if (!clip || !this.textures.exists(clip.textureKey)) {
      sprite
        .setTexture(ATLAS_KEY, enemy.kind === 'boss' ? AtlasFrame.BossNode : AtlasFrame.StageNode)
        .setDisplaySize(enemy.kind === 'boss' ? 66 : 50, enemy.kind === 'boss' ? 66 : 50)
        .setFlipX(true)
        .setAngle(enemy.hp <= 0 ? 90 : 0)
        .setAlpha(enemy.hp <= 0 ? 0.66 : 1);
      return;
    }

    const fps = clip.fps ?? 8;
    const elapsedFrames = Math.max(0, Math.floor((this.battle.elapsedMs / 1000) * fps));
    const frameIndex = enemy.hp <= 0
      ? Math.max(0, clip.frameCount - 1)
      : clip.frameCount <= 1
        ? 0
        : elapsedFrames % clip.frameCount;
    const maxSize = enemy.kind === 'boss' ? 104 : 80;
    const scale = Math.min(maxSize / clip.frameWidth, maxSize / clip.frameHeight);

    sprite
      .setTexture(clip.textureKey, frameIndex)
      .setDisplaySize(clip.frameWidth * scale, clip.frameHeight * scale)
      .setFlipX(true)
      .setAngle(enemy.hp <= 0 ? 90 : 0)
      .setAlpha(enemy.hp <= 0 ? 0.78 : 1);
  }

  private drawPixelBattlefield(accentColor: number): void {
    const baseColor = Phaser.Display.Color.ValueToColor(accentColor).darken(44).color;
    const edgeColor = Phaser.Display.Color.ValueToColor(accentColor).lighten(8).color;
    const fieldX = 180;
    const fieldY = 354;
    const fieldWidth = 326;
    const fieldHeight = 302;
    this.add.rectangle(fieldX, fieldY, fieldWidth, fieldHeight, baseColor, 0.76)
      .setStrokeStyle(2, edgeColor, 0.2)
      .setDepth(-8);

    for (let row = 0; row < 10; row += 1) {
      const y = fieldY - fieldHeight / 2 + 18 + row * 30;
      const fill = row % 2 === 0 ? 0x17231c : 0x1e2a22;
      this.add.rectangle(fieldX, y, fieldWidth - 18, 24, fill, 0.2).setDepth(-7.8);
    }

    for (let col = 0; col <= 9; col += 1) {
      const x = fieldX - fieldWidth / 2 + 18 + col * 32;
      this.add.line(0, 0, x, fieldY - fieldHeight / 2 + 10, x, fieldY + fieldHeight / 2 - 10, 0xf6edd0, 0.035)
        .setOrigin(0, 0)
        .setDepth(-7.7);
    }

    for (const laneY of [258, 324, 390, 456]) {
      this.add.line(0, 0, 26, laneY, 334, laneY, 0xffedb3, 0.14)
        .setOrigin(0, 0)
        .setDepth(-7.6);
      this.add.rectangle(180, laneY + 18, 312, 2, 0x05090d, 0.1).setDepth(-7.5);
    }
  }

  private refreshCombatControlState(): void {
    const auto = this.battle.autoPlayer;
    const commandReady = canCastLeaderCommandSkill(this.battle);
    const resonanceReady = canCastLeaderSkill(this.battle);
    const commandRemainingMs = Math.max(0, this.battle.leaderCommandSkillMaxMs - this.battle.leaderCommandSkillChargeMs);
    const resonanceRemainingMs = Math.max(0, this.battle.leaderSkillMaxMs - this.battle.leaderSkillChargeMs);

    this.joystick?.setVisible(!auto);
    this.slashButton?.setVisible(!auto).setAlpha(commandReady ? 1 : 0.58);
    this.resonanceButton?.setVisible(!auto).setAlpha(resonanceReady ? 1 : 0.58);
    this.retreatButton?.setVisible(!auto);
    this.autoButton?.setAlpha(auto ? 1 : 0.92);
    this.slashCooldownText
      ?.setVisible(!auto)
      .setText(commandReady ? '준비' : `${Math.ceil(commandRemainingMs / 1000)}초`)
      .setColor(commandReady ? '#d8ffc4' : '#ffd29a');
    this.resonanceCooldownText
      ?.setVisible(!auto)
      .setText(resonanceReady ? '준비' : `${Math.ceil(resonanceRemainingMs / 1000)}초`)
      .setColor(resonanceReady ? '#d8ffc4' : '#ffd29a');
  }

  private getPartyRuntimeClip(
    member: BattleSimulationState['party'][number],
  ) {
    const runtimeSubjectId = member.id;
    const delta = Math.max(Math.abs(member.x - member.homeX), Math.abs(member.y - member.homeY));
    const preferredClipIds =
      member.hp <= 0
        ? ['down_or_death']
        : member.highlightMs > 0
          ? ['hit_react', 'idle']
          : delta > 18
            ? ['run', 'walk', 'idle']
            : delta > 6
              ? ['walk', 'idle']
              : ['idle'];

    for (const clipId of preferredClipIds) {
      const clip = getRuntimeAnimationClip(this, 'character', runtimeSubjectId, clipId);

      if (clip) {
        return clip;
      }
    }

    return null;
  }

  private getEnemyRuntimeClip(
    enemy: BattleSimulationState['enemies'][number],
  ) {
    const subjectId = this.getEnemyRuntimeSubjectId(enemy);

    if (!subjectId) {
      return null;
    }

    for (const clipId of this.getEnemyPreferredClipIds(enemy, subjectId)) {
      const clip = getRuntimeAnimationClip(this, 'enemy', subjectId, clipId);

      if (clip) {
        return clip;
      }
    }

    return null;
  }

  private getEnemyPreferredClipIds(
    enemy: BattleSimulationState['enemies'][number],
    subjectId: string,
  ): string[] {
    if (enemy.hp <= 0) {
      return ['down_or_death'];
    }

    if (enemy.castingMs > 0) {
      return [...this.getEnemyChargeClipIds(enemy, subjectId), ...this.getEnemyAttackClipIds(enemy, subjectId), 'idle'];
    }

    if (enemy.highlightMs > 0) {
      return ['hit_react', ...this.getEnemyAttackClipIds(enemy, subjectId), 'idle'];
    }

    const delta = Math.max(Math.abs(enemy.x - enemy.homeX), Math.abs(enemy.y - enemy.homeY));
    if (subjectId === 'barrow_wraith') {
      return delta > 6 ? ['float', 'idle'] : ['idle', 'float'];
    }

    if (delta > 18) {
      return ['run', 'walk', 'idle'];
    }

    if (delta > 6) {
      return ['walk', 'idle'];
    }

    return ['idle'];
  }

  private getEnemyAttackClipIds(
    enemy: BattleSimulationState['enemies'][number],
    subjectId: string,
  ): string[] {
    switch (subjectId) {
      case 'blackhorn_chieftain':
        return ['heavy_attack', 'horn_sweep', 'taunt_or_command'];
      case 'morgan':
        return ['heavy_attack', 'slam_burst', 'roar_or_enrage'];
      case 'bares':
        return ['heavy_attack', 'crusher_slam', 'burst_release', 'taunt_or_command'];
      case 'dravorn':
      case 'varkan':
        return ['heavy_attack', 'cast_release', 'charge_burst', 'taunt_or_command'];
      case 'elrent':
        return ['cast_start', 'cast_release', 'tidal_burst'];
      case 'nereph':
        return ['heavy_attack', 'tidal_sweep', 'cast_release'];
      case 'hrod':
        return ['heavy_attack', 'stomp_burst', 'roar_or_enrage'];
      case 'valtern':
        return ['heavy_attack', 'cast_release', 'taunt_or_command'];
      case 'setra':
        return ['heavy_attack', 'leap_strike', 'roar_or_command'];
      case 'kazer':
        return ['heavy_attack', 'cast_release', 'judgment_burst'];
      case 'cardinal_serdin':
        return ['heavy_attack', 'cast_release', 'judgment_wave', 'taunt_or_command'];
      default:
        switch (enemy.pattern) {
          case 'charger':
            return ['charge_impact', 'attack_basic_01', 'run', 'walk'];
          case 'caster':
            return ['cast_release', 'attack_basic_01', 'cast_start', 'walk'];
          case 'ranged':
            return ['attack_basic_01', 'aim', 'walk'];
          default:
            return ['attack_basic_01', 'walk'];
        }
    }
  }

  private getEnemyChargeClipIds(
    enemy: BattleSimulationState['enemies'][number],
    subjectId: string,
  ): string[] {
    switch (subjectId) {
      case 'blackhorn_chieftain':
      case 'morgan':
      case 'setra':
        return ['charge_start', 'charge_impact'];
      case 'elrent':
        return ['cast_start', 'cast_loop', 'cast_release', 'tidal_burst'];
      case 'nereph':
        return ['cast_start', 'cast_release', 'tidal_sweep'];
      case 'dravorn':
      case 'varkan':
        return ['cast_start', 'cast_loop', 'cast_release', 'charge_burst'];
      case 'hrod':
        return ['charge_step', 'stomp_burst', 'roar_or_enrage'];
      default:
        switch (enemy.pattern) {
          case 'charger':
            return ['charge_start', 'run', 'charge_impact'];
          case 'caster':
            return ['cast_start', 'cast_loop', 'cast_release'];
          case 'ranged':
            return ['aim', 'attack_basic_01'];
          default:
            return this.getEnemyAttackClipIds(enemy, subjectId);
        }
    }
  }

  private getEnemyRuntimeSubjectId(
    enemy: BattleSimulationState['enemies'][number],
  ): string | null {
    if (enemy.subjectId) {
      return enemy.subjectId;
    }

    switch (this.stage.continentId) {
      case 'continent_01':
        if (enemy.kind === 'boss') {
          return this.stage.stageType === 'final_boss' ? 'morgan' : 'blackhorn_chieftain';
        }

        if (enemy.pattern === 'charger') {
          return 'corrupted_wild_boar';
        }

        if (enemy.pattern === 'ranged' || enemy.pattern === 'caster') {
          return 'grassland_raider_vanguard';
        }

        return 'thorn_wolf';
      case 'continent_02':
        if (enemy.kind === 'boss') {
          return this.stage.stageType === 'final_boss' ? 'dravorn' : 'bares';
        }

        if (enemy.pattern === 'ranged' || enemy.pattern === 'caster') {
          return 'slag_automaton';
        }

        if (enemy.kind === 'elite') {
          return 'ember_heavy_trooper';
        }

        return 'ash_mine_worker';
      case 'continent_03':
        if (enemy.kind === 'boss') {
          return this.stage.stageType === 'final_boss' ? 'nereph' : 'elrent';
        }

        if (enemy.pattern === 'caster') {
          return 'corrupted_sanctuary_guardian';
        }

        if (enemy.pattern === 'ranged') {
          return 'mist_raider';
        }

        return enemy.pattern === 'charger' ? 'coastal_horror' : 'coastal_horror';
      case 'continent_04':
        if (enemy.kind === 'boss') {
          return this.stage.stageType === 'final_boss' ? 'valtern' : 'hrod';
        }

        if (enemy.pattern === 'caster') {
          return 'barrow_wraith';
        }

        if (enemy.pattern === 'charger') {
          return 'frost_hound';
        }

        return 'frozen_legion_trooper';
      case 'continent_05':
        if (enemy.kind === 'boss') {
          return this.stage.stageType === 'final_boss' ? 'kazer' : 'setra';
        }

        if (enemy.pattern === 'caster') {
          return 'ruin_automaton';
        }

        if (enemy.pattern === 'charger') {
          return 'sand_tracker_beast';
        }

        return enemy.pattern === 'ranged' ? 'mirage_raider' : 'mirage_raider';
      case 'continent_06':
        if (enemy.kind === 'boss') {
          return this.stage.stageType === 'final_boss' ? 'varkan' : 'cardinal_serdin';
        }

        if (enemy.pattern === 'caster') {
          return 'black_moon_inquisitor';
        }

        if (enemy.pattern === 'charger') {
          return 'fallen_holy_knight';
        }

        return 'black_moon_vanguard';
      default:
        return null;
    }
  }

  private renderEffects(): void {
    this.effectLayer.clear();
    const activeEffectSpriteIds = new Set<string>();

    for (const member of this.battle.party) {
      if (member.hp <= 0) {
        continue;
      }

      if (member.shieldHp > 0) {
        this.effectLayer.lineStyle(2, 0x8ec7ff, 0.78);
        this.effectLayer.strokeCircle(member.x, member.y, 16 + Math.min(8, member.shieldHp / 18));
      }

      if (member.damageBoostMs > 0) {
        this.effectLayer.lineStyle(2, 0xffdf8f, 0.7);
        this.effectLayer.strokeCircle(member.x, member.y, 21);
      }

      if (member.guardTauntMs > 0) {
        this.effectLayer.lineStyle(2, 0xffc98a, 0.65);
        this.effectLayer.strokeCircle(member.x, member.y, 26);
      }

      if (member.highlightMs > 0) {
        const alpha = Phaser.Math.Clamp(member.highlightMs / 260, 0, 1);
        const pulse = 1 - alpha;
        this.effectLayer.fillStyle(0xff3a28, 0.2 * alpha);
        this.effectLayer.fillCircle(member.x, member.y - 18, 30 + pulse * 12);
        this.effectLayer.lineStyle(4, 0xffe2a8, 0.85 * alpha);
        this.effectLayer.strokeCircle(member.x, member.y - 18, 20 + pulse * 16);
        this.effectLayer.lineStyle(3, 0xff5f3c, 0.8 * alpha);
        for (let index = 0; index < 4; index += 1) {
          const angle = -0.9 + index * 0.6;
          const fromX = member.x + Math.cos(angle) * 10;
          const fromY = member.y - 18 + Math.sin(angle) * 8;
          this.effectLayer.beginPath();
          this.effectLayer.moveTo(fromX, fromY);
          this.effectLayer.lineTo(fromX + Math.cos(angle) * (18 + pulse * 12), fromY + Math.sin(angle) * (14 + pulse * 8));
          this.effectLayer.strokePath();
        }
      }
    }

    for (const effect of this.battle.effects) {
      const alpha = Phaser.Math.Clamp(effect.ttlMs / effect.maxTtlMs, 0, 1);
      const progress = 1 - alpha;

      if (this.renderRuntimeEffect(effect, activeEffectSpriteIds)) {
        continue;
      }

      switch (effect.kind) {
        case 'projectile':
          this.effectLayer.lineStyle(2, effect.color, alpha * 0.42);
          this.effectLayer.beginPath();
          this.effectLayer.moveTo(effect.fromX, effect.fromY);
          this.effectLayer.lineTo(effect.x, effect.y);
          this.effectLayer.strokePath();
          this.effectLayer.fillStyle(effect.color, Math.max(0.3, alpha));
          this.effectLayer.fillCircle(effect.x, effect.y, effect.size);
          break;
        case 'slash':
          this.effectLayer.lineStyle(4, effect.color, alpha);
          this.effectLayer.beginPath();
          this.effectLayer.moveTo(effect.fromX, effect.fromY);
          this.effectLayer.lineTo(effect.toX, effect.toY);
          this.effectLayer.strokePath();
          break;
        case 'telegraph':
          this.effectLayer.fillStyle(effect.color, alpha * 0.12);
          this.effectLayer.fillCircle(effect.toX, effect.toY, effect.size * (0.92 + progress * 0.18));
          this.effectLayer.lineStyle(2, effect.color, alpha * 0.9);
          this.effectLayer.strokeCircle(effect.toX, effect.toY, effect.size * (1 + progress * 0.08));
          break;
        case 'charge':
          this.effectLayer.lineStyle(5, effect.color, alpha * 0.75);
          this.effectLayer.beginPath();
          this.effectLayer.moveTo(effect.fromX, effect.fromY);
          this.effectLayer.lineTo(effect.x, effect.y);
          this.effectLayer.strokePath();
          this.effectLayer.fillStyle(effect.color, alpha * 0.4);
          this.effectLayer.fillCircle(effect.x, effect.y, effect.size * 0.65);
          break;
        case 'heal':
        case 'buff':
        case 'impact':
        case 'burst':
          this.effectLayer.fillStyle(effect.color, alpha * (effect.kind === 'impact' ? 0.18 : 0.12));
          this.effectLayer.fillCircle(effect.x, effect.y, effect.size * (0.8 + progress * 0.55));
          this.effectLayer.lineStyle(3, effect.color, alpha);
          this.effectLayer.strokeCircle(effect.x, effect.y, effect.size * (0.72 + progress * 0.62));
          break;
      }
    }

    this.effectSprites.forEach((sprite, effectId) => {
      if (!activeEffectSpriteIds.has(effectId)) {
        sprite.setVisible(false);
      }
    });
  }

  private renderRuntimeEffect(
    effect: BattleSimulationState['effects'][number],
    activeEffectSpriteIds: Set<string>,
  ): boolean {
    const runtimeClip = this.getBattleEffectRuntimeClip(effect);

    if (!runtimeClip || !this.textures.exists(runtimeClip.textureKey)) {
      return false;
    }

    const sprite = this.ensureEffectSprite(effect.id);
    const progress = 1 - Phaser.Math.Clamp(effect.ttlMs / effect.maxTtlMs, 0, 1);
    const fps = runtimeClip.fps ?? 8;
    const rawFrame = Math.floor((effect.maxTtlMs * progress / 1000) * fps);
    const frameIndex =
      effect.kind === 'telegraph' || runtimeClip.id === 'fx_guardian_shield'
        ? Phaser.Math.Wrap(rawFrame, 0, runtimeClip.frameCount)
        : Math.min(runtimeClip.frameCount - 1, rawFrame);
    const angle = Phaser.Math.Angle.Between(effect.fromX, effect.fromY, effect.toX, effect.toY);

    let x = effect.x;
    let y = effect.y;
    let scale = 1;
    let rotation = 0;

    switch (effect.kind) {
      case 'slash':
        x = (effect.fromX + effect.toX) * 0.5;
        y = (effect.fromY + effect.toY) * 0.5;
        scale = Phaser.Math.Clamp(
          Phaser.Math.Distance.Between(effect.fromX, effect.fromY, effect.toX, effect.toY) / (runtimeClip.frameWidth * 0.82),
          0.62,
          1.76,
        );
        rotation = angle;
        break;
      case 'projectile':
      case 'charge':
        scale = Phaser.Math.Clamp(effect.size / 22, 0.48, 0.92);
        rotation = angle;
        break;
      case 'telegraph':
        x = effect.toX;
        y = effect.toY;
        scale = Phaser.Math.Clamp(effect.size / 82, 0.48, 1.02);
        break;
      case 'impact':
      case 'burst':
      case 'heal':
      case 'buff':
        x = effect.toX;
        y = effect.toY;
        scale = Phaser.Math.Clamp(effect.size / 46, 0.44, 0.88);
        break;
    }

    sprite
      .setTexture(runtimeClip.textureKey, frameIndex)
      .setPosition(x, y)
      .setRotation(rotation)
      .setDisplaySize(runtimeClip.frameWidth * scale, runtimeClip.frameHeight * scale)
      .setAlpha(
        effect.kind === 'telegraph'
          ? 0.16 + (1 - progress) * 0.1
          : Phaser.Math.Clamp(effect.ttlMs / effect.maxTtlMs, 0.08, 0.46),
      )
      .setBlendMode(Phaser.BlendModes.ADD)
      .setVisible(true);

    activeEffectSpriteIds.add(effect.id);
    return true;
  }

  private ensureEffectSprite(effectId: string): Phaser.GameObjects.Image {
    const existing = this.effectSprites.get(effectId);

    if (existing && existing.scene) {
      return existing;
    }

    const sprite = this.add.image(0, 0, ATLAS_KEY, AtlasFrame.Star).setVisible(false).setOrigin(0.5);
    this.effectSpriteLayer.add(sprite);
    this.effectSprites.set(effectId, sprite);
    return sprite;
  }

  private getBattleEffectRuntimeClip(
    effect: BattleSimulationState['effects'][number],
  ): RuntimeAnimationClipEntry | null {
    let subjectId: string | null = null;
    let clipId: string | null = null;

    if (effect.source === 'party') {
      switch (effect.kind) {
        case 'slash':
          subjectId = 'party_melee';
          clipId = 'fx_slash_arc';
          break;
        case 'impact':
          subjectId = 'party_melee';
          clipId = 'fx_impact_burst';
          break;
        case 'charge':
          subjectId = 'party_melee';
          clipId = 'fx_charge_trail';
          break;
        case 'projectile':
          subjectId = 'party_magic';
          clipId = 'fx_projectile_arcane';
          break;
        case 'burst':
          subjectId = 'party_magic';
          clipId = 'fx_burst_arcane';
          break;
        case 'heal':
          subjectId = 'support_magic';
          clipId = 'fx_heal_wave';
          break;
        case 'buff':
        case 'telegraph':
          subjectId = 'support_magic';
          clipId = this.isGuardianBarrierColor(effect.color) ? 'fx_guardian_shield' : 'fx_buff_halo';
          break;
      }
    } else {
      switch (effect.kind) {
        case 'slash':
          subjectId = 'party_melee';
          clipId = 'fx_slash_arc';
          break;
        case 'impact':
          subjectId = 'enemy_ranged';
          clipId = 'fx_impact_burst';
          break;
        case 'projectile':
          subjectId = 'enemy_ranged';
          clipId = 'fx_projectile_enemy';
          break;
        case 'telegraph':
          subjectId = effect.size >= 46 ? 'boss_battle' : 'enemy_ranged';
          clipId = 'fx_telegraph_ring';
          break;
        case 'charge':
          subjectId = 'boss_battle';
          clipId = 'fx_charge_trail';
          break;
        case 'burst':
          if (effect.size >= 30) {
            subjectId = 'boss_battle';
            clipId = 'fx_burst_boss';
          } else {
            subjectId = 'enemy_ranged';
            clipId = 'fx_impact_burst';
          }
          break;
      }
    }

    if (!subjectId || !clipId) {
      return null;
    }

    return getRuntimeAnimationClip(this, 'effect', subjectId, clipId);
  }

  private isGuardianBarrierColor(color: number): boolean {
    return color === 0x8ec7ff || color === 0xb6d9ff || color === 0xb8dcff;
  }

  private applyLeaderControl(deltaMs: number): void {
    const joystickVector = this.joystick.getVector();
    let dx = joystickVector.x;
    let dy = joystickVector.y;

    const magnitude = Math.hypot(dx, dy);
    if (magnitude <= 0.12) {
      return;
    }

    if (this.battle.autoPlayer) {
      this.battle = setAutoBattleMode(this.battle, false);
    }

    this.battle = applyLeaderManualMovement(this.battle, dx / magnitude, dy / magnitude, deltaMs);
  }

  private tryCommandSkill(): void {
    if (this.battle.autoPlayer) {
      this.battle = setAutoBattleMode(this.battle, false);
    }

    const next = castLeaderCommandSkill(this.battle);
    if (next === this.battle) {
      this.battle = {
        ...this.battle,
        lastEvent: '베기 스킬이 아직 준비되지 않았습니다.',
      };
      this.refreshCombatViewClean();
      return;
    }

    this.battle = next;
    this.refreshCombatViewClean();
  }

  private tryManualSkill(): void {
    if (this.battle.autoPlayer) {
      this.battle = setAutoBattleMode(this.battle, false);
    }

    const next = castLeaderSkill(this.battle, true);

    if (next === this.battle) {
      this.battle = {
        ...this.battle,
        lastEvent: '리더 스킬 게이지가 아직 가득 차지 않았습니다.',
      };
      this.refreshCombatViewClean();
      return;
    }

    this.battle = next;
    this.refreshCombatViewClean();
  }

  private finishBattle(): void {
    if (this.resolved) {
      return;
    }

    this.resolved = true;
    const completedAt = Date.now();
    const beforeUnlocked = new Set(this.snapshot.world.unlockedContinents);
    const starsEarned = calculateBattleStars(this.stage, this.battle);
    const clearTimeSeconds = Math.max(1, Math.round(this.battle.elapsedMs / 1000));
    const rewardRate = getStageClearRewardRate(this.snapshot, this.selection.stageId, this.selection.difficulty);
    let nextSnapshot = completeStage(this.snapshot, {
      continentId: this.selection.continentId,
      stageId: this.selection.stageId,
      difficulty: this.selection.difficulty,
      starsEarned,
      clearTimeSeconds,
      now: completedAt,
    });

    const rewardGold = getStageRewardGold(this.selection.stageId, this.selection.difficulty, rewardRate);
    nextSnapshot = {
      ...nextSnapshot,
      updatedAt: completedAt,
      profile: {
        ...nextSnapshot.profile,
        gold: nextSnapshot.profile.gold + rewardGold,
      },
    };
    const experience = grantStageExperience(nextSnapshot, this.stage, this.selection.difficulty, 'clear', completedAt, rewardRate);
    nextSnapshot = experience.snapshot;
    const recruitment = applyStageRecruitmentReward(nextSnapshot, this.selection.stageId, completedAt);
    nextSnapshot = recruitment.snapshot;
    saveSnapshot(nextSnapshot);

    const unlockedTarget =
      nextSnapshot.world.unlockedContinents.find((entry) => !beforeUnlocked.has(entry)) ?? null;

    this.commitResult({
      continentId: this.selection.continentId,
      continentName: getContinent(this.selection.continentId).name,
      stageId: this.selection.stageId,
      stageName: this.stage.name,
      difficulty: this.selection.difficulty,
      outcome: 'clear',
      starsEarned,
      clearTimeSeconds,
      rewardGold,
      rewardRate,
      unlockedTarget,
      totalDamageDealt: this.battle.totalDamageDealt,
      totalDamageTaken: this.battle.totalDamageTaken,
      manualSkillUses: this.battle.manualSkillUses,
      partyHpRatio: Number(getPartyHpRatio(this.battle).toFixed(3)),
      autoBattleUsed: this.battle.autoPlayer,
      recruitedCharacterId: recruitment.event?.characterId ?? null,
      expRewards: experience.rewards,
    });
  }

  private failBattle(): void {
    if (this.resolved) {
      return;
    }

    this.resolved = true;
    const failedAt = Date.now();
    const experience = grantStageExperience(this.snapshot, this.stage, this.selection.difficulty, 'fail', failedAt);
    this.snapshot = experience.snapshot;
    saveSnapshot(this.snapshot);

    this.commitResult({
      continentId: this.selection.continentId,
      continentName: getContinent(this.selection.continentId).name,
      stageId: this.selection.stageId,
      stageName: this.stage.name,
      difficulty: this.selection.difficulty,
      outcome: 'fail',
      starsEarned: 0,
      clearTimeSeconds: Math.max(1, Math.round(this.battle.elapsedMs / 1000)),
      rewardGold: 0,
      rewardRate: 1,
      unlockedTarget: null,
      totalDamageDealt: this.battle.totalDamageDealt,
      totalDamageTaken: this.battle.totalDamageTaken,
      manualSkillUses: this.battle.manualSkillUses,
      partyHpRatio: Number(getPartyHpRatio(this.battle).toFixed(3)),
      autoBattleUsed: this.battle.autoPlayer,
      recruitedCharacterId: null,
      expRewards: experience.rewards,
    });
  }

  private commitResult(result: BattleResult): void {
    setBattleResult(this, result);
    if (result.outcome === 'clear') {
      const cutsceneId = getStageClearCutsceneId(result.stageId);
      if (cutsceneId && !hasSeenCutscene(loadSnapshot(), cutsceneId)) {
        this.scene.start('cutscene', {
          cutsceneId,
          nextScene: 'result',
        });
        return;
      }
    }

    this.scene.start('result');
  }
}

function truncateHudLabel(label: string, maxChars: number): string {
  return label.length > maxChars ? `${label.slice(0, Math.max(1, maxChars - 1))}\u2026` : label;
}

