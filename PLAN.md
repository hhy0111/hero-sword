# PLAN.md

## 2026-05-17 Equipment Shop Readability Update

- Equipment level requirements are now enforced during weapon and armor equip attempts.
- Shop equipment rows compare each item against a matching owned character's current loadout and show the expected power delta.
- Level-locked shop gear remains purchasable, but the detail view clearly says which character level is required before equipping.

## 2026-05-17 Recruitment Result Presentation Update

- Character recruitment clears now keep the story dialogue first, then play a card acquisition effect after the last dialogue line.
- The acquisition effect uses a rarity-scaled spin/flight timing, center reveal, particle burst, and explicit `캐릭터명 획득` title.
- Result debug output exposes recruitment effect activity and phase so Playwright/smoke checks can verify the dialogue-to-effect handoff.

## 2026-05-17 Fatigue and Reward Balance Update

- Fatigue economy is now designed around `100` max fatigue and `3` fatigue per stage entry.
- A full fatigue bar supports about 33 stage entries before recovery, ads, or purchases.
- Rewarded fatigue ads grant `+6`; fallback grants `+3`.
- Paid fatigue products are balanced as starter `+9`, small `+18`, large `+45`.
- Already-cleared stage difficulties grant `50%` gold and `50%` EXP on repeat clears.
- Level curve target: continent 1 Normal ends around level 8; all 144 Normal stages end around level 20; Hard/Hell remain growth routes.

## 2026-04-07 Town Rework Direction

- The current single-screen village lobby is now scheduled for replacement with a tile-based exploration town.
- `Lumen Village` is the first implementation target.
- Current painted battle backgrounds are accepted as provisional stage backplate source files.
- Current painted town / shop / interior / NPC / shop-UI images are reference-only and must not be used as direct runtime environment art.
- The new town art generation bundle is documented in `docs/art/TOWN_REWORK_PIXEL_RUNTIME_READY_TO_COPY_PROMPTS.md`.
- The new implementation rules are documented in `docs/game/TOWN_REWORK_SPEC.md`.

## 현재 상태

- 날짜: `2026-04-04`
- 프로젝트 상태: `세로 슬라이스 구현 + QA 3회 루프 실행 + 출시 입력값 정리 진행 중`
- Gate 상태:
  - Gate 0: 완료
  - Gate 1: 완료
  - Gate 2: 완료
  - Gate 3: 완료
  - Gate 4: 완료
  - Gate 5: 완료
  - Gate 6: 진행 중
  - Gate 7: 미진행

## MVP 범위

반드시 포함:
- 마을 로비 이동
- 대륙 지도 진입 구조
- 스테이지 난이도 해금 규칙
- 4인 파티 전투 진입 데이터 구조
- 피로도 소모/회복
- 로컬 저장/복구
- 광고 보상 피로도 회복 구조
- IAP/가챠 입력값 관리 구조

초기 버전에서 제외:
- 실시간 멀티플레이
- 고급 길드/채팅
- 라이브 운영 툴
- 복잡한 하우징 편집기
- 전체 대륙 10개 완전 제작

## 이번 단계 목표

- `AGENTS.md` 중심 운영 구조 확정
- 서브에이전트 역할과 handoff 규칙 문서화
- QA 3회 루프와 release_ops 추적 문서 생성
- 바로 확장 가능한 Phaser 골격과 테스트 시작점 제공
- 개발 전 전체 시나리오/월드/스테이지/마을 설계 확정

## 전체 시나리오 확정안

- 전체 메인 시나리오: `프롤로그 -> 6대륙 -> 종막`
- 전체 메인 스테이지: `60`
- 메인 안전 거점: `8`
- 1.0 출시 권장 컷: `프롤로그 + 1~2대륙`

## [확인 필요]

- Google Play 데이터 세이프티 콘솔 저장 완료 여부
- Play Console 서명키 / 실광고 / 실결제 계정 실값

## [TODO]

- Play Console 스토어 등록정보 입력 저장
- Play Console 데이터 세이프티 입력 저장
- 최종 상용 아트/아이콘 승인 유지
- 가챠 확률표 검토
- 대사 시트 본문 확장
- 대륙별 서브 퀘스트와 이벤트 대화 작성

## 초기 리스크

| ID | 리스크 | 영향 | 대응 오너 |
| --- | --- | --- | --- |
| R-01 | Android 광고/IAP 실값 미입력 | 네이티브 상용 검증 지연 | `release_ops_agent` |
| R-02 | ARPG 범위가 넓어 MVP 폭주 가능 | 일정 붕괴 | `planner_agent` |
| R-03 | 도트 본체와 대화용 일러스트의 톤 불일치 | 상용 품질 저하 | `asset_agent` |
| R-04 | 피로도/광고/가챠 설계가 UX 피로를 유발할 수 있음 | 잔존율 저하 | `ui_agent`, `qa_agent` |
| R-05 | 저장 포맷이 너무 일찍 고정되면 후속 변경 비용 증가 | 마이그레이션 리스크 | `game_logic_agent` |

