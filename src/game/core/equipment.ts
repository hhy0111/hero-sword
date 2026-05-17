import { getArmorDefinition, getStarterArmorIdForClass, getStarterWeaponIdForClass, getWeaponDefinition } from '../data/equipment';
import { getCharacter, getOwnedCharacterIds } from '../data/characters';
import { getCharacterProgress } from './progression';
import type {
  BattleRole,
  CharacterEquipmentState,
  EquipmentStats,
  SaveSnapshot,
} from '../types';

export interface EquipmentMutationResult {
  ok: boolean;
  snapshot: SaveSnapshot;
  reason?: 'not_owned' | 'invalid_item' | 'level_low' | 'no_copy';
}

export interface CharacterEquipmentView {
  loadout: CharacterEquipmentState;
  weapon: ReturnType<typeof getWeaponDefinition> | null;
  armor: ReturnType<typeof getArmorDefinition> | null;
  stats: EquipmentStats;
  powerBonus: number;
}

export interface BattleEquipmentBonus {
  attackPower: number;
  maxHp: number;
  attackIntervalReductionMs: number;
}

const EMPTY_LOADOUT: CharacterEquipmentState = {
  weaponId: null,
  armorId: null,
};

const EMPTY_STATS: EquipmentStats = {};

export function ensureEquipmentState(snapshot: SaveSnapshot): SaveSnapshot {
  const ownedCharacterIds = getOwnedCharacterIds(snapshot);
  const minimumStarterWeaponCopies: Record<string, number> = {};
  const minimumStarterArmorCopies: Record<string, number> = {};

  for (const characterId of ownedCharacterIds) {
    const character = getCharacter(characterId);
    const starterWeaponId = getStarterWeaponIdForClass(character.weaponClass);
    const starterArmorId = getStarterArmorIdForClass(character.armorClass);
    minimumStarterWeaponCopies[starterWeaponId] = (minimumStarterWeaponCopies[starterWeaponId] ?? 0) + 1;
    minimumStarterArmorCopies[starterArmorId] = (minimumStarterArmorCopies[starterArmorId] ?? 0) + 1;
  }

  const weaponCopies = { ...snapshot.collection.weaponCopies };
  for (const [itemId, minimumCount] of Object.entries(minimumStarterWeaponCopies)) {
    weaponCopies[itemId] = Math.max(weaponCopies[itemId] ?? 0, minimumCount);
  }

  const armorCopies = { ...snapshot.collection.armorCopies };
  for (const [itemId, minimumCount] of Object.entries(minimumStarterArmorCopies)) {
    armorCopies[itemId] = Math.max(armorCopies[itemId] ?? 0, minimumCount);
  }

  const explicitLoadouts = snapshot.collection.equipmentLoadouts ?? {};
  const reservedWeapons: Record<string, number> = {};
  const reservedArmors: Record<string, number> = {};
  const equipmentLoadouts: Record<string, CharacterEquipmentState> = {};

  for (const characterId of ownedCharacterIds) {
    const current = explicitLoadouts[characterId];
    const nextLoadout: CharacterEquipmentState = { ...EMPTY_LOADOUT };

    if (current?.weaponId && canEquipWeapon(normalizedSnapshot(snapshot, weaponCopies, armorCopies), characterId, current.weaponId)) {
      const availableCopies = (weaponCopies[current.weaponId] ?? 0) - (reservedWeapons[current.weaponId] ?? 0);
      if (availableCopies > 0) {
        nextLoadout.weaponId = current.weaponId;
        reservedWeapons[current.weaponId] = (reservedWeapons[current.weaponId] ?? 0) + 1;
      }
    }

    if (current?.armorId && canEquipArmor(normalizedSnapshot(snapshot, weaponCopies, armorCopies), characterId, current.armorId)) {
      const availableCopies = (armorCopies[current.armorId] ?? 0) - (reservedArmors[current.armorId] ?? 0);
      if (availableCopies > 0) {
        nextLoadout.armorId = current.armorId;
        reservedArmors[current.armorId] = (reservedArmors[current.armorId] ?? 0) + 1;
      }
    }

    equipmentLoadouts[characterId] = nextLoadout;
  }

  for (const characterId of ownedCharacterIds) {
    const hadExplicitLoadout = Object.prototype.hasOwnProperty.call(explicitLoadouts, characterId);

    if (hadExplicitLoadout) {
      continue;
    }

    const character = getCharacter(characterId);
    const starterWeaponId = getStarterWeaponIdForClass(character.weaponClass);
    const starterArmorId = getStarterArmorIdForClass(character.armorClass);
    const nextLoadout = equipmentLoadouts[characterId];

    if (!nextLoadout.weaponId) {
      const availableCopies = (weaponCopies[starterWeaponId] ?? 0) - (reservedWeapons[starterWeaponId] ?? 0);
      if (availableCopies > 0) {
        nextLoadout.weaponId = starterWeaponId;
        reservedWeapons[starterWeaponId] = (reservedWeapons[starterWeaponId] ?? 0) + 1;
      }
    }

    if (!nextLoadout.armorId) {
      const availableCopies = (armorCopies[starterArmorId] ?? 0) - (reservedArmors[starterArmorId] ?? 0);
      if (availableCopies > 0) {
        nextLoadout.armorId = starterArmorId;
        reservedArmors[starterArmorId] = (reservedArmors[starterArmorId] ?? 0) + 1;
      }
    }
  }

  return {
    ...snapshot,
    schemaVersion: 3,
    collection: {
      ...snapshot.collection,
      weaponCopies,
      armorCopies,
      equipmentLoadouts,
    },
  };
}

