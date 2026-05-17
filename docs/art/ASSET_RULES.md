# ASSET_RULES.md

## 파일 네이밍

- 캐릭터 도트: `chr_<name>_sprite_v001.png`
- 캐릭터 애니메이션 시트: `chr_<name>_<action>_sheet_v001.png`
- 캐릭터 애니메이션 설계 시트: `chr_<name>_animation_design_v001.png`
- 대화용 이미지: `chr_<name>_dialog_v001.png`
- 전신 이미지: `chr_<name>_full_v001.png`
- UI 패널: `ui_panel_<purpose>_v001.png`
- 아이콘: `icon_<system>_<name>_v001.png`

## 폴더 규칙

- 원본 생성본은 임시 저장소에 두고 바로 본 저장소에 넣지 않는다.
- 검수 통과본만 `assets/`에 반입한다.
- 버전 변경은 `PROMPT_LIBRARY.md`와 함께 기록한다.

## 규격 확정

| 자산 | 권장 규격 | 상태 |
| --- | --- | --- |
| 플레이어블 캐릭터 도트 | `64x64` 베이스 | 확정 |
| 일반 NPC / 일반 몬스터 도트 | `48x48` 베이스 | 확정 |
| 보스 인게임 스프라이트 | `96x96` 베이스 | 확정 |
| 캐릭터 애니메이션 설계 시트 | `2048x2048` | 확정 |
| 행동별 키포즈 시트 | `1536x1536` | 확정 |
| 대화용 이미지 | `1024x1024` | 확정 |
| 전신 이미지 | `1536x2048` | 확정 |
| 앱 아이콘 | `1024x1024` | 확정 |
| 피처 그래픽 | `1024x500` | 확정 |

## 캐릭터 애니메이션 분해 기준

최소 행동 세트:
- `idle`
- `walk`
- `run`
- `attack_basic_01`
- `attack_basic_02`
- `skill_cast`
- `hit_react`
- `dash_or_dodge`
- `victory`
- `down_or_death`

추가 행동 후보:
- `attack_basic_03`
- `heavy_attack`
- `guard_or_block`
- `charge`
- `aim`
- `cast_start`
- `cast_loop`
- `cast_release`
- `heal_cast`
- `buff_cast`
- `summon_or_rune`
- `shoot_loop`
- `reload_or_reset`
- `taunt_or_command`
- `town_idle`
- `talk`
- `interact`
- `pray_idle`
- `stealth_entry`
- `gacha_intro`

강제 규칙:
- 각 행동은 `몸통 방향`, `무기 위치`, `발 접지`, `망토/헤어 후행 방향`이 읽혀야 한다.
- 한 장에 너무 많은 프레임을 우겨 넣지 말고, `행동 단위`로 나눠 생성한다.
- 생성물은 리깅용이든 프레임 애니메이션용이든 관절 위치가 추론 가능해야 한다.
- 포즈만 멋있고 연결이 안 되는 결과물은 반려한다.
- 캐릭터별 필수 추가 행동은 `./CHARACTER_ACTION_MATRIX.md` 기준으로 고정한다.
- 캐릭터별 프레임 수와 목표 fps는 `./CHARACTER_ANIMATION_SPECS.md` 기준으로 고정한다.

## 상용 안전성

- 유명 IP의 문장, 갑옷 실루엣, 무기 조형을 직접 연상시키면 반려
- 로고/문자/워터마크 흔적이 있으면 반려
- 생성형 모델의 라이선스와 상업 사용 범위를 별도 기록한다 [TODO]
