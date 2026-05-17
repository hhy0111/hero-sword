# BROKEN_IMAGE_REMAKE_READY_TO_COPY_PROMPTS_2026-04-16.md

This file contains only remake prompts for assets that were explicitly judged broken, mismatched, or unusable in runtime.

Excluded on purpose:

- missing-but-not-broken assets
- future nice-to-have assets
- assets that already passed runtime review

Every prompt below is fully copy-ready and standalone.

## 01. Region Landmark Sheet Remake

- source_problem:
  - previous `09-region-landmark-icon-sheet.png` baked the checkerboard into the image and was not usable as a transparent landmark sheet
- target_file:
  - `assets/source/world-map/landmarks/world_landmark_sheet_v002.png`

```text
Create a commercial-quality transparent-background world-landmark sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Build one clean runtime-usable landmark image set for these seven world-map landmarks: Greenhaven watchtower, Granforge furnace tower, Blueharbor shrine beacon, Winterguard fortress, Solkazar relic tower, Lumina sanctuary citadel, and the Black Gate final camp. Each landmark must be isolated on true transparent background with no baked checkerboard, no poster background, no scenery rectangle, and no text. The result must read clearly as clickable map landmark art on a portrait mobile screen and must be clean enough for direct slicing and placement in runtime UI.
```

## 02. Lumen Outer Wall Remake

- source_problem:
  - previous `10-lumen-village-outer-border.png` was not a usable transparent runtime wall image
- target_file:
  - `assets/source/world/town-polish/lumen_outer_wall_runtime_v002.png`

```text
Create a commercial-quality transparent-background runtime wall image for Hero Sword, a Korean mobile fantasy ARPG for Android. Asset: Lumen Village outer wall. Build a practical stone-wall edge kit for direct runtime placement around the borders of a portrait mobile town scene. The wall must read as a safe-town castle wall with parapets, repeated wall rhythm, and small tower logic, but it must stay modular and grounded rather than becoming a giant cinematic matte painting. Use clean alpha only. Do not include checkerboard patterns, painted sky, grass background, characters, text, logos, blur, or broken transparency inside the wall silhouette.
```

## 03. Lumen Stage Gate Remake

- source_problem:
  - previous `11-lumen-village-world-exit-gate.png` had unusable background contamination and weak direct-runtime readability
- target_file:
  - `assets/source/world/town-polish/lumen_stage_gate_runtime_v002.png`

```text
Create a commercial-quality transparent-background stage-gate landmark for Hero Sword, a Korean mobile fantasy ARPG for Android. Asset: the Lumen Village world-exit gate that leads from town into the stage map. Build one fortified arch or gate structure with readable silhouette, banner logic without text, believable stone framing, and direct runtime usability on a portrait mobile town screen. The image must stand cleanly on transparent background with no baked environment panel, no checkerboard, no glow fog slab, and no scenery rectangle. Avoid characters, text, logos, blur, or broken alpha.
```

## 04. Lumen Plaza Ground Remake

- source_problem:
  - previous `12-the-center-plaza-of-lumen-village.png` did not match the intended plaza-ground use and was effectively the wrong asset type
- target_file:
  - `assets/source/world/town-polish/lumen_center_plaza_runtime_v002.png`

```text
Create a commercial-quality transparent-background runtime plaza-ground image for Hero Sword, a Korean mobile fantasy ARPG for Android. Asset: the center plaza area of Lumen Village. Build a clean top-down or slightly game-angled plaza-ground piece suitable for direct placement under the village fountain and surrounding NPC movement space. Use stone plaza logic, readable border shape, and a first-town fantasy mood, but keep it practical for runtime layering instead of poster-style scenery. No checkerboard, no scenery background slab, no characters, no text, no logo, and no fake transparency baked into the image.
```

## 05. Lumen Fountain Base Remake

- source_problem:
  - previous `13-central-fountain-in-lumen-village.png` included unusable background contamination and was not clean enough for direct layering
- target_file:
  - `assets/source/world/town-polish/lumen_fountain_base_runtime_v002.png`

```text
Create a commercial-quality transparent-background fountain base image for Hero Sword, a Korean mobile fantasy ARPG for Android. Asset: the central fountain base in Lumen Village. Build a grounded first-town fountain basin with readable stone rim, pedestal, and compact village-plaza proportions suitable for a portrait mobile game. The fountain base must be clean enough for direct runtime placement and separate from the water effect layer. Do not include painted plaza background, checkerboard, scenery rectangle, characters, text, blur, or broken alpha inside the stone silhouette.
```

## 06. Lumen Fountain Water Remake

- source_problem:
  - the current fountain water presentation is not acceptable and still needs a dedicated clean water layer
