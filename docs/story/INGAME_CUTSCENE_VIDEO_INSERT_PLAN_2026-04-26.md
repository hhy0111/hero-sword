# INGAME_CUTSCENE_VIDEO_INSERT_PLAN_2026-04-26

- summary:
  - `히어로소드` 본편 스토리에 맞는 인게임 15초 영상 삽입 타이밍을 정리한다.
  - 영상은 모든 스테이지에 넣지 않고, `장면 전환 가치가 큰 구간`에만 제한적으로 사용한다.
  - 전체 마스터 플랜은 `8개`, 현재 1.0 우선 제작 권장 수량은 `4개`로 정리한다.
- inputs:
  - [STORY_MASTER.md](D:/dev/game307/docs/story/STORY_MASTER.md)
  - [STAGE_PROGRESSION.md](D:/dev/game307/docs/story/STAGE_PROGRESSION.md)
  - [STAGE_RECRUIT_EVENTS.md](D:/dev/game307/docs/story/STAGE_RECRUIT_EVENTS.md)
  - [LUMEN_PALACE_STORY_EXPANSION_2026-04-16.md](D:/dev/game307/docs/story/LUMEN_PALACE_STORY_EXPANSION_2026-04-16.md)
  - [characters.ts](D:/dev/game307/src/game/data/characters.ts)
- decisions:
  - 영상은 전투 시작 전, 조각 획득 직후, 지역 전환 직전, 최종 결전 직전처럼 `플레이어 감정 곡선이 크게 꺾이는 지점`에만 넣는다.
  - 동료 합류, 일반 상점 방문, 반복 파밍, 뽑기 결과, 일반 스테이지 클리어에는 영상 대신 portrait 대화 연출을 유지한다.
  - 전체 스토리 기준 권장 구성은 `오프닝 1 + 중간 전환 6 + 엔딩 1 = 총 8개`다.
  - 현재 1.0 권장 구성은 `01, 02, 03, 04` 우선 제작이다.
  - 모든 영상은 `15초`, `세로형 9:16`, `자막/로고/UI 없음`, `모바일 화면에서 한눈에 읽히는 구도`를 고정 규칙으로 둔다.
- todo:
  - `asset_agent`: 본 문서 기준으로 영상 생성용 레퍼런스 세트와 시드 전략 정리
  - `ui_agent`: 영상 재생 후 자연스럽게 다음 씬으로 넘기는 전환 설계
  - `integration_agent`: stage clear / palace scene / world unlock 타이밍에 연결 포인트 정의
- risks:
  - 영상이 너무 많아지면 스토리 템포가 끊기고 앱 용량이 급격히 증가한다.
  - 캐릭터별 외형 고정값이 약하면 다른 게임 같은 인물이 생성될 수 있다.
  - 지역명이 섞이면 연출이 흔들리므로 아래 명칭을 고정해서 사용해야 한다.
- artifacts_changed:
  - this file
  - `docs/art/INGAME_15S_VIDEO_READY_TO_COPY_PROMPTS_2026-04-26.md`
- handoff_to:
  - `planner_agent`
  - `asset_agent`
  - `ui_agent`
  - `integration_agent`
- handoff_notes:
  - 현재 릴리스 범위는 1.0 기준 `4개 우선`, 풀 스토리 확장 시 `8개 전체` 적용이 안전하다.
  - 프롬프트 원문은 `docs/art/INGAME_15S_VIDEO_READY_TO_COPY_PROMPTS_2026-04-26.md`에 따로 정리했다.
- done_check:
  - true

## 목적

이 문서는 게임 내 삽입 영상의 `개수`, `삽입 타이밍`, `용도`, `우선순위`를 정리한다.  
영상은 스토리를 설명하는 대체 수단이 아니라, 플레이어가 `큰 전환점을 체감해야 하는 순간`을 강화하는 용도다.

## 고정 명칭

아래 명칭으로 통일한다.

