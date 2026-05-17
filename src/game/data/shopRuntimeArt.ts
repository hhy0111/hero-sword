import type { TownShopId } from './town';
import { buildShopDetailTextureKey, buildShopThumbnailTextureKey } from './shopArt';

export interface ShopRuntimeImageAsset {
  key: string;
  path: string;
}

const SHOP_ID_ORDER: readonly TownShopId[] = [
  'weapon_shop',
  'armor_shop',
  'item_shop',
  'forge_shop',
  'relic_shop',
] as const;

export const SHOP_RUNTIME_IMAGE_KEYS = {
  uiMainFrame: 'shop:ui:main-frame',
  uiHeaderBar: 'shop:ui:header-bar',
  uiSectionBar: 'shop:ui:section-bar',
  uiOfferRowNormal: 'shop:ui:offer-row-normal',
  uiOfferRowSelected: 'shop:ui:offer-row-selected',
  uiBagSlotNormal: 'shop:ui:bag-slot-normal',
  uiBagSlotSelected: 'shop:ui:bag-slot-selected',
  uiDetailOuterFrame: 'shop:ui:detail-outer-frame',
  uiDetailStage: 'shop:ui:detail-stage',
  uiDetailTextPanel: 'shop:ui:detail-text-panel',
  uiScrollBarVertical: 'shop:ui:scroll-bar-vertical',
  interiorTopShadow: 'shop:interior:top-shadow',
  merchantWeaponCounter: 'shop:merchant:weapon-counter',
  merchantArmorCounter: 'shop:merchant:armor-counter',
  merchantItemCounter: 'shop:merchant:item-counter',
  merchantForgeCounter: 'shop:merchant:forge-counter',
  merchantRelicCounter: 'shop:merchant:relic-counter',
  currencyGold: 'shop:currency:gold',
  currencyGem: 'shop:currency:gem',
  currencyHeroStone: 'shop:currency:hero-stone',
  currencyFatigue: 'shop:currency:fatigue',
  cashStarterPackThumb: 'shop:item-thumb:cash_starter_pack_thumb',
  cashStarterPackDetail: 'shop:item-detail:cash_starter_pack_detail',
  cashFatiguePackThumb: 'shop:item-thumb:cash_fatigue_pack_thumb',
  cashFatiguePackDetail: 'shop:item-detail:cash_fatigue_pack_detail',
} as const;

const SHOP_VISUAL_BASE_IDS = [
  'weapon_sword_basic',
  'weapon_sword_oath',
  'weapon_greatsword',
  'weapon_spear',
  'weapon_hammer',
  'weapon_bow',
  'weapon_crystal_staff',
  'weapon_orb_staff',
  'weapon_tome',
  'weapon_record_book',
  'weapon_pistol',
  'weapon_daggers',
  'weapon_scimitar',
  'armor_plate',
  'armor_chain',
  'armor_leather',
  'armor_cloak',
  'armor_hood',
  'consumable_red_potion',
  'consumable_blue_vial',
  'consumable_blue_bottle',
  'consumable_green_flask',
  'consumable_purple_vial',
  'consumable_amber_oil',
  'consumable_food_pack',
  'consumable_tool_box',
  'consumable_smoke_bomb',
  'consumable_charm',
  'forge_ingot',
  'forge_ember_core',
  'forge_bundle',
  'forge_anvil_token',
  'relic_sun_coin',
  'relic_seal',
  'relic_bracelet',
  'relic_lantern',
  'supply_padding_roll',
  'icon_weapon_shop',
  'icon_armor_shop',
  'icon_item_shop',
  'icon_forge_shop',
  'icon_relic_shop',
] as const;

export function getShopPurchaseBackgroundKey(shopId: TownShopId | undefined): string | null {
  if (!shopId) {
    return null;
  }
  return `shop:bg:purchase:${shopId}`;
}

export function getShopInteriorBackgroundKey(shopId: TownShopId): string {
  return `shop:bg:interior:${shopId}`;
}

export function getShopHeaderIconKey(shopId: TownShopId | undefined): string | null {
  if (!shopId) {
    return null;
  }
  return `shop:icon:${shopId}`;
}

export function getShopInteriorFloorPropKey(shopId: TownShopId): string {
  return `shop:decor:floor:${shopId}`;
}

export function getShopInteractionMarkerKey(shopId: TownShopId): string {
  return `shop:marker:${shopId}`;
}

export const SHOP_RUNTIME_IMAGE_ASSETS: readonly ShopRuntimeImageAsset[] = [
  ...buildShopBackgroundAssets(),
  ...buildShopUiAssets(),
  ...buildShopHeaderIcons(),
  ...buildMerchantAssets(),
  ...buildShopDecorAssets(),
  ...buildVisualAssets(),
] as const;

