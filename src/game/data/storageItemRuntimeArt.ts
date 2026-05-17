export interface StorageItemImageAsset {
  itemId: string;
  key: string;
  path: string;
}

const STORAGE_ITEM_IMAGE_IDS = [
  'fatigue_tonic_small',
  'fatigue_tonic_large',
  'item_field_ration_bundle',
  'item_route_guard_supplies',
  'item_frontline_recovery_case',
] as const;

export const STORAGE_ITEM_IMAGE_ASSETS: readonly StorageItemImageAsset[] = STORAGE_ITEM_IMAGE_IDS.map((itemId) => ({
  itemId,
  key: `storage:item:${itemId}`,
  path: `assets/ui/storage/items/${itemId}.png`,
}));

const STORAGE_ITEM_IMAGE_KEYS = new Map(
  STORAGE_ITEM_IMAGE_ASSETS.map((asset) => [asset.itemId, asset.key]),
);

export function getStorageItemImageKey(itemId: string): string | null {
  return STORAGE_ITEM_IMAGE_KEYS.get(itemId) ?? null;
}
