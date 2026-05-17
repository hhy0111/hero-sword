import type { StageDefinition } from '../types';

export type MonsterEncounterKind = 'grunt' | 'elite' | 'boss';
export type MonsterEncounterPattern = 'melee' | 'ranged' | 'charger' | 'caster' | 'boss';

export interface MonsterDefinition {
  id: string;
  continentId: string;
  name: string;
  pattern: MonsterEncounterPattern;
  kind: MonsterEncounterKind;
  runtimeSubjectId: string;
  summary: string;
}

export interface StageMonsterEncounterEntry {
  kind: MonsterEncounterKind;
  pattern: MonsterEncounterPattern;
  monsterId: string;
  name: string;
  runtimeSubjectId: string;
  spawnAtMs: number;
  lane: number;
}

type ContinentMonsterPatternPool = {
  melee: readonly [string, string];
  ranged: readonly [string, string];
  charger: readonly [string, string];
  caster: readonly [string, string];
  midBoss: string;
  finalBoss: string;
};

const MONSTERS: MonsterDefinition[] = [
  { id: 'meadow_slime', continentId: 'continent_01', name: '초원 슬라임', pattern: 'melee', kind: 'grunt', runtimeSubjectId: 'coastal_horror', summary: '초원 습지에 번진 점액형 몬스터.' },
  { id: 'thorn_wolf', continentId: 'continent_01', name: '가시늑대', pattern: 'charger', kind: 'grunt', runtimeSubjectId: 'thorn_wolf', summary: '평원 울타리 사이를 파고드는 야수.' },
  { id: 'bramble_kobold_slinger', continentId: 'continent_01', name: '브램블 코볼트 슬링어', pattern: 'ranged', kind: 'grunt', runtimeSubjectId: 'grassland_raider_vanguard', summary: '돌팔매와 독씨앗을 쓰는 소형 약탈병.' },
  { id: 'reed_shaman', continentId: 'continent_01', name: '갈대 주술사', pattern: 'caster', kind: 'elite', runtimeSubjectId: 'grassland_raider_vanguard', summary: '수로 독기를 불어넣는 평원 주술 적.' },
  { id: 'fence_raider', continentId: 'continent_01', name: '울타리 약탈병', pattern: 'melee', kind: 'grunt', runtimeSubjectId: 'grassland_raider_vanguard', summary: '개척 농가를 습격하는 흑월 잔당.' },
  { id: 'seed_bomber', continentId: 'continent_01', name: '검은씨앗 투척병', pattern: 'ranged', kind: 'elite', runtimeSubjectId: 'grassland_raider_vanguard', summary: '오염 씨앗을 원거리에서 퍼뜨리는 적.' },
  { id: 'tusk_boarling', continentId: 'continent_01', name: '엄니멧돼지', pattern: 'charger', kind: 'elite', runtimeSubjectId: 'corrupted_wild_boar', summary: '직선 돌진으로 전열을 흔드는 야수.' },
  { id: 'black_seed_cultist', continentId: 'continent_01', name: '흑씨앗 사육사', pattern: 'caster', kind: 'elite', runtimeSubjectId: 'grassland_raider_vanguard', summary: '평원 오염을 키우는 후방 지원 적.' },
  { id: 'blackhorn_chieftain', continentId: 'continent_01', name: '검은뿔 우두머리', pattern: 'boss', kind: 'boss', runtimeSubjectId: 'blackhorn_chieftain', summary: '평원 선봉을 이끄는 중간 우두머리.' },
  { id: 'morgan', continentId: 'continent_01', name: '초원의 폭식왕 모건', pattern: 'boss', kind: 'boss', runtimeSubjectId: 'morgan', summary: '그린헤이븐 조각을 노리는 평원 최종 보스.' },

  { id: 'soot_slime', continentId: 'continent_02', name: '그을음 슬라임', pattern: 'melee', kind: 'grunt', runtimeSubjectId: 'slag_automaton', summary: '용광 먼지와 슬래그가 뭉친 점액형 적.' },
  { id: 'ash_mine_worker', continentId: 'continent_02', name: '재광 광부', pattern: 'melee', kind: 'grunt', runtimeSubjectId: 'ash_mine_worker', summary: '광화에 오염된 광산 노동자.' },
  { id: 'scrap_kobold_gunner', continentId: 'continent_02', name: '고철 코볼트 사수', pattern: 'ranged', kind: 'grunt', runtimeSubjectId: 'slag_automaton', summary: '고철 투사체를 쏘는 산맥 코볼트.' },
  { id: 'furnace_rigger', continentId: 'continent_02', name: '용광 배관술사', pattern: 'caster', kind: 'elite', runtimeSubjectId: 'slag_automaton', summary: '증기와 불꽃을 조종하는 기술 병력.' },
  { id: 'chain_breaker', continentId: 'continent_02', name: '사슬 파쇄병', pattern: 'charger', kind: 'elite', runtimeSubjectId: 'ember_heavy_trooper', summary: '무거운 돌진으로 진형을 뚫는 돌격병.' },
  { id: 'ember_crossbowman', continentId: 'continent_02', name: '잿불 석궁수', pattern: 'ranged', kind: 'elite', runtimeSubjectId: 'slag_automaton', summary: '가연성 볼트를 쓰는 후방 병기.' },
  { id: 'slag_hound', continentId: 'continent_02', name: '슬래그 사냥개', pattern: 'charger', kind: 'grunt', runtimeSubjectId: 'ember_heavy_trooper', summary: '광맥 틈에서 튀어나오는 돌진형 괴수.' },
  { id: 'rune_forge_tender', continentId: 'continent_02', name: '룬 용광 조형사', pattern: 'caster', kind: 'elite', runtimeSubjectId: 'slag_automaton', summary: '조각 반응을 악용하는 룬 운용 적.' },
  { id: 'bares', continentId: 'continent_02', name: '철식 광부장 바레스', pattern: 'boss', kind: 'boss', runtimeSubjectId: 'bares', summary: '아이언리치 반란군을 움직이는 중간 보스.' },
  { id: 'dravorn', continentId: 'continent_02', name: '용광 군주 드라보른', pattern: 'boss', kind: 'boss', runtimeSubjectId: 'dravorn', summary: '산맥 심장부를 틀어쥔 최종 보스.' },

  { id: 'salt_slime', continentId: 'continent_03', name: '염수 슬라임', pattern: 'melee', kind: 'grunt', runtimeSubjectId: 'coastal_horror', summary: '짠 조수에 뒤섞인 해안 점액체.' },
  { id: 'mist_raider', continentId: 'continent_03', name: '해무 약탈병', pattern: 'ranged', kind: 'grunt', runtimeSubjectId: 'mist_raider', summary: '해무 속에서 견제 사격을 하는 적.' },
  { id: 'tide_kobold_harpooner', continentId: 'continent_03', name: '조수 코볼트 작살수', pattern: 'ranged', kind: 'elite', runtimeSubjectId: 'mist_raider', summary: '작살과 밧줄로 발을 묶는 해안형 코볼트.' },
  { id: 'brine_marauder', continentId: 'continent_03', name: '염수 습격병', pattern: 'melee', kind: 'grunt', runtimeSubjectId: 'mist_raider', summary: '난파선 잔해를 무기로 쓰는 해상 잔당.' },
  { id: 'coastal_horror', continentId: 'continent_03', name: '해안 파식수', pattern: 'charger', kind: 'elite', runtimeSubjectId: 'coastal_horror', summary: '물보라와 함께 돌진하는 해안 괴수.' },
  { id: 'drowned_rite_keeper', continentId: 'continent_03', name: '침수 의식사', pattern: 'caster', kind: 'elite', runtimeSubjectId: 'corrupted_sanctuary_guardian', summary: '조수문 의식을 유지하는 성소 적.' },
  { id: 'reef_stalker', continentId: 'continent_03', name: '산호 추적수', pattern: 'charger', kind: 'grunt', runtimeSubjectId: 'coastal_horror', summary: '암초 틈을 타고 접근하는 수중형 포식자.' },
  { id: 'sea_shrine_hexer', continentId: 'continent_03', name: '성소 저주술사', pattern: 'caster', kind: 'elite', runtimeSubjectId: 'corrupted_sanctuary_guardian', summary: '회복 의식을 오염시키는 해안 마도사.' },
  { id: 'elrent', continentId: 'continent_03', name: '심해 사제 엘렌트', pattern: 'boss', kind: 'boss', runtimeSubjectId: 'elrent', summary: '해안 성소를 타락시킨 중간 보스.' },
  { id: 'nereph', continentId: 'continent_03', name: '해룡의 사자 네레프', pattern: 'boss', kind: 'boss', runtimeSubjectId: 'nereph', summary: '블루미스트 조각을 수호하는 최종 보스.' },

  { id: 'frost_slime', continentId: 'continent_04', name: '서리 슬라임', pattern: 'melee', kind: 'grunt', runtimeSubjectId: 'barrow_wraith', summary: '빙설 마력을 머금은 점액형 언데드.' },
  { id: 'frozen_legion_trooper', continentId: 'continent_04', name: '동결 군단병', pattern: 'melee', kind: 'grunt', runtimeSubjectId: 'frozen_legion_trooper', summary: '설원 외곽을 지키는 냉기 병사.' },
  { id: 'grave_kobold_scout', continentId: 'continent_04', name: '묘역 코볼트 정찰병', pattern: 'ranged', kind: 'grunt', runtimeSubjectId: 'frozen_legion_trooper', summary: '차가운 투창을 던지는 묘역 정찰 적.' },
  { id: 'snow_hexer', continentId: 'continent_04', name: '눈보라 주술사', pattern: 'caster', kind: 'elite', runtimeSubjectId: 'barrow_wraith', summary: '시야를 가리는 설원 주술 적.' },
  { id: 'frost_hound', continentId: 'continent_04', name: '서리 사냥개', pattern: 'charger', kind: 'grunt', runtimeSubjectId: 'frost_hound', summary: '빙판을 미끄러지듯 파고드는 추적수.' },
  { id: 'ice_ward_archer', continentId: 'continent_04', name: '빙창 궁병', pattern: 'ranged', kind: 'elite', runtimeSubjectId: 'frozen_legion_trooper', summary: '방어선 뒤에서 얼음 화살을 쏘는 병력.' },
  { id: 'barrow_wraith', continentId: 'continent_04', name: '매장귀', pattern: 'caster', kind: 'elite', runtimeSubjectId: 'barrow_wraith', summary: '묘역의 기억을 끌어내는 영체 적.' },
  { id: 'avalanche_mauler', continentId: 'continent_04', name: '설사태 파쇄수', pattern: 'charger', kind: 'elite', runtimeSubjectId: 'frost_hound', summary: '설사태와 함께 짓쳐오는 설원 괴수.' },
  { id: 'hrod', continentId: 'continent_04', name: '서리 거인 흐로드', pattern: 'boss', kind: 'boss', runtimeSubjectId: 'hrod', summary: '봉인탑 외곽을 지키는 거대한 중간 보스.' },
  { id: 'valtern', continentId: 'continent_04', name: '동토의 군주 발테른', pattern: 'boss', kind: 'boss', runtimeSubjectId: 'valtern', summary: '프로스트벨 조각을 지키는 최종 보스.' },

  { id: 'glass_slime', continentId: 'continent_05', name: '유리모래 슬라임', pattern: 'melee', kind: 'grunt', runtimeSubjectId: 'ruin_automaton', summary: '유리화된 모래가 점액처럼 뭉친 몬스터.' },
  { id: 'dune_reaver', continentId: 'continent_05', name: '사구 습격병', pattern: 'melee', kind: 'grunt', runtimeSubjectId: 'mirage_raider', summary: '교역로와 오아시스를 노리는 근접 약탈자.' },
  { id: 'dune_kobold_slinger', continentId: 'continent_05', name: '사막 코볼트 투석병', pattern: 'ranged', kind: 'grunt', runtimeSubjectId: 'mirage_raider', summary: '유리 모래탄을 던지는 소형 약탈병.' },
  { id: 'sun_mirage_hexer', continentId: 'continent_05', name: '환영 태양술사', pattern: 'caster', kind: 'elite', runtimeSubjectId: 'ruin_automaton', summary: '신기루를 일으켜 진로를 비트는 주술 적.' },
  { id: 'sand_tracker_beast', continentId: 'continent_05', name: '모래 추적수', pattern: 'charger', kind: 'grunt', runtimeSubjectId: 'sand_tracker_beast', summary: '발자국을 타고 돌진하는 사막 야수.' },
  { id: 'bone_slinger', continentId: 'continent_05', name: '백골 투척수', pattern: 'ranged', kind: 'elite', runtimeSubjectId: 'mirage_raider', summary: '유적 뼈조각을 날리는 후방 병력.' },
  { id: 'ruin_automaton', continentId: 'continent_05', name: '유적 자동병기', pattern: 'caster', kind: 'elite', runtimeSubjectId: 'ruin_automaton', summary: '제국 유산으로 가동되는 고대 자동병기.' },
  { id: 'sunscorch_mauler', continentId: 'continent_05', name: '열사 파쇄병', pattern: 'charger', kind: 'elite', runtimeSubjectId: 'sand_tracker_beast', summary: '사막 열풍을 타고 들이받는 중장 병력.' },
  { id: 'setra', continentId: 'continent_05', name: '모래사자장 세트라', pattern: 'boss', kind: 'boss', runtimeSubjectId: 'setra', summary: '사막 군세의 중간 보스.' },
  { id: 'kazer', continentId: 'continent_05', name: '사막의 심판자 카제르', pattern: 'boss', kind: 'boss', runtimeSubjectId: 'kazer', summary: '선스카 조각을 틀어쥔 최종 보스.' },

  { id: 'sanctum_ooze', continentId: 'continent_06', name: '성역 점액체', pattern: 'melee', kind: 'grunt', runtimeSubjectId: 'black_moon_vanguard', summary: '성역 오염 잔류물이 괴물화한 점액체.' },
  { id: 'fallen_acolyte', continentId: 'continent_06', name: '타락 수련사', pattern: 'melee', kind: 'grunt', runtimeSubjectId: 'black_moon_vanguard', summary: '성역 교리를 뒤틀린 방향으로 따른 근접 적.' },
  { id: 'choir_kobold_caster', continentId: 'continent_06', name: '성가 코볼트 주술사', pattern: 'caster', kind: 'elite', runtimeSubjectId: 'black_moon_inquisitor', summary: '왜곡된 성가로 후방을 교란하는 소형 마도 적.' },
  { id: 'ashen_crossbowman', continentId: 'continent_06', name: '성역 석궁수', pattern: 'ranged', kind: 'grunt', runtimeSubjectId: 'black_moon_vanguard', summary: '광장과 성벽에서 지원 사격을 가하는 병력.' },
  { id: 'fallen_holy_knight', continentId: 'continent_06', name: '추락 성기사', pattern: 'charger', kind: 'elite', runtimeSubjectId: 'fallen_holy_knight', summary: '무너진 맹세를 안고 돌진하는 중장 기병.' },
  { id: 'choir_hexer', continentId: 'continent_06', name: '왜곡 성가술사', pattern: 'caster', kind: 'elite', runtimeSubjectId: 'black_moon_inquisitor', summary: '성역의 빛을 뒤틀어 저주로 바꾸는 적.' },
  { id: 'black_moon_vanguard', continentId: 'continent_06', name: '흑월 전위병', pattern: 'ranged', kind: 'elite', runtimeSubjectId: 'black_moon_vanguard', summary: '검은문 전진로를 지키는 성역 정예병.' },
  { id: 'gate_executioner', continentId: 'continent_06', name: '검은문 처형수', pattern: 'charger', kind: 'elite', runtimeSubjectId: 'fallen_holy_knight', summary: '문턱에서 침입자를 갈아버리는 처형 병력.' },
  { id: 'cardinal_serdin', continentId: 'continent_06', name: '추기경 세르딘', pattern: 'boss', kind: 'boss', runtimeSubjectId: 'cardinal_serdin', summary: '성역의 정치와 봉인을 악용한 중간 보스.' },
  { id: 'varkan', continentId: 'continent_06', name: '흑월왕 바르칸', pattern: 'boss', kind: 'boss', runtimeSubjectId: 'varkan', summary: '최후의 균열을 지키는 메인 엔딩 보스.' },
];