- target_file:
  - `assets/source/world/town-polish/lumen_fountain_water_runtime_v002.png`

```text
Create a commercial-quality transparent-background fountain water image or short sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Asset: the water layer for the central Lumen Village fountain. Build a restrained town-safe fountain water effect with a clean center spout, subtle basin water, and readable gentle ripples. This must layer over a separate fountain base in runtime use. Do not create a giant magical explosion, portal look, blur cloud, or broken alpha holes. No checkerboard, no scenery block, no text, and no characters.
```

## 07. Safe Warp Marker Remake

- source_problem:
  - previous `14-safe-warp-marker-runtime-sheet.png` was broken and caused the ugly portal blobs seen in town runtime
- target_file:
  - `assets/source/world/town-polish/lumen_safe_warp_marker_runtime_v002.png`

```text
Create a commercial-quality transparent-background safe warp marker sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Build a subtle entrance indicator effect for shop doors, indoor exits, and the stage gate. This is not a magical portal explosion. Use clean floor rings, small route glows, or restrained movement markers that simply tell the player "walk here to move." The sheet must be runtime-usable on top of a village ground texture with no baked checkerboard, no harsh orange-white explosion, no scenery rectangle, and no broken alpha. Keep it elegant, quiet, and readable on a portrait mobile screen.
```

## 08. English Primary Button Sheet Remake

- source_problem:
  - previous `15-english-primary-button-sheet.png` had unusable checkerboard/background contamination and was not clean for slicing
- target_file:
  - `assets/source/ui/buttons/ui_button_primary_sheet_v002.png`

```text
Create a commercial-quality transparent-background mobile RPG primary button sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Build a clean English button sheet where every labeled button uses the same final size: 160x48. Include normal, hover, pressed, and disabled states for MENU, PARTY, GEAR, GACHA, HOME, OPTIONS, SHOP, EXIT, VILLAGE, WORLD, STAGES, ENTER, START, OPEN, and BACK. The sheet must be clean for runtime slicing with true transparency around every button. Do not include checkerboard patterns, Korean text, controller prompts, poster backgrounds, logos, or decorative clutter that hurts legibility.
```

## 09. English Utility Button Sheet Remake

- source_problem:
  - previous `16-english-utility-button-sheet.png` had unusable checkerboard/background contamination and was not clean for slicing
- target_file:
  - `assets/source/ui/buttons/ui_button_utility_sheet_v002.png`

```text
Create a commercial-quality transparent-background mobile RPG utility button sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Build a clean English button sheet where every labeled button uses the same final size: 160x48. Include normal, hover, pressed, and disabled states for BUY, RESTORE, EQUIP, CLEAR, SINGLE, TEN, PREV, NEXT, RETRY, CONFIRM, CANCEL, CLOSE, DIFFICULTY, and AD. The result must be directly sliceable for runtime UI use with true transparency and no baked checkerboard. Avoid Korean text, controller prompts, scenery backgrounds, logos, or noisy ornament.
```

## 10. English Battle Button Sheet Remake

- source_problem:
  - previous `17-english-battle-button-sheet.png` had unusable checkerboard/background contamination and was not clean for slicing
- target_file:
  - `assets/source/ui/buttons/ui_button_battle_sheet_v002.png`

```text
Create a commercial-quality transparent-background mobile RPG battle button sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Build a clean English button sheet where every labeled button uses the same final size: 160x48. Include normal, hover, pressed, and disabled states for AUTO, SKILL, RETREAT, WORLD, STAGES, ENTER, and OPEN. The sheet must match the primary and utility button family exactly and must be runtime-usable with true transparency, no baked checkerboard, no scenery panel, no Korean text, and no clutter that reduces readability on mobile.
```

## 11. Young Resident Dialogue Portrait Remake

- source_problem:
  - current `Young Resident` portrait does not match the in-game child-like runtime NPC and reads as an adult woman
- target_file:
  - `assets/source/dialogue/npcs/npc_young_resident_dialog_v002.png`

```text
Create a commercial-quality square dialogue portrait for Hero Sword, a Korean mobile fantasy ARPG for Android. Character: the Young Resident of Lumen Village. This portrait must read immediately as a child or very young teen at first glance, not an adult woman. Show a face-first or chest-up portrait only with transparent background, clearly youthful facial proportions, a small-town fantasy villager outfit, and a simple hairstyle that can plausibly match a small village child NPC in runtime. Expression should feel curious, sincere, and lightly impressed by the heroes. Avoid adult beauty styling, mature facial structure, heavy makeup, glamorous rendering, full-body framing, text, logos, watermarks, blur, scenery backgrounds, or any feature that makes the portrait read as a middle-aged or adult character.
```
