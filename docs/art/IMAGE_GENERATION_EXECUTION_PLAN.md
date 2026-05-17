# IMAGE_GENERATION_EXECUTION_PLAN.md

## 목적

- 이미지 생성 작업을 `많이 만드는 순서`가 아니라 `개발과 검수가 빨리 연결되는 순서`로 고정한다.
- 시작 4인방, 루멘 허브, 1대륙 버티컬 슬라이스를 먼저 확보해 실제 게임 화면과 스토어 컷 제작까지 바로 이어지게 한다.
- 모든 배치는 `생성 -> 검수 -> 수정 -> 재검수 -> 등록` 순서를 반드시 따른다.

## 운영 원칙

- 한 배치에서 너무 많은 범위를 한 번에 생성하지 않는다.
- 같은 배치에서는 `톤이 같은 자산`만 묶는다.
- `PASS` 전까지는 `assets/` 반입 금지다.
- `SOFT FAIL`은 1회 수정 후 재검수, `FAIL`은 프롬프트를 다시 잠그고 재생성한다.
- 캐릭터는 반드시 `애니메이션 패키지 시트 승인 -> 대화용/전신/도트 파생` 순서를 따른다.

## 배치 실행 순서

| 배치 | 우선순위 | 범위 | 사용 문서 | 완료 조건 |
| --- | --- | --- | --- | --- |
| Batch 0 | 최고 | 규격, 금지 요소, 프롬프트 잠금 | `ASSET_RULES.md`, `PROMPT_LIBRARY.md`, `ART_QA_CHECKLIST.md` | 생성 기준 변경 없이 시작 가능 |
| Batch 1 | 최고 | 시작 4인방 캐릭터 패키지 | `CHARACTER_READY_TO_COPY_PROMPTS.md` | 카인, 브람, 세라, 루나 `PASS` |
| Batch 2 | 높음 | 루멘 허브 핵심 비주얼 | `READY_TO_COPY_PROMPTS.md`, `NPC_READY_TO_COPY_PROMPTS.md` | 루멘 마을, 상점 NPC, UI 기본 시트 `PASS` |
| Batch 3 | 높음 | 1대륙 버티컬 슬라이스 | `READY_TO_COPY_PROMPTS.md`, `ENEMY_READY_TO_COPY_PROMPTS.md` | 브램블 마을, 1대륙 적/보스, 전투용 기본 컷 `PASS` |
| Batch 4 | 중간 | 동료, 대륙, 지역 NPC 확장 | `CHARACTER_READY_TO_COPY_PROMPTS.md`, `NPC_READY_TO_COPY_PROMPTS.md`, `ENEMY_READY_TO_COPY_PROMPTS.md` | 대륙 순서대로 확장 가능 |
| Batch 5 | 중간 | 장비, 아이콘, VFX | `EQUIPMENT_READY_TO_COPY_PROMPTS.md`, `VFX_READY_TO_COPY_PROMPTS.md` | UI/전투 연출에 붙일 수 있는 상태 |
| Batch 6 | 중간 | 스토어 이미지 세트 | `STORE_READY_TO_COPY_PROMPTS.md`, `../release_ops/STORE_IMAGE_PRIORITY.md` | Google Play 제출용 핵심 컷 확보 |

## Batch 1 상세: 시작 4인방

| 순서 | 캐릭터 | 이유 | 사용 프롬프트 |
| --- | --- | --- | --- |
| 1 | 카인 | 앱 아이덴티티 중심, 아이콘/키아트 재사용 가능 | `CHARACTER_READY_TO_COPY_PROMPTS.md` 1번 |
| 2 | 브람 | 전열형 실루엣 기준점, 방패/중갑 기준점 | `CHARACTER_READY_TO_COPY_PROMPTS.md` 2번 |
| 3 | 세라 | 원거리 마도 연출 기준점, 캐스팅 포즈 기준점 | `CHARACTER_READY_TO_COPY_PROMPTS.md` 3번 |
| 4 | 루나 | 힐러/성직 비주얼 기준점, 회복 연출 기준점 | `CHARACTER_READY_TO_COPY_PROMPTS.md` 4번 |

