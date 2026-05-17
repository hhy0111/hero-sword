# TOWN_AND_PALACE_TILE_DECOR_READY_TO_COPY_PROMPTS_2026-05-03

이 문서는 `마을 외부 타일 / 마을 꾸미기 소품 / 궁 내부 타일 / 궁 내부 장식`만 따로 뽑아둔 프롬프트 묶음이다.  
목표는 `도트형 런타임 배경`에 바로 쓰기 쉬운 자산을 만드는 것이다.

모든 프롬프트는 아래 원칙을 직접 포함하고 있다.

- `파랜드택틱스 1,2`에 가까운 따뜻한 2D 판타지 도트 톤
- `실사용 게임 타일/소품 시트` 기준
- `투명 배경`
- `정사각형 그리드`
- `컷팅하기 쉬운 큰 여백`
- `셀 밖으로 튀어나오는 그림자/장식 금지`
- `한 셀 = 한 타일 또는 한 소품` 원칙

---

## 01. Village Grass And Meadow Ground Tile Sheet

- target_file:
  - `assets/source/world/town-polish/01-village-grass-meadow-tiles.png`

```text
Create a production-ready pixel-art village outdoor grass tile sheet for Hero Sword, a Korean mobile fantasy RPG. The tone must feel close to classic Farland Tactics 1 and 2 map environments: warm, readable, soft fantasy, clean pixel shapes, not realistic, not painterly, not 3D.

Output rules for easy cutting:
- transparent PNG
- 1024 x 1024 canvas
- exact 32 x 32 tile cells
- 2px transparent gutter between every tile
- 32px transparent outer margin around the whole sheet
- every tile fully contained inside its own cell
- no shadow or grass strand may cross into a neighboring cell
- no background scene, no text, no watermark

Required tile types:
- plain village grass
- slightly worn grass
- flower-speck grass
- clover or weed grass
- sunlit soft grass
- darker corner grass for variation
- subtle trampled grass
- clean filler grass for repetition

Visual direction:
- safe first-town atmosphere
- readable on a small mobile screen
- slightly cute fantasy world tone
- limited clean shading
- crisp dark outline only where needed

Avoid:
- realistic meadow painting
- heavy noise texture
- muddy photorealism
- oversized flowers
- dramatic sunlight gradients
```

---

## 02. Village Road, Plaza, And Crossroad Tile Sheet

- target_file:
  - `assets/source/world/town-polish/02-village-road-plaza-tiles.png`

```text
Create a production-ready pixel-art village road and plaza tile sheet for Hero Sword, a Korean mobile fantasy RPG. The style must match a classic Farland Tactics 1 and 2 inspired fantasy map: clean 2D dot-game rendering, readable tile logic, warm and slightly storybook, not realistic, not painterly, not 3D.

Output rules for easy cutting:
- transparent PNG
- 1536 x 1024 canvas
- exact 32 x 32 tile cells
- 2px transparent gutter between tiles
- 32px transparent outer margin
- one tile per cell only
- no tile may bleed into adjacent cells
- no drop shadow crossing cell borders

Required tiles:
- light stone village road
- darker road variation
- plaza stone
- plaza variation
- horizontal road
- vertical road
- inner corner
- outer corner
- T-junction
- four-way crossroad
- road-to-plaza transitions
- road edge breakup tiles
- subtle cracked or mossy variants

Visual direction:
- central square and town lanes
- clean modular runtime placement
- readable repeated use over a large village map

Avoid:
- illustration-style street scenes
- perspective tricks
- non-grid paving
- muddy texture noise
```

---

## 03. Village Dirt, Path Edge, And Soft Transition Tile Sheet

- target_file:
  - `assets/source/world/town-polish/03-village-dirt-transition-tiles.png`

```text
Create a production-ready pixel-art village dirt and transition tile sheet for Hero Sword, a Korean mobile fantasy RPG. Match the same Farland Tactics 1 and 2 inspired 2D fantasy map tone as the rest of the village runtime tiles.

Output rules for easy cutting:
- transparent PNG
- 1024 x 1024 canvas
- exact 32 x 32 tile cells
- 2px transparent gutter
- 32px transparent outer margin
- every tile fully isolated
- no overlapping edge details

Required tiles:
- plain compact dirt
- pebbled dirt
- warm sandy dirt
- dirt-to-grass edge
- soft diagonal dirt edge
- dirt-to-road edge
- dirt patch fillers
- wheel-worn path variation
- small pebble scatter tile
- muddy but safe village edge tile

Visual direction:
- supports alleys, gardens, side yards, house thresholds
- calm fantasy village, not battlefield mud

Avoid:
- realism
- large stones that break repetition
- harsh shadows
- painted textures
```

