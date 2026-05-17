# Hero Sword Multi-Agent Game Harness

## Latest Update

- Added a dev-only `Animation Viewer` flow through `Village -> Options -> Animation Viewer`.
- The viewer exposes three selector boxes for category, target, and action, then shows source-frame strips plus a live animation preview.
- Viewer capture automation is available via `npm run capture:viewer`.
- Party roles now express distinct combat jobs: guardian shield/taunt, support attack buffs, mage splash, ranger pierce, warrior sweep, assassin execute rush.
- Battle HUD now exposes shield and buff states visually, and store battle captures search for the strongest action frame instead of using one fixed timestamp.
- Vite build output is split into `phaser`, `native-bridge`, and app chunks for cleaner release builds.

- Field battle now includes enemy patterns, telegraphs, projectiles, burst effects, and charge trails.
- A debug capture harness is available through `window.__heroSwordDebug` for deterministic scene jumps.
- Store screenshot automation is available via `npm run capture:store`.
- Smoke QA now scrubs the known canvas capture `drawImage` false positive after the Playwright pass.
- Party normalization was fixed to hard-cap the active party at 4 members.

## Verification Snapshot

- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run test:smoke`
- `npm run capture:store`
- `npm run capture:viewer`

`히어로소드`는 Android 출시를 우선으로 하는 ARPG 프로젝트다. 현재 저장소는 `TypeScript + Phaser 3 + Vite` 기반의 실행 골격과, `AGENTS.md` 중심의 멀티 에이전트 운영 문서를 함께 가진다. 목표는 문서 나열이 아니라, 기획-구현-통합-QA-release_ops가 바로 이어지는 작업 환경을 유지하는 것이다.

## 선택한 개발도구

- 런타임: `Phaser 3`
- 언어: `TypeScript`
- 빌드/개발 서버: `Vite`
- 단위 테스트: `Vitest`
- Android 패키징: `Capacitor 7`

선정 이유:
- 상태 전이와 저장 로직을 타입으로 고정하기 쉽다.
- AI가 디버깅하기 쉬운 파일 구조와 에러 메시지를 제공한다.
- 모바일 웹 기준으로 빠르게 반복 개발하고, 이후 Android 패키징 후보와 연결하기 쉽다.

## 빠른 시작

```bash
npm install
npm run assets:generate
npm run dev
```

추가 명령:

```bash
npm run typecheck
npm run test
npm run test:smoke
npm run build
npm run android:add
npm run android:sync
npm run android:open
```

Android debug 준비:

```bash
copy android\\local.properties.sample android\\local.properties
# android/local.properties 안의 sdk.dir를 내 PC 경로로 수정
npm run build:android
```

## 문서 우선순위

1. [`AGENTS.md`](./AGENTS.md)
2. [`PLAN.md`](./PLAN.md)
3. [`docs/PROJECT_BRIEF.md`](./docs/PROJECT_BRIEF.md)
4. [`docs/DONE_CRITERIA.md`](./docs/DONE_CRITERIA.md)
5. [`docs/qa/QA_PLAN.md`](./docs/qa/QA_PLAN.md)
6. [`docs/release_ops/RELEASE_INPUTS.md`](./docs/release_ops/RELEASE_INPUTS.md)
7. [`docs/story/STORY_MASTER.md`](./docs/story/STORY_MASTER.md)

## 폴더 요약

- `agents/`: 서브에이전트별 성향, 권한, handoff 규칙
- `docs/`: 기획, UI, 게임 로직, 아트, QA, release_ops 운영 문서
- `docs/story/`: 전체 서사, 월드맵, 마을, 스테이지 구조
- `src/`: 최소 실행 가능한 게임 골격
- `android/`: Capacitor Android 프로젝트, AdMob/RevenueCat 네이티브 연결점
- `tests/`: 상태 전이와 저장 로직 테스트
- `scripts/`: smoke QA 자동화 진입점
- `skills/`: 반복 작업 자동화 후보
- `plugins/`: Android 광고/IAP/MCP 후보 정리
- `assets/`: 실제 에셋 및 placeholder 관리

## 현재 상태

- Gate 0 완료: 입력값 정리, 빈 프로젝트 확인
- Gate 1 완료: 운영 구조와 계획 문서 생성
- Gate 4 진행 중: 로비 터치 조이스틱, 자동전투, 광고/IAP 브리지, 파티/가챠/상점/하우징 메타 루프 구현
- QA 승인 전까지 완료 표기 금지

## 현재 플레이 가능 범위

- 로비 마을에서 `광고 보상`, `상점`, `파티`, `가챠`, `하우징`, `월드맵`으로 이동 가능
- 월드맵 -> 스테이지 선택 -> 전투 -> 결과까지 기본 ARPG 루프 동작
- 전투는 단일 HP 시뮬레이터가 아니라 `아군/적 유닛 배치 + 전진/접전 + 보스 합류`가 보이는 필드형 전투로 동작
- 파티 편성 결과가 실제 전투 파티와 전투력 표시에 반영
- 1회/10회 가챠, 10회 4성 이상 보장, `배너 선택`, `순차 공개 연출`, 중복 캐릭터 누적 구조 동작
- 골드/히어로스톤 상점과 IAP 모의 구매 흐름 동작
- 하우징 3슬롯 배치 저장 동작
- 광고 실패 시 `Q` 키 대기 회복 fallback UX 동작

## 기본 조작

- `Enter`: 월드맵 진입 또는 현재 화면 주요 선택
- `Space`: 로비 광고 보상
- `Q`: 광고 실패 후 대기 회복 fallback
- `S`: 상점 또는 가챠 10회
- `P`: 파티
- `G`: 가챠
- `H`: 하우징
- `B`: 이전 화면 또는 마을 복귀
- `A`: 전투 수동 스킬 또는 가챠 1회
- `Left/Right`: 가챠 배너 전환
- `F`: 전체화면 토글

## 주의

- 광고 App ID, 광고 Unit ID, 결제 키, 서명키, 외부 서비스 Secret은 문서와 코드에 실제값을 넣지 않는다.
- 실제 운영값은 [`docs/release_ops/VALUE_OWNERSHIP_MATRIX.md`](./docs/release_ops/VALUE_OWNERSHIP_MATRIX.md) 기준으로 관리한다.
- 범위 변경 시 `PLAN.md`, `TODO.md`, `docs/DECISIONS.md`, `docs/RISK_REGISTER.md`를 함께 갱신한다.
- `npm run test:smoke`는 Codex `develop-web-game` 스킬 스크립트와 `tests/playwright_smoke_actions.json`을 사용한다.
- Android 빌드는 로컬 SDK 경로가 필요하다. 저장소에는 [`android/local.properties.sample`](./android/local.properties.sample)만 유지한다.
- Android `assembleDebug`는 이 환경에서 `JDK 21`과 로컬 SDK 경로로 재검증 완료했다.
