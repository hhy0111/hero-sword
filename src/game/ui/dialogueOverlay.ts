import Phaser from 'phaser';
import { AtlasFrame, ATLAS_KEY } from '../data/atlas';
import { getCharacter } from '../data/characters';
import { getDialoguePortraitKey } from '../data/dialoguePortraitAssets';
import { getRuntimeAnimationClip, type RuntimeAnimationClipEntry } from '../data/runtimeAnimationAssets';
import { TOWN_RUNTIME_IMAGE_KEYS } from '../data/townRuntimeArt';
import { t } from '../services/i18n';
import { getCharacterRoleColor } from './collectionArt';
import type { DialogueLine, DialogueSpeaker } from '../types';

type DialogueMode = 'manual' | 'timed';

interface ActiveDialogueState {
  lines: DialogueLine[];
  index: number;
  mode: DialogueMode;
  autoHideAt: number;
  onComplete?: () => void;
}

interface PortraitResolution {
  clip: RuntimeAnimationClipEntry | null;
  textureKey: string;
  frame?: string | number;
  displayHeight: number;
  displayWidth?: number;
  tint?: number;
}

export class DialogueOverlay {
  private readonly scene: Phaser.Scene;
  private readonly root: Phaser.GameObjects.Container;
  private readonly portraitImage: Phaser.GameObjects.Image;
  private readonly portraitFrame: Phaser.GameObjects.Rectangle;
  private readonly portraitMaskShape: Phaser.GameObjects.Graphics;
  private readonly nameText: Phaser.GameObjects.Text;
  private readonly bodyText: Phaser.GameObjects.Text;
  private readonly promptText: Phaser.GameObjects.Text;
  private active: ActiveDialogueState | null = null;
  private currentClip: RuntimeAnimationClipEntry | null = null;

  constructor(scene: Phaser.Scene, depth = 1400) {
    this.scene = scene;

    const width = scene.scale.width;
    const height = 204;
    const y = scene.scale.height - height;

    const background = scene.add.rectangle(width / 2, height / 2, width, height, 0x161311, 0.94)
      .setStrokeStyle(3, 0xd3bc84, 0.86);
    const portraitPanel = scene.add.rectangle(72, 104, 108, 156, 0x241d19, 0.94)
      .setStrokeStyle(2, 0xe0cea3, 0.72);
    this.portraitFrame = portraitPanel;

    const accentBar = scene.add.rectangle(width / 2, 14, width - 18, 6, 0xc99949, 0.95);
    this.portraitImage = scene.add.image(72, 184, ATLAS_KEY, AtlasFrame.Hero)
      .setOrigin(0.5, 1)
      .setDisplaySize(112, 132);
    this.portraitMaskShape = scene.add.graphics()
      .setScrollFactor(0, 0)
      .setVisible(false);
    this.portraitMaskShape.fillStyle(0xffffff, 1);
    this.portraitMaskShape.fillRect(18, y + 26, 108, 156);
    this.portraitImage.setMask(this.portraitMaskShape.createGeometryMask());
    this.nameText = scene.add.text(142, 24, '', {
      fontFamily: 'Segoe UI',
      fontSize: '18px',
      color: '#ffe7ae',
      fontStyle: 'bold',
    });
    this.bodyText = scene.add.text(142, 56, '', {
      fontFamily: 'Segoe UI',
      fontSize: '15px',
      color: '#f7f1df',
      lineSpacing: 4,
      wordWrap: { width: width - 164 },
    });
    this.promptText = scene.add.text(width - 18, height - 18, '', {
      fontFamily: 'Segoe UI',
      fontSize: '12px',
      color: '#c7b893',
    }).setOrigin(1, 1);

    this.root = scene.add.container(0, y, [
      background,
      accentBar,
      portraitPanel,
      this.portraitImage,
      this.nameText,
      this.bodyText,
      this.promptText,
    ]);
    this.root.setDepth(depth).setScrollFactor(0, 0).setVisible(false);
  }

  public showSequence(lines: DialogueLine[], onComplete?: () => void): void {
    if (lines.length === 0) {
      this.hide();
      return;
    }

    this.active = {
      lines,
      index: 0,
      mode: 'manual',
      autoHideAt: 0,
      onComplete,
    };
    this.renderCurrentLine();
  }

