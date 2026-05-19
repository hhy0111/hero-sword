# RELEASE_INPUTS.md

## 2026-05-17 Fatigue Economy Values

| Item | Value | Status | Notes |
| --- | --- | --- | --- |
| Fatigue Max | `100` | applied | Code-read value in `src/game/core/state.ts` |
| Stage Entry Cost | `3` | applied | About 33 entries from full fatigue |
| Rewarded Fatigue Amount | `6` | applied | `src/config/runtime.ts`, `src/game/core/state.ts` |
| Rewarded Fallback Amount | `3` | applied | `src/game/core/state.ts` |
| Paid Fatigue Small Grant | `18` | applied | Product ID `hs_fatigue_small_01` |
| Paid Fatigue Large Grant | `45` | applied | Product ID `hs_fatigue_large_01` |
| Repeat Clear Reward Rate | `0.5` | applied | Gold and EXP only after prior clear of same stage difficulty |

## 2026-05-16 AdMob live values applied

| Item | Value | Status | Notes |
| --- | --- | --- | --- |
| AdMob App ID | `ca-app-pub-4402708884038037~1307706218` | applied | `android/app/src/main/res/values/strings.xml`, `src/config/runtime.ts` |
| Banner Unit ID | `ca-app-pub-4402708884038037/9732991146` | applied | `HeroSword_Android_Banner_VillageBottom` |
| Interstitial Unit ID | `ca-app-pub-4402708884038037/8162705869` | applied | `HeroSword_Android_Interstitial_BattleResult` |
| Rewarded Gacha Unit ID | `ca-app-pub-4402708884038037/7909378821` | applied | `HeroSword_Android_Rewarded_AdTenSummon` |
| Rewarded Fatigue Recovery Unit ID | `ca-app-pub-4402708884038037/1122654798` | applied | `HeroSword_Android_Rewarded_FatigueRecovery` |
| Reserved Rewarded Unit ID | `ca-app-pub-4402708884038037/4329455374` | applied as reserved config | `HeroSword_Android_Rewarded_Fatigue_Ad10Summon`; no current button calls this slot |

## 운영 원칙

- 실제값 하드코딩 금지
- 사람 입력값 / 코드 연결값 / 콘솔 입력값 분리
- 비어 있는 값은 추정 확정하지 않고 `[TODO]` 또는 `[확인 필요]` 유지

## A. 이미지 생성 준비값

| 항목 | 현재 값 | 상태 | 입력 주체 |
| --- | --- | --- | --- |
| 앱 아이콘 필요 여부 | 필요 | 확정 | `release_ops_agent` |
| 피처 그래픽 필요 여부 | 필요 | 확정 | `release_ops_agent` |
| 스토어 스크린샷 목록 | 로비 마을, 월드맵, 스테이지 선택, 파티 준비, 장비 관리, 전투, 보스전, 가챠, 하우징 | 확정 | `ui_agent` |
| 게임 내 생성 대상 | 플레이어블 21명, NPC 20종, 적/보스 30종, 마을/거점 8종, UI 패널, 아이콘, 무기/방어구 대표 시트, VFX 카테고리 12종 | 확정 | `asset_agent` |
| 스타일 키워드 | warm fantasy, grounded heroic, commercial finish | 초안 | `asset_agent` |
| 금지 요소 | 과대칭, 과광택, 부유 장식, IP 연상, 이상 연결부 | 확정 | `asset_agent` |
| 상용 안전성 체크 | 필요 | 확정 | `asset_agent` |
| 프롬프트 버전 관리 | `PROMPT_LIBRARY.md` | 확정 | `asset_agent` |

## B. 광고 관련

