# UI_FLOW.md

## 2026-04-07 Town Rework Addendum

- Replace the one-screen `VillageLobbyScene` button lobby with a tile-based exploration town.
- Intended flow:
  1. Explore the town exterior with camera follow.
  2. Approach an entrance marker at a shop or world gate.
  3. Walk into a shop doorway to enter the interior, or use `Space` at the world gate to leave town.
  4. Near a shop NPC, show a talk marker.
  5. `Space` opens the shop UI.
  6. Ambient NPCs use the same nearby marker but open short greeting dialogue only.

## 2026-04-07 Town Rework Implementation Status

- Implemented runtime flow:
  1. Spawn into `Lumen Village`
  2. Walk the town with follow camera
  3. Read entrance markers for shops and the stage gate
  4. Auto-enter a shop interior by crossing its doorway
  5. Approach the merchant and open the shop list
  6. Exit back to the same exterior door
  7. Approach an ambient NPC for a short greeting line
  8. Approach the east-side stage gate to leave town
- Current UI stance:
  - party / gear / gacha / home / options shortcuts stay on-screen so the pre-existing meta loop is not blocked by the larger town map
  - entrance markers and talk markers are intentionally lightweight until final VFX art lands

## 핵심 사용자 흐름

1. 앱 실행
2. 로비 마을 진입
3. 상점/파티/장비/가챠/하우징/옵션/대륙지도 접근
4. 대륙 선택
5. 스테이지 선택
6. 난이도 확인 및 3성 해금 규칙 안내
7. 피로도 확인
8. 전투 진입 또는 광고/IAP 우회 동선 선택
9. 결과 화면
10. 보상 적용, 저장, 재도전 또는 마을 복귀

## 실제 구현 기준 화면 흐름

- `VillageLobbyScene`에서 `Shop`, `Party`, `Equipment`, `Gacha`, `Housing`, `Options`, `WorldMap`으로 직접 이동한다.
- `WorldMapScene`은 `루멘 마을 허브 -> 6대륙 -> 검은문 전진캠프` 진행 축을 텍스트로 고정 표시한다.
- `StageSelectScene`은 대륙별 24개 스테이지를 2열 스크롤 카드형으로 노출하고 `Normal / Hard / Hell`을 순환한다.
- `BattleScene -> ResultScene -> VillageLobbyScene`이 저장/보상 루프의 기본 복귀 경로다.
- 동료 영입 보상이 있는 결과 화면은 `결과 요약 -> 영입 대화 -> 회전 카드 비행 -> 획득 문구 -> 결과 액션 선택` 순서로 진행한다.
- 상점 장비 상품은 현재 착용 장비 대비 전투력 변화를 표시하고, 레벨 부족 상품은 `Lv.n 필요`를 함께 보여준다.

## 화면 간 우선 순위

| 화면 | 사용자가 먼저 확인할 것 | 주요 액션 | 혼란 위험 |
| --- | --- | --- | --- |
| 마을 로비 | 현재 목표, 피로도, 스타터팩 상태, 다음 행동 | 터치 조이스틱 이동, 광고 보상, 스타터팩 구매, 대륙지도 진입 | 정보 과밀 |
| 대륙 지도 | 해금된 대륙, 현재 스토리 막, 거점 위치 | 대륙 선택 | 잠금 이유 불명확 |
| 스테이지 선택 | 난이도, 요구 피로도, 별 조건, 현재 장 번호 | 입장, 소탕, 파티 확인 | 3성 조건 오해 |
| 파티 편성 | 4인 슬롯, 보유 캐릭터, 현재 전투력 | 슬롯 교체, 후보 배치 | 중복 편성 오해 |
| 장비 관리 | 현재 착용 장비, 장비 여유 수량, 파워 보너스 | 무기/갑옷 장착, 해제 | 장착 가능 조건 오해 |
| 전투 | 적 HP, 파티 HP, 스킬 게이지, AUTO 상태 | 수동 스킬, AUTO 토글, 철수 | 전투 상태 인지 실패 |
| 광고 보상 팝업 | 보상량, 실패 시 안내 | 광고 시청, 닫기 | 강제 광고 인상 |
| 가챠 | 보유 재화, 1회/10회 가치 차이 | 뽑기, 확률표 보기 | 초보자 과금 혼란 |
| 하우징 | 현재 배치 슬롯, 가구 종류, 보유 수 | 슬롯 순환, 저장 | 확장 기능과 MVP 범위 혼동 |

## 월드맵 구조 기준

- 월드맵은 `중앙 허브 1 + 6대륙 + 최종 전진캠프` 구조를 따른다.
- 각 대륙은 `거점 1개 + 메인 스테이지 24개` 흐름이 읽히게 구성한다.
- 월드맵에서 다음 목표 스테이지와 현재 스토리 장을 항상 표시한다.
- 최종 전진캠프는 `continent_06` 24번 스테이지 클리어 전까지 잠금 상태를 명시한다.

## 모바일 UX 원칙

- 중요한 수치 3개 이상을 한 화면 상단에 겹치지 않는다.
- 가상패드와 액션 버튼은 엄지 손가락 기준으로 배치한다.
- 광고 진입 버튼은 실수 탭을 줄이기 위해 메인 진행 버튼과 붙여두지 않는다.
- 피로도 부족 시 바로 결제 강요가 아니라 `광고 -> 아이템 -> 상점` 순으로 자연스럽게 안내한다.

## UI 오해 방지 포인트

- `잠김`은 이유를 같이 써야 한다.
- `소탕 가능`은 3성 달성 조건을 같이 보여야 한다.
- `10회 가챠 보장`은 보장 범위를 명확히 표기한다.
- 하우징은 MVP 범위에서 미니 UI만 제공하고 복잡한 편집은 잠금 처리한다.

## 관련 문서

- `../game/CORE_LOOP.md`
- `./UI_SCREENS.md`
- `./UI_RULES.md`
- `../qa/TEST_CASES.md`
- `../story/WORLD_STRUCTURE.md`