  public showTimed(line: DialogueLine, durationMs = 4200): void {
    this.active = {
      lines: [line],
      index: 0,
      mode: 'timed',
      autoHideAt: this.scene.time.now + durationMs,
    };
    this.renderCurrentLine();
  }

  public update(): void {
    if (!this.active) {
      return;
    }

    if (this.active.mode === 'timed' && this.scene.time.now >= this.active.autoHideAt) {
      this.finishActiveDialogue();
      return;
    }

    this.updatePortraitAnimation();
  }

  public advance(): boolean {
    if (!this.active) {
      return false;
    }

    if (this.active.mode === 'timed') {
      this.finishActiveDialogue();
      return true;
    }

    if (this.active.index < this.active.lines.length - 1) {
      this.active.index += 1;
      this.renderCurrentLine();
      return true;
    }

    this.finishActiveDialogue();
    return true;
  }

  public hide(): void {
    this.active = null;
    this.currentClip = null;
    this.root.setVisible(false);
  }

  public isVisible(): boolean {
    return this.root.visible;
  }

  public isBlocking(): boolean {
    return this.active?.mode === 'manual';
  }

  public destroy(): void {
    this.root.destroy(true);
    this.portraitMaskShape.destroy();
  }

  private finishActiveDialogue(): void {
    const callback = this.active?.onComplete;
    this.hide();
    callback?.();
  }

  private renderCurrentLine(): void {
    if (!this.active) {
      this.hide();
      return;
    }

    const line = this.active.lines[this.active.index];
    this.nameText.setText(t(this.scene, line.speaker.name, undefined, line.speaker.name));
    this.bodyText.setText(t(this.scene, line.text, undefined, line.text));
    this.promptText.setText(
      this.active.mode === 'manual'
        ? t(this.scene, 'ui.dialogue.manual_prompt', {
          index: this.active.index + 1,
          total: this.active.lines.length,
        })
        : t(this.scene, 'ui.dialogue.timed_prompt'),
    );
    this.applyPortrait(line.speaker);
    this.root.setVisible(true);
  }

  private applyPortrait(speaker: DialogueSpeaker): void {
    const portrait = this.resolvePortrait(speaker);
    this.currentClip = portrait.clip;

    this.portraitImage
      .clearTint()
      .setFlipX(false)
      .setTexture(portrait.textureKey, portrait.frame)
      .setDisplaySize(
        portrait.displayWidth ?? portrait.displayHeight,
        portrait.displayHeight,
      );

    if (portrait.clip) {
      const scale = portrait.displayHeight / portrait.clip.frameHeight;
      this.portraitImage.setDisplaySize(
        Math.round(portrait.clip.frameWidth * scale),
        Math.round(portrait.clip.frameHeight * scale),
      );
      this.updatePortraitAnimation();
    } else {
      const frame = portrait.textureKey === ATLAS_KEY
        ? (portrait.frame ?? AtlasFrame.Hero)
        : portrait.frame;
      this.portraitImage.setTexture(portrait.textureKey, frame);
      if (portrait.tint !== undefined) {
        this.portraitImage.setTint(portrait.tint);
      }
      if (portrait.textureKey === ATLAS_KEY) {
        this.portraitImage.setDisplaySize(portrait.displayHeight, portrait.displayHeight);
      } else {
        const source = this.scene.textures.get(portrait.textureKey).getSourceImage() as { width?: number; height?: number };
        const width = source.width ?? portrait.displayHeight;
        const height = source.height ?? portrait.displayHeight;
        const scale = Math.max(
          portrait.displayHeight / height,
          (portrait.displayWidth ?? portrait.displayHeight) / width,
        );
        this.portraitImage.setDisplaySize(Math.round(width * scale), Math.round(height * scale));
      }
    }

    this.portraitFrame.setStrokeStyle(2, this.resolveFrameColor(speaker), 0.82);
  }

  private updatePortraitAnimation(): void {
    if (!this.currentClip || !this.scene.textures.exists(this.currentClip.textureKey)) {
      return;
    }

    const fps = this.currentClip.fps ?? 8;
    const frameCount = Math.max(1, this.currentClip.frameCount);
    const frameIndex = Math.floor((this.scene.time.now / 1000) * fps) % frameCount;
    this.portraitImage.setTexture(this.currentClip.textureKey, frameIndex);
  }

