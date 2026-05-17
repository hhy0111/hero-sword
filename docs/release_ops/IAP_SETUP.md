# IAP_SETUP.md

## IAP 운영 원칙

- 실제 상품 ID는 규칙을 먼저 정하고 나중에 콘솔과 코드에 같은 값으로 넣는다.
- 가격 정책은 추정 확정하지 않는다.
- 복원 여부는 상품 유형에 따라 명확히 구분한다.

## 현재 구현 상태

- 선택 provider: `@revenuecat/purchases-capacitor`
- 코드 진입점: `src/platform/store.ts`
- 설정 파일: `src/config/runtime.ts`
- 현재 연결된 UX:
  - 로비 `스타터팩` 버튼으로 구매 호출
  - `I` 키로 동일 구매 호출
  - `R` 키로 복원 요청 호출
- 웹 개발 환경 fallback:
  - 모의 구매 성공 응답
  - 스타터팩 보상을 로컬 저장에 즉시 적용
- Android 실기기 경로:
  - RevenueCat Android API Key 입력 필요
  - Google Play Console 상품 등록 필요

## 상품 ID 규칙

- 형식: `hs_<category>_<name>_<tier>`
- 예시:
  - `hs_pack_beginner_01`
  - `hs_fatigue_small_01`
  - `hs_fatigue_large_01`
  - `hs_gem_bundle_01`

## 초안 상품 목록

| 상품명 | 추천 ID | 유형 | 소비형 | 복원 | 상태 |
| --- | --- | --- | --- | --- | --- |
| 초보자 패키지 | `hs_pack_beginner_01` | 패키지 | 아니오 | 예 | 초안 |
| 피로도 팩 소형 | `hs_fatigue_small_01` | 소모성 | 예 | 아니오 | 초안 |
| 피로도 팩 대형 | `hs_fatigue_large_01` | 소모성 | 예 | 아니오 | 코드 등록 |
| 프리미엄 재화 묶음 1 | `hs_gem_bundle_01` | 소모성 | 예 | 아니오 | 코드 등록 |

## 연결 위치

- 코드 연결 위치: `src/config/runtime.ts`, `src/platform/store.ts`
- 콘솔 입력 위치: Google Play Console 인앱 상품 등록, RevenueCat Dashboard 상품 매핑
- 사람이 직접 넣을 값: 실제 가격, 지역별 가격 정책, 세금 정책, RevenueCat Android API Key
