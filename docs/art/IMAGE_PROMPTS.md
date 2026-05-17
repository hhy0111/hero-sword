# Image Prompts - Current Item And Fallback Art - 2026-05-07

This document consolidates the current item-image prompts, old fallback-icon replacement prompts, and near-term additional prompts for shop/equipment features.

Use this as the single current prompt source for item and UI-support images. Older prompt files remain as history, but this file is the first place to check for the latest missing-item batch.

## Shared Rules

- Save generated files under `public/assets/...`.
- Runtime paths in code omit `public/`, for example `public/assets/world/town/shop-refresh/items/weapon_tome_thumb.png` is loaded as `assets/world/town/shop-refresh/items/weapon_tome_thumb.png`.
- Do not substitute unrelated images while a final image is missing.
- Item thumbnails: `128x128` PNG, transparent background.
- Item detail images: `512x512` PNG, transparent background.
- If the image generator cannot output true transparency, generate on a flat chroma-key background and remove it before importing.
- No text, no letters, no numbers, no watermark, no UI frame baked into item art.
- Keep the silhouette readable on a mobile screen. Use a 3/4 view, centered composition, generous padding, and crisp edges.
- Style: premium fantasy RPG, painterly item render, clean mobile-game readability, gold/steel/leather accents consistent with Hero Sword.

## Priority 1 - Files Currently Missing

These files are currently referenced by runtime or UI cleanup work and should be made first.

### UI Screen Backgrounds

```text
filename: public/assets/ui/screens/party_background.png
size: 360x640 PNG
prompt: mobile fantasy RPG party management background, premium dark steel and parchment interface, empty hero focus panel at top, four empty party portrait slots, scrollable empty roster zone, empty bottom command strip, refined gold trim, high contrast, no text, no characters, no icons, no buttons, no repeated tile pattern, clean organized mobile UI background
```

```text
filename: public/assets/ui/screens/character_detail_modal.png
size: 360x640 PNG
prompt: fantasy RPG character detail modal background, larger parchment body with dark ornate gold frame, empty square face portrait well in upper left, empty name and rarity row in upper right, roomy empty stat and biography zones, empty two-button strip at bottom, premium mobile RPG interface, no text, no character, no icons, no buttons
```

```text
filename: public/assets/ui/screens/equipment_inventory_panel.png
size: 360x640 PNG
prompt: fantasy RPG equipment inventory popup background, vertical dark armory panel with gold steel trim, compact empty title bar, four to six empty item row slots, empty status strip, empty close-button area, no text, no items, no icons, no characters, high contrast mobile game UI background
```

```text
filename: public/assets/ui/screens/equipment_workshop_background.png
size: 360x640 PNG
prompt: fantasy RPG equipment workshop management background, premium dark armory interface, empty hero face panel, empty equipped weapon and armor strip, two empty item-list columns, empty selected-info area, refined gold and blue steel trim, no text, no items, no icons, no characters, no tiled checker pattern
```

### Missing Weapon Item Images

```text
filenames:
public/assets/world/town/shop-refresh/items/weapon_tome_thumb.png
public/assets/world/town/shop-refresh/items/weapon_tome_detail.png
prompt: closed arcane battle tome with blue-gold metal corners, faint star magic leaking from page edges, leather cover, small crystal clasp, premium fantasy RPG weapon item art, centered 3/4 view, transparent background, no text, no UI frame
```

```text
filenames:
public/assets/world/town/shop-refresh/items/weapon_record_book_thumb.png
public/assets/world/town/shop-refresh/items/weapon_record_book_detail.png
prompt: leather record codex with brass clasp, runic bookmarks, archive tags, worn but elegant support-caster book, premium fantasy RPG item art, centered 3/4 view, transparent background, no text, no UI frame
```

```text
filenames:
public/assets/world/town/shop-refresh/items/weapon_pistol_thumb.png
public/assets/world/town/shop-refresh/items/weapon_pistol_detail.png
prompt: ornate tide compass pistol, short fantasy firearm with brass compass dial, blue crystal inlay, polished dark grip, compact adventurer weapon, premium fantasy RPG item art, centered 3/4 view, transparent background, no text, no UI frame
```

```text
filenames:
public/assets/world/town/shop-refresh/items/weapon_daggers_thumb.png
public/assets/world/town/shop-refresh/items/weapon_daggers_detail.png
prompt: paired shadow daggers crossed diagonally, dark steel blades with subtle violet edge glow, wrapped black leather handles, assassin weapon item, premium fantasy RPG item art, centered composition, transparent background, no text, no UI frame
```

