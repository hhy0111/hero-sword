import { describe, expect, it } from 'vitest';
import {
  buildRecruitmentCardFlightSpec,
  getRecruitmentAcquisitionTitle,
  getRecruitmentJoinedRosterMessage,
} from '../src/game/core/recruitmentPresentation';

describe('recruitment presentation', () => {
  it('flies the acquired character card in from offscreen with a full spin', () => {
    const spec = buildRecruitmentCardFlightSpec(4);

    expect(spec.startX).toBeLessThan(0);
    expect(spec.landX).toBe(180);
    expect(spec.landY).toBe(304);
    expect(spec.spinAngle).toBeGreaterThanOrEqual(720);
    expect(spec.startScale).toBeLessThan(spec.landScale);
    expect(spec.flightMs).toBeGreaterThanOrEqual(700);
  });

  it('adds more reveal particles for higher rarity characters', () => {
    const rareSpec = buildRecruitmentCardFlightSpec(3);
    const legendarySpec = buildRecruitmentCardFlightSpec(5);

    expect(legendarySpec.particleCount).toBeGreaterThan(rareSpec.particleCount);
    expect(legendarySpec.holdMs).toBeGreaterThanOrEqual(rareSpec.holdMs);
  });

  it('uses an explicit acquisition title after recruitment dialogue finishes', () => {
    expect(getRecruitmentAcquisitionTitle('리아')).toBe('리아 획득');
  });

  it('uses the correct Korean subject particle in the roster join message', () => {
    expect(getRecruitmentJoinedRosterMessage('리아')).toBe('리아가 로스터에 합류했습니다.');
    expect(getRecruitmentJoinedRosterMessage('카인')).toBe('카인이 로스터에 합류했습니다.');
  });
});
