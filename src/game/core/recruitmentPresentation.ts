import type { CharacterRarity } from '../types';

export type RecruitmentEffectPhase = 'idle' | 'flight' | 'reveal' | 'done';

export interface RecruitmentCardFlightSpec {
  startX: number;
  startY: number;
  landX: number;
  landY: number;
  startAngle: number;
  spinAngle: number;
  startScale: number;
  landScale: number;
  flightMs: number;
  revealDelayMs: number;
  holdMs: number;
  fadeMs: number;
  particleCount: number;
  particleRadius: number;
}

export function buildRecruitmentCardFlightSpec(rarity: CharacterRarity): RecruitmentCardFlightSpec {
  const rarityBoost = rarity - 3;

  return {
    startX: -112,
    startY: 272,
    landX: 180,
    landY: 304,
    startAngle: -54,
    spinAngle: 720 + rarityBoost * 180,
    startScale: 0.56,
    landScale: 1,
    flightMs: 800 + rarityBoost * 60,
    revealDelayMs: 110,
    holdMs: 1900 + rarityBoost * 160,
    fadeMs: 260,
    particleCount: 12 + rarityBoost * 5,
    particleRadius: 74 + rarityBoost * 10,
  };
}

export function getRecruitmentAcquisitionTitle(characterName: string): string {
  return `${characterName} 획득`;
}

export function getRecruitmentJoinedRosterMessage(characterName: string): string {
  return `${characterName}${getKoreanSubjectParticle(characterName)} 로스터에 합류했습니다.`;
}

function getKoreanSubjectParticle(value: string): '이' | '가' {
  const lastCharacter = Array.from(value.trim()).pop();
  if (!lastCharacter) {
    return '가';
  }

  const code = lastCharacter.charCodeAt(0);
  const hangulOffset = code - 0xac00;
  if (hangulOffset < 0 || hangulOffset > 11171) {
    return '가';
  }

  return hangulOffset % 28 === 0 ? '가' : '이';
}
