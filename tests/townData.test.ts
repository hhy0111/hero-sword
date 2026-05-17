import { describe, expect, it } from 'vitest';
import {
  getTownInterior,
  getTownSpawnDefinition,
  LUMEN_AMBIENT_NPCS,
  LUMEN_BUILDINGS,
  LUMEN_STATIC_BLOCKERS,
  LUMEN_TOWN_BOUNDS,
} from '../src/game/data/town';

describe('town data', () => {
  it('defines five enterable shop buildings with unique ids', () => {
    expect(LUMEN_BUILDINGS).toHaveLength(5);
    expect(new Set(LUMEN_BUILDINGS.map((entry) => entry.id)).size).toBe(LUMEN_BUILDINGS.length);
  });

  it('keeps shop doors and ambient NPC patrols inside the town bounds', () => {
    for (const building of LUMEN_BUILDINGS) {
      expect(building.door.x).toBeGreaterThan(0);
      expect(building.door.x).toBeLessThan(LUMEN_TOWN_BOUNDS.width);
      expect(building.door.y).toBeGreaterThan(0);
      expect(building.door.y).toBeLessThan(LUMEN_TOWN_BOUNDS.height);
      expect(getTownInterior(building.id).returnSpawnId).toBe(building.returnSpawnId);
    }

    for (const npc of LUMEN_AMBIENT_NPCS) {
      for (const point of npc.patrol) {
        expect(point.x).toBeGreaterThan(0);
        expect(point.x).toBeLessThan(LUMEN_TOWN_BOUNDS.width);
        expect(point.y).toBeGreaterThan(0);
        expect(point.y).toBeLessThan(LUMEN_TOWN_BOUNDS.height);
      }
    }
  });

  it('exposes stable spawn ids used for return travel', () => {
    for (const id of ['default', 'world_gate', ...LUMEN_BUILDINGS.map((entry) => entry.returnSpawnId)]) {
      expect(getTownSpawnDefinition(id).id).toBe(id);
    }
  });

  it('keeps static blockers within the town bounds', () => {
    for (const blocker of LUMEN_STATIC_BLOCKERS) {
      expect(blocker.x).toBeGreaterThanOrEqual(0);
      expect(blocker.y).toBeGreaterThanOrEqual(0);
      expect(blocker.x + blocker.width).toBeLessThanOrEqual(LUMEN_TOWN_BOUNDS.width);
      expect(blocker.y + blocker.height).toBeLessThanOrEqual(LUMEN_TOWN_BOUNDS.height);
    }
  });
});
