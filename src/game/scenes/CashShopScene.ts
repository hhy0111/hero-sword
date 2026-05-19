import Phaser from 'phaser';
import { AtlasFrame } from '../data/atlas';
import {
  CASH_PRODUCT_BY_ID,
  CASH_PRODUCTS,
  type CashProductDefinition,
  type CashProductId,
} from '../data/cashProducts';
import { SHOP_RUNTIME_IMAGE_KEYS } from '../data/shopRuntimeArt';
import { loadSnapshot, saveSnapshot } from '../services/save';
import type { SaveSnapshot } from '../types';
import { buildDebugState } from '../ui/debugHud';
import { createButton, paintBackdrop } from '../ui/widgets';
import {
  applyPurchasedProduct,
  listStoreProducts,
  purchaseConfiguredProduct,
} from '../../platform/store';

interface CashProductRow {
  productId: CashProductId;
  card: Phaser.GameObjects.Rectangle;
  frame: Phaser.GameObjects.Image | null;
  hitZone: Phaser.GameObjects.Rectangle;
  thumbBack: Phaser.GameObjects.Rectangle;
  thumb: Phaser.GameObjects.Image | null;
  titleText: Phaser.GameObjects.Text;
  subtitleText: Phaser.GameObjects.Text;
  priceBack: Phaser.GameObjects.Rectangle;
  priceText: Phaser.GameObjects.Text;
}

export class CashShopScene extends Phaser.Scene {
  private snapshot!: SaveSnapshot;
  private rows: CashProductRow[] = [];
  private priceLabels = new Map<CashProductId, string>();
  private statusText!: Phaser.GameObjects.Text;
  private selectedProductId: CashProductId | null = null;
  private detailLayer: Phaser.GameObjects.Container | null = null;
  private sceneLive = false;

  constructor() {
    super('cash_shop');
  }

