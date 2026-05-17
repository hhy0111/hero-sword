# Added Image Prompts - Palace Carpet, Gacha Items, Battle Background Fixes - 2026-05-11

Use these prompts as one combined generation batch. Keep all assets readable at mobile size. Do not add text, logos, watermarks, UI labels, characters, or extra backgrounds unless the target explicitly asks for a full background.

## 1. palace_center_carpet_segment.png

Target path after approval: `public/assets/world/palace/tiles/palace_center_carpet_segment.png`

Prompt:
> Transparent PNG, one crisp repeatable palace carpet segment for a mobile fantasy RPG palace interior. Top-down/slight isometric pixel-art, royal deep blue woven fabric, clean gold trim on left and right edges, small gold corner ornaments, exactly one vertical segment that tiles seamlessly at the top and bottom, 32px grid-compatible, sharp pixel edges, no blur, no perspective skew, no floor tiles, no room background, no characters, no text.

Negative prompt:
> no full hallway, no huge single carpet, no 3D render, no painterly blur, no soft photo texture, no characters, no UI, no text.

## 2. stage_01_01.png pixel battle replacement

Target path after approval: `public/assets/world/battle-backgrounds/stage_01_01.png`

Prompt:
> Portrait 360x640 mobile RPG battle background, polished pixel-art, Greenhaven plains thorn-fence road. Top-down/slight isometric battlefield lane view, dirt path through green grass and low shrubs, thorn fence pieces and small stones at the sides, center combat area kept clean and readable, darker safe space at the top for HUD and bottom for command dock, no characters, no monsters, no UI, no text, no realistic photo detail, no heavy blur. Match 2D pixel character sprites.

Negative prompt:
> no photorealism, no oil painting, no oversized objects in the center lane, no camera blur, no UI panels, no characters, no enemies, no logo.

## 3. Dedicated gacha item icon set

Current state:
- Gacha result cards can now reuse existing shop thumbnails as a fallback.
- These summon weapon entries still do not have dedicated exact-result icons.
- Generate square transparent PNG icons for the list below so each gacha result can later use exact item art instead of a generic class image.

Shared icon prompt rules:
> Square transparent PNG item icon for a mobile fantasy RPG gacha result card, centered single equipment object, 2D pixel-art with polished fantasy rendering, readable at 44px, no background outside the object, no text, no logo, no character hand, no UI frame, clean silhouette, subtle rim highlight.

### 3.1 wp_oath_blade.png

Target path after approval: `public/assets/ui/gacha/items/wp_oath_blade.png`

Prompt:
> Square transparent PNG icon, Oath Blade fantasy one-hand sword, polished silver blade, warm gold guard, small blue oath gem in the hilt, heroic royal style, centered single item, readable at 44px.

### 3.2 wp_black_moon_daggers.png

Target path after approval: `public/assets/ui/gacha/items/wp_black_moon_daggers.png`

Prompt:
> Square transparent PNG icon, pair of crossed Black Moon daggers, dark steel crescent blades, black and violet handles, small moonlit edge glow, assassin style, centered single item set, readable at 44px.

### 3.3 wp_greenwind_bow.png

Target path after approval: `public/assets/ui/gacha/items/wp_greenwind_bow.png`

Prompt:
> Square transparent PNG icon, Greenwind Bow, elegant greenwood longbow with pale gold string fittings, small leaf charm, light wind motif, centered single bow, readable at 44px.

### 3.4 wp_sand_relic_staff.png

Target path after approval: `public/assets/ui/gacha/items/wp_sand_relic_staff.png`

Prompt:
> Square transparent PNG icon, Sand Relic Staff, carved desert staff with amber relic orb, small ancient gold rings, muted sand and teal accents, centered single staff, readable at 44px.

### 3.5 wp_frost_greatsword.png

Target path after approval: `public/assets/ui/gacha/items/wp_frost_greatsword.png`

Prompt:
> Square transparent PNG icon, Frost Greatsword, broad icy steel blade, pale blue frost runes, heavy grip, cold sparkle accents, centered single greatsword, readable at 44px.

### 3.6 wp_oasis_lance.png

Target path after approval: `public/assets/ui/gacha/items/wp_oasis_lance.png`

Prompt:
> Square transparent PNG icon, Oasis Lance, long cavalry lance with teal cloth wrap, gold spear head, small water-blue gem, desert oasis motif, centered single lance, readable at 44px.

### 3.7 wp_guard_sword.png

Target path after approval: `public/assets/ui/gacha/items/wp_guard_sword.png`

Prompt:
> Square transparent PNG icon, Bramble Guard Sword, sturdy short sword with reinforced guard, thorn-vine engraving, bronze and steel colors, defensive soldier style, centered single sword, readable at 44px.

### 3.8 wp_star_tome.png

Target path after approval: `public/assets/ui/gacha/items/wp_star_tome.png`

Prompt:
> Square transparent PNG icon, Starflare Tome, closed magic book with navy cover, gold star emblem, small glowing page tabs, arcane scholar style, centered single tome, readable at 44px.

### 3.9 wp_sanctuary_staff.png

Target path after approval: `public/assets/ui/gacha/items/wp_sanctuary_staff.png`

Prompt:
> Square transparent PNG icon, Sanctuary Staff, healer staff with white crystal head, soft green and gold accents, clean sacred motif, centered single staff, readable at 44px.

### 3.10 wp_tide_pistol.png

Target path after approval: `public/assets/ui/gacha/items/wp_tide_pistol.png`

Prompt:
> Square transparent PNG icon, Tide Compass Pistol, compact fantasy pistol with brass compass detail, sea-blue grip, small wave engraving, navigator style, centered single pistol, readable at 44px.
