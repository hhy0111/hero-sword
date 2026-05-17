# IMAGE_PROMPT_MASTER_PLAN.md

## 목적

- 전체 이미지 프롬프트를 만들기 전에 남은 미확정 항목을 정리한다.
- `지금 바로 만들 수 있는 프롬프트`와 `범위만 잠가둔 프롬프트`를 분리한다.
- 프롬프트 파일 기준으로 전체 구조와 남은 작업량을 고정한다.

## 결론

- 전체 이미지 프롬프트 작업은 `바로 시작 가능`하다.
- 치명적 블로커는 없다.
- 다만 `NPC`, `적/보스`, `VFX`, `스토어 이미지`는 이번 문서 세트에서 범위를 먼저 잠갔다.
- 출시 운영값과 스토어 콘솔 값은 여전히 미확정이지만, 이미지 프롬프트 작성 자체를 막지는 않는다.

## 프롬프트 파일 구조 확정

| 파일 | 범위 | 상태 | 비고 |
| --- | --- | --- | --- |
| `READY_TO_COPY_PROMPTS.md` | 월드, 마을, UI, 상점 NPC, 보스 일부, 공용 아트 | 완료 | 실사용 가능 |
| `CHARACTER_READY_TO_COPY_PROMPTS.md` | 플레이어블 캐릭터 21명 애니메이션 패키지 | 완료 | 실사용 가능 |
| `NPC_READY_TO_COPY_PROMPTS.md` | 허브/지역 대표/배회 NPC | 완료 | 실사용 가능 |
| `ENEMY_READY_TO_COPY_PROMPTS.md` | 일반 몬스터, 엘리트, 보스 | 완료 | 실사용 가능 |
| `EQUIPMENT_READY_TO_COPY_PROMPTS.md` | 무기, 방어구, 아이템, 아이콘 | 완료 | 실사용 가능 |
| `VFX_READY_TO_COPY_PROMPTS.md` | 스킬 이펙트, 피격, UI 보상 연출 | 완료 | 실사용 가능 |
| `STORE_READY_TO_COPY_PROMPTS.md` | 앱 아이콘, 피처 그래픽, 스토어 스크린샷, 프로모션 컷 | 완료 | 실사용 가능 |

## 지금 해결한 미확정 항목

| 항목 | 이전 상태 | 현재 처리 |
| --- | --- | --- |
| 플레이어블 캐릭터 도트 규격 | `[확인 필요]` | `64x64` 기준으로 확정 |
| 일반 NPC/일반 몬스터 규격 | 미정 | `48x48` 기준으로 확정 |
| 보스 인게임 규격 | 미정 | `96x96` 기준으로 확정 |
| 행동별 키포즈 시트 규격 | 초안 | `1536x1536` 기준으로 확정 |
| 대화용/전신 이미지 규격 | 초안 | `1024x1024`, `1536x2048`로 확정 |
| NPC 이미지 범위 | 미정 | 역할 기반 로스터 확정 |
| 적/보스 이미지 범위 | 미정 | 대륙별 적 계열 + 12명 보스 범위 확정 |
| VFX 이미지 범위 | 미정 | 클래스/시스템 기반 카테고리 확정 |
| 스토어 스크린샷 목록 | 초안 | 컷 구성 확정 |

## 프롬프트 작성 가능 상태

### 바로 작성 가능

- 플레이어블 캐릭터
- 대화용 초상
- 캐릭터 전신 키비주얼
- 마을/거점 배경
- 월드맵
- UI 기본 시트
- 무기/방어구 대표 시트
- 스토어 아이콘/피처 그래픽/스크린샷 컷 구성

### 이미 파일까지 작성 완료

- 허브/지역 대표/배회 NPC
- 일반 적 / 엘리트 / 대륙 보스
- 클래스/지역별 VFX
- 장비 및 아이콘 전용 시트
- 앱 아이콘 / 피처 그래픽 / 스토어 스크린샷 컷

## 아직 남아 있지만 이미지 프롬프트를 막지 않는 항목

| 항목 | 상태 | 이미지 프롬프트 영향 |
| --- | --- | --- |
| 패키지명 | `com.appstudioon.herosword` 확정 | 없음 |
| 개발자명 | `AppStudioOn` 확정 | 없음 |
| 지원 메일 | `young02hwi@gmail.com` 확정 | 없음 |
| 개인정보처리방침 URL | GitHub Pages URL 확정 | 없음 |
| 실제 광고/IAP 값 | 미확정 | 없음 |
| 스토어 짧은/긴 설명 | 초안 작성 완료 | 스토어 이미지 프롬프트와는 분리 가능 |
| 콘텐츠 등급 | `[확인 필요]` | 직접 영향 없음 |
| 데이터 세이프티 | `[확인 필요]` | 직접 영향 없음 |

## 프롬프트 제작 순서 확정

1. 플레이어블 캐릭터
2. 허브/거점 배경
3. NPC
4. 적/보스
5. 장비/아이콘
6. VFX
7. 스토어 이미지

현재 상태:
- 1~7 전 범위 프롬프트 파일 생성 완료

## 관련 문서

- `./PROMPT_LIBRARY.md`
- `./IMAGE_GENERATION_EXECUTION_PLAN.md`
- `./IMAGE_REVIEW_PLAYBOOK.md`
- `./CHARACTER_READY_TO_COPY_PROMPTS.md`
- `./NPC_VISUAL_SCOPE.md`
- `./ENEMY_VISUAL_SCOPE.md`
- `./VFX_DIRECTION.md`
- `./NPC_READY_TO_COPY_PROMPTS.md`
- `./ENEMY_READY_TO_COPY_PROMPTS.md`
- `./EQUIPMENT_READY_TO_COPY_PROMPTS.md`
- `./VFX_READY_TO_COPY_PROMPTS.md`
- `./STORE_READY_TO_COPY_PROMPTS.md`
- `../release_ops/RELEASE_INPUTS.md`
- `../release_ops/STORE_IMAGE_PRIORITY.md`
