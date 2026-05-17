import type { ArmorClass, BattleRole, CharacterRarity, SaveSnapshot, WeaponClass } from '../types';

export interface CharacterDefinition {
  id: string;
  name: string;
  role: BattleRole;
  rarity: CharacterRarity;
  title: string;
  weaponType: string;
  weaponClass: WeaponClass;
  armorClass: ArmorClass;
}

export const STARTING_CHARACTER_IDS = ['hero', 'bram', 'sera', 'luna'] as const;

const CHARACTERS: CharacterDefinition[] = [
  { id: 'hero', name: 'Kain', role: 'leader', rarity: 5, title: 'Resonant Swordsman', weaponType: 'One-Hand Sword', weaponClass: 'sword', armorClass: 'plate' },
  { id: 'bram', name: 'Bram', role: 'guardian', rarity: 3, title: 'Shield Guard', weaponType: 'Shield Sword', weaponClass: 'shield_sword', armorClass: 'heavy' },
  { id: 'sera', name: 'Sera', role: 'mage', rarity: 4, title: 'Arcane Mage', weaponType: 'Spell Tome', weaponClass: 'tome', armorClass: 'robe' },
  { id: 'luna', name: 'Luna', role: 'healer', rarity: 4, title: 'Sanctuary Healer', weaponType: 'Sanctuary Staff', weaponClass: 'staff', armorClass: 'cleric' },
  { id: 'ria', name: 'Ria', role: 'healer', rarity: 3, title: 'Field Medic', weaponType: 'Sanctuary Staff', weaponClass: 'staff', armorClass: 'cleric' },
  { id: 'theo', name: 'Theo', role: 'ranger', rarity: 4, title: 'Wind Archer', weaponType: 'Longbow', weaponClass: 'bow', armorClass: 'light' },
  { id: 'dorgan', name: 'Dorgan', role: 'guardian', rarity: 4, title: 'Forge Vanguard', weaponType: 'War Hammer', weaponClass: 'war_hammer', armorClass: 'heavy' },
  { id: 'kiera', name: 'Kiera', role: 'mage', rarity: 5, title: 'Artillery Engineer', weaponType: 'Arc Cannon', weaponClass: 'cannon', armorClass: 'mobile' },
  { id: 'helma', name: 'Helma', role: 'support', rarity: 4, title: 'Rune Smith', weaponType: 'Rune Hammer', weaponClass: 'rune_hammer', armorClass: 'runic' },
  { id: 'marin', name: 'Marin', role: 'warrior', rarity: 4, title: 'Vanguard Spear', weaponType: 'Long Spear', weaponClass: 'spear', armorClass: 'mobile' },
  { id: 'serena', name: 'Serena', role: 'support', rarity: 4, title: 'Tide Ritualist', weaponType: 'Sea Staff', weaponClass: 'sea_staff', armorClass: 'cleric' },
  { id: 'fin', name: 'Fin', role: 'ranger', rarity: 3, title: 'Navigator Gunner', weaponType: 'Pistol', weaponClass: 'pistol', armorClass: 'light' },
  { id: 'iris', name: 'Iris', role: 'warrior', rarity: 5, title: 'Knight Vanguard', weaponType: 'Knight Sword', weaponClass: 'knight_sword', armorClass: 'plate' },
  { id: 'wolf', name: 'Wolf', role: 'warrior', rarity: 4, title: 'Greatsword Bruiser', weaponType: 'Greatsword', weaponClass: 'greatsword', armorClass: 'plate' },
  { id: 'erin', name: 'Erin', role: 'support', rarity: 4, title: 'Archive Keeper', weaponType: 'Record Book', weaponClass: 'record_book', armorClass: 'robe' },
  { id: 'nazir', name: 'Nazir', role: 'assassin', rarity: 4, title: 'Scimitar Duelist', weaponType: 'Scimitar', weaponClass: 'scimitar', armorClass: 'light' },
  { id: 'laila', name: 'Laila', role: 'mage', rarity: 5, title: 'Relic Scholar', weaponType: 'Relic Staff', weaponClass: 'relic_staff', armorClass: 'robe' },
  { id: 'hakan', name: 'Hakan', role: 'guardian', rarity: 4, title: 'Lance Sentinel', weaponType: 'Guard Lance', weaponClass: 'lance', armorClass: 'mobile' },
  { id: 'seraphin', name: 'Seraphin', role: 'guardian', rarity: 5, title: 'Holy Paladin', weaponType: 'Holy Blade', weaponClass: 'holy_blade', armorClass: 'heavy' },
  { id: 'micaela', name: 'Micaela', role: 'healer', rarity: 4, title: 'Choir Healer', weaponType: 'Hymn Staff', weaponClass: 'hymn_staff', armorClass: 'cleric' },
  { id: 'lucian', name: 'Lucian', role: 'assassin', rarity: 5, title: 'Moon Tracker', weaponType: 'Dual Daggers', weaponClass: 'daggers', armorClass: 'light' },
];

const CHARACTER_MAP = new Map(CHARACTERS.map((character) => [character.id, character]));

export function getAllCharacters(): CharacterDefinition[] {
  return CHARACTERS;
}

export function getCharacter(id: string): CharacterDefinition {
  const character = CHARACTER_MAP.get(id);

  if (!character) {
    throw new Error(`Unknown character: ${id}`);
  }

  return character;
}

export function getOwnedCharacterIds(snapshot: SaveSnapshot): string[] {
  return Object.entries(snapshot.roster.ownedCharacters)
    .filter(([, value]) => value.copies > 0)
    .map(([id]) => id)
    .sort((left, right) => {
      const leftCharacter = getCharacter(left);
      const rightCharacter = getCharacter(right);
      if (rightCharacter.rarity !== leftCharacter.rarity) {
        return rightCharacter.rarity - leftCharacter.rarity;
      }

      return leftCharacter.name.localeCompare(rightCharacter.name, 'en');
    });
}

export function getCharacterCopies(snapshot: SaveSnapshot, characterId: string): number {
  return snapshot.roster.ownedCharacters[characterId]?.copies ?? 0;
}

export function getCharacterTranscendence(snapshot: SaveSnapshot, characterId: string): number {
  return Math.min(5, Math.max(0, getCharacterCopies(snapshot, characterId) - 1));
}