  create(): void {
    this.sceneLive = true;
    this.rows = [];
    this.priceLabels.clear();
    this.selectedProductId = null;
    this.detailLayer = null;
    this.snapshot = loadSnapshot();

    this.drawLayout();
    this.refreshRows();
    void this.loadPriceLabels();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.sceneLive = false;
      this.detailLayer?.destroy(true);
      this.detailLayer = null;
    });
  }

  update(_: number, delta: number): void {
    this.stepSimulation(delta);
  }

  public stepSimulation(_: number): void {}

  public renderGameToText(): string {
    return JSON.stringify(
      buildDebugState('cash_shop', this.snapshot, {
        selectedProductId: this.selectedProductId,
        products: CASH_PRODUCTS.map((product) => ({
          id: product.id,
          title: product.title,
          price: this.getPriceLabel(product),
        })),
        availableActions: ['select_product', 'purchase_product', 'close_detail', 'back_to_village'],
      }),
    );
  }

  private drawLayout(): void {
    paintBackdrop(this, AtlasFrame.StoneTile, 0x1d2a24);
    this.add.rectangle(180, 320, 342, 604, 0x07111b, 0.9)
      .setStrokeStyle(2, 0x4d5f54, 0.55);

    if (this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.uiMainFrame)) {
      this.add.image(180, 320, SHOP_RUNTIME_IMAGE_KEYS.uiMainFrame)
        .setDisplaySize(326, 572)
        .setAlpha(0.94);
    }

    if (this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.uiHeaderBar)) {
      this.add.image(180, 86, SHOP_RUNTIME_IMAGE_KEYS.uiHeaderBar)
        .setDisplaySize(300, 78);
    }

    this.add.text(36, 58, '유료 결제', {
      fontFamily: 'Segoe UI',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#fff1c3',
      stroke: '#1d130c',
      strokeThickness: 4,
    });
    this.add.text(38, 94, '구매 전 상품 구성과 가격을 확인하세요.', {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      color: '#d7c7a0',
      stroke: '#17110c',
      strokeThickness: 2,
    });

    this.add.text(38, 136, '상품 목록', {
      fontFamily: 'Segoe UI',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#fff0c4',
      stroke: '#17110c',
      strokeThickness: 3,
    });

    CASH_PRODUCTS.forEach((product, index) => this.createProductRow(product, 176 + index * 70));

    this.statusText = this.add.text(38, 448, '상품을 선택하면 상세 정보를 확인할 수 있습니다.', {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      color: '#e7d6ac',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 284 },
      lineSpacing: 4,
    });

    createButton(this, 260, 556, {
      width: 120,
      height: 28,
      label: '나가기',
      iconFrame: AtlasFrame.MapIcon,
      onClick: () => this.goBack(),
    });
  }

  private createProductRow(product: CashProductDefinition, y: number): void {
    const card = this.add.rectangle(180, y, 304, 58, 0x101923, 0.82)
      .setStrokeStyle(1, 0xe3c98c, 0.18);
    const frame = this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.uiOfferRowNormal)
      ? this.add.image(180, y, SHOP_RUNTIME_IMAGE_KEYS.uiOfferRowNormal).setDisplaySize(304, 58)
      : null;
    const hitZone = this.add.rectangle(180, y, 304, 58, 0x000000, 0)
      .setInteractive({ useHandCursor: true });
    const thumbBack = this.add.rectangle(66, y, 42, 42, 0x16202b, 0.92)
      .setStrokeStyle(1, 0xf1d38e, 0.2);
    const thumb = this.textures.exists(product.thumbKey)
      ? this.add.image(66, y, product.thumbKey)
      : null;
    if (thumb) {
      fitImageInside(thumb, 36, 36);
    }
    const titleText = this.add.text(96, y - 20, product.title, {
      fontFamily: 'Segoe UI',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#fff0c4',
      stroke: '#17110c',
      strokeThickness: 3,
    });
    const subtitleText = this.add.text(96, y + 1, product.subtitle, {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#d8c49a',
      stroke: '#17110c',
      strokeThickness: 2,
    });
    const priceBack = this.add.rectangle(270, y + 17, 62, 20, 0x060b12, 0.72)
      .setStrokeStyle(1, 0xe3c98c, 0.18);
    const priceText = this.add.text(270, y + 17, product.defaultPrice, {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#ffe49b',
      stroke: '#17110c',
      strokeThickness: 2,
      align: 'center',
      wordWrap: { width: 58 },
    }).setOrigin(0.5, 0.5);

    hitZone.on('pointerup', () => this.openDetail(product.id));
    this.rows.push({ productId: product.id, card, frame, hitZone, thumbBack, thumb, titleText, subtitleText, priceBack, priceText });
  }

  private refreshRows(): void {
    this.rows.forEach((row) => {
      const selected = row.productId === this.selectedProductId;
      if (row.frame) {
        row.frame.setTexture(selected ? SHOP_RUNTIME_IMAGE_KEYS.uiOfferRowSelected : SHOP_RUNTIME_IMAGE_KEYS.uiOfferRowNormal);
      }
      row.card.setStrokeStyle(selected ? 2 : 1, selected ? 0xf1d38e : 0xe3c98c, selected ? 0.56 : 0.18);
      row.thumbBack.setStrokeStyle(selected ? 2 : 1, selected ? 0xf1d38e : 0xe3c98c, selected ? 0.38 : 0.2);
      row.priceBack.setStrokeStyle(selected ? 2 : 1, selected ? 0xf1d38e : 0xe3c98c, selected ? 0.42 : 0.18);
      row.priceText.setText(this.getPriceLabel(CASH_PRODUCT_BY_ID.get(row.productId)!));
    });
  }

  private openDetail(productId: CashProductId): void {
    const product = CASH_PRODUCT_BY_ID.get(productId);
    if (!product) {
      return;
    }

    this.closeDetail();
    this.selectedProductId = productId;
    this.refreshRows();

    const overlay = this.add.rectangle(180, 320, 360, 640, 0x02060a, 0.62)
      .setInteractive();
    const panelBack = this.add.rectangle(180, 320, 300, 382, 0x16120f, 0.96)
      .setStrokeStyle(2, 0xe2c07a, 0.36);
    const frame = this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.uiDetailOuterFrame)
      ? this.add.image(180, 320, SHOP_RUNTIME_IMAGE_KEYS.uiDetailOuterFrame).setDisplaySize(300, 382)
      : null;
    const previewBack = this.add.rectangle(180, 226, 108, 108, 0x0d151e, 0.94)
      .setStrokeStyle(1, 0xf1d38e, 0.18);
    const preview = this.textures.exists(product.detailKey)
      ? this.add.image(180, 226, product.detailKey)
      : null;
    if (preview) {
      fitImageInside(preview, 96, 96);
    }
    const titleText = this.add.text(180, 132, product.title, {
      fontFamily: 'Segoe UI',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#fff1c3',
      stroke: '#24160e',
      strokeThickness: 4,
    }).setOrigin(0.5, 0.5);
    const metaText = this.add.text(180, 160, `현금 상품 | ${this.getPriceLabel(product)}`, {
      fontFamily: 'Segoe UI',
      fontSize: '13px',
      color: '#d9bd83',
      stroke: '#17110c',
      strokeThickness: 2,
    }).setOrigin(0.5, 0.5);
    const descriptionText = this.add.text(56, 292, [
      product.description,
      '',
      ...product.grantLines,
    ].join('\n'), {
      fontFamily: 'Segoe UI',
      fontSize: '14px',
      color: '#efe0ba',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 248 },
      lineSpacing: 6,
    });
    const statusText = this.add.text(56, 454, '구매하면 즉시 보상이 적용됩니다.', {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      color: '#ddc695',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 248 },
    });
    const purchaseButton = createButton(this, 118, 502, {
      width: 112,
      height: 28,
      label: '구매',
      iconFrame: AtlasFrame.Star,
      onClick: () => void this.buyProduct(product.id),
    });
    const closeButton = createButton(this, 242, 502, {
      width: 112,
      height: 28,
      label: '닫기',
      iconFrame: AtlasFrame.MapIcon,
      onClick: () => this.closeDetail(),
    });

    overlay.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const insidePanel = pointer.x >= 30 && pointer.x <= 330 && pointer.y >= 129 && pointer.y <= 511;
      if (!insidePanel) {
        this.closeDetail();
      }
    });

    this.detailLayer = this.add.container(0, 0, [
      overlay,
      panelBack,
      ...(frame ? [frame] : []),
      previewBack,
      ...(preview ? [preview] : []),
      titleText,
      metaText,
      descriptionText,
      statusText,
      purchaseButton,
      closeButton,
    ]).setDepth(100);
  }

  private closeDetail(): void {
    this.detailLayer?.destroy(true);
    this.detailLayer = null;
    this.selectedProductId = null;
    this.refreshRows();
  }

  private async buyProduct(productId: CashProductId): Promise<void> {
    this.statusText.setText('구매 요청을 처리하고 있습니다.');
    const outcome = await purchaseConfiguredProduct(productId);
    if (!this.sceneLive) {
      return;
    }

    if (!outcome.ok) {
      this.statusText.setText(outcome.message);
      return;
    }

    const grant = applyPurchasedProduct(this.snapshot, productId, Date.now());
    if (!grant.applied) {
      this.statusText.setText(grant.message);
      return;
    }

    this.snapshot = grant.snapshot;
    saveSnapshot(this.snapshot);
    this.statusText.setText(`${outcome.message}\n${grant.message}`);
    this.closeDetail();
  }

  private async loadPriceLabels(): Promise<void> {
    const products = await listStoreProducts();
    if (!this.sceneLive) {
      return;
    }

    for (const product of products) {
      if (CASH_PRODUCT_BY_ID.has(product.id as CashProductId)) {
        this.priceLabels.set(product.id as CashProductId, product.priceLabel);
      }
    }
    this.refreshRows();
  }

  private getPriceLabel(product: CashProductDefinition): string {
    return this.priceLabels.get(product.id) ?? product.defaultPrice;
  }

  private goBack(): void {
    this.scene.start('village');
  }
}

function fitImageInside(image: Phaser.GameObjects.Image, maxWidth: number, maxHeight: number): void {
  const source = image.texture.getSourceImage() as { width: number; height: number };
  const scale = Math.min(maxWidth / Math.max(source.width, 1), maxHeight / Math.max(source.height, 1));
  image.setDisplaySize(Math.max(1, source.width * scale), Math.max(1, source.height * scale));
}
