import Phaser from 'phaser';
import {
  equipArmor,
  equipWeapon,
  ensureEquipmentState,
  formatEquipmentStats,
  getAvailableArmorCopies,
  getAvailableWeaponCopies,
  getCharacterEquipment,
  getEquipableArmorIds,
  getEquipableWeaponIds,
} from '../core/equipment';
import { calculatePartyPower, computeCharacterPower } from '../core/party';
import { AtlasFrame, ATLAS_KEY } from '../data/atlas';
import { getArmorDefinition, getWeaponDefinition } from '../data/equipment';
import { SCREEN_RUNTIME_IMAGE_KEYS } from '../data/screenRuntimeArt';
import { getShopThumbnailTextureKey, createArmorVisualRef, createWeaponVisualRef } from '../data/shopArt';
import { SHOP_RUNTIME_IMAGE_KEYS } from '../data/shopRuntimeArt';
import { getCharacter, getOwnedCharacterIds } from '../data/characters';
import { t } from '../services/i18n';
import { loadSnapshot, saveSnapshot } from '../services/save';
import type { SaveSnapshot } from '../types';
import { buildDebugState } from '../ui/debugHud';
import { createButton } from '../ui/widgets';
import {
  applyCharacterFacePortrait,
  getArmorIconFrame,
  getCharacterRoleColor,
  getRarityBorderColor,
  getRarityColor,
  getWeaponIconFrame,
} from '../ui/collectionArt';

type EquipmentSlotTab = 'weapon' | 'armor';

interface ItemCardVisual {
  card: Phaser.GameObjects.Rectangle;
  accent: Phaser.GameObjects.Rectangle;
  iconBg: Phaser.GameObjects.Rectangle;
  icon: Phaser.GameObjects.Image;
  nameText: Phaser.GameObjects.Text;
  metaText: Phaser.GameObjects.Text;
}

type DetailItemKind = 'weapon' | 'armor';
interface InventoryEntry {
  kind: DetailItemKind;
  id: string;
  copies: number;
  availableCopies: number;
  canEquip: boolean;
  equipped: boolean;
}
type VisibleGameObject = Phaser.GameObjects.GameObject & {
  setVisible: (visible: boolean) => Phaser.GameObjects.GameObject;
};

export class EquipmentScene extends Phaser.Scene {
  private snapshot!: SaveSnapshot;
  private initialCharacterId: string | null = null;
  private selectedCharacterIndex = 0;
  private selectedTab: EquipmentSlotTab = 'weapon';
  private weaponIndex = 0;
  private armorIndex = 0;
  private animationElapsedMs = 0;
  private headerText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private detailText!: Phaser.GameObjects.Text;
  private portraitGlow!: Phaser.GameObjects.Rectangle;
  private portraitCard!: Phaser.GameObjects.Rectangle;
  private portraitImage!: Phaser.GameObjects.Image;
  private headerStarImages: Phaser.GameObjects.Image[] = [];
  private loadoutWeaponIcon!: Phaser.GameObjects.Image;
  private loadoutWeaponText!: Phaser.GameObjects.Text;
  private loadoutArmorIcon!: Phaser.GameObjects.Image;
  private loadoutArmorText!: Phaser.GameObjects.Text;
  private weaponCards: ItemCardVisual[] = [];
  private armorCards: ItemCardVisual[] = [];
  private detailItemKind: DetailItemKind | null = null;
  private detailItemId: string | null = null;
  private itemDetailObjects: VisibleGameObject[] = [];
  private itemDetailOverlay!: Phaser.GameObjects.Rectangle;
  private itemDetailPanel!: Phaser.GameObjects.Rectangle;
  private itemDetailIcon!: Phaser.GameObjects.Image;
  private itemDetailTitleText!: Phaser.GameObjects.Text;
  private itemDetailBodyText!: Phaser.GameObjects.Text;
  private itemDetailActionButton!: Phaser.GameObjects.Container;
  private itemDetailCloseButton!: Phaser.GameObjects.Container;
  private inventoryOpen = false;
  private inventoryIndex = 0;
  private inventoryWindowStart = 0;
  private inventoryObjects: VisibleGameObject[] = [];
  private inventoryCards: ItemCardVisual[] = [];
  private inventoryOverlay!: Phaser.GameObjects.Rectangle;
  private inventoryPanelArt!: Phaser.GameObjects.Image;
  private inventoryPanel!: Phaser.GameObjects.Rectangle;
  private inventoryTitleText!: Phaser.GameObjects.Text;
  private inventoryStatusText!: Phaser.GameObjects.Text;
  private inventoryCloseButton!: Phaser.GameObjects.Container;

  constructor() {
    super('equipment');
  }

  init(data?: { characterId?: string }): void {
    this.initialCharacterId = data?.characterId ?? null;
  }

  create(): void {
    this.weaponCards = [];
    this.armorCards = [];
    this.headerStarImages = [];
    this.itemDetailObjects = [];
    this.inventoryObjects = [];
    this.inventoryCards = [];
    this.detailItemKind = null;
    this.detailItemId = null;
    this.inventoryOpen = false;
    this.snapshot = ensureEquipmentState(loadSnapshot());
    saveSnapshot(this.snapshot);
    this.applyInitialCharacterSelection();
    this.animationElapsedMs = 0;
    this.drawLayout();
    this.refreshView('\uc7a5\ucc29\ud560 \uc601\uc6c5\uacfc \uc7a5\ube44\ub97c \uc120\ud0dd\ud558\uc138\uc694.');
    void this.ensureEquipmentVisualTexturesLoaded();
  }

  update(_: number, delta: number): void {
    this.stepSimulation(delta);
  }

  public stepSimulation(deltaMs: number): void {
    this.animationElapsedMs += deltaMs;

    if (!this.detailItemId && !this.inventoryOpen) {
      applyCharacterFacePortrait(this, this.portraitImage, this.getSelectedCharacterId(), 78, 98, 0, 1);
    }
  }

  public renderGameToText(): string {
    const characterId = this.getSelectedCharacterId();
    const equipment = getCharacterEquipment(this.snapshot, characterId);

    return JSON.stringify(
      buildDebugState('equipment', this.snapshot, {
        selectedCharacterId: characterId,
        selectedTab: this.selectedTab,
        selectedWeaponId: equipment.loadout.weaponId,
        selectedArmorId: equipment.loadout.armorId,
        inventoryOpen: this.inventoryOpen,
        availableActions: ['cycle_character', 'switch_slot_tab', 'open_inventory', 'equip_item', 'unequip_item', 'back_to_village'],
      }),
    );
  }

