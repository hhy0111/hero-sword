# CHANGE_LOG.md

## 2026-04-04 Latest

- `PATCH`: `src/config/runtime.ts` now separates test/live ad and mock-store behavior via env flags and registers additional draft IAP products.
- `PATCH`: `src/platform/ads.ts` exports deterministic ad-unit resolution for QA verification, and tests now cover test/live ID routing.
- `PATCH`: `tests/store.test.ts` now verifies IAP grants survive save + load.
- `PATCH`: `WorldMapScene` now surfaces the `루멘 마을 -> 6대륙 -> 검은문 전진캠프` progression state directly in the UI.
- `PATCH`: `scripts/capture-store-screenshots.mjs` now clears stale outputs, captures party/equipment meta-loop screens, and keeps battle/gacha capture flows deterministic.
- `ADD_NEW`: `docs/story/CONTENT_PRODUCTION_ORDER.md`, `DIALOGUE_SHEET_DRAFT.md`, `NPC_RELATIONSHIP_MAP.md`.
- `ADD_NEW`: `docs/game/ACCESSORY_RULES.md`.
- `ADD_NEW`: `docs/release_ops/ICON_FEATURE_BRIEF.md`, `STORE_DESCRIPTION_DRAFT.md`, `ANDROID_JDK21_SETUP.md`, `PRICING_POLICY_DRAFT.md`.
- `PATCH`: QA loop documents, release checklist, plan, and TODO now reflect the post-Gate-5 actual state instead of the initial bootstrap state.

- `ADD_NEW`: `OptionsScene` and `AnimationViewerScene` for the dev-only animation review flow.
- `ADD_NEW`: `src/game/data/animationCatalog.ts` for character/effect animation coverage and selector-driven lookup.
- `ADD_NEW`: `docs/art/ANIMATION_VIEWER.md` and `scripts/capture-animation-viewer.mjs`.
- `PATCH`: `VillageLobbyScene` now links to an options menu, and the animation viewer menu is gated by a runtime dev-tools flag.
- `PATCH`: Added role-specific battle rules for guardian shield/taunt, support attack buffs, mage splash, ranger pierce, warrior sweep, and assassin execute chains.
- `PATCH`: Battle debug output and battle HUD now surface shield, damage boost, and taunt state.
- `PATCH`: `scripts/capture-store-screenshots.mjs` now searches battle windows for the strongest frame instead of using one fixed capture tick.
- `PATCH`: `vite.config.ts` now splits release chunks into `phaser`, `native-bridge`, and app bundles.

- `PATCH`: Added battle VFX state (`telegraph`, `projectile`, `burst`, `charge`, `heal`, `impact`) and rendered them in the Phaser battle scene.
- `PATCH`: Added enemy pattern variety (`melee`, `ranged`, `charger`, `caster`, `boss`) and tied encounter plans to stage types.
- `PATCH`: Exposed `window.__heroSwordDebug` helpers for save injection, scene jump, and session state control.
- `ADD_NEW`: `scripts/capture-store-screenshots.mjs` and `npm run capture:store`.
- `PATCH`: `scripts/run-smoke-check.mjs` now scrubs the known canvas-probe `drawImage` false positive from smoke artifacts.
- `PATCH`: Fixed party normalization so showcase/debug flows and gameplay never exceed 4 active members.

## 2026-04-03

