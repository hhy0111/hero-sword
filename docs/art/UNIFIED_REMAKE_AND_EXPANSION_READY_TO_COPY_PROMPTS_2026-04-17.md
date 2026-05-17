# UNIFIED_REMAKE_AND_EXPANSION_READY_TO_COPY_PROMPTS_2026-04-17.md

This file is the single prompt source for the next environment/UI image-generation wave.

Included on purpose:

- previously broken or unusable assets that must be remade
- newly required assets for:
  - improved town walls and right-side stage gate presentation
  - a less crude world-route screen
  - a less crude battle / result presentation
  - the new Lumen Palace expansion north of town

Excluded on purpose:

- already approved dialogue portrait remakes
- already working world-region plate images
- runtime character animation sheets

Every prompt below is fully copy-ready and standalone.

## Global Environment Style Rule

Use this visual rule for every town, wall, gate, fountain, world-route, battle-background, and palace environment asset in this file:

- final look must feel compatible with a polished 2D pixel-art mobile RPG
- use a fine-grain pixel-art feeling, not giant chunky retro pixels
- pixel density should feel tight and commercially finished, similar to modern high-quality pixel fantasy environments
- keep edges readable and tile/runtime-friendly, but do not turn the image into blurry semi-realism
- avoid painterly poster rendering, over-smoothed realism, and oversized block pixels
- whenever possible, preserve a subtle pixel-grid impression that still reads cleanly on a portrait mobile screen

## 01. World Landmark Sheet Remake

- reason:
  - previous landmark sheet was baked with checkerboard or unusable alpha
- target_file:
  - `assets/source/world-map/landmarks/world_landmark_sheet_v003.png`

```text
Create a commercial-quality transparent-background world-landmark sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Build one clean runtime-usable landmark image set for these seven world-map landmarks: Greenhaven watchtower, Ironrich mountain forge tower, Bluemist coastal shrine beacon, Frostbell fortress, Sunscar relic tower, Lumina sanctuary citadel, and the Black Gate final camp. Each landmark must be isolated on true transparent background with no checkerboard baked into the image, no scenery rectangle, no poster background, no characters, no text, and no logo. The silhouettes must read clearly as clickable world-map node art on a portrait mobile screen.
```

## 02. Lumen Village Wall And Gate Modular Kit Remake

- reason:
  - current town wall presentation is still incomplete and the stage gate sits on the right side, so the runtime needs a real modular wall kit instead of one mixed temporary set
- target_file:
  - `assets/source/world/town-polish/lumen_wall_gate_modular_kit_v003.png`

```text
Create a commercial-quality transparent-background modular wall-and-gate kit for Hero Sword, a Korean mobile fantasy ARPG for Android. Location: Lumen Village outer wall and right-edge stage gate. Build one runtime-ready kit sheet that includes these pieces in one consistent art family: horizontal stone wall segment, vertical stone wall segment, outer corner tower piece, inner corner wall piece, right-edge stage gate arch, matching gate-side tower, small banner attachment pieces without readable text, and one clean top-wall parapet segment. The style must feel like a safe first-town castle wall, not a giant dark fortress. Every piece must be isolated on true transparency with no scenery slab, no checkerboard, no ground background, no portal glow, and no broken alpha inside the silhouette. The kit must support a portrait mobile town map where the stage gate lives on the right wall.
Important style rule: this must read as refined pixel-art environment work with fine pixel density, not a painterly concept painting and not oversized retro block pixels.
```

## 03. Lumen Plaza Ground Remake

- reason:
  - previous plaza image was wrong-type or mismatched for runtime use
- target_file:
  - `assets/source/world/town-polish/lumen_center_plaza_runtime_v003.png`

```text
Create a commercial-quality transparent-background runtime plaza-ground image for Hero Sword, a Korean mobile fantasy ARPG for Android. Asset: the center plaza area of Lumen Village. Build a clean top-down or slightly game-angled stone plaza ground piece meant to sit under the central fountain and NPC movement routes. Use practical first-town plaza logic with readable borders and grounded fantasy mood, but keep it useful for runtime layering rather than poster scenery. No characters, no text, no logo, no checkerboard, no fake alpha, and no painted landscape background.
Important style rule: keep a subtle modern pixel-art surface language with compact pixels and clean tile readability, not blurred semi-realism and not huge chunky pixels.
```