const MONSTER_MAP = new Map(MONSTERS.map((monster) => [monster.id, monster]));

const CONTINENT_POOLS: Record<string, ContinentMonsterPatternPool> = {
  continent_01: {
    melee: ['meadow_slime', 'fence_raider'],
    ranged: ['bramble_kobold_slinger', 'seed_bomber'],
    charger: ['thorn_wolf', 'tusk_boarling'],
    caster: ['reed_shaman', 'black_seed_cultist'],
    midBoss: 'blackhorn_chieftain',
    finalBoss: 'morgan',
  },
  continent_02: {
    melee: ['soot_slime', 'ash_mine_worker'],
    ranged: ['scrap_kobold_gunner', 'ember_crossbowman'],
    charger: ['slag_hound', 'chain_breaker'],
    caster: ['furnace_rigger', 'rune_forge_tender'],
    midBoss: 'bares',
    finalBoss: 'dravorn',
  },
  continent_03: {
    melee: ['salt_slime', 'brine_marauder'],
    ranged: ['mist_raider', 'tide_kobold_harpooner'],
    charger: ['reef_stalker', 'coastal_horror'],
    caster: ['drowned_rite_keeper', 'sea_shrine_hexer'],
    midBoss: 'elrent',
    finalBoss: 'nereph',
  },
  continent_04: {
    melee: ['frost_slime', 'frozen_legion_trooper'],
    ranged: ['grave_kobold_scout', 'ice_ward_archer'],
    charger: ['frost_hound', 'avalanche_mauler'],
    caster: ['snow_hexer', 'barrow_wraith'],
    midBoss: 'hrod',
    finalBoss: 'valtern',
  },
  continent_05: {
    melee: ['glass_slime', 'dune_reaver'],
    ranged: ['dune_kobold_slinger', 'bone_slinger'],
    charger: ['sand_tracker_beast', 'sunscorch_mauler'],
    caster: ['sun_mirage_hexer', 'ruin_automaton'],
    midBoss: 'setra',
    finalBoss: 'kazer',
  },
  continent_06: {
    melee: ['sanctum_ooze', 'fallen_acolyte'],
    ranged: ['ashen_crossbowman', 'black_moon_vanguard'],
    charger: ['fallen_holy_knight', 'gate_executioner'],
    caster: ['choir_kobold_caster', 'choir_hexer'],
    midBoss: 'cardinal_serdin',
    finalBoss: 'varkan',
  },
};

