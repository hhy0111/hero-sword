import { describe, expect, it } from 'vitest';
import { createBattleSimulation } from '../src/game/core/battle';
import {
  ensureEquipmentState,
  equipArmor,
  equipWeapon,
  getCharacterEquipment,
  getEquipableWeaponIds,
} from '../src/game/core/equipment';
import { computeCharacterPower } from '../src/game/core/party';
import { createInitialSnapshot, unlockStarterCompanion } from '../src/game/core/state';
import { STAGES } from '../src/game/data/world';

describe('equipment system', () => {
  it('provisions starter loadouts for the initial hero and recruited starter companion flow', () => {
    const snapshot = createInitialSnapshot();
    const heroEquipment = getCharacterEquipment(snapshot, 'hero');
    expect(heroEquipment.loadout.weaponId).not.toBeNull();
    expect(heroEquipment.loadout.armorId).not.toBeNull();

    const recruited = unlockStarterCompanion(snapshot, Date.now());
    for (const characterId of ['bram']) {
      const equipment = getCharacterEquipment(recruited, characterId);
      expect(equipment.loadout.weaponId).not.toBeNull();
      expect(equipment.loadout.armorId).not.toBeNull();
    }
  });

  it('increases character power when a stronger weapon is equipped', () => {
    const snapshot = createInitialSnapshot();
    const basePower = computeCharacterPower(snapshot, 'hero');

    snapshot.collection.weaponCopies.wp_oath_blade = 1;
    snapshot.collection.armorCopies.ar_rift_knight_plate = 1;

    const armed = equipWeapon(snapshot, 'hero', 'wp_oath_blade');
    expect(armed.ok).toBe(true);

    const armored = armed.ok ? equipArmor(armed.snapshot, 'hero', 'ar_rift_knight_plate') : armed;
    expect(armored.ok).toBe(true);

    if (armored.ok) {
      expect(computeCharacterPower(armored.snapshot, 'hero')).toBeGreaterThan(basePower);
    }
  });

  it('blocks a single premium armor copy from being equipped twice', () => {
    const snapshot = ensureEquipmentState(unlockStarterCompanion(createInitialSnapshot(), Date.now()));
    snapshot.roster.ownedCharacters.seraphin = { copies: 1 };
    snapshot.collection.armorCopies.ar_paladin_solar_mail = 1;
    const expanded = ensureEquipmentState(snapshot);

    const firstEquip = equipArmor(expanded, 'bram', 'ar_paladin_solar_mail');
    expect(firstEquip.ok).toBe(true);

    const secondEquip = firstEquip.ok ? equipArmor(firstEquip.snapshot, 'seraphin', 'ar_paladin_solar_mail') : firstEquip;
    expect(secondEquip.ok).toBe(false);
    expect(secondEquip.reason).toBe('no_copy');
  });

  it('applies equipped gear to battle attack and hp calculations', () => {
    const stage = STAGES[0];
    const baseSnapshot = createInitialSnapshot();
    const baseBattle = createBattleSimulation(stage, 'normal', baseSnapshot);
    const baseHero = baseBattle.party.find((member) => member.id === 'hero');

    const gearedSnapshot = createInitialSnapshot();
    gearedSnapshot.collection.weaponCopies.wp_oath_blade = 1;
    gearedSnapshot.collection.armorCopies.ar_rift_knight_plate = 1;
    const gearedWeapon = equipWeapon(gearedSnapshot, 'hero', 'wp_oath_blade');
    const gearedArmor = gearedWeapon.ok ? equipArmor(gearedWeapon.snapshot, 'hero', 'ar_rift_knight_plate') : gearedWeapon;
    expect(gearedArmor.ok).toBe(true);

    if (!baseHero || !gearedArmor.ok) {
      throw new Error('expected hero battle state to exist');
    }

    const gearedBattle = createBattleSimulation(stage, 'normal', gearedArmor.snapshot);
    const gearedHero = gearedBattle.party.find((member) => member.id === 'hero');

    expect(gearedHero?.attackPower ?? 0).toBeGreaterThan(baseHero.attackPower);
    expect(gearedHero?.maxHp ?? 0).toBeGreaterThan(baseHero.maxHp);
  });

  it('enforces equipment level requirements when equipping and listing options', () => {
    const snapshot = createInitialSnapshot();
    snapshot.collection.weaponCopies.wp_lumen_patrol_blade = 1;

    const tooEarly = equipWeapon(snapshot, 'hero', 'wp_lumen_patrol_blade');
    expect(tooEarly.ok).toBe(false);
    expect(tooEarly.reason).toBe('level_low');
    expect(getEquipableWeaponIds(snapshot, 'hero')).not.toContain('wp_lumen_patrol_blade');

    const leveled = {
      ...snapshot,
      roster: {
        ...snapshot.roster,
        characterProgress: {
          ...snapshot.roster.characterProgress,
          hero: { level: 3, exp: 0 },
        },
      },
    };

    const equipped = equipWeapon(leveled, 'hero', 'wp_lumen_patrol_blade');
    expect(equipped.ok).toBe(true);
    expect(getEquipableWeaponIds(leveled, 'hero')).toContain('wp_lumen_patrol_blade');
  });
});