## 작업 요청 묶음

### planner_agent

- task_name: `mvp_scope_and_gate_setup`
- objective: 출시 준비 기준으로 MVP 범위, 단계 게이트, 완료 기준을 고정한다.
- scope_in: 게임 핵심 루프, 문서 연결, 리스크 등록
- scope_out: 실제 광고 SDK 선정, 실제 스토어 등록
- required_inputs: `AGENTS.md`, `docs/PROJECT_BRIEF.md`
- dependencies: 없음
- done_criteria: Gate 0~2 기준이 문서에 연결됨
- output_files: `PLAN.md`, `docs/DONE_CRITERIA.md`, `TODO.md`
- risks_to_watch: 범위 폭주, 미확정 입력값 누락
- escalation_if_blocked: 미확정 값은 `[확인 필요]`로 남기고 진행

### release_ops_agent

- task_name: `release_input_tracking_bootstrap`
- objective: 광고/IAP/스토어/이미지 생성 입력 추적 구조를 시작한다.
- scope_in: placeholder 구조, ownership 구분, 입력 테이블
- scope_out: 실제 Secret 입력
- required_inputs: `docs/PROJECT_BRIEF.md`, `PLAN.md`
- dependencies: planner 범위
- done_criteria: 사람이 넣을 값/코드 연결값/콘솔값이 분리됨
- output_files: `docs/release_ops/*`
- risks_to_watch: 값 카테고리 혼동
- escalation_if_blocked: 미정 값은 `YOUR_VALUE_HERE` 유지

### game_logic_agent

- task_name: `core_state_bootstrap`
- objective: 피로도, 스테이지 진입, 저장 포맷의 최소 상태 모델을 만든다.
- scope_in: 상태 전이, 저장 인터페이스, 테스트 가능 함수
- scope_out: 실전 전투 AI 세부 구현
- required_inputs: `docs/game/CORE_LOOP.md`, `docs/game/SAVE_LOAD.md`
- dependencies: planner 범위 확인
- done_criteria: 상태 함수와 테스트가 기본 동작함
- output_files: `src/game/core/*`, `src/game/services/*`, `tests/*`
- risks_to_watch: 숨은 상태 꼬임, 저장 포맷 난립
- escalation_if_blocked: 미확정 데이터 구조는 TODO 주석과 함께 격리

### ui_agent

- task_name: `mobile_ui_flow_baseline`
- objective: 모바일 ARPG 기준 UI 흐름과 화면 우선순위를 정리한다.
- scope_in: 로비, 대륙 지도, 스테이지 진입, 광고/IAP 진입 UX
- scope_out: 최종 비주얼 스킨 확정
- required_inputs: `docs/PROJECT_BRIEF.md`, `docs/game/CORE_LOOP.md`
- dependencies: planner 범위
- done_criteria: 주요 화면 흐름과 UI 규칙 문서화
- output_files: `docs/ui/*`
- risks_to_watch: 정보 과밀, 초보자 혼란
- escalation_if_blocked: 보류 항목은 `UI_SCREENS.md`에 TODO 등록

### asset_agent

- task_name: `commercial_art_guardrails`
- objective: 도트 캐릭터와 대화용 일러스트의 공통 톤과 검수 기준을 정리한다.
- scope_in: 스타일 키워드, 금지 요소, 프롬프트 템플릿, AI 티 최소화 기준
- scope_out: 실제 원본 제작
- required_inputs: `docs/PROJECT_BRIEF.md`, `docs/ui/UI_RULES.md`
- dependencies: UI 우선 정보 구조
- done_criteria: 아트 가이드와 검수표가 실제 체크 가능 상태
- output_files: `docs/art/*`
- risks_to_watch: IP 유사성, 시각 톤 분열
- escalation_if_blocked: 확정 어려운 부분은 예시 대신 금지 규칙으로 고정

### integration_agent

- task_name: `structure_alignment_check`
- objective: 문서, 코드, 테스트, release_ops 구조가 따로 놀지 않게 묶는다.
- scope_in: 파일 구조, 링크, 인터페이스 정합성
- scope_out: 새로운 기능 제안
- required_inputs: 전체 문서 및 `src/`, `tests/`
- dependencies: 각 에이전트 산출물
- done_criteria: 참조 경로와 책임 중복 이슈가 정리됨
- output_files: `docs/DECISIONS.md`, `docs/RISK_REGISTER.md`, `README.md`
- risks_to_watch: 문서만 있고 코드 연결 없음
- escalation_if_blocked: 충돌 시 planner/qa 순으로 상향

