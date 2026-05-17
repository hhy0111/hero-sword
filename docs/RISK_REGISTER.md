# RISK_REGISTER.md

## 2026-05-17 Addendum

| ID | Risk | Likelihood | Impact | Current State | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| R-17 | Mobile asset optimization uses resized and palette-compressed PNGs, so some illustrated backgrounds may need device-level visual QA before release | Medium | Low | Mitigated | Runtime sprite sheets were excluded, automated smoke/town checks passed, and representative optimized assets were visually inspected; run one final device pass before store upload | `asset_agent`, `qa_agent`, `release_ops_agent` |
| R-18 | Existing players may perceive fatigue loss when legacy `1000` point saves are migrated to the new `100` point scale | Medium | Medium | Mitigated in code | Save migration preserves the old fatigue ratio, so `970/1000` becomes `97/100`; release notes and QA should call this out if needed | `game_logic_agent`, `qa_agent`, `release_ops_agent` |
| R-19 | Lower fatigue numbers make ad/IAP rewards more sensitive to tuning mistakes | Medium | High | Open | Keep rewarded ad at `+6`, paid small at `+18`, paid large at `+45`, and verify Android grant paths before release | `release_ops_agent`, `qa_agent` |

## 2026-04-07 Addendum

| ID | Risk | Likelihood | Impact | Current State | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| R-14 | Mixed painted battle backplates and pixel-runtime town assets may feel visually inconsistent during the transition period | Medium | Medium | Open | Restrict painted runtime use to battle backgrounds only and regenerate the town/shop runtime asset set in pixel form before the village rework lands | `asset_agent`, `ui_agent`, `qa_agent` |
| R-15 | Placeholder town blockout can pass gameplay QA while still feeling visually unfinished until the final pixel asset batch lands | High | Medium | Open | Treat the current town as gameplay-complete but art-incomplete, and swap the runtime tiles / interiors / NPC sprites / marker FX as one coherent batch | `asset_agent`, `qa_agent` |
| R-16 | Headless Phaser keyboard automation is unreliable for mobile interaction checks | Medium | Medium | Mitigated | Runtime keyboard input is disabled; smoke, town, and store captures now use canvas taps plus deterministic scene-state validation. The generic web-game client may still stop at boot, so direct Playwright captures remain the visual source of truth | `qa_agent`, `integration_agent` |

| ID | 위험 | 가능성 | 영향 | 현재 상태 | 대응 | 오너 |
| --- | --- | --- | --- | --- | --- | --- |
| R-01 | Android 광고/IAP 실값 미입력 | 낮음 | 높음 | 완화 | SDK/provider는 확정, 실 App ID/API Key 입력만 남김 | `release_ops_agent` |
| R-02 | ARPG 범위 폭주 | 높음 | 높음 | 열림 | 로비-지도-스테이지-저장 중심 MVP 유지 | `planner_agent` |
| R-03 | 도트와 일러스트 톤 불일치 | 중간 | 높음 | 열림 | `ART_DIRECTION`, `PROMPT_LIBRARY`, `ART_QA_CHECKLIST` 동시 유지 | `asset_agent` |
| R-04 | 피로도/광고 UX 피로 누적 | 중간 | 높음 | 열림 | UI 안내 규칙과 QA 광고 흐름 테스트 강화 | `ui_agent`, `qa_agent` |
| R-05 | 저장 포맷 변경 시 마이그레이션 비용 증가 | 중간 | 높음 | 완화 | `schemaVersion` 정책과 저장/복구 회귀 테스트 추가 | `game_logic_agent` |
| R-06 | 문서만 있고 코드 연결이 부족한 상태 | 중간 | 중간 | 완화 | 최소 실행 코드, 테스트, smoke, store capture 동시 유지 | `integration_agent` |
| R-07 | AI 생성 아트 티가 강함 | 높음 | 높음 | 열림 | 아트 금지 요소와 PASS/SOFT FAIL/FAIL 판정 강제 | `asset_agent`, `qa_agent` |
| R-08 | Phaser 기본 번들 크기가 초기 기준에서 큼 | 중간 | 중간 | 열림 | Gate 4 전 코드 분할 또는 빌드 전략 재검토 | `integration_agent` |
| R-09 | 전체 시나리오 분량이 초기 개발 속도를 압박할 수 있음 | 높음 | 높음 | 열림 | 전체 설계와 1.0 출시 컷을 분리 유지 | `planner_agent` |
| R-10 | 로컬 Android SDK 경로가 없으면 네이티브 assemble 검증이 막힘 | 높음 | 중간 | 열림 | `android/local.properties.sample` 기준으로 개발 PC마다 SDK 경로 입력 | `release_ops_agent`, 사람 |
| R-11 | headless Chromium 캡처 중 `drawImage` pageerror가 간헐적으로 남음 | 중간 | 낮음 | 완화 | smoke 노이즈 스크럽과 원인 분리 완료, 재발 시 캡처 경로 우선 점검 | `qa_agent`, `integration_agent` |
| R-12 | 남은 콘솔 입력값 누락으로 Gate 7 handoff가 지연됨 | 높음 | 높음 | 열림 | 서명키, 실광고/실결제 계정 실값, 데이터 세이프티 답변을 분리 추적 | `release_ops_agent`, 사람 |
| R-13 | 스토어용 화면이 하네스/디버그 톤에서 아직 상용 톤으로 다듬어지지 않음 | 높음 | 높음 | 열림 | 캡처는 확보했지만 최종 아트/UI 정리 전까지 QA Blocker 유지 | `ui_agent`, `asset_agent`, `qa_agent` |

## 다음 리뷰 시점

- Gate 2 종료 시
- QA Loop 03 종료 시
- Release Gate 진입 시