## 04. Lumen Fountain Base Remake

- reason:
  - fountain still needs a cleaner runtime-ready image with no contamination
- target_file:
  - `assets/source/world/town-polish/lumen_fountain_base_runtime_v003.png`

```text
Create a commercial-quality transparent-background fountain base image for Hero Sword, a Korean mobile fantasy ARPG for Android. Asset: the central fountain base in Lumen Village. Build a compact first-town fountain with readable stone basin, pedestal, and clean silhouette suitable for direct runtime placement on a portrait mobile village screen. The image must have true transparent background and must not include plaza tiles, scenery, checkerboard, text, logo, characters, or broken alpha holes.
Important style rule: the fountain must fit a refined pixel-art town environment with fine pixel density, not painterly illustration and not oversized retro pixels.
```

## 05. Lumen Fountain Water Layer Remake

- reason:
  - fountain water still needs a dedicated clean overlay layer
- target_file:
  - `assets/source/world/town-polish/lumen_fountain_water_runtime_v003.png`

```text
Create a commercial-quality transparent-background fountain water image or short runtime sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Asset: the water layer for the central Lumen Village fountain. Build a restrained safe-town fountain water effect with a clean center spout, readable basin water, and subtle ripple logic. This must layer over a separate fountain base and must not look like a portal or giant magic explosion. No scenery block, no checkerboard, no blur cloud, no text, no logo, and no broken alpha.
Important style rule: keep the water readable in a fine-grain pixel-art environment style. No painted splash illustration and no giant blocky retro pixels.
```

## 06. Safe Warp Marker Remake

- reason:
  - earlier entrance and portal effects were judged broken or visually unusable
- target_file:
  - `assets/source/world/town-polish/lumen_safe_warp_marker_runtime_v003.png`

```text
Create a commercial-quality transparent-background safe warp marker sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Build subtle entrance indicators for shop doors, interior exits, palace gates, and the stage gate. This is not a giant fantasy portal. Use quiet floor rings, soft route glows, and small movement markers that simply tell the player "walk here to move." The result must be elegant, readable, and runtime-usable on top of village ground textures with true transparency and no baked checkerboard, no scenery rectangle, no orange-white explosion, and no broken alpha.
```

## 07. World Route Full-Screen Background Replacement

- reason:
  - the current world-route screen still feels too crude and panel-heavy
- target_file:
  - `assets/source/world-map/ui/world_route_screen_background_v001.png`

```text
Create a commercial-quality portrait mobile world-route screen background for Hero Sword, a Korean mobile fantasy ARPG for Android. Build one full-screen background image specifically for the world-route selection scene, not a poster and not a plain dark panel. The composition must feel premium and game-ready: elegant dark fantasy frame logic, readable center space for six region cards, a large top preview area, controlled contrast, and a noble fantasy travel-map mood. Do not bake in UI text, button labels, region names, characters, or logos. Leave clean safe space for runtime overlays. Avoid flat beige slabs, cheap gray panel look, and clutter.
Important style rule: this should still feel compatible with a fine-density pixel-art game UI background, not a painterly matte painting and not giant retro pixels.
```

## 08. World Route Node Card Frame Sheet

- reason:
  - the region cards still rely on crude rectangles and need image-based polish
- target_file:
  - `assets/source/world-map/ui/world_route_node_frame_sheet_v001.png`

```text
Create a commercial-quality transparent-background world-route node frame sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Build a clean card-frame family for region thumbnails on a portrait mobile world-route screen. Include matching states for open, locked, selected, and disabled cards. These are image frames only, not full posters. Keep strong readability around a small landscape preview image and a short label area below it. Use elegant dark-stone and brushed-gold fantasy styling, but avoid over-ornament, checkerboard, text, logos, or background scenery baked into the frame.
Important style rule: styling should harmonize with a modern pixel-art interface and environment set. Avoid blurry painted UI and avoid giant chunky retro pixels.
```

## 09. English Primary Button Sheet Remake

- reason:
  - previous primary button sheet was unusable due to contamination and weak slicing quality
- target_file:
  - `assets/source/ui/buttons/ui_button_primary_sheet_v003.png`

