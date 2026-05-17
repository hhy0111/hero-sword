export interface WorldMapImageAsset {
  key: string;
  path: string;
}

export const WORLD_MAP_IMAGE_KEYS = {
  scenicBackground: 'world-map:scenic-background',
  overview: 'world-map:overview',
  continent01: 'world-map:continent-01',
  continent02: 'world-map:continent-02',
  continent03: 'world-map:continent-03',
  continent04: 'world-map:continent-04',
  continent05: 'world-map:continent-05',
  continent06: 'world-map:continent-06',
  finalRoute: 'world-map:final-route',
  nodeOpen: 'world-map:node-open',
  nodeLocked: 'world-map:node-locked',
  nodeSelected: 'world-map:node-selected',
  nodeDisabled: 'world-map:node-disabled',
  landmark01: 'world-map:landmark-01',
  landmark02: 'world-map:landmark-02',
  landmark03: 'world-map:landmark-03',
  landmark04: 'world-map:landmark-04',
  landmark05: 'world-map:landmark-05',
  landmark06: 'world-map:landmark-06',
  finalLandmark: 'world-map:landmark-final',
} as const;

export const WORLD_MAP_IMAGE_ASSETS: readonly WorldMapImageAsset[] = [
  { key: WORLD_MAP_IMAGE_KEYS.scenicBackground, path: 'assets/world/world-map/scenic_background.png' },
  { key: WORLD_MAP_IMAGE_KEYS.overview, path: 'assets/world/world-map/overview.png' },
  { key: WORLD_MAP_IMAGE_KEYS.continent01, path: 'assets/world/world-map/continent_01.png' },
  { key: WORLD_MAP_IMAGE_KEYS.continent02, path: 'assets/world/world-map/continent_02.png' },
  { key: WORLD_MAP_IMAGE_KEYS.continent03, path: 'assets/world/world-map/continent_03.png' },
  { key: WORLD_MAP_IMAGE_KEYS.continent04, path: 'assets/world/world-map/continent_04.png' },
  { key: WORLD_MAP_IMAGE_KEYS.continent05, path: 'assets/world/world-map/continent_05.png' },
  { key: WORLD_MAP_IMAGE_KEYS.continent06, path: 'assets/world/world-map/continent_06.png' },
  { key: WORLD_MAP_IMAGE_KEYS.finalRoute, path: 'assets/world/world-map/final_route.png' },
  { key: WORLD_MAP_IMAGE_KEYS.nodeOpen, path: 'assets/world/world-map/node_open.png' },
  { key: WORLD_MAP_IMAGE_KEYS.nodeLocked, path: 'assets/world/world-map/node_locked.png' },
  { key: WORLD_MAP_IMAGE_KEYS.nodeSelected, path: 'assets/world/world-map/node_selected.png' },
  { key: WORLD_MAP_IMAGE_KEYS.nodeDisabled, path: 'assets/world/world-map/node_disabled.png' },
  { key: WORLD_MAP_IMAGE_KEYS.landmark01, path: 'assets/world/world-map/landmarks/greenhaven_watchtower.png' },
  { key: WORLD_MAP_IMAGE_KEYS.landmark02, path: 'assets/world/world-map/landmarks/granforge_furnace.png' },
  { key: WORLD_MAP_IMAGE_KEYS.landmark03, path: 'assets/world/world-map/landmarks/blueharbor_shrine.png' },
  { key: WORLD_MAP_IMAGE_KEYS.landmark04, path: 'assets/world/world-map/landmarks/winterguard_fortress.png' },
  { key: WORLD_MAP_IMAGE_KEYS.landmark05, path: 'assets/world/world-map/landmarks/sunscar_relic_tower.png' },
  { key: WORLD_MAP_IMAGE_KEYS.landmark06, path: 'assets/world/world-map/landmarks/lumina_sanctuary.png' },
  { key: WORLD_MAP_IMAGE_KEYS.finalLandmark, path: 'assets/world/world-map/landmarks/black_gate_final.png' },
] as const;