---

## 04. Village Trees And Large Greenery Prop Sheet

- target_file:
  - `assets/source/world/town-polish/04-village-tree-large-greenery-props.png`

```text
Create a production-ready pixel-art village trees and large greenery prop sheet for Hero Sword, a Korean mobile fantasy RPG. The style must feel like classic Farland Tactics 1 and 2 inspired dot-game scenery: charming, readable, warm fantasy, slightly cute, not grotesque, not realistic, not 3D.

Output rules for easy cutting:
- transparent PNG
- 1536 x 1536 canvas
- 4 x 4 slot layout
- each slot exactly 320 x 320
- 32px transparent gutter between slots
- 64px transparent outer margin
- one prop per slot only
- canopy, trunk, and shadow must stay fully inside the slot
- no overlapping props

Required props:
- broadleaf village tree
- narrow tall tree
- round canopy tree
- flower tree
- pine-like town edge tree
- trimmed hedge cluster
- tall bush cluster
- low shrub cluster
- ivy patch
- planter greenery
- small sapling
- orchard-style tree

Visual direction:
- readable from a top-down slightly angled gameplay view
- soft fantasy town vegetation
- works around roads, walls, and houses

Avoid:
- hyper-real foliage
- painterly brush texture
- horror forest tone
- giant roots spreading outside the slot
```

---

## 05. Village Small Nature Decor Prop Sheet

- target_file:
  - `assets/source/world/town-polish/05-village-small-nature-decor-props.png`

```text
Create a production-ready pixel-art small nature decor prop sheet for Hero Sword, a Korean mobile fantasy RPG. Match a classic Farland Tactics 1 and 2 inspired fantasy map tone. These props are for dressing the town without making the screen noisy.

Output rules for easy cutting:
- transparent PNG
- 1024 x 1024 canvas
- 5 x 5 slot layout
- each slot exactly 160 x 160
- 24px transparent gutter
- 48px transparent outer margin
- one prop per slot
- no prop may cross its slot border

Required props:
- white flower patch
- yellow flower patch
- small clover patch
- reed tuft
- weed tuft
- pebble cluster
- moss patch
- tiny log
- low decorative stump
- tiny garden border plant
- herb patch
- ground leaf cluster

Visual direction:
- cute and subtle
- meant for repetition between roads and buildings
- readable on mobile without looking noisy

Avoid:
- large dramatic plants
- detailed botanical realism
- heavy shadow blobs
```

---

## 06. Village Utility And Town Furnishing Prop Sheet

- target_file:
  - `assets/source/world/town-polish/06-village-utility-and-furnishing-props.png`

```text
Create a production-ready pixel-art village utility and furnishing prop sheet for Hero Sword, a Korean mobile fantasy RPG. The style must match a Farland Tactics 1 and 2 inspired safe-town runtime environment: clean fantasy pixel art, readable shapes, slightly storybook, not realistic, not painterly.

Output rules for easy cutting:
- transparent PNG
- 1536 x 1536 canvas
- 4 x 4 slot layout
- each slot exactly 320 x 320
- 32px transparent gutter
- 64px transparent outer margin
- one prop per slot only
- no prop, banner, pole, or shadow may cross slot boundaries

Required props:
- notice board
- bench
- crate stack
- barrel cluster
- sack pile
- planter
- lamp post
- signpost without readable text
- water trough
- wagon fragment or handcart
- market table
- rope post

Visual direction:
- practical village life
- enough silhouette variety for map decoration
- readable from the same camera as the hero sprite

Avoid:
- over-detailed realism
- giant perspective props
- concept-art staging
- text labels
```

---

## 07. Village Wall, Fence, And Garden Border Tile Sheet

- target_file:
  - `assets/source/world/town-polish/07-village-wall-fence-border-tiles.png`

```text
Create a production-ready pixel-art village wall, fence, and garden border tile sheet for Hero Sword, a Korean mobile fantasy RPG. Match a Farland Tactics 1 and 2 inspired 2D fantasy map style.

Output rules for easy cutting:
- transparent PNG
- 1536 x 1024 canvas
- exact 32 x 32 tile cells
- 2px transparent gutter
- 32px transparent outer margin
- every tile isolated in one cell
- no fence post or wall detail may spill into other cells

Required tiles:
- low pale-stone wall
- low stone wall corner inner
- low stone wall corner outer
- wooden fence horizontal
- wooden fence vertical
- fence inner corner
- fence outer corner
- hedge border
- planter border
- stair edge blocker
- gate-side join tile
- garden divider tile

Visual direction:
- tidy first-town boundaries
- readable passable versus blocked edges
- bright fantasy town feel

Avoid:
- broken ruin walls
- dark horror fortification tone
- perspective fences
```

