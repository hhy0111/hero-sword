# BUG_LOG.md

| ID | 발견일 | 루프 | 심각도 | 영역 | 요약 | 재현 절차 | 담당 | 상태 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BUG-006 | 2026-04-04 | Loop 03 | Blocker | 아트/스토어 | placeholder atlas 자산으로 상용 PASS 불가 | `output/store-screenshots/*.png` 확인 | `asset_agent` | 열림 |
| BUG-007 | 2026-04-04 | Loop 03 | Blocker | release_ops | 데이터 세이프티 답변, 서명키, 실광고/실결제 계정 실값 누락 | `docs/release_ops/*`, `TODO.md` 확인 | `release_ops_agent`, 사람 | 열림 |
| BUG-003 | 2026-04-03 | Loop 01 | Minor | QA 자동화 | Playwright `drawImage` pageerror 노이즈 | smoke 테스트 후 `errors-0.json` 확인 | `integration_agent` | 해결 |
| BUG-001 | 2026-04-03 | Loop 01 | Major | 렌더링/QA 자동화 | headless 캡처가 검게 출력됨 | smoke 테스트 실행 후 `shot-0.png` 확인 | `integration_agent` | 해결 |
| BUG-004 | 2026-04-04 | Loop 02 | Major | UI/스토어 | 로비/파티/장비 화면 텍스트 밀집으로 정보 우선순위가 흐림 | `store_01_village.png`, `store_04_party.png`, `store_05_equipment.png` 확인 | `ui_agent` | 열림 |
| BUG-005 | 2026-04-04 | Loop 02 | Major | UX/광고 | 광고 실패 후 fallback 안내가 상태 문구 중심이라 발견성이 낮음 | 로비에서 광고 실패 흐름 재현 | `ui_agent` | 열림 |
| BUG-002 | 2026-04-03 | Loop 01 | Minor | QA 자동화 | headless Chromium `AudioContext` 콘솔 에러 | smoke 테스트 후 `errors-0.json` 확인 | `integration_agent` | 해결 |
| BUG-008 | 2026-04-04 | Loop 03 | Major | runtime/scene lifecycle | second battle entry reused destroyed sprite refs and stale smoke artifacts preserved old errors-0.json after clean reruns | battle retry smoke flow + output/web-game/* review | integration_agent | resolved |
