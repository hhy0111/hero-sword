import type Phaser from 'phaser';

export type RuntimeAnimationCategory = 'character' | 'enemy' | 'npc' | 'effect';

export interface RuntimeAnimationClipManifest {
  id: string;
  path: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  fps?: number;
  note?: string;
}

export interface RuntimeAnimationSubjectManifest {
  id: string;
  name: string;
  category: RuntimeAnimationCategory;
  clips: RuntimeAnimationClipManifest[];
}

export interface RuntimeAnimationManifest {
  version: number;
  generatedAt: string;
  note?: string;
  subjects: RuntimeAnimationSubjectManifest[];
}

export interface RuntimeAnimationClipEntry extends RuntimeAnimationClipManifest {
  subjectId: string;
  subjectName: string;
  category: RuntimeAnimationCategory;
  textureKey: string;
}

export interface RuntimeAnimationState {
  manifestPath: string;
  manifestFound: boolean;
  manifestVersion: number | null;
  generatedAt: string | null;
  note?: string;
  subjectCount: number;
  clipCount: number;
  availableClipCount: number;
  loadedTextureKeys: string[];
  failedTextureKeys: string[];
  validationErrors: string[];
  clipMap: Record<string, RuntimeAnimationClipEntry>;
}

const RUNTIME_ANIMATION_MANIFEST_PATH = 'assets/runtime/animation-manifest.json';
const RUNTIME_ANIMATION_STATE_KEY = 'runtimeAnimationState';
const NEAREST_FILTER_MODE = 1;
const ENABLE_RUNTIME_CHARACTER_CLIPS = true;
const ENABLE_RUNTIME_ENEMY_CLIPS = true;
const ENABLE_RUNTIME_NPC_CLIPS = true;
const ENABLE_RUNTIME_EFFECT_CLIPS = true;

const EMPTY_RUNTIME_ANIMATION_STATE: RuntimeAnimationState = {
  manifestPath: RUNTIME_ANIMATION_MANIFEST_PATH,
  manifestFound: false,
  manifestVersion: null,
  generatedAt: null,
  subjectCount: 0,
  clipCount: 0,
  availableClipCount: 0,
  loadedTextureKeys: [],
  failedTextureKeys: [],
  validationErrors: [],
  clipMap: {},
};

export function getRuntimeAnimationManifestPath(): string {
  return RUNTIME_ANIMATION_MANIFEST_PATH;
}

export function getRuntimeAnimationState(scene: Phaser.Scene): RuntimeAnimationState {
  return (scene.registry.get(RUNTIME_ANIMATION_STATE_KEY) as RuntimeAnimationState | undefined) ?? EMPTY_RUNTIME_ANIMATION_STATE;
}

export function setRuntimeAnimationState(scene: Phaser.Scene, state: RuntimeAnimationState): void {
  scene.registry.set(RUNTIME_ANIMATION_STATE_KEY, state);
}

export function makeRuntimeAnimationClipLookupKey(
  category: RuntimeAnimationCategory,
  subjectId: string,
  clipId: string,
): string {
  return `${category}:${subjectId}:${clipId}`;
}

export function makeRuntimeAnimationTextureKey(
  category: RuntimeAnimationCategory,
  subjectId: string,
  clipId: string,
): string {
  return `rtanim:${category}:${subjectId}:${clipId}`;
}

export function getRuntimeAnimationClip(
  scene: Phaser.Scene,
  category: RuntimeAnimationCategory,
  subjectId: string,
  clipId: string,
): RuntimeAnimationClipEntry | null {
  const state = getRuntimeAnimationState(scene);
  return state.clipMap[makeRuntimeAnimationClipLookupKey(category, subjectId, clipId)] ?? null;
}

