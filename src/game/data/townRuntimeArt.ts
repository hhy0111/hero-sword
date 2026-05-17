import type { TownShopId } from './town';

export interface RuntimeImageAsset {
  key: string;
  path: string;
}

export interface RuntimeSheetAsset extends RuntimeImageAsset {
  frameWidth: number;
  frameHeight: number;
}

export const TOWN_RUNTIME_IMAGE_KEYS = {
  gateArch: 'town:gate-arch',
  fountainBase: 'town:fountain-base',
  fountainWater: 'town:fountain-water',
  warpMarker: 'town:warp-marker',
  palaceWarpMarker: 'town:effect:palace-warp-marker',
  importantDoorway: 'town:effect:important-doorway',
  worldGate: 'town:effect:world-gate',
  worldGateSheet: 'town:effect:world-gate-sheet',
  shopEntrance: 'town:effect:shop-entrance',
  wallSegment: 'town:wall:segment',
  wallVertical: 'town:wall:vertical',
  wallCorner: 'town:wall:corner',
  wallTower: 'town:wall:tower',
  wallHorizontalTile: 'town:wall:tile-horizontal',
  wallVerticalTile: 'town:wall:tile-vertical',
  weaponShop: 'town:building:weapon-shop',
  armorShop: 'town:building:armor-shop',
  itemShop: 'town:building:item-shop',
  forgeShop: 'town:building:forge-shop',
  relicShop: 'town:building:relic-shop',
  grassPlainTile: 'town:tile:grass-plain',
  grassWildTile: 'town:tile:grass-wild',
  grassWhiteFlowersTile: 'town:tile:grass-white-flowers',
  grassYellowFlowersTile: 'town:tile:grass-yellow-flowers',
  dirtPlainTile: 'town:tile:dirt-plain',
  dirtPebbleTile: 'town:tile:dirt-pebble',
  dirtEdgeTile: 'town:tile:dirt-edge',
  roadStoneTile: 'town:tile:road-stone',
  roadStoneAltTile: 'town:tile:road-stone-alt',
  plazaStoneTile: 'town:tile:plaza-stone',
  indoorWoodTile: 'town:tile:indoor-wood',
  indoorDarkWoodTile: 'town:tile:indoor-dark-wood',
  indoorWarmStoneTile: 'town:tile:indoor-warm-stone',
  indoorWorkshopStoneTile: 'town:tile:indoor-workshop-stone',
  indoorCleanBrickTile: 'town:tile:indoor-clean-brick',
  indoorWornBrickTile: 'town:tile:indoor-worn-brick',
  weaponMerchant: 'town:npc:weapon-merchant',
  itemMerchant: 'town:npc:item-merchant',
  relicMerchant: 'town:npc:relic-merchant',
  blacksmith: 'town:npc:blacksmith',
  villager: 'town:npc:villager',
  traveler: 'town:npc:traveler',
  child: 'town:npc:child',
  guardSpear: 'town:npc:guard-spear',
  guardSword: 'town:npc:guard-sword',
  guardCrossbow: 'town:npc:guard-crossbow',
  bench: 'town:prop:bench',
  crateStack: 'town:prop:crate-stack',
  lampPost: 'town:prop:lamp-post',
  noticeBoard: 'town:prop:notice-board',
  planter: 'town:prop:planter',
  shopUiSheet: 'town:ui:shop-item-list-sheet',
  shopHeaderFrame: 'town:ui:shop-header-frame',
  shopFeatureFrame: 'town:ui:shop-feature-frame',
  shopListFrame: 'town:ui:shop-list-frame',
  shopFooterFrame: 'town:ui:shop-footer-frame',
  shopBottomBar: 'town:ui:shop-bottom-bar',
  shopScrollUp: 'town:ui:shop-scroll-up',
  shopScrollDown: 'town:ui:shop-scroll-down',
} as const;

