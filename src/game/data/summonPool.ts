import type { CharacterRarity } from '../types';

export interface SummonPoolEntry {
  kind: 'character' | 'weapon';
  id: string;
  name: string;
  rarity: CharacterRarity;
}

const SUMMON_POOL: SummonPoolEntry[] = [
  { kind: 'character', id: 'seraphin', name: '세라핀', rarity: 5 },
  { kind: 'character', id: 'lucian', name: '루시안', rarity: 5 },
  { kind: 'character', id: 'laila', name: '라일라', rarity: 5 },
  { kind: 'character', id: 'kiera', name: '키에라', rarity: 5 },
  { kind: 'character', id: 'iris', name: '아이리스', rarity: 5 },
  { kind: 'weapon', id: 'wp_oath_blade', name: '서약의 성검', rarity: 5 },
  { kind: 'weapon', id: 'wp_black_moon_daggers', name: '흑월 추적쌍검', rarity: 5 },

  { kind: 'character', id: 'theo', name: '테오', rarity: 4 },
  { kind: 'character', id: 'dorgan', name: '도르간', rarity: 4 },
  { kind: 'character', id: 'helma', name: '헬마', rarity: 4 },
  { kind: 'character', id: 'marin', name: '마린', rarity: 4 },
  { kind: 'character', id: 'serena', name: '세레나', rarity: 4 },
  { kind: 'character', id: 'erin', name: '에린', rarity: 4 },
  { kind: 'character', id: 'nazir', name: '나지르', rarity: 4 },
  { kind: 'character', id: 'hakan', name: '하칸', rarity: 4 },
  { kind: 'character', id: 'micaela', name: '미카엘라', rarity: 4 },
  { kind: 'weapon', id: 'wp_greenwind_bow', name: '녹풍 장궁', rarity: 4 },
  { kind: 'weapon', id: 'wp_sand_relic_staff', name: '유적 해독지팡이', rarity: 4 },
  { kind: 'weapon', id: 'wp_frost_greatsword', name: '설원 참철대검', rarity: 4 },
  { kind: 'weapon', id: 'wp_oasis_lance', name: '오아시스 수호창', rarity: 4 },

  { kind: 'character', id: 'bram', name: '브람', rarity: 3 },
  { kind: 'character', id: 'sera', name: '세라', rarity: 3 },
  { kind: 'character', id: 'luna', name: '루나', rarity: 3 },
  { kind: 'character', id: 'ria', name: '리아', rarity: 3 },
  { kind: 'character', id: 'fin', name: '핀', rarity: 3 },
  { kind: 'character', id: 'wolf', name: '볼프', rarity: 3 },
  { kind: 'weapon', id: 'wp_guard_sword', name: '브램블 수호검', rarity: 3 },
  { kind: 'weapon', id: 'wp_star_tome', name: '별맥 점화서', rarity: 3 },
  { kind: 'weapon', id: 'wp_sanctuary_staff', name: '성소 회복봉', rarity: 3 },
  { kind: 'weapon', id: 'wp_tide_pistol', name: '침묵의 나침권총', rarity: 3 },
];

export function getSummonPoolByRarity(rarity: CharacterRarity): SummonPoolEntry[] {
  return SUMMON_POOL.filter((entry) => entry.rarity === rarity);
}
