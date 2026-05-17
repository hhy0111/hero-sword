# QA_LOOP_03.md

## 목적

- 릴리즈 후보 기준으로 상용 품질, 운영 누락, 시각 완성도를 확인한다.

## 대상

- 아트/UI 톤 일치
- 생성형 AI 티 여부
- 광고/IAP 운영 입력값 누락
- 스토어 준비 정보 누락

## 문제 목록

| ID | 심각도 | 문제 | 재현 절차 | 수정 우선순위 | 상태 |
| --- | --- | --- | --- | --- | --- |
| QA3-001 | Blocker | 플레이어/적/VFX가 아직 placeholder atlas 자산이라 상용 아트 PASS 판정을 줄 수 없음 | `output/store-screenshots/*.png`와 실제 게임 화면 확인 | 높음 | 열림 |
| QA3-002 | Blocker | 데이터 세이프티 답변, 서명키, 실광고/실결제 계정 실값이 비어 있어 Release Gate 완료 불가 | `docs/release_ops/*`와 `TODO.md` 확인 | 높음 | 열림 |
| QA3-003 | Major | 스토어 캡처는 확보됐지만 현재 UI가 하네스/디버그 성격이 강해 상용 스토어 컷으로는 과밀함 | `store_01_village.png`, `store_04_party.png`, `store_05_equipment.png` 확인 | 높음 | 열림 |

## 수정안 적용

- 스토어 캡처를 9종 세트로 정리하고 manifest를 고정
- 아이콘/피처 그래픽 브리프, 스토어 설명 초안, JDK 21 가이드, 가격 정책 초안 문서화
- release_ops 입력값 문서를 실제 코드/스크립트 상태와 맞게 갱신
- 패키지명, 개발자명, 지원 메일, GitHub Pages 기준 정책 URL, 한국 기준 가격표를 확정하고 코드/문서에 반영

## 재테스트 결과

- `npm run typecheck`: 통과
- `npm run test`: 39개 테스트 통과
- `npm run build`: 통과
- `npm run build:android`: 통과
- `Android Studio JBR 21 + ./gradlew.bat assembleDebug`: 통과
- `npm run test:smoke`: 통과
- `npm run capture:store`: 통과
- `output/store-screenshots/manifest.json` 생성 확인
- 수동 이미지 확인 결과:
  - 보스전/가챠/파티/장비/하우징 캡처는 deterministic하게 재생성 가능
  - placeholder 아트와 과밀한 텍스트 때문에 상용 스토어 PASS는 아직 불가

## 남은 리스크

- 앱 아이콘/피처 그래픽은 브리프만 있고 실제 산출물은 없음
- 실제 광고/IAP 실값 미입력
- Play Console 데이터 세이프티/서명키 입력 전까지는 출시 승인 불가
- QA 승인 전까지는 Release Gate 진입 불가

## done_check

- `true`

## 2026-04-04 Runtime Animation Prework Follow-up

- Added optional runtime animation manifest loading during boot so final character/enemy/effect strips can be connected without another bootstrap pass.
- Added a dev-only asset status scene and updated Animation Viewer to prefer loaded runtime strips when present.
- Fixed battle retry scene re-entry by resetting scene-owned view collections before each create and guarding runtime texture fallback.
- Added VirtualJoystick listener cleanup and smoke artifact cleanup so successful reruns no longer inherit stale errors-0.json.
- Follow-up verification:
  - `npm run typecheck`: passed
  - `npm run test`: 41 tests passed
  - `npm run build`: passed
  - `npm run test:smoke`: passed with `output/web-game/errors-0.json` absent

## 2026-04-05 Runtime Character Intake Follow-up

- Accepted the first 12 generated character animation-frame master sheets and moved them into `assets/source/character-animation-master-sheets/approved`.
- Regenerated `public/assets/runtime/characters/*` and refreshed `public/assets/runtime/animation-manifest.json` from those sheets.
- Verified runtime clip resolution in three live paths:
  - Animation Viewer: `hero/idle`, `serena/heal_cast`, `fin/shoot_loop`
  - Village: hero now resolves to `rtanim:character:hero:town_idle`
  - Battle: party hero resolves to `rtanim:character:hero:run`
- Remaining blocker is still incomplete final art coverage. Only the first 12 characters are on runtime clips; the rest of the roster plus enemy / VFX final strips still keep commercial QA from closing.

## 2026-04-05 Runtime Character + Enemy Batch 02 Follow-up

- Accepted the remaining 9 playable character frame sheets and the first 7 enemy frame sheets, then regenerated `public/assets/runtime/characters/*`, `public/assets/runtime/enemies/*`, and `public/assets/runtime/animation-manifest.json`.
- Expanded Animation Viewer with an `enemy` category and updated capture automation to write character / enemy / effect state snapshots alongside the PNG outputs.
- Verified current viewer state snapshots:
  - `output/animation-viewer/animation_viewer_character_state.json`: `category=character`, `subjectId=hero`, `actionId=idle`
  - `output/animation-viewer/animation_viewer_enemy_state.json`: `category=enemy`, `subjectId=morgan`, `actionId=slam_burst`
  - `output/animation-viewer/animation_viewer_effect_state.json`: `category=effect`, `subjectId=boss_battle`, `actionId=fx_burst_boss`
- Wired battle enemy runtime clip resolution for all six continents, including the newly imported enemy / boss strips for coast, frost, desert, and final-capital encounters.
- Follow-up verification:
  - `python scripts/generate-runtime-extended-clips.py`: passed
  - `npm run typecheck`: passed
  - `npm run test`: 43 tests passed
  - `npm run build`: passed
  - `npm run capture:viewer`: passed
  - `npm run test:smoke`: passed
- Remaining blocker is reduced to VFX frame-sheet coverage, animation slicing quality cleanup, and release-owned store / console inputs.

## 2026-04-05 Runtime VFX Intake Follow-up

- Refreshed the approved VFX source sheets from the latest `image/` batch and moved the incoming files into `assets/source/vfx-sheets/original-package-boards`, leaving `image/` empty again.
- Added `scripts/generate-runtime-effect-clips.py` and generated runtime strips under `public/assets/runtime/effects/*`.
- Updated `public/assets/runtime/animation-manifest.json` so effect subjects now load real runtime clips instead of placeholder-only previews.
- Wired `BattleScene` to resolve runtime effect clips first, with the old graphics path kept as fallback when a clip is unavailable.
- Playwright viewer review confirmed runtime effect playback for:
  - `party_melee / fx_slash_arc`
  - `support_magic / fx_heal_wave`
  - `party_melee / fx_charge_trail`
  - `boss_battle / fx_telegraph_ring`
  - `boss_battle / fx_burst_boss`
- Follow-up verification:
  - `python scripts/rebuild-vfx-transparent-sheets.py`: passed
  - `python scripts/generate-runtime-effect-clips.py`: passed
  - `npm run typecheck`: passed
  - `npm run test`: 43 tests passed
  - `npm run build`: passed
  - `npm run test:smoke`: passed
- Remaining art QA caveat:
  - VFX runtime hookup is complete, but some refreshed strips still need clip-selection polish for stronger readability in the viewer.
  - Commercial QA is still blocked primarily by character runtime strip quality and final placeholder replacement.

## 2026-04-05 Character Frame-by-Frame QA Follow-up

- Ran another pass against the runtime character strips after reviewing live viewer output and regenerated sheets with anchor / slicing adjustments.
- QA result is still `fail` for runtime character strips:
  - transparency cleanup is inconsistent on several clips,
  - body center / foot anchor stability is not yet reliable,
  - multiple batch-02 clips still show split-body or half-frame extraction artifacts.
- Confirmed source-sheet issues that block clean runtime slicing:
  - `15-erin.png` is blurred and not usable as a production master sheet,
  - `16-nazir.png`, `17-laila.png`, `19-seraphine.png`, `20-michaela.png`, `21-lucian.png` are shifted / mismatched versus their file names,
  - actual `Lucian` frame master sheet is still missing.
- Applied QA safety fallback:
  - runtime `character` clips are now disabled at load time,
  - game / viewer character playback falls back to the stable atlas path until per-character slicing is re-approved.
- Remaining action for art / integration:
  - replace shifted or missing batch-02 frame master sheets with corrected exports,
  - resume per-character slicing only after corrected source sheets are in place.

## 2026-04-05 Character Replacement Intake Follow-up

- Replaced the six corrected batch-02 source sheets under `assets/source/character-animation-master-sheets/approved`:
  - `15-erin.png`
  - `16-nazir.png`
  - `17-laila.png`
  - `19-seraphine.png`
  - `20-michaela.png`
  - `21-lucian.png`
- Archived the previous blurred / mismatched approvals under `assets/source/character-animation-master-sheets/legacy-replaced`.
- Re-ran `python scripts/audit-character-frame-sheets.py`:
  - `15-erin.png`, `17-laila.png`, `19-seraphine.png`, `20-michaela.png` now pass blur / row-structure checks,
  - `16-nazir.png` and `21-lucian.png` still report extra physical row groups in the source layout, but the source identity mismatch is resolved.
- Re-generated runtime strips only to measure slicing quality, then kept the runtime safety fallback in place.
- Current QA decision:
  - source replacement: `pass`
  - runtime character strip activation: `fail`
  - gameplay / Animation Viewer should continue using atlas fallback for characters until per-clip slicing is re-approved.

## 2026-04-05 Runtime Enemy Safety Fallback

- Performed a direct runtime strip spot-check on generated enemy clips and confirmed the current enemy extraction is also not production-safe:
  - sample strips such as `morgan/idle`, `thorn_wolf/idle`, and `mist_raider/idle` contain label-card or title-text fragments instead of clean sprite frames.
- Applied the same loader-stage safety fallback used for characters:
  - runtime `enemy` clips are now skipped at load time,
  - battle and Animation Viewer should fall back to the stable atlas path for enemy playback until enemy slicing QA passes.
- Current runtime activation status:
  - `character`: disabled
  - `enemy`: disabled
  - `effect`: enabled

## 2026-04-05 Runtime Character Reactivation

- Re-enabled loader-stage runtime `character` clips after the six replacement frame sheets were accepted and the live runtime path was verified again.
- Added an Animation Viewer runtime refresh guard so the source-strip panel and runtime metadata update automatically when the async runtime manifest finishes loading.
- Live preview verification against the production build confirmed:
  - Animation Viewer: `rtanim:character:hero:idle`
  - Animation Viewer: `rtanim:character:lucian:idle`
  - Village: `rtanim:character:hero:town_idle`
  - Battle: `rtanim:character:hero:run`
- Current runtime activation status:
  - `character`: enabled
  - `enemy`: disabled
  - `effect`: enabled
- Remaining caveat:
  - character playback is now on the real runtime path for visual QA, but some strips still need per-character slicing polish before final commercial sign-off.

## 2026-04-05 Character Strip Re-QA Follow-up

- Reworked both character strip generators to reduce label-scrap and edge-fragment intake:
  - `generate-runtime-character-clips.py`
  - `generate-runtime-extended-clips.py`
- Added stronger frame-component filtering, active-span splitting, interval sanity checks, and tighter batch-02 paired-region bounds.
- Re-generated the runtime character set several times and restored the full runtime manifest afterward.
- QA result is still `partial fail`:
  - several batch-02 `idle` / `town_idle` strips improved,
  - but `talk`, `down_or_death`, and multiple right-side attack rows still show merged or missing frames,
  - current remaining issues appear to come from the source row exports as well as the slicer.

## 2026-04-05 Kain Manual Slice Pilot

- Scope:
  - limited the rework to `hero / Kain` first, as a pilot for per-character manual slicing.
- Change:
  - added `hero`-specific manual row bands and component-based crops in `generate-runtime-character-clips.py`,
  - stopped relying on the shared auto interval slicer for Kain.