---

## 08. Village Building Facade Module Sheet

- target_file:
  - `assets/source/world/town-polish/08-village-building-facade-modules.png`

```text
Create a production-ready pixel-art village building facade module sheet for Hero Sword, a Korean mobile fantasy RPG. The goal is not a full illustration building, but reusable runtime facade modules that can be assembled into weapon shop, armor shop, supply shop, forge, and relic shop fronts. Match a Farland Tactics 1 and 2 inspired 2D fantasy map tone.

Output rules for easy cutting:
- transparent PNG
- 1536 x 1536 canvas
- 4 x 4 slot layout
- each slot exactly 320 x 320
- 32px transparent gutter
- 64px transparent outer margin
- one module per slot
- no roof, chimney, sign, or wall trim may cross slot boundaries

Required modules:
- brick wall facade piece
- stone wall facade piece
- timber wall facade piece
- blue slate roof segment
- brown shingle roof segment
- chimney module
- wooden shop door
- reinforced metal-trim door
- square window
- warm-lit window
- hanging sign bracket without text
- crest plaque

Visual direction:
- tile-based town exterior construction
- readable modular assembly
- matches dot-style hero and NPC runtime look better than large painted buildings

Avoid:
- giant fully painted building scenes
- realistic architectural rendering
- complicated perspective
```

---

## 09. Shared Village House Interior Tile Sheet

- target_file:
  - `assets/source/world/town-polish/09-village-house-interior-tiles.png`

```text
Create a production-ready pixel-art village house interior tile sheet for Hero Sword, a Korean mobile fantasy RPG. Match a Farland Tactics 1 and 2 inspired cozy fantasy indoor tone.

Output rules for easy cutting:
- transparent PNG
- 1536 x 1024 canvas
- exact 32 x 32 tile cells
- 2px transparent gutter
- 32px transparent outer margin
- one tile per cell only
- no furniture overlap across tile boundaries

Required tiles:
- warm wood floor
- dark wood floor
- pale interior wall
- wood wall trim
- doorway threshold
- window wall tile
- rug insert tile
- clean corner wall
- beam support tile
- shelf wall insert
- hearth edge tile
- simple indoor shadow tile kept inside one cell

Visual direction:
- supports inn, mayor house, archive corner, and simple village interiors
- calm, readable, cozy

Avoid:
- full room paintings
- perspective furniture scenes
- realistic lighting gradients
```

---

## 10. Palace Main Floor Tile Sheet

- target_file:
  - `assets/source/world/palace-polish/10-palace-main-floor-tiles.png`

```text
Create a production-ready pixel-art palace interior floor tile sheet for Hero Sword, a Korean mobile fantasy RPG. The tone must feel like a polished royal interior in the same fantasy world as a Farland Tactics 1 and 2 inspired tactical RPG: elegant but still readable, clean 2D pixel art, not realistic, not painterly, not 3D.

Output rules for easy cutting:
- transparent PNG
- 1536 x 1024 canvas
- exact 32 x 32 tile cells
- 2px transparent gutter
- 32px transparent outer margin
- one tile per cell only
- no floor ornament may bleed into neighboring cells

Required tiles:
- pale royal stone floor
- darker stone variation
- polished floor highlight variation
- cracked but noble stone variation
- border trim floor tile
- corner trim tile
- ceremonial inset tile
- mosaic accent tile

Visual direction:
- brighter, richer, cleaner than village roads
- still suitable for repeated runtime placement
- strong readability under dialogue UI

Avoid:
- marble realism
- reflective 3D shine
- painted palace concept art
```

---

## 11. Palace Blue Carpet And Border Tile Sheet

- target_file:
  - `assets/source/world/palace-polish/11-palace-blue-carpet-tiles.png`

