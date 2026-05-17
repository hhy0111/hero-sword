# CHARACTER_ANIMATION_PROMPT_GUIDE.md

## 목적

- 캐릭터를 `한 장짜리 보기 좋은 그림`이 아니라 `행동 단위 애니메이션 제작 가능 자산`으로 설계하기 위한 기준 문서
- 기획과 디자인이 같은 캐릭터 정의를 공유하도록 만드는 문서

## 기획 전달 포인트

- 캐릭터는 설정만 있으면 끝이 아니라 `행동 세트`까지 같이 정의해야 한다.
- 각 캐릭터는 최소 `전투 행동`, `비전투 행동`, `감정 표현`, `피격/사망 반응`이 분리돼야 한다.
- 무기/장비 구조는 애니메이션 시 프레임 간 길이와 연결부가 유지돼야 한다.
- 캐릭터별 개성은 장식 과잉이 아니라 `서 있는 방식`, `무기 드는 방식`, `공격 리듬`, `승리 리액션`에서 드러나야 한다.
- 캐릭터별 세부 행동 차이는 `./CHARACTER_ACTION_MATRIX.md`를 기준으로 고정한다.
- 캐릭터별 프레임 수와 루프 길이는 `./CHARACTER_ANIMATION_SPECS.md`를 기준으로 고정한다.
- 캐릭터별 복붙용 완성형 프롬프트는 `./CHARACTER_READY_TO_COPY_PROMPTS.md`를 기준으로 사용한다.

## 캐릭터별 행동 정의 시트

| 항목 | 작성 내용 |
| --- | --- |
| 캐릭터 이름 |  |
| 전투 역할 | 탱커 / 딜러 / 메이지 / 힐러 / 서포터 |
| 기본 무기 |  |
| 전투 자세 |  |
| 이동 성향 | 무겁게 / 가볍게 / 민첩하게 / 절도 있게 |
| 기본 공격 구조 | 1타 / 2타 / 3타 여부 |
| 스킬 시전 구조 | 베기 / 찌르기 / 투사체 / 버프 / 소환 |
| 피격 반응 | 짧게 밀림 / 크게 휘청 / 자세 유지 |
| 승리 포즈 |  |
| 마을 기본 행동 | 대기 / 대화 / 상호작용 / 감정 제스처 |

## 산출물 권장 세트

- `animation_design_sheet`: 턴어라운드 + 무기 구조 + 기본 자세
- `idle_sheet`
- `walk_sheet`
- `run_sheet`
- `basic_attack_sheet`
- `skill_cast_sheet`
- `hit_react_sheet`
- `dash_or_dodge_sheet`
- `victory_sheet`
- `down_or_death_sheet`

## 확장 애니메이션 세트

- 전열형: `guard_or_block_sheet`, `heavy_attack_sheet`, `taunt_or_command_sheet`
- 민첩형: `attack_basic_03_sheet`, `charge_sheet`, `stealth_entry_sheet`
- 원거리형: `aim_sheet`, `shoot_loop_sheet`, `reload_or_reset_sheet`
- 마도형: `cast_start_sheet`, `cast_loop_sheet`, `cast_release_sheet`
- 치유/버프형: `heal_cast_sheet`, `buff_cast_sheet`, `pray_idle_sheet`
- 특수형: `summon_or_rune_sheet`, `town_idle_sheet`, `talk_sheet`, `interact_sheet`

## 캐릭터별 확정 기준

- 21명 전원 행동 차이는 `./CHARACTER_ACTION_MATRIX.md`에서 관리한다.
- 21명 전원 프레임 수와 루프 길이는 `./CHARACTER_ANIMATION_SPECS.md`에서 관리한다.
- 공통 필수 세트는 전원에게 적용한다.
- 확장 세트는 캐릭터별 `필수 추가 애니메이션` 칼럼을 따른다.
- 프롬프트 작성 시 캐릭터별 `이동 성향`, `공격 리듬`, `마을 행동`을 반드시 포함한다.
- 프롬프트 작성 시 필요 프레임 수와 목표 fps를 명시한다.

## 강제 프롬프트 규칙

- 반드시 `행동 이름`을 명시한다.
- 반드시 `카메라 각도`를 고정한다.
- 반드시 `무기 손잡이와 손의 연결부`를 명시한다.
- 반드시 `발 접지`와 `무게중심`을 명시한다.
- 반드시 `장식은 절제하고 관절이 가려지지 않게`를 포함한다.
- 반드시 `상용 게임 제작용`, `animation-ready`, `production-ready`, `not obvious AI art` 수준의 품질 요구를 넣는다.
- 한 프롬프트 안에 너무 많은 행동을 넣지 않는다. 행동 단위로 나눈다.

## 반려 기준

- 정면만 그럴듯하고 측면/후면 구조가 성립하지 않는 경우
- 무기 길이, 손 위치, 팔 길이가 포즈마다 바뀌는 경우
- 망토/치맛자락/머리카락이 관절 위치를 가려서 프레임 분해가 어려운 경우
- 멋은 있는데 실제 애니메이션으로 연결할 수 없는 과한 비틀기 포즈
- 생성형 이미지 특유의 손가락, 손잡이, 갑옷 결합부 오류