export function getCharacterEquipment(snapshot: SaveSnapshot, characterId: string): CharacterEquipmentView {
  const normalized = ensureEquipmentState(snapshot);
  const loadout = normalized.collection.equipmentLoadouts[characterId] ?? EMPTY_LOADOUT;
  const weapon = loadout.weaponId ? getWeaponDefinition(loadout.weaponId) : null;
  const armor = loadout.armorId ? getArmorDefinition(loadout.armorId) : null;
  const stats = addStats(weapon?.stats ?? EMPTY_STATS, armor?.stats ?? EMPTY_STATS);

  return {
    loadout,
    weapon,
    armor,
    stats,
    powerBonus: calculateEquipmentPowerFromStats(stats),
  };
}

export function getEquipableWeaponIds(snapshot: SaveSnapshot, characterId: string): string[] {
  const normalized = ensureEquipmentState(snapshot);
  const currentWeaponId = normalized.collection.equipmentLoadouts[characterId]?.weaponId ?? null;

  return Object.keys(normalized.collection.weaponCopies)
    .filter((itemId) => normalized.collection.weaponCopies[itemId] > 0)
    .filter((itemId) => canEquipWeapon(normalized, characterId, itemId))
    .filter((itemId) => itemId === currentWeaponId || getAvailableWeaponCopies(normalized, itemId, characterId) > 0)
    .sort((left, right) => {
      const leftDefinition = getWeaponDefinition(left);
      const rightDefinition = getWeaponDefinition(right);
      if (rightDefinition.rarity !== leftDefinition.rarity) {
        return rightDefinition.rarity - leftDefinition.rarity;
      }

      return leftDefinition.name.localeCompare(rightDefinition.name);
    });
}

export function getEquipableArmorIds(snapshot: SaveSnapshot, characterId: string): string[] {
  const normalized = ensureEquipmentState(snapshot);
  const currentArmorId = normalized.collection.equipmentLoadouts[characterId]?.armorId ?? null;

  return Object.keys(normalized.collection.armorCopies)
    .filter((itemId) => normalized.collection.armorCopies[itemId] > 0)
    .filter((itemId) => canEquipArmor(normalized, characterId, itemId))
    .filter((itemId) => itemId === currentArmorId || getAvailableArmorCopies(normalized, itemId, characterId) > 0)
    .sort((left, right) => {
      const leftDefinition = getArmorDefinition(left);
      const rightDefinition = getArmorDefinition(right);
      if (rightDefinition.rarity !== leftDefinition.rarity) {
        return rightDefinition.rarity - leftDefinition.rarity;
      }

      return leftDefinition.name.localeCompare(rightDefinition.name);
    });
}

export function equipWeapon(
  snapshot: SaveSnapshot,
  characterId: string,
  weaponId: string | null,
): EquipmentMutationResult {
  const normalized = ensureEquipmentState(snapshot);

  if (!normalized.roster.ownedCharacters[characterId] || normalized.roster.ownedCharacters[characterId].copies <= 0) {
    return { ok: false, snapshot: normalized, reason: 'not_owned' };
  }

  if (weaponId === null) {
    return {
      ok: true,
      snapshot: applyLoadoutMutation(normalized, characterId, { weaponId: null }),
    };
  }

  if (!canEquipWeaponClass(characterId, weaponId)) {
    return { ok: false, snapshot: normalized, reason: 'invalid_item' };
  }

  if (!meetsWeaponLevelRequirement(normalized, characterId, weaponId)) {
    return { ok: false, snapshot: normalized, reason: 'level_low' };
  }

  if (getAvailableWeaponCopies(normalized, weaponId, characterId) <= 0) {
    return { ok: false, snapshot: normalized, reason: 'no_copy' };
  }

  return {
    ok: true,
    snapshot: applyLoadoutMutation(normalized, characterId, { weaponId }),
  };
}