```text
Create a production-ready pixel-art palace blue carpet tile sheet for Hero Sword, a Korean mobile fantasy RPG. Match the same Farland Tactics 1 and 2 inspired royal interior tone as the palace floor.

Output rules for easy cutting:
- transparent PNG
- 1024 x 1024 canvas
- exact 32 x 32 tile cells
- 2px transparent gutter
- 32px transparent outer margin
- one tile per cell
- border motifs must stay inside each cell

Required tiles:
- plain blue carpet fill
- carpet gold-border top
- carpet gold-border bottom
- carpet gold-border left
- carpet gold-border right
- inner corner
- outer corner
- center ceremonial motif tile
- carpet endcap tile
- runner transition tile

Visual direction:
- royal but still game-readable
- elegant ceremonial path toward the throne
- works in long repeating hallways

Avoid:
- super detailed embroidery
- anti-aliased cloth painting
- non-grid banner-like shapes
```

---

## 12. Palace Wall, Column, And Arch Tile Sheet

- target_file:
  - `assets/source/world/palace-polish/12-palace-wall-column-arch-tiles.png`

```text
Create a production-ready pixel-art palace wall, column, and arch tile sheet for Hero Sword, a Korean mobile fantasy RPG. The style must feel like a Farland Tactics 1 and 2 inspired noble interior: bright fantasy stone architecture, elegant but simple, not hyper-real, not painterly.

Output rules for easy cutting:
- transparent PNG
- 1536 x 1024 canvas
- exact 32 x 32 tile cells
- 2px transparent gutter
- 32px transparent outer margin
- one tile per cell
- no column shadow or arch curve may cross neighboring cells

Required tiles:
- palace wall fill
- darker lower wall band
- crown molding tile
- plain column tile
- column cap tile
- arch support tile
- arch top tile
- window arch tile
- alcove tile
- banner hanger tile without text
- corner wall tile

Visual direction:
- audience hall ready
- clear large interior shapes
- supports repeated vertical hall construction

Avoid:
- cathedral horror tone
- gothic grime
- realistic marble rendering
```

---

## 13. Palace Throne Dais And Ceremony Platform Sheet

- target_file:
  - `assets/source/world/palace-polish/13-palace-throne-dais-platform-sheet.png`

```text
Create a production-ready pixel-art palace throne dais and ceremony platform sheet for Hero Sword, a Korean mobile fantasy RPG. Match a Farland Tactics 1 and 2 inspired royal hall tone: elegant, readable, warm fantasy, not realistic, not painterly.

Output rules for easy cutting:
- transparent PNG
- 1536 x 1024 canvas
- 4 x 3 slot layout
- each slot exactly 320 x 256
- 32px transparent gutter
- 64px transparent outer margin
- one module per slot
- no throne arm, stair, or trim may cross the slot boundary

Required modules:
- throne base platform
- throne stair front
- throne stair corner left
- throne stair corner right
- royal backdrop panel
- banner panel without text
- side pedestal
- gold trim block
- carpet-to-dais join module
- formal platform edge

Visual direction:
- clear focal point for audience scenes
- larger and richer than normal palace floor pieces
- still runtime modular, not a full painted illustration

Avoid:
- giant cinematic throne scene
- photoreal gold rendering
- perspective stage painting
```

---

## 14. Palace Lighting, Banner, And Interior Decor Prop Sheet

- target_file:
  - `assets/source/world/palace-polish/14-palace-lighting-banner-decor-props.png`

```text
Create a production-ready pixel-art palace interior decor prop sheet for Hero Sword, a Korean mobile fantasy RPG. Match a Farland Tactics 1 and 2 inspired palace tone: refined fantasy, clean 2D dot-game readability, not realistic, not 3D, not painterly.

Output rules for easy cutting:
- transparent PNG
- 1536 x 1536 canvas
- 4 x 4 slot layout
- each slot exactly 320 x 320
- 32px transparent gutter
- 64px transparent outer margin
- one prop per slot only
- no banner cloth, lamp glow, or shadow may cross slot boundaries

Required props:
- standing brazier
- wall torch
- blue royal banner
- white-gold royal banner
- ceremonial spear rack
- palace bench
- scroll pedestal
- small statue bust
- flower urn
- side carpet end ornament
- palace lantern
- court notice stand

Visual direction:
- royal but readable on mobile
- suitable for hall edges and side walls
- supports story scenes, not just battle staging

Avoid:
- realistic fire painting
- giant dramatic smoke
- banner text
- over-detailed museum props
```

---

## 15. Palace Side Room And Archive Interior Tile Sheet

- target_file:
  - `assets/source/world/palace-polish/15-palace-side-room-archive-tiles.png`

