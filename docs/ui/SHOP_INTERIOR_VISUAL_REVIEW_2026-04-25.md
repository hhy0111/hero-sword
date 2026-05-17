# SHOP_INTERIOR_VISUAL_REVIEW_2026-04-25

- summary:
  - `2026-04-25` 기준으로 루멘 마을 상점 `5종`을 실제 웹 빌드 캡처로 다시 검토했다.
  - 검토 대상은 `town-interior` 실내 장면과 `shop` 구매 UI 장면이다.
  - 결론은 `상점 UI는 usable`, `실내 장면은 업종 정체성이 너무 약함`, `상점별 추가 이미지 배치가 필요함`이다.
- inputs:
  - `output/shop-review-2026-04-25/weapon-interior.png`
  - `output/shop-review-2026-04-25/armor-interior.png`
  - `output/shop-review-2026-04-25/item-interior.png`
  - `output/shop-review-2026-04-25/forge-interior.png`
  - `output/shop-review-2026-04-25/relic-interior.png`
  - `output/shop-review-2026-04-25/weapon-shop.png`
  - `output/shop-review-2026-04-25/armor-shop.png`
  - `output/shop-review-2026-04-25/relic-shop.png`
  - `src/game/data/town.ts`
  - `src/game/scenes/TownInteriorScene.ts`
  - `src/game/data/townRuntimeArt.ts`
- decisions:
  - 상점 실내 보강은 `상점 하나씩 따로 고치는 방식`보다 `공통 실내 키트 + 상점별 전용 소품`으로 한 번에 정리하는 편이 맞다.
  - 이번 단계에서 가장 먼저 보강해야 하는 것은 `텍스트`가 아니라 `실내 정체성`, `카운터 뒤 배경`, `상점별 실루엣 차이`다.
  - `weapon_shop`, `armor_shop`, `forge_shop`는 현재 상인 실루엣 분리도 약해서 전용 상인 이미지 보강이 필요하다.
  - `shop` UI 장면은 현재 구조를 유지하되, 최종 상용 톤을 위해 전용 헤더/카테고리/장식 아트 추가가 필요하다.
- todo:
  - 공통 실내용 `벽 + 선반 + 카운터 + 그림자` 키트 추가
  - 상점별 전용 소품 시트 추가
  - `armor_shop` 전용 상인 도트 추가
  - `forge_shop` 전용 대장장이 도트 또는 흑철 작업 포즈 시트 추가
  - 공통 `상점 간판/카테고리 아이콘/조명 오버레이` 추가
  - `shop` 전용 상단 헤더/리스트 장식 패널 추가 검토
- risks:
  - 지금 상태로는 다섯 상점이 `색만 다른 같은 방`처럼 읽힌다.
  - `armor_shop`과 `forge_shop`는 현재 코드상 런타임 상인 subject가 `weapon_merchant`로 연결되어 있어 업종 구분이 더 약하다.
  - 전용 배경/소품 없이 UI만 다듬으면 상점 내부가 계속 임시 테스트 룸처럼 보일 가능성이 높다.
  - 모바일 세로 화면에서 바닥 빈 면적이 너무 넓어 상호작용 지점이 약하게 느껴진다.
- artifacts_changed:
  - `docs/ui/SHOP_INTERIOR_VISUAL_REVIEW_2026-04-25.md`
  - `docs/art/SHOP_INTERIOR_REFRESH_READY_TO_COPY_PROMPTS_2026-04-25.md`
- handoff_to:
  - `asset_agent`
  - `ui_agent`
  - `integration_agent`
- handoff_notes:
  - `asset_agent`: 공통 실내 키트와 상점별 전용 소품을 한 배치로 생성하는 것이 우선이다.
  - `ui_agent`: 실내 비주얼 보강 후 `shop` UI 헤더/리스트 장식 패스만 한 번 더 정리하면 된다.
  - `integration_agent`: 상점별 상인 라우팅과 새 소품 키 연결 지점을 같이 확인해야 한다.
