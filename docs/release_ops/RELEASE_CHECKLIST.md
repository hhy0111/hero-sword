# RELEASE_CHECKLIST.md

## 2026-05-17 Size Check

- [x] Android debug APK size target checked: 234.35MB after mobile asset optimization, below 300MB target.

## Gate 1

- [x] release_ops 입력 추적 문서 생성
- [x] placeholder 정책 문서화
- [x] 값 ownership 분리 시작

## Gate 2

- [x] 이미지 생성 입력값 초안
- [x] 광고 배치/보상 정책 초안
- [x] IAP 상품 구조 초안
- [x] 패키지명 확정
- [x] 정책 URL 확보

## Gate 3

- [x] 광고 SDK 확정
- [x] IAP provider 확정
- [x] `src/config/runtime.ts` 운영 연결 포인트 확정
- [x] 테스트 광고/실광고 전환 규칙 검증

## Gate 4

- [x] 광고 보상 흐름 구현
- [x] IAP 상품 조회/구매 흐름 구현
- [x] 저장/복구와 과금 흐름 충돌 점검
- [x] Android Capacitor 프로젝트 생성
- [x] AdMob / RevenueCat Android 플러그인 연결
- [x] Android SDK 경로 설정 후 `assembleDebug` 재검증

## Gate 5

- [x] QA Loop 01 반영
- [x] QA Loop 02 반영
- [x] QA Loop 03 반영
- [ ] 아트 PASS 판정 확보

## Gate 6

- [ ] 앱 아이콘 제작
- [ ] 피처 그래픽 제작
- [x] 스토어 스크린샷 확보
- [x] 스토어 설명 작성
- [x] 개발자명/지원 메일/가격표 확정
- [ ] Play Console 개발자 정보 입력
- [x] 개인정보처리방침 HTML 작성 및 GitHub Pages URL 고정
- [ ] 서명키 준비
- [ ] 데이터 세이프티 입력
- [x] 빌드 머신 JDK 21 설정 확정

## Gate 7

- [ ] QA 승인
- [ ] Blocker 0건
- [ ] Major 허용 여부 재판정
- [ ] 최종 배포 트랙 확정
