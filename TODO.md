# TODO.md

## 2026-05-17 Fatigue/Reward/Level Balance

- [x] 피로도 최대치를 `100`으로 낮추고 입장 비용을 `3`으로 조정한다.
- [x] 광고 보상을 `+6`, fallback 보상을 `+3`으로 재조정한다.
- [x] 결제 피로도 상품을 `+18`, `+45` 중심으로 조정하고 캐시샵에 대형 팩을 노출한다.
- [x] 이미 클리어한 스테이지 난이도는 반복 클리어 골드/EXP를 `50%`로 낮춘다.
- [x] 전체 Normal 144스테이지 기준 레벨이 약 20에 머물도록 EXP 곡선을 늦춘다.
- [ ] Android 실기에서 광고 보상 완료/취소/fallback 및 결제 상품 지급을 재검증한다.

## 2026-05-16 Fatigue UIUX and Ad Recovery

- [x] 마을 화면 상단에 항상 보이는 피로도 바를 추가한다.
- [x] 스테이지 선택 화면에 현재 피로도, 입장 소모량, 입장 후 예상량을 표시한다.
- [x] 전투 결과 화면에 현재 피로도와 피로도 회복 광고 버튼을 추가한다.
- [x] 피로도 회복 보상형 광고 단위를 가챠 보상형 광고 단위와 분리한다.
- [ ] 실제 Android 단말에서 피로도 회복 광고 완료/취소/fallback을 검증한다.

## 2026-05-12 Ad Gacha Daily Follow-up

- [x] 광고 시청 후 10회 소환 기능을 소환의 제단에 추가한다.
- [x] 광고 10회 소환은 보석/유료 10회보다 낮은 보상표로 분리한다.
- [x] 광고 10회 소환은 5성을 제외하고, 4성 확률과 픽업 확률을 낮춘다.
- [x] 광고 10회 소환은 하루 1회만 가능하도록 저장 상태에 사용일을 기록한다.
- [x] 광고 보상형 호출 경로와 웹 fallback을 가챠에도 사용할 수 있게 정리한다.
- [x] 광고 10회 소환 단위 테스트와 광고 설정 문서를 갱신한다.

## 2026-05-11 Gacha/Result/Stage UX Follow-up

- [x] `docs/ui/GACHA_RESULT_STAGE_UX_FOLLOWUP_2026-05-11.md`를 다음 UX 패스 작업 요청서로 사용한다.
- [x] 고등급 캐릭터가 너무 빨리 노출되지 않도록 뽑기 확률과 10회 뽑기 보장을 재조정한다.
- [x] 미카엘라가 최상위 보상처럼 오해되지 않도록 픽업 카드에 5성/4성/무기 등급을 명확히 표시한다.
- [x] 뽑기 결과 카드에 NEW, 중복 -> 초월, 초월 최대 -> 영웅석 전환, 10회 결과 요약을 표시한다.
- [x] 전투 결과 보상을 캐릭터 사진, 현재 레벨, 획득 경험치, 다음 레벨 프로그래스바 중심으로 재구성한다.
- [x] 전투 결과 기본 패널에서 클리어 시간과 입힌 피해를 제거한다.
- [x] 전투 결과 안내 문구를 별도 큰 블럭이 아니라 버튼/푸터 영역으로 이동한다.
- [x] 스테이지 루트 기본 아이콘을 게임 스타일 루트 상태 마커로 교체한다.
- [x] 스테이지 선택 하단 텍스트 넘침을 수정하고, 의미가 불명확한 `스크롤 1/20`은 삭제한다.
- [x] 모바일 출시 기준으로 마우스 휠 스크롤을 제거하고 터치/탭/드래그 조작으로 통일한다.

## 2026-05-11 World/Storage/Battle Follow-up

