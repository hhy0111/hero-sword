export interface GachaItemImageAsset {
  key: string;
  path: string;
  itemId: string;
}

const GACHA_ITEM_IMAGE_IDS = [
  'wp_oath_blade',
  'wp_black_moon_daggers',
  'wp_greenwind_bow',
  'wp_sand_relic_staff',
  'wp_frost_greatsword',
  'wp_oasis_lance',
  'wp_guard_sword',
  'wp_star_tome',
  'wp_sanctuary_staff',
  'wp_tide_pistol',
] as const;

export const GACHA_ITEM_IMAGE_ASSETS: readonly GachaItemImageAsset[] = GACHA_ITEM_IMAGE_IDS.map((itemId) => ({
  itemId,
  key: `gacha:item:${itemId}`,
  path: `assets/ui/gacha/items/${itemId}.png`,
}));

const GACHA_ITEM_IMAGE_KEYS = new Map(GACHA_ITEM_IMAGE_ASSETS.map((asset) => [asset.itemId, asset.key]));

export function getGachaItemImageKey(itemId: string): string | null {
  return GACHA_ITEM_IMAGE_KEYS.get(itemId) ?? null;
}