```text
filenames:
public/assets/world/town/shop-refresh/items/weapon_scimitar_thumb.png
public/assets/world/town/shop-refresh/items/weapon_scimitar_detail.png
prompt: curved desert scimitar with sand-gold guard, dark leather grip, polished crescent blade, elegant duelist weapon, premium fantasy RPG item art, centered 3/4 view, transparent background, no text, no UI frame
```

## Priority 2 - Current Shop Offer Fallback Replacements

These are used by the current shop offer list. Some may already exist, but this batch replaces old generic atlas/home/map/star fallback impressions with proper item art.

```text
filenames:
public/assets/world/town/shop-refresh/items/consumable_amber_oil_thumb.png
public/assets/world/town/shop-refresh/items/consumable_amber_oil_detail.png
prompt: blade maintenance kit with amber oil vial, folded cloth, small whetstone, leather pouch, warm brass cap, fantasy weapon-care consumable, premium mobile RPG item art, transparent background, no text
```

```text
filenames:
public/assets/world/town/shop-refresh/items/icon_weapon_shop_thumb.png
public/assets/world/town/shop-refresh/items/icon_weapon_shop_detail.png
prompt: weapon hall banner rack furniture token, small wooden rack with hanging sword-emblem banner, metal brackets, dark blue cloth and gold trim, decorative shop furniture unlock item, premium fantasy RPG item art, transparent background, no text
```

```text
filenames:
public/assets/world/town/shop-refresh/items/supply_padding_roll_thumb.png
public/assets/world/town/shop-refresh/items/supply_padding_roll_detail.png
prompt: armor padding roll, bundled padded cloth and stitched lining strips tied with leather cord, small steel sewing awl, armor-maintenance supply item, premium fantasy RPG item art, transparent background, no text
```

```text
filenames:
public/assets/world/town/shop-refresh/items/icon_armor_shop_thumb.png
public/assets/world/town/shop-refresh/items/icon_armor_shop_detail.png
prompt: wardkeeper cloak stand furniture token, carved wooden mannequin stand holding a folded protective cloak and shoulder guard, subtle blue ward mark, premium fantasy RPG item art, transparent background, no text
```

```text
filenames:
public/assets/world/town/shop-refresh/items/consumable_blue_vial_thumb.png
public/assets/world/town/shop-refresh/items/consumable_blue_vial_detail.png
prompt: small fatigue recovery tonic, slim blue glass vial with cork and silver band, light glow inside, travel medicine item, premium fantasy RPG consumable art, transparent background, no text
```

```text
filenames:
public/assets/world/town/shop-refresh/items/consumable_blue_bottle_thumb.png
public/assets/world/town/shop-refresh/items/consumable_blue_bottle_detail.png
prompt: large fatigue recovery tonic bottle, rounded blue crystal glass bottle with reinforced cork, leather carry strap, bright restorative liquid, premium fantasy RPG consumable art, transparent background, no text
```

```text
filenames:
public/assets/world/town/shop-refresh/items/consumable_tool_box_thumb.png
public/assets/world/town/shop-refresh/items/consumable_tool_box_detail.png
prompt: forge repair box, compact wooden tool chest with steel corners, small hammer, tongs, replacement rivets, oil rag, premium fantasy RPG maintenance item art, transparent background, no text
```

```text
filenames:
public/assets/world/town/shop-refresh/items/forge_anvil_token_thumb.png
public/assets/world/town/shop-refresh/items/forge_anvil_token_detail.png
prompt: miniature anvil display furniture token, small black anvil on polished wooden base, orange ember glow, crossed forging tools, premium fantasy RPG item art, transparent background, no text
```

```text
filenames:
public/assets/world/town/shop-refresh/items/relic_seal_thumb.png
public/assets/world/town/shop-refresh/items/relic_seal_detail.png
prompt: quiet sigil bundle, tied stack of parchment seals with violet wax stamps, small brass charm and soft arcane glow, relic-shop consumable item, premium fantasy RPG art, transparent background, no text
```

```text
filenames:
public/assets/world/town/shop-refresh/items/relic_lantern_thumb.png
public/assets/world/town/shop-refresh/items/relic_lantern_detail.png
prompt: archive lamp furniture token, small ornate lantern with blue-violet flame, bronze frame, hanging chain, old library relic mood, premium fantasy RPG item art, transparent background, no text
```

## Priority 3 - Full Item Catalog Coverage

Use this section if any of these still falls back to a default atlas icon or needs a consistent remake.

### Weapons