function buildShopBackgroundAssets(): ShopRuntimeImageAsset[] {
  return [
    ...SHOP_ID_ORDER.map((shopId) => ({
      key: getShopPurchaseBackgroundKey(shopId)!,
      path: `assets/world/town/shop-refresh/backgrounds/${shopId}_purchase.png`,
    })),
    ...SHOP_ID_ORDER.map((shopId) => ({
      key: getShopInteriorBackgroundKey(shopId),
      path: `assets/world/town/shop-refresh/interiors/${shopId}.png`,
    })),
  ];
}

function buildShopUiAssets(): ShopRuntimeImageAsset[] {
  return [
    { key: SHOP_RUNTIME_IMAGE_KEYS.uiMainFrame, path: 'assets/world/town/shop-refresh/ui/main_frame.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.uiHeaderBar, path: 'assets/world/town/shop-refresh/ui/header_bar.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.uiSectionBar, path: 'assets/world/town/shop-refresh/ui/section_bar.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.uiOfferRowNormal, path: 'assets/world/town/shop-refresh/ui/offer_row_normal.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.uiOfferRowSelected, path: 'assets/world/town/shop-refresh/ui/offer_row_selected.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.uiBagSlotNormal, path: 'assets/world/town/shop-refresh/ui/bag_slot_normal.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.uiBagSlotSelected, path: 'assets/world/town/shop-refresh/ui/bag_slot_selected.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.uiDetailOuterFrame, path: 'assets/world/town/shop-refresh/ui/detail_outer_frame.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.uiDetailStage, path: 'assets/world/town/shop-refresh/ui/detail_stage.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.uiDetailTextPanel, path: 'assets/world/town/shop-refresh/ui/detail_text_panel.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.uiScrollBarVertical, path: 'assets/world/town/shop-refresh/ui/scroll_bar_vertical.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.interiorTopShadow, path: 'assets/world/town/shop-refresh/overlays/interior_top_shadow.png' },
  ];
}

function buildShopHeaderIcons(): ShopRuntimeImageAsset[] {
  return SHOP_ID_ORDER.map((shopId) => ({
    key: getShopHeaderIconKey(shopId)!,
    path: `assets/world/town/shop-refresh/icons/${shopId}.png`,
  }));
}

function buildMerchantAssets(): ShopRuntimeImageAsset[] {
  return [
    { key: SHOP_RUNTIME_IMAGE_KEYS.merchantWeaponCounter, path: 'assets/world/town/shop-refresh/merchants/weapon_counter.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.merchantArmorCounter, path: 'assets/world/town/shop-refresh/merchants/armor_counter.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.merchantItemCounter, path: 'assets/world/town/shop-refresh/merchants/item_counter.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.merchantForgeCounter, path: 'assets/world/town/shop-refresh/merchants/forge_counter.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.merchantRelicCounter, path: 'assets/world/town/shop-refresh/merchants/relic_counter.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.currencyGold, path: 'assets/world/town/shop-refresh/icons/currency_gold.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.currencyGem, path: 'assets/world/town/shop-refresh/icons/currency_gem.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.currencyHeroStone, path: 'assets/world/town/shop-refresh/icons/currency_hero_stone.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.currencyFatigue, path: 'assets/world/town/shop-refresh/icons/currency_fatigue.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.cashStarterPackThumb, path: 'assets/world/town/shop-refresh/items/cash_starter_pack_thumb.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.cashStarterPackDetail, path: 'assets/world/town/shop-refresh/items/cash_starter_pack_detail.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.cashFatiguePackThumb, path: 'assets/world/town/shop-refresh/items/cash_fatigue_pack_thumb.png' },
    { key: SHOP_RUNTIME_IMAGE_KEYS.cashFatiguePackDetail, path: 'assets/world/town/shop-refresh/items/cash_fatigue_pack_detail.png' },
  ];
}

function buildShopDecorAssets(): ShopRuntimeImageAsset[] {
  return [
    ...SHOP_ID_ORDER.map((shopId) => ({
      key: getShopInteriorFloorPropKey(shopId),
      path: `assets/world/town/shop-refresh/decor/${shopId}_floor_prop.png`,
    })),
    ...SHOP_ID_ORDER.map((shopId) => ({
      key: getShopInteractionMarkerKey(shopId),
      path: `assets/world/town/shop-refresh/markers/${shopId}.png`,
    })),
  ];
}

function buildVisualAssets(): ShopRuntimeImageAsset[] {
  return SHOP_VISUAL_BASE_IDS.flatMap((baseId) => {
    return [
      {
        key: buildShopThumbnailTextureKey(`${baseId}_thumb`),
        path: `assets/world/town/shop-refresh/items/${baseId}_thumb.png`,
      },
      {
        key: buildShopDetailTextureKey(`${baseId}_detail`),
        path: `assets/world/town/shop-refresh/items/${baseId}_detail.png`,
      },
    ];
  });
}