- [x] `docs/ui/WORLD_STORAGE_BATTLE_FOLLOWUP_2026-05-11.md`를 월드/창고/전투 상단 UI 추가 개발 작업 요청서로 사용한다.
- [x] `image/IMAGE_PROMPTS_ADDED_PALACE_GACHA_BATTLE_FIXES_2026-05-11`의 생성 이미지 12개를 적용 후보로 인입한다.
- [x] 궁궐 카펫, 1지역 전투 배경, 가챠 무기 아이콘 10개를 실제 런타임 경로에 맞게 적용한다.
- [x] 긴 성곽 이미지를 늘려 맞추는 구조를 제거하고, 정사각형 가로/세로 성벽 타일 반복 구조로 교체한다.
- [x] `docs/art/IMAGE_PROMPTS_ADDED_IMPLEMENTATION_FOLLOWUP_2026-05-11.md`에 성 외곽 타일과 추가 UI/아이템 이미지 프롬프트를 정리한다.
- [x] 메뉴에 `창고` 항목을 추가하고, 미장착 장비/보유 아이템/소비 아이템을 모두 볼 수 있게 한다.
- [x] 아이템 상세 화면에서 실제 효과가 있는 소비 아이템에만 `사용하기` 버튼을 표시한다.
- [x] 소비 아이템 사용 시 효과, 수량 감소, 저장/복구가 정상 반영되게 한다.
- [x] 전투 화면 상단 패널의 기본 이미지 노출과 텍스트 넘침을 수정한다.
- [x] 전투 상단 패널 추가 이미지가 필요하면 신규 프롬프트 문서의 `battle_top_status_panel.png`를 사용한다.
- [x] 월드맵에서 마을로 돌아오면 항상 월드 출구 앞에서 시작하도록 고정한다.
- [x] 궁궐에서 마을로 돌아오면 항상 궁궐 입구 앞에서 시작하도록 고정한다.

## 2026-05-10 Gate/Palace Touch Rework

- [x] Apply the generated `IMAGE_PROMPTS_ADDED_GATE_PALACE_TOUCH_REWORK_2026-05-10` runtime images.
- [x] Replace the palace center carpet with repeatable tile-style carpet segments.
- [x] Remove keyboard/game keyboard input paths and keep touch/buttons/joystick as the active control model.
- [x] Add automatic shop/palace/world-gate entry on contact without an extra tap.
- [x] Reposition Bram so he is visible in the village path area.
- [x] Reduce the town horizontal wall spans and keep the gate as the entry marker.
- [x] Fix cash shop price labels so they stay inside their price backgrounds.
- [x] Center gacha character portraits in their cards and add paid 10-pull entry.
- [x] Fix the mobile joystick hit area and keep title start at the village center.
- [x] Move palace entry contact to the gate, remove tap-triggered palace entry from the fountain area, and lower horizontal wall height.
- [x] Apply shop thumbnail fallback images to gacha weapon result cards.
- [x] Freeze defeated battle enemies on the down frame and add a pixel battlefield overlay.
- [x] Add one combined prompt file for the palace carpet remake, missing gacha item icons, and battle background replacement.
- [ ] Confirm final Google Play product setup for `hs_paid_ten_summon_01` in the external store console.

## 2026-04-07 Town Rework

- [x] Classify the `TOWN_SHOP_BATTLE_READY_TO_COPY_PROMPTS` image batch into stage-use and reference-only groups
- [x] Move stage battle backgrounds into `assets/source/world/battle-backgrounds/approved`
- [x] Move painted town/shop/interior/NPC/UI boards into `assets/source/world/reference-concepts/*`
- [x] Delete the intake `image` folder after move completion
- [x] Write a tile-based town rework prompt bundle for pixel-runtime asset generation
- [x] Write a town rework spec covering camera, collision, fountain, gate, shop NPC flow, and ambient NPC greetings
- [x] Apply stage-specific battle backplates in `BattleScene`
- [x] Replace the single-screen village lobby with a tile-based exploration map
- [x] Add passable versus blocked tile handling
- [x] Add the Lumen Village fountain and fountain animation layer
- [x] Add world-gate transition markers and gate interaction
- [x] Add shop entrance markers and interior transitions
- [x] Add shop NPC proximity markers and `Space` interaction
- [x] Add ambient town NPC patrols and greeting dialogue
- [x] Split the town shop inventory into per-building local stock lists
- [x] Replace active fallback town exterior visuals with approved runtime art only; missing assets are skipped instead of substituted
- [ ] Add a static exterior `armor_merchant.png` only if a future exterior scene needs a visible armor merchant outside the shop
- [ ] Extract and apply visible collision-border tiles from `02-lumen-collision-border-tiles.png`
- [ ] Replace placeholder interior floor / wall tiling with extracted runtime pixel tile materials

## 2026-04-04 Latest

