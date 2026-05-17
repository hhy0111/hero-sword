import type { ArmorClass, CharacterRarity, EquipmentStats, WeaponClass } from '../types';

function stats(partial: EquipmentStats): EquipmentStats {
  return partial;
}

const WEAPONS: WeaponDefinition[] = [
  {
    id: 'wp_rift_training_blade',
    name: 'Rift Training Blade',
    rarity: 3,
    weaponClass: 'sword',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ attack: 12, hp: 34, skillHaste: 2 }),
  },
  {
    id: 'wp_guard_sword',
    name: 'Bramble Guard Sword',
    rarity: 3,
    weaponClass: 'shield_sword',
    levelRequirement: 1,
    source: 'summon',
    stats: stats({ attack: 10, defense: 14, blockRate: 4 }),
  },
  {
    id: 'wp_star_tome',
    name: 'Starflare Tome',
    rarity: 3,
    weaponClass: 'tome',
    levelRequirement: 1,
    source: 'summon',
    stats: stats({ magic: 16, critRate: 3, skillHaste: 4 }),
  },
  {
    id: 'wp_sanctuary_staff',
    name: 'Sanctuary Staff',
    rarity: 3,
    weaponClass: 'staff',
    levelRequirement: 1,
    source: 'summon',
    stats: stats({ healPower: 18, hp: 55, statusResist: 5 }),
  },
  {
    id: 'wp_bramble_longbow',
    name: 'Bramble Longbow',
    rarity: 3,
    weaponClass: 'bow',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ attack: 13, critRate: 2, accuracy: 5 }),
  },
  {
    id: 'wp_forge_trial_hammer',
    name: 'Forge Trial Hammer',
    rarity: 3,
    weaponClass: 'war_hammer',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ attack: 15, defense: 8, statusAccuracy: 4 }),
  },
  {
    id: 'wp_ironburst_cannon',
    name: 'Ironburst Cannon',
    rarity: 4,
    weaponClass: 'cannon',
    levelRequirement: 1,
    source: 'event',
    stats: stats({ attack: 20, skillHaste: 5, pierce: 8 }),
  },
  {
    id: 'wp_rune_mark_hammer',
    name: 'Rune Mark Hammer',
    rarity: 3,
    weaponClass: 'rune_hammer',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ attack: 12, buffPower: 8, hp: 70 }),
  },
  {
    id: 'wp_coastline_spear',
    name: 'Coastline Spear',
    rarity: 3,
    weaponClass: 'spear',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ attack: 15, critDamage: 6, evadeRate: 2 }),
  },
  {
    id: 'wp_tide_ritual_staff',
    name: 'Tide Ritual Staff',
    rarity: 3,
    weaponClass: 'sea_staff',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ healPower: 14, skillHaste: 5, hp: 52 }),
  },
  {
    id: 'wp_tide_pistol',
    name: 'Tide Compass Pistol',
    rarity: 3,
    weaponClass: 'pistol',
    levelRequirement: 1,
    source: 'summon',
    stats: stats({ attack: 17, critRate: 5, accuracy: 8 }),
  },
  {
    id: 'wp_winter_guard_blade',
    name: 'Winter Guard Blade',
    rarity: 3,
    weaponClass: 'knight_sword',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ attack: 14, defense: 9, blockRate: 3 }),
  },
  {
    id: 'wp_training_greatsword',
    name: 'Training Greatsword',
    rarity: 3,
    weaponClass: 'greatsword',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ attack: 18, hp: 36, critDamage: 5 }),
  },
  {
    id: 'wp_archive_codex',
    name: 'Archive Codex',
    rarity: 3,
    weaponClass: 'record_book',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ magic: 13, skillHaste: 5, statusAccuracy: 4 }),
  },
  {
    id: 'wp_desert_scimitar',
    name: 'Desert Scimitar',
    rarity: 3,
    weaponClass: 'scimitar',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ attack: 16, evadeRate: 4, critRate: 3 }),
  },
  {
    id: 'wp_ruin_probe_staff',
    name: 'Ruin Probe Staff',
    rarity: 3,
    weaponClass: 'relic_staff',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ magic: 15, pierce: 6, skillHaste: 4 }),
  },
  {
    id: 'wp_guard_lance',
    name: 'Guard Lance',
    rarity: 3,
    weaponClass: 'lance',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ attack: 15, hp: 58, chargeDamage: 5 }),
  },
  {
    id: 'wp_blessed_training_blade',
    name: 'Blessed Training Blade',
    rarity: 3,
    weaponClass: 'holy_blade',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ attack: 15, defense: 10, healPower: 4 }),
  },
  {
    id: 'wp_chorus_staff',
    name: 'Chorus Staff',
    rarity: 3,
    weaponClass: 'hymn_staff',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ healPower: 16, skillHaste: 5, statusResist: 6 }),
  },
  {
    id: 'wp_shadow_dual_knives',
    name: 'Shadow Dual Knives',
    rarity: 3,
    weaponClass: 'daggers',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ attack: 17, critRate: 4, pierce: 6 }),
  },
  {
    id: 'wp_oath_blade',
    name: 'Oath Blade',
    rarity: 5,
    weaponClass: 'sword',
    levelRequirement: 1,
    source: 'summon',
    stats: stats({ attack: 18, hp: 48, skillHaste: 4 }),
  },
  {
    id: 'wp_black_moon_daggers',
    name: 'Black Moon Daggers',
    rarity: 5,
    weaponClass: 'daggers',
    levelRequirement: 1,
    source: 'summon',
    stats: stats({ attack: 22, critRate: 6, pierce: 12 }),
  },
  {
    id: 'wp_greenwind_bow',
    name: 'Greenwind Bow',
    rarity: 4,
    weaponClass: 'bow',
    levelRequirement: 1,
    source: 'summon',
    stats: stats({ attack: 15, critRate: 4, pierce: 6 }),
  },
  {
    id: 'wp_sand_relic_staff',
    name: 'Sand Relic Staff',
    rarity: 4,
    weaponClass: 'relic_staff',
    levelRequirement: 1,
    source: 'summon',
    stats: stats({ magic: 21, pierce: 10, skillHaste: 5 }),
  },
  {
    id: 'wp_frost_greatsword',
    name: 'Frost Greatsword',
    rarity: 4,
    weaponClass: 'greatsword',
    levelRequirement: 1,
    source: 'summon',
    stats: stats({ attack: 24, critDamage: 10, hp: 45 }),
  },
  {
    id: 'wp_oasis_lance',
    name: 'Oasis Lance',
    rarity: 4,
    weaponClass: 'lance',
    levelRequirement: 1,
    source: 'summon',
    stats: stats({ attack: 18, hp: 80, chargeDamage: 8 }),
  },
  {
    id: 'wp_dawn_holy_blade',
    name: 'Dawn Holy Blade',
    rarity: 5,
    weaponClass: 'holy_blade',
    levelRequirement: 1,
    source: 'stage',
    stats: stats({ attack: 18, defense: 14, healPower: 6 }),
  },
  {
    id: 'wp_lumen_patrol_blade',
    name: 'Lumen Patrol Blade',
    rarity: 3,
    weaponClass: 'sword',
    levelRequirement: 3,
    source: 'shop',
    stats: stats({ attack: 17, hp: 42, skillHaste: 3 }),
  },
  {
    id: 'wp_bramble_wall_sword',
    name: 'Bramble Wall Sword',
    rarity: 3,
    weaponClass: 'shield_sword',
    levelRequirement: 3,
    source: 'shop',
    stats: stats({ attack: 14, defense: 18, blockRate: 5 }),
  },
  {
    id: 'wp_pathfinder_longbow',
    name: 'Pathfinder Longbow',
    rarity: 3,
    weaponClass: 'bow',
    levelRequirement: 4,
    source: 'shop',
    stats: stats({ attack: 18, critRate: 4, accuracy: 8 }),
  },
  {
    id: 'wp_apprentice_star_tome',
    name: 'Apprentice Star Tome',
    rarity: 3,
    weaponClass: 'tome',
    levelRequirement: 4,
    source: 'shop',
    stats: stats({ magic: 19, skillHaste: 5, statusAccuracy: 4 }),
  },
  {
    id: 'wp_sanctuary_oak_staff',
    name: 'Sanctuary Oak Staff',
    rarity: 3,
    weaponClass: 'staff',
    levelRequirement: 4,
    source: 'shop',
    stats: stats({ healPower: 21, hp: 70, statusResist: 6 }),
  },
  {
    id: 'wp_gatewatch_lance',
    name: 'Gatewatch Lance',
    rarity: 3,
    weaponClass: 'lance',
    levelRequirement: 6,
    source: 'shop',
    stats: stats({ attack: 20, hp: 74, chargeDamage: 7 }),
  },
  {
    id: 'wp_iron_pass_greatsword',
    name: 'Iron Pass Greatsword',
    rarity: 4,
    weaponClass: 'greatsword',
    levelRequirement: 8,
    source: 'shop',
    stats: stats({ attack: 28, hp: 55, critDamage: 12 }),
  },
  {
    id: 'wp_granforge_hammer',
    name: 'Granforge Hammer',
    rarity: 4,
    weaponClass: 'war_hammer',
    levelRequirement: 10,
    source: 'shop',
    stats: stats({ attack: 26, defense: 14, statusAccuracy: 7 }),
  },
  {
    id: 'wp_runeforge_mallet',
    name: 'Runeforge Mallet',
    rarity: 4,
    weaponClass: 'rune_hammer',
    levelRequirement: 10,
    source: 'shop',
    stats: stats({ attack: 22, buffPower: 14, hp: 105 }),
  },
  {
    id: 'wp_runebound_cannon',
    name: 'Runebound Cannon',
    rarity: 4,
    weaponClass: 'cannon',
    levelRequirement: 12,
    source: 'shop',
    stats: stats({ attack: 31, pierce: 12, skillHaste: 5 }),
  },
  {
    id: 'wp_tidecall_staff',
    name: 'Tidecall Staff',
    rarity: 4,
    weaponClass: 'sea_staff',
    levelRequirement: 12,
    source: 'shop',
    stats: stats({ healPower: 24, skillHaste: 7, hp: 86 }),
  },
  {
    id: 'wp_tidewatch_pistol',
    name: 'Tidewatch Pistol',
    rarity: 4,
    weaponClass: 'pistol',
    levelRequirement: 12,
    source: 'shop',
    stats: stats({ attack: 25, critRate: 7, accuracy: 12 }),
  },
  {
    id: 'wp_archive_record_book',
    name: 'Archive Record Book',
    rarity: 4,
    weaponClass: 'record_book',
    levelRequirement: 14,
    source: 'shop',
    stats: stats({ magic: 24, skillHaste: 8, statusAccuracy: 8 }),
  },
  {
    id: 'wp_relic_survey_staff',
    name: 'Relic Survey Staff',
    rarity: 4,
    weaponClass: 'relic_staff',
    levelRequirement: 16,
    source: 'shop',
    stats: stats({ magic: 27, pierce: 12, skillHaste: 6 }),
  },
  {
    id: 'wp_blackstep_daggers',
    name: 'Blackstep Daggers',
    rarity: 4,
    weaponClass: 'daggers',
    levelRequirement: 16,
    source: 'shop',
    stats: stats({ attack: 29, critRate: 8, pierce: 10 }),
  },
  {
    id: 'wp_sunscar_scimitar',
    name: 'Sunscar Scimitar',
    rarity: 4,
    weaponClass: 'scimitar',
    levelRequirement: 18,
    source: 'shop',
    stats: stats({ attack: 30, evadeRate: 7, critRate: 6 }),
  },
  {
    id: 'wp_palace_knight_sword',
    name: 'Palace Knight Sword',
    rarity: 5,
    weaponClass: 'knight_sword',
    levelRequirement: 22,
    source: 'shop',
    stats: stats({ attack: 34, defense: 20, blockRate: 7 }),
  },
  {
    id: 'wp_lumina_holy_blade',
    name: 'Lumina Holy Blade',
    rarity: 5,
    weaponClass: 'holy_blade',
    levelRequirement: 24,
    source: 'shop',
    stats: stats({ attack: 32, defense: 18, healPower: 12 }),
  },
  {
    id: 'wp_chorus_reliquary_staff',
    name: 'Chorus Reliquary Staff',
    rarity: 5,
    weaponClass: 'hymn_staff',
    levelRequirement: 24,
    source: 'shop',
    stats: stats({ healPower: 34, skillHaste: 9, statusResist: 12 }),
  },
];

