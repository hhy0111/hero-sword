# STORE_PREP.md

## Google Play 준비값

| 항목 | 현재 값 | 상태 |
| --- | --- | --- |
| 앱 이름 | `히어로소드 (Hero Sword)` | 확정 |
| 패키지명 | `com.appstudioon.herosword` | 확정 |
| 개발자명 | `AppStudioOn` | 확정 |
| 지원 메일 | `young02hwi@gmail.com` | 확정 |
| 개인정보처리방침 URL | `https://hhy0111.github.io/hero-sword/privacy-policy.html` | 페이지 파일 준비: `privacy-policy.html`, `docs/privacy-policy.html`, 앱 내 옵션 링크 |
| 카테고리 | 게임 / 롤플레잉 | 확정 |
| 광고 포함 여부 | 예 | 확정 |
| 대상 연령 | 13세 이상 (`13~15세`, `16~17세`, `만 18세 이상`) | Play Console 입력 기준 확정 |
| 스토어 짧은 설명 | `STORE_DESCRIPTION_DRAFT.md` 참조 | 초안 작성 |
| 스토어 긴 설명 | `STORE_DESCRIPTION_DRAFT.md` 참조 | 초안 작성 |

## 가격표

| 상품 | 가격 |
| --- | --- |
| 초보자 패키지 | `₩1,500` |
| 피로도 팩 소형 | `₩1,200` |
| 피로도 팩 대형 | `₩2,400` |
| 프리미엄 재화 묶음 1 | `₩7,900` |

## 스크린샷 확정 목록

- 로비 마을
- 대륙 지도
- 스테이지 선택
- 파티 준비
- 전투 화면
- 보스전 화면
- 가챠 화면
- 하우징 화면
- 광고 보상 화면
- 장비 관리 화면

## 제작 우선순위

- `P0`: 앱 아이콘, 피처 그래픽, 로비 마을, 일반 전투, 보스전, 월드맵
- `P1`: 스테이지 선택, 파티 준비, 가챠, 프로모션 키아트
- `P2`: 하우징, 광고 보상, 시즌성 추가 컷

세부 기준은 `STORE_IMAGE_PRIORITY.md`를 따른다.

## 출시 순서

1. 내부 테스트
2. 클로즈드 테스트
3. 오픈 테스트 [선택]
4. 프로덕션

## 연결 문서

- `./STORE_IMAGE_PRIORITY.md`
- `./ICON_FEATURE_BRIEF.md`
- `./STORE_DESCRIPTION_DRAFT.md`
- `./PRICING_POLICY_DRAFT.md`
- `./ANDROID_JDK21_SETUP.md`
- `./PLAY_CONSOLE_DATA_SAFETY_ANSWERS.md`

메모:
- 개인정보처리방침 URL은 GitHub Pages repo slug `hero-sword` 기준으로 고정했다.
- Play Console 업로드용 리사이즈 자산은 `assets/source/store-ready-assets/play-upload/` 아래에 보관한다.
