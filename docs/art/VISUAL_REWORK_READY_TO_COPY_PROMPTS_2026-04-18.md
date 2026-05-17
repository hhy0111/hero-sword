# VISUAL_REWORK_READY_TO_COPY_PROMPTS_2026-04-18

This file is the focused remake batch for the latest visual blockers found in palace, town north gate, stage select, world map landmarks, battle, and result screens.

Use this global rule for every prompt in this document:

- final look must fit a polished 2D mobile fantasy RPG using refined fine-density pixel art
- it must feel compatible with the current town buildings, hero sprites, and fountain art
- do not generate painterly semi-realistic concept art
- do not generate giant chunky retro pixels
- no checkerboard baked into the image
- no placeholder matte white background
- if the asset is runtime-placed, keep alpha clean and stable
- if the asset is a full-scene background, use a fully finished opaque scenic image with no transparency holes

## 01. Lumen Palace North Gate Exterior Remake

- target_file:
  - `assets/source/world/palace/lumen_palace_north_gate_runtime_v003.png`

```text
Create a commercial-quality transparent-background north palace gate landmark for Hero Sword, a Korean mobile fantasy ARPG for Android. This asset is placed at the top side of Lumen Village and must read as the royal palace entrance above the central fountain plaza. It must visually belong to the same world as the current town buildings: polished fantasy pixel art, medium-bright daylight, refined stonework, blue-and-gold royal accents, and clean perspective for a portrait mobile map. The gate must feel noble, safe, and ceremonial, not ruined, not dark-gothic, and not semi-realistic painted concept art. Include a readable central stair, royal banners, stone railings, and a visible palace doorway. Important: true transparent background only, no white matte rectangle, no sky card, no floor slab beyond the actual asset silhouette, no characters, no text, no logo.
```

## 02. Lumen Palace Audience Hall Background Remake

- target_file:
  - `assets/source/world/palace/lumen_palace_audience_hall_bg_v003.png`

```text
Create a commercial-quality opaque full-scene audience hall background for Hero Sword, a Korean mobile fantasy ARPG for Android. This is the main interior background used for the palace audience hall scene. Build a royal throne room that matches a refined fantasy pixel-art mobile game: stone columns, blue carpet, gold trim, balanced symmetry, readable throne depth, and bright noble lighting. It must harmonize with the current town and battle art, not look like a blurry painting and not look like a photographic palace. Keep the composition centered for portrait mobile play, with enough open floor space in the lower middle for runtime character sprites and dialogue events. No embedded UI, no text, no logo, no matte frame, no characters already drawn into the hall.
```

## 03. Lumen Palace Runtime NPC Sheet Remake

- target_file:
  - `assets/source/world/palace/lumen_palace_core_runtime_npc_sheet_v003.png`

```text
Create a commercial-quality transparent-background runtime sprite sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Character set: King Aldren, Queen Regent Celestine, Captain Rowan, Archivist Mirel. These are not portraits. They are in-game palace NPC sprites. Use refined runtime pixel-art proportions compatible with the current hero and town NPC sprites. Every frame must contain exactly one intact character only. No ghosting, no multi-character contamination, no frame overlap, no checkerboard, no scenery, no text. Provide clean idle, talk, and walk states for each palace NPC. The king must read as royal and armored, the queen as regal and elegant, the captain as disciplined palace guard command, and the archivist as scholarly but noble. Keep sprite scale readable in a portrait mobile scene.
```

## 04. Village Plaza Wayfinding Signpost Remake

- target_file:
  - `assets/source/world/town-polish/lumen_plaza_wayfinding_signpost_v002.png`

```text
Create a commercial-quality transparent-background village wayfinding signpost for Hero Sword, a Korean mobile fantasy ARPG for Android. This prop is used near the central plaza and near the item shop lane. Build a clean wooden signpost with small directional boards, polished first-town fantasy styling, and refined pixel-art detail. It should look like a readable travel sign, not a bench, not a broken table, and not a blurry prop. Use true transparency only. No ground slab, no text baked into the wood, no logo, no checkerboard, and no broken alpha.
```

## 05. Stage Select Scenic Background Remake

- target_file:
  - `assets/source/ui/stage-select/stage_select_scenic_background_v001.png`

```text
Create a commercial-quality opaque scenic background for the Stage Select screen of Hero Sword, a Korean mobile fantasy ARPG for Android. This background must feel bright, adventurous, and premium, not like a debug board. It should support a portrait mobile UI with a large preview panel on top and a route card list below. Use a fantasy campaign-planning mood: warm map-room lighting, subtle parchment and route-table atmosphere, but still compatible with refined pixel-art RPG presentation. Do not paint heavy text into the image. Do not place giant decorative objects exactly where button zones will sit. No logo, no placeholder board, no fake debug scribbles.
```

