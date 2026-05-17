import type { SaveSnapshot } from '../types';

export function buildDebugState(
  mode: string,
  snapshot: SaveSnapshot,
  extra: Record<string, unknown>,
): Record<string, unknown> {
  return {
    mode,
    coordinateSystem: 'origin_top_left_x_right_y_down',
    fatigue: snapshot.profile.fatigue,
    gold: snapshot.profile.gold,
    premiumCurrency: snapshot.profile.premiumCurrency,
    heroStones: snapshot.profile.heroStones,
    selectedPartyIds: snapshot.roster.selectedPartyIds,
    unlockedContinents: snapshot.world.unlockedContinents,
    ...extra,
  };
}
