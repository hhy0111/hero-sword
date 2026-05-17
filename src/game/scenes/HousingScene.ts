import Phaser from 'phaser';
import { cycleHousingSlot, describeHousingSlot, type HousingSlotKey } from '../core/housing';
import { AtlasFrame, ATLAS_KEY } from '../data/atlas';
import { getFurniture } from '../data/housing';
import {
  getHousingFurnitureImageKey,
  HOUSING_RUNTIME_IMAGE_KEYS,
} from '../data/housingRuntimeArt';
import { SHOP_RUNTIME_IMAGE_KEYS } from '../data/shopRuntimeArt';
import { t } from '../services/i18n';
import { loadSnapshot, saveSnapshot } from '../services/save';
import type { SaveSnapshot } from '../types';
import { buildDebugState } from '../ui/debugHud';
import { createButton, paintBackdrop } from '../ui/widgets';

const SLOT_ORDER: HousingSlotKey[] = ['left', 'center', 'right'];
const ROOM_SLOT_LAYOUT: Record<
  HousingSlotKey,
  { x: number; y: number; frameX: number; frameY: number; maxWidth: number; maxHeight: number }
> = {
  left: { x: 126, y: 220, frameX: 126, frameY: 224, maxWidth: 54, maxHeight: 76 },
  center: { x: 180, y: 214, frameX: 180, frameY: 218, maxWidth: 72, maxHeight: 84 },
  right: { x: 234, y: 220, frameX: 234, frameY: 224, maxWidth: 54, maxHeight: 76 },
};

export class HousingScene extends Phaser.Scene {
  private snapshot!: SaveSnapshot;
  private selectedSlotIndex = 0;
  private slotBoxes: Phaser.GameObjects.Rectangle[] = [];
  private slotTexts: Phaser.GameObjects.Text[] = [];
  private slotItemTexts: Phaser.GameObjects.Text[] = [];
  private slotPreviewImages: Phaser.GameObjects.Image[] = [];
  private roomPlacementFrames: Phaser.GameObjects.Rectangle[] = [];
  private roomPlacementImages: Record<HousingSlotKey, Phaser.GameObjects.Image> | null = null;
  private selectedNameText!: Phaser.GameObjects.Text;
  private detailText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;

  constructor() {
    super('housing');
  }

  create(): void {
    this.slotBoxes = [];
    this.slotTexts = [];
    this.slotItemTexts = [];
    this.slotPreviewImages = [];
    this.roomPlacementFrames = [];
    this.roomPlacementImages = null;
    this.snapshot = loadSnapshot();
    this.drawLayout();
    this.refreshView('슬롯과 가구를 터치해 배치할 항목을 바꿀 수 있습니다.');
  }

  update(_: number, delta: number): void {
    this.stepSimulation(delta);
  }

  public stepSimulation(_: number): void {
  }

  public renderGameToText(): string {
    return JSON.stringify(
      buildDebugState('housing', this.snapshot, {
        selectedSlot: SLOT_ORDER[this.selectedSlotIndex],
        housingSlots: this.snapshot.housing.slots,
        availableActions: ['cycle_housing_slot', 'back_to_village'],
      }),
    );
  }