```text
Create a production-ready pixel-art palace side-room and archive tile sheet for Hero Sword, a Korean mobile fantasy RPG. Match the same Farland Tactics 1 and 2 inspired royal interior family, but calmer and more functional than the main audience hall.

Output rules for easy cutting:
- transparent PNG
- 1536 x 1024 canvas
- exact 32 x 32 tile cells
- 2px transparent gutter
- 32px transparent outer margin
- one tile per cell only
- no bookshelf or desk detail may cross adjacent cells

Required tiles:
- quieter stone floor
- archive wall tile
- shelf insert tile
- bookcase wall tile
- side-room rug tile
- desk-edge tile
- curtained wall tile
- storage chest tile
- reading alcove tile
- indoor divider tile

Visual direction:
- used for archive, chamberlain room, side offices, palace corridors
- less ceremonial, more practical, still noble

Avoid:
- full room paintings
- realistic library scenes
- non-modular furniture spreads
```

---

## 16. Shared Indoor Door, Stair, And Transition Module Sheet

- target_file:
  - `assets/source/world/town-palace-polish/16-shared-door-stair-transition-modules.png`

```text
Create a production-ready pixel-art shared indoor transition module sheet for Hero Sword, a Korean mobile fantasy RPG. This sheet must support both village interiors and palace interiors. Match a Farland Tactics 1 and 2 inspired fantasy runtime environment style.

Output rules for easy cutting:
- transparent PNG
- 1024 x 1024 canvas
- 4 x 4 slot layout
- each slot exactly 224 x 224
- 24px transparent gutter
- 48px transparent outer margin
- one module per slot
- no stair rail, doorway trim, or shadow may cross the slot boundaries

Required modules:
- simple wooden interior door
- reinforced stone-trim door
- palace arch doorway
- shop doorway
- short interior stair up
- short interior stair down
- threshold plate
- return marker base without effects
- side wall door trim left
- side wall door trim right

Visual direction:
- practical runtime transitions
- clean top-down readability
- matches both village and palace tile families

Avoid:
- elaborate cinematic architecture
- perspective hall paintings
- baked-in background scenes
```

---

## 17. Top-Down Tower Tile Sheet

- target_file:
  - `assets/source/world/town-palace-polish/17-topdown-tower-tiles.png`

```text
Create a production-ready pixel-art tower tile sheet for Hero Sword, a Korean mobile fantasy RPG. This sheet is not for a side-view or angled building illustration. It must be a true straight top-down runtime tile sheet, viewed directly from above as if seen from the sky. No perspective angle, no slanted camera, no facade illustration. The style must stay close to classic Farland Tactics 1 and 2 fantasy map tiles: warm, readable, elegant 2D pixel art, not realistic, not 3D, not painterly.

Output rules for easy cutting:
- transparent PNG
- 1536 x 1024 canvas
- exact 32 x 32 tile cells
- 2px transparent gutter between every tile
- 32px transparent outer margin
- one tile per cell only
- every wall edge, tower ring, roof edge, and stair edge must stay fully inside its cell
- no shadow or decorative shape may spill into neighboring cells
- no scene background, no floor slab, no text, no watermark

Required tiles:
- round tower top tile
- square tower top tile
- tower outer ring tile
- tower inner floor tile
- tower wall edge north
- tower wall edge south
- tower wall edge east
- tower wall edge west
- inner tower corner tiles
- outer tower corner tiles
- battlement or crenellation top tile from straight top view
- tower stair entry tile
- tower hatch or access tile
- tower roof cap variation tile
- damaged but usable tower variation tile

Visual direction:
- built for direct tilemap assembly
- useful for town watchtowers, palace guard towers, wall towers, and strategic map landmarks
- clear from a small phone screen
- clean top-down geometry

Avoid:
- angled tower illustration
- isometric look
- side-wall perspective
- giant painted tower artwork
- realistic stone rendering
```

---

## 18. Top-Down Indoor Perimeter Wall Tile Sheet

- target_file:
  - `assets/source/world/town-palace-polish/18-topdown-indoor-perimeter-wall-tiles.png`

