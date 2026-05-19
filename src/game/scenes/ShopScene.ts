import Phaser from 'phaser';
import {
  getShopOfferEquipmentPowerChange,
  purchaseShopOffer,
  sellShopInventoryEntry,
  type ShopOfferEquipmentPowerChange,
} from '../core/shop';
import {
  formatEquipmentStats,
  getAvailableArmorCopies,
  getAvailableWeaponCopies,
} from '../core/equipment';
import { ATLAS_KEY, AtlasFrame } from '../data/atlas';
import { getArmorDefinition, getWeaponDefinition } from '../data/equipment';
import { getShopOffersForShop, type ShopOfferDefinition } from '../data/shop';
import {
  createArmorVisualRef,
  createWeaponVisualRef,
  getShopDetailTextureKey,
  getShopThumbnailTextureKey,
  type ShopVisualRef,
} from '../data/shopArt';
import {
  getShopPurchaseBackgroundKey,
  SHOP_RUNTIME_IMAGE_KEYS,
} from '../data/shopRuntimeArt';
import { getTownInterior, type TownShopId } from '../data/town';
import { t, translateCurrency } from '../services/i18n';
import { loadSnapshot, saveSnapshot } from '../services/save';
import type { ArmorClass, SaveSnapshot, WeaponClass } from '../types';
import { buildDebugState } from '../ui/debugHud';
import { getArmorIconFrame, getWeaponIconFrame } from '../ui/collectionArt';
import { createButton, paintBackdrop } from '../ui/widgets';
import {
  applyPurchasedProduct,
  listStoreProducts,
  purchaseConfiguredProduct,
} from '../../platform/store';

interface ShopSceneData {
  shopId?: TownShopId;
  returnScene?: 'village' | 'town-interior';
  returnSpawnId?: string;
}

interface OfferRowView {
  frame: Phaser.GameObjects.Image;
  card: Phaser.GameObjects.Rectangle;
  tapZone: Phaser.GameObjects.Rectangle;
  accent: Phaser.GameObjects.Rectangle;
  thumbBack: Phaser.GameObjects.Rectangle;
  thumb: Phaser.GameObjects.Image;
  nameText: Phaser.GameObjects.Text;
  metaText: Phaser.GameObjects.Text;
  priceIcon: Phaser.GameObjects.Image;
  priceText: Phaser.GameObjects.Text;
}

interface ShopBagEntry {
  id: string;
  kind: 'weapon' | 'armor';
  itemId: string;
  name: string;
  meta: string;
  summary: string;
  description: string;
  quantity: number;
  quantityLabel: string;
  iconFrame: number;
  visual: ShopVisualRef;
  sellable: boolean;
  sellPrice: number;
}

interface BagSlotView {
  frame: Phaser.GameObjects.Image;
  card: Phaser.GameObjects.Rectangle;
  accent: Phaser.GameObjects.Rectangle;
  thumbBack: Phaser.GameObjects.Rectangle;
  thumb: Phaser.GameObjects.Image;
  quantityBack: Phaser.GameObjects.Rectangle;
  quantityText: Phaser.GameObjects.Text;
}

type ActionDetailId = 'starter_pack' | 'fatigue_pack';

type ShopListEntry =
  | { kind: 'offer'; offer: ShopOfferDefinition }
  | { kind: 'action'; id: ActionDetailId };

type DetailTarget =
  | { kind: 'offer'; id: string }
  | { kind: 'bag'; id: string }
  | { kind: 'action'; id: ActionDetailId }
  | null;

type ScrollRegion = 'offer' | 'bag' | null;

const OFFER_VISIBLE_ROWS = 5;
const BAG_GRID_COLUMNS = 4;
const BAG_GRID_ROWS = 2;
const BAG_VISIBLE_SLOTS = BAG_GRID_COLUMNS * BAG_GRID_ROWS;
const OFFER_BOUNDS = new Phaser.Geom.Rectangle(24, 140, 304, 196);
const BAG_BOUNDS = new Phaser.Geom.Rectangle(24, 390, 296, 140);
const DETAIL_BOUNDS = new Phaser.Geom.Rectangle(30, 136, 300, 368);

export class ShopScene extends Phaser.Scene {
  private sceneData: ShopSceneData = {};
  private snapshot!: SaveSnapshot;
  private visibleOffers: ShopOfferDefinition[] = [];
  private offerRows: OfferRowView[] = [];
  private bagSlots: BagSlotView[] = [];
  private bagEntries: ShopBagEntry[] = [];
  private selectedOfferId: string | null = null;
  private selectedBagEntryId: string | null = null;
  private detailTarget: DetailTarget = null;
  private offerScrollIndex = 0;
  private bagScrollRow = 0;
  private starterPackPrice = 'KRW 1,500';
  private fatiguePackPrice = 'KRW 1,200';
  private contextTitle = '마을 상점';
  private contextSubtitle = '공용 재고';
  private statusMessage = '상품을 둘러보세요.';
  private headerIconImage: Phaser.GameObjects.Image | null = null;
  private headerResourceIcons: Phaser.GameObjects.Image[] = [];
  private headerResourceValueTexts: Phaser.GameObjects.Text[] = [];
  private headerTitleText!: Phaser.GameObjects.Text;
  private headerContextText!: Phaser.GameObjects.Text;
  private headerResourceText!: Phaser.GameObjects.Text;
  private headerStatusText!: Phaser.GameObjects.Text;
  private offerEmptyText!: Phaser.GameObjects.Text;
  private bagEmptyText!: Phaser.GameObjects.Text;
  private bagHintText!: Phaser.GameObjects.Text;
  private cashHintText!: Phaser.GameObjects.Text;
  private offerScrollTrack!: Phaser.GameObjects.Rectangle;
  private offerScrollThumb!: Phaser.GameObjects.Rectangle;
  private bagScrollTrack!: Phaser.GameObjects.Rectangle;
  private bagScrollThumb!: Phaser.GameObjects.Rectangle;
  private detailOverlay!: Phaser.GameObjects.Rectangle;
  private detailFrame!: Phaser.GameObjects.Rectangle;
  private detailOuterFrameArt!: Phaser.GameObjects.Image;
  private detailTextPanelArt!: Phaser.GameObjects.Image;
  private detailPreviewBack!: Phaser.GameObjects.Rectangle;
  private detailPreviewStageArt!: Phaser.GameObjects.Image;
  private detailPreviewAccent!: Phaser.GameObjects.Rectangle;
  private detailPreviewImage!: Phaser.GameObjects.Image;
  private detailTitleText!: Phaser.GameObjects.Text;
  private detailMetaText!: Phaser.GameObjects.Text;
  private detailDescriptionText!: Phaser.GameObjects.Text;
  private detailStatusText!: Phaser.GameObjects.Text;
  private detailActionButton: Phaser.GameObjects.Container | null = null;
  private detailCloseButton: Phaser.GameObjects.Container | null = null;
  private activeScrollRegion: ScrollRegion = null;
  private dragStartY = 0;
  private dragStartScroll = 0;
  private consumeNextTap = false;
  private sceneLive = false;

  constructor() {
    super('shop');
  }

  init(data: ShopSceneData = {}): void {
    this.resetRuntimeCollections();
    this.sceneData = data;
    this.visibleOffers = getShopOffersForShop(data.shopId);
    this.selectedOfferId = this.visibleOffers[0]?.id ?? null;
    this.selectedBagEntryId = null;
    this.offerScrollIndex = 0;
    this.bagScrollRow = 0;
    this.detailTarget = null;

    if (data.shopId) {
      const interior = getTownInterior(data.shopId);
      this.contextTitle = this.getShopTitleLabel(data.shopId);
      this.contextSubtitle = `${t(null, interior.npcName, undefined, interior.npcName)}의 진열대`;
      return;
    }

    this.contextTitle = '마을 상점';
    this.contextSubtitle = '공용 재고';
  }