export const TOWN_RUNTIME_IMAGE_ASSETS: readonly RuntimeImageAsset[] = [
  { key: TOWN_RUNTIME_IMAGE_KEYS.gateArch, path: 'assets/world/town/landmarks/gate_arch.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.fountainBase, path: 'assets/world/town/landmarks/fountain_base.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.fountainWater, path: 'assets/world/town/landmarks/fountain_water.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.warpMarker, path: 'assets/world/town/effects/warp_marker.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.palaceWarpMarker, path: 'assets/world/town/effects/palace_warp_single_marker.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.importantDoorway, path: 'assets/world/town/effects/important_doorway.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.worldGate, path: 'assets/world/town/effects/world_gate.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.shopEntrance, path: 'assets/world/town/effects/shop_entrance.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.wallSegment, path: 'assets/world/town/landmarks/wall_segment.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.wallVertical, path: 'assets/world/town/landmarks/wall_vertical.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.wallCorner, path: 'assets/world/town/landmarks/wall_corner.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.wallTower, path: 'assets/world/town/landmarks/wall_tower.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.wallHorizontalTile, path: 'assets/world/town/tiles/town_outer_wall_horizontal_tile.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.wallVerticalTile, path: 'assets/world/town/tiles/town_outer_wall_vertical_tile.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.weaponShop, path: 'assets/world/town/buildings/weapon_shop.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.armorShop, path: 'assets/world/town/buildings/armor_shop.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.itemShop, path: 'assets/world/town/buildings/item_shop.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.forgeShop, path: 'assets/world/town/buildings/forge_shop.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.relicShop, path: 'assets/world/town/buildings/relic_shop.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.grassPlainTile, path: 'assets/world/town/tiles/outdoor/grass_plain.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.grassWildTile, path: 'assets/world/town/tiles/outdoor/grass_wild.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.grassWhiteFlowersTile, path: 'assets/world/town/tiles/outdoor/grass_white_flowers.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.grassYellowFlowersTile, path: 'assets/world/town/tiles/outdoor/grass_yellow_flowers.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.dirtPlainTile, path: 'assets/world/town/tiles/outdoor/dirt_plain.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.dirtPebbleTile, path: 'assets/world/town/tiles/outdoor/dirt_pebbles.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.dirtEdgeTile, path: 'assets/world/town/tiles/outdoor/dirt_edge.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.roadStoneTile, path: 'assets/world/town/tiles/outdoor/road_stone.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.roadStoneAltTile, path: 'assets/world/town/tiles/outdoor/road_stone_alt.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.plazaStoneTile, path: 'assets/world/town/tiles/outdoor/plaza_stone.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.indoorWoodTile, path: 'assets/world/town/tiles/indoor/wood_planks.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.indoorDarkWoodTile, path: 'assets/world/town/tiles/indoor/dark_wood_planks.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.indoorWarmStoneTile, path: 'assets/world/town/tiles/indoor/warm_stone.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.indoorWorkshopStoneTile, path: 'assets/world/town/tiles/indoor/workshop_stone.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.indoorCleanBrickTile, path: 'assets/world/town/tiles/indoor/clean_brick.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.indoorWornBrickTile, path: 'assets/world/town/tiles/indoor/worn_brick.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.weaponMerchant, path: 'assets/world/town/npcs/weapon_merchant.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.itemMerchant, path: 'assets/world/town/npcs/item_merchant.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.relicMerchant, path: 'assets/world/town/npcs/relic_merchant.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.blacksmith, path: 'assets/world/town/npcs/master_blacksmith.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.villager, path: 'assets/world/town/npcs/villager.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.traveler, path: 'assets/world/town/npcs/traveler.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.child, path: 'assets/world/town/npcs/child.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.guardSpear, path: 'assets/world/town/npcs/guard_spear.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.guardSword, path: 'assets/world/town/npcs/guard_sword.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.guardCrossbow, path: 'assets/world/town/npcs/guard_crossbow.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.bench, path: 'assets/world/town/props/bench.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.crateStack, path: 'assets/world/town/props/crate_stack.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.lampPost, path: 'assets/world/town/props/lamp_post.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.noticeBoard, path: 'assets/world/town/props/notice_board.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.planter, path: 'assets/world/town/props/planter.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.shopUiSheet, path: 'assets/world/town/ui/shop_item_list_sheet.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.shopHeaderFrame, path: 'assets/world/town/ui/shop_header_frame.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.shopFeatureFrame, path: 'assets/world/town/ui/shop_feature_frame.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.shopListFrame, path: 'assets/world/town/ui/shop_list_frame.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.shopFooterFrame, path: 'assets/world/town/ui/shop_footer_frame.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.shopBottomBar, path: 'assets/world/town/ui/shop_bottom_bar.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.shopScrollUp, path: 'assets/world/town/ui/shop_scroll_up.png' },
  { key: TOWN_RUNTIME_IMAGE_KEYS.shopScrollDown, path: 'assets/world/town/ui/shop_scroll_down.png' },
] as const;

// Broken transition sprite sheets are intentionally disabled.
// The world-gate sheet is kept separate because the exit portal needs a visible animated marker.
export const TOWN_RUNTIME_SHEET_ASSETS: readonly RuntimeSheetAsset[] = [
  { key: TOWN_RUNTIME_IMAGE_KEYS.worldGateSheet, path: 'assets/world/town/effects/world_gate.png', frameWidth: 190, frameHeight: 161 },
] as const;

