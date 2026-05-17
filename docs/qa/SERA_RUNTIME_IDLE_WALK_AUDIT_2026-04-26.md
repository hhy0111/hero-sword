# SERA_RUNTIME_IDLE_WALK_AUDIT_2026-04-26

- summary:
  - `sera`의 `idle`과 `walk` 런타임 애니메이션은 현재 상용 품질 기준에서 통과 불가다.
  - `walk`는 런타임 스트립 자체가 상단 절단 상태다.
  - `idle`은 6프레임 루프처럼 등록돼 있지만 실질적으로는 2개 상태 반복에 가깝다.
  - 원인은 `패키지 패널 우선 추출 경로`와 `sera 소스 매핑 혼선`이 겹친 것으로 판단한다.
- inputs:
  - `public/assets/runtime/characters/sera/idle.png`
  - `public/assets/runtime/characters/sera/walk.png`
  - `public/assets/runtime/characters/sera/town_idle.png`
  - `public/assets/runtime/animation-manifest.json`
  - `assets/source/character-animation-master-sheets/approved/03-sera.png`
  - `assets/source/character-animation-master-sheets/approved/04-luna.png`
  - `assets/source/character-package-sheets/approved/03-sera-package-sheet-v1.png`
  - `scripts/generate-runtime-character-clips.py`
- decisions:
  - 이번 패스에서는 코드 수정이나 재생성은 하지 않고, 현재 상태와 원인만 확정 기록한다.
  - `sera`는 다음 수정 패스에서 `package-panel full extraction`을 우선 중단하고 재추출 대상으로 다룬다.
  - `walk`만의 문제가 아니라 `idle / walk / town_idle`이 같은 추출 계열 문제를 공유한다고 본다.
- todo:
  - `sera`에 대해 `package-panel full extraction` 비활성화 또는 우회 적용.
  - `sera`의 실제 사용 소스를 정리한 뒤 `approved master` 기준으로 `idle / walk / town_idle` 재생성.
  - `extract_frame_from_package_source_box()` 및 `extract_package_panel_subject()` 경로에서 `비어 있지 않음`이 아니라 `전신 프레임인지`까지 걸러내는 판정 강화.
  - 재생성 후 `Animation Viewer`, 실제 전투/마을 씬, contact sheet를 모두 재검수.
- risks:
  - 현재 상태로는 `sera`가 등장하는 씬에서 캐릭터 품질 저하가 직접 노출된다.
  - `sera`만 고쳐도 비슷한 패키지 패널 기반 subject에서 같은 문제가 다시 나올 수 있다.
  - 소스 파일명과 실제 캐릭터 내용이 일부 어긋난 상태라, 성급히 재생성하면 다른 subject까지 꼬일 수 있다.
- artifacts_changed:
  - `progress.md`
  - `output/sera-animation-review/sera_idle_contact.png`
  - `output/sera-animation-review/sera_walk_contact.png`
  - `output/sera-animation-review/sera_run_contact.png`
  - `output/sera-animation-review/sera_town_idle_contact.png`
  - `output/sera-animation-review/viewer-idle.png`
  - `output/sera-animation-review/viewer-walk.png`
  - `output/sera-animation-review/extracted_idle_raw_frames.png`
  - `output/sera-animation-review/debug_idle_1.png`
  - `output/sera-animation-review/debug_walk_1.png`
  - `output/sera-animation-review/debug_walk_4.png`
  - `output/sera-animation-review/debug_town_idle_1.png`
  - `output/sera-animation-review/03-sera_preview.png`
  - `output/sera-animation-review/04-luna_preview.png`
  - `output/sera-animation-review/03-sera-package-sheet-v1_preview.png`
  - `output/sera-animation-review/sera_package_idle_boxes.png`
  - `output/sera-animation-review/sera_package_walk_boxes.png`
  - `output/sera-animation-review/sera_package_town_idle_boxes.png`
- handoff_to:
  - `qa_agent`
  - `asset_agent`
  - next animation cleanup pass
- handoff_notes:
  - 우선순위는 `sera / idle`, `sera / walk`, `sera / town_idle` 순서가 아니라 세 개를 한 묶음으로 다시 추출하는 것이다.
  - 패키지 패널 박스는 `walk`와 `town_idle`에서 부분 몸통/머리 조각을 허용하고 있어 현재 기준으로 신뢰 불가다.
  - `sera` 원본 확인 시 `approved/04-luna.png`에 실제 Sera 아트가 들어 있는 점을 먼저 다시 검증하고 진행해야 한다.
- done_check:
  - true

## 1. 현상 요약

- `idle`
  - 런타임 등록은 `6f @ 8fps loop`다.
  - 실제 런타임 스트립을 프레임 비교하면 `6프레임 중 2개 상태만 유효하게 반복`된다.
  - 자연스러운 미세 루프가 아니라 정지 상태가 길게 반복되는 느낌이다.
- `walk`
  - 런타임 스트립 각 프레임의 상단이 이미 잘려 있다.
  - Animation Viewer에서도 머리 윗부분이 날아간 상태로 동일 재현된다.
  - 즉, 표시 문제보다 `출력 결과물 자체의 절단` 문제다.
- `town_idle`
  - 이번 요청은 `idle / walk` 확인이었지만 관련 경로를 함께 보니 `town_idle`도 머리만 남는 프레임이 있어 같은 계열 결함으로 보인다.