```text
Create a production-ready pixel-art indoor perimeter wall tile sheet for Hero Sword, a Korean mobile fantasy RPG. This is for room edges and indoor boundary walls seen directly from above. Use a true straight top-down runtime tile view only. No perspective angle, no side-looking wall illustration, no slanted room concept art. The style must match a classic Farland Tactics 1 and 2 inspired fantasy interior tile set: clean, readable, warm 2D pixel art, not realistic, not painterly, not 3D.

Output rules for easy cutting:
- transparent PNG
- 1536 x 1024 canvas
- exact 32 x 32 tile cells
- 2px transparent gutter
- 32px transparent outer margin
- one tile per cell only
- every wall edge, trim edge, pillar edge, and corner shape must stay fully inside its own cell
- no cast shadow or decorative trim may bleed into adjacent tiles
- no full room background
- no text, no watermark

Required tiles:
- top perimeter wall tile
- bottom perimeter wall tile
- left perimeter wall tile
- right perimeter wall tile
- inner corner north-west
- inner corner north-east
- inner corner south-west
- inner corner south-east
- outer corner north-west
- outer corner north-east
- outer corner south-west
- outer corner south-east
- thin trim wall tile
- thick palace wall tile
- simple village interior wall tile
- arch opening edge tile
- closed doorway wall tile
- alcove wall tile
- pillar-wall join tile
- decorative border wall tile

Visual direction:
- built for palace rooms, archive rooms, houses, shop interiors, and side chambers
- helps rooms read clearly as enclosed top-down spaces
- supports clean runtime room construction
- must feel modular and easy to repeat

Avoid:
- side-view walls
- perspective corridor paintings
- giant mural scenes
- realistic masonry rendering
- blurry soft-edged wall shading
```

---

## 19. Top-Down Village Roof Tile Sheet

- target_file:
  - `assets/source/world/town-polish/19-topdown-village-roof-tiles.png`

```text
Create a production-ready pixel-art village roof tile sheet for Hero Sword, a Korean mobile fantasy RPG. This sheet must be true top-down runtime roof art for tilemap assembly, not an angled building illustration. The style must stay close to classic Farland Tactics 1 and 2 map buildings: readable, warm, slightly storybook, clean 2D pixel art, not realistic, not painterly, not 3D.

Output rules for easy cutting:
- transparent PNG
- 1536 x 1024 canvas
- exact 32 x 32 tile cells
- 2px transparent gutter between every tile
- 32px transparent outer margin
- one roof tile per cell only
- every ridge, edge, eave, and trim mark must stay fully inside its own tile
- no baked background, no perspective building walls, no drop shadow crossing into neighboring cells

Required tiles:
- blue slate roof center
- brown shingle roof center
- dark weathered roof center
- north roof edge
- south roof edge
- east roof edge
- west roof edge
- inner corner roof tiles
- outer corner roof tiles
- ridge cap horizontal
- ridge cap vertical
- small dormer-ready roof tile
- patched repair roof tile
- mossy variation roof tile

Visual direction:
- supports weapon shop, armor shop, supply shop, forge, relic shop, houses, and guard posts
- must read as top-down runtime roofs instead of facade paintings
- clean repeatable geometry

Avoid:
- angled house illustration
- giant single-scene building painting
- realistic roofing texture
- over-detailed shingles that blur on mobile
```

---

## 20. Top-Down Village Exterior Wall And Foundation Tile Sheet

- target_file:
  - `assets/source/world/town-polish/20-topdown-village-wall-foundation-tiles.png`

```text
Create a production-ready pixel-art village building exterior wall and foundation tile sheet for Hero Sword, a Korean mobile fantasy RPG. This must be direct top-down runtime construction art, designed to assemble modular buildings seen from above. Keep the tone close to classic Farland Tactics 1 and 2 town maps: warm fantasy, readable, clean pixel art, not realistic, not painterly, not 3D.

Output rules for easy cutting:
- transparent PNG
- 1536 x 1024 canvas
- exact 32 x 32 tile cells
- 2px transparent gutter
- 32px transparent outer margin
- one wall or foundation tile per cell only
- every trim line, stone edge, and timber edge must stay fully inside one tile
- no perspective wall painting
- no shadow spilling into adjacent tiles

Required tiles:
- pale stone exterior wall
- timber-framed plaster wall
- brick shop wall
- dark forge wall
- relic shop decorated wall
- wall top trim north
- wall top trim south
- wall edge east
- wall edge west
- inner corner wall tiles
- outer corner wall tiles
- stone base foundation tile
- raised entry foundation tile
- reinforced shop corner tile
- worn village wall variation tile

Visual direction:
- built for top-down village building assembly
- compatible with dot-style hero and NPC sprites
- should visually support buildings that feel solid and not cut-off

Avoid:
- isometric walls
- side-facing facade art
- full illustrated houses
- realistic stucco rendering
```

---

## 21. Top-Down Building Door, Window, Sign, And Chimney Module Sheet

- target_file:
  - `assets/source/world/town-polish/21-topdown-building-door-window-sign-modules.png`