## 06. Stage Select Card Frame Sheet Remake

- target_file:
  - `assets/source/ui/stage-select/stage_select_card_frame_sheet_v001.png`

```text
Create a commercial-quality transparent-background stage-select card frame sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. This asset family is used for the selectable stage cards in a portrait route screen. Build a frame system with these states: open, locked, selected, boss, and cleared-highlight. The frame must allow a small scenic preview thumbnail inside and leave clean readable space for runtime-rendered stage name, star counts, and lock labels. Style: bright premium fantasy RPG UI with gold trim, dark support tones, and refined pixel-art compatibility. No baked text, no checkerboard, no logos, no blurred concept-art look.
```

## 07. World Map Landmark Thumbnail Set Remake

- target_file:
  - `assets/source/world/world-map/world_landmark_thumbnail_set_v002.png`

```text
Create a commercial-quality transparent-background landmark thumbnail set for Hero Sword, a Korean mobile fantasy ARPG for Android. This set is for the World Route screen and replaces the weak landmark/tower visuals currently used. Build small readable fantasy landmark thumbnails for these routes: Greenhaven Watchtower, Granforge Furnace, Blueharbor Shrine, Winterguard Fortress, Sunscar Relic Tower, Lumina Sanctuary, and the final Black Gate. Each landmark must read clearly at small size inside a portrait node card. Use refined fine-density pixel art, not painterly scenery and not giant retro pixels. True transparency only, no text, no checkerboard, no sky cards.
```

## 08. Battle Top HUD Frame Remake

- target_file:
  - `assets/source/ui/battle/battle_top_hud_frame_v004.png`

```text
Create a commercial-quality transparent-background battle top HUD frame for Hero Sword, a Korean mobile fantasy ARPG for Android. This frame is used at the top of the battle screen for stage name, difficulty, target timer, enemy HP label, and a small stage status icon. It must feel tactical and premium while still letting the battle background remain visible. Build a clean upper frame with readable empty zones for runtime text and one circular icon socket on the right. Style: dark fantasy metal-and-stone UI with controlled gold trim, compatible with refined pixel-art mobile presentation. No baked text, no checkerboard, no logo, no scenery block, no broken alpha.
```

## 09. Battle Bottom Command Frame Remake

- target_file:
  - `assets/source/ui/battle/battle_bottom_command_bar_frame_v004.png`

```text
Create a commercial-quality transparent-background lower command frame for Hero Sword, a Korean mobile fantasy ARPG for Android. This asset sits at the bottom of battle and must support battle log text, AUTO toggle, skill button, and retreat button. Build a clean lower UI frame with strong readability and a better premium game feel than a plain rectangle. Leave empty zones for code-rendered text and buttons. Style must match the top HUD frame. No baked button words, no checkerboard, no logo, no scenery slab, no blur.
```

## 10. Result Clear Frame Remake

- target_file:
  - `assets/source/ui/result/result_panel_clear_v004.png`

```text
Create a commercial-quality transparent-background clear-result frame for Hero Sword, a Korean mobile fantasy ARPG for Android. This frame is for the stage clear screen after battle. It must support a stage summary header, a main statistics panel, a short event or story message panel, and three lower buttons. The frame should feel celebratory and premium without hiding the battle background completely. Use noble dark-blue and gold fantasy styling that matches the battle HUD family. No baked text, no checkerboard, no logo, no scenery block, no blurred illustration.
```

## 11. Result Fail Frame Remake

- target_file:
  - `assets/source/ui/result/result_panel_fail_v004.png`

```text
Create a commercial-quality transparent-background fail-result frame for Hero Sword, a Korean mobile fantasy ARPG for Android. This frame is for post-battle defeat or retreat outcomes. It must support the same runtime layout as the clear frame: stage summary header, main statistics panel, short guidance message panel, and three lower buttons. The mood should feel serious and tactical, with restrained red accents, but still part of the same UI family as the clear-result frame and battle HUD. No baked text, no checkerboard, no logo, no scenery slab, no blurred concept-art look.
```

## 12. Optional Stage Select Difficulty Emblem Set

- target_file:
  - `assets/source/ui/stage-select/stage_select_difficulty_emblems_v001.png`

```text
Create a commercial-quality transparent-background emblem set for Hero Sword, a Korean mobile fantasy ARPG for Android. Build small premium difficulty emblems for Normal, Hard, and Hell used in the Stage Select screen. They must be readable at small UI scale and visually match the stage card frame family. No text baked into the emblem, no checkerboard, no logo, no scenery, and no oversized chunky pixels.
```