export function equipArmor(
  snapshot: SaveSnapshot,
  characterId: string,
  armorId: string | null,
): EquipmentMutationResult {
  const normalized = ensureEquipmentState(snapshot);

  if (!normalized.roster.ownedCharacters[characterId] || normalized.roster.ownedCharacters[characterId].copies <= 0) {
    return { ok: false, snapshot: normalized, reason: 'not_owned' };
  }

  if (armorId === null) {
    return {
      ok: true,
      snapshot: applyLoadoutMutation(normalized, characterId, { armorId: null }),
    };
  }

  if (!canEquipArmorClass(characterId, armorId)) {
    return { ok: false, snapshot: normalized, reason: 'invalid_item' };
  }

  if (!meetsArmorLevelRequirement(normalized, characterId, armorId)) {
    return { ok: false, snapshot: normalized, reason: 'level_low' };
  }

  if (getAvailableArmorCopies(normalized, armorId, characterId) <= 0) {
    return { ok: false, snapshot: normalized, reason: 'no_copy' };
  }

  return {
    ok: true,
    snapshot: applyLoadoutMutation(normalized, characterId, { armorId }),
  };
}

export function calculateEquipmentPower(snapshot: SaveSnapshot, characterId: string): number {
  return getCharacterEquipment(snapshot, characterId).powerBonus;
}

export function getBattleEquipmentBonus(
  snapshot: SaveSnapshot,
  characterId: string,
  role: BattleRole,
): BattleEquipmentBonus {
  const stats = getCharacterEquipment(snapshot, characterId).stats;
  const attack = stats.attack ?? 0;
  const magic = stats.magic ?? 0;
  const healPower = stats.healPower ?? 0;
  const hp = stats.hp ?? 0;
  const defense = stats.defense ?? 0;
  const skillHaste = stats.skillHaste ?? 0;
  const critRate = stats.critRate ?? 0;
  const pierce = stats.pierce ?? 0;
  const blockRate = stats.blockRate ?? 0;
  const buffPower = stats.buffPower ?? 0;

  const magicFactor = role === 'mage' ? 0.95 : role === 'support' ? 0.55 : 0.25;
  const healFactor = role === 'healer' ? 0.9 : role === 'support' || role === 'guardian' ? 0.5 : 0.12;

  return {
    attackPower: Math.round(attack + magic * magicFactor + healPower * healFactor + critRate * 0.6 + pierce * 0.35 + buffPower * 0.3),
    maxHp: Math.round(hp + defense * 5 + blockRate * 4),
    attackIntervalReductionMs: Math.min(180, Math.round(skillHaste * 10 + critRate * 2)),
  };
}

export function formatEquipmentStats(stats: EquipmentStats): string[] {
  const entries: Array<[keyof EquipmentStats, string]> = [
    ['attack', 'ATK'],
    ['magic', 'MAG'],
    ['hp', 'HP'],
    ['defense', 'DEF'],
    ['critRate', 'Crit'],
    ['critDamage', 'Crit DMG'],
    ['skillHaste', 'Haste'],
    ['healPower', 'Heal'],
    ['accuracy', 'Accuracy'],
    ['blockRate', 'Block'],
    ['evadeRate', 'Evade'],
    ['buffPower', 'Buff'],
    ['pierce', 'Pierce'],
    ['statusResist', 'Resist'],
    ['statusAccuracy', 'Status Hit'],
    ['chargeDamage', 'Charge'],
  ];

  return entries
    .filter(([key]) => (stats[key] ?? 0) > 0)
    .map(([key, label]) => `${label} +${stats[key]}`);
}

export function getAvailableWeaponCopies(
  snapshot: SaveSnapshot,
  weaponId: string,
  excludingCharacterId?: string,
): number {
  const normalized = ensureEquipmentState(snapshot);
  return Math.max(
    0,
    (normalized.collection.weaponCopies[weaponId] ?? 0) -
      countEquippedCopies(normalized, 'weaponId', weaponId, excludingCharacterId),
  );
}