```text
Create a commercial-quality transparent-background mobile RPG primary button sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Build a clean English button sheet where every labeled button uses the same final size: 160x48. Include normal, hover, pressed, and disabled states for MENU, PARTY, GEAR, GACHA, HOME, OPTIONS, SHOP, EXIT, VILLAGE, WORLD, STAGES, ENTER, START, OPEN, and BACK. Use a premium fantasy RPG style suitable for portrait mobile UI. No Korean text, no checkerboard, no poster background, no logos, and no clutter that reduces readability.
```

## 10. English Utility Button Sheet Remake

- reason:
  - previous utility button sheet was unusable due to contamination and weak slicing quality
- target_file:
  - `assets/source/ui/buttons/ui_button_utility_sheet_v003.png`

```text
Create a commercial-quality transparent-background mobile RPG utility button sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Build a clean English button sheet where every labeled button uses the same final size: 160x48. Include normal, hover, pressed, and disabled states for BUY, RESTORE, EQUIP, CLEAR, SINGLE, TEN, PREV, NEXT, RETRY, CONFIRM, CANCEL, CLOSE, DIFFICULTY, and AD. The sheet must match the primary button family exactly and be directly sliceable for runtime use. No checkerboard, no Korean text, no scenery background, no logos, and no noisy ornament.
```

## 11. English Battle Button Sheet Remake

- reason:
  - previous battle button sheet was unusable due to contamination and weak slicing quality
- target_file:
  - `assets/source/ui/buttons/ui_button_battle_sheet_v003.png`

```text
Create a commercial-quality transparent-background mobile RPG battle button sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Build a clean English button sheet where every labeled button uses the same final size: 160x48. Include normal, hover, pressed, and disabled states for AUTO, SKILL, RETREAT, WORLD, STAGES, ENTER, OPEN, and RESULT. The style must match the primary and utility button families exactly. No checkerboard, no Korean text, no scenery background, no logos, and no clutter that hurts legibility.
```

## 12. Battle Top HUD Frame

- reason:
  - battle screen top UI still feels too flat and crude
- target_file:
  - `assets/source/ui/battle/battle_top_info_frame_v002.png`

```text
Create a commercial-quality transparent-background battle top HUD frame for Hero Sword, a Korean mobile fantasy ARPG for Android. Build one elegant upper UI frame for stage title, battle timer, enemy name, and enemy HP display. The frame must feel like premium mobile fantasy RPG HUD art rather than a flat beige panel. Keep the center readable for text overlays and enemy status bars. Use restrained dark-stone and gold fantasy styling with clean alpha around the frame. No baked text, no logos, no scenery block, and no checkerboard.
Important style rule: the frame should visually match a refined pixel-art game presentation, not smooth semi-realistic painted UI and not oversized chunky pixel buttons.
```

## 13. Battle Bottom Command Frame

- reason:
  - battle screen bottom UI still feels too flat and crude
- target_file:
  - `assets/source/ui/battle/battle_bottom_command_frame_v002.png`

```text
Create a commercial-quality transparent-background battle bottom command frame for Hero Sword, a Korean mobile fantasy ARPG for Android. Build one elegant lower UI frame for battle logs, ally status readout, skill commands, auto button, and retreat button. This must feel like a premium mobile RPG combat HUD and must avoid the look of a plain beige rectangle. Leave clean safe areas for runtime text and buttons. Use subtle fantasy ornament, readable dark framing, and true transparency around the outer silhouette. No baked text, no checkerboard, no scenery, and no logos.
Important style rule: the visual language must stay compatible with a fine-density pixel-art combat presentation, not painterly illustration and not giant retro block pixels.
```

## 14. Ally HP Bar Frame

- reason:
  - current ally HP bars look too bare
- target_file:
  - `assets/source/ui/battle/battle_hp_bar_frame_ally_v002.png`

```text
Create a commercial-quality transparent-background ally HP bar frame for Hero Sword, a Korean mobile fantasy ARPG for Android. Build a clean fantasy-RPG frame for player-party HP bars, sized for portrait mobile combat UI. It must feel readable, premium, and slightly compact, with a supportive ally-side identity. Use a restrained decorative style and true transparency around the frame. No text, no logos, no checkerboard, and no scenery background.
```

