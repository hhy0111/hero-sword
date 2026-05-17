# REQUIRED_NEW_ART_READY_TO_COPY_PROMPTS_2026-04-20

This file contains only the art prompts that are still truly required after the `2026-04-19` current-image-first cleanup pass.

Excluded on purpose:

- screens that still need code/layout polish but do not need new images
- images that were only optional luxury polish
- portrait batches and other already-separated prompt groups

Current-image-only cleanup is still valid for:

- `PartyScene`
- `EquipmentScene`
- `BattleScene`
- `PalaceScene`
- `WorldMapScene`
- `StageSelectScene`
- `ShopScene`
- `ResultScene`

The only hard remaining environment-art blocker is the final `square-tile south wall + south gate + corner set` for Lumen Village.

Global rule for the prompt below:

- final look must fit a polished 2D mobile fantasy RPG with refined fine-density pixel art
- do not generate blurry semi-realistic concept art
- do not generate giant chunky retro pixels
- no checkerboard baked into the image
- no white matte background
- keep alpha clean and stable for runtime placement
- no logos, no UI text, no placeholder markers, and no pre-baked scene composition

## 01. Lumen Village South Gate + Square Wall Tile Set

- target_file:
  - `assets/source/world/town-polish/lumen_village_square_wall_south_gate_tile_set_v003.png`

```text
Create a commercial-quality transparent-background square wall tile set and south-gate set for Hero Sword, a Korean mobile fantasy ARPG for Android. This replaces the still-unconvincing lower village boundary in Lumen Village.

Do NOT build a complex curved or sculpted wall kit. Build a simple square-tile castle wall system instead. The wall body should be based on clean rectangular stone blocks that can be repeated without distortion. The set must include: square wall fill tile, horizontal wall top tile, vertical wall side tile, inner corner cap, outer corner cap, one corner-tower variation for the four map corners, one clean south-facing main gate module, and one short gate-join wall piece for both sides of the gate.

The wall should feel like a bright, safe, first-town castle perimeter: pale stone, rectangular masonry, clean construction, practical fantasy design, polished but not royal-palace luxury. The gate should feel readable and welcoming for an early-game hub, not like a ruined fortress and not like a dark war castle. It must clearly read as a SOUTH / LOWER-SCREEN stage exit on a portrait mobile map.

Each piece must be isolated on true transparency with no baked ground, no grass slab, no plaza tile, no sky, no characters, no signage, and no text. The pieces must tile cleanly together in a simple rectangular town boundary, especially along the lower village edge. Avoid broken alpha, halo edges, curved silhouette mismatches, or fuzzy painterly outlines.

Important style rule: refined modern fantasy pixel-art environment, fine pixel density, clean runtime readability on mobile, not painterly illustration and not oversized retro pixels.
```
