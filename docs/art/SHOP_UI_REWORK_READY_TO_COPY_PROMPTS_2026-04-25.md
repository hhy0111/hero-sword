# SHOP_UI_REWORK_READY_TO_COPY_PROMPTS_2026-04-25

- summary:
  - Ready-to-copy prompt bundle for the next shop UI rework pass.
  - Focuses on scrollable shop lists, inventory grid + detail layout, calm frameless purchase backgrounds, and matched small/large item art.
- inputs:
  - User feedback on the armor shop purchase screen on `2026-04-25`
  - `docs/ui/SHOP_INTERIOR_VISUAL_REVIEW_2026-04-25.md`
  - `docs/art/SHOP_INTERIOR_REFRESH_READY_TO_COPY_PROMPTS_2026-04-25.md`
- decisions:
  - Movement screens must stay in refined pixel-art / dot-game style and match the current hero runtime sprite family.
  - Shop purchase backgrounds must stay calm and low-contrast, with no baked border or panel ornament inside the background image.
  - Borders, frames, list cards, grid slots, and detail panels must be generated as separate transparent UI assets.
  - Every item family should support two image tiers:
    - small thumbnail art for list / grid / quick UI use
    - large detail art for the item detail pane
- todo:
  - Generate the next art batch from this prompt bundle.
  - Apply generated assets into `ShopScene` after the layout rework.
  - Standardize item data so thumbnail and detail art stay linked.
- risks:
  - Image generation may still try to bake frames into the background if the prompt is not followed strictly.
  - Large detail item art may drift away from the matching thumbnail unless the same silhouette logic is preserved.
  - Overdecorated UI frames may reduce the number of visible rows on a `360x640` portrait screen.
- artifacts_changed:
  - `docs/art/SHOP_UI_REWORK_READY_TO_COPY_PROMPTS_2026-04-25.md`
- handoff_to:
  - `asset_agent`
  - `ui_agent`
- handoff_notes:
  - Use this file together with `docs/art/SHOP_INTERIOR_REFRESH_READY_TO_COPY_PROMPTS_2026-04-25.md`.
  - That earlier file covers interior props and merchant runtime visuals.
  - This file covers purchase UI structure and item image system.
- done_check:
  - false

This file is for the next image-generation batch that supports a real shop UI redesign instead of another small patch.

Use this bundle when the shop screen is rebuilt around:

- scroll instead of paging
- a smaller top header
- at least five visible shop rows
- inventory grid plus detail panel
- a shared item-image system with thumbnail art and large detail art

Global art rules for every prompt in this file:

- portrait mobile game composition, readable around a `360x640` gameplay screen
- refined commercial fantasy pixel art
- must feel native next to the current hero runtime dot character
- no baked Korean text
- no baked English text
- no logo
- no watermark
- no checkerboard
- no fake photo texture
- no blurred painterly concept art
- no giant ornamental borders that eat usable content space
- when generating backgrounds, keep borders and frames out of the image unless the prompt explicitly asks for a separate frame sheet

---

## 01. Runtime Shop Movement Background Set

- target_files:
  - `assets/source/world/shop-ui-refresh/bg_shop_runtime_weapon_v001.png`
  - `assets/source/world/shop-ui-refresh/bg_shop_runtime_armor_v001.png`
  - `assets/source/world/shop-ui-refresh/bg_shop_runtime_item_v001.png`
  - `assets/source/world/shop-ui-refresh/bg_shop_runtime_forge_v001.png`
  - `assets/source/world/shop-ui-refresh/bg_shop_runtime_relic_v001.png`