const ARMORS: ArmorDefinition[] = [
  {
    id: 'ar_lumen_oath_plate',
    name: 'Lumen Oath Plate',
    rarity: 3,
    armorClass: 'plate',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ defense: 12, hp: 60, blockRate: 2 }),
  },
  {
    id: 'ar_bramble_guard_mail',
    name: 'Bramble Guard Mail',
    rarity: 3,
    armorClass: 'heavy',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ defense: 18, hp: 90, statusResist: 4 }),
  },
  {
    id: 'ar_pathfinder_battlewear',
    name: 'Pathfinder Battlewear',
    rarity: 3,
    armorClass: 'mobile',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ attack: 8, hp: 58, evadeRate: 3 }),
  },
  {
    id: 'ar_hunter_leather',
    name: 'Hunter Leather',
    rarity: 3,
    armorClass: 'light',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ attack: 7, evadeRate: 4, accuracy: 5 }),
  },
  {
    id: 'ar_starwatch_robe',
    name: 'Starwatch Robe',
    rarity: 3,
    armorClass: 'robe',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ magic: 10, skillHaste: 4, hp: 45 }),
  },
  {
    id: 'ar_sanctuary_vestment',
    name: 'Sanctuary Vestment',
    rarity: 3,
    armorClass: 'cleric',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ healPower: 12, hp: 55, statusResist: 5 }),
  },
  {
    id: 'ar_rune_work_apron',
    name: 'Rune Work Apron',
    rarity: 3,
    armorClass: 'runic',
    levelRequirement: 1,
    source: 'starter',
    stats: stats({ buffPower: 8, hp: 85, statusResist: 6 }),
  },
  {
    id: 'ar_rift_knight_plate',
    name: 'Rift Knight Plate',
    rarity: 5,
    armorClass: 'plate',
    levelRequirement: 1,
    source: 'stage',
    stats: stats({ defense: 16, hp: 82, critDamage: 6 }),
  },
  {
    id: 'ar_paladin_solar_mail',
    name: 'Paladin Solar Mail',
    rarity: 5,
    armorClass: 'heavy',
    levelRequirement: 1,
    source: 'stage',
    stats: stats({ defense: 17, hp: 88, healPower: 8 }),
  },
  {
    id: 'ar_black_moon_leather',
    name: 'Black Moon Leather',
    rarity: 5,
    armorClass: 'light',
    levelRequirement: 1,
    source: 'stage',
    stats: stats({ attack: 11, evadeRate: 5, pierce: 10 }),
  },
  {
    id: 'ar_ruin_oracle_robe',
    name: 'Ruin Oracle Robe',
    rarity: 4,
    armorClass: 'robe',
    levelRequirement: 1,
    source: 'stage',
    stats: stats({ magic: 11, pierce: 8, skillHaste: 4 }),
  },
  {
    id: 'ar_militia_plate',
    name: 'Militia Plate',
    rarity: 3,
    armorClass: 'plate',
    levelRequirement: 3,
    source: 'shop',
    stats: stats({ defense: 16, hp: 76, blockRate: 3 }),
  },
  {
    id: 'ar_militia_chainmail',
    name: 'Militia Chainmail',
    rarity: 3,
    armorClass: 'heavy',
    levelRequirement: 3,
    source: 'shop',
    stats: stats({ defense: 20, hp: 112, statusResist: 5 }),
  },
  {
    id: 'ar_travel_leather',
    name: 'Travel Leather',
    rarity: 3,
    armorClass: 'light',
    levelRequirement: 4,
    source: 'shop',
    stats: stats({ attack: 9, evadeRate: 5, accuracy: 6 }),
  },
  {
    id: 'ar_field_vestment',
    name: 'Field Vestment',
    rarity: 3,
    armorClass: 'cleric',
    levelRequirement: 4,
    source: 'shop',
    stats: stats({ healPower: 15, hp: 70, statusResist: 7 }),
  },
  {
    id: 'ar_scout_battlewear',
    name: 'Scout Battlewear',
    rarity: 3,
    armorClass: 'mobile',
    levelRequirement: 6,
    source: 'shop',
    stats: stats({ attack: 10, hp: 75, evadeRate: 4 }),
  },
  {
    id: 'ar_apprentice_robe',
    name: 'Apprentice Robe',
    rarity: 3,
    armorClass: 'robe',
    levelRequirement: 6,
    source: 'shop',
    stats: stats({ magic: 13, skillHaste: 5, hp: 60 }),
  },
  {
    id: 'ar_granforge_heavy_mail',
    name: 'Granforge Heavy Mail',
    rarity: 4,
    armorClass: 'heavy',
    levelRequirement: 10,
    source: 'shop',
    stats: stats({ defense: 26, hp: 150, statusResist: 8 }),
  },
  {
    id: 'ar_rune_apron',
    name: 'Rune Apron',
    rarity: 4,
    armorClass: 'runic',
    levelRequirement: 10,
    source: 'shop',
    stats: stats({ buffPower: 15, hp: 118, statusResist: 8 }),
  },
  {
    id: 'ar_coast_runner_coat',
    name: 'Coast Runner Coat',
    rarity: 4,
    armorClass: 'mobile',
    levelRequirement: 12,
    source: 'shop',
    stats: stats({ attack: 13, hp: 110, evadeRate: 7 }),
  },
  {
    id: 'ar_archive_rune_coat',
    name: 'Archive Rune Coat',
    rarity: 4,
    armorClass: 'robe',
    levelRequirement: 14,
    source: 'shop',
    stats: stats({ magic: 18, skillHaste: 7, statusAccuracy: 8 }),
  },
  {
    id: 'ar_frost_guard_plate',
    name: 'Frost Guard Plate',
    rarity: 5,
    armorClass: 'plate',
    levelRequirement: 20,
    source: 'shop',
    stats: stats({ defense: 32, hp: 178, blockRate: 8 }),
  },
  {
    id: 'ar_sunscar_light_armor',
    name: 'Sunscar Light Armor',
    rarity: 5,
    armorClass: 'light',
    levelRequirement: 22,
    source: 'shop',
    stats: stats({ attack: 17, evadeRate: 9, pierce: 12 }),
  },
  {
    id: 'ar_lumina_cleric_robe',
    name: 'Lumina Cleric Robe',
    rarity: 5,
    armorClass: 'cleric',
    levelRequirement: 24,
    source: 'shop',
    stats: stats({ healPower: 28, hp: 125, statusResist: 12 }),
  },
];

