# Town / Shop / Palace Next Image Prompts - 2026-05-04

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

The current shop counter images are directionally correct, but runtime placement makes them too large in the interior rooms. Scale and layering should be fixed in code first. New prompt work is needed for final-quality modular interior tiles, shop product icons, palace exterior/path assets, palace interior tile assets, and NPC event markers.

Do not add random placeholder images. If an asset below is missing, leave the corresponding runtime visual empty or procedural until the proper image is produced.

## 01. Shop Interior Modular Tile Kit V2

Create a production-ready modular shop interior tile kit for Hero Sword, a Korean mobile fantasy ARPG for Android.

The style must be refined pixel art / dot-game art with compact pixel density, compatible with a slightly angled top-down RPG map. The kit should replace repetitive temporary indoor floors and support five shop interiors without looking like a flat grid test room.

Include separated tile pieces for:

- weapon shop: warm wood floor, reinforced weapon-wall trim, subtle floor scuffs
- armor shop: pale stone floor, fitting-room wall trim, muted metal accents
- supply shop: darker wood floor, simple merchant shelving wall trim
- forge shop: workshop stone floor, soot marks, metal floor plates
- relic shop: clean brick floor, faint old-inlay trim, subtle mystical accent
- shared rear wall tiles, top wall trim, corner wall caps, baseboard strips
- counter shadow tile and exit threshold tile

Requirements:

- readable at 32x32 and 64x64 tile scale
- seamless tile repetition with natural variation
- no characters, no NPCs, no UI, no baked text, no logo, no watermark
- no large painterly floor slab, no photographic texture, no oversized retro pixels
- transparent background for modular pieces or an organized sheet with enough padding for slicing

Target runtime files:

- `public/assets/world/town/tiles/indoor/wood_planks.png`
- `public/assets/world/town/tiles/indoor/dark_wood_planks.png`
- `public/assets/world/town/tiles/indoor/warm_stone.png`
- `public/assets/world/town/tiles/indoor/workshop_stone.png`
- `public/assets/world/town/tiles/indoor/clean_brick.png`
- `public/assets/world/town/tiles/indoor/worn_brick.png`
- optional split detail tiles under `public/assets/world/town/tiles/indoor/details/`

## 02. Shop Counter Merchant Size Reference Set

Create a consistent static shop counter merchant set for Hero Sword interiors.

Each image must contain one merchant behind one counter/table. These are static counter images, not animated sprite sheets. The image must be designed to display at about 150-190 px wide inside a 360x640 portrait gameplay canvas without covering the player or hiding the merchant face behind the counter.

Create five transparent-background PNGs:

- weapon merchant with compact weapon counter
- armor merchant with fitting counter
- supply merchant with goods counter
- blacksmith with workbench/anvil counter
- relic curator with relic display counter

Requirements:

- 2-head / chibi-adjacent runtime proportion, not tall full-body art
- merchant face and hands visible above the counter
- counter silhouette clear but not taller than the character chest
- no animation frames, no background floor, no wall, no text, no labels
- true transparent background only
- include enough transparent padding so the game can crop/scale cleanly

Target runtime files:

- `public/assets/world/town/shop-refresh/merchants/weapon_counter.png`
- `public/assets/world/town/shop-refresh/merchants/armor_counter.png`
- `public/assets/world/town/shop-refresh/merchants/item_counter.png`
- `public/assets/world/town/shop-refresh/merchants/forge_counter.png`
- `public/assets/world/town/shop-refresh/merchants/relic_counter.png`

## 03. Shop Product And Furniture Detail Icon Set

Create a transparent-background shop product and furniture icon set for Hero Sword.

These replace broken or low-quality detail images in shop item popups and inventory rows. The images must not be reused from unrelated weapon/shop icons.

Create thumbnail and detail versions for:

- weapon edge oil / blade care kit
- weapon hall banner rack
- armor padding roll
- wardkeeper cloak stand
- fatigue tonic small
- fatigue tonic large
- forge repair box
- forge anvil display
- relic sigil bundle
- relic archive lamp

Requirements:

- fantasy mobile RPG item icon style
- 32x32 readable thumbnail and 96x96 detail preview versions
- detail preview must be centered and not clipped inside a square frame
- furniture items must look like furniture/decor, not a generic house icon
- no baked text, no price, no currency symbols, no watermark
- transparent background only

Target runtime files:

