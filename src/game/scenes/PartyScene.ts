import Phaser from 'phaser';
import { getCharacterEquipment } from '../core/equipment';
import { assignPartyMember, calculatePartyPower, computeCharacterPower, ensureValidParty, getPartyCandidateIds, getPartySummary, getRolePreset, removePartyMember } from '../core/party';
import { AtlasFrame, ATLAS_KEY } from '../data/atlas';
import { getCharacter, getCharacterTranscendence } from '../data/characters';
import { SCREEN_RUNTIME_IMAGE_KEYS } from '../data/screenRuntimeArt';
import { t } from '../services/i18n';
import { loadSnapshot, saveSnapshot } from '../services/save';
import type { SaveSnapshot } from '../types';
import { buildDebugState } from '../ui/debugHud';
import { createButton } from '../ui/widgets';
import {
  applyCharacterFacePortrait,
  getCharacterRoleColor,
  getRarityBorderColor,
  getRarityColor,
} from '../ui/collectionArt';

interface PartySlotVisual {
  card: Phaser.GameObjects.Rectangle;
  glow: Phaser.GameObjects.Rectangle;
  portrait: Phaser.GameObjects.Image;
  nameText: Phaser.GameObjects.Text;
  metaText: Phaser.GameObjects.Text;
}

interface CandidateVisual {
  card: Phaser.GameObjects.Rectangle;
  accent: Phaser.GameObjects.Rectangle;
  portrait: Phaser.GameObjects.Image;
  stars: Phaser.GameObjects.Image[];
  nameText: Phaser.GameObjects.Text;
  metaText: Phaser.GameObjects.Text;
}

type DetailMode = 'party' | 'roster';

type VisibleGameObject = Phaser.GameObjects.GameObject & {
  setVisible: (visible: boolean) => Phaser.GameObjects.GameObject;
};

const ROSTER_BOUNDS = new Phaser.Geom.Rectangle(24, 304, 312, 226);
const ROSTER_SCROLL_TRACK_TOP = 320;
const ROSTER_SCROLL_TRACK_HEIGHT = 212;
const ROSTER_ROW_HEIGHT = 76;

export class PartyScene extends Phaser.Scene {
  private snapshot!: SaveSnapshot;
  private selectedSlot = 0;
  private candidateIndex = 0;
  private candidateWindowStart = 0;
  private animationElapsedMs = 0;
  private slotVisuals: PartySlotVisual[] = [];
  private candidateVisuals: CandidateVisual[] = [];
  private headerText!: Phaser.GameObjects.Text;
  private focusedNameText!: Phaser.GameObjects.Text;
  private focusedMetaText!: Phaser.GameObjects.Text;
  private focusedPortraitGlow!: Phaser.GameObjects.Rectangle;
  private focusedPortraitCard!: Phaser.GameObjects.Rectangle;
  private focusedPortraitImage!: Phaser.GameObjects.Image;
  private statusText!: Phaser.GameObjects.Text;
  private rosterScrollTrack!: Phaser.GameObjects.Rectangle;
  private rosterScrollThumb!: Phaser.GameObjects.Rectangle;
  private detailCandidateId: string | null = null;
  private detailMode: DetailMode | null = null;
  private detailObjects: VisibleGameObject[] = [];
  private detailOverlay!: Phaser.GameObjects.Rectangle;
  private detailFrame!: Phaser.GameObjects.Container;
  private detailPortraitCard!: Phaser.GameObjects.Rectangle;
  private detailPortraitImage!: Phaser.GameObjects.Image;
  private detailNameText!: Phaser.GameObjects.Text;
  private detailStarImages: Phaser.GameObjects.Image[] = [];
  private detailMetaText!: Phaser.GameObjects.Text;
  private detailBodyText!: Phaser.GameObjects.Text;
  private detailStatusText!: Phaser.GameObjects.Text;
  private detailAssignButton!: Phaser.GameObjects.Container;
  private detailCloseButton!: Phaser.GameObjects.Container;
  private rosterDragPointerId: number | null = null;
  private rosterDragStartY = 0;
  private rosterDragStartWindowStart = 0;
  private rosterThumbDragging = false;
  private rosterDragMoved = false;

  constructor() {
    super('party');
  }