| 항목 | 값 | 상태 | 비고 |
| --- | --- | --- | --- |
| 광고 SDK 종류 | `@capacitor-community/admob` | 확정 | `ADS_SETUP.md` 참고 |
| 앱 ID | `YOUR_VALUE_HERE_AD_APP_ID` | placeholder | 실제값 금지 |
| 배너 Unit ID | `YOUR_VALUE_HERE_BANNER_UNIT_ID` | placeholder | 테스트/실광고 분리 |
| 전면 Unit ID | `YOUR_VALUE_HERE_INTERSTITIAL_UNIT_ID` | placeholder | 테스트/실광고 분리 |
| 보상형 Unit ID | `YOUR_VALUE_HERE_REWARDED_UNIT_ID` | placeholder | 테스트/실광고 분리 |
| 광고 위치 | 로비 하단 배너, 결과 전면, 피로도 회복 보상형 | 초안 | UX 검토 필요 |
| 광고 노출 조건 | 전면 광고는 핵심 전투 도중 금지 | 확정 | `UI_RULES` 연동 |
| 보상 내용 | 피로도 회복 아이템 `+30` | 확정 | `src/config/runtime.ts` 연동 |
| 실패 fallback | 광고 실패 시 재시도 또는 무료 대기 안내 | 구현됨 | `qa_agent` 검증 필요 |
| 테스트/실광고 전환 | `DEV` 또는 `VITE_USE_TEST_ADS` | 구현됨 | 개발/릴리즈 분리 |

## C. 결제 관련

| 상품명 | 상품 ID | 구매 옵션 ID | 유형 | 가격 정책 | 소비형 | 복원 | 상태 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 초보자 패키지 | `hs_pack_beginner_01` | `hs-pack-beginner-01` | 패키지 | `₩1,500` | 아니오 | 예 | Play Console 등록 확인 |
| 피로도 팩 소형 | `hs_fatigue_small_01` | `hs-fatigue-small-01` | 소모성 | `₩1,200` | 예 | 아니오 | Play Console 등록 확인 |
| 유료 10회 소환 | `hs_paid_ten_summon_01` | `hs-paid-ten-summon-01` | 소모성 | `₩1,500` | 예 | 아니오 | Play Console 등록 확인 |
| 피로도 팩 대형 | `hs_fatigue_large_01` | `hs-fatigue-large-01` | 소모성 | `₩2,400` | 예 | 아니오 | Play Console 등록 확인 |
| 프리미엄 보석 묶음 1 | `hs_gem_bundle_01` | `hs-gem-bundle-01` | 소모성 | `₩7,900` | 예 | 아니오 | Play Console 등록 확인 |

앱 내 연결:
- 현금 상점: `hs_pack_beginner_01`, `hs_fatigue_small_01`, `hs_fatigue_large_01`, `hs_gem_bundle_01`
- 소환의 제단 유료 10회 버튼: `hs_paid_ten_summon_01`
- RevenueCat Android API Key는 로컬 전용 `.env.production.local`의 `VITE_REVENUECAT_ANDROID_API_KEY`로 주입한다.
- `.env*.local`은 git 제외 대상이다.

## D. 출시 준비 관련

| 항목 | 값 | 상태 | 오너 |
| --- | --- | --- | --- |
| 패키지명 / 번들 ID | `com.appstudioon.herosword` | 확정 | `release_ops_agent` |
| 앱 이름 | `히어로소드 (Hero Sword)` | 초안 | `planner_agent` |
| 개발자명 | `AppStudioOn` | 확정 | 사람 |
| 지원 메일 | `young02hwi@gmail.com` | 확정 | 사람 |
| 개인정보처리방침 URL | `https://hhy0111.github.io/hero-sword/privacy-policy.html` | GitHub Pages 경로 확정 | 사람 |
| 스토어 설명 | `STORE_DESCRIPTION_DRAFT.md` 초안 | 작성됨 | `planner_agent` |
| 콘텐츠 등급 | `[확인 필요]` | 미확정 | 사람 |
| 광고 포함 여부 | 예 | 확정 | `release_ops_agent` |
| 데이터 세이프티 | `[확인 필요]` | 미확정 | 사람 |
| 서명키 / 빌드 설정 | `android/keystore.properties` + `android/keystores/hero-sword-upload-key.jks` | 로컬 전용 생성 완료, git 제외 | 사람 |
| 배포 트랙 | 내부 테스트 -> 클로즈드 -> 프로덕션 | 초안 | `release_ops_agent` |

## E. 값 분리 규칙

1. 사람이 직접 입력할 값
   서명키, 실제 광고/IAP 계정 값, 데이터 세이프티 답변
2. 코드에 연결할 값
   `src/config/runtime.ts`의 운영값, 저장소 내 런타임 스위치, 광고 fallback 정책
3. 외부 콘솔/스토어에 입력할 값
   Google Play Console 앱 정보, 결제 상품 등록, 데이터 세이프티 답변, 광고 콘솔 Unit 설정