- `public/assets/world/town/shop-refresh/items/consumable_amber_oil_thumb.png`
- `public/assets/world/town/shop-refresh/items/consumable_amber_oil_detail.png`
- `public/assets/world/town/shop-refresh/items/icon_weapon_shop_thumb.png`
- `public/assets/world/town/shop-refresh/items/icon_weapon_shop_detail.png`
- `public/assets/world/town/shop-refresh/items/supply_padding_roll_thumb.png`
- `public/assets/world/town/shop-refresh/items/supply_padding_roll_detail.png`
- `public/assets/world/town/shop-refresh/items/icon_armor_shop_thumb.png`
- `public/assets/world/town/shop-refresh/items/icon_armor_shop_detail.png`
- `public/assets/world/town/shop-refresh/items/consumable_blue_vial_thumb.png`
- `public/assets/world/town/shop-refresh/items/consumable_blue_vial_detail.png`
- `public/assets/world/town/shop-refresh/items/consumable_blue_bottle_thumb.png`
- `public/assets/world/town/shop-refresh/items/consumable_blue_bottle_detail.png`
- `public/assets/world/town/shop-refresh/items/consumable_tool_box_thumb.png`
- `public/assets/world/town/shop-refresh/items/consumable_tool_box_detail.png`
- `public/assets/world/town/shop-refresh/items/forge_anvil_token_thumb.png`
- `public/assets/world/town/shop-refresh/items/forge_anvil_token_detail.png`
- `public/assets/world/town/shop-refresh/items/relic_seal_thumb.png`
- `public/assets/world/town/shop-refresh/items/relic_seal_detail.png`
- `public/assets/world/town/shop-refresh/items/relic_lantern_thumb.png`
- `public/assets/world/town/shop-refresh/items/relic_lantern_detail.png`

## 04. Palace Exterior Dot-Tile Landmark And Approach Kit

Create a palace exterior and approach-road kit for Hero Sword.

The current palace exterior reads too large and too non-tile-like against the town map. Replace it with refined pixel-art assets that can sit at the expanded north side of Lumen Village. The road to the palace should feel longer, ceremonial, and readable as a royal approach.

Include:

- palace exterior landmark, transparent background
- palace north gate / front stair, transparent background
- royal approach road tiles: vertical road, horizontal connector, plaza-to-road transition, stair base, road edge
- formal tree set: trimmed royal trees, small cypress-like trees, flower planters
- palace path decor: lamp posts, small banners, stone railings, low garden borders

Requirements:

- polished dot-game / pixel-art style matching town tiles
- palace must feel royal but not painterly or photographic
- road tiles must be modular and repeatable
- trees/decor must not include baked ground slabs
- no characters, no UI, no text, no logo, no watermark
- true transparent background for landmarks/decor; tile sheet or separated tile PNGs for road pieces

Target runtime files:

- `public/assets/world/palace/exterior.png`
- `public/assets/world/palace/north_gate.png`
- `public/assets/world/palace/outer_court_ground.png`
- `public/assets/world/palace/tiles/approach_road_vertical.png`
- `public/assets/world/palace/tiles/approach_road_horizontal.png`
- `public/assets/world/palace/tiles/approach_road_transition.png`
- `public/assets/world/palace/decor/royal_tree.png`
- `public/assets/world/palace/decor/royal_lamp.png`
- `public/assets/world/palace/decor/royal_planter.png`
- `public/assets/world/palace/decor/royal_banner.png`
- `public/assets/world/palace/decor/stone_railing.png`

## 05. Palace Interior Modular Tile Kit V2

Create a palace interior modular tile kit for Hero Sword.

The current palace interior uses large blue placeholder lane blocks that do not match the environment. Replace them with modular palace floor, carpet, and wall tiles suitable for runtime exploration and NPC dialogue.

Include:

- royal stone floor base tile
- polished floor alternate tile
- royal blue carpet runner tile, edge tile, corner tile, end-cap tile
- gold-trim floor border pieces
- palace wall tile, pillar base, wall baseboard
- throne platform tile pieces
- archive corridor floor variation
- interaction-safe open floor tiles for NPC placement

Requirements:

- refined pixel-art / dot-game style
- readable at 32x32 and 64x64 tile scale
- no solid rectangular placeholder bars
- no pre-drawn characters, no UI text, no logo, no watermark
- no full painted scene card unless explicitly separated as a background
- modular pieces must support a portrait mobile palace room

Target runtime files:

- `public/assets/world/palace/tiles/interior_floor.png`
- `public/assets/world/palace/tiles/interior_floor_alt.png`
- `public/assets/world/palace/tiles/carpet_center.png`
- `public/assets/world/palace/tiles/carpet_edge.png`
- `public/assets/world/palace/tiles/carpet_corner.png`
- `public/assets/world/palace/tiles/carpet_end.png`
- `public/assets/world/palace/tiles/wall.png`
- `public/assets/world/palace/tiles/pillar_base.png`
- `public/assets/world/palace/tiles/throne_platform.png`
- `public/assets/world/palace/tiles/archive_floor.png`

## 06. NPC Interaction Marker Icon Set

Create a small transparent-background overhead interaction marker set for Hero Sword NPCs.

These markers appear above NPCs when talking to the character is important for story or event progress.

Include:

- important story marker: golden exclamation mark
- available dialogue marker: small speech bubble
- quest/progress marker: blue-gold exclamation mark
- completed/ready marker: subtle check or glow point

Requirements:

- readable above 2-head runtime NPCs
- small mobile scale: 14x14, 18x18, 24x24
- soft outline so it remains visible over grass, stone, and palace floor
- no letters other than the exclamation mark symbol
- no baked text, no UI panel, no watermark
- transparent background only

Target runtime files:

- `public/assets/world/town/effects/npc_marker_story.png`
- `public/assets/world/town/effects/npc_marker_dialogue.png`
- `public/assets/world/town/effects/npc_marker_progress.png`
- `public/assets/world/town/effects/npc_marker_complete.png`