- QA result:
  - `idle` now renders as stable full-body frames in the runtime strip and in the Animation Viewer preview build,
  - `walk`, `run`, `attack_basic_01`, `attack_basic_02`, `hit_react`, `guard_or_block`, `talk`, `victory`, and `down_or_death` also improved to stable full-body extraction,
  - `charge` was adjusted again to remove the effect-only split frame.
- Residual caveat:
  - Kain is improved but not fully sign-off ready yet.
  - `skill_cast`, `dash_or_dodge`, and possibly `attack_basic_03` still need one more visual polish pass if the target is fully commercial animation quality rather than just non-broken runtime playback.
- Evidence:
  - `output/qa/hero-review-updated/hero-full-review-sheet-updated.png`
  - `output/animation-viewer/animation_viewer_kain_idle_preview_after_manual.png`

## 2026-04-05 Character-Wide Cleanup Pass 01

- Applied the Kain follow-up cleanup pattern to the shared character runtime path:
  - ground-highlight removal under the feet
  - tiny detached alpha scrap removal
  - component-based extraction helper for body-dominant actions
- Spot-check result:
  - Kain and several batch-01 body-dominant actions improved,
  - but batch-02 paired sheets still show subject-specific layout variance,
  - and enemy sheets still capture title/label regions under the current generic bounds.
- QA conclusion:
  - character-first direction is correct,
  - but a full `all characters + all enemies + all effects` cleanup cannot be safely signed off with one generic rule.
  - Remaining work should continue as per-subject calibration, starting with the remaining character sheets.

## 2026-04-06 Character Strip Rework Pass 02

- Reworked both runtime character slicers again around character-only analysis masks:
  - `generate-runtime-character-clips.py`
  - `generate-runtime-extended-clips.py`
- Key changes in this pass:
  - beige presentation-board / panel-outline suppression before character crop analysis
  - sprite-focused analysis mask so bounds follow the actual sprite silhouette instead of the full source-board alpha
  - character clip frame-count recovery when only a smaller clean pose subset is available
  - per-clip anchor stabilization for runtime character strips
- Verified improvement:
  - `sera` idle / walk were previously collapsing into scrap-line strips
  - after the pass, they regenerate as stable `6f / 8f` runtime strips and are usable again in the viewer/runtime path
- Follow-up verification:
  - `python scripts/generate-runtime-character-clips.py`: passed
  - `python scripts/generate-runtime-extended-clips.py`: passed
  - `npm run typecheck`: passed
  - `npm run build`: passed
  - `npm run capture:viewer`: passed
- QA status:
  - `character`: still `partial fail`
  - reason: several subjects still need per-subject calibration on specific clips even after the mask/anchor improvements
- Current character-first blockers:
  - `erin`: `victory`
  - `hakan`: `walk`, `down_or_death`
  - `iris`: `attack_basic_01`, `down_or_death`
  - `kiera`: `charge`, `dash_or_dodge`, `skill_cast`
  - `lucian`: `attack_basic_01`, `walk`, `victory`
  - `luna`: `buff_cast`, `pray_idle`
- `serena`: `down_or_death`, `hit_react`
- `theo`: `dash_or_dodge`
- Enemy / effect QA should stay behind the remaining character slice pass.

## 2026-04-06 Character Strip Rework Pass 03

- Added a third character-only extraction pass focused on reducing the last structural runtime breakages.
- New extraction changes:
  - showcase-outlier suppression for rows that mixed strip poses with oversized showcase figures
  - broader component-driven extraction coverage for dash / charge / cast / buff / pray class actions
  - alpha-driven analysis path for low-saturation motion/effect clips that were being dropped by the color-threshold mask
  - clip-specific manual region overrides for:
    - `helma / dash_or_dodge`
    - `sera / cast_loop`
    - `seraphin / hit_react`
- Follow-up verification:
  - `python scripts/generate-runtime-character-clips.py`: passed
  - `python scripts/generate-runtime-extended-clips.py`: passed
  - `npm run typecheck`: passed
  - `npm run build`: passed
  - `npm run capture:viewer`: passed
- Updated QA decision:
  - `character runtime severe fail`: cleared
  - current character runtime status is now `moderate polish remaining`
- Remaining moderate-polish clips:
  - `erin`: `attack_basic_01`, `cast_start`
  - `fin`: `down_or_death`
  - `hakan`: `taunt_or_command`, `victory`, `walk`
  - `hero`: `charge`
  - `iris`: `attack_basic_01`, `charge`
  - `laila`: `attack_basic_02`, `dash_or_dodge`, `summon_or_rune`, `victory`
  - `lucian`: `attack_basic_01`, `down_or_death`, `victory`
  - `marin`: `skill_cast`
  - `micaela`: `down_or_death`, `run`, `victory`, `walk`
  - `nazir`: `skill_cast`
  - `ria`: `attack_basic_02`
  - `sera`: `cast_loop`
  - `seraphin`: `down_or_death`, `victory`
  - `serena`: `down_or_death`, `hit_react`
  - `wolf`: `victory`
- Recommendation:
  - keep character QA in viewer-first polish mode
  - resume enemy runtime cleanup only after the remaining character polish pass

## 2026-04-06 Character Strip Rework Pass 04

- Reworked `generate-runtime-extended-clips.py` again around the export structure that is actually present in the batch-02 sheets.
- Main changes:
  - widened paired-sheet left/right crop bounds so first and last poses are no longer clipped as aggressively
  - added bottom index-label center detection for rows that export `01 / 02 / 03 ...` markers under the frames
  - used those index centers as the primary split guide before falling back to generic interval or equal-cell slicing
  - added a lightweight outlier repair pass so obvious black bar / panel scraps are replaced by the nearest valid runtime pose
- Full regeneration rerun:
  - `python scripts/generate-runtime-character-clips.py`: passed
  - `python scripts/generate-runtime-extended-clips.py`: passed
  - `npm run build`: passed
- Live runtime viewer spot-checks passed for these samples:
  - `erin / dash_or_dodge`
  - `laila / run`
  - `lucian / run`
  - `nazir / run`
  - `seraphin / dash_or_dodge`
  - `micaela / walk`
- Evidence:
  - `output/animation-viewer/character-spot-checks/character_erin_dash_or_dodge_canvas.png`
  - `output/animation-viewer/character-spot-checks/character_laila_run_canvas.png`
  - `output/animation-viewer/character-spot-checks/character_lucian_run_canvas.png`
  - `output/animation-viewer/character-spot-checks/character_nazir_run_canvas.png`
  - `output/animation-viewer/character-spot-checks/character_seraphin_dash_or_dodge_canvas.png`
  - `output/animation-viewer/character-spot-checks/character_micaela_walk_canvas.png`
- Updated QA decision:
  - `character`: still `partial pass / polish remaining`
  - the failure mode has shifted from broad half-frame breakage to smaller terminal-edge scraps on a limited set of clips
- Current remaining character hotspots after this pass:
  - `erin`: `victory`, `run`, `summon_or_rune`
  - `laila`: `walk`, `summon_or_rune`
  - `lucian`: `stealth_entry`, `victory`
  - `micaela`: `idle`, `heal_cast`, `skill_cast`
  - `nazir`: `skill_cast`, `victory`
  - `seraphin`: `heavy_attack`, `heal_cast`
- Enemy follow-up spot-check after the same regeneration still fails:
  - `thorn_wolf`, `morgan`, and `fallen_holy_knight` strips still capture title-card / label fragments
  - runtime `enemy` loading should stay disabled until enemy-specific slicing rules are added

## 2026-04-07 Town Rework QA Pass

- Scope:
  - walkable village exterior
  - shop entry flow
  - interior merchant flow
  - world gate return flow
  - ambient NPC greeting flow
- Automation:
  - `npm run test:smoke`: passed
  - `npm run test:town`: passed
- Scene-state QA evidence:
  - `output/town-dev-preview/manual-checks/shop-flow.json`
  - `output/town-dev-preview/manual-checks/gate-flow.json`
  - `output/town-dev-preview/manual-checks/npc-flow.json`
- Screenshot evidence:
  - `output/town-dev-preview/manual-checks/shop-flow.png`
  - `output/town-dev-preview/manual-checks/gate-flow.png`
  - `output/town-dev-preview/manual-checks/npc-flow.png`
- Findings fixed during this pass:
  - widened gate interaction radius and made the gate lane read more clearly
  - increased ambient NPC interaction radius for easier talk detection
  - pinned the interior HUD to the camera so header buttons do not drift
  - split local shop offers by shop type so the town hub no longer feels functionally duplicated
- QA decision:
  - placeholder town gameplay flow: `PASS`
  - final art polish: `PENDING`
- Residual risks:
  - final pixel town tiles, interiors, NPC sprites, and marker FX are still pending
  - headless browser input does not reliably trigger Phaser `Space` in this environment, so deterministic scene-start/state validation is used for automation while smoke covers the live runtime loop

## 2026-04-07 Frame Intake Refresh QA Note

- Intake source:
  - refreshed sheets from `CHARACTER_ENEMY_ANIMATION_FRAME_READY_TO_COPY_PROMPTS`
  - refreshed repair sheets from `CHARACTER_FRAME_SHEET_REGEN_READY_TO_COPY_PROMPTS`
- Applied result:
  - character approved source set refreshed
  - enemy approved source set refreshed
  - runtime character and enemy strips regenerated
- Verification:
  - `python scripts/audit-character-frame-sheets.py`: passed as a reporting step and rewrote `output/qa/character-frame-sheet-audit.json`
  - `python scripts/generate-runtime-character-clips.py`: passed after adding safe fallback behavior for stale manual-box rules
  - `python scripts/generate-runtime-extended-clips.py`: passed after the same fallback behavior was added for region-manual overrides
  - `npm run capture:viewer`: passed
  - `npx vite build --outDir dist-frame-intake`: passed
- QA note:
  - the character audit still flags many sheets as `blocked_row_structure`, which is a source-layout warning rather than a runtime generation blocker for this batch
  - the slicers now recover by falling back to component/auto extraction when the older hard-coded manual regions no longer match the refreshed exports

## 2026-04-07 Town Pixel Runtime Art Refresh

- Applied the approved `pixel-town-rework` batch to the live town scenes.
- Runtime art now covers:
  - gate arch and fountain landmark art
  - weapon / armor / forge / relic building exteriors
  - weapon / item / relic / blacksmith merchant portraits in interiors
  - guard / villager / traveler / child ambient NPC art
  - lamp post / bench / planter / crate / board town props
  - shop entrance, world gate, and interior exit marker FX
  - decorative shop UI board art
- Rendering polish added during the same pass:
  - y-sorted sprite depth for the player, ambient NPCs, props, buildings, landmarks, and entrance FX
  - richer town prop placement in the plaza, road edges, and shop fronts
  - per-shop interior prop dressing
- Verification:
  - `python scripts/generate-town-runtime-assets.py`: passed
  - `npm run typecheck`: passed
  - `npm run test`: 50 tests passed
  - `npm run test:town`: passed
  - `npx vite build --outDir dist-town-art-refresh`: passed
- Remaining art gaps:
  - outdoor ground tile set is still unusable and the town floor stays on placeholder grass / stone tiling
  - item shop exterior and armor merchant sprite are still on fallback visuals
  - fountain water animation source is approved but not yet safe enough for runtime strip use

## 2026-04-08 Animation Runtime Refresh QA

- Scope:
  - reopen runtime strip QA for `character`, `enemy`, and new `npc` viewer coverage
  - confirm Animation Viewer exposes all four categories: `character`, `enemy`, `npc`, `effect`