```text
Create a commercial-quality set of five portrait mobile shop movement backgrounds for Hero Sword, a Korean mobile fantasy ARPG built around polished dot-game character runtime.

This set is for the walkable indoor shop scenes where the hero sprite moves in real time, so the environment must visually match a refined modern pixel-art character game rather than painted concept art.

Create one background each for:
- weapon shop
- armor shop
- item shop
- forge
- relic shop

Camera and gameplay rules:
- fixed indoor runtime camera
- portrait mobile gameplay framing
- designed to work behind a small pixel hero character
- clear walkable floor area
- no props that require perfect perspective alignment to read correctly
- no giant decorative frame baked into the room

Style rules:
- refined modern fantasy pixel art
- warm village-town tone
- low-contrast floor and wall treatment
- subtle material variation only
- avoid empty flat color blocks
- avoid noisy tile repetition
- shop identity should come from soft palette, floor wear, wall trim, and mild prop silhouettes, not from giant set dressing

Important:
- do not turn these into finished concept paintings
- do not add characters
- do not add text signs
- do not add huge perspective-heavy furniture that will fight runtime collision placement
- keep the image practical for a real game scene
```

---

## 02. Calm Purchase Background Set

- target_files:
  - `assets/source/world/shop-ui-refresh/ui_panel_shop_purchase_bg_weapon_v001.png`
  - `assets/source/world/shop-ui-refresh/ui_panel_shop_purchase_bg_armor_v001.png`
  - `assets/source/world/shop-ui-refresh/ui_panel_shop_purchase_bg_item_v001.png`
  - `assets/source/world/shop-ui-refresh/ui_panel_shop_purchase_bg_forge_v001.png`
  - `assets/source/world/shop-ui-refresh/ui_panel_shop_purchase_bg_relic_v001.png`

```text
Create a commercial-quality set of five calm purchase-screen background images for Hero Sword, a Korean mobile fantasy ARPG for Android.

These are the soft full-screen or near-full-screen backdrops used behind the shop purchase UI. They are not supposed to contain borders, panel frames, boxes, title plates, or decorative corners. The frame and border art will be generated separately.

Create one background each for:
- weapon shop
- armor shop
- item shop
- forge
- relic shop

Visual goal:
- elegant but quiet
- subtle fantasy texture
- low-contrast backdrop that lets text and item cards sit on top cleanly
- enough visual life to avoid feeling like a flat empty wall
- no exact object placement that can break UI alignment

Style rules:
- refined fantasy pixel-art compatible look
- soft grain, cloth, stone, leather, or brushed material feeling depending on shop type
- calm and premium, not noisy
- no vignette that crushes readability
- no perspective-heavy room illustration
- no baked shelves
- no baked tables
- no baked frame
- no baked title strip

The armor shop version should feel sturdy, grounded, and defensive, but still restrained and calm. The result must look like a real game background layer that can sit behind separately placed UI frames.
```

---

## 03. Shop Purchase Frame And Panel Sheet

- target_file:
  - `assets/source/world/shop-ui-refresh/ui_panel_shop_purchase_frame_sheet_v001.png`

```text
Create a commercial-quality transparent-background shop purchase UI frame sheet for Hero Sword, a Korean mobile fantasy ARPG for Android.

This sheet is separate from the shop purchase background. Build a clean, production-ready UI frame family for a portrait mobile shop screen where the background is calm and the borders are layered on top.

Include these blank frame assets only:
- one main outer frame for the full shop screen
- one compact top header strip
- one tall list panel frame for the shop item list
- one lower inventory or bag panel frame
- one item detail panel frame
- one modal detail pop-up frame
- small separator bars
- small corner ornaments that stay restrained

Design rules:
- transparent background only
- no baked text
- no baked icons
- no giant fantasy clutter
- elegant dark metal, leather, and warm gold restraint
- enough empty center area for runtime-rendered content
- optimized for a shop layout that needs more visible items, not a huge decorative header

Avoid oversized ornaments, thick borders, unreadable jewel clutter, blurry edges, or fake embossed text space.
```

---

## 04. Compact Header, Currency Strip, And Tab Sheet

- target_file:
  - `assets/source/world/shop-ui-refresh/ui_panel_shop_header_compact_sheet_v001.png`