- [x] Add optional runtime animation manifest loading and clip registry state for future final sprite strips
- [x] Add a dev-only asset status scene to inspect runtime animation readiness
- [x] Make Animation Viewer prefer loaded runtime strips before placeholder previews
- [x] Fix battle scene re-entry so retry flow no longer touches destroyed sprite references
- [x] Reset reusable scene view arrays / listeners across battle, party, equipment, gacha, housing, shop, world-map, and stage-select
- [x] Clear stale smoke screenshots / state / error artifacts before each smoke run
- [x] Expand store screenshot automation to include party and equipment meta-loop screens
- [x] Apply Korean language-pack coverage to dialogue, cutscene, party, equipment, battle, and shop display strings
- [x] Re-audit Korean language-pack coverage for village, palace, world map, stage select, battle, shop, gacha, and housing screens
- [x] Add environment-gated test/live ad switches and verify unit resolution in tests
- [x] Add save-and-reload regression coverage for IAP product grants
- [x] Write content production order, dialogue sheet draft, NPC relationship map, accessory rules, icon brief, store description draft, and JDK 21 setup guide
- [x] Add a dev-only Animation Viewer screen with category / subject / action selectors
- [x] Route Village -> Options -> Animation Viewer and hide the dev menu in release builds
- [x] Add reproducible viewer capture automation via `npm run capture:viewer`
- [x] Add role-specific battle rules for guardian shields, support buffs, mage splash, ranger pierce, warrior sweep, and assassin execute combos
- [x] Surface shield / buff / taunt status in the battle HUD and debug state
- [x] Replace fixed battle screenshot timing with scored frame search for store capture
- [x] Split production build output into app / phaser / native bridge chunks
- [x] Add battle telegraphs, projectiles, burst VFX, and charge trails
- [x] Diversify enemy patterns for field / dungeon / boss encounters
- [x] Add deterministic debug scene jump helpers for capture and QA
- [x] Add `npm run capture:store` and generate `output/store-screenshots/*`
- [x] Fix party normalization overflow beyond 4 members
- [x] Identify and neutralize the smoke `drawImage` noise source for current flows
- [x] Intake the first 12 character animation frame master sheets, generate runtime character clip strips, and wire them into viewer / village / battle
- [x] Intake the remaining 9 character frame sheets plus the first 7 enemy frame sheets, generate runtime strips, and wire enemy clips into viewer / battle
- [x] Intake the remaining 23 enemy and boss frame sheets, generate runtime strips, and wire enemy clips into viewer / battle for continents 02-06
- [x] Refresh approved VFX source sheets, generate runtime effect strips, and wire effect clips into viewer / battle
- [ ] Replace placeholder atlas sprites with final character / enemy / VFX art once production assets are approved

## Gate 2

- [x] `game_logic_agent`가 스테이지 해금, 광고 보상, 가챠 통화 최소 데이터 구조를 확장
- [x] `ui_agent`가 로비/대륙지도/가챠/상점/하우징 화면 우선순위 확정
- [x] `asset_agent`가 캐릭터 도트와 대화용 일러스트 비율 규격 확정
- [x] `planner_agent`와 `asset_agent`가 캐릭터별 애니메이션 행동 목록을 확정
- [x] `qa_agent`가 Loop 01 실행 전 테스트 환경 점검
- [x] `release_ops_agent`가 Android 광고/IAP 플러그인 후보 비교 후 현재 선택안 확정
- [x] `planner_agent`가 시나리오 문서를 실제 콘텐츠 생산 순서로 다시 분해
- [x] `game_logic_agent`가 60개 스테이지 설계를 데이터 테이블 구조로 변환
- [x] `ui_agent`가 월드맵 6대륙 구조를 실제 화면 플로우로 반영

## Gate 3

- [x] 패키지명 확정
- [x] Capacitor 도입 여부 결정
- [x] 광고 SDK 선정
- [x] IAP 상품 ID 네이밍 규칙 확정
- [x] 저장 포맷 버전 정책 확정
- [x] 전투 씬 밀도가 올라갈 때 `Canvas` 유지 여부 재검토
- [x] 시나리오 대사 시트 초안 작성
- [x] 대륙별 주요 NPC 관계도 작성
- [x] 1.0 출시 포함 대륙 수 최종 확정
- [x] 캐릭터별 `idle/walk/run/attack/skill/hit/dodge/victory/down` 세트 확정
- [x] 캐릭터별 애니메이션 프레임 수와 루프 길이 표 작성
- [x] 무기 희귀도별 강화 수치표와 전용무기 패시브 규칙 확정
- [x] 방어구 성급/강화 수치표와 세트 효과 도입 여부 확정
- [x] 장신구 슬롯 문서 추가
- [x] NPC / 적 / 장비 / VFX / 스토어용 복붙 프롬프트 파일 5종 생성

