import Phaser from 'phaser';
import {
  buildRecruitmentCardFlightSpec,
  getRecruitmentAcquisitionTitle,
  getRecruitmentJoinedRosterMessage,
  type RecruitmentEffectPhase,
} from '../core/recruitmentPresentation';
import { AD_REWARD_FATIGUE, FATIGUE_COST_PER_STAGE, claimAdReward, enterStage } from '../core/state';
import { AtlasFrame, ATLAS_KEY } from '../data/atlas';
import { getCharacter } from '../data/characters';
import { getStageStoryEvent, hasSeenStageStoryEvent, markStageStoryEventSeen } from '../data/stageStoryEvents';
import { getStageRecruitmentEvent } from '../data/stageRecruitEvents';
import {
  getContinent,
  getNextStage,
  getStage,
  getStageBackgroundKey,
  getUnlockTargetLabel,
} from '../data/world';
import { t, translateDifficulty } from '../services/i18n';
import { loadSnapshot, saveSnapshot } from '../services/save';
import { getBattleResult, getStageSelection, setStageSelection } from '../services/session';
import type { BattleExpReward, BattleResult, CharacterRarity, DialogueLine, StageSelection } from '../types';
import { buildDebugState } from '../ui/debugHud';
import { DialogueOverlay } from '../ui/dialogueOverlay';
import { applyCharacterFacePortrait, getRarityBorderColor } from '../ui/collectionArt';
import { createButton, paintBackdrop } from '../ui/widgets';
import { showResultInterstitial, showRewardedFatigueAd } from '../../platform/ads';

export class ResultScene extends Phaser.Scene {
  private messageText!: Phaser.GameObjects.Text;
  private fatigueText!: Phaser.GameObjects.Text;
  private fatigueBarFill!: Phaser.GameObjects.Rectangle;
  private fatigueAdButton: Phaser.GameObjects.Container | null = null;
  private fatigueAdBusy = false;
  private dialogueOverlay!: DialogueOverlay;
  private currentResult: BattleResult | null = null;
  private recruitmentEffectActive = false;
  private recruitmentEffectCharacterId: string | null = null;
  private recruitmentEffectPhase: RecruitmentEffectPhase = 'idle';
  private recruitmentEffectLayer: Phaser.GameObjects.Container | null = null;

  constructor() {
    super('result');
  }

  create(): void {
    const result = getBattleResult(this);
    if (!result) {
      this.scene.start('village', { spawnId: 'world_gate_return' });
      return;
    }

    this.currentResult = result;
    const snapshot = loadSnapshot();

    this.drawLayout(result);
    this.dialogueOverlay = new DialogueOverlay(this, 1100);
    this.input.on('pointerup', this.handlePointerAdvance, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off('pointerup', this.handlePointerAdvance, this);
      this.clearRecruitmentEffect();
    });

    const postClearEvent = result.outcome === 'clear' ? getStageStoryEvent(result.stageId, 'post_clear') : null;
    const recruitEvent =
      result.outcome === 'clear' && result.recruitedCharacterId
        ? getStageRecruitmentEvent(result.stageId)
        : null;

    if (postClearEvent && !hasSeenStageStoryEvent(snapshot, postClearEvent.id)) {
      this.messageText.setText('스토리 이벤트');
      this.dialogueOverlay.showSequence(
        postClearEvent.lines.map((line) => ({
          ...line,
          speaker: {
            ...line.speaker,
            name: t(this, line.speaker.name),
          },
          text: t(this, line.text),
        })),
        () => {
          saveSnapshot(markStageStoryEventSeen(loadSnapshot(), postClearEvent.id));
          if (recruitEvent && recruitEvent.characterId === result.recruitedCharacterId) {
            this.showRecruitmentDialogue(recruitEvent.characterId, recruitEvent.characterName, recruitEvent.lines);
          } else {
            this.messageText.setText('클리어했습니다. 다음 행동을 선택하세요.');
          }
        },
      );
    } else if (recruitEvent && recruitEvent.characterId === result.recruitedCharacterId) {
      this.showRecruitmentDialogue(recruitEvent.characterId, recruitEvent.characterName, recruitEvent.lines);
    } else if (result.outcome === 'clear') {
      this.messageText.setText('클리어했습니다. 다음 행동을 선택하세요.');
    } else {
      this.messageText.setText('전투에 실패했습니다. 재정비 후 다시 도전할 수 있습니다.');
    }