```text
Create a commercial-quality transparent-background compact shop header UI sheet for Hero Sword, a Korean mobile fantasy ARPG for Android.

This sheet is for a redesigned shop screen where the top area must stay small so the item list and inventory can show many more entries.

Include blank assets for:
- compact shop title plate
- slim currency strip
- slim status strip
- selected-item mini label plate
- category tabs for shop list, bag, and detail
- active and inactive tab states

Important design rules:
- prioritize readability and density
- do not create a huge ceremonial header
- all elements must feel clean and mobile-usable
- enough empty space for runtime text
- style must match a premium fantasy mobile RPG, but stay restrained

No baked words, no logos, no giant crowns, no oversized wings, and no thick ornament that wastes vertical space.
```

---

## 05. Scroll List Row Card And Scrollbar Sheet

- target_file:
  - `assets/source/world/shop-ui-refresh/ui_panel_shop_scroll_list_sheet_v001.png`

```text
Create a commercial-quality transparent-background vertical shop-list UI sheet for Hero Sword, a Korean mobile fantasy ARPG for Android.

This asset family is for a scrollable list, not a page-based list. The final layout must allow around five visible shop entries on a portrait mobile screen.

Include blank assets for:
- list row card normal state
- list row card hover or focus state
- list row card selected state
- list row card disabled or sold-out state
- small price-tag plate
- small rarity badge holder
- slim scrollbar track
- scrollbar thumb
- subtle row divider

Design rules:
- one row must leave room for a small item thumbnail, item name, one short effect line, and a buy button
- keep the row compact and readable
- avoid thick borders that reduce visible item count
- the selected state should be obvious without becoming flashy casino UI

Transparent background only. No text, no logos, no baked icons, no oversized ornament.
```

---

## 06. Inventory Grid Slot, Detail Stage, And Sell Plate Sheet

- target_file:
  - `assets/source/world/shop-ui-refresh/ui_panel_shop_inventory_grid_sheet_v001.png`

```text
Create a commercial-quality transparent-background inventory-grid and detail-panel UI sheet for Hero Sword, a Korean mobile fantasy ARPG for Android.

This sheet supports a redesigned shop bag area where the player sees multiple item icons in a grid, taps one item, and then reads or sells it in a separate detail pane.

Include blank assets for:
- inventory grid slot normal state
- inventory grid slot selected state
- inventory grid slot equipped or owned-highlight state
- large detail-image stage frame
- item-stat text panel
- buy button plate
- sell button plate
- quantity badge plate
- rarity ribbon or rarity marker plate

Rules:
- grid slots must be compact and readable on a phone
- detail stage must leave clean room for one large item image
- the sheet must support both buying and selling without needing separate art direction later
- style should match the purchase frame family exactly

No baked text, no icons with labels, no giant decoration, no blurred glow fog.
```

---

## 07. Weapon Thumbnail Icon Sheet

- target_file:
  - `assets/source/world/shop-ui-refresh/icon_shop_weapon_thumb_sheet_v001.png`

```text
Create a commercial-quality transparent-background pixel-art weapon thumbnail sheet for Hero Sword, a Korean mobile fantasy ARPG for Android.

These are the small item images used in shop lists, inventory grids, quick rewards, and related UI. They must match a polished dot-game presentation and remain very readable at small size.

Include clearly separated thumbnail icons for:
- short sword
- knight sword
- greatsword
- spear
- combat hammer
- bow
- wand
- ritual staff
- tome
- dual daggers

Rules:
- refined fantasy pixel art
- clean silhouette first
- mobile readability first
- not painterly illustration
- not tiny noisy detail
- transparent background only

The entire sheet must feel like a shipped pixel-style mobile RPG icon family.
```

---

## 08. Armor Thumbnail Icon Sheet

- target_file:
  - `assets/source/world/shop-ui-refresh/icon_shop_armor_thumb_sheet_v001.png`

