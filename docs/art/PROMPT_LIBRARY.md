# PROMPT_LIBRARY.md

## 운영 원칙

- 이 문서는 `공통 프롬프트 조합식`을 쓰지 않는다.
- 모든 프롬프트는 복사 후 바로 이미지 생성 요청에 넣을 수 있는 `완성형 문장`으로만 관리한다.
- 프롬프트 수정 시 버전과 용도를 함께 기록한다.

## 즉시 사용 프롬프트 문서

- 실사용 복붙 프롬프트 모음: `./READY_TO_COPY_PROMPTS.md`
- 플레이어블 캐릭터 복붙 프롬프트: `./CHARACTER_READY_TO_COPY_PROMPTS.md`
- NPC 복붙 프롬프트: `./NPC_READY_TO_COPY_PROMPTS.md`
- 적/보스 복붙 프롬프트: `./ENEMY_READY_TO_COPY_PROMPTS.md`
- 장비/아이콘 복붙 프롬프트: `./EQUIPMENT_READY_TO_COPY_PROMPTS.md`
- VFX 복붙 프롬프트: `./VFX_READY_TO_COPY_PROMPTS.md`
- 스토어 이미지 복붙 프롬프트: `./STORE_READY_TO_COPY_PROMPTS.md`

## 전체 프롬프트 파일 계획

| 파일 | 상태 | 범위 |
| --- | --- | --- |
| `READY_TO_COPY_PROMPTS.md` | 완료 | 배경, UI, 상점 NPC, 공용 |
| `CHARACTER_READY_TO_COPY_PROMPTS.md` | 완료 | 플레이어블 21명 |
| `NPC_READY_TO_COPY_PROMPTS.md` | 완료 | 허브/지역 대표/배경 NPC |
| `ENEMY_READY_TO_COPY_PROMPTS.md` | 완료 | 일반 적, 엘리트, 보스 |
| `EQUIPMENT_READY_TO_COPY_PROMPTS.md` | 완료 | 무기, 방어구, 아이콘, 아이템 |
| `VFX_READY_TO_COPY_PROMPTS.md` | 완료 | 스킬/피격/UI 이펙트 |
| `STORE_READY_TO_COPY_PROMPTS.md` | 완료 | 앱 아이콘, 피처 그래픽, 스토어 컷 |

## 프롬프트 준비 문서

- 전체 계획: `./IMAGE_PROMPT_MASTER_PLAN.md`
- NPC 범위: `./NPC_VISUAL_SCOPE.md`
- 적/보스 범위: `./ENEMY_VISUAL_SCOPE.md`
- VFX 방향: `./VFX_DIRECTION.md`

## 실행/검수 문서

- 생성 실행 순서: `./IMAGE_GENERATION_EXECUTION_PLAN.md`
- 생성 결과 검수 플레이북: `./IMAGE_REVIEW_PLAYBOOK.md`
- 스토어 이미지 우선순위: `../release_ops/STORE_IMAGE_PRIORITY.md`

## 버전 기록

| 버전 | 상태 | 내용 |
| --- | --- | --- |
| v001 | 폐기 | 공통 템플릿 중심 구조 |
| v002 | 사용 | 완성형 복붙 프롬프트 구조로 전환 |
| v003 | 사용 | 전체 프롬프트 파일 계획과 준비 문서 연결 |
| v004 | 사용 | 7개 프롬프트 파일 전체 완료 |
