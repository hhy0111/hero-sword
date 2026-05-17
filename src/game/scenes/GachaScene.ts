import { canPerformAdTenSummon, performAdTenSummon, performPaidTenSummon, performSummon } from '../core/summon';
import { AtlasFrame, ATLAS_KEY } from '../data/atlas';
import { getCharacter } from '../data/characters';
import { getWeaponDefinition } from '../data/equipment';
import { getGachaBanners } from '../data/gachaBanners';
import { getGachaItemImageKey } from '../data/gachaItemRuntimeArt';
import { SCREEN_RUNTIME_IMAGE_KEYS } from '../data/screenRuntimeArt';
import { createWeaponVisualRef, getShopThumbnailTextureKey } from '../data/shopArt';
import { SHOP_RUNTIME_IMAGE_KEYS } from '../data/shopRuntimeArt';
import { t } from '../services/i18n';
import { loadSnapshot, saveSnapshot } from '../services/save';
import type { SaveSnapshot, SummonResultEntry } from '../types';
import { buildDebugState } from '../ui/debugHud';
import { createButton, paintBackdrop } from '../ui/widgets';
import {
  applyCharacterFacePortrait,
  getRarityBorderColor,
  getRarityColor,
  getSummonEntryIconFrame,
  getWeaponIconFrame,
} from '../ui/collectionArt';
import { purchaseConfiguredProduct } from '../../platform/store';
import { showRewardedGachaAd } from '../../platform/ads';

interface FeaturedCardVisual {
  card: Phaser.GameObjects.Rectangle;
  backplate: Phaser.GameObjects.Image;
  portraitGlow: Phaser.GameObjects.Rectangle;
  portrait: Phaser.GameObjects.Image;
  iconBg: Phaser.GameObjects.Rectangle;
  icon: Phaser.GameObjects.Image;
  title: Phaser.GameObjects.Text;
  subtitle: Phaser.GameObjects.Text;
}

interface RevealCardVisual {
  card: Phaser.GameObjects.Rectangle;
  backplate: Phaser.GameObjects.Image;
  portraitGlow: Phaser.GameObjects.Rectangle;
  portrait: Phaser.GameObjects.Image;
  iconBg: Phaser.GameObjects.Rectangle;
  icon: Phaser.GameObjects.Image;
  title: Phaser.GameObjects.Text;
  subtitle: Phaser.GameObjects.Text;
}

interface BannerTabVisual {
  card: Phaser.GameObjects.Rectangle;
  frame: Phaser.GameObjects.Image | null;
  title: Phaser.GameObjects.Text;
  tag: Phaser.GameObjects.Text;
}

type SummonMode = 'single' | 'ten' | 'paidTen' | 'adTen';
const PAID_TEN_SUMMON_PRODUCT_ID = 'hs_paid_ten_summon_01';

export class GachaScene extends Phaser.Scene {
  private snapshot!: SaveSnapshot;
  private detailText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private bannerTitleText!: Phaser.GameObjects.Text;
  private bannerTagText!: Phaser.GameObjects.Text;
  private lastResults: SummonResultEntry[] = [];
  private bannerIndex = 0;
  private revealCount = 0;
  private revealTimerMs = 0;
  private isRevealing = false;
  private animationElapsedMs = 0;
  private featuredCards: FeaturedCardVisual[] = [];
  private revealCards: RevealCardVisual[] = [];
  private bannerTabs: BannerTabVisual[] = [];
  private confirmOverlay!: Phaser.GameObjects.Rectangle;
  private confirmFrame!: Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle;
  private confirmTitleText!: Phaser.GameObjects.Text;
  private confirmBodyText!: Phaser.GameObjects.Text;
  private confirmActionButton: Phaser.GameObjects.Container | null = null;
  private confirmCloseButton: Phaser.GameObjects.Container | null = null;
  private pendingSummonMode: SummonMode | null = null;
  private isSummonAnimating = false;
  private paidTenBusy = false;
  private adTenBusy = false;
  private summonAnimationLayer: Phaser.GameObjects.Container | null = null;

  constructor() {
    super('gacha');
  }

  create(): void {
    this.featuredCards = [];
    this.revealCards = [];
    this.bannerTabs = [];
    this.revealCount = 0;
    this.revealTimerMs = 0;
    this.isRevealing = false;
    this.animationElapsedMs = 0;
    this.pendingSummonMode = null;
    this.isSummonAnimating = false;
    this.paidTenBusy = false;
    this.adTenBusy = false;
    this.summonAnimationLayer?.destroy(true);
    this.summonAnimationLayer = null;
    this.snapshot = loadSnapshot();

    this.drawLayout();
    this.refreshView('');
  }

  update(_: number, delta: number): void {
    this.stepSimulation(delta);
  }

