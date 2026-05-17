import { describe, expect, it } from 'vitest';
import { CONTINENTS, STAGES, getStagesForContinent } from '../src/game/data/world';

describe('world data', () => {
  it('contains six continents and one hundred forty-four stages', () => {
    expect(CONTINENTS).toHaveLength(6);
    expect(STAGES).toHaveLength(144);
  });

  it('gives each continent exactly twenty-four stages', () => {
    for (const continent of CONTINENTS) {
      expect(getStagesForContinent(continent.id)).toHaveLength(24);
    }
  });

  it('does not contain duplicate stage ids', () => {
    const uniqueIds = new Set(STAGES.map((stage) => stage.id));
    expect(uniqueIds.size).toBe(STAGES.length);
  });
});