const BUILDING_KEYS: Partial<Record<TownShopId, string>> = {
  weapon_shop: TOWN_RUNTIME_IMAGE_KEYS.weaponShop,
  armor_shop: TOWN_RUNTIME_IMAGE_KEYS.armorShop,
  item_shop: TOWN_RUNTIME_IMAGE_KEYS.itemShop,
  forge_shop: TOWN_RUNTIME_IMAGE_KEYS.forgeShop,
  relic_shop: TOWN_RUNTIME_IMAGE_KEYS.relicShop,
};

const MERCHANT_KEYS: Partial<Record<TownShopId, string>> = {
  weapon_shop: TOWN_RUNTIME_IMAGE_KEYS.weaponMerchant,
  item_shop: TOWN_RUNTIME_IMAGE_KEYS.itemMerchant,
  forge_shop: TOWN_RUNTIME_IMAGE_KEYS.blacksmith,
  relic_shop: TOWN_RUNTIME_IMAGE_KEYS.relicMerchant,
};

const AMBIENT_KEYS: Record<string, string> = {
  guard_east: TOWN_RUNTIME_IMAGE_KEYS.guardSword,
  villager_plaza: TOWN_RUNTIME_IMAGE_KEYS.villager,
  runner_lane: TOWN_RUNTIME_IMAGE_KEYS.traveler,
  child_south: TOWN_RUNTIME_IMAGE_KEYS.child,
};

export const TOWN_RUNTIME_EXTERIOR_GRASS_TILE_KEYS = [
  TOWN_RUNTIME_IMAGE_KEYS.grassPlainTile,
  TOWN_RUNTIME_IMAGE_KEYS.grassWildTile,
  TOWN_RUNTIME_IMAGE_KEYS.grassPlainTile,
  TOWN_RUNTIME_IMAGE_KEYS.grassWhiteFlowersTile,
  TOWN_RUNTIME_IMAGE_KEYS.grassPlainTile,
  TOWN_RUNTIME_IMAGE_KEYS.grassYellowFlowersTile,
] as const;

export const TOWN_RUNTIME_EXTERIOR_ROAD_TILE_KEYS = [
  TOWN_RUNTIME_IMAGE_KEYS.roadStoneTile,
  TOWN_RUNTIME_IMAGE_KEYS.roadStoneAltTile,
] as const;

export const TOWN_RUNTIME_EXTERIOR_PLAZA_TILE_KEYS = [
  TOWN_RUNTIME_IMAGE_KEYS.plazaStoneTile,
  TOWN_RUNTIME_IMAGE_KEYS.roadStoneTile,
] as const;

export const TOWN_RUNTIME_EXTERIOR_DIRT_TILE_KEYS = [
  TOWN_RUNTIME_IMAGE_KEYS.dirtPlainTile,
  TOWN_RUNTIME_IMAGE_KEYS.dirtPebbleTile,
  TOWN_RUNTIME_IMAGE_KEYS.dirtEdgeTile,
] as const;

export function getTownBuildingArtKey(shopId: TownShopId): string | null {
  return BUILDING_KEYS[shopId] ?? null;
}

export function getTownMerchantArtKey(shopId: TownShopId): string | null {
  return MERCHANT_KEYS[shopId] ?? null;
}

export function getTownAmbientArtKey(npcId: string): string | null {
  return AMBIENT_KEYS[npcId] ?? null;
}

export function getTownInteriorFloorTileKeys(shopId: TownShopId): readonly string[] {
  switch (shopId) {
    case 'weapon_shop':
      return [TOWN_RUNTIME_IMAGE_KEYS.indoorWoodTile];
    case 'armor_shop':
      return [TOWN_RUNTIME_IMAGE_KEYS.indoorWarmStoneTile];
    case 'item_shop':
      return [TOWN_RUNTIME_IMAGE_KEYS.indoorDarkWoodTile, TOWN_RUNTIME_IMAGE_KEYS.indoorWoodTile];
    case 'forge_shop':
      return [TOWN_RUNTIME_IMAGE_KEYS.indoorWorkshopStoneTile];
    case 'relic_shop':
      return [TOWN_RUNTIME_IMAGE_KEYS.indoorCleanBrickTile, TOWN_RUNTIME_IMAGE_KEYS.indoorWornBrickTile];
    default:
      return [TOWN_RUNTIME_IMAGE_KEYS.indoorWoodTile];
  }
}