```text
Create a commercial-quality transparent-background pixel-art armor thumbnail sheet for Hero Sword, a Korean mobile fantasy ARPG for Android.

These are the small item images used in shop lists, inventory grids, and quick UI states for the armor shop.

Include clearly separated thumbnail icons for:
- plate armor
- guard mail
- leather armor
- travel cloak
- hood
- heavy helm
- gauntlets
- light gloves
- heavy boots
- shield emblem or buckler

Rules:
- refined fantasy pixel art
- strong shape recognition at small size
- grounded mobile ARPG item logic
- avoid shiny overrendering
- avoid painterly illustration style
- transparent background only

The result should instantly read as armor-shop inventory in a pixel-style game.
```

---

## 09. Consumable Thumbnail Icon Sheet

- target_file:
  - `assets/source/world/shop-ui-refresh/icon_shop_consumable_thumb_sheet_v001.png`

```text
Create a commercial-quality transparent-background pixel-art consumable thumbnail sheet for Hero Sword, a Korean mobile fantasy ARPG for Android.

These are small item thumbnails for the general item shop and must read clearly in a compact mobile list or bag grid.

Include clearly separated thumbnail icons for:
- healing potion
- fatigue tonic
- large fatigue tonic
- revive feather
- antidote vial
- buff tonic
- ration pack
- repair kit
- smoke bomb
- support charm

Rules:
- refined pixel-art item language
- clean shape and color separation
- readable on a phone at very small size
- no painted bottle realism
- no label text
- transparent background only
```

---

## 10. Forge Material Thumbnail Icon Sheet

- target_file:
  - `assets/source/world/shop-ui-refresh/icon_shop_forge_thumb_sheet_v001.png`

```text
Create a commercial-quality transparent-background pixel-art forge-material thumbnail sheet for Hero Sword, a Korean mobile fantasy ARPG for Android.

These small icons are for forge, repair, and enhancement materials used in shop lists and inventory grids.

Include clearly separated thumbnail icons for:
- iron ore
- tempered ingot
- forge coal
- ember core
- broken blade fragment
- repair alloy
- polishing oil
- beast hide
- enhancement stone
- forging seal

Rules:
- grounded and readable
- clearly pixel-art
- easy to distinguish by silhouette and material color
- no painterly ore painting
- transparent background only
```

---

## 11. Relic Thumbnail Icon Sheet

- target_file:
  - `assets/source/world/shop-ui-refresh/icon_shop_relic_thumb_sheet_v001.png`

```text
Create a commercial-quality transparent-background pixel-art relic thumbnail sheet for Hero Sword, a Korean mobile fantasy ARPG for Android.

These small icons are for relic-shop inventory, accessory-like support gear, and archive goods in a fantasy mobile ARPG.

Include clearly separated thumbnail icons for:
- ring
- amulet
- protection seal
- relic coin
- guardian bracelet
- rune pendant
- sacred crest
- prayer beads
- charm ribbon
- archive lamp

Rules:
- mystical but controlled
- premium and readable
- pixel-art compatible
- no giant glow halo
- no painterly jewelry rendering
- transparent background only
```

---

## 12. Weapon Large Detail Showcase Set

- target_file:
  - `assets/source/world/shop-ui-refresh/art_item_weapon_detail_set_v001.png`

```text
Create a commercial-quality transparent-background large-detail weapon showcase set for Hero Sword, a Korean mobile fantasy ARPG for Android.

This set is for the item detail pane that opens when the player taps a weapon thumbnail in the shop or bag. These are larger and more premium than list icons, but they must still belong to the same game and the same exact item identity.

Include one larger showcase image each for:
- short sword
- knight sword
- greatsword
- spear
- combat hammer
- bow
- wand
- ritual staff

Rules:
- match the same item family as the small thumbnail icons
- same silhouette logic, same material logic, same fantasy tone
- larger and more detailed, but not a painted splash art poster
- clean transparent background
- centered item presentation
- enough empty margin for a runtime detail pane around the item

Avoid realism drift, camera drama, giant effect trails, floating hands, and decorative background scenery.
```