```text
Create a production-ready pixel-art top-down building detail module sheet for Hero Sword, a Korean mobile fantasy RPG. These are runtime modules for doors, windows, signs, chimneys, vents, and exterior attachments placed on top-down buildings. The style must match classic Farland Tactics 1 and 2 inspired fantasy map decoration: readable, elegant, slightly cute, clean 2D pixel art.

Output rules for easy cutting:
- transparent PNG
- 1536 x 1536 canvas
- 4 x 4 slot layout
- each slot exactly 320 x 320
- 32px transparent gutter between slots
- 64px transparent outer margin
- one module per slot only
- every module fully contained inside its slot
- no sign board, chimney smoke, lamp, or banner may cross into neighboring slots
- no text labels on signs

Required modules:
- simple wooden house door
- reinforced armor shop door
- forge doorway module
- relic shop decorated doorway
- square stone-framed window
- warm-lit window module
- shuttered window module
- hanging sign bracket
- shield crest sign without text
- sword crest sign without text
- potion or supply sign without text
- chimney top module
- forge vent module
- small roof hatch module
- awning module
- wall lamp module

Visual direction:
- intended to sit on top of modular buildings without perspective distortion
- clearer and cleaner than painted scene art
- supports building identity at a glance

Avoid:
- billboard-style giant signs
- smoke effects that escape the slot
- readable letters or logos
- perspective storefront illustrations
```

---

## 22. Top-Down Eave Shadow And Building Footprint Overlay Sheet

- target_file:
  - `assets/source/world/town-polish/22-topdown-eave-shadow-footprint-overlays.png`

```text
Create a production-ready pixel-art top-down building shadow and footprint overlay sheet for Hero Sword, a Korean mobile fantasy RPG. These are subtle runtime overlays used to make modular village buildings feel grounded without relying on giant painted building art. Match a Farland Tactics 1 and 2 inspired fantasy map tone.

Output rules for easy cutting:
- transparent PNG
- 1536 x 1024 canvas
- exact 32 x 32 tile cells
- 2px transparent gutter
- 32px transparent outer margin
- one overlay tile per cell only
- every shadow and dark trim shape must remain fully inside its own tile
- transparency must stay clean and easy to cut
- no full building scene

Required tiles:
- soft eave shadow north
- soft eave shadow south
- soft eave shadow east
- soft eave shadow west
- inner corner eave shadow
- outer corner eave shadow
- door threshold darkening tile
- foundation contact shadow tile
- under-awning shadow tile
- forge soot shadow tile
- palace-grade crisp edge shadow tile
- clean filler shadow tile

Visual direction:
- subtle and modular
- meant to help buildings feel less pasted-on
- must work over grass, dirt, stone road, and plaza tiles

Avoid:
- huge blurred shadows
- realistic sunlight direction painting
- giant black blobs
- shadows leaking outside the tile
```

---

## 23. Top-Down Shop Prefab Building Sheet

- target_file:
  - `assets/source/world/town-polish/23-topdown-shop-prefab-buildings.png`

```text
Create a production-ready pixel-art top-down shop prefab building sheet for Hero Sword, a Korean mobile fantasy RPG. This sheet should provide complete small runtime-ready building tops that can be placed as finished town buildings when modular assembly is not enough. These are not perspective building illustrations. They must be direct top-down prefab buildings designed for a tilemap world that feels close to classic Farland Tactics 1 and 2.

Output rules for easy cutting:
- transparent PNG
- 2048 x 2048 canvas
- 3 x 3 slot layout
- each slot exactly 576 x 576
- 32px transparent gutter
- 64px transparent outer margin
- one complete building prefab per slot only
- each prefab fully contained inside its slot
- roof, wall footprint, doorway, and small attached signs must stay inside the slot
- no environment background, no surrounding road, no surrounding grass

Required prefabs:
- weapon shop prefab
- armor shop prefab
- supply shop prefab
- forge prefab
- relic shop prefab
- village house prefab
- guard outpost prefab
- inn or meeting hall prefab
- archive or civic office prefab

Visual direction:
- clean top-down readable building silhouettes
- slightly varied footprints but still compact enough for town placement
- each building should be clearly different by roof color, trim, and shop identity

Avoid:
- giant decorative city concept art
- cinematic scene composition
- perspective walls
- building shadows painted onto the environment
```

---

## 24. Top-Down Palace Wing And Royal Building Prefab Sheet

- target_file:
  - `assets/source/world/palace-polish/24-topdown-palace-wing-prefabs.png`

