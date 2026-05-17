# DECISIONS.md

## 2026-05-17

### D-018 Fatigue, Replay Reward, and Level Balance

- Decision: fatigue now uses a `100` point maximum, stage entry costs `3`, rewarded ads grant `+6`, fallback grants `+3`, and paid fatigue products grant `+18` or `+45`.
- Decision: already-cleared stage difficulties use a repeat reward rate of `0.5` for clear gold and EXP.
- Decision: the EXP curve is slowed so the full 144-stage Normal route ends around level 20 instead of the mid-30s.
- Reason: the prior `1000 / 10` fatigue setup allowed about 100 entries and made the fatigue economy feel effectively endless.
- Impacted files: `src/game/core/state.ts`, `src/game/core/progression.ts`, `src/game/data/world.ts`, `src/game/scenes/BattleScene.ts`, `src/config/runtime.ts`, `src/game/data/shop.ts`, `src/game/scenes/CashShopScene.ts`.
- QA follow-up needed: `yes`, especially Android rewarded ad and IAP grant flows.

## 2026-05-02

### D-017 메인 스테이지 볼륨 재확정

- 결정: 메인 스토리는 `대륙당 24개`, 총 `144개` 스테이지로 확장한다.
- 이유: 기존 10개 구성은 대륙별 갈등, 동맹 형성, 조각 회수, 진실 노출을 충분히 누적시키기 어려웠고, 대화형 스토리와 몬스터 로스터 확장까지 감당하기엔 호흡이 너무 짧았다.
- 영향 문서: `docs/story/STAGE_PROGRESSION.md`, `docs/story/WORLD_STRUCTURE.md`, `docs/story/STORY_MASTER.md`, `docs/ui/UI_FLOW.md`, `docs/game/CORE_LOOP.md`
- QA 재확인 필요: `예`

## 2026-04-07

### D-016 Town Runtime Art Direction Reset

- Decision: keep the newly generated painted battle backgrounds as provisional per-stage source art, but regenerate town, interior, NPC, and shop UI runtime assets in pixel form.
- Reason: the current game runtime direction remains pixel-art oriented. The painted town/shop batch is still useful for layout and mood reference, but not as direct runtime environment art.
- Impacted files:
  - `assets/source/world/README.md`
  - `docs/art/TOWN_SHOP_BATTLE_INTAKE_2026-04-07.md`
  - `docs/art/TOWN_REWORK_PIXEL_RUNTIME_READY_TO_COPY_PROMPTS.md`
  - `docs/game/TOWN_REWORK_SPEC.md`
  - `TODO.md`
- QA follow-up needed: `yes`

## 2026-04-03

### D-001 개발 스택 선정

- 결정: `TypeScript + Phaser 3 + Vite`
- 이유: 상태 전이와 디버깅 투명성이 높고, Android 우선 프로젝트에서 초기 반복 속도가 빠르다.
- 영향 문서: `README.md`, `PLAN.md`, `docs/game/SAVE_LOAD.md`
- QA 재확인 필요: `예`

### D-002 운영 기준 문서의 중심

- 결정: `AGENTS.md`를 최상위 운영 허브로 사용
- 이유: 역할, 충돌 해결, handoff, QA/release_ops 강제 규칙을 한곳에서 관리하기 위함
- 영향 문서: 전체
- QA 재확인 필요: `아니오`

### D-003 QA 개입 시점

- 결정: Gate 2부터 `qa_agent`가 문서와 테스트 설계에 개입
- 이유: 마지막 검수 구조를 방지하고 수정 루프 3회를 강제하기 위함
- 영향 문서: `docs/qa/*`, `PLAN.md`
- QA 재확인 필요: `아니오`

### D-004 Android 패키징 전략

- 결정: `Capacitor`를 Android 패키징 기본 경로로 확정
- 이유: AdMob / RevenueCat 연동과 `assembleDebug` 검증까지 끝나 초기 출시 경로로 충분히 확인됨
- 영향 문서: `docs/release_ops/STORE_PREP.md`, `plugins/CANDIDATES.md`
- QA 재확인 필요: `예`

### D-005 초기 렌더러 전략

- 결정: 초기 하네스 단계에서는 `Phaser.CANVAS`와 `noAudio`를 사용
- 이유: 브라우저 자동 캡처와 headless QA 루프를 안정화하기 위함. 실제 전투 밀도가 높아지면 WebGL 재평가 가능
- 영향 문서: `src/game/config.ts`, `docs/qa/QA_PLAN.md`
- QA 재확인 필요: `예`