  private resolvePortrait(speaker: DialogueSpeaker): PortraitResolution {
    if (speaker.category === 'character') {
      const portraitKey = getDialoguePortraitKey('character', speaker.subjectId);
      if (portraitKey && this.scene.textures.exists(portraitKey)) {
        return {
          clip: null,
          textureKey: portraitKey,
          displayWidth: 126,
          displayHeight: 168,
        };
      }

      const clip =
        getRuntimeAnimationClip(this.scene, 'character', speaker.subjectId, 'talk') ??
        getRuntimeAnimationClip(this.scene, 'character', speaker.subjectId, 'town_idle') ??
        getRuntimeAnimationClip(this.scene, 'character', speaker.subjectId, 'idle') ??
        getRuntimeAnimationClip(this.scene, 'character', speaker.subjectId, 'walk');

      if (clip && this.scene.textures.exists(clip.textureKey)) {
        return {
          clip,
          textureKey: clip.textureKey,
          frame: 0,
          displayHeight: 136,
        };
      }

      return {
        clip: null,
        textureKey: ATLAS_KEY,
        frame: AtlasFrame.Hero,
        displayHeight: 112,
        tint: getCharacterRoleColor(getCharacter(speaker.subjectId).role),
      };
    }

    if (speaker.category === 'npc') {
      const portraitKey = getDialoguePortraitKey('npc', speaker.subjectId);
      if (!this.shouldForceRuntimeNpcPortrait(speaker.subjectId) && portraitKey && this.scene.textures.exists(portraitKey)) {
        return {
          clip: null,
          textureKey: portraitKey,
          displayWidth: 126,
          displayHeight: 168,
        };
      }

      const npcSubjectId = this.resolveNpcRuntimeSubjectId(speaker.subjectId);
      const clip =
        getRuntimeAnimationClip(this.scene, 'npc', npcSubjectId, 'talk') ??
        getRuntimeAnimationClip(this.scene, 'npc', npcSubjectId, 'greet') ??
        getRuntimeAnimationClip(this.scene, 'npc', npcSubjectId, 'counter_stand') ??
        getRuntimeAnimationClip(this.scene, 'npc', npcSubjectId, 'idle') ??
        getRuntimeAnimationClip(this.scene, 'npc', npcSubjectId, 'walk') ??
        getRuntimeAnimationClip(this.scene, 'npc', npcSubjectId, 'patrol_walk');

      if (clip && this.scene.textures.exists(clip.textureKey)) {
        return {
          clip,
          textureKey: clip.textureKey,
          frame: 0,
          displayHeight: 136,
        };
      }

      const artKey = this.resolveNpcArtKey(speaker.subjectId);
      if (artKey && this.scene.textures.exists(artKey)) {
        return {
          clip: null,
          textureKey: artKey,
          displayWidth: 112,
          displayHeight: 144,
        };
      }

      return {
        clip: null,
        textureKey: ATLAS_KEY,
        frame: AtlasFrame.Hero,
        displayHeight: 112,
        tint: 0xb9c8d8,
      };
    }

    const portraitKey = getDialoguePortraitKey('enemy', speaker.subjectId);
    if (portraitKey && this.scene.textures.exists(portraitKey)) {
      return {
        clip: null,
        textureKey: portraitKey,
        displayWidth: 126,
        displayHeight: 168,
      };
    }

    const enemyClip =
      getRuntimeAnimationClip(this.scene, 'enemy', speaker.subjectId, 'idle') ??
      getRuntimeAnimationClip(this.scene, 'enemy', speaker.subjectId, 'walk') ??
      getRuntimeAnimationClip(this.scene, 'enemy', speaker.subjectId, 'guard_or_block');

    if (enemyClip && this.scene.textures.exists(enemyClip.textureKey)) {
      return {
        clip: enemyClip,
        textureKey: enemyClip.textureKey,
        frame: 0,
        displayHeight: 136,
      };
    }

    return {
      clip: null,
      textureKey: ATLAS_KEY,
      frame: AtlasFrame.Hero,
      displayHeight: 112,
      tint: 0xd39a8a,
    };
  }

