- summary:
  - automatic QA still classifies some clips as `caution`, but visual review shows they are not usable
  - this file is the manual fail override list for clips that must be treated as failed until recut
- inputs:
  - `output/qa/runtime-character-quality-report.json`
  - frame review sheets under `output/qa/character-frame-review/*`
  - overview review sheets under `output/qa/character-overview-review/*`
  - user report for `luna`
- decisions:
  - promote the listed clips to manual `fail` status even when the runtime audit says `caution`
  - prioritize internal transparency, half-body crop, blank-frame collapse, and label-only remnants over QA score
- todo:
  - recut each listed clip from original source rows using manual source boxes
  - rerun review sheet export and full runtime audit after each subject batch
- risks:
  - white costume characters can be under-cut by current transparency cleanup
  - several dark-costume characters still collapse to label digits or narrow torso strips
- artifacts_changed:
  - `docs/qa/MANUAL_FAIL_OVERRIDE_LIST_2026-04-12.md`
- handoff_to:
  - next animation recut pass
- handoff_notes:
  - treat this file as higher priority than automatic `caution` for the listed clips
  - if a recut still leaves internal holes or half-body crops, discard the runtime result and go back to original source boxes
- done_check:
  - manual fail list created and expanded with whole-roster visual review results

## Manual Fail Overrides

### 1. User-confirmed white-costume transparency failures

- `luna / walk`
  - issue: internal transparency opens inside the robe/body
  - evidence: [walk-all-frames.png](D:/dev/game307/output/qa/character-frame-review/luna/walk-all-frames.png)
- `luna / buff_cast`
  - issue: internal transparency remains inside the body/robe while effect frames are active
  - evidence: [buff_cast-all-frames.png](D:/dev/game307/output/qa/character-frame-review/luna/buff_cast-all-frames.png)
- `luna / talk`
  - issue: internal transparency remains inside the body/robe
  - evidence: [talk-all-frames.png](D:/dev/game307/output/qa/character-frame-review/luna/talk-all-frames.png)
- `luna / victory`
  - issue: internal transparency remains inside the body/robe
  - evidence: [victory-all-frames.png](D:/dev/game307/output/qa/character-frame-review/luna/victory-all-frames.png)
- `luna / down_or_death`
  - issue: internal transparency and pose breakup remain in the prone frames
  - evidence: [down_or_death-all-frames.png](D:/dev/game307/output/qa/character-frame-review/luna/down_or_death-all-frames.png)

### 2. Visually broken even though automatic QA says caution

- `sera / idle`
  - issue: frame 2 collapses to a narrow hair strip instead of a character
  - evidence: [idle-all-frames.png](D:/dev/game307/output/qa/character-frame-review/sera/idle-all-frames.png)
- `sera / run`
  - issue: multiple frames are cut at the right edge and lose large parts of the body
  - evidence: [run-all-frames.png](D:/dev/game307/output/qa/character-frame-review/sera/run-all-frames.png)
- `sera / attack_basic_01`
  - issue: attack pose exists, but final action frame collapses into projectile/effect-only output
  - evidence: [attack_basic_01-all-frames.png](D:/dev/game307/output/qa/character-frame-review/sera/attack_basic_01-all-frames.png)
- `sera / attack_basic_02`
  - issue: attack pose exists, but final action frame collapses into projectile/effect-only output
  - evidence: [attack_basic_02-all-frames.png](D:/dev/game307/output/qa/character-frame-review/sera/attack_basic_02-all-frames.png)
- `sera / cast_start`
  - issue: middle frames collapse into narrow partial-body slices
  - evidence: [cast_start-all-frames.png](D:/dev/game307/output/qa/character-frame-review/sera/cast_start-all-frames.png)
- `sera / cast_loop`
  - issue: frames collapse to a thin ground strip with no usable character body
  - evidence: [cast_loop-all-frames.png](D:/dev/game307/output/qa/character-frame-review/sera/cast_loop-all-frames.png)
- `sera / hit_react`
  - issue: one frame collapses to a side slice instead of a full-body hit pose
  - evidence: [hit_react-all-frames.png](D:/dev/game307/output/qa/character-frame-review/sera/hit_react-all-frames.png)
- `sera / dash_or_dodge`
  - issue: multiple frames are half-body crops mixed with trail-only output
  - evidence: [dash_or_dodge-all-frames.png](D:/dev/game307/output/qa/character-frame-review/sera/dash_or_dodge-all-frames.png)
- `sera / town_idle`
  - issue: frames are cut into narrow vertical body slices
  - evidence: [town_idle-all-frames.png](D:/dev/game307/output/qa/character-frame-review/sera/town_idle-all-frames.png)