| 구분 | 고정 명칭 |
| --- | --- |
| 시작 마을 | `Lumen Village` |
| 왕궁 | `Lumen Palace` |
| 1대륙 | `Greenhaven Plains` |
| 2대륙 | `Ironrich Mountains` |
| 3대륙 | `Bluemist Coast` |
| 4대륙 | `Frostbell Highlands` |
| 5대륙 | `Sunscar Desert` |
| 6대륙 | `Lumina Sanctuary` |
| 최종 결전지 | `Black Gate` |
| 적 진영 | `Black Moon` |

## 왜 총 8개가 맞는가

영상은 모든 챕터의 시작과 끝에 넣는 방식보다, 아래 8개 지점에 두는 편이 더 효율적이다.

1. 오프닝: 플레이어가 왜 싸우는지 즉시 이해시킨다.
2. 첫 조각 회수와 왕궁 알현: 메인 퀘스트의 공식 시작점이다.
3. 2대륙 조각 공명: 검 복원 가능성을 처음 체감시키는 장면이다.
4. 3대륙 오염 진실: 적이 단순 몬스터가 아니라는 사실을 강하게 보여준다.
5. 4대륙 기록 회수: 영웅검과 Black Gate의 진실이 드러나는 지점이다.
6. 5대륙 추적 경로 확보: 최종전 루트가 명확해지는 지점이다.
7. 6대륙 최종 출정 선언: 모든 세력이 마지막 전진에 합류하는 장면이다.
8. 엔딩: 영웅검 복원과 세계 회복을 확정한다.

## 1.0 우선 제작 권장본

현재 1.0 스코프가 `프롤로그 + 1대륙 완료 + 2대륙 완료 + 3대륙 티저`라면 먼저 아래 4개만 제작하는 편이 맞다.

| 우선순위 | 영상 ID | 이유 |
| --- | --- | --- |
| A | `video_01_opening_lumen_fall` | 첫 실행 체감 품질에 직접 영향 |
| A | `video_02_first_fragment_audience` | 1대륙 클리어 보상 감정선 강화 |
| A | `video_03_ironrich_resonance` | 2대륙 결말과 검 복원 축 연결 |
| A | `video_04_bluemist_warning` | 1.0 엔딩 티저 역할 가능 |

## 전체 삽입 타이밍 표

| 영상 ID | 권장 삽입 시점 | 직접 연결 대상 | 장면 기능 | 중심 인물 |
| --- | --- | --- | --- | --- |
| `video_01_opening_lumen_fall` | 새 게임 시작 직후, 첫 튜토리얼 전 | 타이틀 -> 프롤로그 | 마을 위협, 조각 공명, 주인공 각성 | Kain, Bram, Sera, Luna |
| `video_02_first_fragment_audience` | `stage_01_10` 클리어 직후 | 결과 화면 -> Lumen Palace 첫 알현 | 첫 조각 회수, 왕궁이 대륙 원정을 승인 | Kain, King Aldren, Queen Regent Celestine, Captain Rowan |
| `video_03_ironrich_resonance` | `stage_02_10` 클리어 직후 | 지역 보스 결과 -> 대륙 03 해금 | 두 번째 조각 공명, 검 복원 가능성 강화 | Kain, Bram, Helma |
| `video_04_bluemist_warning` | `stage_03_10` 클리어 직후, 또는 1.0 엔딩 티저 대체 | 대륙 03 결과 -> 다음 지역 예고 | 바다 오염과 Black Moon의 확장 방향 제시 | Kain, Sera, Luna, Serena |
| `video_05_archive_truth` | `stage_04_09` 또는 `stage_04_10` 직후 | 기록 회수 -> 다음 대륙 해금 | Black Gate와 영웅검의 역사 공개 | Kain, Erin, Archivist Mirel |
| `video_06_desert_route_reveal` | `stage_05_10` 클리어 직후 | 대륙 05 결말 -> 대륙 06 전환 | 적의 최종 이동 경로 확인 | Kain, Nazir, Laila |
| `video_07_final_decree` | `stage_06_09` 직후 | 전진 캠프 진입 -> 최종 스테이지 | 왕궁과 성역 세력의 마지막 출정 명령 | Kain, King Aldren, Queen Regent Celestine, Seraphin, Lucian |
| `video_08_black_gate_ending` | `stage_06_10` 클리어 직후 | 최종 보스 결과 -> 엔딩 롤 | 영웅검 복원, 균열 봉인, 귀환의 여운 | Kain 중심, 시작 파티, 후반 핵심 동료 |