  public stepSimulation(deltaMs: number): void {
    this.animationElapsedMs += deltaMs;

    if (this.isRevealing) {
      this.revealTimerMs += deltaMs;
      if (this.revealTimerMs >= 170) {
        this.revealTimerMs = 0;
        this.revealCount = Math.min(this.lastResults.length, this.revealCount + 1);
        if (this.revealCount >= this.lastResults.length) {
          this.isRevealing = false;
        }
        this.refreshRevealCards();
      }
    }

    if (this.isSummonAnimating) {
      this.refreshFeaturedPortraits();
      this.refreshRevealPortraits();
      return;
    }

    if (this.pendingSummonMode) {
      this.refreshFeaturedPortraits();
      this.refreshRevealPortraits();
      return;
    }

    this.refreshFeaturedPortraits();
    this.refreshRevealPortraits();
  }

  public renderGameToText(): string {
    return JSON.stringify(
      buildDebugState('gacha', this.snapshot, {
        bannerId: getGachaBanners()[this.bannerIndex].id,
        pendingSummonMode: this.pendingSummonMode,
        lastResults: this.lastResults.map((entry) => ({
          id: entry.id,
          rarity: entry.rarity,
          kind: entry.kind,
        })),
        revealCount: this.revealCount,
        isRevealing: this.isRevealing,
        isSummonAnimating: this.isSummonAnimating,
        adTenAvailable: canPerformAdTenSummon(this.snapshot),
        availableActions: ['cycle_banner', 'summon_single', 'summon_ten', 'summon_paid_ten', 'summon_ad_ten', 'back_to_village'],
      }),
    );
  }

  private drawLayout(): void {
    if (this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.gachaBackdrop)) {
      this.add.image(180, 320, SCREEN_RUNTIME_IMAGE_KEYS.gachaBackdrop).setDisplaySize(360, 640).setDepth(-12);
      this.add.rectangle(180, 320, 360, 640, 0x08080d, 0.42).setDepth(-11);
    } else {
      paintBackdrop(this, AtlasFrame.StoneTile, 0x685773);
    }
    this.add.rectangle(180, 320, 360, 640, 0x090c16, 0.76).setDepth(-9);
    this.add.ellipse(180, 206, 280, 132, 0x7c5a9e, 0.1).setDepth(-8);
    this.add.ellipse(180, 458, 280, 176, 0x4062a3, 0.08).setDepth(-8);

