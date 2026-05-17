# CHARACTER_ANIMATION_SPECS.md

## 목적

- 캐릭터별 애니메이션 프레임 수와 재생 속도를 확정한다.
- 애니메이터, 도트 아티스트, UI 연출 담당이 같은 수치를 기준으로 작업하게 만든다.
- 캐릭터별 행동 차이를 실제 제작 가능한 `프레임 수 + fps + 루프 방식`으로 고정한다.

## 표기 규칙

- `6f @ 8fps` = 6프레임, 초당 8프레임 재생
- `loop` = 반복 재생
- `once` = 1회 재생 후 종료
- `hold` = 마지막 프레임 유지
- 루프 길이(ms) = `프레임 수 / fps`

## 공통 베이스 스펙

| 애니메이션 키 | 기본 프레임 | 기본 속도 | 재생 방식 | 기준 루프 길이 |
| --- | --- | --- | --- | --- |
| `idle` | `6f` | `8fps` | `loop` | `750ms` |
| `walk` | `8f` | `10fps` | `loop` | `800ms` |
| `run` | `8f` | `12fps` | `loop` | `667ms` |
| `attack_basic_01` | `6f` | `12fps` | `once` | `500ms` |
| `attack_basic_02` | `6f` | `12fps` | `once` | `500ms` |
| `attack_basic_03` | `7f` | `12fps` | `once` | `583ms` |
| `heavy_attack` | `8f` | `10fps` | `once` | `800ms` |
| `skill_cast` | `8f` | `10fps` | `once` | `800ms` |
| `cast_start` | `4f` | `10fps` | `once` | `400ms` |
| `cast_loop` | `4f` | `8fps` | `loop` | `500ms` |
| `cast_release` | `6f` | `12fps` | `once` | `500ms` |
| `heal_cast` | `8f` | `10fps` | `once` | `800ms` |
| `buff_cast` | `6f` | `10fps` | `once` | `600ms` |
| `summon_or_rune` | `8f` | `10fps` | `once` | `800ms` |
| `hit_react` | `4f` | `12fps` | `once` | `333ms` |
| `dash_or_dodge` | `6f` | `14fps` | `once` | `429ms` |
| `guard_or_block` | `4f` | `8fps` | `hold` | `500ms` 진입 후 유지 |
| `charge` | `6f` | `12fps` | `once` | `500ms` |
| `aim` | `4f` | `8fps` | `hold` | `500ms` 진입 후 유지 |
| `shoot_loop` | `4f` | `12fps` | `loop` | `333ms` |
| `reload_or_reset` | `5f` | `10fps` | `once` | `500ms` |
| `taunt_or_command` | `6f` | `8fps` | `once` | `750ms` |
| `town_idle` | `6f` | `6fps` | `loop` | `1000ms` |
| `talk` | `4f` | `8fps` | `loop` | `500ms` |
| `interact` | `6f` | `8fps` | `once` | `750ms` |
| `pray_idle` | `6f` | `6fps` | `loop` | `1000ms` |
| `stealth_entry` | `6f` | `12fps` | `once` | `500ms` |
| `victory` | `8f` | `10fps` | `once` | `800ms` 후 `hold` |
| `down_or_death` | `6f` | `8fps` | `once` | `750ms` 후 `hold` |

## 캐릭터별 최종 스펙 표