  private drawLayout(): void {
    if (this.textures.exists(HOUSING_RUNTIME_IMAGE_KEYS.backdrop)) {
      this.add.image(180, 320, HOUSING_RUNTIME_IMAGE_KEYS.backdrop).setDisplaySize(360, 640).setDepth(-14);
      this.add.rectangle(180, 320, 360, 640, 0x06100b, 0.3).setDepth(-13);
    } else {
      paintBackdrop(this, AtlasFrame.GrassTile, 0x738160);
    }

    this.add.rectangle(180, 320, 360, 640, 0x040807, 0.2).setDepth(-12);
    this.add.rectangle(180, 320, 334, 606, 0x09130d, 0.58).setDepth(-11);

    if (this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.uiMainFrame)) {
      this.add.image(180, 320, SHOP_RUNTIME_IMAGE_KEYS.uiMainFrame).setDisplaySize(322, 606).setDepth(-8);
    } else {
      this.add.rectangle(180, 320, 326, 606, 0x122019, 0.9).setStrokeStyle(2, 0xe0c78b, 0.18).setDepth(-9);
    }
    if (this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.uiHeaderBar)) {
      this.add.image(180, 72, SHOP_RUNTIME_IMAGE_KEYS.uiHeaderBar).setDisplaySize(316, 46).setDepth(-7);
    }

    this.add.rectangle(180, 214, 308, 184, 0x0f1712, 0.88).setStrokeStyle(1, 0xe0c78b, 0.18);
    this.add.rectangle(180, 406, 308, 164, 0x0f1712, 0.88).setStrokeStyle(1, 0xe0c78b, 0.14);
    this.add.rectangle(180, 532, 308, 92, 0x0f1712, 0.86).setStrokeStyle(1, 0xe0c78b, 0.12);

    if (this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.uiSectionBar)) {
      this.add.image(180, 140, SHOP_RUNTIME_IMAGE_KEYS.uiSectionBar).setDisplaySize(296, 24).setAlpha(0.92);
      this.add.image(180, 328, SHOP_RUNTIME_IMAGE_KEYS.uiSectionBar).setDisplaySize(296, 24).setAlpha(0.92);
      this.add.image(180, 488, SHOP_RUNTIME_IMAGE_KEYS.uiSectionBar).setDisplaySize(296, 24).setAlpha(0.92);
    }

    this.add.text(30, 34, '거점 꾸미기', {
      fontFamily: 'Segoe UI',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 3,
    });
    this.add.text(30, 58, '창고, 훈련용품, 조명 배치를 바꿔 거점 분위기를 정리합니다.', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#d4c29f',
      stroke: '#17110c',
      strokeThickness: 2,
    });
    this.add.text(30, 132, '현재 배치', {
      fontFamily: 'Segoe UI',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 3,
    });
    this.add.text(30, 320, '보유 슬롯', {
      fontFamily: 'Segoe UI',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 3,
    });
    this.add.text(30, 480, '선택 정보', {
      fontFamily: 'Segoe UI',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 3,
    });

    this.selectedNameText = this.add.text(32, 154, '', {
      fontFamily: 'Segoe UI',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#f7e8c4',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 284 },
    });

    if (this.textures.exists(HOUSING_RUNTIME_IMAGE_KEYS.roomStage)) {
      this.add.image(180, 220, HOUSING_RUNTIME_IMAGE_KEYS.roomStage).setDisplaySize(240, 128);
    } else {
      this.add.rectangle(180, 220, 236, 126, 0x1a2218, 0.98).setStrokeStyle(2, 0x6f5a42, 0.42);
    }

    this.add.rectangle(180, 220, 230, 122, 0x0f1610, 0.06).setStrokeStyle(0, 0, 0);
    const roomPlacementImages: Partial<Record<HousingSlotKey, Phaser.GameObjects.Image>> = {};
    SLOT_ORDER.forEach((slot) => {
      const layout = ROOM_SLOT_LAYOUT[slot];
      const frame = this.add.rectangle(layout.frameX, layout.frameY, layout.maxWidth + 20, layout.maxHeight + 18, 0xd6bf84, 0.05)
        .setStrokeStyle(2, 0xe0c78b, 0.12);
      this.roomPlacementFrames.push(frame);
      roomPlacementImages[slot] = this.add.image(layout.x, layout.y, ATLAS_KEY, AtlasFrame.HomeIcon).setOrigin(0.5, 1);
    });
    this.roomPlacementImages = roomPlacementImages as Record<HousingSlotKey, Phaser.GameObjects.Image>;

    SLOT_ORDER.forEach((slot, index) => {
      const x = 72 + index * 108;
      const box = this.add.rectangle(x, 404, 92, 120, 0x161f1a, 0.92)
        .setStrokeStyle(2, 0xd7c27c, 0.22)
        .setInteractive({ useHandCursor: true });
      const icon = this.add.image(x, 378, ATLAS_KEY, AtlasFrame.HomeIcon).setOrigin(0.5, 1);
      const slotText = this.add.text(x, 432, '', {
        fontFamily: 'Segoe UI',
        fontSize: '11px',
        fontStyle: 'bold',
        color: '#f7ead0',
        stroke: '#17110c',
        strokeThickness: 2,
        align: 'center',
      }).setOrigin(0.5, 0.5);
      const itemText = this.add.text(x, 458, '', {
        fontFamily: 'Segoe UI',
        fontSize: '9px',
        color: '#d8c298',
        stroke: '#17110c',
        strokeThickness: 2,
        align: 'center',
        wordWrap: { width: 82 },
      }).setOrigin(0.5, 0.5);

      box.on('pointerdown', () => {
        this.selectedSlotIndex = index;
        this.refreshView('선택 슬롯으로 이동했습니다.');
      });

      this.slotBoxes.push(box);
      this.slotPreviewImages.push(icon);
      this.slotTexts.push(slotText);
      this.slotItemTexts.push(itemText);
    });

    this.detailText = this.add.text(34, 506, '', {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#efe1ba',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 284 },
      lineSpacing: 4,
    });
    this.statusText = this.add.text(34, 560, '', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#dcc89d',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 284 },
      lineSpacing: 4,
    });

    createButton(this, 82, 604, {
      width: 100,
      height: 36,
      label: '이전',
      iconFrame: AtlasFrame.MapIcon,
      contentOffsetY: 1,
      onClick: () => this.updateSlot(-1),
    });
    createButton(this, 180, 604, {
      width: 100,
      height: 36,
      label: '다음',
      iconFrame: AtlasFrame.StageNode,
      backgroundFrame: AtlasFrame.GoldButton,
      contentOffsetY: 1,
      onClick: () => this.updateSlot(1),
    });
    createButton(this, 286, 604, {
      width: 100,
      height: 36,
      label: '돌아가기',
      iconFrame: AtlasFrame.HomeIcon,
      contentOffsetY: 1,
      onClick: () => this.scene.start('village'),
    });
  }

  private refreshView(status: string): void {
    SLOT_ORDER.forEach((slot, index) => {
      const furniture = getFurniture(this.snapshot.housing.slots[slot]);
      const selected = index === this.selectedSlotIndex;

      this.slotBoxes[index]
        .setStrokeStyle(2, getSlotAccentColor(slot), selected ? 0.94 : 0.24)
        .setFillStyle(selected ? 0x1c2620 : 0x161f1a, selected ? 0.98 : 0.92);
      this.slotTexts[index].setText(t(this, `ui.slot.${slot}`)).setColor(selected ? '#fff6de' : '#f7ead0');
      this.slotItemTexts[index].setText(furniture.name).setColor(selected ? '#ffe4a9' : '#d8c298');
      this.applyFurniturePreviewArt(this.slotPreviewImages[index], furniture.id, 56, 56);
      this.slotPreviewImages[index].setAlpha(selected ? 1 : 0.94);
      this.roomPlacementFrames[index].setStrokeStyle(2, getSlotAccentColor(slot), selected ? 0.72 : 0.16);
      this.roomPlacementFrames[index].setFillStyle(getSlotAccentColor(slot), selected ? 0.12 : 0.04);
    });

    this.updateRoomPreview();

    const selectedSlot = SLOT_ORDER[this.selectedSlotIndex];
    const selectedFurniture = getFurniture(this.snapshot.housing.slots[selectedSlot]);
    const slotLabel = t(this, `ui.slot.${selectedSlot}`);

    this.selectedNameText.setText(`${slotLabel} 배치: ${selectedFurniture.name}`);
    this.detailText.setText([
      selectedFurniture.flavor,
      '',
      `보유 가구 ${this.snapshot.housing.ownedFurnitureIds.length}종 | ${slotLabel} 슬롯에 들어갈 장식을 바로 미리볼 수 있습니다.`,
    ]);
    this.statusText.setText(status);
  }

  private updateRoomPreview(): void {
    if (!this.roomPlacementImages) {
      return;
    }

    SLOT_ORDER.forEach((slot) => {
      const furniture = getFurniture(this.snapshot.housing.slots[slot]);
      const layout = ROOM_SLOT_LAYOUT[slot];
      const image = this.roomPlacementImages![slot];
      this.applyFurniturePreviewArt(image, furniture.id, layout.maxWidth, layout.maxHeight);
      image.setPosition(layout.x, layout.y);
    });
  }

  private updateSlot(direction: 1 | -1): void {
    const slot = SLOT_ORDER[this.selectedSlotIndex];
    const result = cycleHousingSlot(this.snapshot, slot, direction);

    if (!result.ok) {
      this.refreshView('이 슬롯에 배치할 수 있는 보유 가구가 없습니다.');
      return;
    }

    this.snapshot = result.snapshot;
    saveSnapshot(this.snapshot);
    this.refreshView(`${t(this, `ui.slot.${slot}`)} 슬롯을 ${describeHousingSlot(this.snapshot, slot)}(으)로 변경했습니다.`);
  }

  private applyFurniturePreviewArt(
    image: Phaser.GameObjects.Image,
    furnitureId: string,
    maxWidth: number,
    maxHeight: number,
  ): void {
    const runtimeKey = getHousingFurnitureImageKey(furnitureId);
    if (runtimeKey && this.textures.exists(runtimeKey)) {
      image.setTexture(runtimeKey).clearTint();
      fitImageWithinBox(image, maxWidth, maxHeight);
      return;
    }

    image
      .setTexture(ATLAS_KEY, getHousingFurnitureFallbackFrame(furnitureId))
      .setTint(getHousingFurnitureFallbackTint(furnitureId))
      .setDisplaySize(Math.min(maxWidth, 40), Math.min(maxHeight, 40));
  }
}

