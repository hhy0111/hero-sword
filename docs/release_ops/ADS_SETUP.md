# ADS_SETUP.md

## 광고 운영 기준

- 보상형 광고: 피로도 회복, 하루 1회 광고 10회 소환 지급용
- 전면 광고: 전투 종료나 자연스러운 전환 시점만 허용
- 배너 광고: 로비/비전투 화면에 한정

## 현재 구현 상태

- 선택 SDK: `@capacitor-community/admob`
- 코드 진입점: `src/platform/ads.ts`
- Android 설정 위치:
  - `android/app/src/main/AndroidManifest.xml`
  - `android/app/src/main/res/values/strings.xml`
  - `android/variables.gradle`
- 실제 연결된 화면:
  - 로비 진입 시 배너 호출
  - 로비의 `광고보상` 버튼에서 보상형 광고 호출
  - 소환의 제단 `광고10회` 버튼에서 보상형 광고 호출
  - 전투 결과 화면에서 전면 광고 호출
- 웹 개발 환경 fallback:
  - 실광고 대신 모의 성공 응답
  - 피로도 보상 또는 광고 10회 소환을 요청 흐름에 맞게 즉시 성공 처리

## SDK 후보

| 후보 | 상태 | 이유 | 필요 시점 |
| --- | --- | --- | --- |
| `@capacitor-community/admob` | 선택 | Android 우선, Capacitor 7 호환, 현재 코드에 적용 완료 | Gate 3 |
| mediation 계층 포함 SDK | 후보 | eCPM 최적화 가능성 | 출시 후 |

## 테스트/실광고 분리

| 구분 | 값 위치 | 예시 |
| --- | --- | --- |
| 테스트 App ID | `android/app/src/main/res/values/strings.xml` | `ca-app-pub-3940256099942544~3347511713` |
| 테스트 Unit ID | `src/platform/ads.ts` fallback | Google 공식 테스트 Unit ID |
| 실광고 App ID | 사람 입력 후 비공개 관리 | `YOUR_VALUE_HERE_AD_APP_ID` |
| 실광고 Unit ID | 사람 입력 후 비공개 관리 | `YOUR_VALUE_HERE_REWARDED_UNIT_ID` |

## 현재 전환 규칙

- 개발 빌드: `import.meta.env.DEV = true` 이므로 `useTestAds = true`
- 릴리즈 후보: `VITE_USE_TEST_ADS=false`를 명시하고 실제 Unit ID를 입력해야 한다.
- placeholder 상태에서 `useTestAds=true`면 코드가 Google 공식 테스트 Unit ID로 자동 대체한다.
- placeholder 상태에서 `useTestAds=false`면 광고 호출은 실값 누락 상태로 간주하고 QA Blocker로 처리한다.

## 광고 실패 fallback

- 보상형 실패 시:
  - 즉시 보상 지급 금지
  - 상태 문구로 재시도 유도
  - 자동 보상 지급 금지
- 전면 광고 실패 시:
  - 진행 차단 금지
  - 로그만 남기고 흐름 지속
- 배너 실패 시:
  - 로비 UI 유지
  - 스테이지/전투 흐름에 영향 주지 않음