## 15. Enemy HP Bar Frame

- reason:
  - current enemy HP bars look too bare
- target_file:
  - `assets/source/ui/battle/battle_hp_bar_frame_enemy_v002.png`

```text
Create a commercial-quality transparent-background enemy HP bar frame for Hero Sword, a Korean mobile fantasy ARPG for Android. Build a clean fantasy-RPG frame for enemy HP bars, sized for portrait mobile combat UI. It must feel more threatening than the ally frame while staying readable and not overdesigned. Use a restrained hostile-side identity with true transparency around the frame. No text, no logos, no checkerboard, and no scenery background.
```

## 16. Battle Result Clear Frame

- reason:
  - result screen still feels too flat and panel-based
- target_file:
  - `assets/source/ui/result/result_panel_clear_v002.png`

```text
Create a commercial-quality transparent-background result frame for Hero Sword, a Korean mobile fantasy ARPG for Android. Build one clear-result frame for the post-battle victory screen. The frame must hold reward rows, clear time, stars, and join-event story text while letting the stage background still feel present. Use noble celebratory fantasy styling, readable empty zones, and true transparency around the outer silhouette. No baked text, no logos, no checkerboard, and no scenery block.
```

## 17. Battle Result Fail Frame

- reason:
  - fail result screen still feels too flat and panel-based
- target_file:
  - `assets/source/ui/result/result_panel_fail_v002.png`

```text
Create a commercial-quality transparent-background result frame for Hero Sword, a Korean mobile fantasy ARPG for Android. Build one fail-result frame for the post-battle defeat screen. The frame must hold retry guidance, clear condition failure notes, and reward summary while allowing the stage background to remain visible. Use a somber but readable fantasy styling, not horror and not cheap dark fog. Keep clean safe zones for runtime text and buttons, with true transparency around the frame. No baked text, no checkerboard, no logos, and no scenery slab.
```

## 18. Lumen Palace Exterior

- reason:
  - new palace expansion north of town needs a main exterior landmark
- target_file:
  - `assets/source/world/palace/lumen_palace_exterior_v001.png`

```text
Create a commercial-quality transparent-background palace exterior for Hero Sword, a Korean mobile fantasy ARPG for Android. Asset: the main exterior building of Lumen Palace, the royal residence north of Lumen Village. Build a readable top-down-compatible or game-angled palace facade suitable for direct runtime placement in a portrait mobile town map. The palace must feel royal, wide, and prestigious, but still fit the existing Lumen Village world. Use believable stone massing, banners without readable text, and a noble silhouette. No checkerboard, no painted sky slab, no text, no logos, no characters, and no broken alpha.
Important style rule: this must match the town as refined pixel-art environment art with fine pixel density, not painterly palace concept art and not oversized retro pixels.
```

## 19. Lumen Palace North Gate

- reason:
  - the palace needs a distinct gate separate from the stage gate
- target_file:
  - `assets/source/world/palace/lumen_palace_gate_v001.png`

```text
Create a commercial-quality transparent-background palace gate landmark for Hero Sword, a Korean mobile fantasy ARPG for Android. Asset: the north-side entrance gate of Lumen Palace. Build a fortified royal gate that clearly reads as the path from the village into the palace district. The design should feel noble and ceremonial, not war-torn and not identical to the stage gate. Use clean banners without readable text, stone arch logic, and a readable silhouette for portrait mobile runtime use. No checkerboard, no scenery rectangle, no text, no logos, and no broken alpha.
Important style rule: keep a fine-grain pixel-art feel consistent with the village wall kit. No painterly gate illustration and no giant chunky pixels.
```

## 20. Lumen Palace Outer Court Ground

- reason:
  - the palace district needs its own ground identity instead of reused village road tiles
- target_file:
  - `assets/source/world/palace/lumen_palace_outer_court_ground_v001.png`

```text
Create a commercial-quality transparent-background palace outer-court ground image for Hero Sword, a Korean mobile fantasy ARPG for Android. Build a clean runtime-ready stone court surface for the palace district north of Lumen Village. The court should feel broader, more formal, and more royal than the village plaza, with clean stone rhythm and room for NPC movement and event staging. No checkerboard, no painted environment slab, no characters, no text, and no broken alpha.
Important style rule: this must read as refined pixel-art ground work with compact pixel density suitable for runtime exploration, not soft painted floor art and not giant retro tiles.
```

