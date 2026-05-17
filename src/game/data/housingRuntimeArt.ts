export interface HousingRuntimeImageAsset {
  key: string;
  path: string;
}

export const HOUSING_RUNTIME_IMAGE_KEYS = {
  backdrop: 'housing:ui:backdrop',
  roomStage: 'housing:ui:room-stage',
  woodCrate: 'housing:furniture:wood-crate',
  trainingDummy: 'housing:furniture:training-dummy',
  smallPlant: 'housing:furniture:small-plant',
  knightBanner: 'housing:furniture:knight-banner',
  heroSwordRack: 'housing:furniture:hero-sword-rack',
  lumenLamp: 'housing:furniture:lumen-lamp',
} as const;

export const HOUSING_RUNTIME_IMAGE_ASSETS: readonly HousingRuntimeImageAsset[] = [
  { key: HOUSING_RUNTIME_IMAGE_KEYS.backdrop, path: 'assets/ui/housing/backdrop.png' },
  { key: HOUSING_RUNTIME_IMAGE_KEYS.roomStage, path: 'assets/ui/housing/room_stage.png' },
  { key: HOUSING_RUNTIME_IMAGE_KEYS.woodCrate, path: 'assets/ui/housing/wood_crate.png' },
  { key: HOUSING_RUNTIME_IMAGE_KEYS.trainingDummy, path: 'assets/ui/housing/training_dummy.png' },
  { key: HOUSING_RUNTIME_IMAGE_KEYS.smallPlant, path: 'assets/ui/housing/small_plant.png' },
  { key: HOUSING_RUNTIME_IMAGE_KEYS.knightBanner, path: 'assets/ui/housing/knight_banner.png' },
  { key: HOUSING_RUNTIME_IMAGE_KEYS.heroSwordRack, path: 'assets/ui/housing/hero_sword_rack.png' },
  { key: HOUSING_RUNTIME_IMAGE_KEYS.lumenLamp, path: 'assets/ui/housing/lumen_lamp.png' },
] as const;

export function getHousingFurnitureImageKey(furnitureId: string): string | null {
  switch (furnitureId) {
    case 'wood_crate':
      return HOUSING_RUNTIME_IMAGE_KEYS.woodCrate;
    case 'training_dummy':
      return HOUSING_RUNTIME_IMAGE_KEYS.trainingDummy;
    case 'small_plant':
      return HOUSING_RUNTIME_IMAGE_KEYS.smallPlant;
    case 'knight_banner':
      return HOUSING_RUNTIME_IMAGE_KEYS.knightBanner;
    case 'hero_sword_rack':
      return HOUSING_RUNTIME_IMAGE_KEYS.heroSwordRack;
    case 'lumen_lamp':
      return HOUSING_RUNTIME_IMAGE_KEYS.lumenLamp;
    default:
      return null;
  }
}