- Changes under test:
  - enabled runtime enemy clips in the shared manifest loader
  - added runtime NPC clip generation and manifest merge
  - switched extended character/enemy regeneration toward component-first extraction
  - expanded `AnimationViewerScene` with an `npc` category
- Evidence:
  - `output/animation-viewer/animation_viewer_character_state.json`
  - `output/animation-viewer/animation_viewer_enemy_state.json`
  - `output/animation-viewer/animation_viewer_npc_state.json`
  - `output/animation-viewer/animation_viewer_effect_state.json`
  - `public/assets/runtime/animation-manifest.json`
- Verification:
  - `npm run typecheck`: pass
  - `npm run test`: pass (`51` tests)
  - `npm run capture:viewer`: pass
  - `npx vite build --outDir dist-animation-runtime-refresh`: pass
- QA result:
  - runtime manifest / viewer category wiring: `PASS`
  - merchant NPC strips: `PASS`
  - ambient NPC static-pose viewer strips: `PASS`
  - extended character / enemy strip quality: `PARTIAL`
- Remaining polish targets:
  - `nazir` runtime strips still contain presentation fragments in some clips
  - `seraphin` runtime strips still contain presentation fragments in some clips
  - `fallen_holy_knight` and some other enemy strips still need per-subject manual crop polish
  - headless viewer screenshots still show missing-atlas placeholder diagonals, so screenshot artifacts should not be treated as gameplay-strip truth without a live browser cross-check

## 2026-04-08 Animation Runtime Refresh QA Pass 02

- Scope:
  - continue strip QA for `character`, `enemy`, `npc`
  - reduce label/panel bleed in manual-box and uniform-cell paths
- Changes under test:
  - added stricter row-label bounds and background stripping to `scripts/generate-runtime-extended-clips.py`
  - added merchant-specific source-box extraction to `scripts/generate-runtime-npc-clips.py`
  - split `hero` back to the earlier raw-alpha manual source-box path in `scripts/generate-runtime-character-clips.py`
- Verification:
  - `python scripts/generate-runtime-character-clips.py`: pass
  - `python scripts/generate-runtime-extended-clips.py`: pass
  - `python scripts/generate-runtime-npc-clips.py`: pass
  - `npm run typecheck`: pass
  - `npm run test`: pass (`51` tests)
  - `npm run capture:viewer`: pass
- QA result:
  - viewer category wiring for `character / enemy / npc / effect`: `PASS`
  - enemy idle strip baseline: `IMPROVED`
  - merchant NPC turn strip baseline: `IMPROVED`
  - full art-QA completion across all runtime clips: `PARTIAL`
- Remaining issues:
  - `hero idle` still shows source-box edge bleed in the runtime strip
  - `nazir idle` and `seraphin idle` still show label/panel fragments and need tighter per-frame source boxes
  - `morgan / slam_burst` and several other heavy-effect enemy actions still need manual crop specs if they are to be approved
  - NPC `turn_short_rotation` is no longer collapsed, but some frames still contain top-edge text remnants

## 2026-04-08 Animation Runtime Refresh QA Pass 03

- Scope:
  - recheck transparency cleanup and per-frame body completeness on base character strips
  - recheck merchant NPC rotation after row-bound reduction
- Changes under test:
  - removed bright neutral checkerboard remnants in `scripts/generate-runtime-character-clips.py`
  - strengthened edge-scrap cleanup and fragmented-frame replacement in `scripts/generate-runtime-character-clips.py`
  - changed base/NPC strip scaling to `NEAREST`
  - reduced merchant `turn_short_rotation` sampling region in `scripts/generate-runtime-npc-clips.py`
- Verification:
  - `python scripts/generate-runtime-character-clips.py`: pass
  - `python scripts/generate-runtime-npc-clips.py`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass
- Evidence:
  - `output/animation-viewer/animation_viewer_character_canvas.png`
  - `output/animation-viewer/animation_viewer_npc_canvas.png`
  - `output/qa/runtime-strip-composites/hero_idle_current_finalcheck.png`
  - `output/qa/runtime-strip-composites/hero_walk_current_finalcheck.png`
  - `output/qa/runtime-strip-composites/hero_run_current_finalcheck.png`
  - `output/qa/runtime-strip-composites/merchant_turn_after.png`
- QA result:
  - neutral background cleanup on base character strips: `IMPROVED`
  - merchant NPC rotation strip: `PASS`
  - `hero idle`: `PARTIAL`
  - `hero walk`: `FAIL`
  - `hero run`: `FAIL`
- Remaining issues:
  - `hero idle` still has side-fragment bleed in some frames even after checkerboard cleanup
  - `hero walk` / `hero run` still show overlapping-source fragments from the current Kain sheet and need clip-specific source windows rather than generic boxes
  - `nazir idle`, `seraphin idle`, and enemy heavy-effect clips remain open from the prior pass

## 2026-04-09 Kain Runtime QA Pass 01

- Scope:
  - isolate Kain first and recheck frame completeness, internal transparency holes, and checkerboard residue clip by clip
- Changes under test:
  - switched Kain stable clips to row-interval extraction
  - changed Kain unstable clips to safe full-body proxy strips
  - changed neutral background cleanup so it only removes border-connected background pixels
  - added tiny enclosed alpha-hole fill
- Verification:
  - `python scripts/generate-runtime-character-clips.py`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass
- Evidence:
  - `output/animation-viewer/animation_viewer_character_canvas.png`
  - `output/qa/hero-current-review/hero_current_contact_sheet_v2.png`
  - `output/qa/hero-current-review/walk_beige_latest.png`
  - `output/qa/hero-current-review/run_beige_latest.png`
- QA result:
  - `Kain idle`: `PASS`
  - `Kain walk`: `PASS`
  - `Kain run`: `PASS_WITH_MINOR_POLISH`
  - `Kain attack_basic_01`: `PASS`
  - `Kain attack_basic_02`: `PASS`
  - `Kain attack_basic_03`: `PASS`
  - `Kain proxy clips`: `PASS_FOR_USABILITY`
- Remaining issues:
  - Kain `run` still has minor top fringe in a few frames, but it is no longer a broken strip
  - Kain proxy clips are stable, but they are still proxy motions and not final source-accurate animation
  - next open character QA target remains `nazir`

## 2026-04-09 Runtime Character Watchdog QA Pass 02

- Scope:
  - add a repeatable runtime-strip watchdog so character QA no longer depends on ad hoc manual spot checks only
  - re-baseline `Kain` after the hybrid extraction pass
  - begin the next subject pass on `Nazir`
- Changes under test:
  - added `scripts/audit-runtime-character-clips.py`
  - added `npm run audit:runtime:characters`
  - changed `Kain` to a hybrid extraction policy:
    - interval: `idle`, `walk`, `attack_basic_01`
    - exact box: `run`, `attack_basic_03`, `down_or_death`
    - interval-derived / repaired: `attack_basic_02`, `skill_cast`, `charge`
  - added `Nazir` manual boxes + proxy routing in `scripts/generate-runtime-extended-clips.py`
- Verification:
  - `python scripts/generate-runtime-character-clips.py`: pass
  - `python scripts/audit-runtime-character-clips.py --subject hero --subject nazir`: pass
  - `python scripts/audit-runtime-character-clips.py`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass
- Evidence:
  - `output/qa/runtime-character-quality-report.json`
  - `output/qa/runtime-character-quality-report.md`
  - `output/animation-viewer/animation_viewer_character_canvas.png`
  - `output/animation-viewer/animation_viewer_character_state.json`
- QA result:
  - runtime character watchdog infrastructure: `PASS`
  - `Kain`: `PARTIAL PASS`
    - watchdog summary: `11 pass / 3 caution / 1 fail`
    - only open fail is `down_or_death`, and that is currently a `prone-pose size` issue rather than a body-split failure
  - `Nazir`: `CAUTION`
    - first pass removed the hard `FAIL` state and moved the subject to all `pass/caution`
    - remaining issues are mostly `undersized / jitter / proxy-quality`, not catastrophic split-body failures
  - full roster runtime baseline: `PARTIAL`
    - watchdog summary: `21 subjects`
    - `6 caution`
    - `15 fail`
- Remaining issues:
  - `Kain` still needs one more polish pass on `down_or_death`, plus optional cleanup on `walk` / `hit_react` micro-artifacts
  - `Nazir` still needs source-accurate replacements for `attack_basic_03`, `skill_cast`, `stealth_entry`, `dash_or_dodge`, and `victory`
  - most of the remaining roster is now cleanly measurable, but still below sign-off until the watchdog counts come down subject by subject

## 2026-04-09 Town Building Alpha + Auto Entry QA

- Scope:
  - clean up broken town building transparency on approved exterior assets
  - remove `Space` dependency from exterior shop entry
  - keep NPC talk and world gate exit on explicit interaction input
- Changes under test:
  - `scripts/generate-town-runtime-assets.py`
  - `src/game/scenes/VillageLobbyScene.ts`
  - `scripts/run-town-manual-checks.mjs`
- Verification:
  - `python scripts/generate-town-runtime-assets.py`: pass
  - `npm run typecheck`: pass
  - `npm run test`: pass
  - `npm run test:town`: pass
  - `npm run test:smoke`: pass
  - `npx vite build --outDir dist-town-building-fix`: pass
- Evidence:
  - `output/town-dev-preview/manual-checks/shop-flow.json`
  - `output/town-dev-preview/manual-checks/shop-flow.png`
  - `public/assets/world/town/buildings/weapon_shop.png`
  - `public/assets/world/town/buildings/armor_shop.png`
- QA result:
  - `weapon_shop` exterior: `PASS`
    - bright neutral checkerboard edge residue removed from runtime output
  - `armor_shop` exterior: `PASS`
    - doorway and wall art no longer carry the earlier opaque checkerboard field
  - shop entry flow: `PASS`
    - approaching from outside the door now transitions into `town-interior` automatically
    - returning from a shop no longer immediately re-enters on the same frame
- Remaining issues:
  - forge and relic exterior crops still use the older edge-cleanup path and may need a later art-specific polish pass if visual QA flags them
  - item shop exterior and armor merchant final art are still pending source replacement

## 2026-04-09 Character Package-Sheet Runtime Source QA

- Scope:
  - test whether `assets/source/character-package-sheets/approved` can replace the current character runtime source
  - prioritize `Kain` because the user reported these package sheets had the best source framing
- Changes under test:
  - `scripts/generate-runtime-character-clips.py`
- Verification:
  - `python scripts/generate-runtime-character-clips.py`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass
- Evidence:
  - `output/qa/hero-package-grid.png`
  - `output/qa/hero-package-check-v3/idle.png`
  - `output/animation-viewer/animation_viewer_character_canvas.png`
- QA result:
  - package-sheet direct extraction for `Kain`: `FAIL`
    - source presentation layout is visually nicer than the current master sheet
    - but the runtime strip still suffers from label bleed, neighboring-pose contamination, and incomplete body capture when used directly as a source sheet
  - staged package-sheet helpers: `KEEP`
    - manual box data is preserved in code for future subject-by-subject curation
  - active runtime source switch: `REJECTED FOR NOW`
    - viewer QA regressed compared with the current approved runtime output
- Remaining issues:
  - if package sheets are to become the real runtime source, each subject needs its own curated manual source-box table
  - `Kain idle / walk / run` must pass first before the same path is expanded to the rest of the roster

## 2026-04-10 Hero-Only Animation Viewer Runtime Gate

- Scope:
  - apply only the protagonist runtime strips first
  - hold the rest of the roster on fallback until they are individually approved
- Changes under test:
  - `src/game/data/runtimeAnimationAssets.ts`
- Verification:
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass
- Evidence:
  - `output/animation-viewer/animation_viewer_character_canvas.png`
  - `output/animation-viewer/animation_viewer_character_state.json`
  - `output/qa/hero-current-contact-2026-04-10.png`