## 플레이 흐름 기준 정리

### 1. 프롤로그

- `video_01_opening_lumen_fall`
- 역할:
  - 플레이어가 Lumen Village를 지켜야 하는 이유를 바로 이해하게 만든다.
  - Kain이 평범한 병사가 아니라 조각과 공명하는 인물이라는 점을 시각적으로 박아 넣는다.

### 2. 첫 원정 확정

- `video_02_first_fragment_audience`
- 역할:
  - 첫 조각을 주웠다는 사실만으로 끝내지 않고, 왕궁과 대륙 원정이 공식화되는 순간을 만든다.
  - Lumen Palace의 규모와 정치 무게를 짧게 전달한다.

### 3. 검 복원 축 확정

- `video_03_ironrich_resonance`
- 역할:
  - 조각 수집이 단순 수집이 아니라 실제 복원 과정이라는 점을 보여준다.
  - 이후 지역을 돌아야 하는 이유를 플레이어가 감각적으로 납득한다.

### 4. 적의 정체 확대

- `video_04_bluemist_warning`
- 역할:
  - 적이 지역별 몬스터 떼가 아니라, 바다와 제단까지 오염시키는 광역 세력이라는 점을 보여준다.
  - 1.0에서는 다음 대륙 예고 컷으로도 쓸 수 있다.

### 5. 진실 공개 구간

- `video_05_archive_truth`
- 역할:
  - 영웅검이 왜 존재했고 왜 조각으로 나뉘었는지, Black Gate와 어떤 관계인지 설명하는 핵심 컷이다.
  - 이후 대륙 05~06의 동기가 단순 원정이 아니라 종결전 준비로 바뀐다.

### 6. 최종 경로 확보

- `video_06_desert_route_reveal`
- 역할:
  - 최종 적 진영으로 이어지는 길이 구체적 경로로 드러난다.
  - 다음 장면부터는 수색이 아니라 `진군` 분위기로 넘어간다.

### 7. 마지막 출정

- `video_07_final_decree`
- 역할:
  - 파티 개인 모험이 아니라 국가와 성역 단위의 최종 결전이라는 감각을 준다.
  - 최종 스테이지 직전의 긴장과 결의를 만드는 장면이다.

### 8. 엔딩

- `video_08_black_gate_ending`
- 역할:
  - 세계가 실제로 회복되었는지, Kain과 시작 파티가 무엇을 이루었는지 보여주는 마무리다.
  - 단순 폭발 컷이 아니라 `회복된 세계의 정서`까지 전달해야 한다.

## 구현 연결 메모

| 장면 | 구현 메모 |
| --- | --- |
| 오프닝 | 새 세이브 생성 시 1회 재생, 스킵 허용 |
| 조각 획득 직후 | 결과 화면 이후 자동 재생, 끝나면 palace / world unlock으로 이동 |
| 엔딩 티저 | 1.0에서는 credits 전 짧은 teaser cut로도 전용 export 가능 |
| 최종 엔딩 | credit 롤 전 또는 후행 epilogue still과 연결 |

## 제외하는 것이 맞는 구간

아래는 영상보다 portrait 대화가 더 맞다.

- 동료 개별 합류 이벤트
- 가챠 / 상점 / 하우징 / 장비 / 제작 UI
- 일반 보스 첫 등장
- 마을 소소한 대화
- 각 대륙의 서브 감정선

이 구간까지 영상으로 늘리면 전체 톤이 과해지고, 중요한 장면의 무게가 떨어진다.
