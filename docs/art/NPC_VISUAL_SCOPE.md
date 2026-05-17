# NPC_VISUAL_SCOPE.md

## 목적

- 전체 이미지 프롬프트를 만들 수 있도록 NPC 범위를 역할 기준으로 먼저 잠근다.
- 최종 이름이 바뀌어도 프롬프트를 다시 갈아엎지 않게 역할 중심으로 관리한다.

## NPC 프롬프트 구성 원칙

- 이름보다 `역할`, `거점`, `직무`, `복장 논리`, `표정 톤`을 먼저 고정한다.
- 허브 핵심 NPC는 개별 프롬프트 1개씩 만든다.
- 배회/배경 NPC는 `가변형 세트 프롬프트`로 묶어도 된다.
- 상용 모바일 ARPG 기준으로 과장된 콘셉트 NPC보다 직업이 바로 읽히는 구성을 우선한다.

## Tier 1. 루멘 마을 핵심 서비스 NPC 8종

| ID | 역할 | 비주얼 핵심 |
| --- | --- | --- |
| `npc_hub_weapon_merchant` | 무기상 | 실전형 상인, 금속과 목재가 섞인 작업복 |
| `npc_hub_armor_merchant` | 방어구상 | 천/가죽/금속 샘플이 읽히는 재봉+방어구 상인 |
| `npc_hub_item_merchant` | 아이템상 | 소모품 정리형 상인, 가방과 병류가 정돈된 느낌 |
| `npc_hub_blacksmith_master` | 대장장이 | 불가마와 망치가 어울리는 중후한 장인 |
| `npc_hub_guild_clerk` | 길드 접수원 | 정리된 서류, 게시판 업무, 친절한 안내형 |
| `npc_hub_housing_steward` | 하우징 관리인 | 실내 배치와 제작을 담당하는 생활형 NPC |
| `npc_hub_village_elder` | 마을 원로 | 재앙 전후의 기억을 가진 신뢰형 인물 |
| `npc_hub_courier_scout` | 연락/정찰 담당 | 기동성과 전달 역할이 보이는 경량 복장 |

## Tier 2. 대륙 대표 NPC 6종

| ID | 지역 | 역할 | 비주얼 핵심 |
| --- | --- | --- | --- |
| `npc_rep_bramble` | 브램블 마을 | 농경/민병 대표 | 초반 재건 분위기, 농경 도구와 방어 흔적 공존 |
| `npc_rep_granforge` | 그란포지 | 길드 대표 장인 | 용광로 도시의 권위 있는 기술자 |
| `npc_rep_blueharbor` | 블루하버 | 항만 거래 대표 | 해안 무역, 로프, 지도, 실용적 해상 의상 |
| `npc_rep_winterguard` | 윈터가드 | 수비기사단 대표 | 설원 군율, 방한 장비, 절제된 기사 이미지 |
| `npc_rep_solkazar` | 솔카자르 | 유적/교역 대표 | 사막 상인과 유적 안내자의 중간 톤 |
| `npc_rep_lumina` | 루미나 성도 | 성역 의회 담당 | 종교와 행정이 섞인 고급 성역 인물 |

## Tier 3. 배회/배경 NPC 6종

| ID | 역할 | 비주얼 핵심 |
| --- | --- | --- |
| `npc_ambient_guard` | 경비병 | 지역별 장비 차이는 있지만 공통적으로 질서와 경계 |
| `npc_ambient_farmer` | 농민/생활인 | 도구와 생업이 보이는 생활형 실루엣 |
| `npc_ambient_harbor_worker` | 항구 인부 | 밧줄, 상자, 작업장갑 등 노동 흔적 |
| `npc_ambient_priest` | 성직 계열 주민 | 과장되지 않은 종교 복식, 차분한 표정 |
| `npc_ambient_traveler` | 여행 상인/방문객 | 지역 간 이동 흔적이 있는 짐과 망토 |
| `npc_ambient_child` | 아이 주민 | 과장 없이 작고 읽기 쉬운 생활형 복장 |

## 총 프롬프트 범위

- 개별 핵심 NPC 프롬프트: `14개`
- 배회/배경 NPC 세트 프롬프트: `6개`
- 총 NPC 프롬프트 목표 수: `20개`

## 관련 문서

- `./IMAGE_PROMPT_MASTER_PLAN.md`
- `../story/TOWNS_AND_SETTLEMENTS.md`
