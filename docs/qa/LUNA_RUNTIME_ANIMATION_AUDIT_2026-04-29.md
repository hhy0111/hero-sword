- summary:
  - `luna` 런타임 애니메이션은 `한 가지 추출 방식으로 복구 불가` 판정이다.
  - 현재 기준으로 `idle`, `walk`, `run`, `dash_or_dodge`, `town_idle`, `talk`는 상대적으로 안정적이다.
  - `attack_basic_01`, `attack_basic_02`는 부분 보정 필요, `heal_cast`, `buff_cast`, `pray_idle`, `hit_react`, `victory`, `down_or_death`는 재추출 필요 수준이다.
  - 특히 `victory`는 현재 `death` 계열 포즈가 섞여 있고, `down_or_death`는 거의 빈 선만 남는 수준이라 전면 재작업이 필요하다.
- inputs:
  - runtime strips: `public/assets/runtime/characters/luna/*.png`
  - source master: `assets/source/character-animation-master-sheets/legacy-replaced/2026-04-07-source-refresh/04-luna.png`
  - extraction config: `scripts/generate-runtime-character-clips.py`
  - audit artifacts:
    - `output/luna-animation-audit/luna_runtime_source_master.png`
    - `output/luna-animation-audit/luna_source_rows_x2.png`
    - `output/luna-animation-audit/luna_route_summary.json`
    - `output/luna-animation-audit/luna_runtime_bbox_summary.json`
- decisions:
  - `luna`는 아래 5개 복구 계열로 나눠서 다뤄야 한다.
  - `A. 안정 루프형`: `idle`, `run`, `town_idle`
    - 권장 방식: `full-height source row` 또는 `manual interval row boxes`
  - `B. 단순 이동/대화형`: `walk`, `talk`
    - 권장 방식: `region direct-grid` 또는 `manual interval row boxes`
  - `C. 투사체 공격형`: `attack_basic_01`, `attack_basic_02`
    - 권장 방식: `explicit per-frame source boxes`
  - `D. 효과 우세 마법형`: `heal_cast`, `buff_cast`, `pray_idle`, `hit_react`
    - 권장 방식: `explicit per-frame source boxes`, 필요시 `character/effect 동시 보존용 full-frame crop`
  - `E. 포즈 전환/누움형`: `dash_or_dodge`, `victory`, `down_or_death`
    - 권장 방식: `manual interval/per-frame boxes`, 자동 alpha/component 추출 금지

## Clip Audit

### `idle`
- current_state:
  - 현재 strip는 큰 붕괴 없이 사용 가능하다.
- current_issue:
  - 치명 문제는 없지만, legacy/component 경로에 계속 의존하고 있다.
- source_based_fix:
  - 원본 row 기준 `full-height source row` 또는 `manual interval boxes`로 고정.
- verdict:
  - `usable`, 재추출 우선순위 `낮음`

### `walk`
- current_state:
  - 현재 strip는 전체적으로 안정적이다.
- current_issue:
  - 치명 문제는 없고, `region manual spec` 경로가 유지 중이다.
- source_based_fix:
  - 현재처럼 `region direct-grid` 유지 가능.
  - 또는 원본 row 기준 `manual interval boxes`로 전환 가능.
- verdict:
  - `usable`, 재추출 우선순위 `낮음`

### `run`
- current_state:
  - 현재 strip는 붕괴 없이 사용 가능하다.
- current_issue:
  - 자동 추출 의존이 남아 있어 장기적으로 drift 가능성은 있다.
- source_based_fix:
  - 원본 row 기준 `full-height source row` 또는 `manual interval boxes`.
- verdict:
  - `usable`, 재추출 우선순위 `낮음`

### `attack_basic_01`
- current_state:
  - 캐릭터 자체는 대체로 읽히지만 마지막 투사체 프레임 구성이 빡빡하다.
- current_issue:
  - 투사체 분리형 프레임에서 character/effect 조합이 균일 박스에 따라 흔들릴 수 있다.
- source_based_fix:
  - 원본 row 기준 `explicit per-frame source boxes`.
  - 마지막 발사 프레임은 투사체까지 포함하는 개별 박스 필요.
- verdict:
  - `partially usable`, 재추출 우선순위 `중간`

### `attack_basic_02`
- current_state:
  - 캐릭터와 탄환이 분리된 형태로 나오며, source 의도와 유사하긴 하다.
- current_issue:
  - 현재 `even boxes` 기반이라 캐릭터/효과 균형이 프레임마다 불안정할 수 있다.
- source_based_fix:
  - 원본 row 기준 `explicit per-frame source boxes`.
  - 탄환/섬광 프레임은 폭을 넓게 잡는 별도 박스 필요.
- verdict:
  - `partially usable`, 재추출 우선순위 `중간`

### `heal_cast`
- current_state:
  - 현재 strip는 `몸 전체`, `머리만`, `효과만 우세` 프레임이 섞여 있다.
- current_issue:
  - 효과가 커지는 프레임에서 alpha/component 추출이 캐릭터 대신 effect 또는 상반신 일부를 고른다.
- source_based_fix:
  - 원본 row 기준 `explicit per-frame source boxes`.
  - 캐릭터와 마법진/빛 효과를 함께 포함하는 full-frame 박스 필요.
  - 자동 component 선택 금지.
- verdict:
  - `broken`, 재추출 우선순위 `매우 높음`

### `buff_cast`
- current_state:
  - 현재 strip는 상반신/머리만 남거나 효과 조각이 섞여서 심하게 망가져 있다.
- current_issue:
  - 현재 `region manual spec`도 효과 우세 상황을 감당하지 못한다.
  - alpha/component 기반 판단이 프레임마다 다른 대상을 잡는다.