function getSlotAccentColor(slot: HousingSlotKey): number {
  switch (slot) {
    case 'left':
      return 0x9a7b56;
    case 'center':
      return 0xb79a60;
    case 'right':
      return 0x6ba17f;
    default:
      return 0xd7c27c;
  }
}

function getHousingFurnitureFallbackFrame(furnitureId: string): number {
  switch (furnitureId) {
    case 'wood_crate':
      return AtlasFrame.BagIcon;
    case 'training_dummy':
      return AtlasFrame.StageNode;
    case 'small_plant':
      return AtlasFrame.Star;
    case 'knight_banner':
      return AtlasFrame.MapIcon;
    case 'hero_sword_rack':
      return AtlasFrame.SwordIcon;
    case 'lumen_lamp':
      return AtlasFrame.HomeIcon;
    default:
      return AtlasFrame.HomeIcon;
  }
}

function getHousingFurnitureFallbackTint(furnitureId: string): number {
  switch (furnitureId) {
    case 'wood_crate':
      return 0xb68a54;
    case 'training_dummy':
      return 0xd6bf7f;
    case 'small_plant':
      return 0x7cc17e;
    case 'knight_banner':
      return 0xcf9f57;
    case 'hero_sword_rack':
      return 0xc7d2dc;
    case 'lumen_lamp':
      return 0xf4d98a;
    default:
      return 0xffffff;
  }
}

function fitImageWithinBox(image: Phaser.GameObjects.Image, maxWidth: number, maxHeight: number): void {
  const width = Math.max(1, image.width);
  const height = Math.max(1, image.height);
  const scale = Math.min(maxWidth / width, maxHeight / height);
  image.setDisplaySize(
    Math.max(1, Math.round(width * scale)),
    Math.max(1, Math.round(height * scale)),
  );
}