  private resolveNpcRuntimeSubjectId(subjectId: string): string {
    switch (subjectId) {
      case 'guard_east':
        return 'guard_east';
      case 'villager_plaza':
        return 'villager_plaza';
      case 'runner_lane':
        return 'runner_lane';
      case 'child_south':
        return 'child_south';
      case 'market_courier':
        return 'market_courier';
      case 'garden_guard':
        return 'garden_guard';
      case 'captain_ysold':
        return 'captain_ysold';
      case 'plaza_bard':
        return 'plaza_bard';
      case 'elder_haru':
        return 'elder_haru';
      case 'chamberlain_orla':
        return 'chamberlain_orla';
      case 'dock_loader':
        return 'dock_loader';
      case 'scribe_len':
        return 'scribe_len';
      case 'quartermaster_dina':
        return 'quartermaster_dina';
      case 'rookie_sentry':
        return 'rookie_sentry';
      case 'bram_recruit':
        return 'bram_recruit';
      case 'sanctum_knight':
        return 'sanctum_knight';
      case 'king_aldren':
        return 'king_aldren';
      case 'queen_regent_celestine':
        return 'queen_regent_celestine';
      case 'captain_rowan':
        return 'captain_rowan';
      case 'archivist_mirel':
        return 'archivist_mirel';
      case 'orin':
      case 'weapon_shop':
        return 'weapon_merchant';
      case 'marta':
      case 'armor_shop':
        return 'armor_merchant';
      case 'neri':
      case 'item_shop':
        return 'item_merchant';
      case 'torren':
      case 'forge_shop':
        return 'blacksmith';
      case 'seline':
      case 'relic_shop':
        return 'relic_merchant';
      default:
        return subjectId;
    }
  }

  private resolveNpcArtKey(subjectId: string): string | null {
    switch (subjectId) {
      case 'weapon_merchant':
      case 'orin':
      case 'weapon_shop':
        return TOWN_RUNTIME_IMAGE_KEYS.weaponMerchant;
      case 'item_merchant':
      case 'neri':
      case 'item_shop':
        return TOWN_RUNTIME_IMAGE_KEYS.itemMerchant;
      case 'relic_merchant':
      case 'seline':
      case 'relic_shop':
        return TOWN_RUNTIME_IMAGE_KEYS.relicMerchant;
      case 'torren':
      case 'forge_shop':
        return TOWN_RUNTIME_IMAGE_KEYS.blacksmith;
      case 'marta':
      case 'armor_shop':
        return TOWN_RUNTIME_IMAGE_KEYS.weaponMerchant;
      case 'guard_east':
      case 'guard_sword':
        return TOWN_RUNTIME_IMAGE_KEYS.guardSword;
      case 'villager_plaza':
      case 'villager':
        return TOWN_RUNTIME_IMAGE_KEYS.villager;
      case 'runner_lane':
      case 'traveler':
        return TOWN_RUNTIME_IMAGE_KEYS.traveler;
      case 'child_south':
      case 'child':
        return TOWN_RUNTIME_IMAGE_KEYS.child;
      case 'market_courier':
        return TOWN_RUNTIME_IMAGE_KEYS.traveler;
      case 'garden_guard':
      case 'captain_ysold':
        return TOWN_RUNTIME_IMAGE_KEYS.guardSpear;
      case 'plaza_bard':
      case 'elder_haru':
      case 'chamberlain_orla':
        return TOWN_RUNTIME_IMAGE_KEYS.villager;
      case 'dock_loader':
      case 'scribe_len':
      case 'quartermaster_dina':
        return TOWN_RUNTIME_IMAGE_KEYS.itemMerchant;
      case 'rookie_sentry':
      case 'bram_recruit':
      case 'sanctum_knight':
        return TOWN_RUNTIME_IMAGE_KEYS.guardSword;
      case 'king_aldren':
        return TOWN_RUNTIME_IMAGE_KEYS.guardSword;
      case 'queen_regent_celestine':
        return TOWN_RUNTIME_IMAGE_KEYS.villager;
      case 'captain_rowan':
        return TOWN_RUNTIME_IMAGE_KEYS.guardSpear;
      case 'archivist_mirel':
        return TOWN_RUNTIME_IMAGE_KEYS.itemMerchant;
      default:
        return null;
    }
  }

  private shouldForceRuntimeNpcPortrait(subjectId: string): boolean {
    return false;
  }

  private resolveFrameColor(speaker: DialogueSpeaker): number {
    switch (speaker.category) {
      case 'character':
        return getCharacterRoleColor(getCharacter(speaker.subjectId).role);
      case 'npc':
        return 0x7fa7d8;
      case 'enemy':
        return 0xd37b6d;
      default:
        return 0xe0cea3;
    }
  }
}
