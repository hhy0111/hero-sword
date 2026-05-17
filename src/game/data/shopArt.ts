import type { ArmorClass, WeaponClass } from '../types';

export interface ShopVisualRef {
  thumbnailId: string;
  detailId: string;
  fallbackFrame: number;
  accentColor: number;
}

export function buildShopThumbnailTextureKey(thumbnailId: string): string {
  return `shop:item-thumb:${thumbnailId}`;
}

export function buildShopDetailTextureKey(detailId: string): string {
  return `shop:item-detail:${detailId}`;
}

export function createOfferVisualRef(
  offerId: string,
  fallbackFrame: number,
  accentColor: number,
): ShopVisualRef {
  return createShopVisualRef(getOfferVisualBaseId(offerId), fallbackFrame, accentColor);
}

export function createWeaponVisualRef(
  weaponId: string,
  weaponClass: WeaponClass,
  fallbackFrame: number,
): ShopVisualRef {
  return createShopVisualRef(
    getWeaponVisualBaseId(weaponId, weaponClass),
    fallbackFrame,
    getWeaponAccentColor(weaponClass),
  );
}

export function createArmorVisualRef(
  armorId: string,
  armorClass: ArmorClass,
  fallbackFrame: number,
): ShopVisualRef {
  return createShopVisualRef(
    getArmorVisualBaseId(armorId, armorClass),
    fallbackFrame,
    getArmorAccentColor(armorClass),
  );
}

export function createFurnitureVisualRef(
  furnitureId: string,
  fallbackFrame: number,
): ShopVisualRef {
  return createShopVisualRef(`furniture_${furnitureId}`, fallbackFrame, 0xc29a67);
}

export function createSupplyVisualRef(
  supplyId: string,
  fallbackFrame: number,
): ShopVisualRef {
  return createShopVisualRef(`supply_${supplyId}`, fallbackFrame, 0x6f9dbb);
}

export function getShopThumbnailTextureKey(visual: ShopVisualRef): string {
  return buildShopThumbnailTextureKey(visual.thumbnailId);
}

export function getShopDetailTextureKey(visual: ShopVisualRef): string {
  return buildShopDetailTextureKey(visual.detailId);
}

function createShopVisualRef(
  baseId: string,
  fallbackFrame: number,
  accentColor: number,
): ShopVisualRef {
  return {
    thumbnailId: `${baseId}_thumb`,
    detailId: `${baseId}_detail`,
    fallbackFrame,
    accentColor,
  };
}

function getOfferVisualBaseId(offerId: string): string {
  switch (offerId) {
    case 'weapon_edge_oil':
      return 'consumable_amber_oil';
    case 'weapon_banner_rack':
      return 'icon_weapon_shop';
    case 'armor_padding_roll':
      return 'supply_padding_roll';
    case 'armor_cloak_stand':
      return 'icon_armor_shop';
    case 'fatigue_tonic_small':
    case 'item_field_ration_bundle':
      return 'consumable_blue_vial';
    case 'fatigue_tonic_large':
    case 'item_route_guard_supplies':
    case 'item_frontline_recovery_case':
      return 'consumable_blue_bottle';
    case 'forge_repair_box':
      return 'consumable_tool_box';
    case 'forge_anvil_display':
      return 'forge_anvil_token';
    case 'relic_sigil_bundle':
      return 'relic_seal';
    case 'relic_archive_lamp':
      return 'relic_lantern';
    default:
      return `offer_${offerId}`;
  }
}

function getWeaponVisualBaseId(weaponId: string, weaponClass: WeaponClass): string {
  switch (weaponId) {
    case 'wp_oath_blade':
    case 'wp_dawn_holy_blade':
    case 'wp_lumina_holy_blade':
      return 'weapon_sword_oath';
    case 'wp_training_greatsword':
    case 'wp_frost_greatsword':
    case 'wp_iron_pass_greatsword':
      return 'weapon_greatsword';
    case 'wp_coastline_spear':
    case 'wp_guard_lance':
    case 'wp_oasis_lance':
    case 'wp_gatewatch_lance':
      return 'weapon_spear';
    case 'wp_bramble_longbow':
    case 'wp_greenwind_bow':
    case 'wp_pathfinder_longbow':
      return 'weapon_bow';
    case 'wp_forge_trial_hammer':
    case 'wp_rune_mark_hammer':
    case 'wp_ironburst_cannon':
    case 'wp_granforge_hammer':
    case 'wp_runeforge_mallet':
    case 'wp_runebound_cannon':
      return 'weapon_hammer';
    case 'wp_sanctuary_staff':
    case 'wp_tide_ritual_staff':
    case 'wp_chorus_staff':
    case 'wp_sanctuary_oak_staff':
    case 'wp_tidecall_staff':
    case 'wp_chorus_reliquary_staff':
      return 'weapon_crystal_staff';
    case 'wp_ruin_probe_staff':
    case 'wp_sand_relic_staff':
    case 'wp_relic_survey_staff':
      return 'weapon_orb_staff';
    case 'wp_star_tome':
    case 'wp_apprentice_star_tome':
      return 'weapon_tome';
    case 'wp_archive_codex':
    case 'wp_archive_record_book':
      return 'weapon_record_book';
    case 'wp_tide_pistol':
    case 'wp_tidewatch_pistol':
      return 'weapon_pistol';
    case 'wp_desert_scimitar':
    case 'wp_sunscar_scimitar':
      return 'weapon_scimitar';
    case 'wp_shadow_dual_knives':
    case 'wp_black_moon_daggers':
    case 'wp_blackstep_daggers':
      return 'weapon_daggers';
    case 'wp_rift_training_blade':
    case 'wp_guard_sword':
    case 'wp_winter_guard_blade':
    case 'wp_blessed_training_blade':
    case 'wp_lumen_patrol_blade':
    case 'wp_bramble_wall_sword':
    case 'wp_palace_knight_sword':
      return 'weapon_sword_basic';
    default:
      return getWeaponVisualBaseIdByClass(weaponId, weaponClass);
  }
}