- done_check:
  - `weapon_shop review`: complete
  - `armor_shop review`: complete
  - `item_shop review`: complete
  - `forge_shop review`: complete
  - `relic_shop review`: complete
  - `prompt handoff`: complete

---

## 공통 판정

### 현재 보이는 공통 문제

- 실내 구조가 모두 `같은 방 템플릿`이다.
- 상점별 차이는 `floor/wall/counter tint`와 작은 아이콘 소품 2개 정도에 그친다.
- 카운터 뒤쪽이 거의 비어 있어 상점 핵심 상품이 보이지 않는다.
- 방 중앙 바닥이 너무 넓고 비어 있어 플레이어와 상인의 거리감만 커 보인다.
- 천장 보, 벽 선반, 뒷벽 장식, 업종별 진열대가 없어 실내 깊이감이 부족하다.
- 출구와 카운터 말고는 시선을 잡아주는 랜드마크가 없다.

### 공통으로 필요한 추가 이미지

- `공통 실내 벽/기둥/선반/카운터 모듈`
- `상점 카테고리 간판 세트`
- `공통 실내 그림자/따뜻한 조명 오버레이`
- `카운터 뒤 장식 전용 배경 시트`
- `업종별 전시품/진열대/보관 소품`

### 공통 수정 방식

- `PATCH`: 현재 `TownInteriorScene` 구조 유지, 방 템플릿은 살리고 아트만 갈아끼우는 방식
- 이유: 카메라, 이동, 충돌, 상호작용 구조는 이미 동작하고 있어서 방 레이아웃을 완전히 갈아엎을 필요는 없다.

---

## 01. Weapon Shop

- current_capture:
  - `output/shop-review-2026-04-25/weapon-interior.png`
  - `output/shop-review-2026-04-25/weapon-shop.png`
- file_decision:
  - `PATCH`
  - 이유: 무기 상점이라는 최소 힌트는 있지만, 실제 무기점처럼 보이게 하는 전시 요소가 너무 적다.
- current_read:
  - 상단 아이콘과 작은 검 소품 하나가 없으면 일반 방으로 읽힌다.
  - 카운터 뒤에 무기 rack, 벽걸이 검, 정비 도구가 전혀 보이지 않는다.
- must_fix:
  - 카운터 뒤 `검 rack` 추가
  - 벽걸이 무기 세트 추가
  - 숫돌/정비대/공구 상자 추가
  - 무기 상점 전용 간판 장식 추가
- added_images:
  - `weapon_wall_rack`
  - `weapon_counter_clutter`
  - `weapon_crate_display`
  - `weapon_shop_sign`

## 02. Armor Shop

- current_capture:
  - `output/shop-review-2026-04-25/armor-interior.png`
  - `output/shop-review-2026-04-25/armor-shop.png`
- file_decision:
  - `PATCH`
  - 이유: 방어구 상점 색감은 다르지만 갑옷/방패/패딩 진열이 거의 없어 업종 구분이 약하다.
- current_read:
  - 현재는 회색 카운터와 바닥만 달라진 방으로 보인다.
  - 갑옷 상점인데 갑옷 거치대, 방패 벽면, 천/가죽 롤이 없다.
  - 상인도 전용 실루엣이 아니라 다른 상점 상인처럼 읽힌다.
- must_fix:
  - `갑옷 거치대`, `방패 벽면`, `패딩 롤`, `가죽 재단대` 추가
  - `armor merchant` 전용 도트 추가
  - 방어구 상점 전용 간판 추가
- added_images:
  - `armor_stand_set`
  - `shield_wall_rack`
  - `padding_and_cloth_rolls`
  - `armor_merchant_runtime_dot`
  - `armor_shop_sign`

## 03. Item Shop

- current_capture:
  - `output/shop-review-2026-04-25/item-interior.png`
- file_decision:
  - `PATCH`
  - 이유: 바닥 톤은 무난하지만 잡화/보급품 상점에 필요한 밀도와 생활감이 부족하다.
