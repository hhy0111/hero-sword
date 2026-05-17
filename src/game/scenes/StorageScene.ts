import Phaser from 'phaser';
import {
  ensureEquipmentState,
  formatEquipmentStats,
  getAvailableArmorCopies,
  getAvailableWeaponCopies,
} from '../core/equipment';
import { getShopOfferById, isConsumableShopOffer, useConsumableItem } from '../core/shop';
import { AtlasFrame, ATLAS_KEY } from '../data/atlas';
import { getArmorDefinition, getWeaponDefinition } from '../data/equipment';
import { getGachaItemImageKey } from '../data/gachaItemRuntimeArt';
import { SCREEN_RUNTIME_IMAGE_KEYS } from '../data/screenRuntimeArt';
import { createArmorVisualRef, createOfferVisualRef, createWeaponVisualRef, getShopThumbnailTextureKey } from '../data/shopArt';
import { getStorageItemImageKey } from '../data/storageItemRuntimeArt';
import { loadSnapshot, saveSnapshot } from '../services/save';
import type { ArmorDefinition, WeaponDefinition } from '../data/equipment';
import type { SaveSnapshot } from '../types';
import { buildDebugState } from '../ui/debugHud';
import { getArmorIconFrame, getRarityBorderColor, getWeaponIconFrame } from '../ui/collectionArt';
import { createButton, paintBackdrop } from '../ui/widgets';

type StorageKind = 'weapon' | 'armor' | 'item';

interface StorageEntry {
  kind: StorageKind;
  id: string;
  name: string;
  count: number;
  availableCount: number;
  rarity: number;
  description: string;
  effectLines: string[];
  iconFrame: number;
  textureKey: string | null;
  usable: boolean;
}

const LIST_VIEW = {
  x: 26,
  y: 84,
  width: 308,
  height: 450,
} as const;
const ROW_HEIGHT = 58;
const SCROLL_DRAG_THRESHOLD = 6;

export class StorageScene extends Phaser.Scene {
  private snapshot!: SaveSnapshot;
  private entries: StorageEntry[] = [];
  private selectedEntryId: string | null = null;
  private listContent!: Phaser.GameObjects.Container;
  private listMaskShape!: Phaser.GameObjects.Graphics;
  private scrollThumb!: Phaser.GameObjects.Rectangle;
  private statusText!: Phaser.GameObjects.Text;
  private detailPopup: Phaser.GameObjects.Container | null = null;
  private scrollOffset = 0;
  private maxScroll = 0;
  private listPointerActive = false;
  private dragStartY = 0;
  private dragStartScroll = 0;
  private pointerDownY = 0;
  private draggingList = false;
  private pressedEntryIndex: number | null = null;

  constructor() {
    super('storage');
  }

