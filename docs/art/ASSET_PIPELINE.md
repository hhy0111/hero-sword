# ASSET_PIPELINE.md

## 강제 파이프라인

1. 스타일 기준 정의
2. 대상 에셋 목록 정의
3. 캐릭터별 행동 목록 정의
4. 프롬프트 초안 작성
5. 애니메이션 분해 가능성 검토
6. 생성본 검수
7. 수정 지시
8. 수정본 재검수
9. 확정본 등록
10. 실제 적용 위치 연결
11. QA 시각 검수
12. 프롬프트 버전/결과물 버전 기록

## 단계별 오너

| 단계 | 오너 | 산출물 |
| --- | --- | --- |
| 1~5 | `asset_agent` + `planner_agent` | `ART_DIRECTION`, `PROMPT_LIBRARY`, `CHARACTER_ACTION_MATRIX`, `CHARACTER_ANIMATION_SPECS`, 행동 목록 |
| 6~8 | `asset_agent` + `qa_agent` | `ART_QA_CHECKLIST`, 수정 메모 |
| 9~10 | `integration_agent` | `assets/`, 적용 위치 기록 |
| 11 | `qa_agent` | QA 루프 기록 |
| 12 | `asset_agent` | 버전 로그 |

## 캐릭터 애니메이션 설계 체크

프롬프트 작성 전에 반드시 정리:
- 캐릭터 이름
- 전투 역할
- 기본 무기
- 기본 자세
- 공격 방식
- 스킬 시전 방식
- 이동 방식
- 피격 리액션 성향
- 승리 포즈 성향
- 마을 내 비전투 행동
- `CHARACTER_ACTION_MATRIX.md`의 필수 추가 애니메이션 항목
- `CHARACTER_ANIMATION_SPECS.md`의 프레임 수, fps, loop/once/hold 규칙

검수 시 반드시 확인:
- 행동 간 복장 구조가 일치하는가
- 무기 길이와 손 위치가 장면마다 달라지지 않는가
- 발 접지와 무게중심이 자연스러운가
- 도트화 또는 프레임 분해 시 파츠 구분이 가능한가

## 적용 위치 기록 형식

| 에셋 ID | 적용 파일/화면 | 프롬프트 버전 | 결과물 버전 | 상태 |
| --- | --- | --- | --- | --- |
| 미기입 | 미기입 | 미기입 | 미기입 | 대기 |
