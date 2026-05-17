# Handoff Status 2026-05-03

- summary:
  - `히어로소드`는 현재 `대규모 아트/타운/궁/NPC 리프레시`가 진행된 상태다.
  - 몬스터, 캐릭터 초상, NPC 초상/런타임, 타운/궁 타일형 배치, 상점/결과/UI 일부가 새 구조로 교체됐다.
  - 핵심 루프는 빌드/테스트 기준으로 살아 있고, 현재 후속 작업의 중심은 `환경 아트 보강`, `전투용 SD/도트 자산 재제작`, `추가 맵 폴리싱`이다.
- inputs:
  - 사용자 요구사항:
    - 타운/궁/건물/NPC/몬스터/초상/가챠 자산 전면 교체
    - 전투용 도트/SD 자산은 일러스트와 분리 운영
    - 타일과 프롬프트는 자르기 쉬운 구조로 유지
    - 마을/궁 내부는 탑다운 타일형으로 재구성
- decisions:
  - 일러스트 자산과 전투용 런타임 자산은 분리한다.
  - 일반 몬스터/캐릭터 일러스트는 `고화질 대화/가챠/도감용`으로 사용한다.
  - 전투용 몬스터/NPC/캐릭터는 `도트/SD 런타임 시트`로 별도 운영한다.
  - 마을과 궁은 기존 큰 일러스트 배경 대신 `탑다운 타일 기반`으로 계속 재구성한다.
  - 타운/궁 QA는 현재 `npm run test:town` 경로를 기준으로 본다.
- todo:
  - 궁 전용 타일 자산이 오면 현재 공용 실내 타일 임시 구성을 실제 왕좌실 전용 타일로 교체
  - 마을 건물용 지붕/외벽/문/창문/프리팹 자산이 오면 절차형 건물 대신 실제 자산 적용
  - 전투용 `주인공 SD/도트`, `몬스터 SD/도트` 새 파이프라인 시작
  - 스테이지 확장 이후 실제 신규 몬스터/배경/이벤트 화면 QA 반복
- risks:
  - `4173` 일반 Playwright 클라이언트는 여전히 `booting` 상태만 잡히는 경우가 있어, 범용 자동화 신뢰도가 낮다.
  - 궁 내부는 아직 `공용 실내 타일` 임시 활용 상태라 최종 퀄리티가 아니다.
  - 마을 건물도 `자산 완성형`이 아니라 `절차형 탑다운 조합` 단계다.
  - 일부 대사 프롬프트/로그는 한글 인코딩 표시에 흔들림이 있을 수 있다.
- artifacts_changed:
  - 아래 “핵심 변경 파일”과 “핵심 산출물” 참고
- handoff_to:
  - 다음 작업자
- handoff_notes:
  - 타운/궁/환경 작업을 이어간다면 먼저 최신 캡처를 보고, 그 뒤 `docs/art/TOWN_AND_PALACE_TILE_DECOR_READY_TO_COPY_PROMPTS_2026-05-03.md` 기준으로 새 자산을 받아 적용하는 흐름이 맞다.
  - 전투용 몬스터/캐릭터를 이어간다면 현재 일러스트 프롬프트가 아니라 `runtime animation prompt` 문서를 기준으로 새 파이프라인을 타야 한다.
- done_check:
  - `false`

---

## 1. 현재 스냅샷

- 게임은 실행/저장/타운/궁/상점/가챠/전투/결과 화면이 모두 빌드 기준으로 동작한다.
- 메인 캠페인은 `대륙당 24 스테이지`, 총 `144 스테이지` 구조로 확장된 상태다.
- 몬스터 정의는 `60종`까지 늘어났고, NPC 초상/런타임도 대폭 확장됐다.
- 최근 중점 작업은 `타운과 궁의 탑다운 타일 구조 정리`, `NPC 런타임 시트 재생성`, `건물/궁 타일 프롬프트 추가`였다.

## 2. 최근 완료된 큰 작업

### 2-1. 스테이지/스토리/몬스터 확장

- `대륙당 24스테이지` 구조로 확장
- 스테이지 전/후 대화형 스토리 이벤트 구조 추가
- 몬스터 정의 `60종`까지 확장
- 관련 파일:
  - `src/game/data/stageSeeds.ts`
  - `src/game/data/world.ts`
  - `src/game/data/stageStoryEvents.ts`
  - `src/game/data/monsters.ts`
  - `src/game/scenes/StageSelectScene.ts`
  - `src/game/scenes/BattleScene.ts`
  - `src/game/scenes/ResultScene.ts`

### 2-2. 몬스터/캐릭터/가챠 일러스트 반영

