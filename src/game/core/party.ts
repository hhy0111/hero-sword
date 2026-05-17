import {
  getAllCharacters,
  getCharacter,
  getCharacterCopies,
  getCharacterTranscendence,
  getOwnedCharacterIds,
} from '../data/characters';
import { calculateEquipmentPower } from './equipment';
import type { BattleRole, SaveSnapshot } from '../types';

export interface PartyAssignmentResult {
  ok: boolean;
  snapshot: SaveSnapshot;
  reason?: 'not_owned' | 'duplicate' | 'invalid_slot';
}

export interface PartyRemovalResult {
  ok: boolean;
  snapshot: SaveSnapshot;
  reason?: 'invalid_slot' | 'minimum_party';
}

export interface PartySummaryEntry {
  id: string;
  name: string;
  role: BattleRole;
  rarity: number;
  power: number;
  transcendence: number;
}

const ROLE_PRESETS: Record<
  BattleRole,
  { maxHp: number; attackPower: number; attackIntervalMs: number }
> = {
  leader: { maxHp: 360, attackPower: 22, attackIntervalMs: 670 },
  guardian: { maxHp: 470, attackPower: 14, attackIntervalMs: 860 },
  mage: { maxHp: 280, attackPower: 26, attackIntervalMs: 740 },
  healer: { maxHp: 320, attackPower: 10, attackIntervalMs: 920 },
  ranger: { maxHp: 300, attackPower: 20, attackIntervalMs: 680 },
  support: { maxHp: 340, attackPower: 12, attackIntervalMs: 860 },
  warrior: { maxHp: 390, attackPower: 18, attackIntervalMs: 760 },
  assassin: { maxHp: 290, attackPower: 24, attackIntervalMs: 620 },
};

export function ensureValidParty(snapshot: SaveSnapshot): SaveSnapshot {
  const owned = new Set(getOwnedCharacterIds(snapshot));
  const nextParty: string[] = [];

  for (const characterId of snapshot.roster.selectedPartyIds) {
    if (!owned.has(characterId) || nextParty.includes(characterId)) {
      continue;
    }

    nextParty.push(characterId);
    if (nextParty.length >= 4) {
      break;
    }
  }

  return {
    ...snapshot,
    roster: {
      ...snapshot.roster,
      selectedPartyIds: nextParty,
    },
  };
}

export function assignPartyMember(
  snapshot: SaveSnapshot,
  slotIndex: number,
  characterId: string,
): PartyAssignmentResult {
  if (slotIndex < 0 || slotIndex >= 4) {
    return { ok: false, snapshot, reason: 'invalid_slot' };
  }

  if (getCharacterCopies(snapshot, characterId) <= 0) {
    return { ok: false, snapshot, reason: 'not_owned' };
  }

  if (snapshot.roster.selectedPartyIds.includes(characterId)) {
    return { ok: false, snapshot, reason: 'duplicate' };
  }

  const nextParty = [...snapshot.roster.selectedPartyIds];
  nextParty[slotIndex] = characterId;

  return {
    ok: true,
    snapshot: ensureValidParty({
      ...snapshot,
      roster: {
        ...snapshot.roster,
        selectedPartyIds: nextParty,
      },
    }),
  };
}

export function removePartyMember(snapshot: SaveSnapshot, slotIndex: number): PartyRemovalResult {
  const normalized = ensureValidParty(snapshot);
  if (slotIndex < 0 || slotIndex >= normalized.roster.selectedPartyIds.length) {
    return { ok: false, snapshot: normalized, reason: 'invalid_slot' };
  }

  if (normalized.roster.selectedPartyIds.length <= 1) {
    return { ok: false, snapshot: normalized, reason: 'minimum_party' };
  }

  const nextParty = normalized.roster.selectedPartyIds.filter((_, index) => index !== slotIndex);
  return {
    ok: true,
    snapshot: {
      ...normalized,
      roster: {
        ...normalized.roster,
        selectedPartyIds: nextParty,
      },
    },
  };
}

export function getPartySummary(snapshot: SaveSnapshot): PartySummaryEntry[] {
  return ensureValidParty(snapshot).roster.selectedPartyIds.map((characterId) => {
    const character = getCharacter(characterId);
    const transcendence = getCharacterTranscendence(snapshot, characterId);

    return {
      id: character.id,
      name: character.name,
      role: character.role,
      rarity: character.rarity,
      transcendence,
      power: computeCharacterPower(snapshot, characterId),
    };
  });
}

export function computeCharacterPower(snapshot: SaveSnapshot, characterId: string): number {
  const character = getCharacter(characterId);
  const base = 520 + character.rarity * 120;
  return base + getCharacterTranscendence(snapshot, characterId) * 80 + calculateEquipmentPower(snapshot, characterId);
}

export function calculatePartyPower(snapshot: SaveSnapshot): number {
  return getPartySummary(snapshot).reduce((sum, entry) => sum + entry.power, 0);
}

export function getRolePreset(role: BattleRole): { maxHp: number; attackPower: number; attackIntervalMs: number } {
  return ROLE_PRESETS[role];
}

export function getPartyCandidateIds(snapshot: SaveSnapshot): string[] {
  return getOwnedCharacterIds(snapshot);
}

export function getPartyCatalog(): PartySummaryEntry[] {
  return getAllCharacters().map((character) => ({
    id: character.id,
    name: character.name,
    role: character.role,
    rarity: character.rarity,
    transcendence: 0,
    power: 520 + character.rarity * 120,
  }));
}