const WEAPON_MAP = new Map(WEAPONS.map((definition) => [definition.id, definition]));
const ARMOR_MAP = new Map(ARMORS.map((definition) => [definition.id, definition]));

const STARTER_WEAPON_BY_CLASS: Record<WeaponClass, string> = {
  sword: 'wp_rift_training_blade',
  shield_sword: 'wp_guard_sword',
  tome: 'wp_star_tome',
  staff: 'wp_sanctuary_staff',
  bow: 'wp_bramble_longbow',
  war_hammer: 'wp_forge_trial_hammer',
  cannon: 'wp_ironburst_cannon',
  rune_hammer: 'wp_rune_mark_hammer',
  spear: 'wp_coastline_spear',
  sea_staff: 'wp_tide_ritual_staff',
  pistol: 'wp_tide_pistol',
  knight_sword: 'wp_winter_guard_blade',
  greatsword: 'wp_training_greatsword',
  record_book: 'wp_archive_codex',
  scimitar: 'wp_desert_scimitar',
  relic_staff: 'wp_ruin_probe_staff',
  lance: 'wp_guard_lance',
  holy_blade: 'wp_blessed_training_blade',
  hymn_staff: 'wp_chorus_staff',
  daggers: 'wp_shadow_dual_knives',
};

const STARTER_ARMOR_BY_CLASS: Record<ArmorClass, string> = {
  plate: 'ar_lumen_oath_plate',
  heavy: 'ar_bramble_guard_mail',
  mobile: 'ar_pathfinder_battlewear',
  light: 'ar_hunter_leather',
  robe: 'ar_starwatch_robe',
  cleric: 'ar_sanctuary_vestment',
  runic: 'ar_rune_work_apron',
};

