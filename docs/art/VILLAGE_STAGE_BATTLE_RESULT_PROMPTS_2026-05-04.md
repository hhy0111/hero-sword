# Village / Stage / Battle / Result Image Prompts - 2026-05-04

- summary:
- inputs:
- decisions:
- todo:
- risks:
- artifacts_changed:
- handoff_to:
- handoff_notes:
- done_check:

## Context

The current village, stage selection, battle feedback, and result screens are being cleaned up in code first. Do not fill missing art with unrelated temporary images. If the following assets are not ready, keep the runtime fallback procedural and visually restrained.

## 01. Village Organic Detail Tile Kit

Create a modular pixel-art village detail kit for Hero Sword, a Korean Android fantasy ARPG.

The assets must match a slightly angled top-down RPG town map and should make the town feel less like a square grid.

Include separated transparent PNG pieces:

- small park grass edge tiles, flower borders, trimmed hedge corners
- farm soil rows, tilled field strips, small crop sprouts, harvest crates
- curved stone road edge tiles and narrower side-lane road caps
- palace approach road embellishments: low banners, trimmed shrubs, small lantern posts
- market-side ground clutter that does not block character readability

Requirements:

- refined pixel art / dot-game style
- readable at 32x32 and 64x64 tile scale
- no baked text, no UI, no logo, no watermark
- transparent background for props; seamless sheets for tiles
- do not include full buildings or characters in this kit

Target runtime folder:

- `public/assets/world/town/village-refresh/`

## 02. Palace Gate Dot-Tile Exterior

Create a palace gate exterior for the town north approach.

The current runtime can crop an existing palace image, but final art should be a proper dot-game / pixel-art gate that reads well inside a top-down town map.

Needed pieces:

- main palace gate facade with visible entrance arch
- left/right low wall extensions
- staircase/threshold tile aligned to a vertical town road
- blue-gold banners and small lamp accents as separate transparent props
- optional top roof/tower cap pieces that can be partially offscreen

Requirements:

- refined pixel art / dot-game style, not painterly illustration
- designed for a 360x640 portrait camera where only the lower gate may be visible
- no shop-like storefront silhouette
- no baked text, no logo, no watermark
- transparent background for gate/facade pieces

Target runtime folder:

- `public/assets/world/palace/town-exterior/`

## 03. Village Birds And Small Animals

Create a small ambient creature sprite set for the town.

Needed subjects:

- 2-frame small bird hop/fly idle
- 2-frame chicken peck/walk
- 2-frame small dog walk/idle
- 2-frame cat sit/walk

Requirements:

- 2-head or smaller chibi scale appropriate for town ambience
- top-down RPG pixel-art view, not side-view platformer sprites
- each creature must be isolated on transparent background
- no oversized mascot styling
- no shadows baked into the sprite if separate shadow can be drawn in-game

Target runtime folder:

- `public/assets/world/town/ambient-creatures/`

## 04. Stage Select Status UI Icons

Create compact stage-selection UI icons that replace generic dots.

Needed icons:

- enterable stage marker: green-gold route seal
- locked stage marker: muted iron lock seal
- selected stage marker: glowing route seal with gold rim
- boss stage marker: red-gold elite route crest
- right-side scroll thumb and scroll rail ornaments

Requirements:

- fantasy UI pixel art, transparent PNG
- readable at 18-28 px in a 360x640 portrait canvas
- no text inside the icons
- no star-rating icons mixed into these state icons

Target runtime folder:

- `public/assets/ui/stage-select/`

## 05. Battle Hit Feedback Effects

Create transparent effect sprite sheets for clearer hit feedback.

Needed effects:

- party hit impact flash: short red-orange burst, 4 frames
- enemy hit impact flash: gold-white slash burst, 4 frames
- damage shock ring: expanding ring, 4 frames

Requirements:

- transparent PNG sprite sheets
- additive-friendly bright edges but not full-screen glow
- each frame centered with equal padding
- no numbers or text baked into the image

Target runtime folder:

- `public/assets/effects/battle/`

## 06. Result Reward Icons

Create compact result-screen reward icons.

Needed icons:

- gold reward coin stack
- character EXP scroll/glow icon
- stage clear ribbon
- stage list/navigation icon

Requirements:

- fantasy UI pixel art
- readable at 20-32 px
- transparent background
- no text baked into the image

Target runtime folder:

- `public/assets/ui/result/`

## 07. Lumen Palace Exterior Pixel Replacement

Create a new transparent-background palace exterior for Hero Sword, a Korean Android fantasy ARPG.

The current palace image reads like a separate high-detail illustration and does not match the town buildings. Rebuild it as runtime-ready refined pixel art / dot-game art that belongs to the same visual family as the village weapon shop, armor shop, forge, and relic shop.

Needed output:

- one main palace exterior facade asset
- matching left and right wall/wing extension pieces
- entrance stair/threshold piece aligned to the vertical town road
- optional small royal flag, lamp, and shrub props as separate transparent pieces

Visual requirements:

- top-down-compatible 2.5D RPG town perspective
- compact silhouette that fits a 360x640 portrait camera without covering nearby NPCs
- readable palace identity: blue-gold roof accents, pale stone, ceremonial arch, not a generic shop
- crisp pixel-art edges, controlled detail density, no painterly concept-art brushwork
- true transparent background only
- no sky card, no scenery rectangle, no matte block, no characters, no text, no logo, no watermark

Target runtime folder:

- `public/assets/world/palace/town-exterior/`

Suggested filename:

- `lumen_palace_exterior_pixel_runtime_v006.png`

## 08. Palace Audience Hall Carpet And Central Ornament Kit

Create a pixel-art palace interior decoration kit for the Lumen Palace audience hall.

The current palace interior uses flat blue runtime rectangles that read like placeholder UI bars. Replace that idea with proper royal-hall floor decoration that still leaves clear walkable space for characters.

Needed output:

- long royal carpet strips and end caps, top-down-compatible
- gold-trimmed central aisle ornament or crest medallion
- subtle bench/pew alternatives if seating is needed, but not plain blue rectangles
- small edge trims for the carpet so the hall reads as intentional architecture

Visual requirements:

- refined fantasy pixel art matching the town and palace NPC sprite scale
- royal blue with gold trim is allowed, but the asset must read as carpet/ornament, not UI
- designed for a portrait mobile interior scene
- transparent background for strips/props
- no baked characters, no UI text, no logo, no painterly blur, no oversized glowing slab

Target runtime folder:

- `public/assets/world/palace/decor/`

Suggested filenames:

- `royal_carpet_strip_v006.png`
- `royal_carpet_endcap_v006.png`
- `palace_center_crest_medallion_v006.png`