  create(): void {
    this.slotVisuals = [];
    this.candidateVisuals = [];
    this.detailStarImages = [];
    this.candidateWindowStart = 0;
    this.snapshot = ensureValidParty(loadSnapshot());
    saveSnapshot(this.snapshot);
    this.animationElapsedMs = 0;
    this.drawLayout();
    this.bindRosterScrollInput();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.unbindRosterScrollInput());
    this.events.once(Phaser.Scenes.Events.DESTROY, () => this.unbindRosterScrollInput());
    this.refreshView('\ubc30\uce58\ud560 \uc2ac\ub86f\uacfc \ub3d9\ub8cc\ub97c \uc120\ud0dd\ud558\uc138\uc694.');
  }

  update(_: number, delta: number): void {
    this.stepSimulation(delta);
  }

  public stepSimulation(deltaMs: number): void {
    this.animationElapsedMs += deltaMs;
    this.refreshAnimatedPortraits();
  }

  public renderGameToText(): string {
    const party = getPartySummary(this.snapshot);
    const candidates = this.getRosterCandidateIds();
    const candidateId = candidates[this.candidateIndex] ?? null;

    return JSON.stringify(
      buildDebugState('party', this.snapshot, {
        selectedSlot: this.selectedSlot,
        selectedCandidateId: candidateId,
        candidateDetailOpen: this.detailCandidateId !== null,
        candidateDetailMode: this.detailMode,
        party: party.map((member) => ({ id: member.id, name: member.name, power: member.power })),
        partyPower: calculatePartyPower(this.snapshot),
        availableActions: ['change_party_slot', 'open_candidate_detail', 'assign_party_member', 'back_to_village'],
      }),
    );
  }

  private drawLayout(): void {
    if (this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.partyBackground)) {
      this.add.image(180, 320, SCREEN_RUNTIME_IMAGE_KEYS.partyBackground)
        .setDisplaySize(360, 640)
        .setDepth(-12);
      this.add.rectangle(180, 320, 360, 640, 0x050709, 0.16).setDepth(-10);
    } else {
      this.add.rectangle(180, 320, 360, 640, 0x071017, 1).setDepth(-12);
      this.add.rectangle(180, 320, 334, 612, 0x101a23, 0.96).setStrokeStyle(2, 0xd9b76d, 0.22).setDepth(-11);
      this.add.rectangle(180, 320, 360, 640, 0x050709, 0.3).setDepth(-10);

      this.add.rectangle(180, 96, 332, 140, 0x111b25, 0.9).setStrokeStyle(1, 0xe0c78b, 0.24);
      this.add.rectangle(180, 240, 332, 116, 0x111b25, 0.86).setStrokeStyle(1, 0xe0c78b, 0.2);
      this.add.rectangle(180, 424, 332, 246, 0x0e1720, 0.9).setStrokeStyle(1, 0xe0c78b, 0.2);
      this.add.rectangle(180, 586, 332, 82, 0x111b25, 0.86).setStrokeStyle(1, 0xe0c78b, 0.18);
    }

    this.add.text(30, 30, '\ud30c\ud2f0', {
      fontFamily: 'Segoe UI',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#2a1b10',
      strokeThickness: 3,
    });
    this.add.text(30, 174, '\ud604\uc7ac \ud30c\ud2f0', {
      fontFamily: 'Segoe UI',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#2a1b10',
      strokeThickness: 3,
    });
    this.add.text(30, 294, '\ub85c\uc2a4\ud130', {
      fontFamily: 'Segoe UI',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#2a1b10',
      strokeThickness: 3,
    });

    this.focusedPortraitGlow = this.add.rectangle(70, 98, 96, 110, 0xf0c76d, 0.12).setStrokeStyle(0, 0, 0);
    this.focusedPortraitCard = this.add.rectangle(70, 98, 88, 102, 0x211710, 0.28).setStrokeStyle(2, 0x4f4134, 0.36);
    this.focusedPortraitImage = this.add.image(70, 100, '', 0).setVisible(false);

    this.headerText = this.add.text(126, 52, '', {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#efe1ba',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 202 },
      lineSpacing: 2,
    });
    this.focusedNameText = this.add.text(126, 84, '', {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 202 },
    });
    this.focusedMetaText = this.add.text(126, 104, '', {
      fontFamily: 'Segoe UI',
      fontSize: '9px',
      color: '#d4c29f',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 202 },
      lineSpacing: 1,
    });
    this.statusText = this.add.text(24, 558, '', {
      fontFamily: 'Segoe UI',
      fontSize: '9px',
      color: '#dcc89d',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 312 },
      lineSpacing: 1,
    });

    for (let index = 0; index < 4; index += 1) {
      const x = 52 + index * 85;
      const glow = this.add.rectangle(x, 240, 78, 90, 0xf7e7aa, 0).setStrokeStyle(0, 0, 0);
      const card = this.add.rectangle(x, 240, 74, 86, 0x241b16, 0.28).setStrokeStyle(2, 0x4f4134, 0.35);
      const portrait = this.add.image(x, 224, '', 0).setVisible(false);
      const nameText = this.add.text(x, 250, '', {
        fontFamily: 'Segoe UI',
        fontSize: '10px',
        color: '#f7efd6',
        align: 'center',
        wordWrap: { width: 66 },
      }).setOrigin(0.5, 0);
      const metaText = this.add.text(x, 268, '', {
        fontFamily: 'Segoe UI',
        fontSize: '8px',
        color: '#d3c7b3',
        align: 'center',
        wordWrap: { width: 66 },
      }).setOrigin(0.5, 0);

      card.setInteractive({ useHandCursor: true });
      card.on('pointerdown', () => {
        this.selectedSlot = index;
        this.refreshView('\ud30c\ud2f0 \uc2ac\ub86f\uc744 \uc120\ud0dd\ud588\uc2b5\ub2c8\ub2e4.');
      });
      card.on('pointerup', () => this.openPartyMemberDetail(index));

      this.slotVisuals.push({ card, glow, portrait, nameText, metaText });
    }

    for (let index = 0; index < 3; index += 1) {
      const y = 340 + index * 76;
      const card = this.add.rectangle(180, y, 304, 70, 0x19130f, 0.22).setStrokeStyle(2, 0x4c3f31, 0.18);
      const accent = this.add.rectangle(40, y, 12, 70, 0x7b5f42, 0.55);
      const portrait = this.add.image(74, y, '', 0).setVisible(false);
      const stars = [0, 1, 2, 3, 4].map((starIndex) =>
        this.add.image(158 + starIndex * 12, y - 12, ATLAS_KEY, AtlasFrame.Star).setDisplaySize(10, 10).setVisible(false),
      );
      const nameText = this.add.text(118, y - 18, '', {
        fontFamily: 'Segoe UI',
        fontSize: '11px',
        color: '#2f241a',
        wordWrap: { width: 86 },
      });
      const metaText = this.add.text(118, y + 2, '', {
        fontFamily: 'Segoe UI',
        fontSize: '9px',
        color: '#6b5642',
        wordWrap: { width: 176 },
      });

      card.setInteractive({ useHandCursor: true });
      card.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        const startIndex = this.getCandidateWindowStart();
        this.candidateIndex = Math.min(this.getRosterCandidateIds().length - 1, startIndex + index);
        this.beginRosterDrag(pointer, false);
        this.refreshView('\ub85c\uc2a4\ud130 \ud56d\ubaa9\uc744 \uc120\ud0dd\ud588\uc2b5\ub2c8\ub2e4.');
      });
      card.on('pointerup', () => {
        if (!this.rosterDragMoved) {
          this.openCandidateDetail();
        }
      });

      this.candidateVisuals.push({ card, accent, portrait, stars, nameText, metaText });
    }

    this.rosterScrollTrack = this.add.rectangle(330, 424, 10, ROSTER_SCROLL_TRACK_HEIGHT, 0x4f4134, 0.28)
      .setStrokeStyle(1, 0xe0c78b, 0.36)
      .setVisible(false);
    this.rosterScrollThumb = this.add.rectangle(330, ROSTER_SCROLL_TRACK_TOP + 24, 10, 48, 0xc99949, 0.92)
      .setStrokeStyle(1, 0xffe2a0, 0.58)
      .setVisible(false);
    this.rosterScrollTrack.setInteractive(
      new Phaser.Geom.Rectangle(-16, -ROSTER_SCROLL_TRACK_HEIGHT / 2, 32, ROSTER_SCROLL_TRACK_HEIGHT),
      Phaser.Geom.Rectangle.Contains,
    );
    this.rosterScrollTrack.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.jumpRosterScroll(pointer.y);
      this.beginRosterDrag(pointer, true);
    });
    this.rosterScrollThumb.setInteractive(
      new Phaser.Geom.Rectangle(-16, -36, 32, 72),
      Phaser.Geom.Rectangle.Contains,
    );
    this.rosterScrollThumb.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.beginRosterDrag(pointer, true);
    });

    this.createCandidateDetailOverlay();

    createButton(this, 106, 606, {
      width: 126,
      height: 36,
      label: '장비',
      iconFrame: AtlasFrame.SwordIcon,
      backgroundFrame: AtlasFrame.GoldButton,
      onClick: () => {
        const selectedMember = getPartySummary(this.snapshot)[this.selectedSlot];
        this.scene.start('equipment', { characterId: selectedMember?.id });
      },
    });
    createButton(this, 254, 606, {
      width: 126,
      height: 36,
      label: '\ub9c8\uc744',
      iconFrame: AtlasFrame.HomeIcon,
      onClick: () => this.scene.start('village'),
    });
  }

  private createCandidateDetailOverlay(): void {
    this.detailOverlay = this.add.rectangle(180, 320, 360, 640, 0x050404, 0.66)
      .setDepth(900)
      .setVisible(false)
      .setInteractive();
    const detailFrameObjects: Phaser.GameObjects.GameObject[] = this.textures.exists(SCREEN_RUNTIME_IMAGE_KEYS.characterDetailModal)
      ? [
        this.add.image(0, 0, SCREEN_RUNTIME_IMAGE_KEYS.characterDetailModal)
          .setDisplaySize(328, 584)
          .setAlpha(0.98),
        this.add.rectangle(0, -12, 304, 270, 0x080b10, 0.1),
        this.add.rectangle(0, 202, 286, 54, 0x120d09, 0.35)
          .setStrokeStyle(1, 0xe0c78b, 0.16),
      ]
      : [
        this.add.rectangle(0, 8, 328, 520, 0x09111b, 0.98)
          .setStrokeStyle(2, 0xe0c78b, 0.46),
        this.add.rectangle(0, -202, 306, 62, 0x152132, 0.9)
          .setStrokeStyle(1, 0xe0c78b, 0.22),
        this.add.rectangle(0, 58, 306, 288, 0x101925, 0.9)
          .setStrokeStyle(1, 0xe0c78b, 0.18),
        this.add.rectangle(0, 200, 286, 54, 0x241b16, 0.78)
          .setStrokeStyle(1, 0xe0c78b, 0.18),
      ];
    this.detailFrame = this.add.container(180, 320, detailFrameObjects)
      .setDepth(901)
      .setVisible(false);
    this.detailPortraitCard = this.add.rectangle(72, 152, 118, 136, 0x211710, 0.62)
      .setStrokeStyle(2, 0xe0cea3, 0.72)
      .setDepth(902)
      .setVisible(false);
    this.detailPortraitImage = this.add.image(72, 152, '', 0)
      .setDepth(903)
      .setVisible(false);
    this.detailNameText = this.add.text(166, 96, '', {
      fontFamily: 'Segoe UI',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#fff2cf',
      stroke: '#17110c',
      strokeThickness: 3,
      wordWrap: { width: 148 },
    }).setDepth(903).setVisible(false);
    this.detailStarImages = [0, 1, 2, 3, 4].map((index) =>
      this.add.image(166 + index * 13, 126, ATLAS_KEY, AtlasFrame.Star)
        .setDisplaySize(11, 11)
        .setDepth(903)
        .setVisible(false),
    );
    this.detailMetaText = this.add.text(166, 144, '', {
      fontFamily: 'Segoe UI',
      fontSize: '9px',
      color: '#efe1ba',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 148 },
      lineSpacing: 2,
    }).setDepth(903).setVisible(false);
    this.detailBodyText = this.add.text(36, 238, '', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#efe1ba',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 288 },
      lineSpacing: 3,
    }).setDepth(903).setVisible(false);
    this.detailStatusText = this.add.text(36, 500, '', {
      fontFamily: 'Segoe UI',
      fontSize: '10px',
      color: '#ffd2a5',
      stroke: '#17110c',
      strokeThickness: 2,
      wordWrap: { width: 288 },
      lineSpacing: 2,
    }).setDepth(903).setVisible(false);
    this.detailAssignButton = createButton(this, 108, 566, {
      width: 128,
      height: 36,
      label: '\ud30c\ud2f0 \ud3b8\uc131',
      iconFrame: AtlasFrame.StageNode,
      backgroundFrame: AtlasFrame.GoldButton,
      onClick: () => this.confirmDetailAction(),
    }).setDepth(904).setVisible(false);
    this.detailCloseButton = createButton(this, 252, 566, {
      width: 108,
      height: 36,
      label: '\ub2eb\uae30',
      iconFrame: AtlasFrame.HomeIcon,
      onClick: () => this.closeCandidateDetail(),
    }).setDepth(904).setVisible(false);
    this.detailObjects = [
      this.detailOverlay,
      this.detailFrame,
      this.detailPortraitCard,
      this.detailPortraitImage,
      this.detailNameText,
      ...this.detailStarImages,
      this.detailMetaText,
      this.detailBodyText,
      this.detailStatusText,
      this.detailAssignButton,
      this.detailCloseButton,
    ];
  }

  private openCandidateDetail(status?: string): void {
    const candidates = this.getRosterCandidateIds();
    const candidateId = candidates[this.candidateIndex];
    if (!candidateId) {
      return;
    }

    this.detailMode = 'roster';
    this.detailCandidateId = candidateId;
    this.populateCharacterDetail(candidateId, status);
  }

  private openPartyMemberDetail(slotIndex: number): void {
    const party = getPartySummary(this.snapshot);
    const member = party[slotIndex];
    this.selectedSlot = slotIndex;

    if (!member) {
      this.refreshView('\ube48 \uc2ac\ub86f\uc785\ub2c8\ub2e4. \ub85c\uc2a4\ud130\uc5d0\uc11c \ub3d9\ub8cc\ub97c \uc120\ud0dd\ud574 \ubc30\uce58\ud558\uc138\uc694.');
      return;
    }

    this.detailMode = 'party';
    this.detailCandidateId = member.id;
    this.populateCharacterDetail(member.id);
  }

  private populateCharacterDetail(candidateId: string, status?: string): void {
    const character = getCharacter(candidateId);
    const copies = this.snapshot.roster.ownedCharacters[candidateId]?.copies ?? 0;
    const alreadyInParty = this.snapshot.roster.selectedPartyIds.includes(candidateId);
    const equipment = getCharacterEquipment(this.snapshot, candidateId);
    const preset = getRolePreset(character.role);
    const equipmentStats = equipment.stats;
    const attack = Math.round(preset.attackPower + (equipmentStats.attack ?? 0) + (equipmentStats.magic ?? 0) + (equipmentStats.healPower ?? 0));
    const defense = Math.round((equipmentStats.defense ?? 0) + (equipmentStats.blockRate ?? 0));
    const hp = Math.round(preset.maxHp + (equipmentStats.hp ?? 0) + (equipmentStats.defense ?? 0) * 5);
    const weaponName = equipment.weapon ? this.localize(equipment.weapon.name) : '무기 없음';
    const armorName = equipment.armor ? this.localize(equipment.armor.name) : '방어구 없음';
    this.detailNameText.setText(this.localize(character.name));
    this.detailNameText.setColor(Phaser.Display.Color.IntegerToColor(getRarityColor(character.rarity)).rgba);
    this.detailStarImages.forEach((star, index) => {
      star
        .setVisible(index < character.rarity)
        .setTint(getRarityColor(character.rarity));
    });
    this.detailMetaText.setText(
      `${this.localize(character.title)}\n` +
      `Lv.1 | ${this.localize(character.weaponType)}\n` +
      `전투력 ${computeCharacterPower(this.snapshot, candidateId)} | 초월 ${getCharacterTranscendence(this.snapshot, candidateId)} | 보유 ${copies}`,
    );
    this.detailBodyText.setText([
      `공격 ${attack}   방어 ${defense}`,
      `체력 ${hp}`,
      `무기 ${weaponName}`,
      `방어구 ${armorName}`,
      '',
      this.getCharacterIntro(character.role),
    ].join('\n'));
    this.detailStatusText.setText(status ?? (this.detailMode === 'party'
      ? '\ud604\uc7ac \ud30c\ud2f0\uc5d0 \ubc30\uce58\ub41c \ub3d9\ub8cc\uc785\ub2c8\ub2e4.'
      : alreadyInParty
        ? '\uc774\ubbf8 \ud30c\ud2f0\uc5d0 \ud3ec\ud568\ub41c \ub3d9\ub8cc\uc785\ub2c8\ub2e4.'
        : `${this.selectedSlot + 1}\ubc88 \uc2ac\ub86f\uc5d0 \ubc30\uce58\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.`));
    this.setButtonLabel(this.detailAssignButton, this.detailMode === 'party' ? '\ud30c\ud2f0 \uc81c\uc678' : '\ud30c\ud2f0 \ud3b8\uc131');
    this.detailObjects.forEach((object) => object.setVisible(true));
    this.detailStarImages.forEach((star, index) => {
      star
        .setVisible(index < character.rarity)
        .setTint(getRarityColor(character.rarity));
    });
    this.refreshDetailPortrait();
  }

  private closeCandidateDetail(): void {
    this.detailCandidateId = null;
    this.detailMode = null;
    this.detailObjects.forEach((object) => object.setVisible(false));
  }

  private setDetailStatus(status: string): void {
    if (this.detailCandidateId) {
      this.detailStatusText.setText(status);
    }
  }

  private confirmDetailAction(): void {
    if (this.detailMode === 'party') {
      this.removeSelectedPartyMember();
      return;
    }

    this.assignCurrentCandidate();
  }

  private setButtonLabel(button: Phaser.GameObjects.Container, label: string): void {
    const labelObject = button.list.find((child) => child instanceof Phaser.GameObjects.Text);
    if (labelObject instanceof Phaser.GameObjects.Text) {
      labelObject.setText(label);
    }
  }

  private getRosterCandidateIds(): string[] {
    const partyIds = new Set(getPartySummary(this.snapshot).map((member) => member.id));
    return getPartyCandidateIds(this.snapshot).filter((candidateId) => !partyIds.has(candidateId));
  }

  private refreshDetailPortrait(): void {
    if (!this.detailCandidateId || !this.detailPortraitImage.visible) {
      return;
    }

    applyCharacterFacePortrait(this, this.detailPortraitImage, this.detailCandidateId, 110, 124, 0, 1);
  }

  private refreshView(status: string): void {
    const party = getPartySummary(this.snapshot);
    const candidates = this.getRosterCandidateIds();
    this.candidateIndex = Phaser.Math.Clamp(this.candidateIndex, 0, Math.max(0, candidates.length - 1));
    this.ensureCandidateVisible(candidates);

    this.headerText.setText([
      `\ud30c\ud2f0 \uc804\ud22c\ub825 ${calculatePartyPower(this.snapshot)}  |  \uc120\ud0dd \uc2ac\ub86f ${this.selectedSlot + 1}/4`,
      `\ub85c\uc2a4\ud130 ${candidates.length}\uba85`,
    ]);

    this.slotVisuals.forEach((visual, index) => {
      const member = party[index];
      if (!member) {
        const selected = index === this.selectedSlot;
        visual.glow.setFillStyle(0xd9c08a, selected ? 0.18 : 0.04);
        visual.card.setStrokeStyle(2, selected ? 0xf0c76d : 0x4f4134, selected ? 0.72 : 0.24);
        visual.portrait.setVisible(false);
        visual.nameText.setText('\ube48 \uc2ac\ub86f');
        visual.metaText.setText('');
        visual.nameText.setColor(selected ? '#fff8e7' : '#d3c7b3');
        return;
      }

      const character = getCharacter(member.id);
      const selected = index === this.selectedSlot;
      visual.glow.setFillStyle(getRarityColor(character.rarity), selected ? 0.22 : 0.08);
      visual.card.setStrokeStyle(2, getRarityBorderColor(character.rarity), selected ? 0.95 : 0.35);
      visual.nameText.setText(this.localize(member.name));
      visual.metaText.setText(`${member.power}`);
      visual.nameText.setColor(selected ? '#fff8e7' : '#f7efd6');
      visual.metaText.setColor(selected ? '#ffeab6' : '#d3c7b3');
      visual.portrait.setVisible(true);
      applyCharacterFacePortrait(this, visual.portrait, member.id, 58, 62, 0, 1);
    });

    const focusedId = candidates[this.candidateIndex];
    const focusedCharacter = focusedId ? getCharacter(focusedId) : null;
    if (focusedCharacter && focusedId) {
      this.focusedPortraitGlow.setFillStyle(getCharacterRoleColor(focusedCharacter.role), 0.14);
      this.focusedPortraitCard.setStrokeStyle(2, getRarityBorderColor(focusedCharacter.rarity), 0.82);
      this.focusedPortraitImage.setVisible(true);
      applyCharacterFacePortrait(this, this.focusedPortraitImage, focusedId, 82, 96, 0, 1);
      this.focusedNameText.setText(this.localize(focusedCharacter.name));
      this.focusedNameText.setColor(Phaser.Display.Color.IntegerToColor(getRarityColor(focusedCharacter.rarity)).rgba);
      this.focusedMetaText.setText(
        `${this.localize(focusedCharacter.title)} | ${this.localize(focusedCharacter.weaponType)}\n` +
        `\ucd08\uc6d4 ${getCharacterTranscendence(this.snapshot, focusedId)}  |  \uc804\ud22c\ub825 ${computeCharacterPower(this.snapshot, focusedId)}`,
      );
    } else {
      this.focusedPortraitImage.setVisible(false);
      this.focusedNameText.setText('\uc120\ud0dd\ub41c \ub3d9\ub8cc \uc5c6\uc74c');
      this.focusedNameText.setColor('#fff2cf');
      this.focusedMetaText.setText('');
    }

    const startIndex = this.getCandidateWindowStart();
    this.candidateVisuals.forEach((visual, rowIndex) => {
      const candidateId = candidates[startIndex + rowIndex];
      if (!candidateId) {
        visual.card.setVisible(false);
        visual.accent.setVisible(false);
        visual.portrait.setVisible(false);
        visual.stars.forEach((star) => star.setVisible(false));
        visual.nameText.setVisible(false);
        visual.metaText.setVisible(false);
        return;
      }

      const character = getCharacter(candidateId);
      const isFocused = startIndex + rowIndex === this.candidateIndex;

      visual.card.setVisible(true);
      visual.accent.setVisible(true);
      visual.portrait.setVisible(true);
      visual.stars.forEach((star, starIndex) => {
        star
          .setVisible(starIndex < character.rarity)
          .setTint(getRarityColor(character.rarity));
      });
      visual.nameText.setVisible(true);
      visual.metaText.setVisible(true);
      visual.card.setFillStyle(isFocused ? 0x202b36 : 0x141d26, isFocused ? 0.92 : 0.74);
      visual.card.setStrokeStyle(2, getRarityBorderColor(character.rarity), isFocused ? 0.8 : 0.2);
      visual.accent.setFillStyle(getCharacterRoleColor(character.role), 0.58);
      visual.nameText.setText(this.localize(character.name));
      visual.nameText.setColor(isFocused ? '#fff8e2' : '#f5ead0');
      visual.metaText.setText(`${this.localize(character.title)} | \uc804\ud22c\ub825 ${computeCharacterPower(this.snapshot, candidateId)}`);
      visual.metaText.setColor(isFocused ? '#ffe6b2' : '#d4c29f');
      applyCharacterFacePortrait(this, visual.portrait, candidateId, 62, 64, 0, 1);
    });

    this.refreshRosterScroll(candidates);
    this.statusText.setText(status);
  }

  private refreshAnimatedPortraits(): void {
    const party = getPartySummary(this.snapshot);
    party.forEach((member, index) => {
      const visual = this.slotVisuals[index];
      applyCharacterFacePortrait(this, visual.portrait, member.id, 58, 62, 0, 1);
    });

    const focusedId = this.getRosterCandidateIds()[this.candidateIndex];
    if (focusedId && this.focusedPortraitImage.visible) {
      applyCharacterFacePortrait(this, this.focusedPortraitImage, focusedId, 82, 96, 0, 1);
    }

    const candidates = this.getRosterCandidateIds();
    const startIndex = this.getCandidateWindowStart();
    this.candidateVisuals.forEach((visual, rowIndex) => {
      const candidateId = candidates[startIndex + rowIndex];
      if (!candidateId) {
        return;
      }

      applyCharacterFacePortrait(this, visual.portrait, candidateId, 62, 64, 0, 1);
    });

    this.refreshDetailPortrait();
  }

  private getCandidateWindowStart(): number {
    return this.candidateWindowStart;
  }

  private getCandidateWindowSize(): number {
    return Math.max(1, this.candidateVisuals.length);
  }

  private ensureCandidateVisible(candidates: string[]): void {
    const visibleRows = this.getCandidateWindowSize();
    const maxStart = Math.max(0, candidates.length - visibleRows);
    this.candidateWindowStart = Phaser.Math.Clamp(this.candidateWindowStart, 0, maxStart);

    if (this.candidateIndex < this.candidateWindowStart) {
      this.candidateWindowStart = this.candidateIndex;
    }

    if (this.candidateIndex >= this.candidateWindowStart + visibleRows) {
      this.candidateWindowStart = this.candidateIndex - visibleRows + 1;
    }

    this.candidateWindowStart = Phaser.Math.Clamp(this.candidateWindowStart, 0, maxStart);
  }

  private refreshRosterScroll(candidates: string[]): void {
    const visibleRows = this.getCandidateWindowSize();
    const maxStart = Math.max(0, candidates.length - visibleRows);
    const shouldShow = candidates.length > visibleRows;
    this.rosterScrollTrack.setVisible(shouldShow);
    this.rosterScrollThumb.setVisible(shouldShow);

    if (!shouldShow) {
      return;
    }

    const thumbHeight = Phaser.Math.Clamp(
      Math.round((visibleRows / candidates.length) * ROSTER_SCROLL_TRACK_HEIGHT),
      36,
      ROSTER_SCROLL_TRACK_HEIGHT,
    );
    const progress = maxStart <= 0 ? 0 : this.candidateWindowStart / maxStart;
    const travel = ROSTER_SCROLL_TRACK_HEIGHT - thumbHeight;
    const thumbY = ROSTER_SCROLL_TRACK_TOP + thumbHeight / 2 + travel * progress;
    this.rosterScrollThumb
      .setSize(10, thumbHeight)
      .setDisplaySize(10, thumbHeight)
      .setPosition(330, thumbY);
  }

  private bindRosterScrollInput(): void {
    this.unbindRosterScrollInput();
    this.input.on('wheel', this.handleRosterWheel, this);
    this.input.on('pointermove', this.handleRosterPointerMove, this);
    this.input.on('pointerup', this.handleRosterPointerUp, this);
    this.input.on('pointerupoutside', this.handleRosterPointerUp, this);
  }

  private unbindRosterScrollInput(): void {
    this.input.off('wheel', this.handleRosterWheel, this);
    this.input.off('pointermove', this.handleRosterPointerMove, this);
    this.input.off('pointerup', this.handleRosterPointerUp, this);
    this.input.off('pointerupoutside', this.handleRosterPointerUp, this);
  }

  private handleRosterWheel(pointer: Phaser.Input.Pointer, _targets: unknown[], _deltaX: number, deltaY: number): void {
    if (!ROSTER_BOUNDS.contains(pointer.x, pointer.y)) {
      return;
    }

    this.scrollRoster(deltaY > 0 ? 1 : -1);
  }

  private scrollRoster(delta: number): void {
    const candidates = this.getRosterCandidateIds();
    const visibleRows = this.getCandidateWindowSize();
    const maxStart = Math.max(0, candidates.length - visibleRows);
    const nextStart = Phaser.Math.Clamp(this.candidateWindowStart + delta, 0, maxStart);

    if (nextStart === this.candidateWindowStart) {
      return;
    }

    this.candidateWindowStart = nextStart;
    this.candidateIndex = Phaser.Math.Clamp(
      this.candidateIndex,
      nextStart,
      Math.min(candidates.length - 1, nextStart + visibleRows - 1),
    );
    this.refreshView(delta > 0 ? '\ub85c\uc2a4\ud130\ub97c \uc544\ub798\ub85c \uc2a4\ud06c\ub864\ud588\uc2b5\ub2c8\ub2e4.' : '\ub85c\uc2a4\ud130\ub97c \uc704\ub85c \uc2a4\ud06c\ub864\ud588\uc2b5\ub2c8\ub2e4.');
  }

  private beginRosterDrag(pointer: Phaser.Input.Pointer, thumbDragging: boolean): void {
    const candidates = this.getRosterCandidateIds();
    if (candidates.length <= this.getCandidateWindowSize()) {
      return;
    }

    this.rosterDragPointerId = pointer.id;
    this.rosterDragStartY = pointer.y;
    this.rosterDragStartWindowStart = this.candidateWindowStart;
    this.rosterThumbDragging = thumbDragging;
    this.rosterDragMoved = false;
  }

  private handleRosterPointerMove(pointer: Phaser.Input.Pointer): void {
    if (this.rosterDragPointerId !== pointer.id) {
      return;
    }

    const candidates = this.getRosterCandidateIds();
    const visibleRows = this.getCandidateWindowSize();
    const maxStart = Math.max(0, candidates.length - visibleRows);
    if (maxStart <= 0) {
      return;
    }

    const movement = pointer.y - this.rosterDragStartY;
    if (Math.abs(movement) < 8) {
      return;
    }

    this.rosterDragMoved = true;
    const nextStart = this.rosterThumbDragging
      ? Math.round(maxStart * Phaser.Math.Clamp((pointer.y - ROSTER_SCROLL_TRACK_TOP) / ROSTER_SCROLL_TRACK_HEIGHT, 0, 1))
      : Phaser.Math.Clamp(
        this.rosterDragStartWindowStart + Math.round((this.rosterDragStartY - pointer.y) / ROSTER_ROW_HEIGHT),
        0,
        maxStart,
      );

    if (nextStart === this.candidateWindowStart) {
      return;
    }

    this.candidateWindowStart = nextStart;
    this.candidateIndex = Phaser.Math.Clamp(
      this.candidateIndex,
      nextStart,
      Math.min(candidates.length - 1, nextStart + visibleRows - 1),
    );
    this.refreshView('\ub85c\uc2a4\ud130\ub97c \ub4dc\ub798\uadf8\ud574 \uc774\ub3d9\ud588\uc2b5\ub2c8\ub2e4.');
  }

  private handleRosterPointerUp(): void {
    if (this.rosterDragPointerId === null) {
      return;
    }

    this.rosterDragPointerId = null;
    this.rosterThumbDragging = false;
    this.time.delayedCall(0, () => {
      this.rosterDragMoved = false;
    });
  }

  private jumpRosterScroll(pointerY: number): void {
    const candidates = this.getRosterCandidateIds();
    const visibleRows = this.getCandidateWindowSize();
    const maxStart = Math.max(0, candidates.length - visibleRows);

    if (maxStart <= 0) {
      return;
    }

    const progress = Phaser.Math.Clamp(
      (pointerY - ROSTER_SCROLL_TRACK_TOP) / ROSTER_SCROLL_TRACK_HEIGHT,
      0,
      1,
    );
    this.candidateWindowStart = Math.round(maxStart * progress);
    this.candidateIndex = Phaser.Math.Clamp(
      this.candidateIndex,
      this.candidateWindowStart,
      Math.min(candidates.length - 1, this.candidateWindowStart + visibleRows - 1),
    );
    this.refreshView('\ub85c\uc2a4\ud130 \uc2a4\ud06c\ub864 \uc704\uce58\ub97c \uc774\ub3d9\ud588\uc2b5\ub2c8\ub2e4.');
  }

  private assignCurrentCandidate(): void {
    const candidates = this.getRosterCandidateIds();
    const candidateId = candidates[this.candidateIndex];

    if (!candidateId) {
      return;
    }

    if (this.snapshot.roster.selectedPartyIds[this.selectedSlot] === candidateId) {
      const status = '\uc774 \uc2ac\ub86f\uc5d0\ub294 \uc774\ubbf8 \ud574\ub2f9 \ub3d9\ub8cc\uac00 \ubc30\uce58\ub418\uc5b4 \uc788\uc2b5\ub2c8\ub2e4.';
      this.setDetailStatus(status);
      this.refreshView(status);
      return;
    }

    const result = assignPartyMember(this.snapshot, this.selectedSlot, candidateId);

    if (!result.ok) {
      const status = result.reason === 'duplicate'
        ? '\ud55c \ub3d9\ub8cc\ub97c \ub450 \uc2ac\ub86f\uc5d0 \ub3d9\uc2dc\uc5d0 \ubc30\uce58\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.'
        : '\uc9c0\uae08\uc740 \ud574\ub2f9 \ub3d9\ub8cc\ub97c \ubc30\uce58\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.';
      this.setDetailStatus(status);
      this.refreshView(status);
      return;
    }

    this.snapshot = result.snapshot;
    saveSnapshot(this.snapshot);
    this.closeCandidateDetail();
    this.refreshView(`${this.localize(getCharacter(candidateId).name)}\uc744(\ub97c) ${this.selectedSlot + 1}\ubc88 \uc2ac\ub86f\uc5d0 \ubc30\uce58\ud588\uc2b5\ub2c8\ub2e4.`);
  }

  private removeSelectedPartyMember(): void {
    const member = getPartySummary(this.snapshot)[this.selectedSlot];
    const result = removePartyMember(this.snapshot, this.selectedSlot);

    if (!result.ok) {
      const status = result.reason === 'minimum_party'
        ? '\ucd5c\uc18c 1\uba85\uc740 \ud30c\ud2f0\uc5d0 \ub0a8\uc544 \uc788\uc5b4\uc57c \ud569\ub2c8\ub2e4.'
        : '\uc81c\uc678\ud560 \ud30c\ud2f0\uc6d0\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.';
      this.setDetailStatus(status);
      this.refreshView(status);
      return;
    }

    this.snapshot = result.snapshot;
    this.selectedSlot = Phaser.Math.Clamp(this.selectedSlot, 0, Math.max(0, this.snapshot.roster.selectedPartyIds.length - 1));
    this.candidateIndex = 0;
    this.candidateWindowStart = 0;
    saveSnapshot(this.snapshot);
    this.closeCandidateDetail();
    this.refreshView(member ? `${this.localize(member.name)}\uc744(\ub97c) \ud30c\ud2f0\uc5d0\uc11c \uc81c\uc678\ud588\uc2b5\ub2c8\ub2e4.` : '\ud30c\ud2f0\uc6d0\uc744 \uc81c\uc678\ud588\uc2b5\ub2c8\ub2e4.');
  }

  private localize(value: string): string {
    return t(this, value, undefined, value);
  }

  private getCharacterIntro(role: ReturnType<typeof getCharacter>['role']): string {
    switch (role) {
      case 'leader':
        return '전열을 조율하며 안정적으로 길을 여는 지휘형 검사입니다.';
      case 'guardian':
        return '높은 체력과 방어로 전열을 지키는 수호형 동료입니다.';
      case 'mage':
        return '강한 마법 피해로 적의 약점을 빠르게 찌르는 화력형 동료입니다.';
      case 'healer':
        return '회복과 생존 보조로 긴 전투를 버티게 하는 지원형 동료입니다.';
      case 'ranger':
        return '빠른 공격 간격과 원거리 압박으로 전장을 넓게 쓰는 동료입니다.';
      case 'support':
        return '버프와 전투 보조로 파티 전체의 효율을 끌어올립니다.';
      case 'warrior':
        return '안정적인 공격과 체력으로 전열을 밀어붙이는 근접형 동료입니다.';
      case 'assassin':
        return '높은 순간 피해와 기동성으로 위험한 적을 빠르게 정리합니다.';
      default:
        return '파티 구성에 따라 역할이 달라지는 동료입니다.';
    }
  }
}
