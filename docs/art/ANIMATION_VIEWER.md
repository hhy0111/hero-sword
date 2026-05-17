# ANIMATION_VIEWER.md

## 목적

- 도트 캐릭터 동작과 전투 이펙트를 개발 중 빠르게 점검하는 내부 검수 화면
- 개별 리소스 완성 전에도 `행동 구조`, `프레임 밀도`, `연출 방향`을 먼저 확인하는 용도
- 캐릭터/이펙트 선택 -> 동작 선택 -> 원본 프레임 나열 + 실시간 미리보기까지 한 화면에서 확인

## 접근 경로

- 마을 `옵션` 메뉴 진입
- 옵션 화면에서 `애니메이션 보기` 선택
- 씬 키: `animation-viewer`

## 노출 규칙

- 개발 단계에서는 메뉴 노출
- 실제 오픈 빌드에서는 메뉴 숨김
- 구현 플래그: [runtime.ts](D:/dev/game307/src/config/runtime.ts)
  - `runtimeConfig.devTools.showAnimationViewerMenu`

## 화면 구조

상단 셀렉트:
- `종류1`: `캐릭터` / `이펙트`
- `종류2`: 선택한 종류에 따른 대상 목록
  - 캐릭터면 전체 플레이어블 캐릭터 목록
  - 이펙트면 이펙트 그룹 목록
- `종류3`: 선택 대상에 연결된 애니메이션 동작 목록

중단:
- `원본 프레임 나열`
- 현재 선택된 동작의 대표 프레임을 4~6칸으로 나열

하단:
- `실시간 미리보기`
- 선택 동작을 루프 또는 단발 재생
- 캐릭터 액션이면 타깃 아이콘과 함께 동작
- 이펙트면 시작점/도착점 기준으로 전개

## 현재 포함 범위

캐릭터:
- 전체 플레이어블 캐릭터
- 공통 동작 세트 포함
  - `idle`, `walk`, `run`, `attack_basic_01`, `attack_basic_02`, `skill_cast`, `hit_react`, `dash_or_dodge`, `victory`, `down_or_death`
- 역할별 확장 세트 포함
  - 예: `guard_or_block`, `heavy_attack`, `cast_loop`, `heal_cast`, `shoot_loop`, `taunt_or_command`, `stealth_entry`

이펙트:
- 근접 공격
- 마법 투사체
- 폭발형 버스트
- 텔레그래프
- 돌진 트레일
- 힐/버프
- 보호막

## 구현 파일

- 씬: [AnimationViewerScene.ts](D:/dev/game307/src/game/scenes/AnimationViewerScene.ts)
- 옵션 메뉴: [OptionsScene.ts](D:/dev/game307/src/game/scenes/OptionsScene.ts)
- 카탈로그: [animationCatalog.ts](D:/dev/game307/src/game/data/animationCatalog.ts)
- 마을 진입 버튼: [VillageLobbyScene.ts](D:/dev/game307/src/game/scenes/VillageLobbyScene.ts)
- 캡처 스크립트: [capture-animation-viewer.mjs](D:/dev/game307/scripts/capture-animation-viewer.mjs)

## QA 포인트

- 셀렉트 변경 즉시 하단 미리보기가 갱신되는가
- 캐릭터와 이펙트 카테고리 전환 시 목록이 올바르게 바뀌는가
- 원본 프레임 줄과 실시간 미리보기의 동작 방향이 일치하는가
- 개발 메뉴가 릴리즈 빌드에서 숨겨지는가
- 새 캐릭터 추가 시 카탈로그 누락 없이 목록에 반영되는가

## 후속 작업

- 실제 제작된 도트 스프라이트 시트가 들어오면 placeholder 미리보기를 실리소스로 교체
- 이펙트 프리셋을 실제 VFX 프레임 데이터와 연결
- QA 루프에서 `애니메이션 보기` 화면 자체도 회귀 테스트 대상으로 포함
