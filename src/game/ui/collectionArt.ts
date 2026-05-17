import Phaser from 'phaser';
import { AtlasFrame, ATLAS_KEY } from '../data/atlas';
import { getCharacter, type CharacterDefinition } from '../data/characters';
import { getDialoguePortraitKey } from '../data/dialoguePortraitAssets';
import { getArmorDefinition, getWeaponDefinition } from '../data/equipment';
import { getRuntimeAnimationClip, type RuntimeAnimationClipEntry } from '../data/runtimeAnimationAssets';
import type { ArmorClass, CharacterRarity, SummonResultEntry, WeaponClass } from '../types';

export function getRarityColor(rarity: CharacterRarity): number {
  switch (rarity) {
    case 5:
      return 0xf0c76d;
    case 4:
      return 0xae94ee;
    default:
      return 0x7db7dd;
  }
}

export function getRarityBorderColor(rarity: CharacterRarity): number {
  switch (rarity) {
    case 5:
      return 0xffefbd;
    case 4:
      return 0xe3d4ff;
    default:
      return 0xd9ecf7;
  }
}

export function getRarityLabel(rarity: CharacterRarity): string {
  return '*'.repeat(rarity);
}

export function getCharacterRoleColor(role: CharacterDefinition['role']): number {
  switch (role) {
    case 'leader':
      return 0xd4a64a;
    case 'guardian':
      return 0x7492c6;
    case 'mage':
      return 0x9d7be0;
    case 'healer':
      return 0x6ec6b0;
    case 'ranger':
      return 0x90b764;
    case 'support':
      return 0xc58fb9;
    case 'warrior':
      return 0xc9785a;
    case 'assassin':
      return 0x80879b;
    default:
      return 0xb99b74;
  }
}

export function getCharacterPortraitClip(scene: Phaser.Scene, characterId: string): RuntimeAnimationClipEntry | null {
  const clipIds = ['town_idle', 'idle', 'talk', 'walk'];
  for (const clipId of clipIds) {
    const clip = getRuntimeAnimationClip(scene, 'character', characterId, clipId);
    if (clip) {
      return clip;
    }
  }

  return null;
}

interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PortraitFocus {
  bounds: CropRect;
  x: number;
  y: number;
  cropScale?: number;
}

const PORTRAIT_OPAQUE_BOUNDS = new Map<string, CropRect>();
const PORTRAIT_FACE_FOCUS = new Map<string, PortraitFocus>();
const FACE_FOCUS_OVERRIDES: Record<string, { x: number; y: number; cropScale?: number }> = {
  hero: { x: 0.54, y: 0.31, cropScale: 0.3 },
  bram: { x: 0.52, y: 0.31, cropScale: 0.3 },
  sera: { x: 0.50, y: 0.31, cropScale: 0.3 },
  luna: { x: 0.50, y: 0.31, cropScale: 0.3 },
  ria: { x: 0.52, y: 0.31, cropScale: 0.3 },
  theo: { x: 0.54, y: 0.32, cropScale: 0.3 },
  dorgan: { x: 0.53, y: 0.31, cropScale: 0.3 },
  kiera: { x: 0.52, y: 0.31, cropScale: 0.3 },
  helma: { x: 0.52, y: 0.31, cropScale: 0.3 },
  marin: { x: 0.55, y: 0.31, cropScale: 0.3 },
  serena: { x: 0.52, y: 0.31, cropScale: 0.3 },
  fin: { x: 0.55, y: 0.31, cropScale: 0.3 },
  iris: { x: 0.50, y: 0.31, cropScale: 0.3 },
  wolf: { x: 0.48, y: 0.31, cropScale: 0.3 },
  erin: { x: 0.51, y: 0.31, cropScale: 0.3 },
  nazir: { x: 0.47, y: 0.31, cropScale: 0.3 },
  laila: { x: 0.54, y: 0.32, cropScale: 0.3 },
  hakan: { x: 0.52, y: 0.31, cropScale: 0.3 },
  seraphin: { x: 0.51, y: 0.31, cropScale: 0.3 },
  micaela: { x: 0.53, y: 0.32, cropScale: 0.24 },
  lucian: { x: 0.48, y: 0.31, cropScale: 0.3 },
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function isDrawableImageSource(source: unknown): source is HTMLImageElement {
  return typeof HTMLImageElement !== 'undefined' && source instanceof HTMLImageElement && source.complete;
}

function getOpaqueBounds(textureKey: string, source: { width?: number; height?: number }): CropRect {
  const cached = PORTRAIT_OPAQUE_BOUNDS.get(textureKey);
  if (cached) {
    return cached;
  }

  const width = Math.max(1, source.width ?? 1);
  const height = Math.max(1, source.height ?? 1);
  let bounds: CropRect = { x: 0, y: 0, width, height };

  try {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context || !isDrawableImageSource(source)) {
      PORTRAIT_OPAQUE_BOUNDS.set(textureKey, bounds);
      return bounds;
    }

    context.drawImage(source, 0, 0);
    const data = context.getImageData(0, 0, width, height).data;
      let minX = width;
      let minY = height;
      let maxX = -1;
      let maxY = -1;

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const offset = (y * width + x) * 4;
          const red = data[offset];
          const green = data[offset + 1];
          const blue = data[offset + 2];
          const alpha = data[offset + 3];
          const maxChannel = Math.max(red, green, blue);
          const minChannel = Math.min(red, green, blue);
          const isForeground = alpha > 12 && (maxChannel > 28 || maxChannel - minChannel > 16);
          if (isForeground) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      if (maxX >= minX && maxY >= minY) {
        bounds = {
          x: minX,
          y: minY,
          width: maxX - minX + 1,
          height: maxY - minY + 1,
        };
      }
  } catch {
    bounds = { x: 0, y: 0, width, height };
  }

  PORTRAIT_OPAQUE_BOUNDS.set(textureKey, bounds);
  return bounds;
}

