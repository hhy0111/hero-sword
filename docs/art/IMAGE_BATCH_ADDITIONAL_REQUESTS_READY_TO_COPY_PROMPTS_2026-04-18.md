# IMAGE_BATCH_ADDITIONAL_REQUESTS_READY_TO_COPY_PROMPTS_2026-04-18

This file contains only the next remake prompts for assets that are still unusable, incomplete, or structurally wrong after the latest `image/` review pass.

Excluded on purpose:

- assets that already passed and are already applied in runtime
- assets that are usable but simply not wired to a scene yet
- dialogue portraits that already have their own dedicated remake batches

Every prompt below is fully copy-ready and standalone.

## Global Style Rule

Use this visual rule for every wall, gate, plaza, battle UI frame, palace runtime sheet, and button-frame asset in this file:

- final look must feel compatible with a polished 2D pixel-art mobile fantasy RPG
- use a fine-grain pixel-art feeling, not giant chunky retro pixels
- keep edges clean and runtime-friendly, but avoid blurry semi-realistic painting
- do not bake checkerboard, ground slabs, text, logo, or poster backgrounds into the image
- alpha must be clean and stable enough for direct runtime slicing or placement

## 01. Lumen Village Outer Wall Modular Kit Remake

- target_file:
  - `assets/source/world/town-polish/lumen_outer_wall_modular_kit_v004.png`

```text
Create a commercial-quality transparent-background modular wall kit for Hero Sword, a Korean mobile fantasy ARPG for Android. Asset set: the outer wall of Lumen Village. Build one clean runtime-ready modular kit that includes these separate pieces in one consistent art family: horizontal wall segment, vertical wall segment, bottom wall segment, inner corner wall, outer corner tower wall, narrow parapet top segment, and one clean wall-end cap. The wall must feel like a safe first-town castle wall, not a giant war fortress and not a ruined battlement. Every piece must be isolated on true transparency with no checkerboard baked into the image, no grass slab, no ground background, no sky panel, no characters, no text, and no broken alpha holes. The pieces must be readable on a portrait mobile town screen and tile together cleanly.
Important style rule: refined fine-density pixel-art fantasy environment, not painterly concept art and not oversized retro block pixels.
```

## 02. Lumen Village Right-Edge Stage Gate Remake

- target_file:
  - `assets/source/world/town-polish/lumen_right_edge_stage_gate_v004.png`

```text
Create a commercial-quality transparent-background right-edge stage gate landmark for Hero Sword, a Korean mobile fantasy ARPG for Android. Asset: the stage-exit gate placed on the right side of Lumen Village. Build one fortified stone gate that clearly reads as the route from town into battle stages. It must visually match the Lumen outer-wall modular kit and feel safe, readable, and noble rather than ruined or overly dark. Include believable stone framing, a clean gate opening, and small banner logic without readable text. The result must stand on true transparency with no checkerboard, no background slab, no portal glow baked in, no characters, no logo, and no broken alpha.
Important style rule: refined pixel-art wall/gate work with compact pixel density, not smooth painted fantasy illustration and not giant retro pixels.
```

## 03. Lumen Center Plaza Tile Sheet Remake

- target_file:
  - `assets/source/world/town-polish/lumen_center_plaza_tile_sheet_v004.png`

```text
Create a commercial-quality transparent-background plaza tile sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Asset: the stone ground material for the center plaza of Lumen Village. Build one runtime-ready tile sheet focused on plaza paving only, not a full scenic poster. Include several compatible stone-plaza tile variants that can repeat naturally on a portrait mobile map around the central fountain and NPC routes. The surface should feel brighter, cleaner, and more ceremonial than the normal village road, while still belonging to a first-town environment. No characters, no text, no logo, no scenery rectangle, no checkerboard, and no fake alpha.
Important style rule: polished modern pixel-art ground material with fine pixel density, not blurry painted texture and not giant chunky retro pixels.
```

## 04. Primary UI Button Frame Sheet Remake

- target_file:
  - `assets/source/ui/buttons/ui_button_primary_blank_sheet_v001.png`

```text
Create a commercial-quality transparent-background primary button frame sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Build one clean runtime-ready fantasy button-frame family with no baked text at all. Every button frame must use the same final size: 160x48. Include four states only: normal, hover, pressed, and disabled. This is not a labeled button sheet. It is a blank frame sheet for a multilingual UI system where text will be rendered by code later. Use premium mobile fantasy RPG styling with clean gold-and-dark framing, readable empty center space, and true transparency around every button. No English words, no Korean words, no icons unless they are purely decorative, no checkerboard, no logo, and no blurry edges.
```

## 05. Utility UI Button Frame Sheet Remake

- target_file:
  - `assets/source/ui/buttons/ui_button_utility_blank_sheet_v001.png`

