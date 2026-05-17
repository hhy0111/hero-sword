- summary:
  - The previous `luna` audit correctly identified the most broken clips, but it understated the problem in the "relatively stable" clips.
  - `idle`, `walk`, `run`, `dash_or_dodge`, `town_idle`, and `talk` are only `pose-stable`.
  - They are not `alpha-clean`.
  - The real issue is not soft semi-transparency leakage. It is `checkerboard-removal erosion` reaching into Luna's bright character pixels.
- inputs:
  - source sheet: `assets/source/character-animation-master-sheets/legacy-replaced/2026-04-07-source-refresh/04-luna.png`
  - runtime strips: `public/assets/runtime/characters/luna/*.png`
  - audit artifacts:
    - `output/luna-alpha-audit/*.png`
    - `output/luna-alpha-audit-source-compare/*.png`
    - `output/luna-animation-audit/luna_runtime_source_master.png`
- decisions:
  - Treat all current `luna` clips as needing source-based repair.
  - Split the problem into:
    - `pose broken`
    - `pose readable but alpha damaged`
  - Do not call any current `luna` clip production-pass.
- todo:
  - Rebuild broken clips first:
    - `victory`
    - `down_or_death`
    - `heal_cast`
    - `buff_cast`
    - `pray_idle`
    - `hit_react`
  - Then rebuild pose-readable but alpha-damaged clips:
    - `idle`
    - `walk`
    - `run`
    - `dash_or_dodge`
    - `town_idle`
    - `talk`
- risks:
  - Luna's hood, hair, robe, and sleeve colors are close to the light checkerboard source background.
  - Any automated background-removal or component-picking path can eat real character pixels.
- artifacts_changed:
  - `output/luna-alpha-audit/*.png`
  - `output/luna-alpha-audit-source-compare/*.png`
- handoff_to:
  - `animation runtime repair`
- handoff_notes:
  - Start from source rows.
  - Avoid assuming one extraction path will fit all Luna clips.
  - Effect-heavy clips and prone/low-silhouette clips need their own box strategy.
- done_check:
  - `false`

## Updated Diagnosis

### 1. The source sheet is not transparent

The source master sheet for Luna is an opaque image with the checkerboard baked into RGB.  
That means every runtime alpha pixel is created later by heuristic extraction.

This matters because the runtime is not "preserving source transparency".  
It is inventing a new transparency mask from a bright character drawn on a bright background.

### 2. The "stable" clips are still alpha-damaged

The following clips are pose-readable, but still visibly damaged by the mask:

- `idle`
- `walk`
- `run`
- `dash_or_dodge`
- `town_idle`
- `talk`

Evidence:

- `output/luna-alpha-audit/idle_magenta_x6.png`
- `output/luna-alpha-audit/walk_magenta_x6.png`
- `output/luna-alpha-audit/run_magenta_x6.png`
- `output/luna-alpha-audit/talk_magenta_x6.png`
- `output/luna-alpha-audit/idle_alpha_x6.png`
- `output/luna-alpha-audit/walk_alpha_x6.png`
- `output/luna-alpha-audit/run_alpha_x6.png`
- `output/luna-alpha-audit/talk_alpha_x6.png`

These clips are not semi-transparent.  
They are hard-cut binary silhouettes where bright edge pixels and some thin details have already been eaten.

### 3. The issue is not "soft transparency"

Representative runtime frames in the pose-stable clips have:

- nonzero alpha only
- no semi-alpha pixels
- effectively `0 or 255` masks

So the problem is not "partial opacity bleeding inward".  
The problem is that the mask generator is deciding that some real Luna pixels are background and deleting them entirely.

### 4. Why Luna is especially vulnerable

Luna has:

- bright hood
- bright hair
- pale robe
- thin sleeve and cape edges
- bright holy effects

Those tones are too close to the baked checkerboard brightness.  
So any extraction path based on checkerboard removal, component pruning, or bright-residue cleanup is risky.

### 5. Revised clip categories

#### Pose readable, alpha damaged

- `idle`
- `walk`
- `run`
- `dash_or_dodge`
- `town_idle`
- `talk`

These need rebuilding even if they do not look catastrophically broken.

#### Clearly broken

- `attack_basic_01`
- `attack_basic_02`
- `heal_cast`
- `buff_cast`
- `pray_idle`
- `hit_react`
- `victory`
- `down_or_death`

`victory` and `down_or_death` are the highest-risk pair because the current runtime result shows row contamination and extreme low-silhouette failure.

## Repair Implication

The correct repair target is not just:

- "stop clipping"

It is:

- preserve pose
- preserve bright character mass
- preserve thin cloth and hair edges
- preserve effect-bearing frames without letting effects replace the body

That means Luna needs a mixed strategy:

- full-height row extraction for some simple loops
- manual interval boxes for stable motion rows
- explicit per-frame boxes for projectile and effect-heavy clips
- explicit wide prone boxes for `down_or_death`
