# AGENTS.md

## 목적

이 저장소는 `히어로소드`의 게임 개발용 멀티 에이전트 하네스다. 모든 작업은 이 문서를 시작점으로 삼고, 각 전문 에이전트는 자신의 권한 범위 안에서만 결정한다. 목표는 빠른 구현이 아니라, 범위 통제와 품질 기준이 유지되는 상태에서 실제 개발이 굴러가게 만드는 것이다.

## 프로젝트 기본값

- 게임 이름: `히어로소드`
- 플랫폼: `Android`
- 개발도구: `TypeScript + Phaser 3 + Vite`
- 수익화: `광고 + IAP`
- 저장 방식: `로컬 저장`
- 오프라인 대응: `필수`
- 출시 우선 스토어: `Google Play`
- 현재 프로젝트 상태: `2026-04-03 기준 신규 초기화`

## 운영 원칙

1. `planner_agent`가 항상 최초로 범위와 게이트를 정리한다.
2. `release_ops_agent`는 계획 직후부터 입력값 추적을 시작한다.
3. `game_logic_agent`, `ui_agent`, `asset_agent`는 planner 범위 안에서만 병렬 작업한다.
4. `integration_agent`는 각 산출물이 실제 프로젝트 흐름으로 연결되는지 상시 점검한다.
5. `qa_agent`는 마지막 확인자가 아니라 Gate 2부터 개입한다.
6. `qa_agent` 승인 전까지 최종 완료 표기 금지다.
7. 추정 확정이 위험한 항목은 `[TODO]` 또는 `[확인 필요]`로 남긴다.

## 단계 게이트

| Gate | 목표 | 필수 산출물 | 통과 조건 |
| --- | --- | --- | --- |
| 0 | 프로젝트 입력 확인 | `docs/PROJECT_BRIEF.md`, `PLAN.md` 초안 | 빈 항목이 TODO/확인 필요로 분리됨 |
| 1 | 계획 정리 | `PLAN.md`, `TODO.md`, `docs/DONE_CRITERIA.md` | MVP 범위와 done 기준이 정의됨 |
| 2 | 구조 설계 | `CORE_LOOP`, `UI_FLOW`, `ART_DIRECTION`, `QA_PLAN`, `RELEASE_INPUTS` | 로직/UI/아트/QA/release_ops 초안 연결 완료 |
| 3 | 구현 준비 | 작업 요청서, 인터페이스 명세 | 충돌 없는 입력값과 책임 분배 완료 |
| 4 | 1차 통합 | 최소 실행 빌드, 저장/복구 확인 | 핵심 루프와 UI 연결 확인 |
| 5 | QA 반복 루프 | `QA_LOOP_01~03`, `BUG_LOG` | 최소 3회 수정-재테스트 루프 기록 |
| 6 | 출시 준비 점검 | release_ops 문서 전체 | 운영값 분리 및 누락 관리 가능 |
| 7 | 완료 판정 | QA 승인, 체크리스트 요약 | handoff 가능한 상태 + 미해결 리스크 기록 |

## 에이전트 호출 순서

1. `planner_agent`
2. `release_ops_agent`
3. `game_logic_agent` / `ui_agent` / `asset_agent`
4. `integration_agent`
5. `qa_agent`

재호출 조건:
- 범위 변경: `planner_agent`
- 상태/저장/보상 구조 변경: `game_logic_agent`
- 주요 화면/UX 변경: `ui_agent`
- 스타일/에셋 방향 변경: `asset_agent`
- 수정 후 재검증: `qa_agent`
- 폴더/인터페이스 충돌: `integration_agent`
- 광고/IAP/스토어 값 변경: `release_ops_agent`

## 의사결정 권한

| 주제 | 최종 결정권 |
| --- | --- |
| 범위, 우선순위, 게이트 | `planner_agent` |
| 상태 전이, 저장 구조, 보상 규칙 | `game_logic_agent` |
| 화면 흐름, HUD, UX 구조 | `ui_agent` |
| 시각 톤, 프롬프트 기준, 아트 품질 | `asset_agent` |
| 통과/미통과, 수정 재요청 | `qa_agent` |
| 파일 구조, 인터페이스 연결 | `integration_agent` |
| 광고/IAP/스토어/입력값 추적 | `release_ops_agent` |