```text
Create a commercial-quality transparent-background utility button frame sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Build one clean runtime-ready fantasy utility button-frame family with no baked text at all. Every frame must use the same final size: 160x48. Include normal, hover, pressed, and disabled states. The style must match the primary button family but feel slightly lighter and more secondary in hierarchy. This is for a multilingual UI system, so leave the center text area empty and readable. No English labels, no Korean labels, no checkerboard, no logo, no background slab, and no blur.
```

## 06. Battle UI Button Frame Sheet Remake

- target_file:
  - `assets/source/ui/buttons/ui_button_battle_blank_sheet_v001.png`

```text
Create a commercial-quality transparent-background battle button frame sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Build one clean runtime-ready battle button-frame family with no baked text at all. Every frame must use the same final size: 160x48. Include normal, active, pressed, and disabled states designed for buttons like AUTO, SKILL, RETREAT, WORLD, STAGES, ENTER, OPEN, and RESULT, but do not place any words into the image. Leave a clean empty center area for multilingual runtime text. The style should feel sharper and more tactical than the general menu buttons while still matching the same UI family. No text, no checkerboard, no logo, no scenery, and no blurry rendering.
```

## 07. Battle Bottom Command Bar Frame Remake

- target_file:
  - `assets/source/ui/battle/battle_bottom_command_bar_frame_v003.png`

```text
Create a commercial-quality transparent-background battle bottom command bar frame for Hero Sword, a Korean mobile fantasy ARPG for Android. Build one elegant lower combat UI frame that is only a background structure, not a button sheet. It must support runtime placement of battle logs, command buttons, auto toggle, and retreat controls, but the frame itself must contain no button labels and no pre-rendered command words. Leave readable empty zones for code-rendered buttons and text. Use a premium mobile fantasy RPG style with dark stone, controlled gold trim, and true transparency around the outer silhouette. No checkerboard, no text, no icons that imply a specific command, no logo, and no scenery block.
Important style rule: refined UI art with a subtle pixel-art compatibility, not painterly interface illustration and not giant retro pixels.
```

## 08. Battle Result Clear Frame Remake

- target_file:
  - `assets/source/ui/result/result_panel_clear_v003.png`

```text
Create a commercial-quality transparent-background victory result frame for Hero Sword, a Korean mobile fantasy ARPG for Android. Build one clear-result frame for the post-battle success screen. The frame must hold reward rows, stage clear details, and event/story text while still allowing the battle background to remain visible behind it. Use a noble celebratory fantasy style with readable empty panels and true transparency around the outside. Do not bake in the words CLEAR, VICTORY, RESULT, or any other text. No checkerboard, no logo, no scenery slab, and no blurry rendering.
Important style rule: elegant UI frame compatible with a polished pixel-art RPG presentation, not a painted poster and not oversized retro pixels.
```

## 09. Palace Core Runtime NPC Sheet Remake

- target_file:
  - `assets/source/world/palace/lumen_palace_core_runtime_npc_sheet_v002.png`

```text
Create a commercial-quality transparent-background palace core runtime NPC sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Characters included in one consistent runtime sheet family: King Aldren, Queen Regent Celestine, Captain Rowan, and Archivist Mirel. These are in-game animated NPC sprites, not dialogue portraits. Build clean small-scale pixel-art fantasy character sprites suitable for direct runtime slicing on a portrait mobile game screen. Each frame must contain exactly one clear character only, with no ghosting, no blur trails, no checkerboard, no scenery, and no overlapping figures. At minimum, provide clean states for idle, talk, and walk, and structure the sheet so it can be sliced reliably. The four characters must remain visually distinct: king in royal armor/crown, queen in regal silver-blue attire, captain in disciplined guard armor, archivist in scholarly noble attire. No text, no logos, and no soft painterly blur.
Important style rule: this must be true refined runtime pixel-art sprite work, not portrait illustration and not giant chibi blocks.
```

## 10. Optional Follow-Up: Palace Exterior Entry Scene

- target_file:
  - `assets/source/world/palace/lumen_palace_exterior_entry_scene_v002.png`

```text
Create a commercial-quality transparent-background palace exterior landmark for Hero Sword, a Korean mobile fantasy ARPG for Android. Asset: the main exterior palace landmark north of Lumen Village, designed for direct placement in a portrait mobile town or court scene. Build a wide, royal, blue-and-gold palace silhouette that clearly reads as the king's residence and feels visually consistent with the already approved Lumen Palace gate and hall style. Keep the silhouette clean and usable for runtime placement with true transparency and no baked sky, no ground slab, no checkerboard, no logo, and no characters.
Important style rule: refined fantasy pixel-art environment with fine density, not painterly palace concept art and not giant retro pixels.
```