function getPortraitFocus(textureKey: string, source: { width?: number; height?: number }): PortraitFocus {
  const cached = PORTRAIT_FACE_FOCUS.get(textureKey);
  if (cached) {
    return cached;
  }

  const bounds = getOpaqueBounds(textureKey, source);
  const characterId = textureKey.startsWith('dialogue:character:')
    ? textureKey.replace('dialogue:character:', '')
    : '';
  const override = FACE_FOCUS_OVERRIDES[characterId];
  if (override) {
    const width = Math.max(1, source.width ?? 1);
    const height = Math.max(1, source.height ?? 1);
    const focus = {
      bounds,
      x: clamp(width * override.x, bounds.x, bounds.x + bounds.width),
      y: clamp(height * override.y, bounds.y, bounds.y + bounds.height),
      cropScale: override.cropScale,
    };
    PORTRAIT_FACE_FOCUS.set(textureKey, focus);
    return focus;
  }

  let focus: PortraitFocus = {
    bounds,
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height * 0.17,
  };

  try {
    const width = Math.max(1, source.width ?? 1);
    const height = Math.max(1, source.height ?? 1);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context || !isDrawableImageSource(source)) {
      PORTRAIT_FACE_FOCUS.set(textureKey, focus);
      return focus;
    }

    context.drawImage(source, 0, 0);
    const data = context.getImageData(0, 0, width, height).data;
      const bandBottom = Math.round(bounds.y + bounds.height * 0.36);
      const bandXs: number[] = [];
      const bandYs: number[] = [];

      for (let y = bounds.y; y <= bandBottom; y += 1) {
        for (let x = bounds.x; x < bounds.x + bounds.width; x += 1) {
          const offset = (y * width + x) * 4;
          const red = data[offset];
          const green = data[offset + 1];
          const blue = data[offset + 2];
          const alpha = data[offset + 3];
          const maxChannel = Math.max(red, green, blue);
          const minChannel = Math.min(red, green, blue);
          const isForeground = alpha > 12 && (maxChannel > 28 || maxChannel - minChannel > 16);
          if (isForeground) {
            bandXs.push(x);
            bandYs.push(y);
          }
        }
      }

      if (bandXs.length > 20) {
        bandXs.sort((a, b) => a - b);
        bandYs.sort((a, b) => a - b);
        const medianX = bandXs[Math.floor(bandXs.length / 2)] ?? focus.x;
        const medianY = bandYs[Math.floor(bandYs.length / 2)] ?? focus.y;
        focus = {
          bounds,
          x: medianX,
          y: medianY * 0.45 + (bounds.y + bounds.height * 0.17) * 0.55,
        };
      }
  } catch {
    focus = {
      bounds,
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height * 0.17,
    };
  }

  PORTRAIT_FACE_FOCUS.set(textureKey, focus);
  return focus;
}

export function applyCharacterPortrait(
  scene: Phaser.Scene,
  image: Phaser.GameObjects.Image,
  characterId: string,
  displayHeight: number,
  elapsedMs = 0,
  facing: -1 | 1 = 1,
): boolean {
  const clip = getCharacterPortraitClip(scene, characterId);

  if (!clip || !scene.textures.exists(clip.textureKey)) {
    image
      .setCrop()
      .setTexture(ATLAS_KEY, AtlasFrame.Hero)
      .setDisplaySize(displayHeight, displayHeight)
      .setTint(getCharacterRoleColor(getCharacter(characterId).role))
      .setFlipX(facing < 0);
    return false;
  }

  const fps = clip.fps ?? 8;
  const elapsedFrames = Math.max(0, Math.floor((elapsedMs / 1000) * fps));
  const frameIndex = clip.frameCount <= 1 ? 0 : elapsedFrames % clip.frameCount;
  const scale = displayHeight / clip.frameHeight;
  image
    .clearTint()
    .setCrop()
    .setTexture(clip.textureKey, frameIndex)
    .setDisplaySize(Math.round(clip.frameWidth * scale), Math.round(clip.frameHeight * scale))
    .setFlipX(facing < 0);
  return true;
}