---

## 13. Armor Large Detail Showcase Set

- target_file:
  - `assets/source/world/shop-ui-refresh/art_item_armor_detail_set_v001.png`

```text
Create a commercial-quality transparent-background large-detail armor showcase set for Hero Sword, a Korean mobile fantasy ARPG for Android.

This set is for the armor detail pane opened from the shop list or inventory grid. The items must feel richer than small icons while still matching the same exact item identity.

Include one larger showcase image each for:
- plate armor
- guard mail
- leather armor
- travel cloak
- heavy helm
- gauntlets
- heavy boots
- buckler or shield emblem

Rules:
- same item identity as the thumbnail set
- refined fantasy game presentation
- controlled detail and believable materials
- transparent background only
- centered single-item composition
- no body mannequin unless the item absolutely requires it

Avoid museum display staging, giant holy glow, painted fashion illustration style, or full character render.
```

---

## 14. Consumable Large Detail Showcase Set

- target_file:
  - `assets/source/world/shop-ui-refresh/art_item_consumable_detail_set_v001.png`

```text
Create a commercial-quality transparent-background large-detail consumable showcase set for Hero Sword, a Korean mobile fantasy ARPG for Android.

This set is for the detail pane shown after tapping a consumable item in the shop or inventory.

Include one larger showcase image each for:
- healing potion
- fatigue tonic
- large fatigue tonic
- revive feather
- antidote vial
- ration pack
- repair kit
- support charm

Rules:
- match the same identity as the small consumable thumbnails
- premium item-detail presentation, but still game-native
- no painted ad illustration style
- transparent background only
- centered and clean

Avoid giant liquid effects, fake label text, or poster-like dramatic background lighting.
```

---

## 15. Forge And Relic Large Detail Showcase Set

- target_file:
  - `assets/source/world/shop-ui-refresh/art_item_forge_relic_detail_set_v001.png`

```text
Create a commercial-quality transparent-background large-detail forge-material and relic showcase set for Hero Sword, a Korean mobile fantasy ARPG for Android.

This set is for the item detail pane and should cover the non-weapon, non-armor support inventory that still needs a richer large-image presentation.

Include one larger showcase image each for:
- tempered ingot
- ember core
- repair alloy
- forging seal
- relic coin
- protection seal
- guardian bracelet
- archive lamp

Rules:
- preserve identity with the matching small thumbnail versions
- detail-rich but still controlled
- fantasy mobile game item presentation, not a painted still-life
- transparent background only
- centered single-item composition with clean margins

Avoid excessive magical explosions, jewelry-ad photography look, or environmental background scenery.
```

---

## Recommended Batch Order

1. `Runtime Shop Movement Background Set`
2. `Calm Purchase Background Set`
3. `Shop Purchase Frame And Panel Sheet`
4. `Scroll List Row Card And Scrollbar Sheet`
5. `Inventory Grid Slot, Detail Stage, And Sell Plate Sheet`
6. `Weapon Thumbnail Icon Sheet`
7. `Armor Thumbnail Icon Sheet`
8. `Consumable Thumbnail Icon Sheet`
9. `Forge Material Thumbnail Icon Sheet`
10. `Relic Thumbnail Icon Sheet`
11. `Weapon Large Detail Showcase Set`
12. `Armor Large Detail Showcase Set`
13. `Consumable Large Detail Showcase Set`
14. `Forge And Relic Large Detail Showcase Set`

## Practical Notes

- If the next batch is small, prioritize `02`, `03`, `05`, `06`, `08`, and `13` first because the user feedback is centered on the armor shop purchase flow.
- Do not merge the background and the frame into one image. That is the exact failure mode this bundle is trying to avoid.
- If one item must appear in both thumbnail and detail form, keep silhouette, palette family, and material logic consistent across both assets.
