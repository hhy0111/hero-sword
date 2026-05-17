export interface FurnitureDefinition {
  id: string;
  name: string;
  slot: 'left' | 'center' | 'right';
  flavor: string;
}

const FURNITURE: FurnitureDefinition[] = [
  { id: 'wood_crate', name: '나무 상자', slot: 'left', flavor: '초기 정비용 수납 상자' },
  { id: 'training_dummy', name: '훈련 허수아비', slot: 'center', flavor: '거점 훈련을 상징하는 중앙 장식' },
  { id: 'small_plant', name: '작은 화분', slot: 'right', flavor: '마을 분위기를 살리는 기본 장식' },
  { id: 'knight_banner', name: '기사단 배너', slot: 'left', flavor: '연합 세력을 상징하는 깃발 장식' },
  { id: 'hero_sword_rack', name: '검 진열대', slot: 'center', flavor: '검 복원 여정을 보여 주는 거치대' },
  { id: 'lumen_lamp', name: '루멘 램프', slot: 'right', flavor: '따뜻한 거점 분위기를 만드는 조명' },
];

const FURNITURE_MAP = new Map(FURNITURE.map((entry) => [entry.id, entry]));

export function getFurniture(id: string): FurnitureDefinition {
  const furniture = FURNITURE_MAP.get(id);

  if (!furniture) {
    throw new Error(`Unknown furniture: ${id}`);
  }

  return furniture;
}

export function getFurnitureBySlot(slot: FurnitureDefinition['slot']): FurnitureDefinition[] {
  return FURNITURE.filter((entry) => entry.slot === slot);
}
