import { describe, expect, it } from 'vitest';
import { assignPartyMember, calculatePartyPower, ensureValidParty, removePartyMember } from '../src/game/core/party';
import { createInitialSnapshot, createShowcaseSnapshot } from '../src/game/core/state';

describe('party management', () => {
  it('blocks duplicate party assignments', () => {
    const snapshot = createInitialSnapshot();
    snapshot.roster.ownedCharacters.theo = { copies: 1 };

    const result = assignPartyMember(snapshot, 1, 'hero');
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('duplicate');
  });

  it('assigns an owned character to a slot and updates power', () => {
    const snapshot = createInitialSnapshot();
    snapshot.roster.ownedCharacters.theo = { copies: 1 };

    const result = assignPartyMember(snapshot, 1, 'theo');

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.snapshot.roster.selectedPartyIds[1]).toBe('theo');
      expect(calculatePartyPower(result.snapshot)).toBeGreaterThan(0);
    }
  });

  it('caps sanitized parties at four members', () => {
    const snapshot = createShowcaseSnapshot();
    snapshot.roster.selectedPartyIds = ['hero', 'seraphin', 'laila', 'lucian', 'bram', 'iris'];

    const normalized = ensureValidParty(snapshot);

    expect(normalized.roster.selectedPartyIds).toHaveLength(4);
    expect(normalized.roster.selectedPartyIds).toEqual(['hero', 'seraphin', 'laila', 'lucian']);
  });

  it('lets a party member be removed without refilling the slot from the roster', () => {
    const snapshot = createShowcaseSnapshot();

    const result = removePartyMember(snapshot, 1);

    expect(result.ok).toBe(true);
    expect(result.snapshot.roster.selectedPartyIds).toEqual(['hero', 'laila', 'lucian']);
  });
});