### D-006 전체 월드 규모 확정

- 결정: 전체 월드는 `6개 대륙 + 1개 중앙 거점권 + 1개 최종 전진캠프`로 고정
- 이유: 스토리 호흡, 콘텐츠 볼륨, 라이브 확장 단위를 동시에 맞추기 쉬움
- 영향 문서: `docs/story/WORLD_STRUCTURE.md`, `docs/story/TOWNS_AND_SETTLEMENTS.md`
- QA 재확인 필요: `아니오`

### D-007 메인 시나리오 구조 확정

- 결정: 메인 시나리오는 `프롤로그 -> 6대륙 -> 종막` 4막 구조로 설계
- 이유: 마을-대륙-조각-동맹의 반복을 지루하지 않게 유지하면서도 메인 줄기를 잃지 않기 위함
- 영향 문서: `docs/story/STORY_MASTER.md`, `docs/story/STAGE_PROGRESSION.md`
- QA 재확인 필요: `아니오`

### D-008 스테이지 볼륨 확정

- 결정: 메인 스토리는 `대륙당 10개`, 총 `60개` 스테이지로 설계
- 이유: 각 대륙의 기승전결과 보스 구조를 안정적으로 배치할 수 있음
- 영향 문서: `docs/story/STAGE_PROGRESSION.md`, `docs/game/CORE_LOOP.md`
- QA 재확인 필요: `예`

### D-009 1.0 출시 컷 확정

- 결정: `1.0`은 `프롤로그 + 1대륙 + 2대륙` 완전 수록, `3대륙`은 예고만 포함
- 이유: 2대륙까지는 성장/장비/가챠/허브 메타 루프를 충분히 설명하면서 범위를 통제할 수 있음
- 영향 문서: `PLAN.md`, `docs/story/STORY_MASTER.md`, `docs/story/CONTENT_PRODUCTION_ORDER.md`
- QA 재확인 필요: `아니오`

### D-010 저장 포맷 버전 정책 확정

- 결정: 현재 저장 포맷은 `schemaVersion = 2`, 로더는 `1`과 `2`만 지원한다.
- 이유: 파티/장비/하우징 확장 이후에도 한 버전 호환만 유지하면 마이그레이션 복잡도를 통제할 수 있음
- 영향 문서: `docs/game/SAVE_LOAD.md`, `src/game/services/save.ts`
- QA 재확인 필요: `예`

### D-011 테스트 광고/실광고 분리 방식 확정

- 결정: 광고 테스트 모드는 `import.meta.env.DEV`와 `VITE_USE_TEST_ADS`로 제어한다.
- 이유: 개발/릴리즈 전환 시 코드 수정이 아니라 환경값만 바꿔 광고 노출 경로를 분리하기 위함
- 영향 문서: `src/config/runtime.ts`, `src/platform/ads.ts`, `docs/release_ops/ADS_SETUP.md`
- QA 재확인 필요: `예`

### D-012 장비 구조 확정

- 결정: `1.0`은 무기 + 갑옷 2축으로 유지하고, 장신구는 구조만 선고정하며 세트 효과는 도입하지 않는다.
- 이유: 메타 루프 이해도를 유지하면서 인벤토리/밸런싱 복잡도를 폭주시키지 않기 위함
- 영향 문서: `docs/game/EQUIPMENT_RULES.md`, `docs/game/ACCESSORY_RULES.md`, `docs/game/ARMOR_RULES.md`
- QA 재확인 필요: `아니오`

### D-013 Canvas 렌더러 유지

- 결정: 현재 전투 밀도와 캡처 흐름 기준으로 `Phaser.CANVAS`를 유지한다.
- 이유: smoke/capture/store 검증이 안정적으로 통과했고, 아직 WebGL 전환 이득보다 QA 안정화 가치가 큼
- 영향 문서: `src/game/config.ts`, `docs/qa/QA_LOOP_01.md`, `docs/release_ops/RELEASE_CHECKLIST.md`
- QA 재확인 필요: `예`

### D-014 스토어 정체성 기본값 확정

