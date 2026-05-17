# CORE_LOOP.md

## 2026-05-17 Balance Addendum

1. Stage entry consumes `3` fatigue from a `100` point bar.
2. A full bar supports about 33 entries.
3. When fatigue is low, the player can continue through natural recovery, rewarded ad `+6`, fallback `+3`, local consumables, or paid fatigue products.
4. First clears grant full gold/EXP; repeat clears of the same stage difficulty grant `50%` gold/EXP.
5. Normal story progression is tuned to end around level 20 across all 144 stages.

## 2026-04-07 Town Exploration Addendum

1. Enter the tile-based town exterior.
2. Walk through the town while the camera follows the hero.
3. Approach a shop entrance or the main world gate marker.
4. Transition into a shop interior or the world-map flow.
5. Interact with nearby NPCs using `Space`.
6. Return to the town exterior and continue the main loop.

## 메인 루프

1. 마을 로비에서 이동
2. 상점/NPC/하우징/지도 중 하나 선택
3. 대륙과 스테이지 선택
4. 난이도와 피로도 확인
5. 전투 진입
6. 파티 자동전투 + 조작 캐릭터 수동 스킬 또는 AUTO 토글
7. 클리어 시간 기반 별 지급
8. 보상, 피로도, 저장 갱신
9. 마을 복귀 또는 반복 플레이

## 서브 루프

| 루프 | 설명 | 성공 지표 |
| --- | --- | --- |
| 성장 루프 | 전투 -> 보상 -> 강화 -> 더 높은 난이도 도전 | 다음 난이도 해금 |
| 피로도 루프 | 피로도 사용 -> 회복 대기/광고/IAP 회복 | 세션 유지 |
| 상점 루프 | 스타터팩/IAP 진입 -> 보상 적용 -> 로비 복귀 | 초기 전환 확인 |
| 수집 루프 | 가챠/분해 -> 히어로스톤 -> 상점 교환 | 장비/캐릭터 풀 확장 |
| 생활 루프 | 마을 탐색 -> NPC 상호작용 -> 하우징 | 로비 체류 증가 |

## MVP 기준으로 구현 우선순위

1. 피로도, 스테이지 입장, 저장
2. 결과 처리와 난이도 해금
3. 광고 보상과 fallback
4. 가챠/히어로스톤의 입력 구조
5. 하우징 라이트 버전

## 전체 시나리오 기준 진행 규모

- 전체 설계: `6개 대륙 x 24개 메인 스테이지`
- 1.0 권장 출시 컷: `프롤로그 + 1~2대륙`
- 상세 챕터와 보스 흐름은 `../story/STAGE_PROGRESSION.md`를 따른다.

## 상태 데이터 연결

- 로비 상태: 위치, UI 선택 포인트
- 월드 상태: 해금 대륙, 스테이지 별
- 경제 상태: 골드, 프리미엄 재화, 히어로스톤 [TODO]
- 전투 결과 상태: 시간, 별, 보상

## 관련 문서

- `./GAME_STATES.md`
- `./SYSTEM_RULES.md`
- `./SAVE_LOAD.md`
- `../story/STAGE_PROGRESSION.md`