- current_read:
  - 병, 가방, 소모품 상점이라는 설명과 달리 실제 실내에는 병/상자/포대/선반이 거의 없다.
  - 상점 안쪽이 창고형 보급실처럼 보여야 하는데, 현재는 비어 있는 테스트 공간에 가깝다.
- must_fix:
  - 포션 병 선반 추가
  - 식량 자루/보급 상자 추가
  - 여행 가방/끈 묶음/소형 잡화 추가
  - 카운터 위 작은 상품 소품 추가
- added_images:
  - `item_shelf_bottles`
  - `supply_crate_and_sack_set`
  - `travel_goods_counter_clutter`
  - `item_shop_sign`

## 04. Forge

- current_capture:
  - `output/shop-review-2026-04-25/forge-interior.png`
- file_decision:
  - `PATCH`
  - 이유: 대장간인데 화덕, 모루, 공구 벽, 불빛이 없어 가장 테마 손실이 크다.
- current_read:
  - 현재는 갈색 카운터가 있는 빈 방으로 읽힌다.
  - 대장간 핵심인 `열`, `불`, `금속`, `무거운 도구`가 보이지 않는다.
  - 런타임 상인 subject도 현재 구조상 `weapon_merchant`로 흐를 수 있어 업종 판독이 더 흐려진다.
- must_fix:
  - `화덕/모루/작업대/집게/망치 벽` 추가
  - 바닥 쪽 `재/검댕/쇳조각` 추가
  - 따뜻한 화염광 오버레이 추가
  - `forge blacksmith` 전용 상인 도트 또는 작업 포즈 추가
- added_images:
  - `forge_hearth_and_anvil_set`
  - `forge_tool_wall`
  - `forge_floor_scatter`
  - `forge_blacksmith_runtime_dot`
  - `forge_shop_sign`
  - `forge_warm_light_overlay`

## 05. Relic Shop

- current_capture:
  - `output/shop-review-2026-04-25/relic-interior.png`
  - `output/shop-review-2026-04-25/relic-shop.png`
- file_decision:
  - `PATCH`
  - 이유: 색은 다르지만 유물 상점 전용 진열, 봉인 보관, 조용한 신비감 표현이 부족하다.
- current_read:
  - 현재는 보라색 톤 실내라는 점만 다르고, 유물 보관소 특유의 `봉인 케이스`, `진열함`, `기록물`, `촛불/램프`가 없다.
  - 과장된 마법 폭발 대신 `통제된 신비감`이 필요한데 지금은 그 중간 단계가 비어 있다.
- must_fix:
  - 봉인 상자/진열 케이스 추가
  - 유물 책장/문양 보관함 추가
  - 바닥 러그 또는 원형 문양 추가
  - 은은한 램프/촛불광 추가
- added_images:
  - `relic_display_case_set`
  - `relic_archive_shelf`
  - `relic_floor_rug_or_sigils`
  - `relic_shop_sign`
  - `relic_soft_light_overlay`

---

## 공통 UI 판정

- reviewed_capture:
  - `output/shop-review-2026-04-25/weapon-shop.png`
  - `output/shop-review-2026-04-25/armor-shop.png`
  - `output/shop-review-2026-04-25/relic-shop.png`
- status:
  - `PASS_WITH_ART_GAP`
- findings:
  - 이전 겹침 문제는 정리됐고 현재 텍스트 충돌은 크지 않다.
  - 다만 모든 상점 UI가 같은 프레임/배경/카테고리 톤을 공유해 상점별 개성이 약하다.
  - 최종 상용 품질을 위해서는 `상단 헤더 바`, `카테고리 배지`, `가격 배지`, `하단 액션 바` 정도는 전용 아트 보강이 있으면 좋다.

---

## 일괄 수정 우선순위

1. `공통 실내 벽/카운터/그림자 키트`
2. `armor merchant`, `forge blacksmith` 전용 도트
3. `weapon / armor / item / forge / relic` 전용 소품 세트
4. `상점 간판/카테고리 아이콘 세트`
5. `shop` UI 헤더/배지 아트 보강
