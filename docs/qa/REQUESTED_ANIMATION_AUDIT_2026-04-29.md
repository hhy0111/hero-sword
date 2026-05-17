- summary:
  - Requested audit completed for the user-specified runtime clips across `luna`, `ria`, `dorgan`, `helma`, `serena`, `fin`, `iris`, `wolf`, `erin`, `nazir`, `laila`, `hakan`, and `seraphin`.
  - The failures are not one single bug. They split into multiple route families: stale legacy manual source boxes, generic legacy fallback row-box extraction, package-panel/manual boxes pointing at label art, generic component/region extraction without clip-specific boxes, and a few clip-specific effect/composition cases.
  - `luna/heal_cast` remains an effect-heavy manual-source composition issue. `wolf` is the clearest case of a globally stale manual-source map. `serena`, `fin`, and `iris` show package/presentation panel contamination rather than ordinary crop mistakes.
- inputs:
  - User-requested clip list from the `2026-04-29` animation diagnosis request.
  - [summary.json](/D:/dev/game307/output/requested-animation-audit-2026-04-29/summary.json)
  - [page_1.png](/D:/dev/game307/output/requested-animation-audit-2026-04-29/runtime_pages/page_1.png)
  - [page_2.png](/D:/dev/game307/output/requested-animation-audit-2026-04-29/runtime_pages/page_2.png)
  - [page_3.png](/D:/dev/game307/output/requested-animation-audit-2026-04-29/runtime_pages/page_3.png)
  - [page_4.png](/D:/dev/game307/output/requested-animation-audit-2026-04-29/runtime_pages/page_4.png)
  - [page_5.png](/D:/dev/game307/output/requested-animation-audit-2026-04-29/runtime_pages/page_5.png)
  - [page_6.png](/D:/dev/game307/output/requested-animation-audit-2026-04-29/runtime_pages/page_6.png)
- decisions:
  - Do not treat this request as a single crop tuning bug. Repair must be grouped by extraction family.
  - `legacy_refresh_fallback_row_box` is not safe enough for several numbered-row / wide-row clips and should not be trusted for final repair on the affected subjects.
  - `package_manual_source_boxes` and `package_panel_override` are misregistered for several subjects and must be re-authored against current source/package sheets.
  - `wolf` should be treated as a subject-level remap problem, not as six unrelated clip bugs.
  - `luna/heal_cast` should be handled as a clip-specific body-plus-effect composition problem, not a generic alpha/crop problem.
- todo:
  - Repair the clips family-by-family instead of subject-by-subject when the route family is shared.
  - Rebuild `wolf` from current source/package coordinates before touching micro-crops.
  - Rebuild `serena`, `fin`, and `iris` package-derived clips from explicit verified source cells.
  - Replace generic fallback extraction for the flagged `erin`, `hakan`, `seraphin`, `dorgan`, `nazir`, and `laila` clips with clip-specific or row-indexed extraction.
- risks:
  - If the stale manual maps are tuned frame-by-frame without re-verifying the current source sheet, more adjacent panel/card contamination will remain.
  - If the generic fallback path is reused on the affected numbered/wide rows, fixes may appear to work for one frame and fail again on neighboring frames.
  - Some clips with large effects or low poses will fail if upper-body anchoring is reused blindly.
- artifacts_changed:
  - `ADD_NEW` [REQUESTED_ANIMATION_AUDIT_2026-04-29.md](/D:/dev/game307/docs/qa/REQUESTED_ANIMATION_AUDIT_2026-04-29.md) - audit-first diagnosis document for the requested clips.
- handoff_to:
  - animation repair pass
- handoff_notes:
  - Start repairs by route family: `wolf` full remap, package-panel contamination set (`serena`, `fin`, `iris`), generic fallback row-box set (`erin`, `hakan`, `seraphin`, `dorgan`, `nazir`, `laila`), then clip-specific exceptions (`luna/heal_cast`, `helma/dash_or_dodge`, `ria/town_idle`).
  - Use the runtime page bundle first for visual truth, then confirm the corresponding `source_per_clip` crop before touching extraction code.
- done_check:
  - false

## Root Cause Families

1. `stale legacy manual source boxes`
   - Current manual boxes no longer match the active source-refresh sheet.
   - Symptom pattern: adjacent content, split body/effect, label/panel fragments, duplicated figures.
2. `generic legacy fallback row-box extraction`
   - No clip-specific boxes; a generic row-band extraction is trying to infer frame windows from rows that are too wide, too effect-heavy, or not evenly spaced.
   - Symptom pattern: half-bodies, repeated miniatures, neighbor bleed, unstable full-body fit.
3. `package-panel/manual boxes pointing at presentation art`
   - Package sheet overrides or manual package boxes are landing on title-card / label / promo art instead of sprite cells.
   - Symptom pattern: blue label cards, giant cropped heads, UI plate fragments.
4. `generic component-or-region extraction without clip-specific tuning`
   - The generic component finder keeps the main mass, but sparse top pixels or edge bias are not getting enough safety margin.
   - Symptom pattern: top silhouette feels clipped, first frame left-edge crowding, visually unsafe margins.