export interface WeaponDefinition {
  id: string;
  name: string;
  rarity: CharacterRarity;
  weaponClass: WeaponClass;
  levelRequirement: number;
  source: 'starter' | 'summon' | 'stage' | 'shop' | 'event';
  stats: EquipmentStats;
}

export interface ArmorDefinition {
  id: string;
  name: string;
  rarity: CharacterRarity;
  armorClass: ArmorClass;
  levelRequirement: number;
  source: 'starter' | 'summon' | 'stage' | 'shop' | 'event';
  stats: EquipmentStats;
}

export function getAllWeapons(): WeaponDefinition[] {
  return WEAPONS;
}

export function getAllArmors(): ArmorDefinition[] {
  return ARMORS;
}

export function getWeaponDefinition(id: string): WeaponDefinition {
  const definition = WEAPON_MAP.get(id);

  if (!definition) {
    throw new Error(`Unknown weapon definition: ${id}`);
  }

  return definition;
}

export function getArmorDefinition(id: string): ArmorDefinition {
  const definition = ARMOR_MAP.get(id);

  if (!definition) {
    throw new Error(`Unknown armor definition: ${id}`);
  }

  return definition;
}

export function getStarterWeaponIdForClass(weaponClass: WeaponClass): string {
  return STARTER_WEAPON_BY_CLASS[weaponClass];
}

export function getStarterArmorIdForClass(armorClass: ArmorClass): string {
  return STARTER_ARMOR_BY_CLASS[armorClass];
}
