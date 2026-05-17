# Town / Shop Missing Art Prompts - 2026-05-04

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

Current runtime removed these unsuitable assets from active use:

- `public/assets/world/town/landmarks/wall_segment.png`
- `public/assets/world/town/landmarks/wall_vertical.png`
- `public/assets/world/town/landmarks/wall_corner.png`
- `public/assets/world/town/landmarks/wall_tower.png`
- `public/assets/world/town/effects/shop_entrance.png`

Do not reuse placeholder house icons for shop inventory or shop interiors. If the asset below is missing, keep the runtime visual empty until a proper image is produced.

## 01. Lumen Village Wall Runtime Kit

Create a production-ready pixel-art wall runtime kit for Hero Sword, a Korean mobile fantasy ARPG built in a slightly angled top-down dot-game style.

The output must be a transparent-background asset sheet designed for direct runtime cropping. Include modular castle-town wall pieces that match the existing Lumen Village outdoor tiles and shop buildings:

- horizontal top wall segment
- horizontal bottom wall segment
- left vertical wall segment
- right vertical wall segment
- four corner pieces
- compact watchtower cap
- optional gate-side connector pieces

Requirements:

- clean 2D pixel-art, mobile-readable at 32x32 and 64x64 tile scale
- warm stone material that matches the existing road/plaza stones
- no UI mockup, no labels, no letters, no watermark
- no flat beige brick strip, no carpet-like repeated wall slabs
- no perspective mismatch against top-down town gameplay
- transparent background only

Target runtime files:

- `public/assets/world/town/landmarks/wall_segment.png`
- `public/assets/world/town/landmarks/wall_vertical.png`
- `public/assets/world/town/landmarks/wall_corner.png`
- `public/assets/world/town/landmarks/wall_tower.png`

## 02. Shop Entrance Effect Marker

Create a transparent-background pixel-art shop entrance effect sheet for Hero Sword.

The marker appears on the ground at shop doorways in Lumen Village. It should show a subtle interaction threshold, not a giant magical portal. Include five small variations for:

- weapon shop
- armor shop
- supply shop
- forge
- relic shop

Requirements:

- soft circular or crescent-shaped floor glow
- readable on grass, road, and shop-step backgrounds
- controlled opacity edges suitable for animation pulse
- no black/white extraction debris
- no baked shop icons, no text, no labels, no watermark
- transparent background only

Target runtime files:

- `public/assets/world/town/effects/shop_entrance.png`
- optional split files under `public/assets/world/town/shop-refresh/entrance-effects/`

## 03. Static Shop Counter Merchant Set

Create a production-ready static merchant counter set for Hero Sword shop interiors.

Each image must contain the merchant and the counter/table as one fixed image. The game will not animate these NPCs by default. The merchant must visually stand or sit behind the counter so the blocked counter collision in the interior scene makes sense.

Create five transparent-background PNGs:

- weapon merchant with weapon-counter table
- armor merchant with armor-fitting counter
- supply merchant with potion/travel-goods counter
- forge master with workbench/anvil counter
- relic curator with relic-display counter

Requirements:

- clean pixel-art / dot-game style matching current interior tiles
- waist-up merchant visible above the counter
- counter width suitable for a 720px interior room
- readable silhouette on mobile
- no animation frames, no sprite sheet, no text, no labels, no watermark
- transparent background only

Target runtime files:

- `public/assets/world/town/shop-refresh/merchants/weapon_counter.png`
- `public/assets/world/town/shop-refresh/merchants/armor_counter.png`
- `public/assets/world/town/shop-refresh/merchants/item_counter.png`
- `public/assets/world/town/shop-refresh/merchants/forge_counter.png`
- `public/assets/world/town/shop-refresh/merchants/relic_counter.png`

## 04. Housing / Furniture Inventory Icon Sheet

Create a transparent-background inventory icon sheet for housing and furniture rewards in Hero Sword.

These icons replace the current fallback house-shaped placeholder in shop bag/inventory views.

Include clean 32x32 and 48x48 readable icons for:

- weapon shop banner rack
- armor display stand
- forge anvil display
- relic archive lamp
- simple room furnishing slot item
- wall decoration item
- counter decoration item

Requirements:

- consistent pixel UI icon style
- no house-shaped generic placeholder
- no baked text, no labels, no watermark
- each icon separated with enough transparent padding for cropping

Target runtime files:

- `public/assets/world/town/shop-refresh/items/furniture_*_thumb.png`
- `public/assets/world/town/shop-refresh/items/furniture_*_detail.png`

## 05. Compact Shop Header Currency Icon Set

Create a compact transparent-background currency icon set for Hero Sword shop headers.

These replace text labels for the top resource line. Each icon must remain readable at 12x12, 16x16, and 24x24 pixels on a dark fantasy UI frame.

Create four separate PNG icons:

- gold coin or coin stack
- blue gem
- purple hero stone
- green fatigue / stamina vial

Requirements:

- premium fantasy mobile RPG UI icon style
- clean silhouette with bright center highlight and dark outline
- readable on a navy-black shop header
- no text, no labels, no UI frame, no watermark
- transparent background only
- square canvas with safe transparent padding

Target runtime files:

- `public/assets/world/town/shop-refresh/icons/currency_gold.png`
- `public/assets/world/town/shop-refresh/icons/currency_gem.png`
- `public/assets/world/town/shop-refresh/icons/currency_hero_stone.png`
- `public/assets/world/town/shop-refresh/icons/currency_fatigue.png`

## 06. Cash Product Shop Icon Pair

Create two premium transparent-background cash product icons for Hero Sword shop rows and item detail panels.

The current runtime must not reuse weapon, bag, or house placeholders for these products. The images should communicate paid products clearly without embedding text, prices, or currency labels.

Create icon variants for:

- starter pack: a small sealed adventurer bundle containing a gold star token, scroll, and supply pouch
- fatigue pack: a glowing stamina vial bundle with a travel ration pouch

Requirements:

- fantasy mobile RPG shop icon style
- readable in 32x32 row thumbnails and 96x96 detail preview
- no Korean or English text baked into the image
- no price text, no currency symbols, no watermark
- transparent background only
- produce both thumbnail-scale and detail-scale versions

Target runtime files:

- `public/assets/world/town/shop-refresh/items/cash_starter_pack_thumb.png`
- `public/assets/world/town/shop-refresh/items/cash_starter_pack_detail.png`
- `public/assets/world/town/shop-refresh/items/cash_fatigue_pack_thumb.png`
- `public/assets/world/town/shop-refresh/items/cash_fatigue_pack_detail.png`