## Gate 4

- [x] 마을 로비 입력과 상태 저장 연결
- [x] 대륙 지도 진입 UI 연결
- [x] 스테이지 입장 전 피로도 체크 연결
- [x] 로비에서 파티/가챠/상점/하우징 씬 이동 연결
- [x] 광고 보상 실패 fallback UX 연결
- [x] 자동전투/수동 스킬/별 판정 기본 전투 루프 연결
- [x] 실제 적 배치와 필드 전투 표시 연결
- [x] 가챠 배너 구조와 결과 공개 연출 연결
- [x] 선택 파티와 전투력 표시를 실제 전투에 연결
- [x] 골드/가챠/하우징 저장 루프 연결
- [x] Android 네이티브 광고/IAP 브리지 추가

## Gate 5

- [x] QA Loop 01 실행
- [x] QA Loop 02 실행
- [x] QA Loop 03 실행
- [x] BUG_LOG 우선순위 재정렬
- [x] headless smoke `drawImage` pageerror 원인 분리

## Gate 6

- [x] 이미지 생성 실행 순서 / 스토어 우선순위 / 검수 플레이북 문서화
- [x] 앱 아이콘/피처 그래픽 제작 브리프 확정
- [x] Google Play 스토어 설명 초안 작성
- [x] 개인정보처리방침 URL 확보
- [x] 개발자 지원 메일 확정
- [x] 개발자명 확정
- [x] 실제 가격표 확정
- [x] 테스트 광고와 실광고 분리 검증
- [x] `android/local.properties` 실제 SDK 경로 입력 후 debug assemble 재검증
- [x] 스토어 스크린샷에 새 메타 루프 화면 반영
- [x] Android 빌드용 JDK 21 환경 변수 가이드 문서화

## [확인 필요]

- [ ] 실제 콘텐츠 등급/데이터 세이프티 답변
- [ ] Play Console 서명키/실광고/실결제 계정 실값 입력

## 2026-04-08 Animation Runtime Refresh

- [x] Add `npc` category support to the shared runtime animation manifest and viewer catalog.
- [x] Generate runtime NPC strips for merchant sheets and stable ambient town NPC poses.
- [x] Rebuild runtime strips for characters / enemies / NPCs / effects into a single manifest.
- [ ] Manually polish remaining broken extended runtime subjects such as `nazir`, `seraphin`, and `fallen_holy_knight`.
- [ ] Investigate headless `capture:viewer` atlas placeholder artifacts separately from runtime strip generation.

## 2026-05-17 Recruitment Result Presentation

- [x] 영입 대화 종료 후 캐릭터 카드가 회전하며 중앙으로 날아오는 획득 연출을 추가한다.
- [x] 영입 획득 연출 상태를 디버그 텍스트에 노출해 smoke/Playwright 검증이 가능하게 한다.

## 2026-05-17 Equipment Shop Readability

- [x] 장비 장착 시 캐릭터 레벨 요구 조건을 실제로 강제한다.
- [x] 상점 장비 상품에 현재 착용 장비 대비 전투력 변화와 레벨 부족 여부를 표시한다.

## 2026-05-18 Release Ops Follow-up

- [x] Play Console 데이터 세이프티 입력 기준을 `docs/release_ops/PLAY_CONSOLE_DATA_SAFETY_ANSWERS.md`로 문서화한다.
- [x] 앱 옵션 화면에 개인정보처리방침 외부 링크 버튼을 추가한다.
- [x] Play Console 업로드용 `512x512` 앱 아이콘과 `1024x500` 피처 그래픽을 생성한다.
- [x] 최신 코드 기준 unsigned release AAB를 재생성하고 서명 상태를 확인한다.
- [x] GitHub Pages 설정 후 `https://hhy0111.github.io/hero-sword/privacy-policy.html` 접근을 확인한다.
- [ ] Play Console 데이터 세이프티 저장 완료를 콘솔에서 확인한다.
- [x] Play Console 내부 테스트 업로드용 signed AAB를 생성한다.
- [x] Play Console 일회성 상품 5개를 앱 상품 ID와 구매 옵션 ID 기준으로 정리하고 앱 내 노출을 반영한다.
- [ ] RevenueCat Android API Key 운영값을 반영하고 실제 Android 결제 조회를 확인한다.