5. `clip-specific body-plus-effect composition`
   - Some casts/dashes are not ordinary body-only frames; they need wider or asymmetric boxes and sometimes per-frame holds.
   - Symptom pattern: final effect-heavy frames look wrong even when ordinary body crops look acceptable.

## Clip Findings

### `luna`
- `heal_cast`
  - Symptom: final frames remain effect-heavy and compositionally unstable rather than reading as a clean `Luna + heal circle` finish.
  - Route: `legacy_refresh_manual_source_boxes`
  - Cause: clip-specific manual source-box design around the final effect pose; this is not the same bug as Luna's earlier internal alpha erosion.
  - Repair family: explicit per-frame source boxes for body-plus-effect composition.

### `ria`
- `town_idle`
  - Symptom: top silhouette reads as clipped even though the frame does not numerically touch row `0`.
  - Route: `generic_component_or_region`
  - Cause: generic component extraction is leaving almost no safety margin above sparse top pixels, so the hat/top silhouette feels cut off.
  - Repair family: clip-specific top-safe extraction or per-row safety padding.

### `dorgan`
- `interact`
  - Symptom: body is mostly present, but the alpha shape carries noisy residue and fragmented inner holes.
  - Route: `legacy_refresh_fallback_row_box`
  - Cause: generic fallback row-box extraction on a legacy-refresh row instead of explicit clip boxes.
  - Repair family: explicit row/cell extraction or manual clip boxes.
- `idle`
  - Symptom: full pose is readable, but the mask quality is noisy and holey across most frames.
  - Route: `legacy_refresh_fallback_row_box`
  - Cause: same fallback-row path as `interact`; not a simple one-frame crop issue.
  - Repair family: explicit row/cell extraction or manual clip boxes.
- `attack_basic_02`
  - Symptom: later frames split into body plus detached slash/effect pieces with unstable composition.
  - Route: `legacy_refresh_manual_source_boxes`
  - Cause: stale or badly sized manual boxes on the current source-refresh sheet.
  - Repair family: re-author manual source boxes against the active source sheet.

### `helma`
- `dash_or_dodge`
  - Symptom: low dash pose feels compositionally cramped and unstable.
  - Route: `region_manual`
  - Cause: the manual region rectangle itself is stale or too narrow; this is not the generic extractor's fault.
  - Repair family: re-box the clip from source with a wider asymmetric region.
- `idle`
  - Symptom: first frame is left-crowded and reads as left-clipped.
  - Route: `generic_component_or_region`
  - Cause: generic extraction/anchoring is biasing the character too far left on the first frame.
  - Repair family: clip-specific X-centering or explicit frame boxes.

### `serena`
- `victory`
  - Symptom: duplicated side fragments and body overlap appear across the clip.
  - Route: `package_manual_source_boxes`
  - Cause: package manual boxes are mispositioned or too wide and are pulling in adjacent presentation content.
  - Repair family: rebuild package source boxes from verified sprite cells.
- `down_or_death`
  - Symptom: early frames show blue label/panel content instead of the body, then the actual sprite appears later.
  - Route: `package_manual_source_boxes`
  - Cause: manual package boxes are pointing at package card art rather than the actual animation cells.
  - Repair family: full package-box remap.

### `fin`
- `aim`
  - Symptom: frame `0` shows the character, but later frames turn into blue label/presentation slices.
  - Route: `generic_component_or_region`
  - Cause: paired-row split / generic region selection is reading the wrong half of the layout and landing on panel art.
  - Repair family: explicit paired-layout frame boxes for the right-side aim cells.
- `shoot_loop`
  - Symptom: body is mostly present, but the weapon/muzzle side is too tight on the right.
  - Route: `package_manual_source_boxes`
  - Cause: package manual boxes are too narrow on the attack direction side.
  - Repair family: widen and re-center the package source boxes.

### `iris`
- `attack_basic_01`
  - Symptom: early frames show package/panel label content instead of sprite frames.
  - Route: `package_panel_override`
  - Cause: the package panel override is mapped to the wrong panel zone.
  - Repair family: discard current override and remap from verified source/package cells.
- `attack_basic_03`
  - Symptom: body/effect composition is split and mixed with neighboring content.
  - Route: `package_manual_source_boxes`
  - Cause: mispositioned manual package boxes spanning adjacent content.
  - Repair family: rebuild manual package boxes.
- `victory`
  - Symptom: frames include giant cropped head/upper-body fragments and later debris-like shapes.
  - Route: `manual_source_boxes`
  - Cause: manual source boxes are mapped to the wrong area or wrong vertical band.
  - Repair family: full manual-box re-authing from source.

### `wolf`
- `attack_basic_01`
  - Symptom: mixed panel/card contamination and incomplete body/effect composition.
  - Route: `legacy_refresh_manual_source_boxes`
  - Cause: wolf's legacy-refresh manual map is globally stale against the current source sheet.
  - Repair family: subject-wide remap.