  create(): void {
    this.snapshot = ensureEquipmentState(loadSnapshot());
    this.entries = this.buildEntries();
    this.selectedEntryId = this.entries[0]?.id ?? null;
    this.scrollOffset = 0;

    this.drawLayout();
    this.rebuildList();

    this.input.on('pointermove', this.handlePointerMove, this);
    this.input.on('pointerup', this.handlePointerUp, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off('pointermove', this.handlePointerMove, this);
      this.input.off('pointerup', this.handlePointerUp, this);
    });
  }

  public renderGameToText(): string {
    return JSON.stringify(
      buildDebugState('storage', this.snapshot, {
        entryCount: this.entries.length,
        selected: this.selectedEntryId,
        detailOpen: Boolean(this.detailPopup),
        scrollOffset: Math.round(this.scrollOffset),
        availableActions: ['drag_list', 'open_item_detail', 'use_consumable', 'close_storage'],
      }),
    );
  }

  public stepSimulation(_: number): void {
  }

  private drawLayout(): void {
    if (this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.equipmentInventoryPanel)) {
      this.add.image(180, 320, SCREEN_RUNTIME_IMAGE_KEYS.equipmentInventoryPanel).setDisplaySize(360, 640).setDepth(-10);
    } else {
      paintBackdrop(this, AtlasFrame.StoneTile, 0x3c352d);
      this.add.rectangle(180, 320, 360, 640, 0x07090d, 0.52).setDepth(-9);
    }

    this.add.rectangle(180, 320, 326, 596, 0x10141a, 0.78).setStrokeStyle(2, 0xdfc88d, 0.26);
    this.add.text(28, 30, '창고', {
      fontFamily: 'Segoe UI',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 4,
    });
    this.add.text(28, 60, '보유 중인 장비와 소모품', {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      color: '#d9c7a0',
      stroke: '#17110c',
      strokeThickness: 2,
    });

    this.add.rectangle(
      LIST_VIEW.x + LIST_VIEW.width / 2,
      LIST_VIEW.y + LIST_VIEW.height / 2,
      LIST_VIEW.width + 8,
      LIST_VIEW.height + 8,
      0x081018,
      0.62,
    ).setStrokeStyle(1, 0xe3cf93, 0.14);

    this.listMaskShape = this.add.graphics();
    this.listMaskShape.fillStyle(0xffffff, 1);
    this.listMaskShape.fillRect(LIST_VIEW.x, LIST_VIEW.y, LIST_VIEW.width, LIST_VIEW.height);
    this.listMaskShape.setVisible(false);

    this.listContent = this.add.container(0, LIST_VIEW.y).setDepth(2);
    this.listContent.setMask(this.listMaskShape.createGeometryMask());

    this.add.rectangle(338, LIST_VIEW.y + LIST_VIEW.height / 2, 4, LIST_VIEW.height, 0x000000, 0.24);
    this.scrollThumb = this.add.rectangle(338, LIST_VIEW.y + 24, 4, 48, 0xe7d394, 0.74).setDepth(3);

    const touchLayer = this.add.zone(
      LIST_VIEW.x + LIST_VIEW.width / 2,
      LIST_VIEW.y + LIST_VIEW.height / 2,
      LIST_VIEW.width,
      LIST_VIEW.height,
    ).setInteractive({ useHandCursor: true }).setDepth(4);
    touchLayer.on('pointerdown', (pointer: Phaser.Input.Pointer) => this.startListPointer(pointer, this.getEntryIndexFromPointer(pointer)));
    touchLayer.on('pointermove', (pointer: Phaser.Input.Pointer) => this.handlePointerMove(pointer));
    touchLayer.on('pointerup', (pointer: Phaser.Input.Pointer) => this.handlePointerUp(pointer));

    this.statusText = this.add.text(28, 548, '항목을 누르면 상세 정보를 볼 수 있습니다.', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#ffe1a6',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 304 },
    });

    createButton(this, 180, 610, {
      width: 104,
      height: 34,
      label: '닫기',
      iconFrame: AtlasFrame.HomeIcon,
      backgroundFrame: AtlasFrame.GoldButton,
      onClick: () => this.scene.start('village'),
    });
  }

  private rebuildList(): void {
    this.listContent.removeAll(true);
    const contentHeight = this.entries.length * ROW_HEIGHT;
    this.maxScroll = Math.max(0, contentHeight - LIST_VIEW.height);
    this.scrollOffset = Phaser.Math.Clamp(this.scrollOffset, 0, this.maxScroll);

    if (this.entries.length === 0) {
      this.listContent.add(
        this.add.text(LIST_VIEW.x + 18, 24, '보유한 장비나 소모품이 없습니다.', {
          fontFamily: 'Segoe UI',
          fontSize: '13px',
          color: '#e8d8b2',
          stroke: '#17110c',
          strokeThickness: 2,
          wordWrap: { width: LIST_VIEW.width - 36 },
        }),
      );
      this.selectedEntryId = null;
      this.statusText?.setText('상점에서 구입하거나 전투 보상을 얻으면 이곳에 보관됩니다.');
      this.applyScrollOffset(this.scrollOffset);
      return;
    }

    this.entries.forEach((entry, index) => this.createEntryRow(entry, index));
    if (!this.entries.some((entry) => entry.id === this.selectedEntryId)) {
      this.selectedEntryId = this.entries[0]?.id ?? null;
    }
    this.applyScrollOffset(this.scrollOffset);
  }

  private createEntryRow(entry: StorageEntry, index: number): void {
    const rowY = ROW_HEIGHT / 2 + index * ROW_HEIGHT;
    const selected = entry.id === this.selectedEntryId;
    const row = this.add.container(LIST_VIEW.x + LIST_VIEW.width / 2, rowY);
    const background = this.add.rectangle(0, 0, LIST_VIEW.width - 12, 48, selected ? 0x263521 : 0x141b22, selected ? 0.96 : 0.88)
      .setStrokeStyle(1, selected ? 0xf1d38e : 0x6a5c42, selected ? 0.76 : 0.34);
    const rarityStripe = this.add.rectangle(-145, 0, 4, 40, getRarityBorderColor(entry.rarity === 5 ? 5 : entry.rarity === 4 ? 4 : 3), 0.95);
    const iconFrame = this.add.rectangle(-121, 0, 38, 38, 0x071017, 0.9)
      .setStrokeStyle(1, getRarityBorderColor(entry.rarity === 5 ? 5 : entry.rarity === 4 ? 4 : 3), 0.78);
    const icon = this.add.image(-121, 0, ATLAS_KEY, AtlasFrame.BagIcon).setDisplaySize(30, 30);
    this.applyEntryIcon(icon, entry, entry.textureKey ? 34 : 30);
    const title = this.add.text(-96, -12, entry.name, {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      fontStyle: 'bold',
      color: selected ? '#fff8df' : '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 2,
      fixedWidth: 218,
    }).setOrigin(0, 0.5);
    const meta = this.add.text(-96, 10, this.buildEntryMeta(entry), {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#d6c49e',
      stroke: '#17110c',
      strokeThickness: 2,
      fixedWidth: 218,
    }).setOrigin(0, 0.5);
    const chevron = this.add.text(132, 0, '>', {
      fontFamily: 'Segoe UI',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#e6d195',
      stroke: '#17110c',
      strokeThickness: 2,
    }).setOrigin(0.5, 0.5);

    row.add([background, rarityStripe, iconFrame, icon, title, meta, chevron]);
    this.listContent.add(row);
  }

  private getEntryIndexFromPointer(pointer: Phaser.Input.Pointer): number | null {
    const gamePointer = this.getGamePointer(pointer);
    if (
      gamePointer.x < LIST_VIEW.x ||
      gamePointer.x > LIST_VIEW.x + LIST_VIEW.width ||
      gamePointer.y < LIST_VIEW.y ||
      gamePointer.y > LIST_VIEW.y + LIST_VIEW.height
    ) {
      return null;
    }

    const localY = gamePointer.y - LIST_VIEW.y + this.scrollOffset;
    const index = Math.floor(localY / ROW_HEIGHT);
    return index >= 0 && index < this.entries.length ? index : null;
  }

  private startListPointer(pointer: Phaser.Input.Pointer, entryIndex: number | null): void {
    const gamePointer = this.getGamePointer(pointer);
    this.listPointerActive = true;
    this.dragStartY = gamePointer.y;
    this.pointerDownY = gamePointer.y;
    this.dragStartScroll = this.scrollOffset;
    this.draggingList = false;
    this.pressedEntryIndex = entryIndex;
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    if (!this.listPointerActive || !pointer.isDown) {
      return;
    }

    const gamePointer = this.getGamePointer(pointer);
    const deltaY = gamePointer.y - this.dragStartY;
    if (Math.abs(gamePointer.y - this.pointerDownY) > SCROLL_DRAG_THRESHOLD) {
      this.draggingList = true;
    }
    this.applyScrollOffset(this.dragStartScroll - deltaY);
  }

  private handlePointerUp(pointer: Phaser.Input.Pointer): void {
    if (!this.listPointerActive) {
      return;
    }

    const entryIndex = this.pressedEntryIndex;
    const gamePointer = this.getGamePointer(pointer);
    const shouldOpen = entryIndex !== null && !this.draggingList && Math.abs(gamePointer.y - this.pointerDownY) <= SCROLL_DRAG_THRESHOLD;
    this.listPointerActive = false;
    this.pressedEntryIndex = null;
    this.draggingList = false;

    if (shouldOpen) {
      const entry = this.entries[entryIndex];
      if (entry) {
        this.openDetailPopup(entry);
      }
    }
  }

  private applyScrollOffset(value: number): void {
    this.scrollOffset = Phaser.Math.Clamp(value, 0, this.maxScroll);
    this.listContent.y = LIST_VIEW.y - this.scrollOffset;
    this.updateScrollbar();
  }

  private getGamePointer(pointer: Phaser.Input.Pointer): { x: number; y: number } {
    return {
      x: pointer.x,
      y: pointer.y,
    };
  }

  private updateScrollbar(): void {
    if (!this.scrollThumb) {
      return;
    }

    const contentHeight = Math.max(LIST_VIEW.height, this.entries.length * ROW_HEIGHT);
    if (this.maxScroll <= 0 || contentHeight <= LIST_VIEW.height) {
      this.scrollThumb.setVisible(false);
      return;
    }

    const thumbHeight = Math.max(42, LIST_VIEW.height * (LIST_VIEW.height / contentHeight));
    const travel = LIST_VIEW.height - thumbHeight;
    const ratio = this.scrollOffset / this.maxScroll;
    this.scrollThumb
      .setVisible(true)
      .setDisplaySize(4, thumbHeight)
      .setPosition(338, LIST_VIEW.y + thumbHeight / 2 + travel * ratio);
  }

  private openDetailPopup(entry: StorageEntry, statusLine = ''): void {
    this.closeDetailPopup();
    this.selectedEntryId = entry.id;
    this.rebuildList();

    const popup = this.add.container(180, 320).setDepth(1000);
    const overlay = this.add.rectangle(0, 0, 360, 640, 0x000000, 0.58).setInteractive();
    const panel = this.add.rectangle(0, 0, 320, 508, 0x0b1118, 0.96).setStrokeStyle(2, 0xdfc88d, 0.42);
    const topBand = this.add.rectangle(0, -220, 286, 52, 0x141b22, 0.92).setStrokeStyle(1, 0x8f7748, 0.5);
    const title = this.add.text(-136, -232, entry.name, {
      fontFamily: 'Segoe UI',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 3,
      wordWrap: { width: 272 },
    });
    const kind = this.add.text(-136, -204, this.buildEntryMeta(entry), {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#d8c69d',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 272 },
    });

    const iconBacking = this.add.rectangle(-86, -118, 118, 118, 0x111a22, 0.94)
      .setStrokeStyle(2, getRarityBorderColor(entry.rarity === 5 ? 5 : entry.rarity === 4 ? 4 : 3), 0.84);
    const icon = this.add.image(-86, -118, ATLAS_KEY, AtlasFrame.BagIcon);
    this.applyEntryIcon(icon, entry, entry.textureKey ? 104 : 82);
    const itemKind = this.add.text(-142, -44, this.getKindLabel(entry.kind), {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#f0d995',
      stroke: '#17110c',
      strokeThickness: 2,
    });

    const description = this.add.text(-20, -174, entry.description, {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#ead8b0',
      stroke: '#17110c',
      strokeThickness: 2,
      lineSpacing: 3,
      wordWrap: { width: 144 },
    });
    const effectBox = this.add.rectangle(0, 58, 286, 164, 0x071017, 0.68).setStrokeStyle(1, 0xe3cf93, 0.16);
    const effectTitle = this.add.text(-132, -18, '상세 효과', {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 2,
    });
    const effects = this.add.text(-132, 8, this.buildDetailEffectText(entry), {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#ead8b0',
      stroke: '#17110c',
      strokeThickness: 2,
      lineSpacing: 4,
      wordWrap: { width: 264 },
    });
    const status = this.add.text(-132, 152, statusLine || this.buildDetailStatus(entry), {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#ffe1a6',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 264 },
    });

    const closeButton = createButton(this, entry.usable ? -70 : 0, 226, {
      width: 108,
      height: 34,
      label: '닫기',
      iconFrame: AtlasFrame.HomeIcon,
      backgroundFrame: AtlasFrame.GoldButton,
      onClick: () => this.closeDetailPopup(),
    });
    popup.add([overlay, panel, topBand, title, kind, iconBacking, icon, itemKind, description, effectBox, effectTitle, effects, status, closeButton]);

    if (entry.usable) {
      const useButton = createButton(this, 72, 226, {
        width: 118,
        height: 34,
        label: '사용하기',
        iconFrame: AtlasFrame.BagIcon,
        backgroundFrame: AtlasFrame.GoldButton,
        onClick: () => this.useEntryFromPopup(entry.id),
      });
      popup.add(useButton);
    }

    this.detailPopup = popup;
  }

  private closeDetailPopup(): void {
    if (!this.detailPopup) {
      return;
    }
    this.detailPopup.destroy();
    this.detailPopup = null;
    this.statusText.setText('항목을 누르면 상세 정보를 볼 수 있습니다.');
  }

  private useEntryFromPopup(entryId: string): void {
    const result = useConsumableItem(this.snapshot, entryId);
    this.snapshot = result.snapshot;
    if (result.ok) {
      saveSnapshot(this.snapshot);
    }

    this.entries = this.buildEntries();
    const nextEntry = this.entries.find((entry) => entry.id === entryId) ?? null;
    this.rebuildList();

    if (nextEntry) {
      this.openDetailPopup(nextEntry, result.message);
    } else {
      this.closeDetailPopup();
      this.statusText.setText(result.message);
    }
  }

  private buildEntries(): StorageEntry[] {
    const normalized = ensureEquipmentState(this.snapshot);
    this.snapshot = normalized;
    const entries: StorageEntry[] = [];

    for (const [weaponId, count] of Object.entries(normalized.collection.weaponCopies)) {
      if (count <= 0) {
        continue;
      }
      const weapon = safeGetWeapon(weaponId);
      if (!weapon) {
        continue;
      }
      const availableCount = getAvailableWeaponCopies(normalized, weaponId);
      entries.push(this.createWeaponEntry(weapon, count, availableCount));
    }

    for (const [armorId, count] of Object.entries(normalized.collection.armorCopies)) {
      if (count <= 0) {
        continue;
      }
      const armor = safeGetArmor(armorId);
      if (!armor) {
        continue;
      }
      const availableCount = getAvailableArmorCopies(normalized, armorId);
      entries.push(this.createArmorEntry(armor, count, availableCount));
    }

    for (const [itemId, count] of Object.entries(normalized.collection.itemCopies ?? {})) {
      if (count <= 0) {
        continue;
      }
      const offer = getShopOfferById(itemId);
      if (!offer) {
        continue;
      }
      const usable = isConsumableShopOffer(offer) && normalized.profile.fatigue < normalized.profile.maxFatigue;
      const visualRef = offer.visual ?? createOfferVisualRef(offer.id, offer.iconFrame, 0x8e7550);
      entries.push({
        kind: 'item',
        id: offer.id,
        name: offer.name,
        count,
        availableCount: count,
        rarity: offer.currency === 'heroStone' ? 4 : 3,
        description: offer.description,
        effectLines: [offer.effectText],
        iconFrame: offer.iconFrame,
        textureKey: getStorageItemImageKey(offer.id) ?? getShopThumbnailTextureKey(visualRef),
        usable,
      });
    }

    return entries.sort((left, right) => {
      const kindWeight = (kind: StorageKind) => (kind === 'item' ? 0 : kind === 'weapon' ? 1 : 2);
      if (kindWeight(left.kind) !== kindWeight(right.kind)) {
        return kindWeight(left.kind) - kindWeight(right.kind);
      }
      if (right.rarity !== left.rarity) {
        return right.rarity - left.rarity;
      }
      return left.name.localeCompare(right.name);
    });
  }

  private createWeaponEntry(weapon: WeaponDefinition, count: number, availableCount: number): StorageEntry {
    const visualRef = createWeaponVisualRef(weapon.id, weapon.weaponClass, getWeaponIconFrame(weapon.id));
    return {
      kind: 'weapon',
      id: weapon.id,
      name: weapon.name,
      count,
      availableCount,
      rarity: weapon.rarity,
      description: `${this.getWeaponClassLabel(weapon.weaponClass)} 계열 무기입니다.\n출처 ${weapon.source} | 착용 레벨 ${weapon.levelRequirement}`,
      effectLines: formatEquipmentStats(weapon.stats),
      iconFrame: getWeaponIconFrame(weapon.id),
      textureKey: getGachaItemImageKey(weapon.id) ?? getShopThumbnailTextureKey(visualRef),
      usable: false,
    };
  }

  private createArmorEntry(armor: ArmorDefinition, count: number, availableCount: number): StorageEntry {
    const visualRef = createArmorVisualRef(armor.id, armor.armorClass, getArmorIconFrame(armor.id));
    return {
      kind: 'armor',
      id: armor.id,
      name: armor.name,
      count,
      availableCount,
      rarity: armor.rarity,
      description: `${this.getArmorClassLabel(armor.armorClass)} 계열 방어구입니다.\n출처 ${armor.source} | 착용 레벨 ${armor.levelRequirement}`,
      effectLines: formatEquipmentStats(armor.stats),
      iconFrame: getArmorIconFrame(armor.id),
      textureKey: getShopThumbnailTextureKey(visualRef),
      usable: false,
    };
  }

  private applyEntryIcon(icon: Phaser.GameObjects.Image, entry: StorageEntry, size: number): void {
    icon.clearTint();
    if (entry.textureKey && this.textures.exists(entry.textureKey)) {
      icon.setTexture(entry.textureKey).setDisplaySize(size, size);
      return;
    }

    icon
      .setTexture(ATLAS_KEY, entry.iconFrame)
      .setDisplaySize(size, size)
      .setTint(getRarityBorderColor(entry.rarity === 5 ? 5 : entry.rarity === 4 ? 4 : 3));
  }

  private buildEntryMeta(entry: StorageEntry): string {
    return `${this.getKindLabel(entry.kind)} | 보유 ${entry.count} | 사용 가능 ${entry.availableCount}`;
  }

  private buildDetailEffectText(entry: StorageEntry): string {
    if (entry.effectLines.length === 0) {
      return '별도 수치 효과가 없습니다.';
    }
    return entry.effectLines.join('\n');
  }

  private buildDetailStatus(entry: StorageEntry): string {
    if (entry.kind !== 'item') {
      return '장비는 캐릭터 장비 화면에서 착용할 수 있습니다.';
    }
    if (entry.usable) {
      return '소모품은 여기서 바로 사용할 수 있습니다.';
    }
    return '현재는 사용할 필요가 없습니다.';
  }

  private getKindLabel(kind: StorageKind): string {
    switch (kind) {
      case 'weapon':
        return '무기';
      case 'armor':
        return '방어구';
      case 'item':
      default:
        return '소모품';
    }
  }

  private getWeaponClassLabel(weaponClass: WeaponDefinition['weaponClass']): string {
    return weaponClass.replaceAll('_', ' ');
  }

  private getArmorClassLabel(armorClass: ArmorDefinition['armorClass']): string {
    return armorClass.replaceAll('_', ' ');
  }
}

function safeGetWeapon(id: string) {
  try {
    return getWeaponDefinition(id);
  } catch {
    return null;
  }
}

function safeGetArmor(id: string) {
  try {
    return getArmorDefinition(id);
  } catch {
    return null;
  }
}
