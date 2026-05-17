import { describe, expect, it } from 'vitest';
import {
  collectRuntimeAnimationClipEntries,
  makeRuntimeAnimationClipLookupKey,
  makeRuntimeAnimationTextureKey,
  type RuntimeAnimationManifest,
} from '../src/game/data/runtimeAnimationAssets';

describe('runtime animation assets', () => {
  it('collects valid runtime clip entries with stable lookup keys', () => {
    const manifest: RuntimeAnimationManifest = {
      version: 1,
      generatedAt: '2026-04-04',
      subjects: [
        {
          id: 'party_melee',
          name: 'Party Melee',
          category: 'effect',
          clips: [
            {
              id: 'fx_slash_arc',
              path: 'assets/runtime/effects/fx_slash_arc.png',
              frameWidth: 128,
              frameHeight: 128,
              frameCount: 5,
            },
          ],
        },
      ],
    };

    const { entries, validationErrors } = collectRuntimeAnimationClipEntries(manifest);

    expect(validationErrors).toEqual([]);
    expect(entries).toHaveLength(1);
    expect(entries[0].textureKey).toBe(makeRuntimeAnimationTextureKey('effect', 'party_melee', 'fx_slash_arc'));
    expect(makeRuntimeAnimationClipLookupKey('effect', 'party_melee', 'fx_slash_arc')).toBe('effect:party_melee:fx_slash_arc');
  });

  it('reports duplicate subjects and invalid enemy clip dimensions', () => {
    const manifest: RuntimeAnimationManifest = {
      version: 1,
      generatedAt: '2026-04-04',
      subjects: [
        {
          id: 'thorn_wolf',
          name: 'Thorn Wolf',
          category: 'enemy',
          clips: [
            {
              id: 'idle',
              path: 'assets/runtime/enemies/thorn_wolf/idle.png',
              frameWidth: 0,
              frameHeight: 48,
              frameCount: 6,
            },
          ],
        },
        {
          id: 'thorn_wolf',
          name: 'Thorn Wolf Duplicate',
          category: 'enemy',
          clips: [],
        },
      ],
    };

    const { entries, validationErrors } = collectRuntimeAnimationClipEntries(manifest);

    expect(entries).toHaveLength(0);
    expect(validationErrors).toContain('Clip thorn_wolf/idle has invalid frameWidth.');
    expect(validationErrors).toContain('Duplicate subject id: thorn_wolf');
  });
});