- QA result:
  - `hero` runtime in animation viewer: `PASS`
    - current `Kain` strip set is usable and visible in the viewer
  - non-hero runtime character clips: `SKIPPED BY DESIGN`
    - they now fall back intentionally until their own QA pass is complete

## 2026-04-10 Kain Action Micro-Polish Pass 01

- Scope:
  - reduce the most obvious action mismatches in `Animation Viewer -> Character -> Kain`
  - replace the worst slash-heavy proxies with calmer source-accurate or lower-risk alternatives
- Changes under test:
  - `scripts/generate-runtime-character-clips.py`
- Verification:
  - `python scripts/generate-runtime-character-clips.py`: pass
  - `npm run capture:viewer`: pass
  - `npm run typecheck`: pass
- Evidence:
  - `output/qa/hero-current-review/hero_current_contact_sheet_latest.png`
  - `public/assets/runtime/characters/hero/talk.png`
  - `public/assets/runtime/characters/hero/victory.png`
  - `public/assets/runtime/characters/hero/charge.png`
- QA result:
  - `charge`: `PASS`
    - no longer opens with the earlier slash-heavy proxy
  - `town_idle`: `PASS`
    - now reads as a calmer in-town stance instead of plain idle duplication
  - `guard_or_block`: `PASS`
    - now uses the guard row rather than a straight idle reuse
  - `talk`: `PASS`
    - switched to curated lower-panel talk poses and removed the earlier idle mismatch
  - `victory`: `PASS WITH PROXY`
    - slash-heavy mismatch removed
    - currently uses the curated talk motion as a safer placeholder until a clean victory row is available
  - `skill_cast`: `PASS WITH PROXY`
    - calmer than the earlier slash proxy, but still not source-accurate casting
- Remaining issues:
  - `run`, `attack_basic_03`, and `down_or_death` still need another protagonist-only polish pass
  - `victory` and `skill_cast` are usable in the viewer but still proxy-based rather than fully source-authentic

## 2026-04-10 Kain Package-Sheet Hybrid Source QA

- Scope:
  - stop relying on the newer poor-quality full-sheet batch for every protagonist action
  - reintroduce the approved package-sheet source only where it improves viewer quality
- Changes under test:
  - `scripts/generate-runtime-character-clips.py`
- Verification:
  - `python scripts/generate-runtime-character-clips.py`: pass
  - `npm run capture:viewer`: pass
  - `npm run typecheck`: pass
- Evidence:
  - `output/animation-viewer/animation_viewer_character_canvas.png`
  - `public/assets/runtime/characters/hero/idle.png`
  - `public/assets/runtime/characters/hero/walk.png`
  - `public/assets/runtime/characters/hero/talk.png`
  - `public/assets/runtime/characters/hero/victory.png`
- QA result:
  - active protagonist source policy: `PASS`
    - `Kain` no longer depends on the newest all-actions batch
    - viewer default idle is back to a readable full-body result
  - hybrid source split: `PASS`
    - movement and core combat remain on the stable master-sheet path
    - only `talk` and `victory` now use the approved package-sheet source
    - `guard_or_block`, `town_idle`, and `down_or_death` were moved back to the stable master-sheet path because package-derived grey panel residue stayed too visible
  - package-sheet-only full switch: `REJECTED`
    - `idle / walk / run` still degraded when forced entirely to the package source
- Remaining issues:
  - `guard_or_block` and `town_idle` still keep small top-edge label residue from the master-sheet extraction path
  - `talk` and `victory` are improved, but they still carry minor package-card residue that can be cleaned further in a later protagonist polish pass
  - the rest of the roster is still on fallback until each subject gets its own approval pass

## 2026-04-10 Kain Package-Sheet Single-Action QA

- Scope:
  - stop mixing multiple package-sheet actions during the current experiment
  - validate exactly one package-sheet-derived protagonist action first
- Changes under test:
  - `scripts/generate-runtime-character-clips.py`
  - `src/game/data/animationCatalog.ts`
- Verification:
  - `python scripts/generate-runtime-character-clips.py`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass
- Evidence:
  - `public/assets/runtime/characters/hero/talk.png`
  - `output/animation-viewer/animation_viewer_character_canvas.png`
  - `output/animation-viewer/animation_viewer_character_state.json`
- QA result:
  - single-action package-sheet trial: `PASS`
    - `Kain / talk` now comes from the approved package-sheet source
    - the animation viewer now opens directly on `Character -> Kain -> talk`
  - expansion to other actions: `ON HOLD`
    - no additional package-sheet action is approved from this pass

## 2026-04-10 Kain Package-Sheet Talk Cleanup QA

- Scope:
  - keep the active protagonist package-sheet scope on `Kain / talk` only
  - remove lower-body package shadow residue and the non-transparent bridge between the legs
  - reduce visible frame-size variance before final strip packing
- Changes under test:
  - `scripts/generate-runtime-character-clips.py`
- Verification:
  - `python scripts/generate-runtime-character-clips.py`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass
- Evidence:
  - `public/assets/runtime/characters/hero/talk.png`
  - `output/qa/hero-talk-runtime-frames-after.png`
  - `output/qa/hero-talk-frame-0-after.png`
  - `output/qa/hero-talk-frame-2-after.png`
  - `output/animation-viewer/animation_viewer_character_canvas.png`
- QA result:
  - package-sheet talk cleanup: `PASS`
    - the previous lower underline / floor-shadow residue is reduced
    - the leg gap now reads as transparent instead of a solid lower block on the active `talk` runtime strip
    - per-frame footprint normalization is now active before strip fitting
  - remaining caution:
    - this pass does not approve additional `Kain` actions yet
    - any expansion beyond `talk` still needs its own per-action QA pass

## 2026-04-10 Kain Package-Sheet Talk Centering QA

- Scope:
  - reduce visible forward/backward swing in the active `Kain / talk` package-sheet loop
  - enlarge the visible sprite by trimming dead transparent whitespace after package cleanup
- Changes under test:
  - `scripts/generate-runtime-character-clips.py`
- Verification:
  - `python scripts/generate-runtime-character-clips.py`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass
- Evidence:
  - `public/assets/runtime/characters/hero/talk.png`
  - `output/qa/hero-talk-frame-0-trimmed-pass.png`
  - `output/qa/hero-talk-frame-2-trimmed-pass.png`
  - `output/animation-viewer/animation_viewer_character_canvas.png`
- QA result:
  - `Kain / talk` centering: `PASS`
    - upper-body re-anchoring reduces the previous forward/backward swing
  - visible scale: `PASS`
    - trimming post-cleanup whitespace lets the sprite occupy more of the 64x64 runtime cell
  - current runtime frame bounds:
    - larger pose group: `39x55`
    - second pose group: `34x58`
  - remaining caution:
    - this pass still covers only the active `talk` clip
    - other protagonist actions remain outside this approval

## 2026-04-10 Kain Package-Sheet Talk Shoulder Recovery QA

- Scope:
  - recover the lost shoulder pixels on the active `Kain / talk` package-sheet runtime clip before any broader polish work
- Changes under test:
  - `scripts/generate-runtime-character-clips.py`
- Root cause:
  - package-frame lower-shadow cleanup started too high because the package extract still had tall transparent padding
  - the old lower-band threshold overlapped the shoulder zone, so neutral gray shoulder pixels were incorrectly erased
- Fix:
  - moved the lower cleanup band deeper into the true lower-leg / foot area
- Verification:
  - `python scripts/generate-runtime-character-clips.py`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass
- Evidence:
  - `output/qa/hero-talk-shoulder-granular/02_after_lower_cleanup.png`
  - `output/qa/hero-talk-shoulder-granular-fix/02_after_lower_cleanup.png`
  - `output/qa/hero-talk-runtime-current-0.png`
  - `output/qa/hero-talk-runtime-current-2.png`
  - `output/animation-viewer/animation_viewer_character_canvas.png`
- QA result:
  - shoulder recovery: `PASS`
    - the active `Kain / talk` runtime frames no longer lose the shoulder armor to transparency cleanup
  - problem diagnosis: `CONFIRMED`
    - the regression came from cleanup-zone scope, not from the original source crop itself
  - remaining caution:
    - this fix is intentionally limited to the active package-sheet `talk` path

## 2026-04-10 Kain Package-Sheet Talk Direct Source Recut QA

- Scope:
  - stop trying to salvage the active `Kain / talk` shoulder issue through the broader package cleanup stack
  - switch the active `talk` strip to a direct original-source recut path
- Decision:
  - recut from original source: `APPROVED`
  - broad package support cleanup on `talk`: `REJECTED`
- Why:
  - the broader cleanup path had already shown that it could erase neutral shoulder armor pixels
  - the direct source recut path is narrower and only removes bottom-edge shadow residue
- Changes under test:
  - `scripts/generate-runtime-character-clips.py`
- Verification:
  - `python scripts/generate-runtime-character-clips.py`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass
- Evidence:
  - `output/qa/hero-talk-direct-recrop-check/frame_0.png`
  - `output/qa/hero-talk-direct-recrop-check/frame_2.png`
  - `output/animation-viewer/animation_viewer_character_canvas.png`
- QA result:
  - direct source recut for active `Kain / talk`: `PASS`
  - shoulder preservation on the active runtime strip: `PASS`
  - remaining caution:
    - this approval is still limited to the active `talk` clip only

## 2026-04-11 Kain Talk Core-Anchor Stability QA

- Scope:
  - verify the user-reported horizontal shake on the active `hero / talk` runtime strip
- Problem found:
  - previous `talk` frames still used a flattened shared x anchor
  - the numeric anchor matched, but the visible body center did not
  - this produced left-right lurching in the loop
- Changes under test:
  - `scripts/generate-runtime-character-clips.py`
- New rule under test:
  - compute x anchor from the per-frame body-core silhouette band
  - keep x per-frame
  - lock only the shared foot baseline for y
- Verification:
  - hero-only runtime regeneration through `scripts/generate-runtime-character-clips.py`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass
  - `output/animation-viewer/animation_viewer_character_state.json`: `frameCount: 4`
- Evidence:
  - `output/qa/hero-talk-current-sheet-after-core-anchor.png`
  - `output/animation-viewer/animation_viewer_character_canvas.png`
- QA result:
  - `hero / talk` left-right center shake: `PASS`
  - current runtime bbox centers:
    - frame 0: `32.0`
    - frame 1: `32.0`
    - frame 2: `32.0`
    - frame 3: `32.0`
- remaining caution:
  - this sign-off is still limited to `Kain / talk`

## 2026-04-11 Kain Hero-Wide Action Polish QA

- Scope:
  - extend the current protagonist polish pass beyond `talk`
  - verify that hero runtime actions improve without reintroducing the earlier opaque leg-gap issue
- Changes under test:
  - `scripts/generate-runtime-character-clips.py`
- What changed:
  - hero-only cleanup helpers were added for:
    - internal hole repair
    - leg-gap opening
    - final runtime-strip gap cleanup
    - tiny detached-fragment removal
  - protagonist package-sheet source coverage was expanded for:
    - `attack_basic_02`
    - `skill_cast`
    - `charge`
    - `town_idle`
    - `talk`
- Verification:
  - hero-only runtime regeneration through `scripts/generate-runtime-character-clips.py`: pass
  - `python scripts/audit-runtime-character-clips.py --subject hero`: pass
  - `npm run capture:viewer`: pass
  - `npm run typecheck`: pass
- Evidence:
  - `output/qa/hero-talk-current-after-gap-fix-8x.png`
  - `output/animation-viewer/animation_viewer_character_canvas.png`
  - `output/animation-viewer/animation_viewer_character_state.json`