export function getAvailableArmorCopies(
  snapshot: SaveSnapshot,
  armorId: string,
  excludingCharacterId?: string,
): number {
  const normalized = ensureEquipmentState(snapshot);
  return Math.max(
    0,
    (normalized.collection.armorCopies[armorId] ?? 0) -
      countEquippedCopies(normalized, 'armorId', armorId, excludingCharacterId),
  );
}

function canEquipWeapon(snapshot: SaveSnapshot, characterId: string, weaponId: string): boolean {
  return canEquipWeaponClass(characterId, weaponId) && meetsWeaponLevelRequirement(snapshot, characterId, weaponId);
}

function canEquipArmor(snapshot: SaveSnapshot, characterId: string, armorId: string): boolean {
  return canEquipArmorClass(characterId, armorId) && meetsArmorLevelRequirement(snapshot, characterId, armorId);
}

function canEquipWeaponClass(characterId: string, weaponId: string): boolean {
  return getCharacter(characterId).weaponClass === getWeaponDefinition(weaponId).weaponClass;
}

function canEquipArmorClass(characterId: string, armorId: string): boolean {
  return getCharacter(characterId).armorClass === getArmorDefinition(armorId).armorClass;
}

function meetsWeaponLevelRequirement(snapshot: SaveSnapshot, characterId: string, weaponId: string): boolean {
  return getCharacterProgress(snapshot, characterId).level >= getWeaponDefinition(weaponId).levelRequirement;
}

function meetsArmorLevelRequirement(snapshot: SaveSnapshot, characterId: string, armorId: string): boolean {
  return getCharacterProgress(snapshot, characterId).level >= getArmorDefinition(armorId).levelRequirement;
}

function normalizedSnapshot(
  snapshot: SaveSnapshot,
  weaponCopies: Record<string, number>,
  armorCopies: Record<string, number>,
): SaveSnapshot {
  return {
    ...snapshot,
    collection: {
      ...snapshot.collection,
      weaponCopies,
      armorCopies,
    },
  };
}

function applyLoadoutMutation(
  snapshot: SaveSnapshot,
  characterId: string,
  patch: Partial<CharacterEquipmentState>,
): SaveSnapshot {
  const current = snapshot.collection.equipmentLoadouts[characterId] ?? EMPTY_LOADOUT;

  return {
    ...snapshot,
    updatedAt: Date.now(),
    collection: {
      ...snapshot.collection,
      equipmentLoadouts: {
        ...snapshot.collection.equipmentLoadouts,
        [characterId]: {
          ...current,
          ...patch,
        },
      },
    },
  };
}

function countEquippedCopies(
  snapshot: SaveSnapshot,
  slot: 'weaponId' | 'armorId',
  itemId: string,
  excludingCharacterId?: string,
): number {
  return Object.entries(snapshot.collection.equipmentLoadouts).reduce((count, [characterId, loadout]) => {
    if (excludingCharacterId && characterId === excludingCharacterId) {
      return count;
    }

    return loadout[slot] === itemId ? count + 1 : count;
  }, 0);
}

function addStats(left: EquipmentStats, right: EquipmentStats): EquipmentStats {
  const next: EquipmentStats = {};
  const keys = new Set<keyof EquipmentStats>([
    ...Object.keys(left),
    ...Object.keys(right),
  ] as Array<keyof EquipmentStats>);

  for (const key of keys) {
    next[key] = (left[key] ?? 0) + (right[key] ?? 0);
  }

  return next;
}

export function calculateEquipmentPowerFromStats(stats: EquipmentStats): number {
  return Math.round(
    (stats.attack ?? 0) * 6 +
      (stats.magic ?? 0) * 6 +
      (stats.hp ?? 0) * 0.8 +
      (stats.defense ?? 0) * 5 +
      (stats.critRate ?? 0) * 18 +
      (stats.critDamage ?? 0) * 10 +
      (stats.skillHaste ?? 0) * 14 +
      (stats.healPower ?? 0) * 6 +
      (stats.accuracy ?? 0) * 4 +
      (stats.blockRate ?? 0) * 14 +
      (stats.evadeRate ?? 0) * 14 +
      (stats.buffPower ?? 0) * 16 +
      (stats.pierce ?? 0) * 5 +
      (stats.statusResist ?? 0) * 8 +
      (stats.statusAccuracy ?? 0) * 8 +
      (stats.chargeDamage ?? 0) * 10,
  );
}