### qa_agent

- task_name: `three_loop_quality_gate_setup`
- objective: QA 반복 루프를 초기부터 작동시키는 테스트 체계를 만든다.
- scope_in: 테스트 시나리오, 버그 로그, 반복 루프 문서
- scope_out: 최종 승인 선언
- required_inputs: `docs/game/*`, `docs/ui/*`, `docs/art/*`, `docs/release_ops/*`
- dependencies: Gate 2 산출물
- done_criteria: 최소 3개 루프 문서와 severity 규칙이 준비됨
- output_files: `docs/qa/*`
- risks_to_watch: 마지막 검수로 밀리는 구조
- escalation_if_blocked: 테스트 전제 미확정 사항은 blockers로 표시

## 완료 판정

- 이번 단계 done_check: `false`
- 사유: Gate 5까지의 구현/QA 루프는 완료됐지만, Gate 6~7의 사람 입력값과 상용 아트 승인, QA 승인 기록이 아직 남아 있음

## 2026-04-04 Runtime Animation Prework

- Boot now supports an optional runtime animation manifest for final strips.
- A dev-only asset status route and runtime-aware Animation Viewer are in place for art integration.
- Scene re-entry cleanup and smoke artifact cleanup were added so repeat QA loops no longer inherit stale runtime errors.
- Remaining release blocker is still final gameplay art replacement, not runtime plumbing.

## 2026-04-05 Runtime Animation Intake Update

- Character runtime frame-sheet coverage is now `21/21` for the playable roster.
- Enemy runtime frame-sheet coverage is now `30/30` across all approved battle subjects and bosses.
- Animation Viewer now has an `enemy` category so approved enemy runtime clips can be checked before atlas replacement is complete.
- Battle runtime mapping now prefers approved enemy strip subjects for `continent_01` through `continent_06`.
- Remaining engineering gap is now character strip QA recovery, final placeholder replacement QA, and release-owned inputs.

## 2026-04-07 Town Rework Status

- The town-rework implementation phase is now in place with gameplay-complete placeholder art.
- Implemented scope:
  - walkable `Lumen Village`
  - camera follow and map bounds
  - blocked fountain / walls / building footprints
  - stage gate interaction
  - five shop exteriors
  - reusable shop interior flow
  - merchant interaction
  - ambient NPC patrol + greeting interaction
  - stage-specific battle backplates
- Open follow-up scope:
  - final pixel town asset swap
  - richer per-shop premium catalog / inventory data
  - optional patrol variety / extra ambient NPC density once town art lands

## 2026-04-07 Town Pixel Runtime Art Refresh

- Approved pixel-town runtime assets are now partially integrated into gameplay scenes.
- Live runtime coverage includes:
  - gate arch and fountain landmark art
  - weapon / armor / forge / relic shop exteriors
  - weapon / item / relic / blacksmith merchant art
  - guard / villager / traveler / child ambient NPC art
  - town props and doorway FX
- Remaining fallback scope is narrowed to:
  - item shop exterior
  - armor merchant sprite
  - outdoor ground tile runtime extraction
  - fountain water strip runtime extraction

## 2026-04-05 Runtime Character Intake

- The first 12 approved character frame master sheets are now stored under `assets/source/character-animation-master-sheets/approved`.
- Runtime strips were regenerated into `public/assets/runtime/characters/*` with a refreshed `public/assets/runtime/animation-manifest.json`.
- Animation Viewer resolves those 12 subjects to runtime clips, and the live village / battle scenes now use the same runtime textures when available.
- Remaining art blocker is no longer runtime hookup for enemy / VFX strips; the open art risk is character strip QA recovery plus final placeholder replacement.

## 2026-04-08 Animation Runtime Refresh

- Runtime animation manifest now covers all major viewer groups:
  - `21` playable characters
  - `30` enemy subjects
  - `9` NPC subjects
  - `5` effect subject groups
- Animation Viewer scope is expanded to `character / enemy / npc / effect`.
- Runtime regeneration is now split by source family:
  - `scripts/generate-runtime-character-clips.py`
  - `scripts/generate-runtime-extended-clips.py`
  - `scripts/generate-runtime-npc-clips.py`
  - `scripts/generate-runtime-effect-clips.py`
- Next polish gate is no longer manifest hookup. It is subject-level strip cleanup for the remaining extended subjects that still capture presentation fragments.