- QA result:
  - protagonist current watchdog status: `10 pass / 4 caution / 1 fail`
  - remaining caution clips:
    - `attack_basic_01`
    - `skill_cast`
    - `hit_react`
    - `down_or_death`
  - remaining fail clip:
    - `talk`
- QA note on `talk`:
  - the current watchdog still reports `internal_holes`
  - this is now primarily the intentionally opened leg-gap silhouette being treated as an enclosed hole by the heuristic

## 2026-04-11 Kain Completed-Clip Reaudit QA

- Scope:
  - re-check the protagonist clips that had already been treated as completed/applied
  - target only two symptoms:
    - leg-area opaque residue
    - foreign neighboring-frame scraps
- Reaudit target clips:
  - `talk`
  - `attack_basic_02`
  - `skill_cast`
  - `charge`
  - `town_idle`
- Additional QA support:
  - one independent explorer-agent audit was run in parallel and compared against the local findings
- Confirmed pre-fix issues:
  - `talk` frames `3`, `4`: lower-body opaque residue
  - `skill_cast` frame `8`: detached frame scrap
  - weaker tiny scrap residue in some `attack_basic_02` / `town_idle` frames
- Fix under test:
  - `scripts/generate-runtime-character-clips.py`
- Verification:
  - hero-only runtime regeneration through `scripts/generate-runtime-character-clips.py`: pass
  - `python scripts/audit-runtime-character-clips.py --subject hero`: pass
  - `npm run capture:viewer`: pass
  - `npm run typecheck`: pass
- Evidence:
  - `output/qa/hero-completed-reaudit/talk-final-8x.png`
  - `output/qa/hero-completed-reaudit/attack_basic_02-final-8x.png`
  - `output/qa/hero-completed-reaudit/skill_cast-final-8x.png`
  - `output/qa/hero-completed-reaudit/charge-final-8x.png`
  - `output/qa/hero-completed-reaudit/town_idle-final-8x.png`
- QA result:
  - `attack_basic_02`: frame-scrap symptom no longer reproduced in the re-audit
  - `skill_cast`: detached scrap symptom no longer reproduced in the re-audit
  - `town_idle`: weak tiny detached scrap symptom no longer reproduced in the re-audit
  - `charge`: the two target symptoms were not reproduced in this re-audit pass
  - `talk`: central lower-body residue was removed from the audited target band, but the general watchdog still reports `internal_holes` because it interprets the opened leg gap as a hole

## 2026-04-11 Kain talk / skill_cast Follow-up QA

- Scope:
  - re-open only the two clips the user still saw as broken:
    - `talk`
    - `skill_cast`
- User-visible target symptoms:
  - lower-leg transparency residue or over-open slit
  - right-side neighboring-frame contamination
- Fix under test:
  - `scripts/generate-runtime-character-clips.py`
- Added verification method:
  - local checkerboard 8x strip inspection
  - one extra independent explorer-agent read-only audit after regeneration
- Observed result after this pass:
  - `skill_cast`:
    - right-side neighboring-pose contamination was reduced substantially
    - the last effect-heavy frame was replaced by a cleaned duplicate rush pose
    - lower-body gray fill / floor-line residue is reduced but not fully eliminated
  - `talk`:
    - the stronger slit-forcing variants looked worse in live checker review
    - the current accepted variant keeps only a lighter cleanup pass
    - QA still considers the lower-leg silhouette unresolved for sign-off
- Independent audit summary:
  - `talk` frames `1-2`: small right-end residue still visible
  - `talk` frames `3-4`: lower slit remains visually problematic
  - `skill_cast` frames `2-5`: small right or lower residues still remain, but the major right-edge contamination is no longer dominant
- Verification:
  - hero-only runtime regeneration through `scripts/generate-runtime-character-clips.py`: pass
  - `python scripts/audit-runtime-character-clips.py --subject hero`: pass
  - `npm run capture:viewer`: pass
  - `npm run typecheck`: pass
- Evidence:
  - `output/qa/post-patch-audit-03/talk-checker-8x.png`
  - `output/qa/post-patch-audit-03/skill_cast-checker-8x.png`
  - `output/animation-viewer/animation_viewer_character_canvas.png`
- QA decision:
  - `skill_cast`: improved enough to continue iterative cleanup from the current base
  - `talk`: still `fail` for final-quality sign-off; the current approved package pose is the remaining blocker

## 2026-04-11 Kain Full-Action Path QA

- Scope:
  - apply the current Kain package-based cutting path to all Kain actions, not only the previously targeted subset
- Process rule update:
  - internal image-cut review loop target is now `10` passes before user-facing feedback
- Change under test:
  - `scripts/generate-runtime-character-clips.py`
  - `HERO_PACKAGE_OVERRIDE_CLIP_IDS` expanded to all Kain actions
- Verification:
  - hero-only runtime regeneration through `scripts/generate-runtime-character-clips.py`: pass
  - `python scripts/audit-runtime-character-clips.py --subject hero`: pass
  - `npm run capture:viewer`: pass
  - `npm run typecheck`: pass
- Evidence:
  - `output/qa/hero-all-actions/hero-kain-actions-firstframe.png`
- QA note:
  - path consistency is improved because all Kain clips now use the same package extraction route
  - this is not a final art sign-off; clip-specific residue and contour cleanup still remains on several actions under the unified path

## 2026-04-11 Kain Frame-by-Frame QA Pivot

- Scope:
  - replace broad heuristic cleanup with a frame-by-frame review workflow
  - treat missing head / over-erased silhouette / leftover background as blockers, not minor polish
- Change under test:
  - `scripts/generate-runtime-character-clips.py`
  - `scripts/export-hero-frame-review.py`
- New extraction rule:
  - package crop is widened first
  - then the system prefers the component nearest the intended pose center
  - border-connected background-color pixels are stripped before later cleanup steps
- QA outcome in this pass:
  - the new extraction helpers are useful enough to keep
  - but broad `all Kain package path` activation is still rejected because `idle` / `run` style loops remained visibly broken
  - review should proceed action by action from the exported frame sheets
- Review evidence:
  - `output/qa/hero-frame-review/idle-all-frames.png`
  - `output/qa/hero-frame-review/walk-all-frames.png`
  - `output/qa/hero-frame-review/run-all-frames.png`
  - `output/qa/hero-frame-review/attack_basic_01-all-frames.png`
  - `output/qa/hero-frame-review/skill_cast-all-frames.png`
  - `output/qa/hero-frame-review/talk-all-frames.png`
- Current QA decision:
  - keep the new extraction method
  - reject one-shot rollout
  - continue with per-action frame remediation

## 2026-04-11 Kain Approved Package-Sheet Refresh Follow-up

- Scope:
  - refresh Kain runtime clips so the hero action set is sourced from `assets/source/character-package-sheets/approved`
- Change under test:
  - `scripts/generate-runtime-character-clips.py`
- Extraction update in this pass:
  - widened package grabs were removed from the hero package route
  - hero package clips now use exact source-box extraction
  - `idle`, `walk`, and `attack_basic_02` source boxes were recalibrated
  - `talk` stayed on the dedicated talk-package extraction path
- Verification:
  - hero-only runtime regeneration through `scripts/generate-runtime-character-clips.py`: pass
  - `python scripts/export-hero-frame-review.py`: pass
  - `python scripts/audit-runtime-character-clips.py --subject hero`: pass
  - `npm run capture:viewer`: pass
  - `npm run typecheck`: pass
- Review evidence:
  - `output/qa/hero-frame-review/idle-all-frames.png`
  - `output/qa/hero-frame-review/walk-all-frames.png`
  - `output/qa/hero-frame-review/attack_basic_02-all-frames.png`
  - `output/animation-viewer/animation_viewer_character_canvas.png`
- Current QA decision:
  - source-route migration: accepted
  - final animation sign-off: still not accepted
  - remaining work is now clip-level cleanup, not source routing

## 2026-04-11 Kain Runtime Integrity Restore

- Scope:
  - re-check the currently generated `Kain` runtime frames per action
  - treat over-erased body parts and leftover row contamination as blockers
- Change under test:
  - `scripts/generate-runtime-character-clips.py`
- Recovery route added:
  - `hero / Kain` now prefers the preserved local master sheet at
    `assets/source/character-animation-master-sheets/legacy-replaced/2026-04-07-source-refresh/01-kain.png`
  - hero rows are sliced from tighter label-box bands to avoid pulling in the next action row
- QA outcome in this pass:
  - `idle`, `walk`, `run`, `attack_basic_01`, `attack_basic_02`, `skill_cast`, `dash_or_dodge`, `guard_or_block`, `charge`, `town_idle`, `talk`, and `victory` all recovered to visually stable full-body playback
  - major failures from the package-only recut, including missing heads / split-next-row contamination, are no longer the dominant issue
  - `attack_basic_03` and `down_or_death` still need polish if we want final sign-off, but they are no longer catastrophically broken
- Verification:
  - `python scripts/generate-runtime-character-clips.py`: pass
  - `python scripts/export-hero-frame-review.py`: pass
  - `python scripts/audit-runtime-character-clips.py --subject hero`: pass
  - `npm run capture:viewer`: pass
  - `npm run typecheck`: pass
- Review evidence:
  - `output/qa/hero-frame-review/idle-all-frames.png`
  - `output/qa/hero-frame-review/run-all-frames.png`
  - `output/qa/hero-frame-review/talk-all-frames.png`
  - `output/qa/hero-frame-review/charge-all-frames.png`
  - `output/qa/hero-frame-review/victory-all-frames.png`
  - `output/qa/hero-runtime-contact-current.png`
  - `output/animation-viewer/animation_viewer_character_canvas.png`
- Current QA decision:
  - the previous `package-only Kain recut` path stays rejected
  - the `legacy master tight-row recovery` path is accepted as the current working baseline
  - final sign-off is still pending one more polish pass on the remaining weaker rows

## 2026-04-11 Kain Idle Recheck + Full Companion Regeneration

- Scope:
  - verify whether `hero / idle` still clips the legs
  - remove tiny remaining white matte specks where possible without damaging the silhouette
  - regenerate the full companion roster through the same legacy-refresh source preference
- Change under test:
  - `scripts/generate-runtime-character-clips.py`
- Extraction and cleanup update:
  - `LEGACY_SOURCE_REFRESH_FILES` now covers the full playable roster, not only the early party block
  - `SubjectSpec` entries were added for the later companions so they are actually regenerated instead of reusing stale outputs
  - `cleanup_runtime_white_edge_specks_frame()` was added after bright-residue cleanup to remove only tiny `1~2px` near-white edge specks
- QA findings:
  - `hero / idle` leg clipping did not reproduce; all frames remain within the runtime cell with a visible bottom margin
  - `hero / idle`, `talk`, and `skill_cast` no longer trip the tiny white-edge speck scan in the current pass
  - `hero / attack_basic_01` still has a few single-pixel bright leftovers, but it is no longer in the earlier multi-fragment state
  - the later companions are now generated through the same runtime path, but many still fail or caution because row extraction quality is not yet tuned per character
- QA snapshot:
  - `hero`: `11 pass / 4 caution / 0 fail`
  - stronger regenerated companions: `fin`
  - regenerated but still caution-heavy: `bram`, `sera`, `ria`, `theo`, `dorgan`, `kiera`, `helma`, `marin`, `nazir`
  - still failing after the first full legacy pass: `luna`, `serena`, `iris`, `wolf`, `erin`, `laila`, `hakan`, `seraphin`, `micaela`, `lucian`
- Verification:
  - `python scripts/generate-runtime-character-clips.py`: pass
  - `python scripts/export-hero-frame-review.py`: pass
  - `python scripts/audit-runtime-character-clips.py`: pass
  - `npm run capture:viewer`: pass
  - `npm run typecheck`: pass