## 21. Lumen Palace Royal Hall Background

- reason:
  - palace story scenes need a main interior hall background
- target_file:
  - `assets/source/world/palace/lumen_palace_royal_hall_bg_v001.png`

```text
Create a commercial-quality portrait interior background for Hero Sword, a Korean mobile fantasy ARPG for Android. Location: Lumen Palace royal audience hall. Build a premium story-scene and gameplay-ready hall background with throne-side depth, polished stone, royal banners, and enough clean mid-ground space for runtime NPCs and dialogue scenes. Do not bake in UI text, characters, or logos. The composition must work on a portrait mobile screen and must feel like a functioning royal chamber, not a concept-art poster.
Important style rule: the environment must stay compatible with a fine-density pixel-art game world. Avoid painterly matte-painting softness and avoid oversized retro pixels.
```

## 22. Lumen Palace Throne Platform

- reason:
  - the audience hall needs a separate throne platform layer for runtime staging
- target_file:
  - `assets/source/world/palace/lumen_palace_throne_platform_v001.png`

```text
Create a commercial-quality transparent-background throne platform asset for Hero Sword, a Korean mobile fantasy ARPG for Android. Asset: the throne dais and platform used inside the Lumen Palace audience hall. Build one separate runtime layer with steps, dais massing, and throne silhouette suitable for composition over a separate hall background. It should feel regal and serious, but not absurdly oversized. No checkerboard, no scenery slab, no text, no logos, and no characters.
```

## 23. Lumen Palace Archive Corridor Background

- reason:
  - palace story expansion needs a second interior space beyond the throne room
- target_file:
  - `assets/source/world/palace/lumen_palace_archive_corridor_bg_v001.png`

```text
Create a commercial-quality portrait interior background for Hero Sword, a Korean mobile fantasy ARPG for Android. Location: the archive corridor inside Lumen Palace. Build a noble scholarly hall with shelves, sealed records, royal stone architecture, and enough clean floor space for runtime NPC movement and dialogue scenes. Keep the atmosphere political and secretive rather than dusty horror. No UI text, no logos, and no characters baked into the image.
Important style rule: keep the rendering in a refined pixel-art-compatible environment style with subtle pixel structure, not soft painted concept art and not giant block pixels.
```

## 24. Palace Core NPC Dialogue Portrait Set

- reason:
  - palace story scenes need core royal portraits immediately
- target_files:
  - `assets/source/dialogue/palace/npc_king_aldren_dialog_v001.png`
  - `assets/source/dialogue/palace/npc_queen_regent_celestine_dialog_v001.png`
  - `assets/source/dialogue/palace/npc_captain_rowan_dialog_v001.png`
  - `assets/source/dialogue/palace/npc_archivist_mirel_dialog_v001.png`

```text
Create a commercial-quality square dialogue portrait set for Hero Sword, a Korean mobile fantasy ARPG for Android. Build four separate face-first or chest-up portraits on true transparent background for these palace story characters: King Aldren, Queen Regent Celestine, Captain Rowan of the palace guard, and Archivist Mirel. Each portrait must read instantly as a distinct story character suitable for a bottom dialogue window on a portrait mobile screen. Match a serious royal-fantasy world, avoid full-body framing, avoid poster scenery, avoid text and logos, and keep each portrait ready for runtime dialogue use.
```

## 25. Palace Core Runtime NPC Sheet

- reason:
  - palace exploration also needs matching runtime NPC visuals
- target_file:
  - `assets/source/world/palace/npcs/lumen_palace_core_npc_runtime_sheet_v001.png`

```text
Create a commercial-quality transparent-background runtime NPC sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Build one consistent palace NPC runtime sheet containing four separate standing characters suitable for extraction into movement or idle sprites: King Aldren, Queen Regent Celestine, Captain Rowan, and Archivist Mirel. The style must fit a 2D fantasy mobile RPG town-and-palace exploration scene. Keep readable silhouettes, costume identity, and clean alpha around each figure. No checkerboard, no text, no logos, and no poster background.
```