```text
base filenames: weapon_sword_basic_thumb/detail
prompt: simple knight training sword, straight steel blade, leather grip, modest brass crossguard, clean heroic starter weapon, premium fantasy RPG item art, transparent background
```

```text
base filenames: weapon_sword_oath_thumb/detail
prompt: oath-bound holy sword, polished silver blade with faint blue-gold light, elegant guard, sacred knight weapon, premium fantasy RPG item art, transparent background
```

```text
base filenames: weapon_greatsword_thumb/detail
prompt: heavy two-handed greatsword, broad steel blade, reinforced leather grip, battle-worn but noble, premium fantasy RPG item art, transparent background
```

```text
base filenames: weapon_spear_thumb/detail
prompt: guard spear and lance hybrid, long dark shaft, steel spearhead, small blue pennant, premium fantasy RPG weapon item art, transparent background
```

```text
base filenames: weapon_hammer_thumb/detail
prompt: forge trial war hammer, heavy square head with rune marks, dark handle, ember glow in cracks, premium fantasy RPG item art, transparent background
```

```text
base filenames: weapon_bow_thumb/detail
prompt: bramble longbow, curved wooden bow with green binding, small leaf charms, taut string, ranger weapon item, premium fantasy RPG art, transparent background
```

```text
base filenames: weapon_crystal_staff_thumb/detail
prompt: crystal caster staff, polished wooden shaft, blue crystal headpiece, gold ring setting, faint holy magic, premium fantasy RPG item art, transparent background
```

```text
base filenames: weapon_orb_staff_thumb/detail
prompt: relic orb staff, dark carved staff holding a floating blue-violet orb, ancient brass fittings, oracle weapon item, premium fantasy RPG art, transparent background
```

### Armor

```text
base filenames: armor_plate_thumb/detail
prompt: knight plate armor chest piece, silver steel breastplate with blue cloth lining, shoulder guards, heroic polished finish, premium fantasy RPG armor item art, transparent background
```

```text
base filenames: armor_chain_thumb/detail
prompt: bramble guard chain mail, dark chain shirt with leather straps and small blue scarf, sturdy defender armor item, premium fantasy RPG art, transparent background
```

```text
base filenames: armor_leather_thumb/detail
prompt: pathfinder battlewear, layered brown leather armor with belts and light metal studs, agile scout armor item, premium fantasy RPG art, transparent background
```

```text
base filenames: armor_cloak_thumb/detail
prompt: hunter cloak armor, dark travel cloak over light leather vest, subtle green trim, mobile adventurer armor item, premium fantasy RPG art, transparent background
```

```text
base filenames: armor_hood_thumb/detail
prompt: rune hood robe armor, hooded caster mantle with embroidered runes, layered cloth and small metal clasps, premium fantasy RPG armor item art, transparent background
```

### Consumables, Forge, Relic, Shop Tokens

```text
base filenames: consumable_red_potion_thumb/detail
prompt: red healing potion bottle, clear glass, cork stopper, leather neck tie, glowing ruby liquid, premium fantasy RPG consumable item art, transparent background
```

```text
base filenames: consumable_green_flask_thumb/detail
prompt: green stamina flask, squat travel bottle with herbal liquid and small leaf charm, premium fantasy RPG consumable item art, transparent background
```

```text
base filenames: consumable_purple_vial_thumb/detail
prompt: purple arcane vial, slim glass container with violet smoke-like liquid, silver stopper, premium fantasy RPG consumable item art, transparent background
```

```text
base filenames: consumable_food_pack_thumb/detail
prompt: travel food pack, wrapped bread, dried meat, herb pouch, tied cloth bundle, premium fantasy RPG supply item art, transparent background
```

```text
base filenames: consumable_smoke_bomb_thumb/detail
prompt: small smoke bomb bundle, dark ceramic spheres tied with red cord, faint gray vapor, rogue utility item, premium fantasy RPG art, transparent background
```

```text
base filenames: consumable_charm_thumb/detail
prompt: protective charm talisman, small carved wooden pendant with gold thread and pale blue ward glow, premium fantasy RPG item art, transparent background
```

```text
base filenames: forge_ingot_thumb/detail
prompt: refined steel ingot stack, two polished metal bars with stamped forge mark and ember flecks, premium fantasy RPG crafting material art, transparent background
```

```text
base filenames: forge_ember_core_thumb/detail
prompt: ember core crystal, glowing orange core trapped in dark metal casing, forging upgrade material, premium fantasy RPG item art, transparent background
```

```text
base filenames: forge_bundle_thumb/detail
prompt: forging material bundle, rolled leather pouch with tongs, small hammer, metal scraps, and charcoal, premium fantasy RPG crafting item art, transparent background
```