| 이름 | 프로필 | idle | walk | run | 기본 공격 | 스킬/시전 | 회피/방어 | 마을 행동 | victory / death |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 카인 | 균형 검사형 | `6f @ 8fps` | `8f @ 10fps` | `8f @ 12fps` | `atk01 6f @ 12fps`, `atk02 6f @ 12fps`, `atk03 7f @ 12fps` | `charge 6f @ 12fps`, `skill_cast 8f @ 12fps` | `dodge 6f @ 14fps`, `guard 4f @ 8fps hold` | `town_idle 6f @ 6fps`, `talk 4f @ 8fps` | `8f @ 10fps` / `6f @ 8fps` |
| 브람 | 중갑 방패형 | `6f @ 7fps` | `8f @ 8fps` | `8f @ 10fps` | `atk01 7f @ 10fps`, `atk02 6f @ 10fps`, `heavy 9f @ 9fps` | `skill_cast 8f @ 10fps`, `taunt 6f @ 8fps` | `block 4f @ 8fps hold`, `dodge 5f @ 12fps` | `town_idle 6f @ 6fps`, `interact 6f @ 8fps` | `8f @ 9fps` / `6f @ 8fps` |
| 세라 | 경량 캐스터형 | `6f @ 8fps` | `8f @ 9fps` | `8f @ 11fps` | `atk01 5f @ 12fps`, `atk02 5f @ 12fps` | `cast_start 4f @ 10fps`, `cast_loop 4f @ 8fps`, `cast_release 6f @ 12fps` | `dodge 6f @ 13fps` | `town_idle 6f @ 6fps`, `talk 4f @ 8fps` | `8f @ 10fps` / `6f @ 8fps` |
| 루나 | 기도 힐러형 | `6f @ 8fps` | `8f @ 9fps` | `8f @ 10fps` | `atk01 5f @ 11fps`, `atk02 5f @ 11fps` | `heal 8f @ 10fps`, `buff 6f @ 10fps`, `pray 6f @ 6fps` | `dodge 6f @ 13fps` | `town_idle 6f @ 6fps`, `talk 4f @ 8fps` | `8f @ 9fps` / `6f @ 8fps` |
| 리아 | 현장형 힐러형 | `6f @ 8fps` | `8f @ 10fps` | `8f @ 11fps` | `atk01 5f @ 12fps`, `atk02 5f @ 12fps` | `heal 8f @ 10fps`, `buff 6f @ 10fps` | `dodge 6f @ 13fps` | `town_idle 6f @ 6fps`, `interact 6f @ 8fps`, `talk 4f @ 8fps` | `8f @ 10fps` / `6f @ 8fps` |
| 테오 | 민첩 궁수형 | `6f @ 8fps` | `8f @ 10fps` | `8f @ 13fps` | `aim 4f @ 8fps hold`, `shoot 4f @ 12fps`, `reset 5f @ 10fps` | `skill_cast 7f @ 12fps` | `dodge 6f @ 15fps` | `town_idle 6f @ 6fps`, `interact 6f @ 8fps` | `8f @ 10fps` / `6f @ 8fps` |
| 도르간 | 돌파 망치형 | `6f @ 7fps` | `8f @ 8fps` | `8f @ 10fps` | `atk01 7f @ 10fps`, `atk02 8f @ 10fps`, `heavy 9f @ 9fps` | `skill_cast 8f @ 10fps`, `charge 6f @ 11fps` | `guard 4f @ 8fps hold`, `dodge 5f @ 12fps` | `town_idle 6f @ 6fps`, `interact 6f @ 8fps` | `8f @ 9fps` / `6f @ 8fps` |
| 키에라 | 포격 사수형 | `6f @ 8fps` | `8f @ 10fps` | `8f @ 12fps` | `aim 4f @ 8fps hold`, `shoot 4f @ 12fps`, `reset 5f @ 10fps` | `charge 6f @ 12fps`, `skill_cast 8f @ 10fps` | `dodge 6f @ 14fps` | `town_idle 6f @ 6fps` | `8f @ 10fps` / `6f @ 8fps` |
| 헬마 | 룬 장인형 | `6f @ 7fps` | `8f @ 8fps` | `8f @ 9fps` | `atk01 6f @ 10fps`, `atk02 6f @ 10fps` | `buff 6f @ 10fps`, `rune 8f @ 10fps`, `charge 6f @ 10fps` | `guard 4f @ 8fps hold`, `dodge 5f @ 12fps` | `town_idle 6f @ 6fps`, `interact 6f @ 8fps` | `8f @ 9fps` / `6f @ 8fps` |
| 마린 | 돌진 창형 | `6f @ 8fps` | `8f @ 10fps` | `8f @ 13fps` | `atk01 6f @ 12fps`, `atk02 6f @ 12fps`, `atk03 7f @ 12fps` | `charge 6f @ 13fps`, `skill_cast 7f @ 12fps` | `dodge 6f @ 15fps` | `town_idle 6f @ 6fps`, `talk 4f @ 8fps` | `8f @ 10fps` / `6f @ 8fps` |
| 세레나 | 수문 힐러형 | `6f @ 8fps` | `8f @ 9fps` | `8f @ 10fps` | `atk01 5f @ 11fps`, `atk02 5f @ 11fps` | `heal 8f @ 10fps`, `buff 6f @ 10fps`, `cast_loop 4f @ 8fps` | `dodge 6f @ 13fps` | `town_idle 6f @ 6fps`, `pray 6f @ 6fps` | `8f @ 9fps` / `6f @ 8fps` |
| 핀 | 권총 기동형 | `6f @ 8fps` | `8f @ 10fps` | `8f @ 13fps` | `aim 4f @ 8fps hold`, `shoot 4f @ 12fps`, `reset 5f @ 10fps` | `skill_cast 7f @ 12fps` | `dodge 6f @ 15fps` | `town_idle 6f @ 6fps`, `talk 4f @ 8fps` | `8f @ 10fps` / `6f @ 8fps` |
| 아이리스 | 기사 균형형 | `6f @ 8fps` | `8f @ 9fps` | `8f @ 11fps` | `atk01 6f @ 11fps`, `atk02 6f @ 11fps`, `atk03 7f @ 11fps` | `charge 6f @ 11fps`, `skill_cast 8f @ 10fps` | `guard 4f @ 8fps hold`, `dodge 6f @ 13fps` | `town_idle 6f @ 6fps`, `interact 6f @ 8fps` | `8f @ 10fps` / `6f @ 8fps` |
| 볼프 | 대검 브루저형 | `6f @ 7fps` | `8f @ 8fps` | `8f @ 10fps` | `atk01 8f @ 10fps`, `atk02 8f @ 10fps`, `heavy 10f @ 9fps` | `charge 6f @ 10fps`, `taunt 6f @ 8fps` | `dodge 5f @ 12fps` | `town_idle 6f @ 6fps`, `interact 6f @ 8fps` | `8f @ 9fps` / `6f @ 8fps` |
| 에린 | 보조 캐스터형 | `6f @ 8fps` | `8f @ 9fps` | `8f @ 10fps` | `atk01 5f @ 11fps`, `atk02 5f @ 11fps` | `cast_start 4f @ 10fps`, `cast_loop 4f @ 8fps`, `rune 8f @ 10fps` | `dodge 6f @ 13fps` | `town_idle 6f @ 6fps`, `interact 6f @ 8fps` | `8f @ 10fps` / `6f @ 8fps` |
| 나지르 | 사막 암습형 | `6f @ 8fps` | `8f @ 10fps` | `8f @ 14fps` | `atk01 6f @ 13fps`, `atk02 6f @ 13fps`, `atk03 7f @ 13fps` | `charge 6f @ 13fps`, `skill_cast 7f @ 12fps` | `stealth 6f @ 12fps`, `dodge 6f @ 15fps` | `town_idle 6f @ 6fps`, `talk 4f @ 8fps` | `8f @ 10fps` / `6f @ 8fps` |
| 라일라 | 해독 마도형 | `6f @ 8fps` | `8f @ 9fps` | `8f @ 10fps` | `atk01 5f @ 11fps`, `atk02 5f @ 11fps` | `cast_start 4f @ 10fps`, `cast_release 6f @ 12fps`, `rune 8f @ 10fps` | `dodge 6f @ 13fps` | `town_idle 6f @ 6fps`, `interact 6f @ 8fps` | `8f @ 10fps` / `6f @ 8fps` |
| 하칸 | 기병 돌진형 | `6f @ 7fps` | `8f @ 9fps` | `8f @ 12fps` | `atk01 7f @ 11fps`, `atk02 7f @ 11fps`, `heavy 9f @ 10fps` | `charge 6f @ 13fps`, `skill_cast 8f @ 10fps` | `guard 4f @ 8fps hold`, `dodge 5f @ 12fps` | `town_idle 6f @ 6fps`, `taunt 6f @ 8fps` | `8f @ 9fps` / `6f @ 8fps` |
| 세라핀 | 성역 탱커형 | `6f @ 7fps` | `8f @ 8fps` | `8f @ 10fps` | `atk01 7f @ 10fps`, `atk02 7f @ 10fps`, `heavy 9f @ 9fps` | `heal 8f @ 10fps`, `skill_cast 8f @ 10fps` | `guard 4f @ 8fps hold`, `dodge 5f @ 12fps`, `pray 6f @ 6fps` | `town_idle 6f @ 6fps` | `8f @ 9fps` / `6f @ 8fps` |
| 미카엘라 | 성가 힐러형 | `6f @ 8fps` | `8f @ 9fps` | `8f @ 10fps` | `atk01 5f @ 11fps`, `atk02 5f @ 11fps` | `cast_start 4f @ 10fps`, `heal 8f @ 10fps`, `buff 6f @ 10fps`, `pray 6f @ 6fps` | `dodge 6f @ 13fps` | `town_idle 6f @ 6fps` | `8f @ 9fps` / `6f @ 8fps` |
| 루시안 | 잠입 암살형 | `6f @ 8fps` | `8f @ 10fps` | `8f @ 14fps` | `atk01 6f @ 13fps`, `atk02 6f @ 13fps`, `atk03 7f @ 13fps` | `charge 6f @ 13fps`, `skill_cast 7f @ 12fps` | `stealth 6f @ 12fps`, `dodge 6f @ 15fps` | `town_idle 6f @ 6fps`, `interact 6f @ 8fps` | `8f @ 10fps` / `6f @ 8fps` |

## 제작 원칙

- 모바일 가독성을 위해 공격 계열은 `10~13fps`, 비전투 계열은 `6~8fps` 범위를 유지한다.
- 탱커 계열은 프레임 수를 늘리고 속도를 낮춰 무게감을 만든다.
- 민첩/암살 계열은 프레임 수는 유지하고 fps를 높여 속도감을 만든다.
- 캐스터/힐러 계열은 `cast_start -> cast_loop -> cast_release` 분리를 우선한다.
- `victory`, `down_or_death`는 과장하지 말고 읽기 쉬운 실루엣을 우선한다.

## 연결 문서

- `./CHARACTER_ACTION_MATRIX.md`
- `./CHARACTER_ANIMATION_PROMPT_GUIDE.md`
- `./ASSET_RULES.md`