    if (this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.uiMainFrame)) {
      this.add.image(180, 320, SHOP_RUNTIME_IMAGE_KEYS.uiMainFrame)
        .setDisplaySize(322, 606)
        .setDepth(-6);
    } else {
      this.add.rectangle(180, 320, 328, 606, 0x0d1320, 0.94).setStrokeStyle(2, 0xe0c78b, 0.18).setDepth(-7);
    }
    if (this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.uiHeaderBar)) {
      this.add.image(180, 72, SHOP_RUNTIME_IMAGE_KEYS.uiHeaderBar)
        .setDisplaySize(316, 46)
        .setDepth(-5);
    }

    if (this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.gachaFeaturePanel)) {
      this.add.image(180, 212, SCREEN_RUNTIME_IMAGE_KEYS.gachaFeaturePanel)
        .setDisplaySize(308, 226)
        .setAlpha(0.72)
        .setDepth(-4);
    } else {
      this.add.rectangle(180, 212, 308, 236, 0x111728, 0.82)
        .setStrokeStyle(1, 0xe0c78b, 0.16)
        .setDepth(-4);
    }
    this.add.rectangle(180, 468, 308, 176, 0x111728, 0.84)
      .setStrokeStyle(1, 0xe0c78b, 0.14)
      .setDepth(-4);

    if (this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.uiSectionBar)) {
      this.add.image(180, 122, SHOP_RUNTIME_IMAGE_KEYS.uiSectionBar).setDisplaySize(296, 24).setAlpha(0.92).setDepth(-3);
      this.add.image(180, 352, SHOP_RUNTIME_IMAGE_KEYS.uiSectionBar).setDisplaySize(296, 24).setAlpha(0.92).setDepth(-3);
    }

    this.add.text(30, 34, '소환의 제단', {
      fontFamily: 'Segoe UI',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 3,
    });
    this.add.text(30, 58, '배너를 고른 뒤 안내 레이어를 열고 1회 또는 10회 소환을 진행합니다.', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#d4c29f',
      stroke: '#17110c',
      strokeThickness: 2,
    });
    this.add.text(30, 114, '배너 선택', {
      fontFamily: 'Segoe UI',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 3,
    });
    this.add.text(30, 344, '결과', {
      fontFamily: 'Segoe UI',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 3,
    });

    this.bannerTitleText = this.add.text(24, 128, '', {
      fontFamily: 'Segoe UI',
      fontSize: '18px',
      color: '#fff2cf',
      fontStyle: 'bold',
      stroke: '#17110c',
      strokeThickness: 2,
    });
    this.bannerTagText = this.add.text(24, 150, '', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#d7c39d',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 308 },
      lineSpacing: 1,
    });
    this.detailText = this.add.text(24, 246, '', {
      fontFamily: 'Segoe UI',
      fontSize: '9px',
      color: '#efe1ba',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 296 },
      lineSpacing: 2,
    });
    this.statusText = this.add.text(24, 544, '', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#dcc89d',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 308 },
      lineSpacing: 2,
    });

    getGachaBanners().forEach((banner, index) => {
      const y = 184 + index * 34;
      const frame = this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.gachaBannerPanel)
        ? this.add.image(180, y, SCREEN_RUNTIME_IMAGE_KEYS.gachaBannerPanel).setDisplaySize(296, 42).setDepth(1)
        : null;
      const card = this.add.rectangle(180, y, 296, 32, 0x131926, 0.22).setStrokeStyle(1, 0xe0c78b, 0.12).setDepth(2);
      const title = this.add.text(42, y - 11, '', {
        fontFamily: 'Segoe UI',
        fontSize: '11px',
        fontStyle: 'bold',
        color: '#f5ead0',
        stroke: '#17110c',
        strokeThickness: 2,
      }).setDepth(3);
      const tag = this.add.text(42, y + 2, '', {
        fontFamily: 'Segoe UI',
        fontSize: '8px',
        color: '#d4c29f',
        stroke: '#17110c',
        strokeThickness: 2,
      }).setDepth(3);
      card.setInteractive(new Phaser.Geom.Rectangle(-148, -16, 296, 32), Phaser.Geom.Rectangle.Contains);
      card.on('pointerup', () => {
        this.bannerIndex = index;
        this.refreshView('');
      });
      this.bannerTabs.push({ card, frame, title, tag });
    });

    const featuredPositions = [
      [58, 288],
      [139, 288],
      [220, 288],
      [301, 288],
    ] as const;
    featuredPositions.forEach(([x, y]) => {
      this.featuredCards.push(this.createVisualCard(x, y, 66, 86));
    });

    for (let index = 0; index < 10; index += 1) {
      const column = index % 5;
      const row = Math.floor(index / 5);
      const x = 46 + column * 60;
      const y = 414 + row * 82;
      this.revealCards.push(this.createVisualCard(x, y, 54, 78));
    }

    createButton(this, 34, 604, {
      width: 58,
      height: 36,
      label: t(this, 'ui.single'),
      iconFrame: AtlasFrame.Star,
      backgroundFrame: AtlasFrame.GoldButton,
      contentOffsetY: 1,
      onClick: () => this.openSummonConfirm('single'),
    });
    createButton(this, 96, 604, {
      width: 58,
      height: 36,
      label: t(this, 'ui.ten'),
      iconFrame: AtlasFrame.Star,
      backgroundFrame: AtlasFrame.GoldButton,
      contentOffsetY: 1,
      onClick: () => this.openSummonConfirm('ten'),
    });
    createButton(this, 166, 604, {
      width: 72,
      height: 36,
      label: t(this, 'ui.paid_ten', undefined, '유료10회'),
      iconFrame: AtlasFrame.Star,
      backgroundFrame: AtlasFrame.GoldButton,
      contentOffsetY: 1,
      onClick: () => this.openSummonConfirm('paidTen'),
    });
    createButton(this, 248, 604, {
      width: 82,
      height: 36,
      label: '광고10회',
      iconFrame: AtlasFrame.Star,
      backgroundFrame: AtlasFrame.BlueButton,
      contentOffsetY: 1,
      onClick: () => this.openSummonConfirm('adTen'),
    });
    createButton(this, 324, 604, {
      width: 58,
      height: 36,
      label: t(this, 'ui.village', undefined, '마을'),
      iconFrame: AtlasFrame.HomeIcon,
      contentOffsetY: 1,
      onClick: () => this.scene.start('village'),
    });

    this.createSummonConfirmModal();
  }

  private createVisualCard(x: number, y: number, width: number, height: number): FeaturedCardVisual {
    const card = this.add.rectangle(x, y, width, height, 0x181d2c, 0.92).setStrokeStyle(1, 0xd7c27c, 0.24).setDepth(10);
    const backplate = this.add.image(x, y, SCREEN_RUNTIME_IMAGE_KEYS.gachaRarityBackplate3)
      .setDisplaySize(width + 30, height + 22)
      .setDepth(11)
      .setVisible(false);
    const portraitGlow = this.add.rectangle(x, y, width + 18, height + 8, 0x6f5298, 0.16).setDepth(12);
    const portrait = this.add.image(x, y, ATLAS_KEY, AtlasFrame.Hero).setDepth(13).setVisible(false);
    const iconBg = this.add.rectangle(x, y - 4, 24, 24, 0x2d2136, 0.94).setStrokeStyle(1, 0xf4e2af, 0.25).setDepth(13).setVisible(false);
    const icon = this.add.image(x, y - 4, ATLAS_KEY, AtlasFrame.Star).setDisplaySize(16, 16).setDepth(14).setVisible(false);
    const title = this.add.text(x, y + height / 2 - 16, '', {
      fontFamily: 'Segoe UI',
      fontSize: '9px',
      color: '#f7efd6',
      stroke: '#17110c',
      strokeThickness: 2,
      align: 'center',
      wordWrap: { width: width - 8 },
    }).setOrigin(0.5, 0).setDepth(15);
    const subtitle = this.add.text(x, y + height / 2 - 3, '', {
      fontFamily: 'Segoe UI',
      fontSize: '8px',
      color: '#d6cde1',
      stroke: '#17110c',
      strokeThickness: 2,
      align: 'center',
      wordWrap: { width: width - 8 },
    }).setOrigin(0.5, 0).setDepth(15);

    return { card, backplate, portraitGlow, portrait, iconBg, icon, title, subtitle };
  }

  private refreshView(statusLine: string): void {
    const banner = getGachaBanners()[this.bannerIndex];
    this.bannerTitleText.setText(t(this, banner.name));
    this.bannerTagText.setText(t(this, banner.tagLine));
    this.detailText.setText('');
    this.statusText.setText(
      statusLine
        ? t(this, statusLine)
        : `${t(this, 'ui.gems')} ${this.snapshot.profile.premiumCurrency} | ${t(this, 'ui.hero_stone')} ${this.snapshot.profile.heroStones} | 광고10회 ${canPerformAdTenSummon(this.snapshot) ? '가능' : '완료'}`,
    );
    this.refreshBannerTabs();
    this.refreshFeaturedCards();
    this.refreshRevealCards();
    this.refreshSummonConfirmModal();
  }

  private refreshBannerTabs(): void {
    const banners = getGachaBanners();
    this.bannerTabs.forEach((visual, index) => {
      const banner = banners[index];
      const selected = index === this.bannerIndex;
      visual.frame?.setAlpha(selected ? 1 : 0.84);
      visual.card
        .setFillStyle(selected ? 0x1a2430 : 0x131926, 0.96)
        .setStrokeStyle(1, selected ? 0xf1d38e : 0xe0c78b, selected ? 0.58 : 0.18);
      visual.title.setText(t(this, banner.name)).setColor(selected ? '#fff8e2' : '#f5ead0');
      visual.tag.setText(t(this, banner.tagLine)).setColor(selected ? '#ffe6b2' : '#d4c29f');
    });
  }

  private createSummonConfirmModal(): void {
    this.confirmOverlay = this.add.rectangle(180, 320, 360, 640, 0x02060a, 0.78)
      .setDepth(200)
      .setVisible(false);
    if (this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.gachaConfirmPanel)) {
      this.confirmFrame = this.add.image(180, 320, SCREEN_RUNTIME_IMAGE_KEYS.gachaConfirmPanel)
        .setDisplaySize(282, 252)
        .setDepth(201)
        .setVisible(false);
    } else {
      this.confirmFrame = this.add.rectangle(180, 320, 282, 252, 0x0f1822, 0.96)
        .setStrokeStyle(2, 0xe0c78b, 0.2)
        .setDepth(201)
        .setVisible(false);
    }
    this.confirmTitleText = this.add.text(180, 212, '', {
      fontFamily: 'Segoe UI',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 2,
      align: 'center',
      wordWrap: { width: 220 },
    }).setOrigin(0.5, 0).setDepth(202).setVisible(false);
    this.confirmBodyText = this.add.text(180, 248, '', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#efe1ba',
      stroke: '#17110c',
      strokeThickness: 2,
      align: 'center',
      wordWrap: { width: 226 },
      lineSpacing: 4,
    }).setOrigin(0.5, 0).setDepth(202).setVisible(false);
  }

  private openSummonConfirm(mode: SummonMode): void {
    if (this.isRevealing || this.isSummonAnimating) {
      this.refreshView('현재 결과 연출이 끝난 뒤에 다시 시도해 주세요.');
      return;
    }
    if (mode === 'adTen' && !canPerformAdTenSummon(this.snapshot)) {
      this.refreshView('오늘의 광고 10회 소환은 이미 사용했습니다.');
      return;
    }
    this.pendingSummonMode = mode;
    this.refreshSummonConfirmModal();
  }

  private closeSummonConfirm(): void {
    this.pendingSummonMode = null;
    this.refreshSummonConfirmModal();
  }

  private refreshSummonConfirmModal(): void {
    const visible = this.pendingSummonMode !== null;
    this.confirmOverlay.setVisible(visible);
    this.confirmFrame.setVisible(visible);
    this.confirmTitleText.setVisible(visible);
    this.confirmBodyText.setVisible(visible);

    if (this.confirmActionButton) {
      this.confirmActionButton.destroy();
      this.confirmActionButton = null;
    }
    if (this.confirmCloseButton) {
      this.confirmCloseButton.destroy();
      this.confirmCloseButton = null;
    }

    if (!visible || !this.pendingSummonMode) {
      return;
    }

    const banner = getGachaBanners()[this.bannerIndex];
    const isPaidTen = this.pendingSummonMode === 'paidTen';
    const isAdTen = this.pendingSummonMode === 'adTen';
    const cost = this.pendingSummonMode === 'single' ? 150 : this.pendingSummonMode === 'ten' ? 1500 : 0;
    this.confirmTitleText.setText(
      this.pendingSummonMode === 'single'
        ? '1회 소환 안내'
        : isAdTen
          ? '광고 10회 소환 안내'
          : isPaidTen
          ? '10회 유료뽑기 안내'
          : '10회 소환 안내',
    );
    this.confirmBodyText.setText([
      `${t(this, banner.name)} 배너에서 ${this.pendingSummonMode === 'single' ? '1회' : '10회'} 소환을 진행합니다.`,
      '',
      isAdTen
        ? '광고 시청 후 하루 1회 진행합니다. 5성은 나오지 않고, 4성 확률과 픽업 확률도 낮습니다.'
        : isPaidTen
          ? 'Google Play 결제 후 보석 차감 없이 10회 소환합니다.'
          : `필요 보석 ${cost}`,
      `현재 보유 ${this.snapshot.profile.premiumCurrency} 보석 / ${this.snapshot.profile.heroStones} 영웅석`,
      '',
      '확인을 누르면 결과 연출과 함께 소환이 시작됩니다.',
    ]);

    this.confirmActionButton = createButton(this, 126, 406, {
      width: 96,
      height: 30,
      label: this.pendingSummonMode === 'single' ? '1회 소환' : isAdTen ? '광고보기' : isPaidTen ? '유료10회' : '10회 소환',
      backgroundFrame: AtlasFrame.GoldButton,
      contentOffsetY: 1,
      onClick: () => void this.executePendingSummon(),
    }).setDepth(203);
    this.confirmCloseButton = createButton(this, 234, 406, {
      width: 96,
      height: 30,
      label: '닫기',
      contentOffsetY: 1,
      onClick: () => this.closeSummonConfirm(),
    }).setDepth(203);
  }

  private async executePendingSummon(): Promise<void> {
    const mode = this.pendingSummonMode;
    if (!mode || this.paidTenBusy || this.adTenBusy) {
      return;
    }
    this.pendingSummonMode = null;
    this.refreshSummonConfirmModal();

    if (mode === 'paidTen') {
      await this.runPaidTenSummon();
      return;
    }

    if (mode === 'adTen') {
      await this.runAdTenSummon();
      return;
    }

    this.runSummon(mode);
  }

  private refreshFeaturedCards(): void {
    const banner = getGachaBanners()[this.bannerIndex];
    this.featuredCards.forEach((visual, index) => {
      const entryId = banner.featuredIds[index];
      if (!entryId) {
        this.hideVisualCard(visual);
        return;
      }

      const character = safeGetCharacter(entryId);
      if (character) {
        visual.card.setVisible(true).setFillStyle(0x241b2a, 0.94).setStrokeStyle(2, getRarityBorderColor(character.rarity), 0.6);
        visual.backplate.setVisible(false);
        visual.portraitGlow.setVisible(true).setFillStyle(getRarityColor(character.rarity), 0.18);
        visual.portrait.setVisible(true);
        visual.iconBg.setVisible(false);
        visual.icon.setVisible(false);
        visual.title.setVisible(true).setText(t(this, character.name)).setColor('#fff5d4');
        visual.subtitle.setVisible(true).setText(`${character.rarity}성 픽업`).setColor('#f6ddb5');
        this.applyGachaCharacterPortrait(visual, character.id);
        return;
      }

      const weapon = safeGetWeapon(entryId);
      if (!weapon) {
        this.hideVisualCard(visual);
        return;
      }

      visual.card.setVisible(true).setFillStyle(0x241b2a, 0.94).setStrokeStyle(2, getRarityBorderColor(weapon.rarity), 0.6);
      visual.backplate.setVisible(false);
      visual.portraitGlow.setVisible(false);
      visual.portrait.setVisible(false);
      this.applyGachaWeaponIcon(visual, weapon.id);
      visual.title.setVisible(true).setText(t(this, weapon.name)).setColor('#fff5d4');
      visual.subtitle.setVisible(true).setText(`${weapon.rarity}성 무기 픽업`).setColor('#f6ddb5');
    });
  }

  private refreshRevealCards(): void {
    this.revealCards.forEach((visual, index) => {
      const entry = this.lastResults[index];
      if (!entry) {
        this.hideVisualCard(visual);
        return;
      }

      const revealed = index < this.revealCount;
      const titleY = visual.card.y + (revealed ? 24 : 20);
      visual.card.setVisible(true);
      visual.card.setFillStyle(revealed ? getRarityColor(entry.rarity) : 0x241b2a, revealed ? 0.96 : 0.9);
      visual.card.setStrokeStyle(2, getRarityBorderColor(entry.rarity), revealed ? 0.8 : 0.2);
      visual.backplate.setVisible(false);
      visual.portraitGlow.setVisible(revealed).setFillStyle(getRarityColor(entry.rarity), 0.16);
      visual.card.setScale(this.isRevealing && index === Math.max(0, this.revealCount - 1) ? 1.06 : 1);
      visual.title
        .setFontSize(revealed ? '7px' : '9px')
        .setWordWrapWidth(visual.card.width - 6)
        .setLineSpacing(0)
        .setPosition(visual.card.x, titleY);
      visual.subtitle
        .setFontSize('7px')
        .setWordWrapWidth(visual.card.width - 6)
        .setLineSpacing(0)
        .setVisible(false);

      if (!revealed) {
        visual.backplate.setVisible(false);
        visual.portrait.setVisible(false);
        visual.iconBg.setVisible(false);
        visual.icon.setVisible(false);
        visual.title.setVisible(true).setText('?').setColor('#f7efd6');
        visual.subtitle.setVisible(false);
        return;
      }

      visual.title.setVisible(true).setText(this.compactRevealName(t(this, entry.name))).setColor('#1f1410');
      visual.subtitle.setVisible(false);

      if (entry.kind === 'character') {
        visual.portrait.setVisible(true);
        visual.iconBg.setVisible(false);
        visual.icon.setVisible(false);
        this.applyGachaCharacterPortrait(visual, entry.id);
      } else {
        visual.backplate.setVisible(false);
        visual.portrait.setVisible(false);
        this.applyGachaWeaponIcon(visual, entry.id);
      }
    });
  }

  private refreshFeaturedPortraits(): void {
    const banner = getGachaBanners()[this.bannerIndex];
    this.featuredCards.forEach((visual, index) => {
      const entryId = banner.featuredIds[index];
      const character = entryId ? safeGetCharacter(entryId) : null;
      if (!character || !visual.portrait.visible) {
        return;
      }

      this.applyGachaCharacterPortrait(visual, character.id);
    });
  }

  private refreshRevealPortraits(): void {
    this.revealCards.forEach((visual, index) => {
      const entry = this.lastResults[index];
      if (!entry || entry.kind !== 'character' || !visual.portrait.visible) {
        return;
      }

      this.applyGachaCharacterPortrait(visual, entry.id);
    });
  }

  private hideVisualCard(visual: FeaturedCardVisual): void {
    visual.card.setVisible(false);
    visual.backplate.setVisible(false);
    visual.portraitGlow.setVisible(false);
    visual.portrait.setVisible(false);
    visual.iconBg.setVisible(false);
    visual.icon.setVisible(false);
    visual.title.setVisible(false);
    visual.subtitle.setVisible(false);
  }

  private applyGachaCharacterPortrait(visual: FeaturedCardVisual | RevealCardVisual, characterId: string): void {
    const isRevealCard = visual.card.width <= 56;
    const targetWidth = isRevealCard ? 36 : Math.max(42, Math.min(54, visual.card.width - 10));
    const targetHeight = isRevealCard ? 42 : Math.max(52, Math.min(62, visual.card.height - 22));
    visual.portrait.setPosition(visual.card.x, visual.card.y + (isRevealCard ? -10 : 0));
    applyCharacterFacePortrait(this, visual.portrait, characterId, targetWidth, targetHeight, this.animationElapsedMs, 1);
  }

  private applyGachaWeaponIcon(visual: FeaturedCardVisual | RevealCardVisual, weaponId: string): void {
    const weapon = safeGetWeapon(weaponId);
    const rarity = weapon?.rarity ?? 3;
    visual.iconBg
      .setVisible(true)
      .setPosition(visual.card.x, visual.card.y - 6)
      .setDisplaySize(48, 48)
      .setStrokeStyle(1, getRarityBorderColor(rarity), 0.64);

    if (weapon) {
      const gachaItemKey = getGachaItemImageKey(weapon.id);
      if (gachaItemKey && this.textures.exists(gachaItemKey)) {
        visual.icon
          .setVisible(true)
          .clearTint()
          .setTexture(gachaItemKey)
          .setPosition(visual.card.x, visual.card.y - 6)
          .setDisplaySize(44, 44);
        return;
      }

      const visualRef = createWeaponVisualRef(weapon.id, weapon.weaponClass, getWeaponIconFrame(weapon.id));
      const textureKey = getShopThumbnailTextureKey(visualRef);
      if (this.textures.exists(textureKey)) {
        visual.icon
          .setVisible(true)
          .clearTint()
          .setTexture(textureKey)
          .setPosition(visual.card.x, visual.card.y - 6)
          .setDisplaySize(44, 44);
        return;
      }
    }

    visual.icon
      .setVisible(true)
      .clearTint()
      .setTexture(ATLAS_KEY, getSummonEntryIconFrame({ kind: 'weapon', id: weaponId, name: weapon?.name ?? weaponId, rarity, isNew: false, copies: 1, convertedHeroStones: 0 }))
      .setPosition(visual.card.x, visual.card.y - 6)
      .setDisplaySize(20, 20);
  }

  private getGachaRarityBackplateKey(rarity: number): string {
    switch (rarity) {
      case 5:
        return SCREEN_RUNTIME_IMAGE_KEYS.gachaRarityBackplate5;
      case 4:
        return SCREEN_RUNTIME_IMAGE_KEYS.gachaRarityBackplate4;
      default:
        return SCREEN_RUNTIME_IMAGE_KEYS.gachaRarityBackplate3;
    }
  }

  private cycleBanner(direction: 1 | -1): void {
    if (this.isRevealing || this.isSummonAnimating) {
      this.refreshView('현재 결과 연출이 끝난 뒤에 배너를 바꿔 주세요.');
      return;
    }

    const banners = getGachaBanners();
    this.bannerIndex = (this.bannerIndex + direction + banners.length) % banners.length;
    this.refreshView('');
  }

  private async runPaidTenSummon(): Promise<void> {
    if (this.isRevealing || this.isSummonAnimating || this.paidTenBusy) {
      this.refreshView('현재 결과 연출이 끝난 뒤 다시 시도해 주세요.');
      return;
    }

    this.paidTenBusy = true;
    this.refreshView('10회 유료뽑기 결제를 준비하고 있습니다.');
    const outcome = await purchaseConfiguredProduct(PAID_TEN_SUMMON_PRODUCT_ID);
    this.paidTenBusy = false;

    if (!outcome.ok) {
      this.refreshView(outcome.message);
      return;
    }

    const banner = getGachaBanners()[this.bannerIndex];
    const result = performPaidTenSummon(this.snapshot, banner.id);
    this.snapshot = result.snapshot;
    this.lastResults = result.results;
    this.revealCount = 0;
    this.revealTimerMs = 0;
    this.isRevealing = false;
    saveSnapshot(this.snapshot);
    this.refreshView('유료 10회 소환 카드가 펼쳐지고 있습니다.');
    this.playSummonDrawAnimation('ten', () => {
      this.revealCount = 0;
      this.revealTimerMs = 0;
      this.isRevealing = true;
      this.refreshView(this.buildSummonResultSummary(banner.name, '유료 10회', 0));
    });
  }

  private async runAdTenSummon(): Promise<void> {
    if (this.isRevealing || this.isSummonAnimating || this.adTenBusy) {
      this.refreshView('현재 결과 연출이 끝난 뒤 다시 시도해 주세요.');
      return;
    }

    if (!canPerformAdTenSummon(this.snapshot)) {
      this.refreshView('오늘의 광고 10회 소환은 이미 사용했습니다.');
      return;
    }

    this.adTenBusy = true;
    this.refreshView('광고 10회 소환 광고를 준비하고 있습니다.');
    const rewarded = await showRewardedGachaAd();
    this.adTenBusy = false;

    if (!rewarded.granted) {
      this.refreshView('광고 시청이 완료되지 않아 소환을 진행하지 않았습니다.');
      return;
    }

    const banner = getGachaBanners()[this.bannerIndex];
    const result = performAdTenSummon(this.snapshot, banner.id, Date.now());

    if (!result.ok) {
      this.refreshView(result.reason === 'daily_ad_used' ? '오늘의 광고 10회 소환은 이미 사용했습니다.' : '광고 10회 소환을 진행할 수 없습니다.');
      return;
    }

    this.snapshot = result.snapshot;
    this.lastResults = result.results;
    this.revealCount = 0;
    this.revealTimerMs = 0;
    this.isRevealing = false;
    saveSnapshot(this.snapshot);
    this.refreshView('광고 10회 소환 카드가 펼쳐지고 있습니다.');
    this.playSummonDrawAnimation('ten', () => {
      this.revealCount = 0;
      this.revealTimerMs = 0;
      this.isRevealing = true;
      this.refreshView(this.buildSummonResultSummary(banner.name, '광고 10회', 0));
    });
  }

  private runSummon(mode: 'single' | 'ten'): void {
    if (this.isRevealing || this.isSummonAnimating) {
      this.refreshView('현재 결과 연출이 끝난 뒤에 다시 시도해 주세요.');
      return;
    }

    const banner = getGachaBanners()[this.bannerIndex];
    const result = performSummon(this.snapshot, mode, banner.id);

    if (!result.ok) {
      this.refreshView('보석이 부족해서 해당 소환을 진행할 수 없습니다.');
      return;
    }

    this.snapshot = result.snapshot;
    this.lastResults = result.results;
    this.revealCount = 0;
    this.revealTimerMs = 0;
    this.isRevealing = false;
    saveSnapshot(this.snapshot);
    this.refreshView('소환 카드가 회전하며 펼쳐지는 중입니다.');
    this.playSummonDrawAnimation(mode, () => {
      this.revealCount = 0;
      this.revealTimerMs = 0;
      this.isRevealing = true;
      this.refreshView(this.buildSummonResultSummary(banner.name, mode === 'single' ? '1회' : '10회', result.cost));
    });
  }

  private buildRevealSubtitle(entry: SummonResultEntry): string {
    if (entry.kind === 'weapon') {
      return entry.isNew
        ? `${entry.rarity}성 | NEW 무기`
        : `${entry.rarity}성 | 무기 사본 ${entry.copies}`;
    }

    if (entry.isNew) {
      return `${entry.rarity}성 | NEW 캐릭터`;
    }

    if (entry.convertedHeroStones > 0) {
      return `${entry.rarity}성 | 초월 최대 | +${entry.convertedHeroStones} ${t(this, 'ui.hero_stone')}`;
    }

    const beforeTranscendence = Math.max(0, entry.copies - 2);
    const afterTranscendence = Math.max(0, entry.copies - 1);
    return `${entry.rarity}성 | 중복 | 초월 ${beforeTranscendence}->${afterTranscendence} | 전투력 +80`;
  }

  private compactRevealName(name: string): string {
    return name.length > 5 ? `${name.slice(0, 5)}..` : name;
  }

  private buildSummonResultSummary(bannerName: string, drawLabel: string, cost: number): string {
    const newCharacters = this.lastResults.filter((entry) => entry.kind === 'character' && entry.isNew).length;
    const transcendence = this.lastResults.filter(
      (entry) => entry.kind === 'character' && !entry.isNew && entry.convertedHeroStones <= 0,
    ).length;
    const heroStones = this.lastResults.reduce((sum, entry) => sum + entry.convertedHeroStones, 0);
    const weaponCopies = this.lastResults.filter((entry) => entry.kind === 'weapon' && !entry.isNew).length;
    const costLine = cost > 0 ? ` | 사용 보석 ${cost}` : '';
    return `${t(this, bannerName)} ${drawLabel} 완료${costLine}\n결과 요약: 신규 ${newCharacters}명 / 초월 ${transcendence}회 / 영웅석 +${heroStones} / 무기 사본 +${weaponCopies}`;
  }

  private playSummonDrawAnimation(mode: 'single' | 'ten', onComplete: () => void): void {
    const drawCount = mode === 'single' ? 1 : 10;
    this.isSummonAnimating = true;
    this.summonAnimationLayer?.destroy(true);

    const veil = this.add.rectangle(180, 320, 360, 640, 0x03060c, 0.72);
    const title = this.add.text(180, 166, '소환 중', {
      fontFamily: 'Segoe UI',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#120d0a',
      strokeThickness: 4,
    }).setOrigin(0.5);
    const subtitle = this.add.text(180, 196, '카드가 한 장씩 열립니다.', {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      color: '#ead7a6',
      stroke: '#120d0a',
      strokeThickness: 3,
    }).setOrigin(0.5);
    this.summonAnimationLayer = this.add.container(0, 0, [veil, title, subtitle]).setDepth(240);

    for (let index = 0; index < drawCount; index += 1) {
      const column = index % 5;
      const row = Math.floor(index / 5);
      const targetX = drawCount === 1 ? 180 : 92 + column * 44;
      const targetY = drawCount === 1 ? 338 : 302 + row * 88;
      const delay = index * 95;
      const card = this.add.container(430, 204 + (index % 3) * 26);
      const glow = this.add.rectangle(0, 0, 74, 104, 0xf0c76d, 0.12);
      const hasCardBackImage = this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.summonCardBack);
      const back = hasCardBackImage
        ? this.add.image(0, 0, SCREEN_RUNTIME_IMAGE_KEYS.summonCardBack).setDisplaySize(60, 88)
        : this.add.rectangle(0, 0, 60, 88, 0x141b2a, 0.98).setStrokeStyle(2, 0xf1d38e, 0.74);
      const shine = this.add.rectangle(0, -18, 48, 8, 0xfff4c8, 0.2);
      const star = this.add.image(0, -4, ATLAS_KEY, AtlasFrame.Star).setDisplaySize(22, 22).setTint(0xffe29c);
      card.add(hasCardBackImage ? [glow, back, shine] : [glow, back, shine, star]);
      card.setScale(0.62).setAngle(92);
      this.summonAnimationLayer.add(card);

      this.tweens.add({
        targets: card,
        x: 180,
        y: 318,
        angle: 360,
        scaleX: 1.1,
        scaleY: 1.1,
        alpha: 1,
        duration: 360,
        delay,
        ease: 'Cubic.easeOut',
      });
      this.tweens.add({
        targets: card,
        x: targetX,
        y: targetY,
        angle: 720 + index * 8,
        scaleX: drawCount === 1 ? 1.22 : 0.78,
        scaleY: drawCount === 1 ? 1.22 : 0.78,
        duration: 320,
        delay: delay + 350,
        ease: 'Back.easeOut',
      });
      this.tweens.add({
        targets: glow,
        alpha: { from: 0.1, to: 0.42 },
        yoyo: true,
        repeat: 1,
        duration: 130,
        delay: delay + 260,
      });
    }

    const finishDelay = drawCount * 95 + 840;
    this.time.delayedCall(finishDelay, () => {
      if (!this.summonAnimationLayer) {
        this.isSummonAnimating = false;
        onComplete();
        return;
      }

      this.tweens.add({
        targets: this.summonAnimationLayer,
        alpha: 0,
        duration: 220,
        onComplete: () => {
          this.summonAnimationLayer?.destroy(true);
          this.summonAnimationLayer = null;
          this.isSummonAnimating = false;
          onComplete();
        },
      });
    });
  }
}

function safeGetCharacter(id: string) {
  try {
    return getCharacter(id);
  } catch {
    return null;
  }
}

function safeGetWeapon(id: string) {
  try {
    return getWeaponDefinition(id);
  } catch {
    return null;
  }
}