- `attack_basic_02`
  - Symptom: same contamination family as `attack_basic_01`.
  - Route: `legacy_refresh_manual_source_boxes`
  - Cause: same stale subject-level manual mapping.
  - Repair family: subject-wide remap.
- `charge`
  - Symptom: panel/card contamination and unstable figure placement.
  - Route: `legacy_refresh_manual_source_boxes`
  - Cause: same stale subject-level manual mapping.
  - Repair family: subject-wide remap.
- `dash_or_dodge`
  - Symptom: fragmented body/effect content instead of a clean dash strip.
  - Route: `legacy_refresh_manual_source_boxes`
  - Cause: same stale subject-level manual mapping.
  - Repair family: subject-wide remap.
- `victory`
  - Symptom: duplicated paired body fragments repeat across the clip.
  - Route: `legacy_refresh_manual_source_boxes`
  - Cause: same stale subject-level manual mapping.
  - Repair family: subject-wide remap.
- `down_or_death`
  - Symptom: early frames again show panel/card content before the body appears.
  - Route: `legacy_refresh_manual_source_boxes`
  - Cause: same stale subject-level manual mapping.
  - Repair family: subject-wide remap.

### `erin`
- `walk`
  - Symptom: several frames collapse into half-body or narrow side slices.
  - Route: `legacy_refresh_fallback_row_box`
  - Cause: generic fallback row extraction is windowing the wrong part of a wide row.
  - Repair family: explicit row/cell extraction.
- `run`
  - Symptom: less catastrophic than `walk`, but still not clip-stable and shares the same route family.
  - Route: `legacy_refresh_fallback_row_box`
  - Cause: generic fallback row-box extraction on a row that needs clip-specific windows.
  - Repair family: explicit row/cell extraction.
- `summon_or_rune`
  - Symptom: manual-box clip with wide effect-driven composition that does not read like a stable body-first sequence.
  - Route: `legacy_refresh_manual_source_boxes`
  - Cause: manual source-box tuning problem on the legacy-refresh path.
  - Repair family: re-authored manual source boxes.
- `dash_or_dodge`
  - Symptom: huge top-of-head / oversized mass instead of a clean full dash pose.
  - Route: `legacy_refresh_manual_source_boxes`
  - Cause: wrong-sized or wrong-positioned manual boxes.
  - Repair family: explicit per-frame manual boxes.

### `nazir`
- `idle`
  - Symptom: doubled or side-sliced neighbor contamination repeats in the frames.
  - Route: `legacy_refresh_manual_source_boxes`
  - Cause: boxes are too wide or horizontally shifted and capture adjacent pose content.
  - Repair family: re-authored manual boxes.
- `attack_basic_03`
  - Symptom: neighbor contamination and partial overlap rather than clean frame isolation.
  - Route: `legacy_refresh_fallback_row_box`
  - Cause: generic fallback row extraction on a row that needs numbered/manual cell boundaries.
  - Repair family: explicit row/cell extraction.

### `laila`
- `run`
  - Symptom: the character collapses into tiny repeated miniatures near the bottom of the frame.
  - Route: `legacy_refresh_fallback_row_box`
  - Cause: fallback extraction is capturing multi-pose row content as small components, then normalization shrinks the result.
  - Repair family: replace fallback extraction entirely for this clip.

### `hakan`
- `walk`
  - Symptom: early and late frames include card/panel fragments and inconsistent body framing.
  - Route: `legacy_refresh_manual_source_boxes`
  - Cause: stale or misaligned manual boxes against the current source.
  - Repair family: manual-box remap from source.
- `run`
  - Symptom: upper-body-heavy framing with unstable lower-body fit.
  - Route: `legacy_refresh_fallback_row_box`
  - Cause: generic fallback extraction is biasing toward dense upper-body pixels.
  - Repair family: explicit row/cell extraction with full-height preservation.
- `heavy_attack`
  - Symptom: large upper-body frames and unstable effect-side framing.
  - Route: `legacy_refresh_fallback_row_box`
  - Cause: same fallback-row issue as `run`; no clip-specific source boxes.
  - Repair family: explicit row/cell extraction.

### `seraphin`
- `run`
  - Symptom: alternating half-body crops and neighbor contamination, especially on the right edge.
  - Route: `legacy_refresh_fallback_row_box`
  - Cause: generic fallback row extraction with bad X-windowing on the current source row.
  - Repair family: explicit row/cell extraction.
- `attack_basic_02`
  - Symptom: first frame shows panel/card content, later frames mix body and slash inconsistently.
  - Route: `legacy_refresh_manual_source_boxes`
  - Cause: misregistered manual source boxes.
  - Repair family: full manual-box remap.
- `pray_idle`
  - Symptom: half-body slices and neighbor contamination.
  - Route: `legacy_refresh_fallback_row_box`
  - Cause: same fallback-row issue as `run`.
  - Repair family: explicit row/cell extraction.
- `down_or_death`
  - Symptom: early frames show duplicated or adjacent content before the fallen body becomes readable.
  - Route: `legacy_refresh_manual_source_boxes`
  - Cause: manual source boxes span adjacent content or wrong cells.
  - Repair family: full manual-box remap.