- Review evidence:
  - `output/qa/hero-frame-review/idle-all-frames.png`
  - `output/qa/runtime-character-quality-report.json`
  - `output/animation-viewer/animation_viewer_character_canvas.png`
- Current QA decision:
  - `hero / idle` clipping concern: rejected
  - tiny white-edge cleanup: partially accepted
  - full companion source-route expansion: accepted
  - full companion final animation sign-off: rejected pending per-character row tuning

## 2026-04-11 Weak Companion Manual-Tuning Start

- Scope:
  - start manual-quality remediation for the weak companion roster using the post-Kain process
  - reduce row drift and label contamination before moving to per-clip box tuning
- Change under test:
  - `scripts/generate-runtime-character-clips.py`
- Extraction update:
  - single-layout subjects now compute a dynamic per-row `x_start` via `detect_row_label_edge_for_base()`
  - low-label sheets can now reconstruct row centers from `detect_foreground_row_segments()`
  - known weak clips can bypass component extraction through `NO_COMPONENT_EXTRACTION_SUBJECT_CLIPS`
- QA outcome in this pass:
  - improved to caution-only baselines:
    - `iris`
    - `seraphin`
    - `micaela`
    - `lucian`
  - improved but still failing on a small subset:
    - `luna`: only `walk`
    - `serena`: `heal_cast`, `down_or_death`
    - `wolf`: `idle`, `dash_or_dodge`
    - `erin`: `cast_loop`
    - `laila`: `walk`, `hit_react`, `victory`
    - `hakan`: `taunt_or_command`
    - `nazir`: `walk`, `attack_basic_02`, `attack_basic_03`
  - the remaining failures are now mostly clip-specific and no longer broad whole-subject extraction collapse
- Verification:
  - `python scripts/generate-runtime-character-clips.py`: pass
  - `python scripts/audit-runtime-character-clips.py`: pass
  - `npm run capture:viewer`: pass
  - `npm run typecheck`: pass
- Review evidence:
  - `output/qa/runtime-character-quality-report.json`
  - `output/animation-viewer/animation_viewer_character_canvas.png`
- Current QA decision:
  - generalized extraction improvements: accepted
  - weak companion final sign-off: rejected
  - next pass must move from generic heuristics to explicit clip-level row-box/manual-frame tuning

## 2026-04-11 Full Companion Runtime Activation

- Scope:
  - activate regenerated companion strips in the real runtime loader
  - make the Animation Viewer and battle runtime resolve companion clip textures by subject id
- Change under test:
  - `src/game/data/runtimeAnimationAssets.ts`
- Runtime update:
  - removed the old `hero`-only runtime character subject gate
  - character runtime manifests are now loaded for the full playable roster
- QA outcome:
  - Animation Viewer runtime state now reports `availableClipCount: 315`
  - runtime viewer checks resolve both `hero` and `lucian` character texture keys successfully
  - battle runtime remains able to resolve `member.id` based character clips after the gate removal
- Verification:
  - `npm run capture:viewer`: pass
  - `npm run typecheck`: pass
- Review evidence:
  - `output/animation-viewer/character_runtime_activation_check.json`
  - `output/animation-viewer/animation_viewer_character_runtime_lucian.png`
  - `output/animation-viewer/character-spot-checks/`
- Current QA decision:
  - companion runtime/viewer wiring: accepted
  - remaining work stays in per-clip art cleanup, not runtime activation

## 2026-04-11 Bram Manual Row-Box Recut

- Scope:
  - validate the user report that Bram still collapses into `head-only` crops
  - move Bram off the broad auto extractor and onto the same manual-quality path used for Kain
- Change under test:
  - `scripts/generate-runtime-character-clips.py`
- QA findings before the fix:
  - Bram runtime clips were still entering the `AUTO_PAIRED_SINGLE_LAYOUT_IDS` path
  - that path ignored the new Bram manual specs and used overlapping row bands
  - visible result: `idle`, `walk`, `skill_cast`, and other clips alternated between full body and head-only fragments
- Fix applied:
  - added full Bram `REGION_MANUAL_CLIP_EXTRACTION_SPECS`
  - changed `extract_single_layout_subject()` so any subject with manual overrides skips the auto-paired extractor
  - trimmed Bram `skill_cast` and `victory` to clean source-frame subsets before resampling
- QA result after the fix:
  - Bram no longer shows the previous row-overlap collapse in the checked clips
  - `Animation Viewer -> Character -> Bram -> idle` now renders a stable full-body loop
  - Bram current watchdog result:
    - subject status: `caution`
    - clips: `3 pass / 12 caution / 0 fail`
    - pass clips: `guard_or_block`, `interact`, `victory`
  - remaining issues are now quality-grade residue / special-action cleanup, not catastrophic body loss
- Verification:
  - Bram-only regeneration via inline module call: pass
  - `python scripts/audit-runtime-character-clips.py`: pass
  - `npm run capture:viewer`: pass
  - `npm run typecheck`: pass
- Review evidence:
  - `output/qa/bram-frame-review/idle-all-frames.png`
  - `output/qa/bram-frame-review/walk-all-frames.png`
  - `output/qa/bram-frame-review/skill_cast-all-frames.png`
  - `output/qa/bram-frame-review/victory-all-frames.png`
  - `output/animation-viewer/animation_viewer_character_runtime_bram.png`
  - `output/animation-viewer/animation_viewer_character_runtime_bram_canvas.png`
- Current QA decision:
  - Bram catastrophic crop failure: fixed
  - Bram final sign-off: not yet approved
  - next Bram pass should target the remaining caution clips, starting with `heavy_attack`, `guard_or_block` residue cleanup, and `down_or_death`

## 2026-04-11 Floor-Angle + Non-Pass Character Recheck

- Scope:
  - recheck the user-reported `ground-angle / floor tilt` symptom across current non-pass clips
  - determine whether the visible issue is true baseline tilt or still a crop-collapse failure
- Change under test:
  - no new runtime generation change in this pass
  - this pass is a QA-only reclassification step on the latest generated runtime strips
- Audit method:
  - ranked non-pass clips using:
    - `bottomJitter`
    - `centerJitter`
    - local runtime-strip bottom-contour slope scan
  - visually inspected the top candidates through contact sheets in `output/qa/floor-angle-review`
- QA finding:
  - most of the strongest `floor-angle` suspects are actually still catastrophic mis-crops
  - they only present *as if* the sprite is floor-tilted because the strip has collapsed into:
    - top-only fragments
    - effect-only fragments
    - ground-line scraps
    - label / shadow remnants
- Confirmed catastrophic examples:
  - `luna / victory`
  - `laila / victory`
  - `lucian / skill_cast`
  - `micaela / run`
  - `ria / talk`
  - `helma / dash_or_dodge`
  - `sera / dash_or_dodge`
  - `lucian / run`
- Confirmed readable but still unstable examples:
  - `fin / down_or_death`
  - `serena / down_or_death`
  - some remaining Bram caution special-action clips
- Review evidence:
  - `output/qa/floor-angle-review/luna-victory.png`
  - `output/qa/floor-angle-review/laila-victory.png`
  - `output/qa/floor-angle-review/lucian-skill_cast.png`
  - `output/qa/floor-angle-review/micaela-run.png`
  - `output/qa/floor-angle-review/ria-talk.png`
  - `output/qa/floor-angle-review/helma-dash_or_dodge.png`
  - `output/qa/floor-angle-review/fin-down_or_death.png`
- Current QA decision:
  - there is not yet a separate high-priority `floor-angle-only` bug class
  - the true blocker is still failed extraction on the non-pass roster
  - next fixes should continue in manual subject / clip recut order rather than trying to patch slope symptoms globally

## 2026-04-12 Companion Pass Restart

- Scope:
  - continue the non-hero companion pass after the `Bram` correction
  - test whether the remaining party members can move toward the same manual-cut baseline without introducing new collapse failures
- Change under test:
  - `extract_single_layout_subject()` now prefers exact label-group row boxes and can dynamically switch into auto-paired extraction for paired-looking single sheets
  - postprocess cleanup is now applied after frame selection even when the frame source came from component extraction
  - character cleanup now uses border-palette background removal instead of the earlier bright-neutral wipe
  - new review exporter added: `scripts/export-character-frame-review.py`
- QA result:
  - `sera` improved:
    - previous: `fail`
    - current: `caution`
    - current clips: `3 pass / 11 caution / 0 fail`
  - `laila` improved:
    - previous: `4 pass / 8 caution / 2 fail`
    - current: `6 pass / 6 caution / 2 fail`
  - a broad experiment that disabled component extraction across the whole companion roster was rejected
    - rejected because it made `luna`, `serena`, `seraphin`, and several late companions visibly and numerically worse
    - only the selective improvements were retained
- Current fail-first queue:
  - `luna`
  - `serena`
  - `iris`
  - `erin`
  - `hakan`
  - `seraphin`
  - `nazir`
- Review evidence:
  - `output/qa/runtime-character-quality-report.json`
  - `output/qa/character-frame-review/sera`
  - `output/qa/character-frame-review/laila`
  - `output/qa/character-frame-review/luna`
  - `output/animation-viewer/animation_viewer_character_canvas.png`
- Verification:
  - companion-only regeneration via inline module call: pass
  - `python scripts/audit-runtime-character-clips.py`: pass
  - `python scripts/export-character-frame-review.py`: pass
  - `npm run capture:viewer`: pass
  - `npm run typecheck`: pass
- Current QA decision:
  - `Bram` remains the stable non-hero baseline
  - `Sera` is the first successful next-companion conversion
  - full-roster completion is not approved yet
  - next pass should be manual, clip-local recut starting from `luna`

## 2026-04-12 Companion Pass Continued

- Scope:
  - continue non-pass companion QA with clip-local correction only
  - distinguish true extraction failures from `internal_holes` QA-only failures
- QA finding:
  - the old forced auto-paired route on early companion single-row sheets was incorrect
  - removing that forced route improved the following subjects:
    - `theo`
    - `kiera`
    - `ria`
    - `helma`
  - manual row-region correction also cleared the last fail clip on:
    - `helma`
    - `seraphin`
- Confirmed improvements:
  - `theo`: `11 pass / 2 caution / 0 fail`
  - `kiera`: `12 pass / 1 caution / 0 fail`
  - `ria`: no remaining fail clips
  - `helma`: no remaining fail clips
  - `seraphin`: no remaining fail clips
  - `hakan`: `walk` fail removed
  - `serena`: fail clip count reduced `9 -> 8`
  - `luna`: fail clip count reduced `5 -> 4`
- Rejected changes:
  - direct-region overrides for `iris`, `laila`, and `nazir`
  - rejected because they worsened clip quality and report counts
- Remaining stable fail queue:
  - `serena`
  - `luna`
  - `hakan`
  - `marin`
  - `nazir`
  - `iris`
  - `laila`
- Review evidence:
  - `output/qa/runtime-character-quality-report.json`
  - `output/qa/character-frame-review/helma/guard_or_block-all-frames.png`
  - `output/qa/character-frame-review/marin/dash_or_dodge-all-frames.png`
  - `output/qa/character-frame-review/serena/idle-all-frames.png`
  - `output/qa/character-frame-review/luna/victory-all-frames.png`
- Verification:
  - repeated subject-only regeneration via inline module call: pass
  - `python scripts/audit-runtime-character-clips.py`: pass
  - `npm run typecheck`: pass
- Current QA decision:
  - this pass is approved as an improvement pass only
  - full companion sign-off is still blocked by the remaining fail queue above
  - the next pass should use row-local interval/source-box recuts, not more broad extraction-rule changes

## 2026-04-12 Companion Fail Queue Cleared

- Scope:
  - finish the remaining companion animation fail queue
  - re-check whether the last blocking issue was still extraction failure or now only hole-repair damage