    if (result.outcome === 'clear') {
      void showResultInterstitial();
    }
  }

  private showRecruitmentDialogue(characterId: string, characterName: string, lines: DialogueLine[]): void {
    const localizedCharacterName = t(this, characterName, undefined, characterName);
    this.messageText.setText(`${localizedCharacterName} 동료 이벤트`);
    this.dialogueOverlay.showSequence(
      lines.map((line) => ({
        ...line,
        speaker: {
          ...line.speaker,
          name: t(this, line.speaker.name),
        },
        text: t(this, line.text),
      })),
      () => {
        this.messageText.setText(getRecruitmentJoinedRosterMessage(localizedCharacterName));
        this.playCharacterJoinEffect(characterId, localizedCharacterName);
      },
    );
  }

  private playCharacterJoinEffect(characterId: string, fallbackName: string): void {
    this.clearRecruitmentEffect();

    let rarity: CharacterRarity = 3;
    try {
      rarity = getCharacter(characterId).rarity;
    } catch {
      // Keep the default frame if the character definition is unavailable.
    }

    const spec = buildRecruitmentCardFlightSpec(rarity);
    const borderColor = getRarityBorderColor(rarity);
    const particleColor = rarity >= 5 ? 0xffefbd : rarity >= 4 ? 0xdccaff : 0xd9ecf7;
    const title = getRecruitmentAcquisitionTitle(fallbackName);
    const layer = this.add.container(0, 0).setDepth(1200);
    const veil = this.add.rectangle(180, 320, 360, 640, 0x02060a, 0.72).setInteractive();
    const landingGlow = this.add.circle(spec.landX, spec.landY, 64, borderColor, 0.12).setAlpha(0);
    const revealRing = this.add.circle(spec.landX, spec.landY, 42, borderColor, 0).setStrokeStyle(4, borderColor, 0.86).setAlpha(0);
    const particles: Phaser.GameObjects.Image[] = [];
    for (let index = 0; index < spec.particleCount; index += 1) {
      const particle = this.add
        .image(spec.landX, spec.landY, ATLAS_KEY, AtlasFrame.Star)
        .setTint(index % 4 === 0 ? 0xffffff : particleColor)
        .setAlpha(0)
        .setScale(0.18)
        .setDisplaySize(index % 3 === 0 ? 16 : 11, index % 3 === 0 ? 16 : 11);
      particles.push(particle);
    }

    const card = this.add.container(spec.startX, spec.startY);
    const shadow = this.add.rectangle(0, 12, 140, 184, 0x000000, 0.32);
    const glow = this.add.rectangle(0, 0, 150, 194, borderColor, 0.12);
    const frame = this.add.rectangle(0, 0, 124, 166, 0x17131b, 0.97).setStrokeStyle(4, borderColor, 0.9);
    const portraitPanel = this.add.rectangle(0, -18, 106, 112, 0x09131c, 0.88).setStrokeStyle(1, 0xffffff, 0.14);
    const portrait = this.add.image(0, -16, ATLAS_KEY, AtlasFrame.Hero);
    applyCharacterFacePortrait(this, portrait, characterId, 98, 106, 0, 1);
    const rarityText = this.add.text(0, -76, '*'.repeat(rarity), {
      fontFamily: 'Segoe UI',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#1a110b',
      strokeThickness: 3,
    }).setOrigin(0.5);
    const namePlate = this.add.rectangle(0, 60, 112, 30, 0x26170d, 0.78).setStrokeStyle(1, borderColor, 0.4);
    const nameText = this.add.text(0, 60, fallbackName, {
      fontFamily: 'Segoe UI',
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#1a110b',
      strokeThickness: 4,
    }).setOrigin(0.5);
    const titleText = this.add.text(180, 428, title, {
      fontFamily: 'Segoe UI',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#130d09',
      strokeThickness: 5,
    }).setOrigin(0.5).setAlpha(0).setScale(0.86);
    const subtitleText = this.add.text(180, 456, '새 동료가 로스터에 합류했습니다.', {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      color: '#f4dfae',
      stroke: '#130d09',
      strokeThickness: 3,
    }).setOrigin(0.5).setAlpha(0);

    card.add([shadow, glow, frame, portraitPanel, portrait, rarityText, namePlate, nameText]);
    card.setAngle(spec.startAngle).setScale(spec.startScale);
    layer.add([veil, landingGlow, revealRing, ...particles, card, titleText, subtitleText]);
    this.recruitmentEffectLayer = layer;
    this.recruitmentEffectActive = true;
    this.recruitmentEffectCharacterId = characterId;
    this.recruitmentEffectPhase = 'flight';

    this.tweens.add({
      targets: card,
      x: spec.landX,
      y: spec.landY,
      angle: spec.spinAngle,
      scaleX: spec.landScale,
      scaleY: spec.landScale,
      duration: spec.flightMs,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.recruitmentEffectPhase = 'reveal';
        this.tweens.add({
          targets: [titleText, subtitleText],
          alpha: 1,
          duration: 180,
          delay: spec.revealDelayMs,
        });
        this.tweens.add({
          targets: titleText,
          scaleX: 1,
          scaleY: 1,
          duration: 220,
          delay: spec.revealDelayMs,
          ease: 'Back.easeOut',
        });
        this.tweens.add({
          targets: card,
          scaleX: 1.06,
          scaleY: 1.06,
          yoyo: true,
          repeat: 1,
          duration: 140,
        });
        this.tweens.add({
          targets: landingGlow,
          alpha: { from: 0.38, to: 0 },
          scaleX: { from: 0.42, to: 1.7 },
          scaleY: { from: 0.42, to: 1.7 },
          duration: 520,
          ease: 'Cubic.easeOut',
        });
        this.tweens.add({
          targets: revealRing,
          alpha: { from: 0.94, to: 0 },
          scaleX: { from: 0.5, to: 1.65 },
          scaleY: { from: 0.5, to: 1.65 },
          duration: 460,
          ease: 'Cubic.easeOut',
        });
        particles.forEach((particle, index) => {
          const angle = (Math.PI * 2 * index) / particles.length;
          const radius = spec.particleRadius * (0.72 + (index % 4) * 0.1);
          this.tweens.add({
            targets: particle,
            x: spec.landX + Math.cos(angle) * radius,
            y: spec.landY + Math.sin(angle) * radius,
            alpha: { from: 1, to: 0 },
            scaleX: { from: 0.32, to: 0.78 },
            scaleY: { from: 0.32, to: 0.78 },
            angle: index % 2 === 0 ? 180 : -180,
            duration: 560 + (index % 3) * 90,
            ease: 'Cubic.easeOut',
          });
        });
      },
    });
    this.tweens.add({
      targets: glow,
      alpha: { from: 0.12, to: 0.5 },
      yoyo: true,
      repeat: 5,
      duration: 160,
      delay: Math.max(120, spec.flightMs - 320),
    });

    this.time.delayedCall(spec.flightMs + spec.holdMs, () => {
      if (this.recruitmentEffectLayer !== layer || !layer.scene) {
        return;
      }

      this.tweens.add({
        targets: layer,
        alpha: 0,
        duration: spec.fadeMs,
        onComplete: () => {
          if (this.recruitmentEffectLayer === layer) {
            this.recruitmentEffectLayer = null;
            this.recruitmentEffectActive = false;
            this.recruitmentEffectCharacterId = null;
            this.recruitmentEffectPhase = 'done';
          }
          layer.destroy(true);
        },
      });
    });
  }

  private clearRecruitmentEffect(): void {
    if (this.recruitmentEffectLayer) {
      this.recruitmentEffectLayer.destroy(true);
      this.recruitmentEffectLayer = null;
    }

    this.recruitmentEffectActive = false;
    this.recruitmentEffectCharacterId = null;
    this.recruitmentEffectPhase = 'idle';
  }

  update(_: number, delta: number): void {
    this.stepSimulation(delta);
  }

  public stepSimulation(_: number): void {
    this.dialogueOverlay?.update();
  }

  private handlePointerAdvance(): void {
    if (this.dialogueOverlay?.isBlocking()) {
      this.dialogueOverlay.advance();
    }
  }

  public renderGameToText(): string {
    const result = this.currentResult;
    const snapshot = loadSnapshot();
    return JSON.stringify(
      buildDebugState('result', snapshot, {
        outcome: result?.outcome ?? null,
        stageId: result?.stageId ?? null,
        starsEarned: result?.starsEarned ?? 0,
        rewardGold: result?.rewardGold ?? 0,
        rewardRate: result?.rewardRate ?? 1,
        manualSkillUses: result?.manualSkillUses ?? 0,
        fatigue: snapshot.profile.fatigue,
        maxFatigue: snapshot.profile.maxFatigue,
        fatigueCostPerStage: FATIGUE_COST_PER_STAGE,
        fatigueAdReward: AD_REWARD_FATIGUE,
        recruitedCharacterId: result?.recruitedCharacterId ?? null,
        dialogueActive: this.dialogueOverlay?.isVisible() ?? false,
        recruitmentEffect: {
          active: this.recruitmentEffectActive,
          characterId: this.recruitmentEffectCharacterId,
          phase: this.recruitmentEffectPhase,
        },
        availableActions:
          result?.outcome === 'clear'
            ? ['go_to_next_stage', 'watch_fatigue_ad', 'back_to_stage_list', 'back_to_village']
            : ['retry_stage', 'watch_fatigue_ad', 'back_to_stage_list', 'back_to_village'],
      }),
    );
  }

  private drawLayout(result: BattleResult): void {
    const backgroundKey = getStageBackgroundKey(result.stageId);
    const accentColor = result.outcome === 'clear' ? 0x8fd26f : 0xd27c72;
    const accentLabel = result.outcome === 'clear' ? '클리어' : '실패';
    const continentName = getContinent(result.continentId).name ?? result.continentName;
    const stageDefinition = getStage(result.stageId);
    const stageName = stageDefinition.name ?? result.stageName;
    const hasNextStage = Boolean(result.outcome === 'clear' && this.getNextStageSelection());
    const primaryLabel = result.outcome === 'clear' ? (hasNextStage ? '다음 전투' : '목록으로') : '재도전';

    if (this.textures.exists(backgroundKey)) {
      this.add.image(180, 320, backgroundKey).setDisplaySize(360, 640);
      this.add.rectangle(180, 320, 360, 640, 0x05080c, 0.48);
    } else {
      paintBackdrop(this, AtlasFrame.StoneTile, result.outcome === 'clear' ? 0x6a7d60 : 0x7a5c5c);
    }

    this.add.rectangle(180, 86, 316, 104, 0x071018, 0.8).setStrokeStyle(1, 0xe3cf93, 0.18);
    this.add.rectangle(180, 318, 316, 326, 0x071018, 0.78).setStrokeStyle(1, 0xe3cf93, 0.16);
    this.add.rectangle(180, 532, 316, 34, 0x071018, 0.74).setStrokeStyle(1, 0xe3cf93, 0.14);
    this.add.rectangle(180, 572, 316, 92, 0x071018, 0.72).setStrokeStyle(1, 0xe3cf93, 0.12);

    this.add.rectangle(180, 318, 300, 308, 0x081119, 0.18).setDepth(0.2);
    this.add.rectangle(180, 104, 296, 6, accentColor, 0.94).setDepth(1);

    this.add.text(32, 38, continentName, {
      fontFamily: 'Segoe UI',
      fontSize: '18px',
      color: '#fff1cb',
      stroke: '#251910',
      strokeThickness: 4,
    });
    this.add.text(32, 58, `${stageName} | ${translateDifficulty(this, result.difficulty)}`, {
      fontFamily: 'Segoe UI',
      fontSize: '14px',
      color: '#f7e7bb',
      stroke: '#251910',
      strokeThickness: 3,
    });

    const summaryLines = [
      `결과: ${accentLabel}`,
      `획득 골드: ${result.outcome === 'clear' ? result.rewardGold : 0}`,
    ];
    const unlockTarget = getUnlockTargetLabel(result.unlockedTarget);
    if (unlockTarget) {
      summaryLines.push(`해금: ${t(this, unlockTarget)}`);
    }

    for (let index = 0; index < 3; index += 1) {
      this.add
        .image(132 + index * 48, 128, ATLAS_KEY, AtlasFrame.Star)
        .setDisplaySize(30, 30)
        .setTint(index < result.starsEarned ? 0xffd66d : 0x6c6458);
    }

    this.add.text(34, 164, '전투 결과', {
      fontFamily: 'Segoe UI',
      fontSize: '16px',
      color: '#fff0c8',
      fontStyle: 'bold',
      stroke: '#1f1712',
      strokeThickness: 3,
    });

    this.add.text(34, 194, summaryLines.join('\n'), {
      fontFamily: 'Segoe UI',
      fontSize: '13px',
      color: '#f5ecd7',
      stroke: '#1f1712',
      strokeThickness: 3,
      lineSpacing: 5,
      wordWrap: { width: 292 },
    });

    this.drawFatiguePanel();

    this.add.text(34, 250, '획득 경험치', {
      fontFamily: 'Segoe UI',
      fontSize: '15px',
      color: '#ffe1a6',
      fontStyle: 'bold',
      stroke: '#1f1712',
      strokeThickness: 3,
    });

    this.drawExperienceRewards(result);

    this.messageText = this.add.text(34, 522, '', {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#ffe8b7',
      stroke: '#251910',
      strokeThickness: 3,
      wordWrap: { width: 292 },
      lineSpacing: 4,
    });

    createButton(this, 72, 582, {
      width: 112,
      height: 34,
      label: primaryLabel,
      backgroundFrame: AtlasFrame.GoldButton,
      onClick: () => {
        if (!this.dialogueOverlay?.isBlocking()) {
          this.runPrimaryAction();
        }
      },
    });
    createButton(this, 184, 582, {
      width: 112,
      height: 34,
      label: '스테이지 목록',
      onClick: () => {
        if (!this.dialogueOverlay?.isBlocking()) {
          this.scene.start('stage-select');
        }
      },
    });
    createButton(this, 292, 582, {
      width: 88,
      height: 34,
      label: '마을',
      onClick: () => {
        if (!this.dialogueOverlay?.isBlocking()) {
          this.scene.start('village', { spawnId: 'world_gate_return' });
        }
      },
    });
  }

  private drawFatiguePanel(): void {
    this.add.rectangle(180, 230, 292, 30, 0x0b1420, 0.64).setStrokeStyle(1, 0xe3cf93, 0.16);
    this.fatigueText = this.add.text(42, 218, '', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#fff1cb',
      stroke: '#1f1712',
      strokeThickness: 3,
      fixedWidth: 174,
    });
    this.add.rectangle(42, 239, 168, 6, 0x1f1710, 0.9).setOrigin(0, 0.5);
    this.fatigueBarFill = this.add.rectangle(42, 239, 168, 4, 0x6fc4ff, 0.92).setOrigin(0, 0.5);
    this.add.rectangle(42, 239, 168, 6, 0x000000, 0).setStrokeStyle(1, 0xe9d8a6, 0.22).setOrigin(0, 0.5);

    this.fatigueAdButton = createButton(this, 270, 230, {
      width: 86,
      height: 24,
      label: `광고 +${AD_REWARD_FATIGUE}`,
      iconFrame: AtlasFrame.BagIcon,
      backgroundFrame: AtlasFrame.BlueButton,
      onClick: () => {
        if (!this.dialogueOverlay?.isBlocking()) {
          void this.claimFatigueRewardFromResult();
        }
      },
    });
    this.refreshFatiguePanel();
  }

  private refreshFatiguePanel(): void {
    const snapshot = loadSnapshot();
    const fatigue = snapshot.profile.fatigue;
    const maxFatigue = snapshot.profile.maxFatigue;
    const fatigueRatio = Phaser.Math.Clamp(fatigue / Math.max(1, maxFatigue), 0, 1);
    const color = fatigue < FATIGUE_COST_PER_STAGE ? 0xff8f72 : 0x6fc4ff;
    const nextFatigue = Math.max(0, fatigue - FATIGUE_COST_PER_STAGE);

    this.fatigueText
      .setColor(fatigue < FATIGUE_COST_PER_STAGE ? '#ffb39b' : '#fff1cb')
      .setText(`피로도 ${fatigue}/${maxFatigue}  다음 -${FATIGUE_COST_PER_STAGE}->${nextFatigue}`);
    this.fatigueBarFill.setFillStyle(color, 0.94).setDisplaySize(Math.max(2, 168 * fatigueRatio), 4);
    this.fatigueAdButton?.setAlpha(fatigue >= maxFatigue ? 0.56 : 1);
  }

  private async claimFatigueRewardFromResult(): Promise<void> {
    if (this.fatigueAdBusy) {
      return;
    }

    const current = loadSnapshot();
    if (current.profile.fatigue >= current.profile.maxFatigue) {
      this.messageText.setText('피로도가 이미 최대치입니다.');
      return;
    }

    this.fatigueAdBusy = true;
    this.messageText.setText('피로도 회복 광고를 불러오는 중입니다.');

    try {
      const rewarded = await showRewardedFatigueAd();
      if (!rewarded.granted) {
        this.messageText.setText('광고 보상이 지급되지 않았습니다. 마을 메뉴에서 다시 시도할 수 있습니다.');
        return;
      }

      const nextSnapshot = claimAdReward(loadSnapshot(), Date.now());
      saveSnapshot(nextSnapshot);
      this.refreshFatiguePanel();
      this.messageText.setText(`피로도 회복 +${rewarded.amount}. 현재 ${nextSnapshot.profile.fatigue}/${nextSnapshot.profile.maxFatigue}`);
    } catch {
      this.messageText.setText('광고 호출에 실패했습니다. 마을 메뉴에서 다시 시도할 수 있습니다.');
    } finally {
      this.fatigueAdBusy = false;
    }
  }

  private drawExperienceRewards(result: BattleResult): void {
    const rewards = Array.isArray(result.expRewards) ? result.expRewards.slice(0, 4) : [];

    if (rewards.length <= 0) {
      this.add.text(34, 278, '참여 캐릭터 없음', {
        fontFamily: 'Segoe UI',
        fontSize: '13px',
        color: '#f5ecd7',
        stroke: '#1f1712',
        strokeThickness: 3,
      });
      return;
    }

    rewards.forEach((reward, index) => this.drawExperienceRewardRow(reward, 276 + index * 56));
  }

  private drawExperienceRewardRow(reward: BattleExpReward, y: number): void {
    this.add.rectangle(180, y + 16, 288, 48, 0x0b1320, 0.54).setStrokeStyle(1, 0xe0ca94, 0.12);
    const portrait = this.add.image(54, y + 16, ATLAS_KEY, AtlasFrame.Hero);
    applyCharacterFacePortrait(this, portrait, reward.characterId, 38, 42, 0, 1);

    const beforeRatio = reward.levelAfter === reward.levelBefore
      ? Phaser.Math.Clamp(reward.expBefore / Math.max(1, reward.expToNextBefore), 0, 1)
      : 0;
    const afterRatio = Phaser.Math.Clamp(reward.expAfter / Math.max(1, reward.expToNextAfter), 0, 1);
    const barX = 88;
    const barY = y + 28;
    const barWidth = 210;

    this.add.text(82, y - 2, `${t(this, reward.characterName, undefined, reward.characterName)}  Lv.${reward.levelAfter}`, {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      color: '#fff1cb',
      stroke: '#1f1712',
      strokeThickness: 3,
      fixedWidth: 206,
    });
    this.add.text(250, y - 2, `+${reward.expGained} EXP`, {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#ffe1a6',
      stroke: '#1f1712',
      strokeThickness: 2,
    });
    if (reward.levelAfter > reward.levelBefore) {
      this.add.text(82, y + 11, `레벨업 ${reward.levelBefore}->${reward.levelAfter}`, {
        fontFamily: 'Segoe UI',
        fontSize: '9px',
        color: '#bfffc0',
        stroke: '#1f1712',
        strokeThickness: 2,
      });
    }

    this.add.rectangle(barX, barY, barWidth, 9, 0x1f1710, 0.88).setOrigin(0, 0.5);
    this.add.rectangle(barX, barY, Math.max(2, barWidth * afterRatio), 7, 0x6bb1e6, 0.9).setOrigin(0, 0.5);
    if (reward.expGained > 0) {
      const gainedStart = reward.levelAfter === reward.levelBefore ? beforeRatio : 0;
      const gainedWidth = Math.max(3, barWidth * Math.max(0, afterRatio - gainedStart));
      this.add.rectangle(barX + barWidth * gainedStart, barY, gainedWidth, 7, 0xffd66d, 0.88).setOrigin(0, 0.5);
    }
    this.add.rectangle(barX, barY, barWidth, 9, 0x000000, 0).setStrokeStyle(1, 0xe9d8a6, 0.25).setOrigin(0, 0.5);
    this.add.text(82, y + 34, `${reward.expAfter}/${reward.expToNextAfter}`, {
      fontFamily: 'Segoe UI',
      fontSize: '9px',
      color: '#e5d5b0',
      stroke: '#1f1712',
      strokeThickness: 2,
    });
  }

  private retryStage(): void {
    const selection = getStageSelection(this);
    if (!selection) {
      this.scene.start('stage-select');
      return;
    }

    const snapshot = loadSnapshot();
    const result = enterStage(snapshot, {
      continentId: selection.continentId,
      stageId: selection.stageId,
      difficulty: selection.difficulty,
      now: Date.now(),
    });

    if (!result.ok) {
      this.messageText.setText('재도전에 실패했습니다. 피로도와 해금 조건을 확인하세요.');
      return;
    }

    saveSnapshot(result.snapshot);
    setStageSelection(this, selection);
    this.scene.start('battle');
  }

  private runPrimaryAction(): void {
    if (!this.currentResult || this.currentResult.outcome !== 'clear') {
      this.retryStage();
      return;
    }

    if (!this.advanceToNextStage()) {
      this.scene.start('stage-select');
    }
  }

  private advanceToNextStage(): boolean {
    const nextSelection = this.getNextStageSelection();
    if (!nextSelection) {
      return false;
    }

    const snapshot = loadSnapshot();
    const result = enterStage(snapshot, {
      continentId: nextSelection.continentId,
      stageId: nextSelection.stageId,
      difficulty: nextSelection.difficulty,
      now: Date.now(),
    });

    if (!result.ok) {
      this.messageText.setText('다음 스테이지 조건이 아직 맞지 않습니다. 스테이지 목록으로 이동합니다.');
      return false;
    }

    saveSnapshot(result.snapshot);
    setStageSelection(this, nextSelection);
    this.scene.start('battle');
    return true;
  }

  private getNextStageSelection(): StageSelection | null {
    const selection = getStageSelection(this);
    if (!selection) {
      return null;
    }

    const nextStage = getNextStage(selection.stageId);
    if (!nextStage) {
      return null;
    }

    return {
      continentId: nextStage.continentId,
      stageId: nextStage.id,
      difficulty: selection.difficulty,
    };
  }
}