  private drawLayout(): void {
    if (this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.equipmentWorkshopBackground)) {
      this.add.image(180, 320, SCREEN_RUNTIME_IMAGE_KEYS.equipmentWorkshopBackground)
        .setDisplaySize(360, 640)
        .setDepth(-12);
      this.add.rectangle(180, 320, 360, 640, 0x02070b, 0.2).setDepth(-8);
    } else {
      this.add.rectangle(180, 320, 360, 640, 0x081019, 1).setDepth(-12);
      this.add.rectangle(180, 320, 338, 616, 0x101a25, 0.92)
        .setStrokeStyle(2, 0xd9b76d, 0.22)
        .setDepth(-11);
      this.add.rectangle(180, 138, 316, 190, 0x142233, 0.42).setDepth(-10);
      this.add.rectangle(180, 420, 316, 350, 0x071018, 0.38).setDepth(-10);
      for (let index = 0; index < 5; index += 1) {
        this.add.rectangle(180, 198 + index * 78, 300, 1, 0xe0c78b, 0.09).setDepth(-9);
      }
      this.add.rectangle(180, 320, 360, 640, 0x071018, 0.42).setDepth(-8);
    }
    if (!this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.equipmentWorkshopBackground) && this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.equipmentFrame)) {
      this.add.image(180, 320, SCREEN_RUNTIME_IMAGE_KEYS.equipmentFrame)
        .setDisplaySize(322, 606)
        .setDepth(-6);
    } else if (!this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.equipmentWorkshopBackground) && this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.uiMainFrame)) {
      this.add.image(180, 320, SHOP_RUNTIME_IMAGE_KEYS.uiMainFrame)
        .setDisplaySize(322, 606)
        .setDepth(-6);
    } else if (!this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.equipmentWorkshopBackground)) {
      this.add.rectangle(180, 320, 326, 606, 0x0c141d, 0.92).setStrokeStyle(2, 0xe0c78b, 0.18).setDepth(-7);
    }
    if (this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.uiHeaderBar)) {
      this.add.image(180, 72, SHOP_RUNTIME_IMAGE_KEYS.uiHeaderBar)
        .setDisplaySize(316, 46)
        .setDepth(-5);
    }

    this.add.rectangle(180, 126, 308, 138, 0x0f1822, 0.9).setStrokeStyle(1, 0xe0c78b, 0.18);
    if (this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.equipmentWeaponPanel)) {
      this.add.image(96, 388, SCREEN_RUNTIME_IMAGE_KEYS.equipmentWeaponPanel).setDisplaySize(146, 208).setAlpha(0.96);
    } else {
      this.add.rectangle(96, 388, 144, 206, 0x0f1822, 0.88).setStrokeStyle(1, 0xe0c78b, 0.16);
    }
    if (this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.equipmentArmorPanel)) {
      this.add.image(264, 388, SCREEN_RUNTIME_IMAGE_KEYS.equipmentArmorPanel).setDisplaySize(146, 208).setAlpha(0.96);
    } else {
      this.add.rectangle(264, 388, 144, 206, 0x0f1822, 0.88).setStrokeStyle(1, 0xe0c78b, 0.16);
    }
    if (this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.equipmentDetailPanel)) {
      this.add.image(180, 528, SCREEN_RUNTIME_IMAGE_KEYS.equipmentDetailPanel).setDisplaySize(308, 108).setAlpha(0.96);
    } else {
      this.add.rectangle(180, 528, 308, 92, 0x0f1822, 0.88).setStrokeStyle(1, 0xe0c78b, 0.14);
    }

    if (this.textures.exists(SHOP_RUNTIME_IMAGE_KEYS.uiSectionBar)) {
      this.add.image(180, 146, SHOP_RUNTIME_IMAGE_KEYS.uiSectionBar).setDisplaySize(296, 24).setAlpha(0.92);
      this.add.image(180, 272, SHOP_RUNTIME_IMAGE_KEYS.uiSectionBar).setDisplaySize(296, 24).setAlpha(0.92);
      this.add.image(180, 468, SHOP_RUNTIME_IMAGE_KEYS.uiSectionBar).setDisplaySize(296, 24).setAlpha(0.92);
    }

    this.add.text(30, 34, '장비 정비실', {
      fontFamily: 'Segoe UI',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 3,
    });
    this.add.text(30, 58, '영웅별 무기와 방어구를 교체해 전투 구성을 정리합니다.', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#d4c29f',
      stroke: '#17110c',
      strokeThickness: 2,
    });
    this.add.text(30, 138, '영웅 정보', {
      fontFamily: 'Segoe UI',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 3,
    });
    this.add.text(30, 264, '장비 목록', {
      fontFamily: 'Segoe UI',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 3,
    });
    this.add.text(30, 460, '선택 정보', {
      fontFamily: 'Segoe UI',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 3,
    });
    this.add.text(30, 286, '무기', {
      fontFamily: 'Segoe UI',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#e7d2a6',
      stroke: '#17110c',
      strokeThickness: 2,
    });
    this.add.text(198, 286, '방어구', {
      fontFamily: 'Segoe UI',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#e7d2a6',
      stroke: '#17110c',
      strokeThickness: 2,
    });

    this.headerText = this.add.text(126, 92, '', {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#efe1ba',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 168 },
      lineSpacing: 3,
    });
    this.headerStarImages = [0, 1, 2, 3, 4].map((index) =>
      this.add.image(196 + index * 12, 96, ATLAS_KEY, AtlasFrame.Star)
        .setDisplaySize(10, 10)
        .setVisible(false),
    );
    this.statusText = this.add.text(34, 494, '', {
      fontFamily: 'Segoe UI',
      fontSize: '9px',
      color: '#dcc89d',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 284 },
      lineSpacing: 1,
    });
    this.detailText = this.add.text(34, 518, '', {
      fontFamily: 'Segoe UI',
      fontSize: '9px',
      color: '#efe1ba',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 284 },
      lineSpacing: 1,
    });

    this.portraitGlow = this.add.rectangle(76, 126, 92, 112, 0xf0c76d, 0.14).setStrokeStyle(0, 0, 0);
    if (this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.equipmentPortraitPanel)) {
      this.add.image(76, 128, SCREEN_RUNTIME_IMAGE_KEYS.equipmentPortraitPanel).setDisplaySize(108, 146).setAlpha(0.96);
      this.portraitCard = this.add.rectangle(76, 126, 88, 108, 0x1c1816, 0.18).setStrokeStyle(2, 0x4c3f31, 0.18);
    } else {
      this.portraitCard = this.add.rectangle(76, 126, 88, 108, 0x1c1816, 0.96).setStrokeStyle(2, 0x4c3f31, 0.42);
    }
    this.portraitImage = this.add.image(76, 126, ATLAS_KEY, AtlasFrame.Hero).setOrigin(0.5, 0.5);

    this.loadoutWeaponIcon = this.add.image(138, 176, ATLAS_KEY, AtlasFrame.SwordIcon).setDisplaySize(24, 24);
    this.loadoutWeaponText = this.add.text(158, 162, '', {
      fontFamily: 'Segoe UI',
      fontSize: '9px',
      color: '#efe1ba',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 150 },
      lineSpacing: 2,
    });
    this.loadoutArmorIcon = this.add.image(138, 214, ATLAS_KEY, AtlasFrame.HomeIcon).setDisplaySize(24, 24);
    this.loadoutArmorText = this.add.text(158, 200, '', {
      fontFamily: 'Segoe UI',
      fontSize: '9px',
      color: '#efe1ba',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 150 },
      lineSpacing: 2,
    });

    createButton(this, 280, 48, {
      width: 40,
      height: 26,
      label: '<',
      contentOffsetY: 1,
      onClick: () => this.changeCharacter(-1),
    });
    createButton(this, 320, 48, {
      width: 40,
      height: 26,
      label: '>',
      contentOffsetY: 1,
      onClick: () => this.changeCharacter(1),
    });

    for (let index = 0; index < 3; index += 1) {
      this.weaponCards.push(this.createItemCard(96, 318 + index * 64, () => {
        this.selectedTab = 'weapon';
        this.weaponIndex = Math.max(0, this.getWeaponWindowStart() + index);
        this.refreshView('\ubb34\uae30 \ubaa9\ub85d\uc744 \uc120\ud0dd\ud588\uc2b5\ub2c8\ub2e4.');
      }, () => this.openCurrentItemDetail()));
      this.armorCards.push(this.createItemCard(264, 318 + index * 64, () => {
        this.selectedTab = 'armor';
        this.armorIndex = Math.max(0, this.getArmorWindowStart() + index);
        this.refreshView('\ubc29\uc5b4\uad6c \ubaa9\ub85d\uc744 \uc120\ud0dd\ud588\uc2b5\ub2c8\ub2e4.');
      }, () => this.openCurrentItemDetail()));
    }

    this.createItemDetailOverlay();
    this.createInventoryOverlay();

    const equipButton = createButton(this, 92, 588, {
      width: 112,
      height: 32,
      label: '\uc7a5\ucc29',
      iconFrame: AtlasFrame.SwordIcon,
      backgroundFrame: AtlasFrame.GoldButton,
      contentOffsetY: 1,
      onClick: () => this.equipCurrentSelection(),
    });
    equipButton.setVisible(false).setPosition(-999, -999);
    const unequipButton = createButton(this, 228, 588, {
      width: 112,
      height: 32,
      label: '\ud574\uc81c',
      iconFrame: AtlasFrame.BagIcon,
      contentOffsetY: 1,
      onClick: () => this.unequipCurrentSelection(),
    });
    unequipButton.setVisible(false).setPosition(-999, -999);
    createButton(this, 62, 588, {
      width: 92,
      height: 32,
      label: '\uc7a5\ube44\ud568',
      iconFrame: AtlasFrame.BagIcon,
      backgroundFrame: AtlasFrame.GoldButton,
      contentOffsetY: 1,
      onClick: () => this.openInventoryOverlay(),
    });
    createButton(this, 180, 588, {
      width: 92,
      height: 32,
      label: '\ud30c\ud2f0',
      iconFrame: AtlasFrame.StageNode,
      contentOffsetY: 1,
      onClick: () => this.scene.start('party'),
    });
    createButton(this, 298, 588, {
      width: 92,
      height: 32,
      label: '돌아가기',
      iconFrame: AtlasFrame.HomeIcon,
      contentOffsetY: 1,
      onClick: () => this.scene.start('village'),
    });
  }

  private createItemCard(x: number, y: number, onFocus: () => void, onOpen = () => {}): ItemCardVisual {
    const card = this.add.rectangle(x, y, 132, 56, 0x141d26, 0.84).setStrokeStyle(1, 0xe0c78b, 0.18);
    const accent = this.add.rectangle(x - 61, y, 6, 44, 0x7b5f42, 0.48);
    const iconBg = this.add.rectangle(x - 36, y, 34, 34, 0x1a2129, 0.96).setStrokeStyle(1, 0xe7d2aa, 0.22);
    const icon = this.add.image(x - 36, y, ATLAS_KEY, AtlasFrame.SwordIcon).setDisplaySize(22, 22);
    const nameText = this.add.text(x - 24, y - 14, '', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#f5ead0',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 86 },
    });
    const metaText = this.add.text(x - 24, y + 2, '', {
      fontFamily: 'Segoe UI',
      fontSize: '8px',
      color: '#d4c29f',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 86 },
    });

    card.setInteractive(new Phaser.Geom.Rectangle(-66, -28, 132, 56), Phaser.Geom.Rectangle.Contains);
    card.on('pointerdown', onFocus);
    card.on('pointerup', onOpen);

    return { card, accent, iconBg, icon, nameText, metaText };
  }

  private createItemDetailOverlay(): void {
    this.itemDetailOverlay = this.add.rectangle(180, 320, 360, 640, 0x030506, 0.68)
      .setDepth(900)
      .setVisible(false)
      .setInteractive();
    this.itemDetailPanel = this.add.rectangle(180, 320, 286, 344, 0x171f28, 0.98)
      .setStrokeStyle(2, 0xe0c78b, 0.46)
      .setDepth(901)
      .setVisible(false);
    this.itemDetailIcon = this.add.image(180, 226, ATLAS_KEY, AtlasFrame.BagIcon)
      .setDepth(902)
      .setVisible(false);
    this.itemDetailTitleText = this.add.text(180, 152, '', {
      fontFamily: 'Segoe UI',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 2,
      align: 'center',
      wordWrap: { width: 236 },
    }).setOrigin(0.5, 0).setDepth(902).setVisible(false);
    this.itemDetailBodyText = this.add.text(58, 284, '', {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#efe1ba',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 244 },
      lineSpacing: 4,
    }).setDepth(902).setVisible(false);
    this.itemDetailActionButton = createButton(this, 118, 470, {
      width: 112,
      height: 34,
      label: '\uc7a5\ucc29',
      iconFrame: AtlasFrame.SwordIcon,
      backgroundFrame: AtlasFrame.GoldButton,
      contentOffsetY: 1,
      onClick: () => this.applyItemDetailAction(),
    }).setDepth(903).setVisible(false);
    this.itemDetailCloseButton = createButton(this, 246, 470, {
      width: 96,
      height: 34,
      label: '\ub2eb\uae30',
      iconFrame: AtlasFrame.HomeIcon,
      contentOffsetY: 1,
      onClick: () => this.closeItemDetail(),
    }).setDepth(903).setVisible(false);

    this.itemDetailObjects = [
      this.itemDetailOverlay,
      this.itemDetailPanel,
      this.itemDetailIcon,
      this.itemDetailTitleText,
      this.itemDetailBodyText,
      this.itemDetailActionButton,
      this.itemDetailCloseButton,
    ];
  }

  private createInventoryOverlay(): void {
    this.inventoryOverlay = this.add.rectangle(180, 320, 360, 640, 0x030506, 0.66)
      .setDepth(800)
      .setVisible(false)
      .setInteractive();
    this.inventoryPanelArt = this.add.image(180, 320, ATLAS_KEY, AtlasFrame.BagIcon)
      .setDepth(801)
      .setVisible(false)
      .setAlpha(0);
    if (this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.equipmentInventoryPanel)) {
      this.inventoryPanelArt
        .setTexture(SCREEN_RUNTIME_IMAGE_KEYS.equipmentInventoryPanel)
        .setDisplaySize(330, 586)
        .setAlpha(0.98);
    }
    this.inventoryPanel = this.add.rectangle(180, 318, 314, 454, 0x111a24, 0.98)
      .setStrokeStyle(2, 0xe0c78b, 0.34)
      .setDepth(801)
      .setVisible(false);
    if (this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.equipmentInventoryPanel)) {
      this.inventoryPanel
        .setFillStyle(0x030506, 0.08)
        .setStrokeStyle(0, 0x000000, 0);
    }
    this.inventoryTitleText = this.add.text(40, 112, '\uc7a5\ube44\ud568', {
      fontFamily: 'Segoe UI',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 3,
      wordWrap: { width: 280 },
    }).setDepth(802).setVisible(false);
    this.inventoryStatusText = this.add.text(40, 444, '', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#dcc89d',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 280 },
      lineSpacing: 3,
    }).setDepth(802).setVisible(false);

    for (let index = 0; index < 4; index += 1) {
      const visual = this.createItemCard(180, 168 + index * 64, () => {
        const entryIndex = this.inventoryWindowStart + index;
        const entries = this.getInventoryEntries();
        if (!entries[entryIndex]) {
          return;
        }
        this.inventoryIndex = entryIndex;
        this.refreshInventoryOverlay();
      }, () => this.openInventoryItemDetail());
      this.setItemCardDepth(visual, 802);
      this.inventoryCards.push(visual);
    }

    this.inventoryCloseButton = createButton(this, 180, 518, {
      width: 116,
      height: 34,
      label: '\ub2eb\uae30',
      iconFrame: AtlasFrame.HomeIcon,
      contentOffsetY: 1,
      onClick: () => this.closeInventoryOverlay(),
    }).setDepth(803).setVisible(false);

    this.inventoryObjects = [
      this.inventoryOverlay,
      this.inventoryPanelArt,
      this.inventoryPanel,
      this.inventoryTitleText,
      this.inventoryStatusText,
      this.inventoryCloseButton,
      ...this.inventoryCards.flatMap((visual) => [
        visual.card,
        visual.accent,
        visual.iconBg,
        visual.icon,
        visual.nameText,
        visual.metaText,
      ]),
    ];
    this.inventoryObjects.forEach((object) => object.setVisible(false));
  }

  private setItemCardDepth(visual: ItemCardVisual, depth: number): void {
    visual.card.setDepth(depth);
    visual.accent.setDepth(depth + 1);
    visual.iconBg.setDepth(depth + 1);
    visual.icon.setDepth(depth + 2);
    visual.nameText.setDepth(depth + 2);
    visual.metaText.setDepth(depth + 2);
  }

  private openInventoryOverlay(): void {
    this.inventoryOpen = true;
    this.inventoryIndex = Phaser.Math.Clamp(this.inventoryIndex, 0, Math.max(0, this.getInventoryEntries().length - 1));
    this.ensureInventoryVisible();
    this.inventoryObjects.forEach((object) => object.setVisible(true));
    this.refreshInventoryOverlay();
  }

  private closeInventoryOverlay(): void {
    this.inventoryOpen = false;
    this.inventoryObjects.forEach((object) => object.setVisible(false));
  }

  private moveInventorySelection(direction: -1 | 1): void {
    const entries = this.getInventoryEntries();
    this.inventoryIndex = Phaser.Math.Clamp(this.inventoryIndex + direction, 0, Math.max(0, entries.length - 1));
    this.ensureInventoryVisible();
    this.refreshInventoryOverlay();
  }

  private ensureInventoryVisible(): void {
    const visibleRows = this.inventoryCards.length;
    const entries = this.getInventoryEntries();
    const maxStart = Math.max(0, entries.length - visibleRows);
    this.inventoryWindowStart = Phaser.Math.Clamp(this.inventoryWindowStart, 0, maxStart);

    if (this.inventoryIndex < this.inventoryWindowStart) {
      this.inventoryWindowStart = this.inventoryIndex;
    }

    if (this.inventoryIndex >= this.inventoryWindowStart + visibleRows) {
      this.inventoryWindowStart = this.inventoryIndex - visibleRows + 1;
    }

    this.inventoryWindowStart = Phaser.Math.Clamp(this.inventoryWindowStart, 0, maxStart);
  }

  private openInventoryItemDetail(): void {
    const entry = this.getInventoryEntries()[this.inventoryIndex];
    if (!entry) {
      this.refreshView('\uc7a5\ube44\ud568\uc5d0 \ud45c\uc2dc\ud560 \uc7a5\ube44\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.');
      return;
    }

    this.detailItemKind = entry.kind;
    this.detailItemId = entry.id;
    this.itemDetailObjects.forEach((object) => object.setVisible(true));
    this.refreshItemDetail();
  }

  private refreshInventoryOverlay(): void {
    if (!this.inventoryOpen) {
      return;
    }

    const entries = this.getInventoryEntries();
    this.inventoryIndex = Phaser.Math.Clamp(this.inventoryIndex, 0, Math.max(0, entries.length - 1));
    this.ensureInventoryVisible();
    const selectedCharacter = getCharacter(this.getSelectedCharacterId());
    this.inventoryTitleText.setText(`장비함 | ${this.localize(selectedCharacter.name)}`);
    this.inventoryStatusText.setText(entries.length > 0
      ? '항목을 누르면 상세 정보를 보고 장착 여부를 선택할 수 있습니다.'
      : '보유한 장비가 없습니다.');

    this.inventoryCards.forEach((visual, rowIndex) => {
      const entry = entries[this.inventoryWindowStart + rowIndex];
      if (!entry) {
        this.setItemCardHidden(visual);
        return;
      }

      const definition = entry.kind === 'weapon' ? getWeaponDefinition(entry.id) : getArmorDefinition(entry.id);
      const focused = this.inventoryWindowStart + rowIndex === this.inventoryIndex;
      visual.card
        .setVisible(true)
        .setFillStyle(focused ? 0x202b36 : 0x141d26, focused ? 0.98 : 0.86)
        .setStrokeStyle(1, getRarityBorderColor(definition.rarity), focused ? 0.76 : 0.24);
      visual.accent
        .setVisible(true)
        .setFillStyle(entry.equipped ? 0x69c983 : entry.canEquip ? getRarityColor(definition.rarity) : 0x6b6f7a, entry.canEquip ? 0.86 : 0.42);
      visual.iconBg.setVisible(true).setStrokeStyle(1, getRarityBorderColor(definition.rarity), focused ? 0.7 : 0.22);
      visual.icon.setVisible(true);
      this.applyEquipmentThumb(visual.icon, entry.kind, entry.id, 24);
      visual.nameText.setVisible(true).setText(this.shortenLabel(this.localize(definition.name), 18)).setColor(focused ? '#fff8e2' : '#f5ead0');
      visual.metaText
        .setVisible(true)
        .setText([
          entry.kind === 'weapon' ? '무기' : '방어구',
          `희귀도 ${definition.rarity}`,
          `보유 ${entry.copies}`,
          entry.equipped ? '장착 중' : entry.canEquip ? '장착 가능' : '장착 불가',
        ].join(' | '))
        .setColor(entry.canEquip ? (focused ? '#ffe6b2' : '#d4c29f') : '#9aa0a8');
    });
  }

  private getInventoryEntries(): InventoryEntry[] {
    const characterId = this.getSelectedCharacterId();
    const equipment = getCharacterEquipment(this.snapshot, characterId);
    const weaponEntries: InventoryEntry[] = Object.entries(this.snapshot.collection.weaponCopies)
      .filter(([, copies]) => copies > 0)
      .map(([id, copies]) => ({
        kind: 'weapon' as const,
        id,
        copies,
        availableCopies: getAvailableWeaponCopies(this.snapshot, id, characterId),
        canEquip: getEquipableWeaponIds(this.snapshot, characterId).includes(id),
        equipped: equipment.loadout.weaponId === id,
      }));
    const armorEntries: InventoryEntry[] = Object.entries(this.snapshot.collection.armorCopies)
      .filter(([, copies]) => copies > 0)
      .map(([id, copies]) => ({
        kind: 'armor' as const,
        id,
        copies,
        availableCopies: getAvailableArmorCopies(this.snapshot, id, characterId),
        canEquip: getEquipableArmorIds(this.snapshot, characterId).includes(id),
        equipped: equipment.loadout.armorId === id,
      }));

    return [...weaponEntries, ...armorEntries].sort((left, right) => {
      const leftDefinition = left.kind === 'weapon' ? getWeaponDefinition(left.id) : getArmorDefinition(left.id);
      const rightDefinition = right.kind === 'weapon' ? getWeaponDefinition(right.id) : getArmorDefinition(right.id);
      if (left.canEquip !== right.canEquip) {
        return left.canEquip ? -1 : 1;
      }
      if (rightDefinition.rarity !== leftDefinition.rarity) {
        return rightDefinition.rarity - leftDefinition.rarity;
      }
      return leftDefinition.name.localeCompare(rightDefinition.name);
    });
  }

  private openCurrentItemDetail(): void {
    const selected = this.getCurrentSelectedItem();
    if (!selected) {
      this.refreshView(this.selectedTab === 'weapon' ? '\uc120\ud0dd\ud560 \ubb34\uae30\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.' : '\uc120\ud0dd\ud560 \ubc29\uc5b4\uad6c\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.');
      return;
    }

    this.detailItemKind = selected.kind;
    this.detailItemId = selected.id;
    this.itemDetailObjects.forEach((object) => object.setVisible(true));
    this.refreshItemDetail();
  }

  private closeItemDetail(): void {
    this.detailItemKind = null;
    this.detailItemId = null;
    this.itemDetailObjects.forEach((object) => object.setVisible(false));
  }

  private refreshItemDetail(): void {
    if (!this.detailItemKind || !this.detailItemId) {
      return;
    }

    const characterId = this.getSelectedCharacterId();
    const equipment = getCharacterEquipment(this.snapshot, characterId);
    const isEquipped = this.detailItemKind === 'weapon'
      ? equipment.loadout.weaponId === this.detailItemId
      : equipment.loadout.armorId === this.detailItemId;
    const isEquipable = this.detailItemKind === 'weapon'
      ? getEquipableWeaponIds(this.snapshot, characterId).includes(this.detailItemId)
      : getEquipableArmorIds(this.snapshot, characterId).includes(this.detailItemId);
    const availableCopies = this.detailItemKind === 'weapon'
      ? getAvailableWeaponCopies(this.snapshot, this.detailItemId, characterId)
      : getAvailableArmorCopies(this.snapshot, this.detailItemId, characterId);
    const definition = this.detailItemKind === 'weapon'
      ? getWeaponDefinition(this.detailItemId)
      : getArmorDefinition(this.detailItemId);
    const classLabel = this.detailItemKind === 'weapon'
      ? getWeaponDefinition(this.detailItemId).weaponClass
      : getArmorDefinition(this.detailItemId).armorClass;
    const kindLabel = this.detailItemKind === 'weapon' ? '\ubb34\uae30' : '\ubc29\uc5b4\uad6c';

    this.itemDetailTitleText.setText(this.localize(definition.name));
    this.applyEquipmentThumb(this.itemDetailIcon, this.detailItemKind, this.detailItemId, 74);
    const stats = this.localizeStatLines(formatEquipmentStats(definition.stats)).slice(0, 5);
    this.itemDetailBodyText.setText([
      `${kindLabel} | Lv.${definition.levelRequirement} | 희귀도 ${definition.rarity}`,
      `${this.getEquipmentLabel(classLabel)} | ${this.getEquipmentLabel(definition.source)}`,
      '',
      ...(stats.length > 0 ? stats : ['\ucd94\uac00 \ubcf4\ub108\uc2a4 \uc5c6\uc74c']),
      '',
      isEquipped
        ? '\ud604\uc7ac \uc7a5\ucc29 \uc911\uc785\ub2c8\ub2e4.'
        : isEquipable && availableCopies > 0
          ? `${this.localize(getCharacter(characterId).name)}\uc5d0\uac8c \uc7a5\ucc29\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.`
          : '\ud604\uc7ac \uc120\ud0dd\ud55c \uc601\uc6c5\uc5d0\uac8c\ub294 \uc7a5\ucc29\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.',
    ].join('\n'));
    this.setButtonLabel(this.itemDetailActionButton, isEquipped ? '\ud574\uc81c' : isEquipable && availableCopies > 0 ? '\uc7a5\ucc29' : '\uc7a5\ucc29 \ubd88\uac00');
  }

  private applyItemDetailAction(): void {
    if (!this.detailItemKind || !this.detailItemId) {
      return;
    }

    const characterId = this.getSelectedCharacterId();
    const equipment = getCharacterEquipment(this.snapshot, characterId);
    const isEquipped = this.detailItemKind === 'weapon'
      ? equipment.loadout.weaponId === this.detailItemId
      : equipment.loadout.armorId === this.detailItemId;
    const result = this.detailItemKind === 'weapon'
      ? equipWeapon(this.snapshot, characterId, isEquipped ? null : this.detailItemId)
      : equipArmor(this.snapshot, characterId, isEquipped ? null : this.detailItemId);

    if (!result.ok) {
      this.itemDetailBodyText.setText('\uc9c0\uae08\uc740 \uc774 \uc7a5\ube44\ub97c \ubcc0\uacbd\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.');
      return;
    }

    this.snapshot = result.snapshot;
    saveSnapshot(this.snapshot);
    this.refreshView(isEquipped ? '\uc7a5\ube44\ub97c \ud574\uc81c\ud588\uc2b5\ub2c8\ub2e4.' : '\uc7a5\ube44\ub97c \uc7a5\ucc29\ud588\uc2b5\ub2c8\ub2e4.');
    this.refreshInventoryOverlay();
    this.refreshItemDetail();
  }

  private getCurrentSelectedItem(): { kind: DetailItemKind; id: string } | null {
    const characterId = this.getSelectedCharacterId();
    if (this.selectedTab === 'weapon') {
      const id = getEquipableWeaponIds(this.snapshot, characterId)[this.weaponIndex];
      return id ? { kind: 'weapon', id } : null;
    }

    const id = getEquipableArmorIds(this.snapshot, characterId)[this.armorIndex];
    return id ? { kind: 'armor', id } : null;
  }

  private getEquipmentLabel(value: string): string {
    const labels: Record<string, string> = {
      starter: '\uae30\ubcf8 \uc9c0\uae09',
      summon: '\uc18c\ud658',
      event: '\uc774\ubca4\ud2b8',
      shop: '\uc0c1\uc810',
      sword: '\ud55c\uc190\uac80',
      shield_sword: '\uac80\ubc29\ud328',
      tome: '\ub9c8\ub3c4\uc11c',
      staff: '\uc9c0\ud321\uc774',
      bow: '\ud65c',
      war_hammer: '\uc804\ud22c \ub9dd\uce58',
      cannon: '\ud3ec',
      rune_hammer: '\ub8ec \ub9dd\uce58',
      spear: '\ucc3d',
      sea_staff: '\ud574\uc591 \uc9c0\ud321\uc774',
      pistol: '\uad8c\ucd1d',
      knight_sword: '\uae30\uc0ac\uac80',
      greatsword: '\ub300\uac80',
      record_book: '\uae30\ub85d\uc11c',
      scimitar: '\uace1\ub3c4',
      relic_staff: '\uc720\uc801 \uc9c0\ud321\uc774',
      lance: '\ub79c\uc2a4',
      holy_blade: '\uc131\uac80',
      hymn_staff: '\ucc2c\uac00 \uc9c0\ud321\uc774',
      daggers: '\ub2e8\uac80',
      plate: '\ud310\uae08\uac11',
      heavy: '\uc911\uac11',
      mobile: '\uae30\ub3d9\uac11',
      light: '\uacbd\uac11',
      robe: '\ub85c\ube0c',
      cleric: '\uc131\uc9c1\uc790 \uc758\ubcf5',
      runic: '\ub8ec \ubc29\uc5b4\uad6c',
    };

    return labels[value] ?? this.localize(value);
  }

  private setButtonLabel(button: Phaser.GameObjects.Container, label: string): void {
    const labelObject = button.list.find((child) => child instanceof Phaser.GameObjects.Text);
    if (labelObject instanceof Phaser.GameObjects.Text) {
      labelObject.setText(label);
    }
  }

  private refreshView(status: string): void {
    const characterId = this.getSelectedCharacterId();
    const character = getCharacter(characterId);
    const equipment = getCharacterEquipment(this.snapshot, characterId);
    const weapons = getEquipableWeaponIds(this.snapshot, characterId);
    const armors = getEquipableArmorIds(this.snapshot, characterId);
    this.weaponIndex = Phaser.Math.Clamp(this.weaponIndex, 0, Math.max(0, weapons.length - 1));
    this.armorIndex = Phaser.Math.Clamp(this.armorIndex, 0, Math.max(0, armors.length - 1));

    this.headerText.setText([
      `${this.localize(character.name)}`,
      `${this.localize(character.title)}`,
      `전투력 ${computeCharacterPower(this.snapshot, characterId)} | 파티 ${calculatePartyPower(this.snapshot)}`,
      `주 역할 ${this.formatRoleLabel(character.role)}`,
    ]);
    this.headerText.setColor('#efe1ba');
    this.headerStarImages.forEach((star, index) => {
      star
        .setVisible(index < character.rarity)
        .setTint(getRarityColor(character.rarity));
    });

    this.portraitGlow.setFillStyle(getCharacterRoleColor(character.role), 0.16);
    this.portraitCard.setStrokeStyle(2, getRarityBorderColor(character.rarity), 0.82);
    applyCharacterFacePortrait(this, this.portraitImage, characterId, 82, 98, 0, 1);

    if (equipment.weapon) {
      this.applyEquipmentThumb(this.loadoutWeaponIcon, 'weapon', equipment.weapon.id, 24);
      this.loadoutWeaponText.setText(`무기  ${this.shortenLabel(this.localize(equipment.weapon.name), 18)}\nLv.${equipment.weapon.levelRequirement} | 희귀도 ${equipment.weapon.rarity}`);
    } else {
      this.loadoutWeaponIcon.setFrame(AtlasFrame.BagIcon);
      this.loadoutWeaponText.setText('무기  비어 있음');
    }

    if (equipment.armor) {
      this.applyEquipmentThumb(this.loadoutArmorIcon, 'armor', equipment.armor.id, 24);
      this.loadoutArmorText.setText(`방어구  ${this.shortenLabel(this.localize(equipment.armor.name), 18)}\nLv.${equipment.armor.levelRequirement} | 희귀도 ${equipment.armor.rarity}`);
    } else {
      this.loadoutArmorIcon.setFrame(AtlasFrame.BagIcon);
      this.loadoutArmorText.setText('방어구  비어 있음');
    }

    const weaponStart = this.getWeaponWindowStart();
    this.weaponCards.forEach((visual, rowIndex) => {
      const itemId = weapons[weaponStart + rowIndex];
      if (!itemId) {
        this.setItemCardHidden(visual);
        return;
      }

      const weapon = getWeaponDefinition(itemId);
      const availableCopies = getAvailableWeaponCopies(this.snapshot, itemId, characterId);
      const isFocused = this.selectedTab === 'weapon' && weaponStart + rowIndex === this.weaponIndex;
      const isEquipped = equipment.loadout.weaponId === itemId;
      visual.card.setVisible(true).setFillStyle(isFocused ? 0x1a2430 : 0x141d26, isFocused ? 0.96 : 0.84).setStrokeStyle(1, getRarityBorderColor(weapon.rarity), isFocused ? 0.74 : 0.18);
      visual.accent.setVisible(true).setFillStyle(getRarityColor(weapon.rarity), isEquipped ? 0.98 : 0.58);
      visual.iconBg.setVisible(true).setStrokeStyle(1, getRarityBorderColor(weapon.rarity), isFocused ? 0.74 : 0.22);
      visual.icon.setVisible(true);
      this.applyEquipmentThumb(visual.icon, 'weapon', itemId, 24);
      visual.nameText.setVisible(true).setText(this.localize(weapon.name)).setColor(isFocused ? '#fff8e2' : '#f5ead0');
      visual.metaText
        .setVisible(true)
        .setText(`희귀도 ${weapon.rarity} | ${isEquipped ? '장착 중' : availableCopies > 0 ? '장착 가능' : '보유 없음'}`)
        .setColor(isFocused ? '#ffe6b2' : '#d4c29f');
    });

    const armorStart = this.getArmorWindowStart();
    this.armorCards.forEach((visual, rowIndex) => {
      const itemId = armors[armorStart + rowIndex];
      if (!itemId) {
        this.setItemCardHidden(visual);
        return;
      }

      const armor = getArmorDefinition(itemId);
      const availableCopies = getAvailableArmorCopies(this.snapshot, itemId, characterId);
      const isFocused = this.selectedTab === 'armor' && armorStart + rowIndex === this.armorIndex;
      const isEquipped = equipment.loadout.armorId === itemId;
      visual.card.setVisible(true).setFillStyle(isFocused ? 0x1a2430 : 0x141d26, isFocused ? 0.96 : 0.84).setStrokeStyle(1, getRarityBorderColor(armor.rarity), isFocused ? 0.74 : 0.18);
      visual.accent.setVisible(true).setFillStyle(getRarityColor(armor.rarity), isEquipped ? 0.98 : 0.58);
      visual.iconBg.setVisible(true).setStrokeStyle(1, getRarityBorderColor(armor.rarity), isFocused ? 0.74 : 0.22);
      visual.icon.setVisible(true);
      this.applyEquipmentThumb(visual.icon, 'armor', itemId, 24);
      visual.nameText.setVisible(true).setText(this.localize(armor.name)).setColor(isFocused ? '#fff8e2' : '#f5ead0');
      visual.metaText
        .setVisible(true)
        .setText(`희귀도 ${armor.rarity} | ${isEquipped ? '장착 중' : availableCopies > 0 ? '장착 가능' : '보유 없음'}`)
        .setColor(isFocused ? '#ffe6b2' : '#d4c29f');
    });

    const statLines = this.localizeStatLines(formatEquipmentStats(equipment.stats).slice(0, 2));
    this.statusText.setText(status);
    this.detailText.setText([
      `${this.selectedTab === 'weapon' ? '\ubb34\uae30' : '\ubc29\uc5b4\uad6c'} \ud0ed | \ubb34\uae30 ${weapons.length} / \ubc29\uc5b4\uad6c ${armors.length} | \uc804\ud22c\ub825 +${equipment.powerBonus}`,
      ...(statLines.length > 0 ? statLines : ['\ucd94\uac00 \ubcf4\ub108\uc2a4 \uc5c6\uc74c']),
    ]);
  }

  private applyInitialCharacterSelection(): void {
    const ownedCharacterIds = getOwnedCharacterIds(this.snapshot);
    if (this.initialCharacterId) {
      const index = ownedCharacterIds.indexOf(this.initialCharacterId);
      this.selectedCharacterIndex = index >= 0 ? index : 0;
      return;
    }

    this.selectedCharacterIndex = Phaser.Math.Clamp(this.selectedCharacterIndex, 0, Math.max(0, ownedCharacterIds.length - 1));
  }

  private setItemCardHidden(visual: ItemCardVisual): void {
    visual.card.setVisible(false);
    visual.accent.setVisible(false);
    visual.iconBg.setVisible(false);
    visual.icon.setVisible(false);
    visual.nameText.setVisible(false);
    visual.metaText.setVisible(false);
  }

  private applyEquipmentThumb(
    image: Phaser.GameObjects.Image,
    kind: 'weapon' | 'armor',
    itemId: string,
    size: number,
  ): void {
    const visual =
      kind === 'weapon'
        ? createWeaponVisualRef(itemId, getWeaponDefinition(itemId).weaponClass, getWeaponIconFrame(itemId))
        : createArmorVisualRef(itemId, getArmorDefinition(itemId).armorClass, getArmorIconFrame(itemId));
    const textureKey = getShopThumbnailTextureKey(visual);
    if (this.textures.exists(textureKey)) {
      image.setTexture(textureKey).clearTint();
    } else if (kind === 'weapon') {
      image.setTexture(ATLAS_KEY, getWeaponIconFrame(itemId)).clearTint();
    } else {
      image.setTexture(ATLAS_KEY, getArmorIconFrame(itemId)).clearTint();
    }
    fitImageWithinSquare(image, size);
  }

  private getSelectedCharacterId(): string {
    const ownedCharacterIds = getOwnedCharacterIds(this.snapshot);
    this.selectedCharacterIndex = Phaser.Math.Wrap(this.selectedCharacterIndex, 0, ownedCharacterIds.length);
    return ownedCharacterIds[this.selectedCharacterIndex] ?? 'hero';
  }

  private changeCharacter(direction: -1 | 1): void {
    const ownedCharacterIds = getOwnedCharacterIds(this.snapshot);
    this.selectedCharacterIndex = Phaser.Math.Wrap(this.selectedCharacterIndex + direction, 0, ownedCharacterIds.length);
    this.weaponIndex = 0;
    this.armorIndex = 0;
    this.refreshView(`${this.localize(getCharacter(this.getSelectedCharacterId()).name)}\uc744(\ub97c) \uc120\ud0dd\ud588\uc2b5\ub2c8\ub2e4.`);
  }

  private moveSelection(direction: -1 | 1): void {
    if (this.selectedTab === 'weapon') {
      const weaponIds = getEquipableWeaponIds(this.snapshot, this.getSelectedCharacterId());
      this.weaponIndex = Phaser.Math.Clamp(this.weaponIndex + direction, 0, Math.max(0, weaponIds.length - 1));
    } else {
      const armorIds = getEquipableArmorIds(this.snapshot, this.getSelectedCharacterId());
      this.armorIndex = Phaser.Math.Clamp(this.armorIndex + direction, 0, Math.max(0, armorIds.length - 1));
    }

    this.refreshView(this.selectedTab === 'weapon' ? '\ubb34\uae30 \ud56d\ubaa9\uc744 \uc774\ub3d9\ud588\uc2b5\ub2c8\ub2e4.' : '\ubc29\uc5b4\uad6c \ud56d\ubaa9\uc744 \uc774\ub3d9\ud588\uc2b5\ub2c8\ub2e4.');
  }

  private equipCurrentSelection(): void {
    const characterId = this.getSelectedCharacterId();

    if (this.selectedTab === 'weapon') {
      const weaponIds = getEquipableWeaponIds(this.snapshot, characterId);
      const weaponId = weaponIds[this.weaponIndex];
      if (!weaponId) {
        this.refreshView('\uc7a5\ucc29\ud560 \ubb34\uae30\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.');
        return;
      }

      const result = equipWeapon(this.snapshot, characterId, weaponId);
      if (!result.ok) {
        this.refreshView(result.reason === 'no_copy' ? '\uc5ec\uc720 \ubb34\uae30\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.' : '\ud574\ub2f9 \ubb34\uae30\ub97c \uc7a5\ucc29\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.');
        return;
      }

      this.snapshot = result.snapshot;
      saveSnapshot(this.snapshot);
      this.refreshView(`${this.localize(getCharacter(characterId).name)}\uc774(\uac00) ${this.localize(getWeaponDefinition(weaponId).name)}\uc744(\ub97c) \uc7a5\ucc29\ud588\uc2b5\ub2c8\ub2e4.`);
      return;
    }

    const armorIds = getEquipableArmorIds(this.snapshot, characterId);
    const armorId = armorIds[this.armorIndex];
    if (!armorId) {
      this.refreshView('\uc7a5\ucc29\ud560 \ubc29\uc5b4\uad6c\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.');
      return;
    }

    const result = equipArmor(this.snapshot, characterId, armorId);
    if (!result.ok) {
      this.refreshView(result.reason === 'no_copy' ? '\uc5ec\uc720 \ubc29\uc5b4\uad6c\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.' : '\ud574\ub2f9 \ubc29\uc5b4\uad6c\ub97c \uc7a5\ucc29\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.');
      return;
    }

    this.snapshot = result.snapshot;
    saveSnapshot(this.snapshot);
    this.refreshView(`${this.localize(getCharacter(characterId).name)}\uc774(\uac00) ${this.localize(getArmorDefinition(armorId).name)}\uc744(\ub97c) \uc7a5\ucc29\ud588\uc2b5\ub2c8\ub2e4.`);
  }

  private unequipCurrentSelection(): void {
    const characterId = this.getSelectedCharacterId();
    const result =
      this.selectedTab === 'weapon'
        ? equipWeapon(this.snapshot, characterId, null)
        : equipArmor(this.snapshot, characterId, null);

    if (!result.ok) {
      this.refreshView('\ud574\ub2f9 \uc2ac\ub86f\uc744 \ube44\uc6b8 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.');
      return;
    }

    this.snapshot = result.snapshot;
    saveSnapshot(this.snapshot);
    this.refreshView(`${this.localize(getCharacter(characterId).name)}\uc774(\uac00) ${this.selectedTab === 'weapon' ? '\ubb34\uae30' : '\ubc29\uc5b4\uad6c'} \uc7a5\ucc29\uc744 \ud574\uc81c\ud588\uc2b5\ub2c8\ub2e4.`);
  }

  private getWeaponWindowStart(): number {
    return Math.max(0, Math.min(this.weaponIndex - 1, Math.max(0, getEquipableWeaponIds(this.snapshot, this.getSelectedCharacterId()).length - this.weaponCards.length)));
  }

  private getArmorWindowStart(): number {
    return Math.max(0, Math.min(this.armorIndex - 1, Math.max(0, getEquipableArmorIds(this.snapshot, this.getSelectedCharacterId()).length - this.armorCards.length)));
  }

  private async ensureEquipmentVisualTexturesLoaded(): Promise<void> {
    const missingAssets = new Map<string, string>();
    const collectThumb = (kind: 'weapon' | 'armor', itemId: string) => {
      const visual =
        kind === 'weapon'
          ? createWeaponVisualRef(itemId, getWeaponDefinition(itemId).weaponClass, getWeaponIconFrame(itemId))
          : createArmorVisualRef(itemId, getArmorDefinition(itemId).armorClass, getArmorIconFrame(itemId));
      const textureKey = getShopThumbnailTextureKey(visual);
      if (!this.textures.exists(textureKey)) {
        missingAssets.set(textureKey, `assets/world/town/shop-refresh/items/${visual.thumbnailId}.png`);
      }
    };

    getOwnedCharacterIds(this.snapshot).forEach((characterId) => {
      getEquipableWeaponIds(this.snapshot, characterId).forEach((itemId) => collectThumb('weapon', itemId));
      getEquipableArmorIds(this.snapshot, characterId).forEach((itemId) => collectThumb('armor', itemId));
    });

    if (missingAssets.size === 0) {
      return;
    }

    await Promise.all(
      [...missingAssets.entries()].map(([key, assetPath]) => loadExternalTexture(this, key, assetPath)),
    );

    this.refreshView(this.statusText.text);
  }

  private formatRoleLabel(role: ReturnType<typeof getCharacter>['role']): string {
    switch (role) {
      case 'leader':
        return '리더';
      case 'guardian':
        return '가디언';
      case 'mage':
        return '마도사';
      case 'healer':
        return '치유사';
      case 'ranger':
        return '레인저';
      case 'support':
        return '지원';
      case 'warrior':
        return '전사';
      case 'assassin':
        return '암살자';
      default:
        return role;
    }
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

  private shortenLabel(value: string, maxLength: number): string {
    if (value.length <= maxLength) {
      return value;
    }

    return `${value.slice(0, Math.max(1, maxLength - 3)).trimEnd()}...`;
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
        scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
      resolve();
    };
    image.onerror = () => resolve();
    image.src = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  });
}
