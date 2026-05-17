import type { DialogueLine, SaveSnapshot } from '../types';

export type StageStoryTrigger = 'pre_stage' | 'post_clear';

export interface StageStoryEvent {
  id: string;
  stageId: string;
  trigger: StageStoryTrigger;
  lines: DialogueLine[];
}

const STAGE_STORY_EVENTS: StageStoryEvent[] = [
  {
    id: 'pre_stage_01_01',
    stageId: 'stage_01_01',
    trigger: 'pre_stage',
    lines: [
      { speaker: { category: 'character', subjectId: 'bram', name: '브람' }, text: '평원은 아직 살아 있다. 동문만 버티면 브램블까지 숨통이 이어진다.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '그 숨통, 내가 연다. 오늘부터 조각을 향해 전진한다.' },
    ],
  },
  {
    id: 'post_stage_01_06',
    stageId: 'stage_01_06',
    trigger: 'post_clear',
    lines: [
      { speaker: { category: 'character', subjectId: 'ria', name: '리아' }, text: '곡물다리가 이어졌어요. 이제 평원 사람들도 우리가 정말 돌려세울 수 있다고 믿기 시작했어요.' },
      { speaker: { category: 'character', subjectId: 'sera', name: '세라' }, text: '좋아. 그러면 다음은 제방 안쪽이야. 저쪽부터가 진짜 적의 숨은 길이야.' },
    ],
  },
  {
    id: 'pre_stage_01_13',
    stageId: 'stage_01_13',
    trigger: 'pre_stage',
    lines: [
      { speaker: { category: 'character', subjectId: 'theo', name: '테오' }, text: '안개개울부터 적 움직임이 바뀌었어. 누가 평원을 통째로 흔들어 보고 있다는 뜻이지.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '그러면 우리가 먼저 언덕까지 올라가서 놈들의 눈을 꺾는다.' },
    ],
  },
  {
    id: 'post_stage_01_18',
    stageId: 'stage_01_18',
    trigger: 'post_clear',
    lines: [
      { speaker: { category: 'character', subjectId: 'bram', name: '브람' }, text: '수문이 버텼다. 브램블은 더는 도망치는 마을이 아니야.' },
      { speaker: { category: 'character', subjectId: 'theo', name: '테오' }, text: '이제부터는 내가 앞길을 열지. 조각 언덕까지 지름길을 알거든.' },
    ],
  },
  {
    id: 'pre_stage_01_23',
    stageId: 'stage_01_23',
    trigger: 'pre_stage',
    lines: [
      { speaker: { category: 'character', subjectId: 'luna', name: '루나' }, text: '언덕 위 공명이 점점 커져. 첫 조각이 우리 쪽으로 기울고 있어.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '그럼 망설일 이유도 없다. 오늘 평원의 균열은 여기서 끝낸다.' },
    ],
  },
  {
    id: 'post_stage_01_24',
    stageId: 'stage_01_24',
    trigger: 'post_clear',
    lines: [
      { speaker: { category: 'character', subjectId: 'sera', name: '세라' }, text: '첫 조각이 안정됐어. 검이 다시 숨을 쉬기 시작했어.' },
      { speaker: { category: 'character', subjectId: 'bram', name: '브람' }, text: '브램블은 너희 편이다. 다음 대륙으로 가도 평원 병력은 뒤에서 받쳐주마.' },
    ],
  },
  {
    id: 'pre_stage_02_01',
    stageId: 'stage_02_01',
    trigger: 'pre_stage',
    lines: [
      { speaker: { category: 'character', subjectId: 'dorgan', name: '도르간' }, text: '산맥은 평원처럼 넓지 않다. 한 번 막히면 모두가 같이 질식한다.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '그럼 길 하나씩 다시 뚫는다. 두 번째 조각도 그 끝에 있을 거다.' },
    ],
  },
  {
    id: 'post_stage_02_06',
    stageId: 'stage_02_06',
    trigger: 'post_clear',
    lines: [
      { speaker: { category: 'character', subjectId: 'kiera', name: '키에라' }, text: '통풍로까지 살렸으니 이제 산맥 전체가 다시 움직일 수 있어.' },
      { speaker: { category: 'character', subjectId: 'dorgan', name: '도르간' }, text: '하지만 누군가 반응로를 노리고 있어. 광산 싸움은 이제부터다.' },
    ],
  },
  {
    id: 'pre_stage_02_13',
    stageId: 'stage_02_13',
    trigger: 'pre_stage',
    lines: [
      { speaker: { category: 'character', subjectId: 'helma', name: '헬마' }, text: '심부로 내려갈수록 조각 파장이 금속을 휘게 만들고 있어. 룬으로 버티지 않으면 길이 접힌다.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '길이 휘면 펴면 된다. 네 룬과 내 검으로 끝까지 내린다.' },
    ],
  },
  {
    id: 'post_stage_02_18',
    stageId: 'stage_02_18',
    trigger: 'post_clear',
    lines: [
      { speaker: { category: 'character', subjectId: 'helma', name: '헬마' }, text: '반응로 폭주가 멎었어. 이제 조각이 우리를 시험하는 방식이 바뀔 거야.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '좋아. 그 시험장까지 바로 간다. 더는 산맥에 시간을 주지 않는다.' },
    ],
  },
  {
    id: 'pre_stage_02_23',
    stageId: 'stage_02_23',
    trigger: 'pre_stage',
    lines: [
      { speaker: { category: 'character', subjectId: 'dorgan', name: '도르간' }, text: '주조로가 무너지면 두 번째 조각도 같이 갈라진다. 이번엔 전투와 수리가 동시에 가야 한다.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '그럼 전열은 우리가 잡고, 너희는 맹약을 붙여라. 끝내고 간다.' },
    ],
  },
  {
    id: 'post_stage_02_24',
    stageId: 'stage_02_24',
    trigger: 'post_clear',
    lines: [
      { speaker: { category: 'character', subjectId: 'helma', name: '헬마' }, text: '두 번째 조각이 붙었어. 이제 검은 단순한 파편 덩어리가 아니야.' },
      { speaker: { category: 'character', subjectId: 'kiera', name: '키에라' }, text: '산맥 길드도 움직일 거다. 다음 원정에 필요한 화력은 우리가 맡지.' },
    ],
  },
  {
    id: 'pre_stage_03_01',
    stageId: 'stage_03_01',
    trigger: 'pre_stage',
    lines: [
      { speaker: { category: 'character', subjectId: 'marin', name: '마린' }, text: '해안은 길보다 파도에 규칙이 있다. 규칙을 놓치면 바로 가라앉아.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '그 규칙, 우리가 다시 정한다. 항구부터 되찾는다.' },
    ],
  },
  {
    id: 'post_stage_03_06',
    stageId: 'stage_03_06',
    trigger: 'post_clear',
    lines: [
      { speaker: { category: 'character', subjectId: 'marin', name: '마린' }, text: '절벽길이 열렸어. 성소 안쪽으로 들어갈 수 있는 건 이제 우리뿐이야.' },
      { speaker: { category: 'character', subjectId: 'luna', name: '루나' }, text: '좋아. 바다 쪽 조각은 힘보다 의식이 더 중요해 보여. 조심해서 가자.' },
    ],
  },
  {
    id: 'pre_stage_03_13',
    stageId: 'stage_03_13',
    trigger: 'pre_stage',
    lines: [
      { speaker: { category: 'character', subjectId: 'serena', name: '세레나' }, text: '성소를 더럽힌 건 바닷속 괴수만이 아니야. 누군가 조각의 의지를 굽히려 했어.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '그 의도까지 끊어낸다. 세 번째 조각은 우리가 직접 확인한다.' },
    ],
  },
  {
    id: 'post_stage_03_18',
    stageId: 'stage_03_18',
    trigger: 'post_clear',
    lines: [
      { speaker: { category: 'character', subjectId: 'fin', name: '핀' }, text: '성소 붕괴 기록을 봤어. 바다는 단순히 썩은 게 아니라 누군가 길을 열고 있어.' },
      { speaker: { category: 'character', subjectId: 'sera', name: '세라' }, text: '그러면 다음 대륙부턴 조각을 쫓는 것만으로 부족하겠네. 진실도 같이 캐야 해.' },
    ],
  },
  {
    id: 'pre_stage_03_23',
    stageId: 'stage_03_23',
    trigger: 'pre_stage',
    lines: [
      { speaker: { category: 'character', subjectId: 'serena', name: '세레나' }, text: '네레프의 방은 조수문보다 깊어. 숨을 놓치면 파도에 끌려간다.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '파도보다 먼저 조각을 붙잡는다. 모두 호흡만 맞춰.' },
    ],
  },
  {
    id: 'post_stage_03_24',
    stageId: 'stage_03_24',
    trigger: 'post_clear',
    lines: [
      { speaker: { category: 'character', subjectId: 'luna', name: '루나' }, text: '세 번째 조각엔 수호자의 의지가 남아 있었어. 조각들이 우리를 지켜보고 있었던 거야.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '그럼 다음부터는 힘만 모을 수 없다. 진실까지 모아야 검이 완성된다.' },
    ],
  },
  {
    id: 'pre_stage_04_01',
    stageId: 'stage_04_01',
    trigger: 'pre_stage',
    lines: [
      { speaker: { category: 'character', subjectId: 'iris', name: '아이리스' }, text: '윈터가드는 아직 버틴다. 하지만 여긴 전투만으로는 열리지 않는 문이 많아.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '문이든 기록이든 다 연다. 네 번째 조각까지 멈추지 않는다.' },
    ],
  },
  {
    id: 'post_stage_04_06',
    stageId: 'stage_04_06',
    trigger: 'post_clear',
    lines: [
      { speaker: { category: 'character', subjectId: 'wolf', name: '울프' }, text: '설원은 약한 자를 바로 버려. 그런데 네 파티는 끝까지 줄을 놓지 않더군.' },
      { speaker: { category: 'character', subjectId: 'bram', name: '브람' }, text: '그게 동맹의 기본이니까. 이제 묘역 안쪽 기록만 찾으면 된다.' },
    ],
  },
  {
    id: 'pre_stage_04_13',
    stageId: 'stage_04_13',
    trigger: 'pre_stage',
    lines: [
      { speaker: { category: 'character', subjectId: 'erin', name: '에린' }, text: '영웅단 기록이 맞다면, 조각을 모두 붙인 자는 새 봉인자로 남게 될 수도 있어요.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '그 대가가 무엇이든 먼저 세계를 살린다. 나중 일은 살아남은 뒤에 정한다.' },
    ],
  },
  {
    id: 'post_stage_04_18',
    stageId: 'stage_04_18',
    trigger: 'post_clear',
    lines: [
      { speaker: { category: 'character', subjectId: 'erin', name: '에린' }, text: '찾았어요. 흑월 재앙 이전에도 검을 쓴 자는 영웅이 아니라 봉인자였어요.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '그 진실도 가져간다. 숨기려는 자들이 더는 먼저 닿지 못하게.' },
    ],
  },
  {
    id: 'pre_stage_04_23',
    stageId: 'stage_04_23',
    trigger: 'pre_stage',
    lines: [
      { speaker: { category: 'character', subjectId: 'iris', name: '아이리스' }, text: '발테른은 기록을 지우고 싶어 해요. 조각도, 영웅단도, 새 봉인자도 전부.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '그럼 우리가 남긴다. 눈보라 끝까지 가서 직접 새긴다.' },
    ],
  },
  {
    id: 'post_stage_04_24',
    stageId: 'stage_04_24',
    trigger: 'post_clear',
    lines: [
      { speaker: { category: 'character', subjectId: 'erin', name: '에린' }, text: '네 번째 조각이 응답했어요. 이제 복원은 가능하지만, 그 끝이 희생일 수도 있다는 뜻이에요.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '그래도 간다. 사막에서 남은 진실을 찾고, 마지막 선택은 그때 한다.' },
    ],
  },
  {
    id: 'pre_stage_05_01',
    stageId: 'stage_05_01',
    trigger: 'pre_stage',
    lines: [
      { speaker: { category: 'character', subjectId: 'nazir', name: '나지르' }, text: '사막은 목숨보다 물자와 길을 먼저 빼앗아 간다. 방심하면 흔적도 없이 먹힌다.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '길을 잃기 전에 길 자체를 되찾는다. 다섯 번째 조각까지 밀어붙인다.' },
    ],
  },
  {
    id: 'post_stage_05_06',
    stageId: 'stage_05_06',
    trigger: 'post_clear',
    lines: [
      { speaker: { category: 'character', subjectId: 'laila', name: '라일라' }, text: '협곡 흔적이 이상해요. 제국은 조각을 지키려 한 게 아니라, 힘을 돌리려 했던 것 같아요.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '그 흐름을 끝까지 따라간다. 사막 유적이 왜 무너졌는지 직접 보자.' },
    ],
  },
  {
    id: 'pre_stage_05_13',
    stageId: 'stage_05_13',
    trigger: 'pre_stage',
    lines: [
      { speaker: { category: 'character', subjectId: 'laila', name: '라일라' }, text: '바람제단 아래 기록은 검을 무기로만 쓴 자들이 제국을 찢었다고 말해요.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '그러면 우리는 다르게 쓴다. 봉인을 다시 세우는 방식으로.' },
    ],
  },
  {
    id: 'post_stage_05_18',
    stageId: 'stage_05_18',
    trigger: 'post_clear',
    lines: [
      { speaker: { category: 'character', subjectId: 'nazir', name: '나지르' }, text: '모래폭풍을 넘겼군. 이제 남은 건 카제르와 그 문지기들뿐이다.' },
      { speaker: { category: 'character', subjectId: 'hakan', name: '하칸' }, text: '유목 연합도 여기서 물러서지 않는다. 마지막 제단까지 같이 간다.' },
    ],
  },
  {
    id: 'pre_stage_05_23',
    stageId: 'stage_05_23',
    trigger: 'pre_stage',
    lines: [
      { speaker: { category: 'character', subjectId: 'laila', name: '라일라' }, text: '다섯 번째 문 너머는 제국이 가장 감추고 싶어 한 방이에요. 답은 있지만 대가도 있을 거예요.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '답이 필요하다. 루미나 성역에 들어가기 전에 모든 거짓을 여기서 끝낸다.' },
    ],
  },
  {
    id: 'post_stage_05_24',
    stageId: 'stage_05_24',
    trigger: 'post_clear',
    lines: [
      { speaker: { category: 'character', subjectId: 'laila', name: '라일라' }, text: '맞았어요. 검은 파괴를 위해 쓰이면 세계를 더 크게 찢어요. 봉인자로 남는 건 필연이었어요.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '그렇다면 마지막 대륙에서 선택까지 같이 끝낸다. 이제 물러설 이유가 없다.' },
    ],
  },
  {
    id: 'pre_stage_06_01',
    stageId: 'stage_06_01',
    trigger: 'pre_stage',
    lines: [
      { speaker: { category: 'character', subjectId: 'seraphin', name: '세라핀' }, text: '성역은 성벽이 아니라 마음부터 무너지고 있습니다. 늦으면 모두가 흑월의 깃발 아래로 기울어요.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '그 전에 우리가 먼저 들어간다. 마지막 조각과 검은문까지 한 번에 밀어붙인다.' },
    ],
  },
  {
    id: 'post_stage_06_06',
    stageId: 'stage_06_06',
    trigger: 'post_clear',
    lines: [
      { speaker: { category: 'character', subjectId: 'seraphin', name: '세라핀' }, text: '새벽 회랑이 열렸습니다. 이제 성도 내부 병력도 당신들의 전진을 믿기 시작했어요.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '좋아. 믿음이 모인다면 검은문까지 갈 힘도 더 커진다.' },
    ],
  },
  {
    id: 'pre_stage_06_13',
    stageId: 'stage_06_13',
    trigger: 'pre_stage',
    lines: [
      { speaker: { category: 'character', subjectId: 'micaela', name: '미카엘라' }, text: '성역의 기록은 조각 회수가 끝이 아니라고 말해요. 마지막 조각은 선택을 강요할 거예요.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '선택은 마지막까지 미뤄도 된다. 우선 모두가 살아남을 길부터 확보한다.' },
    ],
  },
  {
    id: 'post_stage_06_18',
    stageId: 'stage_06_18',
    trigger: 'post_clear',
    lines: [
      { speaker: { category: 'character', subjectId: 'seraphin', name: '세라핀' }, text: '성역 내부가 비워졌습니다. 이제 검은문을 향한 길만 남았어요.' },
      { speaker: { category: 'character', subjectId: 'lucian', name: '루시안' }, text: '좋은 소식이지. 흑월왕의 순찰 패턴도 여기서부터는 내가 읽을 수 있다.' },
    ],
  },
  {
    id: 'pre_stage_06_23',
    stageId: 'stage_06_23',
    trigger: 'pre_stage',
    lines: [
      { speaker: { category: 'character', subjectId: 'lucian', name: '루시안' }, text: '검은문 안쪽은 정면 돌파보다 배치가 중요해. 틈 하나만 잡으면 바르칸 앞까지 바로 간다.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '좋아. 연합군은 문을 붙잡고, 우리는 안쪽 심장부를 자른다.' },
    ],
  },
  {
    id: 'post_stage_06_24',
    stageId: 'stage_06_24',
    trigger: 'post_clear',
    lines: [
      { speaker: { category: 'character', subjectId: 'luna', name: '루나' }, text: '여섯 조각이 모두 붙었어. 검은 복원됐지만, 이제 누군가 남아 봉인을 세워야 해.' },
      { speaker: { category: 'character', subjectId: 'hero', name: '카인' }, text: '끝내고 돌아간다. 재건도, 봉인도, 우리가 함께 이어간다.' },
    ],
  },
];

const STAGE_STORY_EVENT_MAP = new Map(STAGE_STORY_EVENTS.map((event) => [`${event.stageId}:${event.trigger}`, event]));

export function getAllStageStoryEventIds(): string[] {
  return STAGE_STORY_EVENTS.map((event) => event.id);
}

export function getStageStoryEvent(stageId: string, trigger: StageStoryTrigger): StageStoryEvent | null {
  return STAGE_STORY_EVENT_MAP.get(`${stageId}:${trigger}`) ?? null;
}

export function hasSeenStageStoryEvent(snapshot: SaveSnapshot, eventId: string): boolean {
  return snapshot.story.seenStageStoryEventIds.includes(eventId);
}

export function markStageStoryEventSeen(snapshot: SaveSnapshot, eventId: string, now = Date.now()): SaveSnapshot {
  if (hasSeenStageStoryEvent(snapshot, eventId)) {
    return snapshot;
  }

  return {
    ...snapshot,
    updatedAt: now,
    story: {
      ...snapshot.story,
      seenStageStoryEventIds: [...snapshot.story.seenStageStoryEventIds, eventId],
    },
  };
}