- QA finding:
  - the last blocking clips were no longer bad source intervals
  - the real defect was the hole-repair path restoring only `alpha`, which could preserve broken interior pixels after cleanup
- Fix accepted:
  - added `fill_transparent_component_from_neighbors()` so restored holes take color from adjacent sprite pixels
  - kept this in all small-hole restoration paths, including post-strip cleanup
  - raised `max_bottom_ratio` only for the remaining fail clips on `serena`, `luna`, `erin`, and `hakan`
  - added missing `serena / cast_loop` cleanup coverage
- QA result:
  - previous fail queue:
    - `luna / victory`
    - `serena / idle`
    - `serena / walk`
    - `serena / attack_basic_02`
    - `serena / buff_cast`
    - `serena / cast_loop`
    - `serena / dash_or_dodge`
    - `serena / town_idle`
    - `serena / pray_idle`
    - `erin / interact`
    - `hakan / charge`
    - `hakan / dash_or_dodge`
  - current result:
    - `0 fail clips`
    - `0 fail subjects`
    - all `21` runtime character subjects are now `caution`
- Review evidence:
  - `output/qa/runtime-character-quality-report.json`
  - `output/qa/character-frame-review/serena/idle-all-frames.png`
  - `output/qa/character-frame-review/serena/pray_idle-all-frames.png`
  - `output/qa/character-frame-review/luna/victory-all-frames.png`
  - `output/qa/character-frame-review/hakan/dash_or_dodge-all-frames.png`
  - `output/animation-viewer/animation_viewer_character_canvas.png`
- Verification:
  - `python scripts/generate-runtime-character-clips.py`: pass
  - targeted subject regeneration via inline module call: pass
  - `python scripts/audit-runtime-character-clips.py`: pass
  - `python scripts/export-character-frame-review.py --subject luna --subject serena --subject erin --subject hakan`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass
- Current QA decision:
  - hard fail threshold is cleared for the full player/companion roster
  - QA does not call the roster `done`; the whole set still remains `caution`
  - next pass should focus on visual polish, not blocker triage

## 2026-04-12 Full Audit Correction

- Scope:
  - rerun the full roster audit after the targeted cleanup pass
  - verify whether the earlier `0 fail` result survives a full report refresh
- QA finding:
  - the earlier `0 fail clips` state was not stable under a full-rerun audit
  - the real full-roster state after rerun is:
    - `20 caution subjects`
    - `1 fail subject`
    - `1 fail clip`
- Remaining hard blocker:
  - `seraphin / attack_basic_01`
- Rejected experiments:
  - forced `auto-paired` extraction on `seraphin` and `nazir`
  - widened exact-row top bands for those paired-looking single sheets
  - subject-local skip of artifact cleanup
  - QA rejected these because visual inspection did not show a stable improvement, and some experiments worsened the runtime strips
- Stable result kept:
  - `luna`, `serena`, `erin`, `hakan` remain at `caution` with no fail clips
  - `nazir` is back at `caution`
- Review evidence:
  - `output/qa/runtime-character-quality-report.json`
  - `output/qa/character-frame-review/seraphin/attack_basic_01-all-frames.png`
  - `output/qa/character-frame-review/seraphin/run-all-frames.png`
  - `output/qa/character-frame-review/nazir/walk-all-frames.png`
  - `output/animation-viewer/animation_viewer_character_canvas.png`
- Verification:
  - `python scripts/audit-runtime-character-clips.py`: pass
  - `npm run capture:viewer`: pass
  - `npm run typecheck`: pass
- Current QA decision:
  - the broad fail queue has been reduced to one clip only
  - QA does not approve final completion yet
  - the next pass should isolate `seraphin / attack_basic_01`, not reopen the wider roster

## 2026-04-12 Manual Source-Box Recut Pass

- Scope:
  - replace unstable auto-splitting on the most visibly broken clips
  - verify by frame sheet, runtime audit, and viewer capture
- QA finding:
  - original-source rows for `seraphin`, `nazir`, `wolf`, and `serena` were usable
  - the dominant defect was frame separation, not source art quality
  - `seraphin / attack_basic_01` and `serena / hit_react` also had post-strip internal holes that needed explicit cleanup coverage
- Fix accepted:
  - added source-box direct extraction for:
    - `seraphin / attack_basic_01`
    - `nazir / walk`
    - `nazir / run`
    - `wolf / heavy_attack`
    - `serena / hit_react`
  - added post-strip hole cleanup for:
    - `seraphin / attack_basic_01`
    - `serena / hit_react`
- QA result:
  - visually corrected:
    - `seraphin / attack_basic_01`
    - `nazir / walk`
    - `nazir / run`
    - `wolf / heavy_attack`
    - `serena / hit_react`
  - full-roster fail queue reduced to:
    - `nazir / attack_basic_03`
    - `wolf / idle`
    - `wolf / dash_or_dodge`
    - `serena / down_or_death`
  - `seraphin / attack_basic_01`: `fail -> pass`
  - `serena / hit_react`: `fail -> pass`
- Review evidence:
  - `output/qa/character-frame-review/seraphin/attack_basic_01-all-frames.png`
  - `output/qa/character-frame-review/nazir/walk-all-frames.png`
  - `output/qa/character-frame-review/nazir/run-all-frames.png`
  - `output/qa/character-frame-review/wolf/heavy_attack-all-frames.png`
  - `output/qa/character-frame-review/serena/hit_react-all-frames.png`
  - `output/animation-viewer/animation_viewer_character_canvas.png`
- Verification:
  - `python scripts/generate-runtime-character-clips.py`: pass
  - targeted inline regeneration for `seraphin`, `serena`: pass
  - `python scripts/audit-runtime-character-clips.py`: pass
  - `python scripts/export-character-frame-review.py --subject seraphin --subject nazir --subject wolf --subject serena`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass
- Current QA decision:
  - QA accepts this pass as a real visual improvement
  - QA does not approve final completion yet
  - next hard-fail targets are:
    - `nazir / attack_basic_03`
    - `wolf / idle`
    - `wolf / dash_or_dodge`
    - `serena / down_or_death`

## 2026-04-12 Selective Auto-Paired Extraction Pass

- Scope:
  - extend auto-paired extraction so clip-level manual overrides still work
  - test broader rollout, then keep only subjects that improved by visual review
- QA finding:
  - broad auto-paired rollout was not valid as a global rule
  - it materially improved `iris`, `serena`, and `wolf`
  - it regressed `sera` and did not hold up for several panel-box style sheets
- Fix accepted:
  - keep auto-paired extraction for:
    - `iris`
    - `serena`
    - `wolf`
  - roll back auto-paired extraction for:
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
- QA result:
  - improved automatic summaries:
    - `iris`: `5 pass / 10 caution / 0 fail -> 9 pass / 6 caution / 0 fail`
    - `serena`: `5 pass / 8 caution / 1 fail -> 10 pass / 4 caution / 0 fail`
    - `wolf`: `3 pass / 9 caution / 2 fail -> 4 pass / 10 caution / 0 fail`
    - `hakan`: current stable state after rollback is `10 pass / 5 caution / 0 fail`
  - current hard-fail queue is now:
    - `sera / idle`
    - `sera / walk`
    - `sera / run`
    - `sera / attack_basic_02`
    - `nazir / attack_basic_03`
    - `seraphin / run`
    - `seraphin / attack_basic_02`
    - `seraphin / skill_cast`
- Review evidence:
  - `output/qa/character-overview-review/iris-overview.png`
  - `output/qa/character-overview-review/serena-overview.png`
  - `output/qa/character-overview-review/wolf-overview.png`
  - `output/qa/character-overview-review/sera-overview.png`
  - `output/qa/character-overview-review/seraphin-overview.png`
  - `output/qa/character-overview-review/hakan-overview.png`
  - `output/qa/runtime-character-quality-report.json`
  - `output/animation-viewer/animation_viewer_character_canvas.png`
- Verification:
  - `python scripts/generate-runtime-character-clips.py`: pass
  - `python scripts/audit-runtime-character-clips.py`: pass
  - `python scripts/export-character-frame-review.py --subject sera --subject serena --subject iris --subject wolf --subject laila --subject hakan --subject seraphin --subject nazir`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass
- Current QA decision:
  - selective retention is valid
  - broad auto-paired extraction is rejected for mixed panel-box sheets
  - next pass should build panel-box extraction for `hakan`, `laila`, `nazir` and manual recuts for `sera`, `seraphin`

## 2026-04-12 Package rembg pass for panel-box sheets

- Scope:
  - test package-sheet rembg extraction on hard panel-box clips that continue to fail under normal alpha/component cleanup
  - connect the override path to both `single_layout` and `auto_paired` extraction flows
- QA finding:
  - `sera / cast_start` and `sera / cast_loop` are valid rembg candidates and the runtime strip is visibly cleaner than the master-sheet fallback
  - the same rembg path is not good enough for `seraphin / run`, `seraphin / attack_basic_02`, `seraphin / skill_cast`, or `nazir / attack_basic_03`
  - this confirms rembg is a targeted tool, not a new global rule
- Accepted fix:
  - keep rembg override active for:
    - `sera / cast_start`
    - `sera / cast_loop`
- Rejected expansion:
  - do not apply rembg yet to:
    - `seraphin / run`
    - `seraphin / attack_basic_02`
    - `seraphin / skill_cast`
    - `nazir / attack_basic_03`
- Review evidence:
  - `public/assets/runtime/characters/sera/cast_start.png`
  - `public/assets/runtime/characters/sera/cast_loop.png`
  - `output/qa/rembg-probes/sera-cast_start-rembg-probe.png`
  - `output/qa/rembg-probes/sera-cast_loop-rembg-probe.png`
  - `output/qa/rembg-probes/seraphin-run-rembg-probe.png`
  - `output/qa/rembg-probes/seraphin-attack_basic_02-rembg-probe.png`
  - `output/qa/rembg-probes/seraphin-skill_cast-rembg-probe.png`
  - `output/qa/rembg-probes/nazir-attack_basic_03-rembg-probe.png`
  - `output/qa/runtime-character-quality-report.json`
- Verification:
  - targeted inline regeneration for `sera`: pass
  - `python scripts/audit-runtime-character-clips.py`: pass
  - `python scripts/export-character-frame-review.py --subject sera`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass
- Current QA decision:
  - rembg is approved only as a clip-level escape hatch for specific panel-box subjects
  - final completion is still blocked by:
    - `nazir / attack_basic_03`
    - `seraphin / run`
    - `seraphin / attack_basic_02`
    - `seraphin / skill_cast`

## 2026-04-12 Hard-fail reduction pass

- Scope:
  - collapse the remaining hard-fail queue after the rembg pass
  - validate whether the final `nazir` failure is a real extraction blocker or only an audit-threshold problem
- QA finding:
  - `seraphin` hard fails were genuine `internal_holes` cases and are resolved by stronger post-strip cleanup
  - `nazir / attack_basic_03` is different: package-row repros can make the clip pass the automatic audit, but the extracted strip still shows tan card background / panel contamination when inspected on checker
  - that means the remaining blocker is `visual extraction quality`, not only audit heuristics
- Accepted fix:
  - keep stronger post-strip cleanup for:
    - `seraphin / run`
    - `seraphin / attack_basic_02`
    - `seraphin / skill_cast`
- Rejected as final fix:
  - do not accept current `nazir / attack_basic_03` package-row probes as production output yet
  - reason: checker review still shows card background contamination
- Review evidence:
  - `output/qa/character-frame-review/seraphin/run-all-frames.png`
  - `output/qa/character-frame-review/seraphin/attack_basic_02-all-frames.png`
  - `output/qa/character-frame-review/seraphin/skill_cast-all-frames.png`
  - `output/qa/character-frame-review/nazir/attack_basic_03-all-frames.png`
  - `output/qa/nazir-yshift-probes/nazir-attack_basic_03-y532.png`
  - `output/qa/nazir-yshift-probes/nazir-attack_basic_03-cardbg-direct.png`
  - `output/qa/runtime-character-quality-report.json`