- `sera / victory`
  - issue: at least one frame collapses to a narrow vertical slice instead of the pose
  - evidence: [victory-all-frames.png](D:/dev/game307/output/qa/character-frame-review/sera/victory-all-frames.png)

- `sera` reviewed but not promoted this pass:
  - `walk`: still usable, keep as caution
  - `talk`: usable
  - `down_or_death`: pose sequence is readable, keep as caution
  - `cast_release`: borderline because the last frame is effect-dominant, but not promoted yet

### 3. Same failure family found by spot check

- `iris / idle`
  - issue: frames collapse to near-empty output with only a bottom strip
  - evidence: [idle-all-frames.png](D:/dev/game307/output/qa/character-frame-review/iris/idle-all-frames.png)
- `laila / walk`
  - issue: character is replaced by label digits instead of sprite content
  - evidence: [walk-all-frames.png](D:/dev/game307/output/qa/character-frame-review/laila/walk-all-frames.png)
- `hakan / attack_basic_02`
  - issue: frames collapse to digits/label scraps instead of the character body
  - evidence: [attack_basic_02-all-frames.png](D:/dev/game307/output/qa/character-frame-review/hakan/attack_basic_02-all-frames.png)
- `seraphin / run`
  - issue: frames collapse to tiny repeated miniatures rather than a full-body sprite
  - evidence: [run-all-frames.png](D:/dev/game307/output/qa/character-frame-review/seraphin/run-all-frames.png)
- `seraphin / walk`
  - issue: frames are cut at torso level and lose the upper body
  - evidence: [walk-all-frames.png](D:/dev/game307/output/qa/character-frame-review/seraphin/walk-all-frames.png)

### 4. Automatic hard-fail queue still open

- `sera / idle`
  - issue: frames collapse to narrow side slices instead of a stable full-body idle
  - evidence: [idle-all-frames.png](D:/dev/game307/output/qa/character-frame-review/sera/idle-all-frames.png)
- `sera / walk`
  - issue: walk row still breaks into partial slices and missing-body frames
  - evidence: [walk-all-frames.png](D:/dev/game307/output/qa/character-frame-review/sera/walk-all-frames.png)
- `sera / run`
  - issue: run row still loses body mass into narrow strips
  - evidence: [run-all-frames.png](D:/dev/game307/output/qa/character-frame-review/sera/run-all-frames.png)
- `sera / attack_basic_02`
  - issue: attack frames still break into partial-body fragments
  - evidence: [attack_basic_02-all-frames.png](D:/dev/game307/output/qa/character-frame-review/sera/attack_basic_02-all-frames.png)
- `seraphin / run`
  - issue: multiple frames collapse into narrow torso slices
  - evidence: [run-all-frames.png](D:/dev/game307/output/qa/character-frame-review/seraphin/run-all-frames.png)
- `seraphin / attack_basic_02`
  - issue: the attack row still contains broken partial-body frames
  - evidence: [attack_basic_02-all-frames.png](D:/dev/game307/output/qa/character-frame-review/seraphin/attack_basic_02-all-frames.png)
- `seraphin / skill_cast`
  - issue: skill row still includes collapsed narrow fragments instead of readable cast poses
  - evidence: [skill_cast-all-frames.png](D:/dev/game307/output/qa/character-frame-review/seraphin/skill_cast-all-frames.png)

### 5. Whole-roster visual review additions

- reviewed with no new manual fail promotion this pass:
  - `hero`
  - `bram`
  - `ria`
  - `theo`
  - `kiera`
  - `marin`

- `dorgan`
  - manual fail clips: `attack_basic_02`, `heavy_attack`, `guard_or_block`, `town_idle`
  - issue: miniature-collapse frames, strip-only remnants, and vertical-slice crops remain
  - evidence: [dorgan-overview.png](D:/dev/game307/output/qa/character-overview-review/dorgan-overview.png)

- `helma`
  - manual fail clips: `dash_or_dodge`, `guard_or_block`, `summon_or_rune`
  - issue: dash frames split into body slices, guard frames lose body mass, summon frames collapse to miniatures
  - evidence: [helma-overview.png](D:/dev/game307/output/qa/character-overview-review/helma-overview.png)

- `fin`
  - manual fail clips: `shoot_loop`, `town_idle`
  - issue: shoot frames collapse to tiny repeated sprites, town idle ends with a narrow slice frame
  - evidence: [fin-overview.png](D:/dev/game307/output/qa/character-overview-review/fin-overview.png)