- 플레이어블 고화질 초상 `21장` 반영
- 가챠 희귀도 배경판 `3장` 반영
- 몬스터 런타임 시트 `60장` 반영
- 관련 파일:
  - `scripts/import_prompt_asset_batches_2026_05_03.py`
  - `src/game/data/screenRuntimeArt.ts`
  - `src/game/scenes/GachaScene.ts`
  - `src/game/data/monsters.ts`
  - `src/game/scenes/BattleScene.ts`

### 2-3. 몬스터/환경 이미지 이름-내용 재매핑 적용

- `image` 폴더에 이름과 실제 내용이 어긋난 파일들을 직접 확인해 매핑
- 몬스터 일러스트 `59종`, 궁 장식, 결과화면 몬스터 미리보기 반영
- 관련 파일:
  - `scripts/import_mapped_environment_and_monster_art_2026_05_03.py`
  - `src/game/data/monsterIllustrationAssets.ts`
  - `src/game/scenes/BootScene.ts`
  - `src/game/data/palaceRuntimeArt.ts`
  - `src/game/scenes/PalaceScene.ts`
  - `src/game/scenes/ResultScene.ts`

### 2-4. NPC 초상/런타임 전면 교체

- NPC 초상 `36명`
- NPC 런타임 subject `39개`
- 도트 시트가 고정 그리드가 아니어서 처음엔 흰 박스/오절단 문제가 있었고, `슬롯 추론 방식`으로 교체해 해결
- 최근에는 NPC 런타임 프레임을 `64x64`로 다시 생성해서 장면 선명도 보강
- 관련 파일:
  - `scripts/import_npc_prompt_assets_2026_05_03.py`
  - `src/game/data/dialoguePortraitAssets.ts`
  - `src/game/ui/dialogueOverlay.ts`
  - `src/game/data/town.ts`
  - `src/game/data/palace.ts`
  - `src/game/scenes/TownInteriorScene.ts`

### 2-5. 마을/궁 타일형 재구성

- 마을 바닥 타일 혼합 강도를 줄여 `패치워크처럼 보이던 상태`를 정리
- 건물은 정면형처럼 보이던 지붕 감을 줄이고 `탑다운 직사각 건물`에 가깝게 정리
- 궁은 `어두운 덮개형 배경`을 줄이고 `타일 바닥 + 경계 벽 + 카펫 러너 + 단상` 중심으로 재구성
- 주인공/NPC 스케일과 픽셀 렌더링을 같이 보정
- 관련 파일:
  - `src/game/scenes/VillageLobbyScene.ts`
  - `src/game/scenes/PalaceScene.ts`
  - `src/style.css`
  - `scripts/run-town-manual-checks.mjs`

## 3. 현재 남아 있는 핵심 이슈

### 3-1. 궁 전용 타일 부족

- 현재 궁 내부는 `공용 실내 타일`을 임시로 사용한다.
- 전용 왕좌실 바닥/벽/카펫 타일이 추가되면 한 단계 더 올라갈 수 있다.
- 이미 프롬프트는 추가되어 있다:
  - `25. Top-Down Royal Audience Hall Floor And Wall Tile Sheet`
  - `26. Top-Down Palace Carpet Runner Tile Sheet`

### 3-2. 마을 건물 자산 부족

- 현재 마을 건물은 `탑다운 절차형 조합`으로 정리한 상태다.
- 실제 지붕/외벽/문/창문/간판/프리팹 자산이 오면 절차형보다 더 자연스럽게 교체할 수 있다.
- 이미 프롬프트는 추가되어 있다:
  - `19~24` 섹션

### 3-3. 전투용 SD/도트 파이프라인 재작업 필요

- 현재 고화질 일러스트와 전투용 도트/SD는 분리 운영하는 방향이 맞다.
- 따라서 몬스터/주인공 전투 스프라이트는 앞으로 새 프롬프트 기준으로 별도 제작해야 한다.
- 관련 문서:
  - `docs/art/MONSTER_RUNTIME_ANIMATION_READY_TO_COPY_PROMPTS_2026-05-03.md`

## 4. 다음 작업 우선순위

1. `궁 전용 타일 자산 수급 후 PalaceScene 실제 전용화`
2. `마을 건물 지붕/벽/문/프리팹 자산 수급 후 VillageLobbyScene 실자산 적용`
3. `전투용 주인공 SD/도트 자산 새 파이프라인 시작`
4. `전투용 몬스터 SD/도트 자산 새 파이프라인 시작`
5. `스테이지 증가분 기준 실제 스토리/전투/몬스터 배치 QA 반복`

## 5. 자산 프롬프트 문서 현황

### 환경/건물/궁

- [TOWN_AND_PALACE_TILE_DECOR_READY_TO_COPY_PROMPTS_2026-05-03.md](</D:/dev/game307/docs/art/TOWN_AND_PALACE_TILE_DECOR_READY_TO_COPY_PROMPTS_2026-05-03.md>)
  - 마을 타일
  - 궁 타일
  - 건물 모듈
  - 건물 프리팹
  - 궁 전용 바닥/카펫 프롬프트