export function collectRuntimeAnimationClipEntries(
  manifest: RuntimeAnimationManifest,
): { entries: RuntimeAnimationClipEntry[]; validationErrors: string[] } {
  const entries: RuntimeAnimationClipEntry[] = [];
  const validationErrors: string[] = [];
  const seenSubjects = new Set<string>();

  for (const subject of manifest.subjects) {
    if (!subject.id || typeof subject.id !== 'string') {
      validationErrors.push('Subject id is missing or invalid.');
      continue;
    }

    if (seenSubjects.has(subject.id)) {
      validationErrors.push(`Duplicate subject id: ${subject.id}`);
      continue;
    }

    seenSubjects.add(subject.id);

    if (!isRuntimeAnimationCategory(subject.category)) {
      validationErrors.push(`Invalid category for subject ${subject.id}: ${String(subject.category)}`);
      continue;
    }

    if (subject.category === 'character' && !ENABLE_RUNTIME_CHARACTER_CLIPS) {
      validationErrors.push(
        `Skipped runtime character clips for ${subject.id} until per-character slicing QA passes.`,
      );
      continue;
    }

    if (subject.category === 'enemy' && !ENABLE_RUNTIME_ENEMY_CLIPS) {
      validationErrors.push(
        `Skipped runtime enemy clips for ${subject.id} until per-enemy slicing QA passes.`,
      );
      continue;
    }

    if (subject.category === 'npc' && !ENABLE_RUNTIME_NPC_CLIPS) {
      validationErrors.push(
        `Skipped runtime npc clips for ${subject.id} until per-npc slicing QA passes.`,
      );
      continue;
    }

    if (subject.category === 'effect' && !ENABLE_RUNTIME_EFFECT_CLIPS) {
      validationErrors.push(
        `Skipped runtime effect clips for ${subject.id} until per-effect slicing QA passes.`,
      );
      continue;
    }

    if (!Array.isArray(subject.clips)) {
      validationErrors.push(`Subject ${subject.id} is missing clips array.`);
      continue;
    }

    const seenClips = new Set<string>();

    for (const clip of subject.clips) {
      if (!clip.id || typeof clip.id !== 'string') {
        validationErrors.push(`Clip id is missing for subject ${subject.id}.`);
        continue;
      }

      if (seenClips.has(clip.id)) {
        validationErrors.push(`Duplicate clip id for subject ${subject.id}: ${clip.id}`);
        continue;
      }

      seenClips.add(clip.id);

      if (!clip.path || typeof clip.path !== 'string') {
        validationErrors.push(`Clip ${subject.id}/${clip.id} is missing path.`);
        continue;
      }

      if (!Number.isInteger(clip.frameWidth) || clip.frameWidth <= 0) {
        validationErrors.push(`Clip ${subject.id}/${clip.id} has invalid frameWidth.`);
        continue;
      }

      if (!Number.isInteger(clip.frameHeight) || clip.frameHeight <= 0) {
        validationErrors.push(`Clip ${subject.id}/${clip.id} has invalid frameHeight.`);
        continue;
      }

      if (!Number.isInteger(clip.frameCount) || clip.frameCount <= 0) {
        validationErrors.push(`Clip ${subject.id}/${clip.id} has invalid frameCount.`);
        continue;
      }

      entries.push({
        ...clip,
        subjectId: subject.id,
        subjectName: subject.name,
        category: subject.category,
        textureKey: makeRuntimeAnimationTextureKey(subject.category, subject.id, clip.id),
      });
    }
  }

  return { entries, validationErrors };
}