export const WORLD_MAP_SCENE_IMAGE_ASSETS: readonly WorldMapImageAsset[] = [
  { key: WORLD_MAP_IMAGE_KEYS.scenicBackground, path: 'assets/world/world-map/scenic_background.png' },
  { key: WORLD_MAP_IMAGE_KEYS.overview, path: 'assets/world/world-map/overview.png' },
  { key: WORLD_MAP_IMAGE_KEYS.continent01, path: 'assets/world/world-map/continent_01.png' },
  { key: WORLD_MAP_IMAGE_KEYS.continent02, path: 'assets/world/world-map/continent_02.png' },
  { key: WORLD_MAP_IMAGE_KEYS.continent03, path: 'assets/world/world-map/continent_03.png' },
  { key: WORLD_MAP_IMAGE_KEYS.continent04, path: 'assets/world/world-map/continent_04.png' },
  { key: WORLD_MAP_IMAGE_KEYS.continent05, path: 'assets/world/world-map/continent_05.png' },
  { key: WORLD_MAP_IMAGE_KEYS.continent06, path: 'assets/world/world-map/continent_06.png' },
  { key: WORLD_MAP_IMAGE_KEYS.nodeOpen, path: 'assets/world/world-map/node_open.png' },
  { key: WORLD_MAP_IMAGE_KEYS.nodeLocked, path: 'assets/world/world-map/node_locked.png' },
  { key: WORLD_MAP_IMAGE_KEYS.nodeSelected, path: 'assets/world/world-map/node_selected.png' },
  { key: WORLD_MAP_IMAGE_KEYS.nodeDisabled, path: 'assets/world/world-map/node_disabled.png' },
  { key: WORLD_MAP_IMAGE_KEYS.landmark01, path: 'assets/world/world-map/landmarks/greenhaven_watchtower.png' },
  { key: WORLD_MAP_IMAGE_KEYS.landmark02, path: 'assets/world/world-map/landmarks/granforge_furnace.png' },
  { key: WORLD_MAP_IMAGE_KEYS.landmark03, path: 'assets/world/world-map/landmarks/blueharbor_shrine.png' },
  { key: WORLD_MAP_IMAGE_KEYS.landmark04, path: 'assets/world/world-map/landmarks/winterguard_fortress.png' },
  { key: WORLD_MAP_IMAGE_KEYS.landmark05, path: 'assets/world/world-map/landmarks/sunscar_relic_tower.png' },
  { key: WORLD_MAP_IMAGE_KEYS.landmark06, path: 'assets/world/world-map/landmarks/lumina_sanctuary.png' },
  { key: WORLD_MAP_IMAGE_KEYS.finalLandmark, path: 'assets/world/world-map/landmarks/black_gate_final.png' },
] as const;

const CONTINENT_IMAGE_KEYS: Record<string, string> = {
  continent_01: WORLD_MAP_IMAGE_KEYS.continent01,
  continent_02: WORLD_MAP_IMAGE_KEYS.continent02,
  continent_03: WORLD_MAP_IMAGE_KEYS.continent03,
  continent_04: WORLD_MAP_IMAGE_KEYS.continent04,
  continent_05: WORLD_MAP_IMAGE_KEYS.continent05,
  continent_06: WORLD_MAP_IMAGE_KEYS.continent06,
};

const CONTINENT_LANDMARK_KEYS: Record<string, string> = {
  continent_01: WORLD_MAP_IMAGE_KEYS.landmark01,
  continent_02: WORLD_MAP_IMAGE_KEYS.landmark02,
  continent_03: WORLD_MAP_IMAGE_KEYS.landmark03,
  continent_04: WORLD_MAP_IMAGE_KEYS.landmark04,
  continent_05: WORLD_MAP_IMAGE_KEYS.landmark05,
  continent_06: WORLD_MAP_IMAGE_KEYS.landmark06,
};

export function getWorldMapOverviewKey(): string {
  return WORLD_MAP_IMAGE_KEYS.overview;
}

export function getWorldMapContinentArtKey(continentId: string): string | null {
  return CONTINENT_IMAGE_KEYS[continentId] ?? null;
}

export function getWorldMapLandmarkKey(continentId: string): string | null {
  return CONTINENT_LANDMARK_KEYS[continentId] ?? null;
}

export function getWorldMapNodeFrameKey(state: 'open' | 'locked' | 'selected' | 'disabled'): string {
  switch (state) {
    case 'locked':
      return WORLD_MAP_IMAGE_KEYS.nodeLocked;
    case 'selected':
      return WORLD_MAP_IMAGE_KEYS.nodeSelected;
    case 'disabled':
      return WORLD_MAP_IMAGE_KEYS.nodeDisabled;
    case 'open':
    default:
      return WORLD_MAP_IMAGE_KEYS.nodeOpen;
  }
}