### 몬스터 일러스트/런타임

- [MONSTER_EXPANSION_READY_TO_COPY_PROMPTS_2026-05-02.md](</D:/dev/game307/docs/art/MONSTER_EXPANSION_READY_TO_COPY_PROMPTS_2026-05-02.md>)
  - 대화/도감/일러스트용 몬스터
- [MONSTER_RUNTIME_ANIMATION_READY_TO_COPY_PROMPTS_2026-05-03.md](</D:/dev/game307/docs/art/MONSTER_RUNTIME_ANIMATION_READY_TO_COPY_PROMPTS_2026-05-03.md>)
  - 전투용 런타임 몬스터 시트

### 캐릭터/초상/NPC

- [CHARACTER_MASTER_PORTRAIT_READY_TO_COPY_PROMPTS_2026-05-03.md](</D:/dev/game307/docs/art/CHARACTER_MASTER_PORTRAIT_READY_TO_COPY_PROMPTS_2026-05-03.md>)
  - 플레이어블 캐릭터 고화질 초상
- [NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03.md](</D:/dev/game307/docs/art/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03.md>)
  - NPC 런타임 시트 + NPC 고화질 초상

## 6. 최신 QA 산출물

### 타운/궁/상점/NPC

- [village-overview.png](</D:/dev/game307/output/town-dev-preview/manual-checks/village-overview.png>)
- [shop-flow.png](</D:/dev/game307/output/town-dev-preview/manual-checks/shop-flow.png>)
- [gate-flow.png](</D:/dev/game307/output/town-dev-preview/manual-checks/gate-flow.png>)
- [palace-flow.png](</D:/dev/game307/output/town-dev-preview/manual-checks/palace-flow.png>)
- [npc-flow.png](</D:/dev/game307/output/town-dev-preview/manual-checks/npc-flow.png>)

### NPC/몬스터/초상 리뷰

- [npc_portraits_review.png](</D:/dev/game307/output/npc-prompt-import-2026-05-03/npc_portraits_review.png>)
- [npc_runtime_review.png](</D:/dev/game307/output/npc-prompt-import-2026-05-03/npc_runtime_review.png>)
- [portraits_review.png](</D:/dev/game307/output/prompt-asset-import-2026-05-03/portraits_review.png>)
- [monster_idle_review.png](</D:/dev/game307/output/prompt-asset-import-2026-05-03/monster_idle_review.png>)

## 7. 최근 중요 스크립트/명령

### 자산 재생성

```powershell
python scripts/import_npc_prompt_assets_2026_05_03.py
python scripts/import_mapped_environment_and_monster_art_2026_05_03.py
python scripts/import_prompt_asset_batches_2026_05_03.py
```

### 검증

```powershell
npm run typecheck
npm run test
npm run build
npm run test:town
```

## 8. 현재 기준 추천 시작점

다음에 다시 이어서 작업할 때는 아래 순서가 가장 안전하다.

1. [docs/HANDOFF_STATUS_2026-05-03.md](</D:/dev/game307/docs/HANDOFF_STATUS_2026-05-03.md>) 읽기
2. [progress.md](</D:/dev/game307/progress.md>) 최신 2~3개 섹션 읽기
3. 최신 화면 캡처 확인
   - [village-overview.png](</D:/dev/game307/output/town-dev-preview/manual-checks/village-overview.png>)
   - [palace-flow.png](</D:/dev/game307/output/town-dev-preview/manual-checks/palace-flow.png>)
4. 새 이미지가 들어왔으면 관련 importer 스크립트 재실행
5. `npm run test:town`으로 장면 QA 재확인

## 9. 파일 처리 판정

- `progress.md`: `PATCH` - 최근 작업 로그 누적 유지
- `docs/HANDOFF_STATUS_2026-05-03.md`: `ADD_NEW` - 세션 재개용 스냅샷 문서
- `src/game/scenes/VillageLobbyScene.ts`: `PATCH` - 마을 타일/건물/NPC 스케일 정리
- `src/game/scenes/PalaceScene.ts`: `PATCH` - 궁 타일형 재구성
- `scripts/import_npc_prompt_assets_2026_05_03.py`: `PATCH` - NPC 런타임 시트 재생성 규격 개선
- `scripts/run-town-manual-checks.mjs`: `PATCH` - 컷신 자동 스킵 후 타운 QA
- `docs/art/TOWN_AND_PALACE_TILE_DECOR_READY_TO_COPY_PROMPTS_2026-05-03.md`: `PATCH` - 건물/궁 추가 타일 프롬프트 확장