export async function loadRuntimeAnimationAssets(scene: Phaser.Scene): Promise<RuntimeAnimationState> {
  const manifestResponse = await fetchRuntimeAnimationManifest();

  if (!manifestResponse) {
    return EMPTY_RUNTIME_ANIMATION_STATE;
  }

  const { manifest, validationErrors: manifestErrors } = manifestResponse;
  const { entries, validationErrors: entryErrors } = collectRuntimeAnimationClipEntries(manifest);
  const validationErrors = [...manifestErrors, ...entryErrors];

  if (entries.length === 0) {
    return {
      manifestPath: RUNTIME_ANIMATION_MANIFEST_PATH,
      manifestFound: true,
      manifestVersion: manifest.version,
      generatedAt: manifest.generatedAt,
      note: manifest.note,
      subjectCount: manifest.subjects.length,
      clipCount: 0,
      availableClipCount: 0,
      loadedTextureKeys: [],
      failedTextureKeys: [],
      validationErrors,
      clipMap: {},
    };
  }

  const failedTextureKeys = new Set<string>();
  await queueRuntimeClipLoads(scene, entries, failedTextureKeys);

  const clipMap: Record<string, RuntimeAnimationClipEntry> = {};
  const loadedTextureKeys: string[] = [];

  for (const entry of entries) {
    if (failedTextureKeys.has(entry.textureKey) || !scene.textures.exists(entry.textureKey)) {
      continue;
    }

    scene.textures.get(entry.textureKey).setFilter(NEAREST_FILTER_MODE);

    clipMap[makeRuntimeAnimationClipLookupKey(entry.category, entry.subjectId, entry.id)] = entry;
    loadedTextureKeys.push(entry.textureKey);
  }

  return {
    manifestPath: RUNTIME_ANIMATION_MANIFEST_PATH,
    manifestFound: true,
    manifestVersion: manifest.version,
    generatedAt: manifest.generatedAt,
    note: manifest.note,
    subjectCount: manifest.subjects.length,
    clipCount: entries.length,
    availableClipCount: loadedTextureKeys.length,
    loadedTextureKeys,
    failedTextureKeys: [...failedTextureKeys],
    validationErrors,
    clipMap,
  };
}

async function fetchRuntimeAnimationManifest(): Promise<{
  manifest: RuntimeAnimationManifest;
  validationErrors: string[];
} | null> {
  try {
    const response = await fetch(RUNTIME_ANIMATION_MANIFEST_PATH, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const raw = (await response.json()) as Partial<RuntimeAnimationManifest>;
    const validationErrors: string[] = [];

    if (!Number.isInteger(raw.version) || (raw.version ?? 0) <= 0) {
      validationErrors.push('Manifest version is missing or invalid.');
    }

    if (typeof raw.generatedAt !== 'string' || raw.generatedAt.length === 0) {
      validationErrors.push('Manifest generatedAt is missing or invalid.');
    }

    const subjects = Array.isArray(raw.subjects) ? raw.subjects : [];
    if (!Array.isArray(raw.subjects)) {
      validationErrors.push('Manifest subjects array is missing or invalid.');
    }

    return {
      manifest: {
        version: raw.version ?? 0,
        generatedAt: raw.generatedAt ?? '',
        note: raw.note,
        subjects: subjects as RuntimeAnimationSubjectManifest[],
      },
      validationErrors,
    };
  } catch {
    return null;
  }
}

async function queueRuntimeClipLoads(
  scene: Phaser.Scene,
  entries: RuntimeAnimationClipEntry[],
  failedTextureKeys: Set<string>,
): Promise<void> {
  const pendingEntries = entries.filter((entry) => !scene.textures.exists(entry.textureKey));

  if (pendingEntries.length === 0) {
    return;
  }

  await new Promise<void>((resolve) => {
    const handleLoadError = (file: Phaser.Loader.File) => {
      failedTextureKeys.add(file.key);
    };
    const handleComplete = () => {
      scene.load.off('loaderror', handleLoadError);
      resolve();
    };

    scene.load.on('loaderror', handleLoadError);
    scene.load.once('complete', handleComplete);

    for (const entry of pendingEntries) {
      scene.load.spritesheet(entry.textureKey, entry.path, {
        frameWidth: entry.frameWidth,
        frameHeight: entry.frameHeight,
        endFrame: entry.frameCount - 1,
      });
    }

    scene.load.start();
  });
}

function isRuntimeAnimationCategory(value: unknown): value is RuntimeAnimationCategory {
  return value === 'character' || value === 'enemy' || value === 'npc' || value === 'effect';
}