export function applyCharacterShowcasePortrait(
  scene: Phaser.Scene,
  image: Phaser.GameObjects.Image,
  characterId: string,
  maxWidth: number,
  maxHeight: number,
  elapsedMs = 0,
  facing: -1 | 1 = 1,
): boolean {
  const portraitKey = getDialoguePortraitKey('character', characterId);
  if (portraitKey && scene.textures.exists(portraitKey)) {
    const source = scene.textures.get(portraitKey).getSourceImage() as { width?: number; height?: number } | null;
    if (!source) {
      return applyCharacterPortrait(scene, image, characterId, maxHeight, elapsedMs, facing);
    }
    const width = Math.max(1, source.width ?? maxWidth);
    const height = Math.max(1, source.height ?? maxHeight);
    const scale = Math.min(maxWidth / width, maxHeight / height);
    image
      .clearTint()
      .setCrop()
      .setTexture(portraitKey)
      .setDisplaySize(
        Math.max(1, Math.round(width * scale)),
        Math.max(1, Math.round(height * scale)),
      )
      .setFlipX(false);
    return true;
  }

  return applyCharacterPortrait(scene, image, characterId, maxHeight, elapsedMs, facing);
}

export function applyCharacterFacePortrait(
  scene: Phaser.Scene,
  image: Phaser.GameObjects.Image,
  characterId: string,
  targetWidth: number,
  targetHeight: number,
  elapsedMs = 0,
  facing: -1 | 1 = 1,
): boolean {
  const portraitKey = getDialoguePortraitKey('character', characterId);
  if (portraitKey && scene.textures.exists(portraitKey)) {
    const texture = scene.textures.get(portraitKey);
    const source = texture.getSourceImage() as { width?: number; height?: number } | null;
    if (!source) {
      return applyCharacterPortrait(scene, image, characterId, targetHeight, elapsedMs, facing);
    }
    const width = Math.max(1, source.width ?? targetWidth);
    const height = Math.max(1, source.height ?? targetHeight);
    const focus = getPortraitFocus(portraitKey, source);
    const bounds = focus.bounds;
    const targetRatio = targetWidth / Math.max(1, targetHeight);
    let cropHeight = Math.round(bounds.height * (focus.cropScale ?? 0.24));
    let cropWidth = Math.round(cropHeight * targetRatio);
    cropWidth = Math.max(cropWidth, Math.round(bounds.width * 0.24));

    if (cropWidth > width) {
      cropWidth = width;
      cropHeight = Math.round(cropWidth / targetRatio);
    }

    if (cropHeight > height) {
      cropHeight = height;
      cropWidth = Math.round(cropHeight * targetRatio);
    }

    const cropX = Math.round(clamp(focus.x - cropWidth / 2, 0, Math.max(0, width - cropWidth)));
    const cropY = Math.round(clamp(focus.y - cropHeight * 0.5, 0, Math.max(0, height - cropHeight)));
    const frameName = `face-${cropX}-${cropY}-${cropWidth}-${cropHeight}`;
    if (!texture.has(frameName)) {
      texture.add(frameName, 0, cropX, cropY, cropWidth, cropHeight);
    }

    image
      .clearTint()
      .setCrop()
      .setTexture(portraitKey, frameName)
      .setDisplaySize(targetWidth, targetHeight)
      .setFlipX(false);
    return true;
  }

  return applyCharacterPortrait(scene, image, characterId, targetHeight, elapsedMs, facing);
}

export function getWeaponClassIconFrame(weaponClass: WeaponClass): number {
  switch (weaponClass) {
    case 'tome':
    case 'staff':
    case 'sea_staff':
    case 'relic_staff':
    case 'hymn_staff':
    case 'record_book':
      return AtlasFrame.Star;
    case 'bow':
    case 'pistol':
    case 'cannon':
      return AtlasFrame.StageNode;
    case 'shield_sword':
    case 'war_hammer':
    case 'rune_hammer':
    case 'lance':
      return AtlasFrame.HomeIcon;
    default:
      return AtlasFrame.SwordIcon;
  }
}

export function getArmorClassIconFrame(armorClass: ArmorClass): number {
  switch (armorClass) {
    case 'plate':
    case 'heavy':
      return AtlasFrame.HomeIcon;
    case 'mobile':
    case 'light':
      return AtlasFrame.MapIcon;
    case 'robe':
    case 'cleric':
    case 'runic':
      return AtlasFrame.Star;
    default:
      return AtlasFrame.BagIcon;
  }
}

export function getWeaponIconFrame(weaponId: string): number {
  return getWeaponClassIconFrame(getWeaponDefinition(weaponId).weaponClass);
}

export function getArmorIconFrame(armorId: string): number {
  return getArmorClassIconFrame(getArmorDefinition(armorId).armorClass);
}

export function getSummonEntryIconFrame(entry: SummonResultEntry): number {
  if (entry.kind === 'weapon') {
    return getWeaponIconFrame(entry.id);
  }

  return AtlasFrame.Hero;
}
