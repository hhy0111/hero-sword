# VALUE_OWNERSHIP_MATRIX.md

| 값 | 분류 | 현재 값 | 입력 위치 | 소유자 | 상태 |
| --- | --- | --- | --- | --- | --- |
| 앱 이름 | 코드 + 콘솔 | `히어로소드 (Hero Sword)` | `src/config/runtime.ts`, Play Console | `planner_agent` + 사람 | 초안 |
| 패키지명 | 콘솔 + 빌드 | `com.appstudioon.herosword` | `src/config/runtime.ts`, `capacitor.config.ts`, Android/스토어 설정 | `release_ops_agent` + 사람 | 확정 |
| 개발자명 | 사람 직접 입력 | `AppStudioOn` | Play Console | 사람 | 확정 |
| 지원 메일 | 사람 직접 입력 | `young02hwi@gmail.com` | Play Console, 문의 화면 | 사람 | 확정 |
| 정책 URL | 사람 직접 입력 | `https://hhy0111.github.io/hero-sword/privacy-policy.html` | Play Console, 앱 내 링크 | 사람 | GitHub Pages 경로 확정 |
| 광고 App ID | 코드 연결값 | `TEST_APP_ID` + `YOUR_VALUE_HERE_AD_APP_ID` | `android/app/src/main/res/values/strings.xml`, `src/config/runtime.ts` | `release_ops_agent` | 테스트 연결 완료 |
| 배너 Unit ID | 코드 연결값 | `TEST_BANNER_UNIT_ID` + `YOUR_VALUE_HERE_BANNER_UNIT_ID` | `src/platform/ads.ts`, `src/config/runtime.ts` | `release_ops_agent` | 테스트 연결 완료 |
| 전면 Unit ID | 코드 연결값 | `TEST_INTERSTITIAL_UNIT_ID` + `YOUR_VALUE_HERE_INTERSTITIAL_UNIT_ID` | `src/platform/ads.ts`, `src/config/runtime.ts` | `release_ops_agent` | 테스트 연결 완료 |
| 보상형 Unit ID | 코드 연결값 | `TEST_REWARDED_UNIT_ID` + `YOUR_VALUE_HERE_REWARDED_UNIT_ID` | `src/platform/ads.ts`, `src/config/runtime.ts` | `release_ops_agent` | 테스트 연결 완료 |
| RevenueCat Android API Key | 코드 연결값 | `YOUR_VALUE_HERE_REVENUECAT_ANDROID_API_KEY` | `src/config/runtime.ts` | `release_ops_agent` | placeholder |
| IAP 상품 ID | 코드 + 콘솔 | `hs_*` 규칙 (`hs_pack_beginner_01` 등) | `src/config/runtime.ts`, Play Console, RevenueCat | `release_ops_agent` | 확정 |
| IAP 실제 가격 | 사람 직접 입력 + 콘솔 | 스타터 `₩1,500`, 소형 `₩1,200`, 대형 `₩2,400`, 젬 `₩7,900` | Play Console, `src/config/runtime.ts` | 사람 | 확정 |
| 테스트 광고 스위치 | 코드 연결값 | `import.meta.env.DEV` / `VITE_USE_TEST_ADS` | `src/config/runtime.ts` | `release_ops_agent` | 구현됨 |
| 모의 결제 스위치 | 코드 연결값 | `import.meta.env.DEV` / `VITE_USE_MOCK_STORE_RESULTS` | `src/config/runtime.ts` | `release_ops_agent` | 구현됨 |
| 서명키 | 사람 직접 입력 | `YOUR_VALUE_HERE_SIGNING_CONFIG` | Android 빌드 환경 | 사람 | placeholder |
| Android SDK 경로 | 사람 직접 입력 | `[내 PC 경로]` | `android/local.properties` | 사람 | [TODO] |
| 데이터 세이프티 답변 | 콘솔 입력값 | `[확인 필요]` | Play Console | 사람 | 미확정 |