- source_based_fix:
  - 원본 row 기준 `explicit per-frame source boxes`.
  - 가능하면 `character + effect`를 함께 보존하는 넓은 프레임 박스 필요.
  - 필요시 `dual-layer` 접근 검토.
- verdict:
  - `broken`, 재추출 우선순위 `매우 높음`

### `pray_idle`
- current_state:
  - 현재 strip는 일부 프레임이 정상이지만, 일부는 얼굴/두건 클로즈업처럼 잘못 잘렸다.
- current_issue:
  - 무릎 꿇은 정적 포즈에서 자동 추출이 상반신 위주로 쏠린다.
- source_based_fix:
  - 원본 row 기준 `explicit per-frame source boxes` 또는 `manual interval boxes`.
  - 전체 무릎 포즈가 들어오도록 full-frame 기준 유지.
- verdict:
  - `broken`, 재추출 우선순위 `매우 높음`

### `hit_react`
- current_state:
  - 현재 strip는 네 컷 모두 일관성이 없고, 일부는 몸체가 뒤섞인 채 잘못 나온다.
- current_issue:
  - 현재 추출이 row 내 작은 차이를 프레임으로 잘못 분리하고 있다.
  - source row는 짧은 3프레임 계열인데 runtime은 4프레임으로 리샘플되어 더 흔들린다.
- source_based_fix:
  - 원본 row 기준 `explicit per-frame source boxes`.
  - 실제 source pose 수를 먼저 확정하고, 이후 runtime 4프레임으로 리샘플.
- verdict:
  - `broken`, 재추출 우선순위 `매우 높음`

### `dash_or_dodge`
- current_state:
  - 현재 strip는 전반적으로 읽힌다.
- current_issue:
  - cloak/dust trail을 장기적으로 안정화하려면 자동 추출 의존은 줄이는 게 좋다.
- source_based_fix:
  - 원본 row 기준 `manual interval boxes`.
  - 먼지 trail을 포함한 전체 폭 유지 필요.
- verdict:
  - `usable`, 재추출 우선순위 `낮음`

### `town_idle`
- current_state:
  - 현재 strip는 안정적이다.
- current_issue:
  - 큰 문제는 없지만 source 기준 고정값이 아직 없다.
- source_based_fix:
  - 원본 row 기준 `full-height source row` 또는 `manual interval boxes`.
- verdict:
  - `usable`, 재추출 우선순위 `낮음`

### `talk`
- current_state:
  - 현재 strip는 안정적이다.
- current_issue:
  - 큰 문제는 없고 현재 `region manual spec`이 잘 버티는 편이다.
- source_based_fix:
  - 현재 `region direct-grid` 유지 가능.
  - 필요시 원본 row 기준 `manual interval boxes`로 고정.
- verdict:
  - `usable`, 재추출 우선순위 `낮음`

### `victory`
- current_state:
  - 현재 runtime은 원본 victory가 아니라 `앉고 눕는 death 계열 포즈`처럼 보인다.
- current_issue:
  - 현재 `region manual spec`의 Y 범위가 아래 row를 침범하는 것으로 보인다.
  - source pose는 `6 source poses`, runtime은 `8 frames`라 source/runtime 매핑도 따로 다뤄야 한다.
- source_based_fix:
  - 원본 victory row만 정확히 자르는 `manual interval/per-frame boxes`.
  - `6 source poses -> 8 runtime frames` 리샘플 규칙 별도 확정.
  - 현재 region Y 범위는 폐기.
- verdict:
  - `broken`, 재추출 우선순위 `최상`

### `down_or_death`
- current_state:
  - 현재 strip는 거의 빈 선만 남는 수준이다.
- current_issue:
  - 바닥에 눕는 낮은 실루엣이라 자동 추출이 캐릭터 대신 하단 선/잔여 픽셀만 남긴다.
  - `no_component_extraction` 상태에서도 current legacy path가 prone pose를 보존하지 못한다.
- source_based_fix:
  - 원본 row 기준 `explicit per-frame source boxes` 필수.
  - 특히 `5~6프레임`의 넓게 퍼지는 누운 포즈는 폭 넓은 박스 필요.
  - 자동 alpha/component 추출 금지.
- verdict:
  - `broken`, 재추출 우선순위 `최상`

- todo:
  - `luna` 복구를 시작할 때는 아래 순서로 진행한다.
  - `victory`, `down_or_death`
  - `heal_cast`, `buff_cast`, `pray_idle`, `hit_react`
  - `attack_basic_01`, `attack_basic_02`
  - 나머지 안정 루프 정리
- risks:
  - `source frame count`와 `runtime frame count`가 다른 clip이 있다.
  - `heal_cast`, `buff_cast`는 character/effect를 한 번에 보존하지 않으면 다시 깨질 가능성이 높다.
  - `victory`는 row 범위가 잘못 잡히면 다시 `down_or_death`로 오염된다.
- artifacts_changed:
  - `output/luna-animation-audit/luna_runtime_source_master.png`
  - `output/luna-animation-audit/luna_source_rows_x2.png`
  - `output/luna-animation-audit/luna_route_summary.json`
  - `output/luna-animation-audit/luna_runtime_bbox_summary.json`
  - `output/luna-animation-audit/runtime_*`
  - `output/luna-animation-audit/source_*`
- handoff_to:
  - `game/animation runtime repair`
- handoff_notes:
  - `luna`는 `sera`처럼 한 경로로 몰아치면 안 된다.
  - 먼저 `victory/down_or_death`와 `effect-heavy clips`를 수동 박스로 고정한 뒤, 안정 루프형을 마지막에 정리하는 편이 안전하다.
- done_check:
  - `false`
