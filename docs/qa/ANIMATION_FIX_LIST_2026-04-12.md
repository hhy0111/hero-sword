# Animation Fix List 2026-04-12

- summary:
  - full audit 기준 현재 상태는 `20 caution subjects / 1 fail subject / 1 fail clip`
  - 하드 블로커는 `seraphin / attack_basic_01` 1건
  - 현재 육안 기준 가장 큰 문제는 `배경색 잔여`보다 `프레임 절단`, `옆 프레임 침범`, `숫자/라벨 잔여`, `크기/중심 흔들림`
- inputs:
  - `output/qa/runtime-character-quality-report.json`
  - `output/qa/character-frame-review/*`
  - spot visual review on worst clips
- decisions:
  - 육안 확인된 문제와 QA 수치상 추가 검수 대상을 분리
  - 보정 우선순위는 `절단/옆프레임 침범 -> 숫자/라벨 잔여 -> 내부 구멍/잔여 픽셀 -> 중심/스케일 흔들림`
- todo:
  - 아래 `Priority 1`부터 순차 보정
- risks:
  - 일부 `caution`은 실제 시각 문제보다 QA 수치 문제일 수 있음
  - 반대로 `seraphin`, `nazir`, `wolf`, `serena` 일부는 실제 화면이 QA 점수보다 더 나쁨
- artifacts_changed:
  - `docs/qa/ANIMATION_FIX_LIST_2026-04-12.md`
- handoff_to:
  - asset animation cleanup pass
- handoff_notes:
  - `Priority 1`은 전부 육안 확인됨
  - `Priority 2`부터는 QA 수치 기반 후보이므로 보정 전에 프레임 시트 재확인 필요
- done_check:
  - review complete
  - fix pass not started in this document

## Priority 1: 육안 확인된 즉시 보정 대상

1. `seraphin / attack_basic_01`
   - 상태: `fail`
   - 증상: 현재 프레임에 옆 프레임 인체가 같이 들어오고, 일부 프레임은 머리/몸통이 분리됨
   - 확인 파일: `output/qa/character-frame-review/seraphin/attack_basic_01-all-frames.png`

2. `seraphin / run`
   - 상태: `caution`
   - 증상: 전신이 아니라 하단 얇은 스트립만 남음
   - 확인 파일: `output/qa/character-frame-review/seraphin/run-all-frames.png`

3. `seraphin / walk`
   - 상태: `caution`
   - 증상: 프레임 상단이 잘리고 하단 일부만 남음
   - 확인 파일: `output/qa/character-frame-review/seraphin/walk-all-frames.png`

4. `nazir / walk`
   - 상태: `caution`
   - 증상: 숫자 라벨만 남고 캐릭터가 거의 사라짐
   - 확인 파일: `output/qa/character-frame-review/nazir/walk-all-frames.png`

5. `nazir / run`
   - 상태: `caution`
   - 증상: 머리 윗부분만 남고 전신이 절단됨
   - 확인 파일: `output/qa/character-frame-review/nazir/run-all-frames.png`

6. `wolf / heavy_attack`
   - 상태: `caution`
   - 증상: 한 프레임에 작은 캐릭터가 여러 개 반복되어 들어감
   - 확인 파일: `output/qa/character-frame-review/wolf/heavy_attack-all-frames.png`

7. `serena / hit_react`
   - 상태: `caution`
   - 증상: 현재 프레임 오른쪽에 다른 프레임 인체가 같이 보임
   - 확인 파일: `output/qa/character-frame-review/serena/hit_react-all-frames.png`

## Priority 2: 옆 프레임 침범 / 다중 조각 의심

- `luna / heal_cast`
- `nazir / attack_basic_01`
- `wolf / down_or_death`
- `hakan / taunt_or_command`
- `laila / town_idle`
- `nazir / stealth_entry`
- `laila / hit_react`
- `luna / down_or_death`
- `dorgan / run`
- `sera / cast_loop`
- `serena / hit_react`
- `sera / dash_or_dodge`
- `lucian / run`
- `laila / victory`

판정 기준:
- QA flag `multi_part`
- 실제 보정 시 프레임마다 `다른 프레임 신체`, `분리 조각`, `라벨/숫자 조각` 포함 여부를 먼저 확인

## Priority 3: 절단 / 과소 추출 의심

상위 저점 대상:
- `wolf / heavy_attack`
- `dorgan / attack_basic_02`
- `hakan / skill_cast`
- `helma / summon_or_rune`
- `iris / skill_cast`
- `luna / heal_cast`
- `nazir / victory`
- `seraphin / run`
- `nazir / town_idle`
- `serena / down_or_death`
- `hakan / run`
- `iris / run`
- `seraphin / walk`
- `wolf / attack_basic_02`
- `hakan / heavy_attack`
- `seraphin / heavy_attack`

판정 기준:
- QA flag `undersized`
- QA flag `sparse_alpha`
- score 하위권

## Priority 4: 배경/내부 구멍/잔여 픽셀 추가 점검 대상

현 시점 메모:
- 육안 spot check 기준 큰 단색 배경 잔여보다는 `숫자 라벨`, `옆 프레임 조각`, `내부 구멍`이 더 우세
- 아래 클립은 `minor_holes` 또는 잔여 픽셀 계열로 다시 점검 필요

상위 후보:
- `nazir / town_idle`
- `serena / down_or_death`
- `wolf / charge`
- `bram / heavy_attack`
- `wolf / down_or_death`
- `bram / dash_or_dodge`
- `bram / skill_cast`
- `seraphin / down_or_death`
- `iris / walk`
- `bram / attack_basic_01`
- `dorgan / run`
- `luna / idle`
- `luna / walk`
- `ria / walk`
- `serena / hit_react`
- `micaela / buff_cast`
- `seraphin / skill_cast`

## Priority 5: 중심 흔들림 / 스케일 흔들림

상위 후보:
- `dorgan / attack_basic_02`
- `hakan / skill_cast`
- `helma / summon_or_rune`
- `iris / skill_cast`
- `luna / heal_cast`
- `nazir / victory`
- `seraphin / run`
- `nazir / town_idle`
- `serena / down_or_death`
- `wolf / attack_basic_02`
- `hero / down_or_death`
- `bram / down_or_death`
- `micaela / pray_idle`
- `lucian / dash_or_dodge`
- `erin / run`

판정 기준:
- `anchor_jitter`
- `center_jitter`
- `scale_jitter`

## Suggested Fix Order

1. `seraphin`
   - `attack_basic_01`
   - `run`
   - `walk`

2. `nazir`
   - `walk`
   - `run`
   - `town_idle`
   - `victory`

3. `wolf`
   - `heavy_attack`
   - `attack_basic_02`
   - `down_or_death`

4. `serena`
   - `hit_react`
   - `down_or_death`

5. `bram`
   - `heavy_attack`
   - `skill_cast`
   - `dash_or_dodge`

## 2026-04-12 Update

- completed in this pass:
  - `seraphin / attack_basic_01`
  - `nazir / walk`
  - `nazir / run`
  - `wolf / heavy_attack`
  - `serena / hit_react`
- remaining hard fail queue:
  - `nazir / attack_basic_03`
  - `wolf / idle`
  - `wolf / dash_or_dodge`
  - `serena / down_or_death`
- manual visual fail overrides:
  - see [MANUAL_FAIL_OVERRIDE_LIST_2026-04-12.md](D:/dev/game307/docs/qa/MANUAL_FAIL_OVERRIDE_LIST_2026-04-12.md)