- `iris`
  - manual fail clips: `attack_basic_01`, `attack_basic_02`, `attack_basic_03`, `guard_or_block`, `idle`, `run`, `skill_cast`, `town_idle`, `victory`
  - issue: multiple clips collapse to bottom strips, partial torsos, or head-only outputs
  - evidence: [iris-overview.png](D:/dev/game307/output/qa/character-overview-review/iris-overview.png)

- `wolf`
  - manual fail clips: `attack_basic_02`, `charge`, `down_or_death`, `hit_react`, `idle`, `run`, `town_idle`, `victory`
  - issue: blank frames, label/debug-panel remnants, tiny collapsed sprites, and head-only crops remain across the set
  - evidence: [wolf-overview.png](D:/dev/game307/output/qa/character-overview-review/wolf-overview.png)

- `erin`
  - manual fail clips: `dash_or_dodge`, `summon_or_rune`
  - issue: dash frames include narrow side slices, summon frames start with miniature-collapse output
  - evidence: [erin-overview.png](D:/dev/game307/output/qa/character-overview-review/erin-overview.png)

- `laila`
  - manual fail clips: `attack_basic_01`, `attack_basic_02`, `cast_start`, `dash_or_dodge`, `hit_react`, `idle`, `run`, `summon_or_rune`, `town_idle`, `victory`, `walk`
  - issue: digit remnants, blank/near-blank rows, head-only crops, and debug-panel contamination remain
  - evidence: [laila-overview.png](D:/dev/game307/output/qa/character-overview-review/laila-overview.png)

- `hakan`
  - manual fail clips: `attack_basic_01`, `attack_basic_02`, `heavy_attack`, `guard_or_block`, `hit_react`, `idle`, `run`, `skill_cast`, `taunt_or_command`, `town_idle`, `victory`
  - issue: repeated miniature rows, label digits, blank frames, and debug-panel contamination remain
  - evidence: [hakan-overview.png](D:/dev/game307/output/qa/character-overview-review/hakan-overview.png)

- `micaela`
  - manual fail clips: `buff_cast`, `down_or_death`, `pray_idle`, `town_idle`
  - issue: miniaturized characters and vertical body slices replace the intended full-body pose
  - evidence: [micaela-overview.png](D:/dev/game307/output/qa/character-overview-review/micaela-overview.png)

- `lucian`
  - manual fail clips: `dash_or_dodge`, `run`, `skill_cast`
  - issue: dash/run include narrow side slices, skill cast collapses into strip fragments and effect columns
  - evidence: [lucian-overview.png](D:/dev/game307/output/qa/character-overview-review/lucian-overview.png)

- `nazir`
  - manual fail clips: `attack_basic_01`, `charge`, `down_or_death`, `hit_react`, `idle`, `stealth_entry`, `town_idle`, `victory`
  - issue: label digits, debug panels, blank frames, and mixed contamination remain outside the repaired `attack_basic_03`
  - evidence: [nazir-overview.png](D:/dev/game307/output/qa/character-overview-review/nazir-overview.png)

- `serena`
  - manual fail clips: `attack_basic_02`, `buff_cast`, `dash_or_dodge`, `down_or_death`, `idle`, `pray_idle`, `run`
  - issue: head-only crops, skirt-only rows, blank frames, and non-prone death output remain
  - evidence: [serena-overview.png](D:/dev/game307/output/qa/character-overview-review/serena-overview.png)

- `seraphin`
  - manual fail clips: `attack_basic_02`, `guard_or_block`, `heal_cast`, `heavy_attack`, `hit_react`, `pray_idle`, `run`, `victory`, `walk`
  - issue: tiny repeated sprites, head-only crops, digit remnants, and torso-cut rows remain
  - evidence: [seraphin-overview.png](D:/dev/game307/output/qa/character-overview-review/seraphin-overview.png)

### 6. Latest selective extraction status

- retained automatic paired extraction:
  - `iris`
  - `serena`
  - `wolf`

- rolled back from automatic paired extraction after regression:
  - `sera`
  - `hakan`
  - `laila`
  - `nazir`
  - `seraphin`
  - `dorgan`
  - `helma`
  - `fin`
  - `micaela`
  - `lucian`

- current result snapshot:
  - `iris`: `9 pass / 6 caution / 0 fail`
  - `serena`: `10 pass / 4 caution / 0 fail`
  - `wolf`: `4 pass / 10 caution / 0 fail`
  - `hakan`: `10 pass / 5 caution / 0 fail`
  - `sera`: `2 pass / 8 caution / 4 fail`
  - `seraphin`: `7 pass / 5 caution / 3 fail`