Batch 1 산출물:
- 캐릭터별 애니메이션 패키지 시트 1종
- 검수 후 파생 제작 대상 확정 메모
- `chr_<name>_animation_design_v001.png` 네이밍 예약

Batch 1 검수 포인트:
- 4명이 한 파티로 놓였을 때 실루엣이 겹치지 않는가
- 검, 방패, 마도서, 성봉이 작은 화면에서도 즉시 구분되는가
- 공격/시전/회복 동작이 서로 다른 리듬으로 읽히는가
- 생성형 티 없이 같은 게임 팀이 만든 캐릭터처럼 보이는가

## Batch 2 상세: 루멘 허브

필수 생성 순서:
1. 루멘 마을 타일/오브젝트 시트
2. 루멘 무기상
3. 루멘 방어구상
4. 루멘 아이템상
5. 루멘 대장장이
6. 루멘 길드 접수원
7. 루멘 하우징 관리인
8. UI 버튼/아이콘 시트

Batch 2 목표:
- 실제 로비 화면, 상점 화면, 스토어 스크린샷 1번 컷을 만들 수 있는 최소 허브 세트 확보

## Batch 3 상세: 1대륙 버티컬 슬라이스

필수 생성 순서:
1. 브램블 마을 배경 키아트
2. 1대륙 일반 적 3종
3. 1대륙 중간 보스 1종
4. 1대륙 대륙 보스 1종
5. 월드맵 배경
6. 일반 전투 컷용 전장 배경

Batch 3 목표:
- 플레이어가 `시작 -> 탐험 -> 전투 -> 보스전` 흐름을 한 번에 이해할 수 있는 비주얼 세트 확보

## Batch 4 상세: 대륙 확장 규칙

- 2대륙부터 6대륙까지는 `동료 3명 -> 거점 1개 -> 일반 적 3종 -> 중간 보스 1종 -> 대륙 보스 1종` 순서로 고정한다.
- 한 대륙이 `PASS` 되기 전에는 다음 대륙 플레이어블 캐릭터를 먼저 늘리지 않는다.
- 각 대륙 종료 시 `톤 흔들림`, `무기군 중복`, `색 분포 충돌`을 점검한다.

## Batch 5 상세: 장비/아이콘/VFX

우선 생성 순서:
1. 무기 대표 시트
2. 방어구 대표 시트
3. 공용 아이콘 시트
4. 공격 VFX
5. 치유/버프 VFX
6. 피격/크리티컬 VFX
7. UI 보상/광고 VFX

이 배치는 `게임 적용성`이 기준이다.
- 예쁘더라도 UI에서 읽기 어려우면 반려
- 전투 이펙트가 캐릭터와 적 실루엣을 가리면 반려

## Batch 6 상세: 스토어 이미지

- 우선순위는 `../release_ops/STORE_IMAGE_PRIORITY.md`를 따른다.
- 스토어 이미지는 `승인된 인게임 자산`을 기준으로만 제작한다.
- 스토어 키아트가 인게임 캐릭터와 다른 얼굴/복장으로 보이면 반려한다.

## 배치별 공통 기록 형식

| 항목 | 기록 내용 |
| --- | --- |
| 배치명 | 예: `Batch 1 - 시작 4인방` |
| 요청일 | YYYY-MM-DD |
| 사용 프롬프트 | 파일명 + 항목 번호 |
| 생성 결과물 | 임시 저장 위치 |
| 1차 판정 | `PASS` / `SOFT FAIL` / `FAIL` |
| 수정 요청 | 핵심 3개 이내 |
| 재검수 결과 | 최종 판정 |
| 반입 여부 | `assets/ 반입 전` / `반입 완료` |

## 연결 문서

- `./PROMPT_LIBRARY.md`
- `./IMAGE_REVIEW_PLAYBOOK.md`
- `./ART_QA_CHECKLIST.md`
- `../release_ops/STORE_IMAGE_PRIORITY.md`