- `ADD_NEW`: 빈 프로젝트에 멀티 에이전트 운영 하네스 초기 구축
- `ADD_NEW`: `AGENTS.md`, `PLAN.md`, `TODO.md`, `README.md` 생성
- `ADD_NEW`: `/docs` 하위 기획/UI/게임/아트/QA/release_ops 문서 구조 생성
- `ADD_NEW`: `Phaser + TypeScript` 최소 실행 골격과 상태 테스트 추가
- `ADD_NEW`: `skills/`, `plugins/` 후보 구조 추가
- `PATCH`: headless QA 안정화를 위해 초기 렌더러를 `Canvas`로 전환
- `ADD_NEW`: `scripts/run-smoke-check.mjs`, `npm run test:smoke`, `tests/playwright_smoke_actions.json` 추가
- `ADD_NEW`: `docs/story/*` 전체 스토리/월드/마을/스테이지 설계 문서 추가
- `PATCH`: 프로젝트 브리프와 결정/리스크 문서에 전체 시나리오 구조 반영
- `ADD_NEW`: `scripts/generate-master-atlas.mjs`, `assets/hero_sword_master_atlas.png` 추가
- `PATCH`: 로비, 월드맵, 스테이지 선택, 전투, 결과 씬 골격 구현
- `PATCH`: 로비 씬에 안드로이드 대응용 가상패드(`TOUCH MOVE`) 추가
- `PATCH`: 프롬프트 라이브러리를 복붙 가능한 완성형 프롬프트 구조로 변경
- `PATCH`: 로비 씬에 터치 조이스틱, 광고 보상, 스타터팩 구매, 결제 복원 버튼 추가
- `ADD_NEW`: `src/game/core/battle.ts` 자동전투 시뮬레이션 추가
- `PATCH`: 전투 씬을 자동전투/수동 스킬/적 강공/자동 별 판정 구조로 교체
- `PATCH`: 결과 씬에 전투 통계 표기 및 전면 광고 호출 경로 추가
- `ADD_NEW`: `src/platform/ads.ts`, `src/platform/store.ts`, `src/platform/capacitor.ts` 네이티브 브리지 추가
- `ADD_NEW`: `capacitor.config.ts`, `android/` Capacitor Android 프로젝트 추가
- `PATCH`: AdMob / RevenueCat Android 연결 포인트와 release_ops 문서 갱신
- `PATCH`: 기획/아트 문서에 `캐릭터를 행동 단위 애니메이션으로 분해 가능한 형태로 설계` 요구 반영
- `ADD_NEW`: `docs/art/CHARACTER_ANIMATION_PROMPT_GUIDE.md` 추가
- `PATCH`: `docs/art/READY_TO_COPY_PROMPTS.md`에 애니메이션 설계/행동 분해용 복붙 프롬프트 추가
- `ADD_NEW`: `docs/story/COMPANION_ROSTER.md` 추가
- `PATCH`: 전체 핵심 동료 수를 `18명`으로 고정하고 대륙별 명단 연결
- `PATCH`: 카인, 세라, 루나를 정식 스토리 로스터에 편입하고 전체 로스터에 성별/나이대 기준 추가
- `ADD_NEW`: `docs/game/WEAPON_RULES.md` 추가
- `PATCH`: 직업별 무기 종류, 장착 레벨, 능력치, 획득처 기준을 시스템 문서에 연결
- `ADD_NEW`: `docs/game/EQUIPMENT_RULES.md`, `docs/game/ARMOR_RULES.md` 추가
- `PATCH`: 무기군/방어구군, 성급, 강화, 장비 슬롯 구조를 문서로 고정
- `ADD_NEW`: `docs/art/CHARACTER_ACTION_MATRIX.md` 추가
- `PATCH`: 캐릭터 21명의 세부 행동 차이와 확장 애니메이션 목록을 문서로 고정
- `ADD_NEW`: `docs/art/CHARACTER_ANIMATION_SPECS.md` 추가
- `PATCH`: 캐릭터 21명의 프레임 수, 목표 fps, 루프 길이 기준을 문서로 고정
- `ADD_NEW`: `docs/art/CHARACTER_READY_TO_COPY_PROMPTS.md` 추가
- `PATCH`: 캐릭터 21명 전원의 이미지 요청용 완성형 복붙 프롬프트를 정리
- `ADD_NEW`: `docs/art/IMAGE_PROMPT_MASTER_PLAN.md`, `docs/art/NPC_VISUAL_SCOPE.md`, `docs/art/ENEMY_VISUAL_SCOPE.md`, `docs/art/VFX_DIRECTION.md` 추가
- `PATCH`: 전체 이미지 프롬프트용 범위, 미확정 항목 처리, 스토어 컷 목록, 아트 규격을 문서로 고정
- `ADD_NEW`: `docs/art/NPC_READY_TO_COPY_PROMPTS.md`, `docs/art/ENEMY_READY_TO_COPY_PROMPTS.md`, `docs/art/EQUIPMENT_READY_TO_COPY_PROMPTS.md`, `docs/art/VFX_READY_TO_COPY_PROMPTS.md`, `docs/art/STORE_READY_TO_COPY_PROMPTS.md` 추가
- `PATCH`: 실사용 복붙 프롬프트 파일 7종 전체 구성을 완료하고 인덱스 문서를 갱신
- `ADD_NEW`: `docs/art/IMAGE_GENERATION_EXECUTION_PLAN.md`, `docs/art/IMAGE_REVIEW_PLAYBOOK.md`, `docs/release_ops/STORE_IMAGE_PRIORITY.md` 추가
- `PATCH`: 시작 4인방 우선 생성 순서, 스토어 이미지 P0/P1/P2 우선순위, 생성 결과 검수 운영 흐름을 문서로 연결
- `ADD_NEW`: `src/game/data/characters.ts`, `shop.ts`, `housing.ts`, `summonPool.ts` 추가
- `ADD_NEW`: `src/game/data/gachaBanners.ts` 추가
- `ADD_NEW`: `src/game/core/party.ts`, `summon.ts`, `shop.ts`, `housing.ts` 추가
- `ADD_NEW`: `src/game/scenes/PartyScene.ts`, `GachaScene.ts`, `ShopScene.ts`, `HousingScene.ts` 추가
- `PATCH`: 저장 포맷을 캐릭터 로스터, 선택 파티, 무기 보유, 하우징 슬롯, 히어로스톤까지 포함하도록 확장
- `PATCH`: 로비 허브를 메타 루프 허브로 확장하고 상점/파티/가챠/하우징으로 직접 이동 가능하게 변경
- `PATCH`: 전투 시뮬레이션이 실제 편성 파티와 전투력을 읽도록 연결
- `PATCH`: 전투를 실제 적 유닛 배치, 전진, 접전, 보스 합류가 보이는 필드형 전투로 재구성
- `PATCH`: 가챠에 배너 선택, 픽업 풀, 결과 순차 공개 연출을 추가
- `PATCH`: 광고 실패 시 대기 후 무료 회복을 받을 수 있는 fallback UX 추가
- `ADD_NEW`: `tests/party.test.ts`, `tests/summon.test.ts`, `tests/metaSystems.test.ts` 추가
- `PATCH`: smoke 시나리오를 가챠/파티/하우징/상점 경유 후 전투 결과까지 통과하도록 확장
- `PATCH`: 로컬 SDK 경로와 JDK 21로 Android `assembleDebug` 재검증 완료