  create(): void {
    this.sceneLive = true;
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.sceneLive = false;
      this.unbindScrollInput();
      this.resetRuntimeCollections();
    });
    this.events.once(Phaser.Scenes.Events.DESTROY, () => {
      this.sceneLive = false;
      this.unbindScrollInput();
      this.resetRuntimeCollections();
    });

    this.snapshot = loadSnapshot();
    this.visibleOffers = getShopOffersForShop(this.sceneData.shopId, this.snapshot);
    this.selectedOfferId = this.visibleOffers[0]?.id ?? null;
    this.offerScrollIndex = 0;
    this.bagEntries = this.buildBagEntries();
    this.selectedBagEntryId = this.bagEntries[0]?.id ?? null;

    this.drawLayout();
    this.bindScrollInput();
    this.refreshView();
    void this.ensureVisualTexturesLoaded();
    void this.loadStoreLabels();
  }

  update(_: number, delta: number): void {
    this.stepSimulation(delta);
  }

  public stepSimulation(_: number): void {
  }

  public renderGameToText(): string {
    return JSON.stringify(
      buildDebugState('shop', this.snapshot, {
        shopId: this.sceneData.shopId ?? null,
        offerCount: this.visibleOffers.length,
        offerScrollIndex: this.offerScrollIndex,
        selectedOfferId: this.selectedOfferId,
        selectedOfferPowerChange: this.getSelectedOfferPowerChange(),
        bagEntryCount: this.bagEntries.length,
        bagScrollRow: this.bagScrollRow,
        selectedBagEntryId: this.selectedBagEntryId,
        detailTarget: this.detailTarget,
        availableActions: ['scroll_offer_list', 'open_offer_detail', 'open_bag_detail', 'sell_item', 'back'],
      }),
    );
  }

  private drawLayout(): void {
    const accentColor = getShopAccentColor(this.sceneData.shopId);
    const purchaseBackgroundKey = getShopPurchaseBackgroundKey(this.sceneData.shopId);
    const hasPurchaseBackground = Boolean(purchaseBackgroundKey && this.textures.exists(purchaseBackgroundKey));
    const hasMainFrameArt = this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.uiMainFrame);
    const hasHeaderBarArt = this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.uiHeaderBar);
    const hasSectionBarArt = this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.uiSectionBar);

    paintBackdrop(this, AtlasFrame.StoneTile, 0x31373b);
    if (purchaseBackgroundKey && this.textures.exists(purchaseBackgroundKey)) {
      const backdrop = this.add.image(180, 320, purchaseBackgroundKey).setDepth(-10);
      coverImageToBox(backdrop, 360, 640);
    }
    this.add.rectangle(180, 320, 360, 640, 0x05080d, hasPurchaseBackground ? 0.52 : 0.78).setDepth(-9);
    this.add.rectangle(180, 320, 360, 640, accentColor, hasPurchaseBackground ? 0.08 : 0.05).setDepth(-8);
    if (hasMainFrameArt) {
      this.add.image(180, 320, SHOP_RUNTIME_IMAGE_KEYS.uiMainFrame)
        .setDisplaySize(322, 606)
        .setDepth(-6);
    } else {
      this.add.rectangle(180, 320, 332, 608, 0x09111a, 0.92).setStrokeStyle(2, 0xe3c98c, 0.16).setDepth(-7);
    }
    if (hasHeaderBarArt) {
      this.add.image(180, 72, SHOP_RUNTIME_IMAGE_KEYS.uiHeaderBar)
        .setDisplaySize(316, 46)
        .setDepth(-5);
    } else {
      this.add.rectangle(180, 74, 316, 84, 0x0f1822, 0.96).setStrokeStyle(1, 0xe3c98c, 0.18).setDepth(-6);
    }
    this.add.rectangle(180, 240, 316, 224, 0x0d1620, hasPurchaseBackground ? 0.82 : 0.96).setStrokeStyle(1, 0xe3c98c, 0.14).setDepth(-6);
    this.add.rectangle(180, 486, 316, 244, 0x0d1620, hasPurchaseBackground ? 0.82 : 0.96).setStrokeStyle(1, 0xe3c98c, 0.14).setDepth(-6);
    this.add.rectangle(180, 122, 300, 2, accentColor, 0.28).setDepth(-5);
    this.add.rectangle(180, 352, 300, 2, accentColor, 0.22).setDepth(-5);

    this.add.rectangle(180, 87, 292, 34, 0x05080d, 0.68)
      .setStrokeStyle(1, 0xe3c98c, 0.12)
      .setDepth(-4);

    const titleX = 44;
    this.headerTitleText = this.add.text(titleX, 34, this.contextTitle, {
      fontFamily: 'Segoe UI',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 3,
    });
    this.headerContextText = this.add.text(titleX, 58, this.contextSubtitle, {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#d8c298',
      stroke: '#17110c',
      strokeThickness: 2,
    });
    const resourceIconFrames = [
      AtlasFrame.Star,
      AtlasFrame.StageNode,
      AtlasFrame.BossNode,
      AtlasFrame.BagIcon,
    ];
    const resourceIconKeys = [
      SHOP_RUNTIME_IMAGE_KEYS.currencyGold,
      SHOP_RUNTIME_IMAGE_KEYS.currencyGem,
      SHOP_RUNTIME_IMAGE_KEYS.currencyHeroStone,
      SHOP_RUNTIME_IMAGE_KEYS.currencyFatigue,
    ];
    const resourceIconTints = [0xf1c85a, 0x7fc8ff, 0xd0a1ff, 0x72d3a3];
    const resourcePositions = [
      { x: titleX, y: 78 },
      { x: titleX + 110, y: 78 },
      { x: titleX, y: 94 },
      { x: titleX + 110, y: 94 },
    ];
    this.headerResourceIcons = resourcePositions.map((position, index) => {
      const runtimeKey = resourceIconKeys[index];
      if (this.textures.exists(runtimeKey)) {
        return this.add.image(position.x, position.y, runtimeKey)
          .setDisplaySize(14, 14);
      }

      return this.add.image(position.x, position.y, ATLAS_KEY, resourceIconFrames[index])
        .setDisplaySize(11, 11)
        .setTint(resourceIconTints[index]);
    });
    this.headerResourceValueTexts = resourcePositions.map((position) =>
      this.add.text(position.x + 13, position.y - 6, '', {
        fontFamily: 'Segoe UI',
        fontSize: '9px',
        color: '#efe1ba',
        stroke: '#17110c',
        strokeThickness: 2,
      }),
    );
    this.headerResourceText = this.add.text(titleX, 74, '', {
      fontFamily: 'Segoe UI',
      fontSize: '9px',
      color: '#efe1ba',
      stroke: '#17110c',
      strokeThickness: 2,
    }).setVisible(false);
    this.headerStatusText = this.add.text(titleX, 90, '', {
      fontFamily: 'Segoe UI',
      fontSize: '9px',
      color: '#efe1ba',
      stroke: '#17110c',
      strokeThickness: 2,
    }).setVisible(false);

    if (hasSectionBarArt) {
      this.add.image(176, 134, SHOP_RUNTIME_IMAGE_KEYS.uiSectionBar)
        .setDisplaySize(292, 24)
        .setAlpha(0.94)
        .setDepth(-5);
      this.add.image(176, 368, SHOP_RUNTIME_IMAGE_KEYS.uiSectionBar)
        .setDisplaySize(292, 24)
        .setAlpha(0.94)
        .setDepth(-5);
    }

    this.add.text(28, hasSectionBarArt ? 126 : 132, '상점 목록', {
      fontFamily: 'Segoe UI',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 3,
    });
    this.add.text(28, hasSectionBarArt ? 360 : 366, '내 가방', {
      fontFamily: 'Segoe UI',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 3,
    });

    for (let index = 0; index < OFFER_VISIBLE_ROWS; index += 1) {
      const y = 164 + index * 36;
      const frame = this.add.image(180, y, SHOP_RUNTIME_IMAGE_KEYS.uiOfferRowNormal)
        .setDisplaySize(292, 32);
      const card = this.add
        .rectangle(180, y, 290, 32, 0x101b27, 0)
        .setStrokeStyle(1, 0xe3c98c, 0.12)
        .setInteractive({ useHandCursor: true });
      const tapZone = this.add
        .rectangle(180, y, 288, 32, 0xffffff, 0)
        .setInteractive({ useHandCursor: true });
      const accent = this.add.rectangle(42, y, 4, 22, accentColor, 0);
      const thumbBack = this.add
        .rectangle(58, y, 26, 26, 0x182534, 0)
        .setStrokeStyle(1, 0xe3c98c, 0.18)
        .setInteractive({ useHandCursor: true });
      const thumb = this.add
        .image(58, y, ATLAS_KEY, AtlasFrame.BagIcon)
        .setDisplaySize(20, 20)
        .setInteractive({ useHandCursor: true });
      const nameText = this.add.text(78, y - 13, '', {
        fontFamily: 'Segoe UI',
        fontSize: '11px',
        fontStyle: 'bold',
        color: '#fff1cd',
        stroke: '#17110c',
        strokeThickness: 2,
      });
      const metaText = this.add.text(78, y + 1, '', {
        fontFamily: 'Segoe UI',
        fontSize: '9px',
        color: '#d8c298',
        stroke: '#17110c',
        strokeThickness: 2,
      });
      const priceIcon = this.add.image(252, y, SHOP_RUNTIME_IMAGE_KEYS.currencyGold)
        .setDisplaySize(12, 12)
        .setVisible(false);
      const priceText = this.add.text(306, y, '', {
        fontFamily: 'Segoe UI',
        fontSize: '9px',
        color: '#ffd98b',
        stroke: '#17110c',
        strokeThickness: 2,
      }).setOrigin(1, 0.5);
      card.on('pointerup', () => this.openVisibleOfferAt(index));
      tapZone.on('pointerup', () => this.openVisibleOfferAt(index));
      thumbBack.on('pointerup', () => this.openVisibleOfferAt(index));
      thumb.on('pointerup', () => this.openVisibleOfferAt(index));
      this.offerRows.push({ frame, card, tapZone, accent, thumbBack, thumb, nameText, metaText, priceIcon, priceText });
    }

    this.offerEmptyText = this.add.text(180, 244, '표시할 상품이 없습니다.', {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#c8b189',
      stroke: '#17110c',
      strokeThickness: 2,
    }).setOrigin(0.5).setVisible(false);

    this.offerScrollTrack = this.add.rectangle(322, 236, 6, 180, 0x16202b, 0.92).setStrokeStyle(1, 0xe3c98c, 0.12);
    this.offerScrollThumb = this.add.rectangle(322, 236, 8, 48, accentColor, 0.76).setStrokeStyle(1, 0xf1d38e, 0.25);

    const slotStartX = 60;
    const slotStartY = 404;
    const slotStepX = 66;
    const slotStepY = 64;

    for (let index = 0; index < BAG_VISIBLE_SLOTS; index += 1) {
      const col = index % BAG_GRID_COLUMNS;
      const row = Math.floor(index / BAG_GRID_COLUMNS);
      const x = slotStartX + col * slotStepX;
      const y = slotStartY + row * slotStepY;
      const frame = this.add.image(x, y, SHOP_RUNTIME_IMAGE_KEYS.uiBagSlotNormal).setDisplaySize(56, 56);
      const card = this.add
        .rectangle(x, y, 56, 56, 0x101b27, 0)
        .setStrokeStyle(1, 0xe3c98c, 0.12)
        .setInteractive({ useHandCursor: true });
      const accent = this.add.rectangle(x, y - 22, 48, 4, accentColor, 0);
      const thumbBack = this.add.rectangle(x, y - 2, 40, 32, 0x182534, 0).setStrokeStyle(1, 0xe3c98c, 0.12);
      const thumb = this.add.image(x, y - 2, ATLAS_KEY, AtlasFrame.BagIcon).setDisplaySize(28, 28);
      const quantityBack = this.add.rectangle(x + 13, y + 18, 20, 12, 0x0a1016, 0.86).setStrokeStyle(1, 0xe3c98c, 0.1);
      const quantityText = this.add.text(x + 13, y + 18, '', {
        fontFamily: 'Segoe UI',
        fontSize: '8px',
        color: '#e8d2a6',
        stroke: '#17110c',
        strokeThickness: 2,
      }).setOrigin(0.5);
      card.on('pointerup', () => this.openVisibleBagEntryAt(index));
      this.bagSlots.push({ frame, card, accent, thumbBack, thumb, quantityBack, quantityText });
    }

    this.bagEmptyText = this.add.text(172, 438, '가방에 표시할 아이템이 없습니다.', {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#c8b189',
      stroke: '#17110c',
      strokeThickness: 2,
    }).setOrigin(0.5).setVisible(false);

    this.bagScrollTrack = this.add.rectangle(322, 444, 6, 124, 0x16202b, 0.92).setStrokeStyle(1, 0xe3c98c, 0.12);
    this.bagScrollThumb = this.add.rectangle(322, 444, 8, 44, accentColor, 0.76).setStrokeStyle(1, 0xf1d38e, 0.25);

    this.bagHintText = this.add.text(28, 516, '', {
      fontFamily: 'Segoe UI',
      fontSize: '9px',
      color: '#d7c39d',
      stroke: '#17110c',
      strokeThickness: 2,
    });
    this.cashHintText = this.add.text(28, 530, '', {
      fontFamily: 'Segoe UI',
      fontSize: '8px',
      color: '#c4ae83',
      stroke: '#17110c',
      strokeThickness: 2,
    }).setVisible(false);

    createButton(this, 260, 556, {
      width: 120,
      height: 28,
      label: '나가기',
      iconFrame: AtlasFrame.MapIcon,
      onClick: () => this.goBack(),
    });

    this.createDetailModal();
  }

  private createDetailModal(): void {
    this.detailOverlay = this.add.rectangle(180, 320, 360, 640, 0x02060a, 0.6)
      .setDepth(100)
      .setVisible(false);
    this.detailOverlay.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (!DETAIL_BOUNDS.contains(pointer.x, pointer.y)) {
        this.closeDetail();
      }
    });

    this.detailFrame = this.add.rectangle(180, 320, 300, 368, 0x0c1520, 0)
      .setDepth(101)
      .setVisible(false);
    this.detailOuterFrameArt = this.add.image(180, 320, SHOP_RUNTIME_IMAGE_KEYS.uiDetailOuterFrame)
      .setDisplaySize(300, 368)
      .setDepth(101)
      .setVisible(false);
    this.detailPreviewBack = this.add.rectangle(180, 246, 92, 92, 0x12151a, 0.94)
      .setStrokeStyle(1, 0xf1d38e, 0.16)
      .setDepth(102)
      .setVisible(false);
    this.detailPreviewStageArt = this.add.image(180, 246, SHOP_RUNTIME_IMAGE_KEYS.uiDetailStage)
      .setDisplaySize(100, 100)
      .setDepth(102)
      .setVisible(false);
    this.detailPreviewAccent = this.add.rectangle(180, 206, 76, 6, 0xffffff, 0.34)
      .setDepth(103)
      .setVisible(false);
    this.detailPreviewImage = this.add.image(180, 248, ATLAS_KEY, AtlasFrame.BagIcon)
      .setDisplaySize(78, 78)
      .setDepth(103)
      .setVisible(false);
    this.detailTextPanelArt = this.add.image(180, 364, SHOP_RUNTIME_IMAGE_KEYS.uiDetailTextPanel)
      .setDisplaySize(252, 202)
      .setDepth(101)
      .setVisible(false);
    this.detailTitleText = this.add.text(180, 142, '', {
      fontFamily: 'Segoe UI',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 2,
      align: 'center',
    }).setOrigin(0.5, 0);
    this.detailMetaText = this.add.text(180, 172, '', {
      fontFamily: 'Segoe UI',
      fontSize: '13px',
      color: '#d5c098',
      stroke: '#17110c',
      strokeThickness: 1,
      align: 'center',
    }).setOrigin(0.5, 0);
    this.detailDescriptionText = this.add.text(66, 300, '', {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#efe1ba',
      stroke: '#17110c',
      strokeThickness: 1,
      lineSpacing: 2,
      wordWrap: { width: 228 },
    }).setDepth(102).setVisible(false);
    this.detailStatusText = this.add.text(180, 438, '', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#d8c298',
      stroke: '#17110c',
      strokeThickness: 1,
      align: 'center',
      wordWrap: { width: 220 },
      lineSpacing: 3,
    }).setOrigin(0.5, 0).setDepth(102).setVisible(false);

    this.detailTitleText.setDepth(102).setVisible(false);
    this.detailMetaText.setDepth(102).setVisible(false);
  }

  private bindScrollInput(): void {
    this.unbindScrollInput();

    this.input.on('wheel', (pointer: Phaser.Input.Pointer, _targets: unknown[], _deltaX: number, deltaY: number) => {
      if (this.detailTarget) {
        return;
      }

      if (OFFER_BOUNDS.contains(pointer.x, pointer.y)) {
        this.scrollOffers(deltaY > 0 ? 1 : -1);
        return;
      }

      if (BAG_BOUNDS.contains(pointer.x, pointer.y)) {
        this.scrollBag(deltaY > 0 ? 1 : -1);
      }
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.consumeNextTap = false;

      if (this.detailTarget) {
        return;
      }

      if (OFFER_BOUNDS.contains(pointer.x, pointer.y)) {
        this.activeScrollRegion = 'offer';
        this.dragStartY = pointer.y;
        this.dragStartScroll = this.offerScrollIndex;
        return;
      }

      if (BAG_BOUNDS.contains(pointer.x, pointer.y)) {
        this.activeScrollRegion = 'bag';
        this.dragStartY = pointer.y;
        this.dragStartScroll = this.bagScrollRow;
      }
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown || !this.activeScrollRegion) {
        return;
      }

      const deltaY = pointer.y - this.dragStartY;

      if (this.activeScrollRegion === 'offer') {
        const nextIndex = Phaser.Math.Clamp(
          this.dragStartScroll - Math.round(deltaY / 28),
          0,
          this.getMaxOfferScroll(),
        );
        if (nextIndex !== this.offerScrollIndex) {
          this.offerScrollIndex = nextIndex;
          this.consumeNextTap = true;
          this.refreshOfferList();
        }
        return;
      }

      const nextRow = Phaser.Math.Clamp(
        this.dragStartScroll - Math.round(deltaY / 34),
        0,
        this.getMaxBagScrollRow(),
      );
      if (nextRow !== this.bagScrollRow) {
        this.bagScrollRow = nextRow;
        this.consumeNextTap = true;
        this.refreshBagGrid();
      }
    });

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (!this.detailTarget && !this.consumeNextTap && this.activeScrollRegion === 'offer' && OFFER_BOUNDS.contains(pointer.x, pointer.y) && pointer.x < 316) {
        const slotIndex = Math.floor((pointer.y - 148) / 36);
        if (slotIndex >= 0 && slotIndex < OFFER_VISIBLE_ROWS) {
          this.openVisibleOfferAt(slotIndex);
        }
      }
      this.activeScrollRegion = null;
    });
  }

  private unbindScrollInput(): void {
    this.input.off('wheel');
    this.input.off('pointerdown');
    this.input.off('pointermove');
    this.input.off('pointerup');
  }

  private resetRuntimeCollections(): void {
    this.offerRows = [];
    this.bagSlots = [];
    this.headerIconImage = null;
    this.headerResourceIcons = [];
    this.headerResourceValueTexts = [];
    this.detailActionButton = null;
    this.detailCloseButton = null;
    this.activeScrollRegion = null;
    this.consumeNextTap = false;
  }

  private refreshView(): void {
    this.normalizeSelectionState();
    this.refreshHeader();
    this.refreshOfferList();
    this.refreshBagGrid();
    this.refreshDetailModal();
  }

  private refreshHeader(): void {
    this.headerContextText.setText(this.contextSubtitle);
    const values = [
      `${this.snapshot.profile.gold}`,
      `${this.snapshot.profile.premiumCurrency}`,
      `${this.snapshot.profile.heroStones}`,
      `${this.snapshot.profile.fatigue}/${this.snapshot.profile.maxFatigue}`,
    ];
    this.headerResourceValueTexts.forEach((text, index) => {
      this.fitSingleLineText(text, values[index] ?? '', index % 2 === 0 ? 88 : 96);
    });
  }

  private getActionListPresentation(actionId: ActionDetailId): {
    name: string;
    meta: string;
    price: string;
    accentColor: number;
    iconFrame: number;
  } {
    if (actionId === 'starter_pack') {
      return {
        name: '스타터 팩',
        meta: '현금 상품 | 계정 1회',
        price: `현금 ${this.starterPackPrice}`,
        accentColor: 0xd7aa58,
        iconFrame: AtlasFrame.Star,
      };
    }

    return {
      name: '피로도 팩',
      meta: '현금 상품 | 피로도 충전',
      price: `현금 ${this.fatiguePackPrice}`,
      accentColor: 0x6f9dbb,
      iconFrame: AtlasFrame.BagIcon,
    };
  }

  private refreshOfferList(): void {
    const entries = this.getVisibleShopListEntries();
    const totalEntries = this.getShopListEntries().length;
    const hasEntries = entries.length > 0;
    this.offerEmptyText.setVisible(!hasEntries);

    this.offerRows.forEach((row, index) => {
      const entry = entries[index];
      const visible = Boolean(entry);
      row.frame.setVisible(visible);
      row.card.setVisible(visible);
      row.tapZone.setVisible(visible);
      row.accent.setVisible(visible);
      row.thumbBack.setVisible(visible);
      row.thumb.setVisible(visible);
      row.nameText.setVisible(visible);
      row.metaText.setVisible(visible);
      row.priceIcon.setVisible(false);
      row.priceText.setVisible(visible);

      if (!entry) {
        row.nameText.setText('');
        row.metaText.setText('');
        row.priceIcon.setVisible(false);
        row.priceText.setText('');
        return;
      }

      const isSelected = entry.kind === 'offer'
        ? entry.offer.id === this.selectedOfferId
        : this.detailTarget?.kind === 'action' && this.detailTarget.id === entry.id;
      const accentColor = entry.kind === 'offer'
        ? entry.offer.visual.accentColor
        : this.getActionListPresentation(entry.id).accentColor;

      if (this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.uiOfferRowNormal)) {
        row.frame.setTexture(isSelected ? SHOP_RUNTIME_IMAGE_KEYS.uiOfferRowSelected : SHOP_RUNTIME_IMAGE_KEYS.uiOfferRowNormal);
        row.accent.setVisible(false);
        row.thumbBack.setVisible(false);
      } else {
        row.card.setStrokeStyle(isSelected ? 2 : 1, isSelected ? 0xf1d38e : 0xe3c98c, isSelected ? 0.48 : 0.12);
        row.accent.setVisible(true);
        row.thumbBack.setVisible(true);
        row.accent.setFillStyle(accentColor, isSelected ? 0.76 : 0.36);
        row.thumbBack.setFillStyle(accentColor, 0.18);
        row.thumbBack.setStrokeStyle(isSelected ? 2 : 1, isSelected ? 0xf1d38e : 0xe3c98c, isSelected ? 0.36 : 0.18);
      }

      if (entry.kind === 'action') {
        const action = this.getActionListPresentation(entry.id);
        const runtimeThumbKey = this.getActionTextureKey(entry.id, 'thumbnail');
        if (runtimeThumbKey && this.textures.exists(runtimeThumbKey)) {
          row.thumb.setTexture(runtimeThumbKey).clearTint();
          fitImageWithinSquare(row.thumb, 24);
        } else {
          row.thumb.setTexture(ATLAS_KEY, action.iconFrame).clearTint();
          fitImageWithinSquare(row.thumb, 20);
        }
        this.fitSingleLineText(row.nameText, action.name, 150);
        this.fitSingleLineText(row.metaText, action.meta, 150);
        this.fitSingleLineText(row.priceText, action.price, 72);
        return;
      }

      this.applyVisualToImage(row.thumb, entry.offer.visual, 'thumbnail', 20);
      this.fitSingleLineText(row.nameText, this.localize(entry.offer.name), 150);
      this.fitSingleLineText(row.metaText, this.formatOfferListMeta(entry.offer), 150);
      const priceIconKey = this.getOfferCurrencyIconKey(entry.offer);
      if (this.textures.exists(priceIconKey)) {
        row.priceIcon.setTexture(priceIconKey).setDisplaySize(12, 12).setVisible(true);
      }
      row.priceText.setText(this.formatShortPrice(entry.offer));
    });

    this.layoutScrollThumb(
      this.offerScrollTrack,
      this.offerScrollThumb,
      OFFER_VISIBLE_ROWS,
      totalEntries,
      this.offerScrollIndex,
    );
  }

  private refreshBagGrid(): void {
    const entries = this.getVisibleBagEntries();
    const hasEntries = this.bagEntries.length > 0;
    this.bagEmptyText.setVisible(!hasEntries);

    this.bagSlots.forEach((slot, index) => {
      const entry = entries[index];
      const visible = Boolean(entry);
      slot.frame.setVisible(visible || !hasEntries);
      slot.card.setVisible(visible || !hasEntries);
      slot.accent.setVisible(visible);
      slot.thumbBack.setVisible(visible);
      slot.thumb.setVisible(visible);
      slot.quantityBack.setVisible(visible);
      slot.quantityText.setVisible(visible);

      if (!entry) {
        if (this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.uiBagSlotNormal)) {
          slot.frame.setTexture(SHOP_RUNTIME_IMAGE_KEYS.uiBagSlotNormal);
        }
        slot.frame.setAlpha(hasEntries ? 0.24 : 0.72);
        slot.quantityText.setText('');
        return;
      }

      const isSelected = entry.id === this.selectedBagEntryId;
      slot.frame.setAlpha(1);
      if (this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.uiBagSlotNormal)) {
        slot.frame.setTexture(isSelected ? SHOP_RUNTIME_IMAGE_KEYS.uiBagSlotSelected : SHOP_RUNTIME_IMAGE_KEYS.uiBagSlotNormal);
        slot.accent.setVisible(false);
        slot.thumbBack.setVisible(false);
      } else {
        slot.card.setStrokeStyle(isSelected ? 2 : 1, isSelected ? 0xf1d38e : 0xe3c98c, isSelected ? 0.52 : 0.12);
        slot.accent.setVisible(true);
        slot.thumbBack.setVisible(true);
        slot.accent.setFillStyle(entry.visual.accentColor, isSelected ? 0.72 : 0.34);
        slot.thumbBack.setFillStyle(entry.visual.accentColor, 0.18);
        slot.thumbBack.setStrokeStyle(isSelected ? 2 : 1, isSelected ? 0xf1d38e : 0xe3c98c, isSelected ? 0.36 : 0.12);
      }
      this.applyVisualToImage(slot.thumb, entry.visual, 'thumbnail', 28);
      slot.quantityText.setText(entry.quantityLabel);
    });

    this.layoutScrollThumb(
      this.bagScrollTrack,
      this.bagScrollThumb,
      BAG_GRID_ROWS,
      Math.max(1, Math.ceil(this.bagEntries.length / BAG_GRID_COLUMNS)),
      this.bagScrollRow,
    );

    const selectedEntry = this.getSelectedBagEntry();
    this.fitSingleLineText(
      this.bagHintText,
      selectedEntry ? `선택: ${selectedEntry.name} | 아이콘을 눌러 상세 보기` : '아이콘을 눌러 상세 보기를 열 수 있습니다.',
      296,
    );
    this.fitSingleLineText(
      this.cashHintText,
      '현금 상품은 상점 목록 상단에서 선택하세요.',
      296,
    );
  }

  private refreshDetailModal(): void {
    const target = this.detailTarget;
    const visible = Boolean(target);
    this.detailOverlay.setVisible(visible);
    this.detailFrame.setVisible(visible);
    this.detailOuterFrameArt.setVisible(visible);
    this.detailTextPanelArt.setVisible(visible);
    this.detailPreviewBack.setVisible(visible);
    this.detailPreviewStageArt.setVisible(false);
    this.detailPreviewAccent.setVisible(false);
    this.detailPreviewImage.setVisible(visible);
    this.detailTitleText.setVisible(visible);
    this.detailMetaText.setVisible(visible);
    this.detailDescriptionText.setVisible(visible);
    this.detailStatusText.setVisible(visible);

    if (visible) {
      this.detailOverlay.setInteractive({ useHandCursor: true });
    } else {
      this.detailOverlay.disableInteractive();
    }

    if (this.detailActionButton) {
      this.detailActionButton.destroy();
      this.detailActionButton = null;
    }
    if (this.detailCloseButton) {
      this.detailCloseButton.destroy();
      this.detailCloseButton = null;
    }

    if (!target) {
      return;
    }

    if (target.kind === 'action') {
      const action = this.getActionDetailConfig(target.id);
      this.detailPreviewAccent.setFillStyle(action.accentColor, 0.72);
      const runtimeDetailKey = this.getActionTextureKey(target.id, 'detail');
      if (runtimeDetailKey && this.textures.exists(runtimeDetailKey)) {
        this.detailPreviewImage.setTexture(runtimeDetailKey).clearTint();
        fitImageWithinSquare(this.detailPreviewImage, 74);
      } else {
        this.detailPreviewImage.setTexture(ATLAS_KEY, action.iconFrame);
        this.detailPreviewImage.clearTint();
        fitImageWithinSquare(this.detailPreviewImage, 60);
      }
      this.fitSingleLineText(this.detailTitleText, action.title, 208);
      this.fitSingleLineText(this.detailMetaText, action.meta, 208);
      this.detailDescriptionText.setText(action.description);
      this.detailStatusText.setText(action.status);
      this.detailActionButton = createButton(this, 126, 474, {
        width: 96,
        height: 30,
        label: action.confirmLabel,
        backgroundFrame: AtlasFrame.GoldButton,
        contentOffsetY: 2,
        onClick: action.onConfirm,
      }).setDepth(103);
      this.detailCloseButton = createButton(this, 234, 474, {
        width: 96,
        height: 30,
        label: '닫기',
        contentOffsetY: 2,
        onClick: () => this.closeDetail(),
      }).setDepth(103);
      return;
    }

    if (target.kind === 'offer') {
      const offer = this.visibleOffers.find((entry) => entry.id === target.id);
      if (!offer) {
        this.closeDetail();
        return;
      }

      this.detailPreviewAccent.setFillStyle(offer.visual.accentColor, 0.72);
      this.applyVisualToImage(this.detailPreviewImage, offer.visual, 'detail', 70);
      const offerName = this.localize(offer.name);
      const offerEffectText = this.localize(offer.effectText);
      const comparison = this.getOfferPowerChange(offer);
      this.fitSingleLineText(this.detailTitleText, offerName, 208);
      this.fitSingleLineText(this.detailMetaText, `상점 상품 | ${offerEffectText}`, 208);
      this.detailDescriptionText.setText([
        this.localize(offer.description),
        '',
        `효과 ${offerEffectText}`,
        ...this.formatOfferComparisonLines(comparison),
        `가격 ${offer.price} ${translateCurrency(this, offer.currency)}`,
      ]);
      this.detailStatusText.setText(
        offer.unlockFurnitureId && this.snapshot.housing.ownedFurnitureIds.includes(offer.unlockFurnitureId)
          ? '이미 보유한 꾸미기입니다.'
          : comparison?.levelLocked
            ? `구매 가능, 장착은 Lv.${comparison.requiredLevel}부터 가능합니다.`
            : '구매하면 즉시 적용됩니다.',
      );
      this.detailActionButton = createButton(this, 126, 474, {
        width: 96,
        height: 30,
        label: t(this, 'ui.buy'),
        backgroundFrame: AtlasFrame.GoldButton,
        contentOffsetY: 2,
        onClick: () => this.buyOffer(offer.id),
        disabled: Boolean(offer.unlockFurnitureId && this.snapshot.housing.ownedFurnitureIds.includes(offer.unlockFurnitureId)),
      }).setDepth(103);
      this.detailCloseButton = createButton(this, 234, 474, {
        width: 96,
        height: 30,
        label: '닫기',
        contentOffsetY: 2,
        onClick: () => this.closeDetail(),
      }).setDepth(103);
      return;
    }

    const entry = this.bagEntries.find((candidate) => candidate.id === target.id);
    if (!entry) {
      this.closeDetail();
      return;
    }

    this.detailPreviewAccent.setFillStyle(entry.visual.accentColor, 0.72);
    this.applyVisualToImage(this.detailPreviewImage, entry.visual, 'detail', 70);
    this.fitSingleLineText(this.detailTitleText, entry.name, 208);
    this.fitSingleLineText(this.detailMetaText, entry.meta, 208);
    this.detailDescriptionText.setText(entry.description);
    this.detailStatusText.setText(entry.sellable ? `판매가 ${entry.sellPrice} 골드` : '현재는 판매할 수 없는 아이템입니다.');
    this.detailActionButton = createButton(this, 126, 474, {
      width: 96,
      height: 30,
      label: '판매',
      backgroundFrame: AtlasFrame.GoldButton,
      contentOffsetY: 2,
      onClick: () => this.sellBagEntry(entry.id),
      disabled: !entry.sellable,
    }).setDepth(103);
    this.detailCloseButton = createButton(this, 234, 474, {
      width: 96,
      height: 30,
      label: '닫기',
      contentOffsetY: 2,
      onClick: () => this.closeDetail(),
    }).setDepth(103);
  }

  private buildBagEntries(): ShopBagEntry[] {
    const entries = [
      ...this.buildWeaponBagEntries(),
      ...this.buildArmorBagEntries(),
    ];

    return entries.sort((left, right) => {
      const priority = this.getBagKindPriority(left.kind) - this.getBagKindPriority(right.kind);
      if (priority !== 0) {
        return priority;
      }

      return left.name.localeCompare(right.name);
    });
  }

  private buildWeaponBagEntries(): ShopBagEntry[] {
    const weaponIds = new Set<string>();
    Object.entries(this.snapshot.collection.weaponCopies).forEach(([weaponId, count]) => {
      if (count > 0) {
        weaponIds.add(weaponId);
      }
    });
    Object.values(this.snapshot.collection.equipmentLoadouts).forEach((loadout) => {
      if (loadout.weaponId) {
        weaponIds.add(loadout.weaponId);
      }
    });

    return [...weaponIds]
      .sort((left, right) => {
        const leftDefinition = getWeaponDefinition(left);
        const rightDefinition = getWeaponDefinition(right);
        if (rightDefinition.rarity !== leftDefinition.rarity) {
          return rightDefinition.rarity - leftDefinition.rarity;
        }
        return leftDefinition.name.localeCompare(rightDefinition.name);
      })
      .flatMap((weaponId) => {
        const definition = getWeaponDefinition(weaponId);
        const ownedCount = this.snapshot.collection.weaponCopies[weaponId] ?? 0;
        const availableCopies = getAvailableWeaponCopies(this.snapshot, weaponId);
        if (availableCopies <= 0) {
          return [];
        }
        const itemName = this.localize(definition.name);
        const statLines = this.localizeStatLines(formatEquipmentStats(definition.stats).slice(0, 4));
        const summary = `${this.formatWeaponClassLabel(definition.weaponClass)} | 판매 가능 ${availableCopies} | 보유 ${ownedCount}`;
        const description = [
          `${itemName}`,
          `${definition.rarity}성 | ${this.formatWeaponClassLabel(definition.weaponClass)} | Lv.${definition.levelRequirement}`,
          ...statLines,
          `획득처: ${this.formatSourceLabel(definition.source)}`,
        ].join('\n');

        return [{
          id: `weapon:${weaponId}`,
          kind: 'weapon' as const,
          itemId: weaponId,
          name: itemName,
          meta: `무기 | ${this.formatWeaponClassLabel(definition.weaponClass)}`,
          summary,
          description,
          quantity: availableCopies,
          quantityLabel: `x${availableCopies}`,
          iconFrame: getWeaponIconFrame(weaponId),
          visual: createWeaponVisualRef(weaponId, definition.weaponClass, getWeaponIconFrame(weaponId)),
          sellable: true,
          sellPrice: this.getEquipmentSellPrice('weapon', definition.rarity),
        }];
      });
  }

  private buildArmorBagEntries(): ShopBagEntry[] {
    const armorIds = new Set<string>();
    Object.entries(this.snapshot.collection.armorCopies).forEach(([armorId, count]) => {
      if (count > 0) {
        armorIds.add(armorId);
      }
    });
    Object.values(this.snapshot.collection.equipmentLoadouts).forEach((loadout) => {
      if (loadout.armorId) {
        armorIds.add(loadout.armorId);
      }
    });

    return [...armorIds]
      .sort((left, right) => {
        const leftDefinition = getArmorDefinition(left);
        const rightDefinition = getArmorDefinition(right);
        if (rightDefinition.rarity !== leftDefinition.rarity) {
          return rightDefinition.rarity - leftDefinition.rarity;
        }
        return leftDefinition.name.localeCompare(rightDefinition.name);
      })
      .flatMap((armorId) => {
        const definition = getArmorDefinition(armorId);
        const ownedCount = this.snapshot.collection.armorCopies[armorId] ?? 0;
        const availableCopies = getAvailableArmorCopies(this.snapshot, armorId);
        if (availableCopies <= 0) {
          return [];
        }
        const itemName = this.localize(definition.name);
        const statLines = this.localizeStatLines(formatEquipmentStats(definition.stats).slice(0, 4));
        const summary = `${this.formatArmorClassLabel(definition.armorClass)} | 판매 가능 ${availableCopies} | 보유 ${ownedCount}`;
        const description = [
          `${itemName}`,
          `${definition.rarity}성 | ${this.formatArmorClassLabel(definition.armorClass)} | Lv.${definition.levelRequirement}`,
          ...statLines,
          `획득처: ${this.formatSourceLabel(definition.source)}`,
        ].join('\n');

        return [{
          id: `armor:${armorId}`,
          kind: 'armor' as const,
          itemId: armorId,
          name: itemName,
          meta: `방어구 | ${this.formatArmorClassLabel(definition.armorClass)}`,
          summary,
          description,
          quantity: availableCopies,
          quantityLabel: `x${availableCopies}`,
          iconFrame: getArmorIconFrame(armorId),
          visual: createArmorVisualRef(armorId, definition.armorClass, getArmorIconFrame(armorId)),
          sellable: true,
          sellPrice: this.getEquipmentSellPrice('armor', definition.rarity),
        }];
      });
  }

  private getShopListEntries(): ShopListEntry[] {
    return [
      ...this.visibleOffers.map((offer) => ({ kind: 'offer' as const, offer })),
    ];
  }

  private getVisibleShopListEntries(): ShopListEntry[] {
    return this.getShopListEntries().slice(this.offerScrollIndex, this.offerScrollIndex + OFFER_VISIBLE_ROWS);
  }

  private getVisibleBagEntries(): ShopBagEntry[] {
    const start = this.bagScrollRow * BAG_GRID_COLUMNS;
    return this.bagEntries.slice(start, start + BAG_VISIBLE_SLOTS);
  }

  private getSelectedBagEntry(): ShopBagEntry | null {
    return this.bagEntries.find((entry) => entry.id === this.selectedBagEntryId) ?? null;
  }

  private openVisibleOfferAt(slotIndex: number): void {
    if (this.consumeNextTap) {
      this.consumeNextTap = false;
      return;
    }

    const entry = this.getVisibleShopListEntries()[slotIndex];
    if (!entry) {
      return;
    }

    if (entry.kind === 'action') {
      this.openActionDetail(entry.id);
      return;
    }

    this.selectedOfferId = entry.offer.id;
    this.ensureOfferSelectionVisible(entry.offer.id);
    this.detailTarget = { kind: 'offer', id: entry.offer.id };
    this.statusMessage = '';
    this.refreshView();
  }

  private openVisibleBagEntryAt(slotIndex: number): void {
    if (this.consumeNextTap) {
      this.consumeNextTap = false;
      return;
    }

    const entry = this.getVisibleBagEntries()[slotIndex];
    if (!entry) {
      return;
    }

    this.selectedBagEntryId = entry.id;
    this.ensureBagSelectionVisible(entry.id);
    this.detailTarget = { kind: 'bag', id: entry.id };
    this.statusMessage = `${entry.name} 상세를 확인 중입니다.`;
    this.refreshView();
  }

  private openActionDetail(actionId: ActionDetailId): void {
    this.detailTarget = { kind: 'action', id: actionId };
    this.statusMessage = '실행 전에 상세 설명을 확인하세요.';
    this.refreshView();
  }

  private buyOffer(offerId: string): void {
    const result = purchaseShopOffer(this.snapshot, offerId);

    if (!result.ok) {
      this.statusMessage = result.message;
      this.refreshView();
      return;
    }

    this.snapshot = result.snapshot;
    saveSnapshot(this.snapshot);
    this.visibleOffers = getShopOffersForShop(this.sceneData.shopId, this.snapshot);
    this.bagEntries = this.buildBagEntries();
    this.statusMessage = result.message;
    this.refreshView();
  }

  private sellBagEntry(entryId: string): void {
    const entry = this.bagEntries.find((candidate) => candidate.id === entryId);
    if (!entry || !entry.sellable || (entry.kind !== 'weapon' && entry.kind !== 'armor')) {
      this.statusMessage = '지금은 판매할 수 없는 아이템입니다.';
      this.refreshView();
      return;
    }

    const result = sellShopInventoryEntry(this.snapshot, {
      kind: entry.kind,
      itemId: entry.itemId,
      price: entry.sellPrice,
    });

    if (!result.ok) {
      this.statusMessage = result.message;
      this.refreshView();
      return;
    }

    this.snapshot = result.snapshot;
    saveSnapshot(this.snapshot);
    this.bagEntries = this.buildBagEntries();
    this.statusMessage = result.message;
    this.refreshView();
  }

  private scrollOffers(delta: number): void {
    const nextIndex = Phaser.Math.Clamp(this.offerScrollIndex + delta, 0, this.getMaxOfferScroll());
    if (nextIndex === this.offerScrollIndex) {
      return;
    }
    this.offerScrollIndex = nextIndex;
    this.refreshOfferList();
  }

  private scrollBag(delta: number): void {
    const nextRow = Phaser.Math.Clamp(this.bagScrollRow + delta, 0, this.getMaxBagScrollRow());
    if (nextRow === this.bagScrollRow) {
      return;
    }
    this.bagScrollRow = nextRow;
    this.refreshBagGrid();
  }

  private closeDetail(): void {
    this.detailTarget = null;
    this.statusMessage = '';
    this.refreshView();
  }

  private getActionDetailConfig(actionId: ActionDetailId): {
    title: string;
    meta: string;
    description: string;
    status: string;
    accentColor: number;
    iconFrame: number;
    confirmLabel: string;
    onConfirm: () => void;
  } {
    switch (actionId) {
      case 'starter_pack':
        return {
          title: '스타터 팩',
          meta: `현금 상품 | 계정 1회 | ${this.starterPackPrice}`,
          description: [
            '초반 성장을 돕는 유료 보급 상품입니다.',
            '',
            '골드 500, 보석 300, 피로도 9를 즉시 지급합니다.',
            '계정당 한 번만 구매할 수 있습니다.',
          ].join('\n'),
          status: '구매 확인 후 보상이 즉시 적용됩니다.',
          accentColor: 0xd7aa58,
          iconFrame: AtlasFrame.Star,
          confirmLabel: '구매',
          onConfirm: () => {
            this.detailTarget = null;
            this.refreshView();
            void this.buyCashProduct('hs_pack_beginner_01');
          },
        };
      case 'fatigue_pack':
        return {
          title: '피로도 팩',
          meta: `현금 상품 | 반복 구매 | ${this.fatiguePackPrice}`,
          description: [
            '출정을 더 이어가기 위한 유료 피로도 충전 상품입니다.',
            '',
            '피로도 18을 즉시 회복합니다.',
            '필요할 때마다 반복 구매할 수 있습니다.',
          ].join('\n'),
          status: '구매 확인 후 즉시 피로도를 회복합니다.',
          accentColor: 0x6f9dbb,
          iconFrame: AtlasFrame.BagIcon,
          confirmLabel: '충전',
          onConfirm: () => {
            this.detailTarget = null;
            this.refreshView();
            void this.buyCashProduct('hs_fatigue_small_01');
          },
        };
    }
  }

  private async buyCashProduct(productId: string): Promise<void> {
    const outcome = await purchaseConfiguredProduct(productId);
    if (!this.sceneLive) {
      return;
    }

    if (!outcome.ok) {
      this.statusMessage = outcome.message;
      this.refreshView();
      return;
    }

    const applied = applyPurchasedProduct(this.snapshot, productId, Date.now());
    if (!this.sceneLive) {
      return;
    }
    if (!applied.applied) {
      this.statusMessage = applied.message;
      this.refreshView();
      return;
    }

    this.snapshot = applied.snapshot;
    saveSnapshot(this.snapshot);
    this.statusMessage = `${outcome.message} ${applied.message}`;
    this.refreshView();
  }

  private async loadStoreLabels(): Promise<void> {
    const products = await listStoreProducts();
    if (!this.sceneLive) {
      return;
    }
    const starter = products.find((entry) => entry.id === 'hs_pack_beginner_01');
    const fatigue = products.find((entry) => entry.id === 'hs_fatigue_small_01');

    if (starter) {
      this.starterPackPrice = starter.priceLabel;
    }

    if (fatigue) {
      this.fatiguePackPrice = fatigue.priceLabel;
    }

    this.refreshBagGrid();
  }

  private async ensureVisualTexturesLoaded(): Promise<void> {
    const missingAssets = new Map<string, string>();
    const collectVisual = (visual: ShopVisualRef) => {
      const thumbKey = getShopThumbnailTextureKey(visual);
      if (!this.textures.exists(thumbKey)) {
        missingAssets.set(thumbKey, `assets/world/town/shop-refresh/items/${visual.thumbnailId}.png`);
      }

      const detailKey = getShopDetailTextureKey(visual);
      if (!this.textures.exists(detailKey)) {
        missingAssets.set(detailKey, `assets/world/town/shop-refresh/items/${visual.detailId}.png`);
      }
    };

    this.visibleOffers.forEach((offer) => collectVisual(offer.visual));
    this.bagEntries.forEach((entry) => collectVisual(entry.visual));

    if (missingAssets.size === 0) {
      return;
    }

    await Promise.all(
      [...missingAssets.entries()].map(([key, assetPath]) => loadExternalTexture(this, key, assetPath)),
    );

    if (!this.sceneLive) {
      return;
    }

    this.refreshView();
  }

  private normalizeSelectionState(): void {
    if (!this.visibleOffers.some((offer) => offer.id === this.selectedOfferId)) {
      this.selectedOfferId = this.visibleOffers[0]?.id ?? null;
    }

    if (!this.bagEntries.some((entry) => entry.id === this.selectedBagEntryId)) {
      this.selectedBagEntryId = this.bagEntries[0]?.id ?? null;
    }

    this.offerScrollIndex = Phaser.Math.Clamp(this.offerScrollIndex, 0, this.getMaxOfferScroll());
    this.bagScrollRow = Phaser.Math.Clamp(this.bagScrollRow, 0, this.getMaxBagScrollRow());

    if (this.selectedOfferId) {
      this.ensureOfferSelectionVisible(this.selectedOfferId);
    }
    if (this.selectedBagEntryId) {
      this.ensureBagSelectionVisible(this.selectedBagEntryId);
    }

    if (this.detailTarget?.kind === 'offer' && !this.visibleOffers.some((offer) => offer.id === this.detailTarget?.id)) {
      this.detailTarget = null;
    }
    if (this.detailTarget?.kind === 'bag' && !this.bagEntries.some((entry) => entry.id === this.detailTarget?.id)) {
      this.detailTarget = null;
    }
  }

  private ensureOfferSelectionVisible(offerId: string): void {
    const index = this.getShopListEntries().findIndex((entry) => entry.kind === 'offer' && entry.offer.id === offerId);
    if (index < 0) {
      return;
    }

    if (index < this.offerScrollIndex) {
      this.offerScrollIndex = index;
      return;
    }

    const end = this.offerScrollIndex + OFFER_VISIBLE_ROWS - 1;
    if (index > end) {
      this.offerScrollIndex = index - OFFER_VISIBLE_ROWS + 1;
    }
  }

  private ensureBagSelectionVisible(entryId: string): void {
    const index = this.bagEntries.findIndex((entry) => entry.id === entryId);
    if (index < 0) {
      return;
    }

    const row = Math.floor(index / BAG_GRID_COLUMNS);
    if (row < this.bagScrollRow) {
      this.bagScrollRow = row;
      return;
    }

    const end = this.bagScrollRow + BAG_GRID_ROWS - 1;
    if (row > end) {
      this.bagScrollRow = row - BAG_GRID_ROWS + 1;
    }
  }

  private layoutScrollThumb(
    track: Phaser.GameObjects.Rectangle,
    thumb: Phaser.GameObjects.Rectangle,
    visibleCount: number,
    totalCount: number,
    offset: number,
  ): void {
    if (totalCount <= visibleCount) {
      track.setVisible(false);
      thumb.setVisible(false);
      return;
    }

    track.setVisible(true);
    thumb.setVisible(true);

    const ratio = Phaser.Math.Clamp(visibleCount / Math.max(totalCount, 1), 0.18, 1);
    const thumbHeight = Math.max(24, Math.round(track.height * ratio));
    thumb.setDisplaySize(thumb.width, thumbHeight);

    const top = track.y - track.height / 2;
    const travel = track.height - thumbHeight;
    const maxOffset = Math.max(1, totalCount - visibleCount);
    const normalizedOffset = Phaser.Math.Clamp(offset / maxOffset, 0, 1);
    thumb.y = top + thumbHeight / 2 + travel * normalizedOffset;
  }

  private applyVisualToImage(
    image: Phaser.GameObjects.Image,
    visual: ShopVisualRef,
    mode: 'thumbnail' | 'detail',
    size: number,
  ): void {
    if (!this.sceneLive || !image.scene?.sys) {
      return;
    }
    const textureKey = mode === 'detail' ? getShopDetailTextureKey(visual) : getShopThumbnailTextureKey(visual);
    if (this.textures.exists(textureKey)) {
      image.setTexture(textureKey);
      image.clearTint();
    } else {
      image.setTexture(ATLAS_KEY, visual.fallbackFrame);
      image.clearTint();
    }
    fitImageWithinSquare(image, size);
  }

  private getMaxOfferScroll(): number {
    return Math.max(0, this.getShopListEntries().length - OFFER_VISIBLE_ROWS);
  }

  private getMaxBagScrollRow(): number {
    const totalRows = Math.ceil(this.bagEntries.length / BAG_GRID_COLUMNS);
    return Math.max(0, totalRows - BAG_GRID_ROWS);
  }

  private getBagKindPriority(kind: ShopBagEntry['kind']): number {
    switch (this.sceneData.shopId) {
      case 'weapon_shop':
      case 'forge_shop':
        return kind === 'weapon' ? 0 : kind === 'armor' ? 1 : 2;
      case 'armor_shop':
        return kind === 'armor' ? 0 : kind === 'weapon' ? 1 : 2;
      case 'relic_shop':
      case 'item_shop':
        return kind === 'weapon' ? 0 : 1;
      default:
        return kind === 'weapon' ? 0 : kind === 'armor' ? 1 : 2;
    }
  }

  private getEquipmentSellPrice(kind: 'weapon' | 'armor', rarity: number): number {
    if (kind === 'weapon') {
      return rarity >= 5 ? 220 : rarity === 4 ? 150 : 95;
    }
    return rarity >= 5 ? 180 : rarity === 4 ? 130 : 80;
  }

  private getActionTextureKey(actionId: ActionDetailId, kind: 'thumbnail' | 'detail'): string | null {
    switch (actionId) {
      case 'starter_pack':
        return kind === 'thumbnail'
          ? SHOP_RUNTIME_IMAGE_KEYS.cashStarterPackThumb
          : SHOP_RUNTIME_IMAGE_KEYS.cashStarterPackDetail;
      case 'fatigue_pack':
        return kind === 'thumbnail'
          ? SHOP_RUNTIME_IMAGE_KEYS.cashFatiguePackThumb
          : SHOP_RUNTIME_IMAGE_KEYS.cashFatiguePackDetail;
      default:
        return null;
    }
  }

  private formatShortPrice(offer: ShopOfferDefinition): string {
    return offer.price.toLocaleString();
  }

  private getSelectedOfferPowerChange(): ShopOfferEquipmentPowerChange | null {
    const selectedOffer = this.visibleOffers.find((offer) => offer.id === this.selectedOfferId);
    return selectedOffer ? this.getOfferPowerChange(selectedOffer) : null;
  }

  private getOfferPowerChange(offer: ShopOfferDefinition): ShopOfferEquipmentPowerChange | null {
    return getShopOfferEquipmentPowerChange(this.snapshot, offer);
  }

  private formatOfferListMeta(offer: ShopOfferDefinition): string {
    const comparison = this.getOfferPowerChange(offer);
    if (!comparison) {
      return this.localize(offer.effectText);
    }

    const levelPrefix = comparison.levelLocked ? `Lv.${comparison.requiredLevel} 필요 | ` : '';
    return `${levelPrefix}${this.localize(comparison.characterName)} ${this.formatSignedPowerDelta(comparison.delta)}`;
  }

  private formatOfferComparisonLines(comparison: ShopOfferEquipmentPowerChange | null): string[] {
    if (!comparison) {
      return [];
    }

    const characterName = this.localize(comparison.characterName);
    const levelLine = comparison.levelLocked
      ? `장착 제한: ${characterName} Lv.${comparison.currentLevel}/${comparison.requiredLevel}`
      : `장착 가능: ${characterName} Lv.${comparison.currentLevel}`;

    return [
      `현재 장착 비교: ${characterName} ${comparison.currentPower} -> ${comparison.candidatePower} (${this.formatSignedPowerDelta(comparison.delta)})`,
      levelLine,
    ];
  }

  private formatSignedPowerDelta(delta: number): string {
    return delta > 0 ? `전투력 +${delta}` : delta < 0 ? `전투력 ${delta}` : '전투력 변화 없음';
  }

  private getOfferCurrencyIconKey(offer: ShopOfferDefinition): string {
    return offer.currency === 'gold'
      ? SHOP_RUNTIME_IMAGE_KEYS.currencyGold
      : SHOP_RUNTIME_IMAGE_KEYS.currencyHeroStone;
  }

  private localize(value: string): string {
    return t(this, value, undefined, value);
  }

  private localizeStatLines(lines: string[]): string[] {
    return lines.map((line) => {
      const match = /^(.+?) \+(.+)$/.exec(line);
      if (!match) {
        return this.localize(line);
      }

      return `${t(this, `stat.${match[1]}`, undefined, match[1])} +${match[2]}`;
    });
  }

  private formatWeaponClassLabel(weaponClass: WeaponClass): string {
    switch (weaponClass) {
      case 'sword':
        return '검';
      case 'shield_sword':
        return '검방';
      case 'tome':
        return '마도서';
      case 'staff':
        return '지팡이';
      case 'bow':
        return '활';
      case 'war_hammer':
        return '망치';
      case 'cannon':
        return '캐논';
      case 'rune_hammer':
        return '룬 해머';
      case 'spear':
        return '창';
      case 'sea_staff':
        return '바다 지팡이';
      case 'pistol':
        return '권총';
      case 'knight_sword':
        return '기사검';
      case 'greatsword':
        return '대검';
      case 'record_book':
        return '기록서';
      case 'scimitar':
        return '시미터';
      case 'relic_staff':
        return '유물 지팡이';
      case 'lance':
        return '랜스';
      case 'holy_blade':
        return '성검';
      case 'hymn_staff':
        return '찬가 지팡이';
      case 'daggers':
        return '단검';
      default:
        return weaponClass;
    }
  }

  private formatArmorClassLabel(armorClass: ArmorClass): string {
    switch (armorClass) {
      case 'plate':
        return '플레이트';
      case 'heavy':
        return '중갑';
      case 'mobile':
        return '기동갑';
      case 'light':
        return '경갑';
      case 'robe':
        return '로브';
      case 'cleric':
        return '성직복';
      case 'runic':
        return '룬 작업복';
      default:
        return armorClass;
    }
  }

  private formatSourceLabel(source: string): string {
    switch (source) {
      case 'starter':
        return '기본 지급';
      case 'summon':
        return '소환';
      case 'event':
        return '이벤트';
      case 'stage':
        return '스테이지';
      case 'shop':
        return '상점';
      default:
        return source;
    }
  }

  private compactStatus(status: string): string {
    return status.replace(/\s+/g, ' ').trim();
  }

  private fitSingleLineText(
    textObject: Phaser.GameObjects.Text,
    value: string,
    maxWidth: number,
  ): void {
    const source = value.trim();
    textObject.setText(source);

    if (textObject.width <= maxWidth || source.length === 0) {
      return;
    }

    const ellipsis = '...';
    let end = source.length;
    while (end > 0) {
      const candidate = `${source.slice(0, end).trimEnd()}${ellipsis}`;
      textObject.setText(candidate);
      if (textObject.width <= maxWidth) {
        return;
      }
      end -= 1;
    }

    textObject.setText(ellipsis);
  }

  private getShopTitleLabel(shopId: TownShopId): string {
    switch (shopId) {
      case 'weapon_shop':
        return '무기 상점';
      case 'armor_shop':
        return '방어구 상점';
      case 'item_shop':
        return '잡화 상점';
      case 'forge_shop':
        return '대장간';
      case 'relic_shop':
        return '유물 상점';
      default:
        return '마을 상점';
    }
  }

  private goBack(): void {
    if (this.sceneData.returnScene === 'town-interior' && this.sceneData.shopId) {
      this.scene.start('town-interior', { shopId: this.sceneData.shopId });
      return;
    }

    this.scene.start('village', this.sceneData.returnSpawnId ? { spawnId: this.sceneData.returnSpawnId } : undefined);
  }
}

