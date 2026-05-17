# QA_LOOP_02.md

## 목적

- UI 흐름, 광고/IAP 진입 동선, 반복 입력 리스크를 검증한다.

## 대상

- 피로도 부족 시 안내 UX
- 광고 보상 팝업
- 가챠 진입 흐름
- 빠른 연타, 반복 진입, 팝업 닫기

## 문제 목록

| ID | 심각도 | 문제 | 재현 절차 | 수정 우선순위 | 상태 |
| --- | --- | --- | --- | --- | --- |
| QA2-001 | Major | 로비/파티/장비 화면의 헤더 텍스트가 밀집되어 초보자 관점에서 정보 우선순위가 흐려짐 | `output/store-screenshots/store_01_village.png`, `store_04_party.png`, `store_05_equipment.png` 확인 | 높음 | 열림 |
| QA2-002 | Major | 광고 보상 흐름이 상태 문구 중심이라 fallback 가용 시점과 보상 조건을 놓치기 쉬움 | 로비에서 광고 실패 후 `Q` fallback 문구 흐름 점검 | 높음 | 열림 |
| QA2-003 | Minor | 메타 루프 화면에 한국어/영어 레이블이 혼재되어 스토어 컷 일관성이 낮음 | 파티/장비/로비 스크린샷 비교 | 중간 | 열림 |

## 수정안 적용

- `UI_FLOW.md`, `UI_SCREENS.md`를 실제 화면 기준으로 갱신
- 스토어 캡처에 `파티`, `장비` 메타 루프 화면 추가
- 월드맵에 `허브 -> 6대륙 -> 최종 전진캠프` 진행 상태 문구 추가

## 재테스트 결과

- `npm run test:smoke`: 통과
- `npm run capture:store`: 통과
- `output/store-screenshots/manifest.json` 기준:
  - `store_01_village.png` 생성
  - `store_04_party.png` 생성
  - `store_05_equipment.png` 생성
  - `store_08_gacha.png` 생성
- 수동 이미지 확인 결과:
  - 로비/파티/장비/가챠 화면이 실제 화면으로 캡처됨
  - 메타 루프 화면 간 이동 범위는 모두 확보됨
  - 다만 상용 UI 톤으로 보기엔 텍스트 밀도가 높고, 일부 KR/EN 혼합 라벨이 남음

## 남은 리스크

- 광고 CTA와 결제 CTA 분리 기준은 로비 구조상 유지되지만, 보상 실패 후 fallback 안내는 별도 팝업 검토 필요
- 초보자 관점에서 `다음 행동` 파악 시간은 상용 UI 정리 후 재측정 필요

## done_check

- `true`