- 결정: Android 패키지명은 `com.appstudioon.herosword`, 개발자명은 `AppStudioOn`, 지원 메일은 `young02hwi@gmail.com`, 개인정보처리방침 URL은 `https://hhy0111.github.io/hero-sword/privacy-policy.html`로 둔다.
- 이유: Gate 6 릴리즈 입력값 중 문서/코드에 고정 가능한 항목을 먼저 확정해 상용 준비 블로커를 줄이기 위함
- 영향 문서: `src/config/runtime.ts`, `android/app/build.gradle`, `docs/release_ops/*`, `docs/privacy-policy.html`
- QA 재확인 필요: `예`

### D-015 한국 기준 IAP 시작 가격표 확정

- 결정: 기본 가격표는 스타터팩 `₩1,500`, 피로도 소형 `₩1,200`, 피로도 대형 `₩2,400`, 젬 묶음 `₩7,900`으로 둔다.
- 이유: 초반 전환 상품은 저진입, 소형/대형 피로도 팩은 2배 가격 이내로 2배 이상 효율, 젬 묶음은 가챠 핵심 결제축이 읽히도록 맞추기 위함
- 영향 문서: `src/config/runtime.ts`, `docs/release_ops/PRICING_POLICY_DRAFT.md`, `docs/release_ops/RELEASE_INPUTS.md`
- QA 재확인 필요: `예`

### D-016 런타임 표시 문자열 한국어 적용 기준

- 결정: 캐릭터/장비/마을/NPC/영입 대화 데이터의 영문 원문은 유지하되, 모든 화면 출력 단계에서 `t()`를 통과시키고 한국어 직접 매핑을 확장한다.
- 이유: 기존 저장/데이터 키와 영어 기본값을 흔들지 않으면서 한국어 팩에서 즉시 보이는 영어 노출을 막기 위함
- 영향 문서: `src/game/services/i18n.ts`, `src/game/ui/dialogueOverlay.ts`, `src/game/scenes/*`, `tests/koreanLocalizationCoverage.test.ts`
- QA 재확인 필요: `예`

### D-017 모바일 터치 전용 입력 기준

- 결정: Android 대상 런타임에서는 Phaser keyboard 입력을 비활성화하고, 씬 조작은 터치 버튼/드래그 조이스틱/자동 진입으로 통일한다.
- 이유: 휴대폰 게임에서 키보드 폴백이 실제 UX와 QA를 흐리므로 입력 표면을 모바일 기준으로 고정하기 위함
- 영향 문서: `src/game/config.ts`, `src/game/scenes/*`, `tests/playwright_smoke_actions.json`, `scripts/run-town-manual-checks.mjs`, `scripts/capture-store-screenshots.mjs`
- QA 재확인 필요: `예`

### D-018 동료 영입 획득 연출 기준

- 결정: 스테이지 영입 이벤트는 영입 대화가 모두 끝난 뒤 캐릭터 카드가 회전하며 중앙으로 날아오고, `캐릭터명 획득` 문구와 파티클로 획득을 확정 표시한다.
- 이유: 스토리 대화와 실제 캐릭터 습득 보상이 분리되어 보이면 동료 획득 감각이 약하므로, 대화 종료 시점에 보상 연출을 붙여 보상 인지를 강화하기 위함
- 영향 문서: `src/game/scenes/ResultScene.ts`, `src/game/core/recruitmentPresentation.ts`, `docs/ui/UI_FLOW.md`, `docs/story/STAGE_RECRUIT_EVENTS.md`
- QA 재확인 필요: `예`

### D-019 장비 레벨 제한과 상점 비교 표시 기준

- 결정: 무기/방어구 장착은 장비군 일치뿐 아니라 캐릭터 현재 레벨이 장비 요구 레벨 이상일 때만 허용한다.
- 결정: 상점 장비 상품은 보유 캐릭터 중 같은 장비군을 쓰는 캐릭터의 현재 장착 상태와 비교해 전투력 변화를 표시한다.
- 이유: 표시된 `Lv.`가 실제 제한으로 작동하지 않으면 성장/상점 판단이 흐려지고, 구매 전 장비 가치가 즉시 판단되지 않기 때문
- 영향 문서: `src/game/core/equipment.ts`, `src/game/core/shop.ts`, `src/game/scenes/ShopScene.ts`, `docs/game/EQUIPMENT_RULES.md`, `docs/ui/UI_FLOW.md`
- QA 재확인 필요: `예`