function getShopAccentColor(shopId: TownShopId | undefined): number {
  switch (shopId) {
    case 'weapon_shop':
      return 0xb68758;
    case 'armor_shop':
      return 0xa8845f;
    case 'item_shop':
      return 0x6f9dbb;
    case 'forge_shop':
      return 0xb0724d;
    case 'relic_shop':
      return 0x8477be;
    default:
      return 0x8a8d90;
  }
}

function fitImageWithinSquare(image: Phaser.GameObjects.Image, size: number): void {
  const sourceWidth = Math.max(1, image.width);
  const sourceHeight = Math.max(1, image.height);
  const scale = Math.min(size / sourceWidth, size / sourceHeight);
  image.setDisplaySize(
    Math.max(1, Math.round(sourceWidth * scale)),
    Math.max(1, Math.round(sourceHeight * scale)),
  );
}

function coverImageToBox(image: Phaser.GameObjects.Image, width: number, height: number): void {
  const scale = Math.max(width / image.width, height / image.height);
  image.setDisplaySize(
    Math.max(1, Math.round(image.width * scale)),
    Math.max(1, Math.round(image.height * scale)),
  );
}

function loadExternalTexture(scene: Phaser.Scene, key: string, assetPath: string): Promise<void> {
  if (scene.textures.exists(key)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      if (!scene.textures.exists(key)) {
        scene.textures.addImage(key, image);
      }
      if (scene.textures.exists(key)) {
        scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.LINEAR);
      }
      resolve();
    };
    image.onerror = () => resolve();
    image.src = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  });
}