function getPoolVariantIndex(stage: StageDefinition): 0 | 1 {
  if (stage.order <= 8) {
    return 0;
  }
  return 1;
}

function getMonster(monsterId: string): MonsterDefinition {
  const monster = MONSTER_MAP.get(monsterId);
  if (!monster) {
    throw new Error(`Unknown monster: ${monsterId}`);
  }
  return monster;
}

function buildEntry(
  monsterId: string,
  spawnAtMs: number,
  lane: number,
  kind?: MonsterEncounterKind,
  pattern?: MonsterEncounterPattern,
): StageMonsterEncounterEntry {
  const monster = getMonster(monsterId);
  return {
    monsterId: monster.id,
    name: monster.name,
    runtimeSubjectId: monster.id,
    kind: kind ?? monster.kind,
    pattern: pattern ?? monster.pattern,
    spawnAtMs,
    lane,
  };
}

export function getMonsterDefinitions(): MonsterDefinition[] {
  return MONSTERS;
}

export function getStageMonsterEncounterPlan(stage: StageDefinition): StageMonsterEncounterEntry[] {
  const pool = CONTINENT_POOLS[stage.continentId];
  const variantIndex = getPoolVariantIndex(stage);
  const melee = pool.melee[variantIndex];
  const ranged = pool.ranged[variantIndex];
  const charger = pool.charger[variantIndex];
  const caster = pool.caster[variantIndex];

  switch (stage.stageType) {
    case 'intro':
      return [buildEntry(melee, 0, 0), buildEntry(ranged, 0, 2), buildEntry(charger, 1700, 1, 'elite')];
    case 'field':
    case 'pursuit':
      return [
        buildEntry(melee, 0, 0),
        buildEntry(ranged, 0, 2),
        buildEntry(ranged, 1400, 3, 'grunt'),
        buildEntry(charger, 2800, 1, 'elite'),
      ];
    case 'dungeon':
    case 'stronghold':
    case 'defense':
    case 'crisis':
      return [
        buildEntry(melee, 0, 0),
        buildEntry(melee, 0, 2),
        buildEntry(ranged, 1400, 3, 'elite'),
        buildEntry(caster, 3200, 1, 'elite'),
      ];
    case 'mid_boss':
      return [
        buildEntry(melee, 0, 0),
        buildEntry(ranged, 0, 2),
        buildEntry(pool.midBoss, 1800, 1, 'boss', 'boss'),
      ];
    case 'pre_boss':
      return [
        buildEntry(charger, 0, 0, 'grunt'),
        buildEntry(caster, 1200, 2, 'elite'),
        buildEntry(ranged, 2400, 3, 'elite'),
      ];
    case 'final_boss':
      return [
        buildEntry(melee, 0, 0, 'grunt'),
        buildEntry(ranged, 0, 3, 'grunt'),
        buildEntry(caster, 1600, 2, 'elite'),
        buildEntry(pool.finalBoss, 2800, 1, 'boss', 'boss'),
      ];
  }
}