- Verification:
  - targeted inline regeneration for `nazir`, `seraphin`: pass
  - `python scripts/audit-runtime-character-clips.py`: pass
  - `python scripts/export-character-frame-review.py --subject nazir --subject seraphin`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass
- Current QA decision:
  - `seraphin` is downgraded from hard fail to `caution`
  - project-wide final hard-fail queue is now:
    - `nazir / attack_basic_03`
  - final completion is still blocked until `nazir / attack_basic_03` has both:
    - transparent background
    - no panel/label contamination

## 2026-04-12 Nazir final hard-fail closure

- Scope:
  - close the last automatic hard fail on `nazir / attack_basic_03`
  - verify the fix with both strip audit and viewer capture
- QA finding:
  - the most stable production candidate is the `y=532` rembg package-row extraction
  - previous manual/package fallbacks kept panel/card contamination longer than acceptable
  - the rembg row-window below removes the hard fail without reintroducing fragmentation:
    - `(918, 532, 988, 620)`
    - `(984, 532, 1054, 620)`
    - `(1050, 532, 1120, 620)`
    - `(1116, 532, 1186, 620)`
    - `(1182, 532, 1252, 620)`
    - `(1248, 532, 1318, 620)`
    - `(1290, 522, 1390, 620)`
- Accepted fix:
  - promote `nazir / attack_basic_03` to package-sheet rembg override in production generation
- Review evidence:
  - `public/assets/runtime/characters/nazir/attack_basic_03.png`
  - `output/qa/character-frame-review/nazir/attack_basic_03-all-frames.png`
  - `output/qa/nazir-final-probes/rembg_y532.png`
  - `output/qa/nazir-final-probes/rembg_y532-checker-7f.png`
  - `output/qa/runtime-character-quality-report.json`
- Verification:
  - targeted inline regeneration for `nazir`: pass
  - `python scripts/audit-runtime-character-clips.py`: pass
  - `python scripts/export-character-frame-review.py --subject nazir`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass
- Current QA decision:
  - automatic hard-fail queue is now `0`
  - project-wide automatic summary is now:
    - `21 caution subjects`
    - `0 fail subjects`
  - manual visual override review is still active and remains tracked separately in:
    - `docs/qa/MANUAL_FAIL_OVERRIDE_LIST_2026-04-12.md`

## 2026-04-12 User-targeted clip repair loop

- Scope:
  - directly rework the user-reported clip list on:
    - `helma`
    - `serena`
    - `fin`
    - `iris`
    - `wolf`
    - `erin`
    - `nazir`
    - `laila`
    - `hakan`
- QA finding:
  - package-sheet clip overrides are effective for `nazir`, `laila`, and `hakan / walk`
  - broad region recuts on master sheets are not acceptable; they collapse many clips into lower-body strips
  - raw source-box extraction is the only master-sheet override that improved targeted clips without reintroducing hard fails
- Accepted fix:
  - keep package-panel clip overrides for:
    - `nazir`
    - `laila`
    - `hakan / walk`
  - keep manual source-box overrides for:
    - `helma / summon_or_rune`
    - `serena / attack_basic_01`
    - `serena / victory`
    - `serena / down_or_death`
    - `fin / shoot_loop`
    - `iris / attack_basic_01`
    - `iris / victory`
    - `wolf / attack_basic_01`
    - `wolf / attack_basic_02`
    - `wolf / charge`
    - `wolf / dash_or_dodge`
    - `wolf / down_or_death`
    - `erin / summon_or_rune`
    - `erin / dash_or_dodge`
- Rejected fix:
  - do not use the attempted broad region-manual recuts for:
    - `helma`
    - `serena`
    - `fin`
    - `iris`
    - `wolf`
    - `erin`
  - reason: they regressed into strip fragments and recreated fail states
- Review evidence:
  - `output/qa/runtime-character-quality-report.json`
  - `output/qa/character-frame-review/helma/`
  - `output/qa/character-frame-review/serena/`
  - `output/qa/character-frame-review/fin/`
  - `output/qa/character-frame-review/iris/`
  - `output/qa/character-frame-review/wolf/`
  - `output/qa/character-frame-review/erin/`
  - `output/qa/character-frame-review/nazir/`
  - `output/qa/character-frame-review/laila/`
  - `output/qa/character-frame-review/hakan/`
- Verification:
  - targeted inline regeneration for the 9 user-requested subjects: pass
  - `python scripts/audit-runtime-character-clips.py`: pass
  - `python scripts/export-character-frame-review.py --subject helma --subject serena --subject fin --subject iris --subject wolf --subject erin --subject nazir --subject laila --subject hakan`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass
- Current QA decision:
  - automatic subject summary remains:
    - `21 caution subjects`
    - `0 fail subjects`
  - user-requested list improved materially on:
    - `nazir`
    - `laila`
    - `hakan / walk`
    - `iris / attack_basic_01`
    - `erin / dash_or_dodge`
    - `helma / dash_or_dodge`
  - the following requested clips still need manual frame-by-frame finishing:
    - `helma / summon_or_rune`
    - `serena / attack_basic_01`
    - `serena / victory`
    - `serena / down_or_death`
    - `fin / shoot_loop`
    - `iris / attack_basic_03`
    - `iris / victory`
    - `wolf / attack_basic_01`
    - `wolf / attack_basic_02`
    - `wolf / charge`
    - `wolf / dash_or_dodge`
    - `wolf / down_or_death`
    - `erin / summon_or_rune`

## 2026-04-12 Priority 1-3 Recut Follow-up

- Scope reviewed:
  - `serena`
  - `wolf`
  - `fin`
  - `helma`
  - `erin`
  - `iris`
  - `nazir`
  - `laila`
- What changed:
  - replaced weak equal-split boxes for several legacy clips with manual center boxes
  - moved the user-priority package-style clips to package-panel manual source boxes where the package sheet was visibly cleaner than legacy
  - re-tested candidate center sets under `output/qa/candidate-manual-tests/` before fixing the live generator settings
- Confirmed improved by direct frame review:
  - `helma / summon_or_rune`
  - `serena / attack_basic_01`
  - `serena / victory`
  - `erin / summon_or_rune`
  - `wolf / attack_basic_01`
- Still not acceptable by direct frame review:
  - `serena / down_or_death`
  - `fin / shoot_loop`
  - `iris / attack_basic_03`
  - `iris / victory`
  - `wolf / attack_basic_02`
  - `wolf / charge`
  - `wolf / dash_or_dodge`
  - `wolf / down_or_death`
  - `nazir / attack_basic_03`
  - `nazir / down_or_death`
  - `laila / run`
- Report snapshot after this pass:
  - `serena`: `12 pass / 2 caution / 0 fail`
  - `wolf`: `5 pass / 9 caution / 0 fail`
  - `fin`: `9 pass / 4 caution / 0 fail`
  - `helma`: `14 pass / 1 caution / 0 fail`
  - `erin`: `8 pass / 6 caution / 0 fail`
  - `iris`: `8 pass / 7 caution / 0 fail`
  - `nazir`: `13 pass / 2 caution / 0 fail`
  - `laila`: `13 pass / 1 caution / 0 fail`
- Evidence:
  - `output/qa/runtime-character-quality-report.json`
  - `output/qa/character-frame-review/serena/`
  - `output/qa/character-frame-review/wolf/`
  - `output/qa/character-frame-review/fin/`
  - `output/qa/character-frame-review/helma/`
  - `output/qa/character-frame-review/erin/`
  - `output/qa/character-frame-review/iris/`
  - `output/qa/character-frame-review/nazir/`
  - `output/qa/character-frame-review/laila/`
  - `output/qa/candidate-manual-tests/`
- Verification:
  - `python scripts/generate-runtime-character-clips.py`: pass
  - `python scripts/audit-runtime-character-clips.py`: pass
  - `python scripts/export-character-frame-review.py --subject serena --subject wolf --subject fin --subject helma --subject erin --subject iris --subject nazir --subject laila`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass

## QA Loop 03 - Package Preview Recut Check

- Problem statement:
  - user reported that current failure mode is not background residue first, but `wrong frame splitting`
  - target clips must show `one character per frame` before any deeper polish
- Focus subjects in this pass:
  - `nazir`
  - `laila`
  - `hakan`
  - `iris`
  - `erin`
- What changed:
  - package preview source routing expanded
  - lower-band slot extraction introduced for preview cards
  - x-energy peak based center detection added
  - per-frame left/right retry scoring added
  - final center-component pruning added after crop
- Manual review result:
  - `nazir / idle`: still fails, early frames keep banner/border contamination
  - `laila / idle`: still fails, frame 1 and frame 2 not isolated cleanly
  - `hakan / walk`: still fails, early frames and some middle frames keep adjacent figure fragments
  - `iris / attack_basic_01`: still fails, several frames contain wrong partial actor/effect slice
  - `erin / dash_or_dodge`: still fails, several frames remain side-clipped
- Evidence:
  - `output/qa/character-frame-review/nazir/idle-all-frames.png`
  - `output/qa/character-frame-review/laila/idle-all-frames.png`
  - `output/qa/character-frame-review/hakan/walk-all-frames.png`
  - `output/qa/character-frame-review/iris/attack_basic_01-all-frames.png`
  - `output/qa/character-frame-review/erin/dash_or_dodge-all-frames.png`
- Verification:
  - `python scripts/audit-runtime-character-clips.py`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass

## QA Loop 03 - Approved Master Sheet Phase-1 Single-Figure Recovery

- Problem statement:
  - user rejected the recent split path and required a reset to original source images
  - priority changed to:
    1. one character per frame
    2. transparency / cleanup polish later
- Focus targets:
  - `nazir`
  - `laila`
  - `hakan`
  - `iris / attack_basic_01`
  - `erin / dash_or_dodge`
- What changed:
  - stopped using the recent broken split result as truth for the target clips
  - introduced approved master-sheet clip-box extraction for the target subjects/clips
  - extracted frames from clip boxes using upper-band peak centers instead of generic frame slicing
  - added targeted component selection and non-character frame replacement
- Manual review result:
  - `nazir / idle`: accepted for phase-1, one character per frame
  - `laila / idle`: accepted for phase-1, one character per frame
  - `hakan / walk`: accepted for phase-1, one character per frame
  - `iris / attack_basic_01`: accepted for phase-1, panel/text contamination removed
  - `erin / dash_or_dodge`: accepted for phase-1, wrong-actor issue removed
- Remaining risk:
  - automated QA still reports effect-heavy clips on `nazir`, `laila`, `hakan`
  - those are phase-2 cleanup targets, not phase-1 split failures
- Evidence:
  - `public/assets/runtime/characters/nazir/idle.png`
  - `public/assets/runtime/characters/laila/idle.png`
  - `public/assets/runtime/characters/hakan/walk.png`
  - `public/assets/runtime/characters/iris/attack_basic_01.png`
  - `public/assets/runtime/characters/erin/dash_or_dodge.png`
  - `output/qa/runtime-strip-overview-phase1/nazir-overview.png`
  - `output/qa/runtime-strip-overview-phase1/laila-overview.png`
  - `output/qa/runtime-strip-overview-phase1/hakan-overview.png`
  - `output/qa/runtime-strip-overview-phase1/iris-overview.png`
  - `output/qa/runtime-strip-overview-phase1/erin-overview.png`
- Verification:
  - `python scripts/audit-runtime-character-clips.py`: pass
  - `npm run typecheck`: pass
  - `npm run capture:viewer`: pass