## 충돌 해결 우선순위

1. `qa_agent`의 미통과 판정
2. `planner_agent`의 범위 통제
3. `integration_agent`의 구조 충돌 조정
4. 각 전문 에이전트의 자기 영역 판단

보조 규칙:
- UX 흐름은 `ui_agent` 우선
- 시각 품질은 `asset_agent` 우선
- 통합 조정은 `integration_agent`가 하되 범위 확장은 금지

## 공통 산출물 형식

모든 에이전트는 아래 형식을 유지한다.

```md
- summary:
- inputs:
- decisions:
- todo:
- risks:
- artifacts_changed:
- handoff_to:
- handoff_notes:
- done_check:
```

## 작업 요청 형식

```md
- task_name:
- objective:
- scope_in:
- scope_out:
- required_inputs:
- dependencies:
- done_criteria:
- output_files:
- risks_to_watch:
- escalation_if_blocked:
```

## Handoff 필수 항목

- 입력 문서 또는 참고 문서
- 이번 결정사항
- 아직 미확정 항목
- 현재 리스크
- 다음 작업자가 봐야 할 핵심 메모

## QA 강제 규칙

- Gate 2부터 QA 개입
- 최소 3회 이상 `문제 목록 -> 수정안 적용 -> 재테스트 결과 -> 남은 리스크`를 기록
- 광고 진입/이탈, 저장/복구, 앱 재실행, 튜토리얼 중단, 씬 전환, 빠른 연타, 생성형 AI 티 여부를 반드시 점검

관련 문서:
- `docs/qa/QA_PLAN.md`
- `docs/qa/QA_LOOP_01.md`
- `docs/qa/QA_LOOP_02.md`
- `docs/qa/QA_LOOP_03.md`

## release_ops 강제 규칙

- 실제값 하드코딩 금지
- 아래 3개를 항상 분리:
  - 사람이 직접 입력할 값
  - 코드가 읽는 값
  - 외부 콘솔/스토어에 넣는 값
- `SAMPLE_`, `TEST_`, `YOUR_VALUE_HERE` 형식만 허용

관련 문서:
- `docs/release_ops/RELEASE_INPUTS.md`
- `docs/release_ops/VALUE_OWNERSHIP_MATRIX.md`
- `docs/release_ops/SECRETS_POLICY.md`

## 파일 처리 규칙

기존 파일 발견 시 아래 중 하나로만 판정한다.

- `KEEP`: 그대로 유지
- `PATCH`: 일부 수정
- `REPLACE`: 대체 필요
- `ADD_NEW`: 신규 생성

이유는 한 줄로 남긴다.

## 문서 갱신 규칙

기능 추가나 구조 변경 시 가능한 한 아래를 함께 갱신한다.

- `PLAN.md`
- `TODO.md`
- `docs/DECISIONS.md`
- `docs/RISK_REGISTER.md`
- `docs/game/CORE_LOOP.md`
- `docs/ui/UI_FLOW.md`
- `docs/art/ART_DIRECTION.md`
- `docs/qa/QA_PLAN.md`
- `docs/release_ops/RELEASE_INPUTS.md`
- `docs/release_ops/RELEASE_CHECKLIST.md`

## 파일 연결 맵

- 계획/범위: `PLAN.md`, `docs/DONE_CRITERIA.md`
- 서사/월드: `docs/story/*`
- 게임 로직: `docs/game/*`, `src/game/core/*`
- UI/UX: `docs/ui/*`, `src/game/scenes/*`
- 아트/에셋: `docs/art/*`, `assets/*`
- QA: `docs/qa/*`, `tests/*`, `scripts/run-smoke-check.mjs`
- 출시 준비: `docs/release_ops/*`, `plugins/*`