## 2. 증거

- 런타임 접촉시트
  - [sera_idle_contact.png](</D:/dev/game307/output/sera-animation-review/sera_idle_contact.png>)
  - [sera_walk_contact.png](</D:/dev/game307/output/sera-animation-review/sera_walk_contact.png>)
  - [sera_run_contact.png](</D:/dev/game307/output/sera-animation-review/sera_run_contact.png>)
  - [sera_town_idle_contact.png](</D:/dev/game307/output/sera-animation-review/sera_town_idle_contact.png>)
- 실제 게임 뷰어 캡처
  - [viewer-idle.png](</D:/dev/game307/output/sera-animation-review/viewer-idle.png>)
  - [viewer-walk.png](</D:/dev/game307/output/sera-animation-review/viewer-walk.png>)
- 패키지 패널 추출 중간 결과
  - [extracted_idle_raw_frames.png](</D:/dev/game307/output/sera-animation-review/extracted_idle_raw_frames.png>)
  - [debug_walk_4.png](</D:/dev/game307/output/sera-animation-review/debug_walk_4.png>)
  - [debug_town_idle_1.png](</D:/dev/game307/output/sera-animation-review/debug_town_idle_1.png>)
- 패키지 패널 박스 검토
  - [sera_package_idle_boxes.png](</D:/dev/game307/output/sera-animation-review/sera_package_idle_boxes.png>)
  - [sera_package_walk_boxes.png](</D:/dev/game307/output/sera-animation-review/sera_package_walk_boxes.png>)
  - [sera_package_town_idle_boxes.png](</D:/dev/game307/output/sera-animation-review/sera_package_town_idle_boxes.png>)

## 3. 분석

### 3-1. `walk`는 자산 출력물 단계에서 이미 절단됨

- `public/assets/runtime/characters/sera/walk.png`는 `512x64`, `8프레임`, `64x64` 셀 구조다.
- 각 프레임의 알파 bbox 상단이 전부 `y=21` 부근에서 시작한다.
- 이는 다른 정상 캐릭터의 walk보다 현저히 낮고, 실제로 상단이 잘린 프레임이라는 뜻이다.
- 따라서 런타임 재생 코드보다 `추출/내보내기 단계`를 먼저 고쳐야 한다.

### 3-2. `idle`은 프레임 수는 맞아도 유효 상태가 부족함

- `idle` 6프레임 비교 결과:
  - 1~3 프레임이 동일
  - 4~6 프레임도 동일
- 완전히 망가진 건 아니지만, 6프레임 루프 품질로 보기 어렵다.
- 현재 출력은 `실제 미세 모션이 사라졌거나`, `추출 과정에서 비슷한 프레임만 살아남은 상태`로 해석하는 게 맞다.

### 3-3. 패키지 패널 추출이 전신 대신 파편 프레임을 통과시킴

- `scripts/generate-runtime-character-clips.py`의 `extract_package_panel_subject()` 경로는 `sera`에 대해 패키지 시트를 우선 사용한다.
- 이 경로에서 `extract_frame_from_package_source_box(..., expand_source_box=False)`를 직접 돌려 확인한 결과:
  - `idle` 일부 프레임은 상반신 파편 또는 잘못된 부분 선택
  - `walk` 4프레임은 거의 하체/몸통 조각만 남음
  - `town_idle` 1프레임은 머리만 남음
- 즉, `프레임이 비어있지는 않다`는 이유만으로 통과하고 있지만 실제로는 전신 프레임이 아니다.

### 3-4. `sera` 소스 매핑이 직관적이지 않음

- 현재 스크립트 subject 정의상:
  - `bram`은 `03-sera.png`를 사용
  - `sera`는 `04-luna.png`를 사용
- 실제 미리보기 결과:
  - [03-sera_preview.png](</D:/dev/game307/output/sera-animation-review/03-sera_preview.png>)는 Bram 계열 아트
  - [04-luna_preview.png](</D:/dev/game307/output/sera-animation-review/04-luna_preview.png>)는 실제 Sera 아트
- 즉, `sera` 복구 작업은 단순 클립 재생성이 아니라 `현재 어떤 파일이 실제 Sera 원본인지`를 먼저 확정한 뒤 진행해야 안전하다.

## 4. 해결 방향

1. `sera`는 패키지 패널 전체 추출 우선 경로에서 제외한다.
2. `approved master` 기준으로 `idle / walk / town_idle`만 먼저 재생성한다.
3. 필요하면 `sera` 전용 manual source boxes를 추가한다.
4. `extract_frame_from_package_source_box()` 결과가 다음 조건을 못 넘으면 폐기하도록 강화한다.
   - 전신 비율이 너무 낮지 않을 것
   - 머리만/몸통만 조각처럼 남지 않을 것
   - 프레임 중심이 극단적으로 치우치지 않을 것
5. 재생성 후에는 아래 세 가지를 모두 다시 확인한다.
   - contact sheet
   - Animation Viewer
   - 실제 씬 재생

## 5. 결론

- `sera idle` 문제는 `미세 루프 손실`
- `sera walk` 문제는 `상단 절단`
- 두 문제 모두 공통적으로 `현재 package-panel 기반 runtime 추출 경로가 세라에 맞지 않게 실패`한 결과로 보는 게 맞다.
- 다음 수정은 `출력물 보정`이 아니라 `source routing + extraction rule` 정리부터 시작해야 한다.