function getWeaponVisualBaseIdByClass(weaponId: string, weaponClass: WeaponClass): string {
  switch (weaponClass) {
    case 'sword':
    case 'shield_sword':
    case 'knight_sword':
    case 'holy_blade':
      return 'weapon_sword_basic';
    case 'greatsword':
      return 'weapon_greatsword';
    case 'spear':
    case 'lance':
      return 'weapon_spear';
    case 'bow':
      return 'weapon_bow';
    case 'war_hammer':
    case 'rune_hammer':
    case 'cannon':
      return 'weapon_hammer';
    case 'staff':
    case 'sea_staff':
    case 'hymn_staff':
      return 'weapon_crystal_staff';
    case 'relic_staff':
      return 'weapon_orb_staff';
    case 'tome':
      return 'weapon_tome';
    case 'record_book':
      return 'weapon_record_book';
    case 'pistol':
      return 'weapon_pistol';
    case 'scimitar':
      return 'weapon_scimitar';
    case 'daggers':
      return 'weapon_daggers';
    default:
      return `weapon_${weaponId}`;
  }
}

function getArmorVisualBaseId(armorId: string, armorClass: ArmorClass): string {
  switch (armorId) {
    case 'ar_lumen_oath_plate':
    case 'ar_rift_knight_plate':
    case 'ar_militia_plate':
    case 'ar_frost_guard_plate':
      return 'armor_plate';
    case 'ar_bramble_guard_mail':
    case 'ar_paladin_solar_mail':
    case 'ar_militia_chainmail':
    case 'ar_granforge_heavy_mail':
      return 'armor_chain';
    case 'ar_pathfinder_battlewear':
    case 'ar_rune_work_apron':
    case 'ar_scout_battlewear':
    case 'ar_rune_apron':
    case 'ar_coast_runner_coat':
      return 'armor_leather';
    case 'ar_hunter_leather':
    case 'ar_black_moon_leather':
    case 'ar_sanctuary_vestment':
    case 'ar_travel_leather':
    case 'ar_field_vestment':
    case 'ar_sunscar_light_armor':
    case 'ar_lumina_cleric_robe':
      return 'armor_cloak';
    case 'ar_starwatch_robe':
    case 'ar_ruin_oracle_robe':
    case 'ar_apprentice_robe':
    case 'ar_archive_rune_coat':
      return 'armor_hood';
    default:
      return getArmorVisualBaseIdByClass(armorId, armorClass);
  }
}

function getArmorVisualBaseIdByClass(armorId: string, armorClass: ArmorClass): string {
  switch (armorClass) {
    case 'plate':
      return 'armor_plate';
    case 'heavy':
      return 'armor_chain';
    case 'mobile':
      return 'armor_leather';
    case 'light':
    case 'cleric':
      return 'armor_cloak';
    case 'robe':
    case 'runic':
      return 'armor_hood';
    default:
      return `armor_${armorId}`;
  }
}

function getWeaponAccentColor(weaponClass: WeaponClass): number {
  switch (weaponClass) {
    case 'bow':
    case 'daggers':
      return 0x5fa86b;
    case 'tome':
    case 'staff':
    case 'sea_staff':
    case 'record_book':
    case 'relic_staff':
    case 'hymn_staff':
      return 0x6c8ec7;
    case 'war_hammer':
    case 'rune_hammer':
    case 'cannon':
      return 0xb0724d;
    default:
      return 0xb68758;
  }
}

function getArmorAccentColor(armorClass: ArmorClass): number {
  switch (armorClass) {
    case 'light':
    case 'mobile':
      return 0x6ca87a;
    case 'robe':
    case 'cleric':
      return 0x7a88c5;
    case 'runic':
      return 0x8d78c6;
    default:
      return 0xb08a5a;
  }
}