```text
base filenames: relic_sun_coin_thumb/detail
prompt: ancient sun coin, thick gold coin with raised sun crest and worn edges, relic currency item, premium fantasy RPG art, transparent background
```

```text
base filenames: relic_bracelet_thumb/detail
prompt: relic bracelet, old bronze bracelet with blue gem inlays and faint inscription glow, premium fantasy RPG relic item art, transparent background
```

```text
base filenames: icon_item_shop_thumb/detail
prompt: item shop token, small merchant pouch with potion bottle and supply tag, decorative shop category item, premium fantasy RPG art, transparent background
```

```text
base filenames: icon_forge_shop_thumb/detail
prompt: forge shop token, compact anvil and hammer emblem object, ember glow, decorative shop category item, premium fantasy RPG art, transparent background
```

```text
base filenames: icon_relic_shop_thumb/detail
prompt: relic shop token, ornate purple crystal and sealed scroll display, decorative shop category item, premium fantasy RPG art, transparent background
```

## Priority 4 - Additional Images Needed Before Shop Feature Expansion

These are not fully wired into current runtime yet, but they are needed if weapon purchase, armor purchase, enhancement, repair, or paid store UX becomes a real feature instead of a placeholder list.

```text
filenames:
public/assets/world/town/shop-refresh/items/weapon_purchase_ticket_thumb.png
public/assets/world/town/shop-refresh/items/weapon_purchase_ticket_detail.png
prompt: weapon purchase contract ticket, parchment voucher with wax seal and small sword charm, premium fantasy RPG shop item art, transparent background, no text
```

```text
filenames:
public/assets/world/town/shop-refresh/items/armor_purchase_ticket_thumb.png
public/assets/world/town/shop-refresh/items/armor_purchase_ticket_detail.png
prompt: armor purchase contract ticket, parchment voucher with wax seal and small shield charm, premium fantasy RPG shop item art, transparent background, no text
```

```text
filenames:
public/assets/world/town/shop-refresh/items/forge_enhancement_stone_thumb.png
public/assets/world/town/shop-refresh/items/forge_enhancement_stone_detail.png
prompt: equipment enhancement stone, faceted blue-gold crystal set in cracked dark metal, bright upgrade glow, premium fantasy RPG crafting item art, transparent background, no text
```

```text
filenames:
public/assets/world/town/shop-refresh/items/forge_repair_alloy_thumb.png
public/assets/world/town/shop-refresh/items/forge_repair_alloy_detail.png
prompt: repair alloy bundle, small silver alloy plates and rivets tied with wire, clean forge material item, premium fantasy RPG crafting art, transparent background, no text
```

```text
filenames:
public/assets/world/town/shop-refresh/items/forge_tempering_oil_thumb.png
public/assets/world/town/shop-refresh/items/forge_tempering_oil_detail.png
prompt: tempering oil bottle, dark amber oil in reinforced metal flask with heat marks, weapon upgrade consumable, premium fantasy RPG item art, transparent background, no text
```

```text
filenames:
public/assets/world/town/shop-refresh/items/forge_repair_hammer_thumb.png
public/assets/world/town/shop-refresh/items/forge_repair_hammer_detail.png
prompt: repair hammer, compact blacksmith hammer with polished steel head and wrapped leather grip, small sparks around head, premium fantasy RPG tool item art, transparent background, no text
```

```text
filenames:
public/assets/world/town/shop-refresh/items/cash_starter_pack_thumb.png
public/assets/world/town/shop-refresh/items/cash_starter_pack_detail.png
prompt: paid starter pack product art, small treasure bundle with gold pouch, potion, scroll, and glowing star token, premium mobile RPG shop product image, transparent background, no text, no currency symbols
```

```text
filenames:
public/assets/world/town/shop-refresh/items/cash_fatigue_pack_thumb.png
public/assets/world/town/shop-refresh/items/cash_fatigue_pack_detail.png
prompt: paid fatigue pack product art, bundle of blue recovery tonic bottles with travel satchel and soft green stamina glow, premium mobile RPG shop product image, transparent background, no text, no currency symbols
```

## Notes

- `gacha_backdrop.png` and `rarity_3/4/5_backplate.png` currently exist, so they are not included in Priority 1.
- The current shop data sells small consumable/furniture-style offers. Full weapon buying, armor buying, enhancement, and repair require additional game logic before the Priority 4 assets can be used as real products.
- Do not bake Korean labels, prices, stars, item quantities, or buttons into these images. The game UI must render text and controls separately.
