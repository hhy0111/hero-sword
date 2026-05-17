# REMAINING_ART_READY_TO_COPY_PROMPTS_2026-04-19

This file contains only the remaining art prompts that are still needed after the latest `2026-04-19` runtime review pass.

Excluded on purpose:

- assets that already passed and are already connected in-game
- assets that were only temporary experiments and are no longer needed
- dialogue portraits and other portrait-only batches that already have separate prompt files

Global rule for every prompt below:

- final look must fit a polished 2D mobile fantasy RPG with refined fine-density pixel art
- do not generate blurry semi-realistic concept art
- do not generate giant chunky retro pixels
- no checkerboard baked into the image
- no white matte background
- if the asset is runtime-placed, keep alpha clean and stable
- if the asset is a full-scene background, make it a fully finished opaque scene image
- no logos, no UI text baked into the art, and no placeholder debug styling

## 01. Lumen Village South Gate + Outer Wall Modular Tile Set

- target_file:
  - `assets/source/world/town-polish/lumen_south_gate_outer_wall_modular_tile_set_v001.png`

```text
Create a commercial-quality transparent-background modular wall and south-gate tile set for Hero Sword, a Korean mobile fantasy ARPG for Android. This asset replaces the current weak village perimeter and stage-exit structure. The gate should now be designed for the south side of Lumen Village, not the right edge. Build one consistent modular set that includes: horizontal wall segment, vertical wall segment, bottom wall segment, inner corner, outer corner, tower cap, wall end cap, parapet top segment, and one main south-facing town gate module that clearly reads as the route from the village into battle stages. The wall must feel like a safe first-town castle wall, bright stone, polished but not luxurious, readable in portrait mobile gameplay. The gate must feel noble and practical, not like a dark fortress and not like a ruined war gate. Every piece must be isolated on true transparency with no ground baked in, no grass slab, no sky card, no characters, no text, no logo, no checkerboard, and no broken alpha. The modular pieces must tile together cleanly inside a 2D top-down mobile town scene.
Important style rule: refined modern pixel-art fantasy environment, fine pixel density, not painterly illustration and not oversized retro pixels.
```

## 02. Lumen Shop UI Frame Set

- target_file:
  - `assets/source/ui/shop/lumen_shop_ui_frame_set_v001.png`

```text
Create a commercial-quality transparent-background shop UI frame set for Hero Sword, a Korean mobile fantasy ARPG for Android. This replaces the current shop screen that still reads like a test layout. Build one matching UI family for a portrait mobile store scene with these pieces: top summary/header frame, scrollable item-list panel frame, single product card frame, pagination arrow housing, and lower action button strip background. The center areas must stay empty for runtime text and runtime item icons. The design should feel clean, premium, and practical for a mobile fantasy RPG shop, using dark stone, warm metal trim, and subtle gold accents without becoming too heavy. No baked Korean or English words, no item names, no checkerboard, no matte background, no scenery, no logo, and no fake transparency.
Important style rule: refined game UI art compatible with pixel-art gameplay, not painterly UI illustration and not giant retro pixel blocks.
```

## 03. Palace Audience Hall Final Background

- target_file:
  - `assets/source/world/palace/lumen_palace_audience_hall_bg_v004.png`

```text
Create a commercial-quality opaque full-scene audience hall background for Hero Sword, a Korean mobile fantasy ARPG for Android. This is the final main throne-room background for the palace audience hall scene. Build a bright royal interior that matches the current Lumen world style: blue-and-gold accents, polished pale stone, a centered throne platform, strong symmetry, readable column spacing, and enough lower-floor open space for runtime character sprites, dialogue scenes, and event movement. The scene must feel like a live game background, not a blurry painting, not a cinematic matte, and not a realistic palace photo. It should harmonize with the town fountain, village buildings, and current battle backgrounds. No UI baked into the image, no text, no logo, and no pre-drawn characters.
Important style rule: polished fantasy pixel-art scene with fine-density detail and stable in-game readability on a portrait mobile screen.
```

## 04. Result Clear Screen Final Frame

- target_file:
  - `assets/source/ui/result/result_panel_clear_v005.png`

```text
Create a commercial-quality transparent-background clear-result frame for Hero Sword, a Korean mobile fantasy ARPG for Android. This is the final victory result frame used after a stage clear. The frame must support only the practical information a player actually needs: stage name, difficulty, summary stats, reward area, and three lower action buttons. It should feel celebratory and premium, but cleaner and more restrained than the current version. Remove unnecessary decorative empty slots and avoid overdesigned filler panels. Keep the center readable so runtime text sits cleanly over the battle background. Use a dark-blue and gold fantasy RPG UI family that matches the current battle HUD and world map card style. No baked text, no checkerboard, no logo, no scenery slab, and no blurry concept-art look.
```

## 05. Optional Result Fail Screen Matching Frame

- target_file:
  - `assets/source/ui/result/result_panel_fail_v005.png`

```text
Create a commercial-quality transparent-background fail-result frame for Hero Sword, a Korean mobile fantasy ARPG for Android. This frame must match the final clear-result frame family but with a more restrained and serious mood. It should support the same runtime layout: stage name, difficulty, compact summary stats, short message area, and three lower action buttons. Keep it practical and readable for a real shipped game, not a prototype panel. Use controlled dark stone and metal framing with small muted crimson accents, but do not turn it into a gothic horror UI. No baked text, no checkerboard, no scenery slab, no logo, and no unnecessary empty decorative compartments.
```

## 06. Optional Stage Select Scenic Background Final Polish

- target_file:
  - `assets/source/ui/stage-select/stage_select_scenic_background_v002.png`

```text
Create a commercial-quality opaque scenic background for the Stage Select screen of Hero Sword, a Korean mobile fantasy ARPG for Android. This is a final polish background for a portrait mobile route-selection screen. It should feel brighter, cleaner, and more premium than a temporary planning board, while still leaving enough negative space for the top preview panel, lower route cards, and bottom buttons. Use a fantasy operations-room or campaign route mood with refined lighting and subtle environment storytelling, but do not add giant props directly behind the button areas. No text baked into the scene, no logos, no debug-board feeling, and no blurry matte-painting look.
```
