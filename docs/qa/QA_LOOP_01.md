# QA_LOOP_01.md

## 목적

- 코어 루프와 저장/복구 리스크를 초기에 드러낸다.

## 대상

- 로비 이동
- 스테이지 진입 조건
- 피로도 소모/회복
- 저장 후 재실행 복구

## 문제 목록

| ID | 심각도 | 문제 | 재현 절차 | 수정 우선순위 | 상태 |
| --- | --- | --- | --- | --- | --- |
| QA1-001 | Major | headless 캡처 시 초기 렌더가 검게 나옴 | `web_game_playwright_client`로 로비 smoke 실행 | 높음 | 해결 |
| QA1-002 | Minor | headless Chromium에서 `AudioContext` 콘솔 에러 발생 | `npm run test:smoke` 후 `output/web-game/errors-0.json` 확인 | 낮음 | 해결 |
| QA1-003 | Minor | Playwright 캡처 중 `drawImage` pageerror 1건 발생 | `npm run test:smoke` 후 `output/web-game/errors-0.json` 확인 | 낮음 | 해결 |

## 수정안 적용

- `Phaser.AUTO`를 `Phaser.CANVAS`로 변경
- 초기 하네스 단계에서 `audio.noAudio`, `audio.disableWebAudio` 적용
- `tests/playwright_smoke_actions.json` 추가
- `scripts/run-smoke-check.mjs`와 `npm run test:smoke` 스크립트 추가
- `로비 -> 월드맵 -> 스테이지 선택 -> 전투 -> 결과` 실제 씬 흐름 구현
- 단일 아틀라스 이미지 `assets/hero_sword_master_atlas.png` 생성 및 런타임 연결
- 로비 씬에 터치 조이스틱, 광고 보상 버튼, 스타터팩 구매 버튼, 복원 경로 추가
- 전투 씬에 자동전투/수동 스킬/적 강공/자동 별 판정 추가
- Capacitor Android 프로젝트 생성 및 AdMob/RevenueCat 플러그인 연결

## 재테스트 결과

- `npm run typecheck`: 통과
- `npm run test`: 39개 테스트 통과
- `npm run test:smoke`: 통과
- `npm run android:sync`: 통과
- `output/web-game/state-0.json` 확인 결과:
  - `mode: battle`
  - `stage_01_01` 전투 진입 상태 반영
  - `gold: 1320`, `fatigue: 980` 확인
  - `render_game_to_text`가 파티/적/이펙트 상태를 계속 반환
- `output/web-game/shot-0.png` 확인 결과:
  - 전투 화면 시각 출력 정상
  - 파티/적 배치와 HUD 출력 정상
- `output/web-game/village-check/shot-0.png` 확인 결과:
  - 로비 시작 화면에서 터치 조이스틱 노출 확인
  - 광고 보상 / 스타터팩 / 월드맵 버튼이 동시에 표시됨
- `output/web-game/errors-0.json`: 미생성
  - AudioContext / drawImage 오류 재발 없음

## 남은 리스크

- `assembleDebug`는 검증됐지만 실제 Android 단말에서 네이티브 광고/IAP 호출은 아직 미검증
- 실제 RevenueCat API Key / 실광고 ID 없이 네이티브 광고·결제 호출은 아직 미검증
- Phaser 기본 번들 크기가 커서 출시 전 분할 또는 최적화 검토 필요

## done_check

- `true`
