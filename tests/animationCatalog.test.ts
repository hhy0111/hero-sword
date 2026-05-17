import { describe, expect, it } from 'vitest';
import {
  getAnimationViewerAction,
  getAnimationViewerSubjects,
} from '../src/game/data/animationCatalog';
import { getAllCharacters } from '../src/game/data/characters';

describe('animation viewer catalog', () => {
  it('covers every playable character with at least the base animation set', () => {
    const subjects = getAnimationViewerSubjects('character');
    const characters = getAllCharacters();

    expect(subjects).toHaveLength(characters.length);

    for (const subject of subjects) {
      const actionIds = new Set(subject.actions.map((action) => action.id));
      expect(actionIds.has('idle')).toBe(true);
      expect(actionIds.has('walk')).toBe(true);
      expect(actionIds.has('run')).toBe(true);
      expect(actionIds.has('victory')).toBe(true);
      expect(actionIds.has('down_or_death')).toBe(true);
      expect(subject.actions.length).toBeGreaterThanOrEqual(9);
      expect(
        [
          'attack_basic_01',
          'heavy_attack',
          'skill_cast',
          'cast_start',
          'heal_cast',
          'aim',
          'shoot_loop',
        ].some((actionId) => actionIds.has(actionId)),
      ).toBe(true);
    }
  });

  it('provides grouped effect subjects with selectable actions', () => {
    const subjects = getAnimationViewerSubjects('effect');

    expect(subjects.length).toBeGreaterThanOrEqual(4);

    for (const subject of subjects) {
      expect(subject.actions.length).toBeGreaterThan(0);
      for (const action of subject.actions) {
        expect(getAnimationViewerAction('effect', subject.id, action.id).id).toBe(action.id);
      }
    }
  });

  it('exposes runtime-integrated enemy subjects in the viewer catalog', () => {
    const subjects = getAnimationViewerSubjects('enemy');
    const blackhorn = subjects.find((subject) => subject.id === 'blackhorn_chieftain');
    const morgan = subjects.find((subject) => subject.id === 'morgan');
    const boar = subjects.find((subject) => subject.id === 'corrupted_wild_boar');
    const elrent = subjects.find((subject) => subject.id === 'elrent');
    const barrowWraith = subjects.find((subject) => subject.id === 'barrow_wraith');
    const varkan = subjects.find((subject) => subject.id === 'varkan');

    expect(subjects.length).toBeGreaterThanOrEqual(30);
    expect(blackhorn?.actions.map((action) => action.id)).toContain('horn_sweep');
    expect(blackhorn?.actions.map((action) => action.id)).toContain('charge_start');
    expect(morgan?.actions.map((action) => action.id)).toContain('slam_burst');
    expect(morgan?.actions.map((action) => action.id)).toContain('roar_or_enrage');
    expect(boar?.actions.map((action) => action.id)).toContain('charge_impact');
    expect(elrent?.actions.map((action) => action.id)).toContain('tidal_burst');
    expect(barrowWraith?.actions.map((action) => action.id)).toContain('float');
    expect(varkan?.actions.map((action) => action.id)).toContain('charge_burst');
  });

  it('exposes runtime-integrated npc subjects in the viewer catalog', () => {
    const subjects = getAnimationViewerSubjects('npc');
    const weaponMerchant = subjects.find((subject) => subject.id === 'weapon_merchant');
    const villager = subjects.find((subject) => subject.id === 'villager');
    const guardSword = subjects.find((subject) => subject.id === 'guard_sword');

    expect(subjects.length).toBeGreaterThanOrEqual(9);
    expect(weaponMerchant?.actions.map((action) => action.id)).toContain('counter_stand');
    expect(weaponMerchant?.actions.map((action) => action.id)).toContain('turn_short_rotation');
    expect(villager?.actions.map((action) => action.id)).toContain('greet');
    expect(guardSword?.actions.map((action) => action.id)).toContain('patrol_walk');
    expect(guardSword?.actions.map((action) => action.id)).toContain('halt');
  });

  it('applies subject-specific character action overrides for integrated frame sheets', () => {
    const subjects = getAnimationViewerSubjects('character');
    const dorgan = subjects.find((subject) => subject.id === 'dorgan');
    const serena = subjects.find((subject) => subject.id === 'serena');
    const fin = subjects.find((subject) => subject.id === 'fin');
    const nazir = subjects.find((subject) => subject.id === 'nazir');
    const seraphin = subjects.find((subject) => subject.id === 'seraphin');
    const lucian = subjects.find((subject) => subject.id === 'lucian');

    expect(dorgan?.actions.map((action) => action.id)).toContain('charge');
    expect(dorgan?.actions.map((action) => action.id)).not.toContain('taunt_or_command');

    expect(serena?.actions.map((action) => action.id)).toContain('heal_cast');
    expect(serena?.actions.map((action) => action.id)).toContain('pray_idle');
    expect(serena?.actions.map((action) => action.id)).not.toContain('summon_or_rune');

    expect(fin?.actions.map((action) => action.id)).toContain('aim');
    expect(fin?.actions.map((action) => action.id)).toContain('shoot_loop');

    expect(nazir?.actions.map((action) => action.id)).toContain('stealth_entry');
    expect(seraphin?.actions.map((action) => action.id)).toContain('heal_cast');
    expect(seraphin?.actions.map((action) => action.id)).toContain('pray_idle');
    expect(lucian?.actions.map((action) => action.id)).toContain('attack_basic_03');
    expect(lucian?.actions.map((action) => action.id)).toContain('interact');
  });
});