```text
Create a production-ready pixel-art top-down royal building prefab sheet for Hero Sword, a Korean mobile fantasy RPG. These are complete palace or civic building prefabs viewed directly from above for runtime placement. The visual tone must match a classic Farland Tactics 1 and 2 inspired fantasy strategy map: noble, clean, readable, elegant 2D pixel art, not realistic, not 3D.

Output rules for easy cutting:
- transparent PNG
- 2048 x 2048 canvas
- 3 x 3 slot layout
- each slot exactly 576 x 576
- 32px transparent gutter
- 64px transparent outer margin
- one royal building prefab per slot only
- every dome, roof edge, arch mark, banner, and doorway must stay fully inside its slot
- no surrounding environment background
- no perspective facade painting

Required prefabs:
- small palace side wing
- audience annex building
- archive building
- sanctum hall
- palace garden pavilion
- gatehouse prefab
- tower-connected royal office
- ceremonial hall prefab
- noble residence prefab

Visual direction:
- meant to make the palace district feel bigger and more structured
- cleaner and more formal than village shops
- easy to place over top-down tile maps

Avoid:
- giant side-view palace paintings
- realistic marble concept art
- over-detailed tiny trim that disappears on mobile
```

---

## 25. Top-Down Royal Audience Hall Floor And Wall Tile Sheet

- target_file:
  - `assets/source/world/palace-polish/25-topdown-audience-hall-floor-wall-tiles.png`

```text
Create a production-ready pixel-art tile sheet for the royal audience hall interior of Hero Sword, a Korean mobile fantasy RPG. This is a strict top-down runtime tile sheet for the palace throne hall. The tone must feel close to classic Farland Tactics 1 and 2: elegant, readable, noble, warm fantasy strategy pixel art, not realistic, not painterly, not side-view.

Output rules for easy cutting:
- transparent PNG
- 2048 x 2048 canvas
- exact 32 x 32 tile cells
- 4px transparent gutter between every cell
- 32px transparent outer margin
- one tile per cell only
- every crack, trim, grout line, and decorative inset must stay fully inside its own tile
- no shadow or decorative border may spill into neighboring cells
- no full room composition

Required tiles:
- polished audience hall main floor tile
- lighter royal floor variant
- worn ceremonial floor variant
- wall border north tile
- wall border south tile
- wall border east tile
- wall border west tile
- inner corner wall border tile
- outer corner wall border tile
- floor-to-wall transition tile
- dais step tile
- throne platform floor tile
- gold trim inset floor tile
- blue-and-gold ceremonial accent tile
- clean filler tile
- subtle damaged filler tile

Visual direction:
- brighter and more formal than regular town indoor tiles
- royal but still clearly readable on mobile
- meant for a long hall with a central runner and raised throne area

Avoid:
- giant palace illustration
- perspective wall painting
- realistic marble veins
- blurry gradients
- tiny noise that disappears in-game
```

---

## 26. Top-Down Palace Carpet Runner Tile Sheet

- target_file:
  - `assets/source/world/palace-polish/26-topdown-palace-carpet-runner-tiles.png`

```text
Create a production-ready pixel-art top-down palace carpet runner tile sheet for Hero Sword, a Korean mobile fantasy RPG. This is a strict runtime tile sheet for palace interior carpet strips used in the audience hall, side halls, and noble rooms. The style must match classic Farland Tactics 1 and 2 inspired fantasy strategy pixel art.

Output rules for easy cutting:
- transparent PNG
- 1536 x 1536 canvas
- exact 32 x 32 tile cells
- 4px transparent gutter between every cell
- 32px transparent outer margin
- one tile per cell only
- all gold trim, tassel-like motif, and pattern marks must stay fully inside the cell
- no long continuous runner image
- must be easy to repeat in a tilemap

Required tiles:
- straight center runner tile
- straight runner variant tile
- left edge runner tile
- right edge runner tile
- runner north cap tile
- runner south cap tile
- T-junction runner tile
- cross-junction runner tile
- corner turn northwest
- corner turn northeast
- corner turn southwest
- corner turn southeast
- royal emblem accent tile
- faded side hall runner tile
- narrow side runner tile
- clean filler carpet tile

Visual direction:
- deep royal blue base with restrained gold trim
- elegant and ceremonial, not noisy
- easy to read from far camera distance

Avoid:
- perspective carpet painting
- cloth folds rendered like illustration art
- giant centered emblem that cannot tile
- blur or painterly texture
```
