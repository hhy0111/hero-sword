# NPC 2-Head Runtime Dot Remake Ready-To-Copy Prompts 2026-05-03

- summary:
  - Current NPC runtime dot sheets need a full remake because several generated NPCs read as `3~4-head` characters instead of the intended `2-head` in-game style.
  - This batch is for runtime dot NPC sheets only. Do not remake dialogue portraits from this document.
  - Use the existing importer source filenames so the current NPC import pipeline can replace the runtime sheets after the new images arrive.
- inputs:
  - Current runtime importer: `scripts/import_npc_prompt_assets_2026_05_03.py`
  - Current source folder: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03`
  - Current canonical NPC prompt roster: `docs/art/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03.md`
- decisions:
  - Runtime NPC sprites must be strict `2-head chibi / SD` proportions.
  - Adult NPCs should still read as adults through outfit, pose, face, and role props, not through tall body proportions.
  - Target outputs are `36` canonical source sheets. Merchant aliases are handled by the importer from shared source files.
- todo:
  - Generate all `36` runtime dot sheets listed below.
  - Place the generated files in `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03`.
  - After files arrive, rerun `python scripts/import_npc_prompt_assets_2026_05_03.py`.
  - If `01-orin-runtime-dot-sheet.png` is newly produced, update the importer to consume it for `weapon_merchant` / `orin`; the previous batch missed this source.
- risks:
  - Image models may still drift toward tall anime proportions unless the `2-head` constraints are repeated in every prompt.
  - Some tools ignore exact pixel grids; reject outputs where rows, gutters, or cells cannot be cleanly cut.
  - Long weapons, spears, banners, and cloaks can break cell boundaries. Keep props compact.
- artifacts_changed:
  - `docs/art/NPC_2HEAD_RUNTIME_DOT_REMAKE_READY_TO_COPY_PROMPTS_2026-05-03.md`
- handoff_to:
  - `asset_agent`
  - `integration_agent`
- handoff_notes:
  - This replaces only runtime dot sheet production direction, not NPC portrait direction.
  - The critical QA rule is visual proportion: `head height` should be roughly half of the total standing sprite height.
- done_check:
  - `true`

---

## Batch Rules

Apply these rules to every prompt below.

- Output format: transparent PNG.
- Canvas: exactly `1792 x 1792`.
- Grid: exact `4 x 4` equal grid.
- Cell size: exactly `384 x 384`.
- Gutter: exactly `32px` transparent gutter between cells.
- Outer margin: exactly `80px` transparent outer margin. This is required because `80 + 384 + 32 + 384 + 32 + 384 + 32 + 384 + 80 = 1792`.
- One full character per cell only.
- No background, no floor, no shadow, no labels, no title text, no UI frame, no watermark.
- Character should occupy about `220~260px` height inside each `384px` cell.
- Strict 2-head proportion: head is `48~52%` of the full standing height.
- Very short torso and very short legs.
- Small hands and feet, compact silhouette, large readable head.
- Keep adult NPC identity through costume and props, not through tall anatomy.
- Reject 2.5-head, 3-head, 4-head, long-legged, realistic, fashion-illustration, portrait, semi-realistic, painterly, 3D, or side-scrolling fighter proportions.
- Pixel style: clean modern fantasy pixel art / dot-game sprite, crisp hard edges, readable mobile ARPG silhouette, no soft brush rendering.

Universal row plan:
- Row 1: idle 1 to 4
- Row 2: walk 1 to 4
- Row 3: talk / greet 1 to 4
- Row 4: role pose / wait pose / service pose 1 to 4

## Alias Mapping

Generate the canonical source file once. The importer maps shared sheets to runtime aliases.

| Source file | Runtime subject coverage |
| --- | --- |
| `01-orin-runtime-dot-sheet.png` | `orin`, `weapon_merchant` after importer mapping is added |
| `02-marta-runtime-dot-sheet.png` | `marta`, `armor_merchant` |
| `03-neri-runtime-dot-sheet.png` | `neri`, `item_merchant` |
| `04-torren-runtime-dot-sheet.png` | `torren`, `blacksmith` |
| `05-seline-runtime-dot-sheet.png` | `seline`, `relic_merchant` |
| `06~36` source sheets | one canonical runtime subject each |

---

## Runtime Dot Prompts

### 01. Orin - Weapon Merchant

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/01-orin-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Orin, the Lumen Village weapon merchant in Hero Sword. Orin is a practical middle-aged fantasy weapon seller with a compact leather apron, work tunic, gloves, small belt tools, and a dependable shopkeeper presence.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head is about half of total height, tiny torso, short legs, compact hands and boots. He must still read as an adult merchant through face, apron, posture, and gear. Do not make him 3-head or 4-head. Do not use long legs, tall anime anatomy, realistic anatomy, painterly rendering, 3D, or portrait style.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Orin per cell, no background, no shadow, no labels. Keep apron, gloves, tools, hair, boots, and hands fully inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, weapon shop service pose / arms-fold wait / inspect small sword / counter-ready pose 1-4.
```

### 02. Marta - Armor Merchant

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/02-marta-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Marta, the Lumen Village armor merchant in Hero Sword. Marta is a grounded defensive gear specialist with cloth layers, leather straps, small plated armor samples, a measuring strap, and a practical shopkeeper stance.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head is about half of total height, tiny torso, short legs, compact hands and boots. She must read as an adult armor merchant through outfit, stance, and gear detail, not through tall proportions. Do not make her 3-head or 4-head. No long legs, no tall fashion body, no realistic anatomy, no painterly or 3D rendering.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Marta per cell, no background, no shadow, no labels. Keep shoulder cloth, armor skirt, straps, sleeves, and boots fully inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, armor measuring pose / hands-on-hip wait / guarded stance / shop service pose 1-4.
```

### 03. Neri - Supply Merchant

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/03-neri-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Neri, the Lumen Village supply merchant in Hero Sword. Neri sells potions, field kits, travel meals, satchels, and small utility tools. She should feel organized, approachable, and useful.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head is about half of total height, tiny torso, short legs, compact hands and feet. She must read as an adult shopkeeper through costume, satchel, bottles, and confident expression. Do not make her 3-head or 4-head. No long torso, no long legs, no realistic anatomy, no painterly art, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Neri per cell, no background, no shadow, no labels. Keep pouch, bottle, satchel, sleeves, hair, and shoes inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, inventory-check pose / pointing pose / counter-ready pose / wait pose 1-4.
```

### 04. Torren - Forge Master

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/04-torren-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Torren, the Lumen Village forge master in Hero Sword. Torren is a strong senior blacksmith with soot-marked workwear, heavy gloves, compact leather apron, small hammer, and forge-built silhouette.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, large head about half of full height, tiny torso, very short sturdy legs, compact arms. He should feel powerful but not tall. Do not make him 3-head or 4-head. No long limbs, no realistic anatomy, no painterly rendering, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Torren per cell, no background, no shadow, no labels. Keep hammer, apron hem, shoulder bulk, belt tools, and boots inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, forge-ready stance / inspect metal pose / arms-rest wait / nod pose 1-4.
```

### 05. Seline - Relic Merchant

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/05-seline-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Seline, the Lumen Village relic merchant in Hero Sword. Seline handles fragments, seals, and quiet magical relics. She should look arcane but grounded, elegant but still suitable for a village shop.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head is about half of total height, tiny torso, short legs, compact sleeves. Adult identity comes from robe design, calm face, charm belt, and shop role. Do not make her 3-head or 4-head. No tall priestess anatomy, no long legs, no painterly glow, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Seline per cell, no background, no floor shadow, no labels. Keep hair, sleeves, charm belt, robe hem, and shoes inside each cell. Avoid large magic effects crossing cells.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, relic-reading pose / quiet wait / hand-raised guide pose / counter service pose 1-4.
```

### 06. Mayor Haru - Village Elder

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/06-mayor-haru-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Mayor Haru, the practical elder and first major story guide of Lumen Village in Hero Sword. He wears warm village elder robes, simple layered cloth, and may carry a short cane or folded document.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, large head about half of full height, small body, short legs, compact hands. He must read as an older adult through face, robe, and posture, not through tall height. Do not make him 3-head or 4-head. No long robe body, no realistic anatomy, no painterly rendering, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Mayor Haru per cell, no background, no shadow, no labels. Keep robe edge, cane, sleeves, hair, and shoes inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, mayor address pose / thoughtful pose / open-hand guide pose / still wait pose 1-4.
```

### 07. Bram - Starter Companion Recruit

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/07-bram-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Bram, the starter companion recruit met in Lumen Village in Hero Sword. Bram is a young village fighter with simple leather armor, travel cloak, training sword, and earnest expression.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head is about half of total height, compact torso, short legs, small hands and boots. He should read as a recruit through gear and pose, not by becoming tall. Do not make him 3-head or 4-head. No long swords crossing cells, no tall anime hero body, no painterly or 3D rendering.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Bram per cell, no background, no shadow, no labels. Keep sword, cloak, hair, boots, and hands fully inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, recruit-ready pose / nervous wait / hand-on-sword pose / nod pose 1-4.
```

### 08. Scribe Len - Records Keeper

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/08-scribe-len-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Scribe Len, the Lumen Village records keeper in Hero Sword. Len carries route notes, ration tallies, scrolls, and a compact writing kit.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head is about half of total height, tiny torso, short legs, compact hands. Adult scholar identity must come from robe, satchel, scroll, and posture. Do not make Len 3-head or 4-head. No tall scholar body, no long sleeves spilling outside cells, no painterly rendering, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Scribe Len per cell, no background, no shadow, no labels. Keep scrolls, pen, satchel, robe, hair, and shoes inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, writing pose / document-check pose / thoughtful wait / pointing-at-note pose 1-4.
```

### 09. Captain Ysold - Village Guard Captain

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/09-captain-ysold-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Captain Ysold, the Lumen Village guard captain in Hero Sword. She wears compact command armor, a short cape or shoulder mark, and a small command sword kept close to the body.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of full height, tiny torso, short legs, compact armored silhouette. She should read as a disciplined adult officer through armor and posture, not height. Do not make her 3-head or 4-head. No long-legged knight proportions, no realistic anatomy, no painterly rendering, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Captain Ysold per cell, no background, no shadow, no labels. Keep sword, cape, helmet or hair, shoulder armor, and boots inside each cell.

Rows: idle 1-4, patrol walk 1-4, talk/greet 1-4, halt command / guard-ready pose / salute / watchful wait 1-4.
```

### 10. Quartermaster Dina - Supply Officer

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/10-quartermaster-dina-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Quartermaster Dina, the Lumen Village supply officer in Hero Sword. She manages wagons, ration crates, route permits, and field inventory.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head is about half of total height, compact torso, short legs, small hands. She must read as an adult logistics officer through outfit, clipboard, pouches, and confident stance. Do not make her 3-head or 4-head. No tall military body, no long legs, no painterly style, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Quartermaster Dina per cell, no background, no shadow, no labels. Keep clipboard, bags, coat hem, sleeves, and boots inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, inventory-check pose / route-pointing pose / counter service pose / strict wait pose 1-4.
```

### 11. East Guard - Gate Watch

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/11-east-guard-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for East Guard, a Lumen Village gate watch soldier in Hero Sword. The guard wears simple village armor, helmet or headband, and carries a compact spear or short polearm kept close to the body.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of total height, tiny torso, short legs, compact guard silhouette. Do not make the guard 3-head or 4-head. No long spear extending across cells, no long-legged soldier anatomy, no realistic rendering, no painterly style, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full East Guard per cell, no background, no shadow, no labels. Keep spear, helmet, armor edges, hands, and boots inside each cell.

Rows: idle 1-4, patrol walk 1-4, talk/greet 1-4, halt pose / spear-ready pose / short salute / watchful wait 1-4.
```

### 12. South Guard - Garden Gate Watch

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/12-south-guard-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for South Guard, a Lumen Village garden gate watch soldier in Hero Sword. Use a distinct but related village guard outfit with compact armor, small shield or baton, and calm watch posture.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head is about half of full height, tiny torso, very short legs. Adult guard identity comes from armor, shield, and posture. Do not make this NPC 3-head or 4-head. No tall soldier anatomy, no long legs, no realistic anatomy, no painterly rendering, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full South Guard per cell, no background, no shadow, no labels. Keep shield, baton, helmet, shoulder armor, and boots inside each cell.

Rows: idle 1-4, patrol walk 1-4, talk/greet 1-4, halt pose / shield-ready pose / salute / watchful wait 1-4.
```

### 13. Rookie Sentry - Young Guard

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/13-rookie-sentry-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Rookie Sentry, a young Lumen Village guard in Hero Sword. The sentry wears slightly oversized simple armor, a small helmet, and carries a short training spear or baton.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of total height, tiny torso, short legs, compact hands. Keep the character charming but not toddler-like; young guard identity comes from expression and slightly oversized gear. Do not make the sentry 3-head or 4-head. No long legs, no realistic anatomy, no painterly or 3D rendering.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Rookie Sentry per cell, no background, no shadow, no labels. Keep helmet, spear, armor, hands, and boots inside each cell.

Rows: idle 1-4, patrol walk 1-4, talk/greet 1-4, nervous halt / training-ready pose / salute / alert wait 1-4.
```

### 14. Plaza Villager - Town Resident

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/14-plaza-villager-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Plaza Villager, a friendly Lumen Village resident in Hero Sword. Use warm everyday fantasy clothing, simple boots, cloth layers, and a market-day village mood.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head is about half of full height, tiny torso, short legs, compact arms. Adult villager identity comes from face, outfit, and relaxed posture. Do not make the villager 3-head or 4-head. No tall casual anime body, no realistic anatomy, no painterly rendering, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Plaza Villager per cell, no background, no shadow, no labels. Keep hair, sleeves, basket or pouch, coat hem, and shoes inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, friendly wave / looking around / relaxed wait / small bow 1-4.
```

### 15. Route Runner - Messenger

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/15-route-runner-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Route Runner, a fast village messenger in Hero Sword. The runner wears light travel clothes, a short scarf, small delivery pouch, and compact boots.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of total height, tiny torso, short legs, compact limbs. The runner may look energetic but must remain 2-head chibi, not a tall athletic body. Do not make this NPC 3-head or 4-head. No long legs, no realistic runner anatomy, no painterly or 3D rendering.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Route Runner per cell, no background, no shadow, no labels. Keep scarf, pouch, hair, arms, and shoes inside each cell.

Rows: idle 1-4, quick walk/run 1-4, talk/greet 1-4, delivery pose / pointing route / catching breath / ready-to-run pose 1-4.
```

### 16. Market Courier - Courier

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/16-market-courier-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Market Courier, a Lumen Village courier in Hero Sword. The courier carries small parcels, a shoulder bag, route tags, and light practical clothing.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, large head about half of total height, tiny torso, short legs, compact arms. Adult courier identity comes from parcels and purposeful posture. Do not make this NPC 3-head or 4-head. No long-legged delivery figure, no realistic anatomy, no painterly rendering, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Market Courier per cell, no background, no shadow, no labels. Keep parcels, shoulder bag, tags, sleeves, and shoes inside each cell.

Rows: idle 1-4, quick walk 1-4, talk/greet 1-4, parcel handoff / route-check pose / hurry wait / nod pose 1-4.
```

### 17. Dock Loader - Harbor Laborer

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/17-dock-loader-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Dock Loader, a sturdy supply laborer connected to Lumen Village routes in Hero Sword. Use rolled sleeves, simple work vest, rope belt, compact crate strap, and practical boots.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of total height, tiny torso, short sturdy legs. Strength should read through pose and work clothes, not height. Do not make this NPC 3-head or 4-head. No tall laborer anatomy, no long arms, no realistic rendering, no painterly or 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Dock Loader per cell, no background, no shadow, no labels. Keep rope, straps, gloves, vest, and boots inside each cell. Avoid large crates that fill the whole cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, lifting strap pose / wiping brow / ready-to-carry pose / relaxed wait 1-4.
```

### 18. Square Bard - Plaza Performer

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/18-square-bard-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Square Bard, a Lumen Village plaza performer in Hero Sword. The bard wears bright but restrained fantasy clothing, a short cape, small lute or hand instrument, and a cheerful performer stance.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of total height, compact torso, short legs, small hands. Adult performer identity comes from costume and instrument. Do not make this NPC 3-head or 4-head. No long elegant performer body, no realistic anatomy, no painterly rendering, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Square Bard per cell, no background, no shadow, no labels. Keep lute, cape, sleeves, hat if present, and shoes inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, tiny performance pose / strum pose / bow pose / cheerful wait 1-4.
```

### 19. South Ward Child - Village Child

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/19-south-ward-child-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for South Ward Child, a child NPC from Lumen Village in Hero Sword. Use simple village clothing, small pouch, lively expression, and safe friendly body language.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of total height, tiny torso, short legs, compact hands and shoes. This character can be childlike, but must still match the same 2-head runtime style as the adult NPCs. Do not make the child 3-head or 4-head. No toddler proportions beyond the game style, no realistic anatomy, no painterly or 3D rendering.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full South Ward Child per cell, no background, no shadow, no labels. Keep hair, pouch, sleeves, hands, and shoes inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, curious wave / small hop pose / listening pose / cheerful wait 1-4.
```

### 20. King Aldren - Lumen King

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/20-king-aldren-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for King Aldren, ruler of Lumen Palace in Hero Sword. He wears a compact royal mantle, crown, formal blue and gold palace clothing, and calm kingly posture.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of total height, small torso, short legs, compact cloak. He must read as an adult king through crown, mantle, and expression, not through tall proportions. Do not make him 3-head or 4-head. No long royal body, no oversized trailing cloak crossing cells, no realistic anatomy, no painterly or 3D rendering.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full King Aldren per cell, no background, no shadow, no labels. Keep crown, mantle, sleeves, cloak edge, and shoes inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, royal address pose / hand-raised decree / thoughtful wait / dignified nod 1-4.
```

### 21. Queen Regent Celestine - Lumen Queen

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/21-queen-regent-celestine-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Queen Regent Celestine of Lumen Palace in Hero Sword. She wears elegant but compact royal clothing, pale blue or white fabric, gold details, and a calm regent presence.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of total height, small torso, short legs, compact dress silhouette. Adult queen identity comes from crown, robe, face, and posture. Do not make her 3-head or 4-head. No tall gown body, no long fashion legs, no painterly rendering, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Queen Regent Celestine per cell, no background, no shadow, no labels. Keep crown, hair, sleeves, dress hem, and shoes inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, calm address pose / hand-over-heart / quiet wait / royal nod 1-4.
```

### 22. Captain Rowan - Palace Captain

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/22-captain-rowan-runtime-dot-sheet-2.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Captain Rowan, a palace guard captain in Hero Sword. Rowan wears formal palace guard armor, blue-gold command marks, compact sword or spear, and disciplined posture.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of total height, tiny torso, short armored legs, compact weapon silhouette. He must read as an adult palace officer through armor, command marks, and stance. Do not make him 3-head or 4-head. No long-legged knight body, no realistic anatomy, no painterly rendering, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Captain Rowan per cell, no background, no shadow, no labels. Keep weapon, cape, helmet or hair, armor, and boots inside each cell.

Rows: idle 1-4, patrol walk 1-4, talk/greet 1-4, halt command / salute / ready stance / watchful wait 1-4.
```

### 23. Archivist Mirel - Palace Archivist

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/23-archivist-mirel-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Archivist Mirel of Lumen Palace in Hero Sword. Mirel is a palace archivist with layered scholar robes, scroll case, record book, and quiet analytical expression.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of full height, tiny torso, short legs, compact robe. Adult scholar identity comes from robe, scrolls, and posture. Do not make Mirel 3-head or 4-head. No tall robe figure, no long sleeves outside cells, no realistic anatomy, no painterly or 3D rendering.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Archivist Mirel per cell, no background, no shadow, no labels. Keep scroll case, book, sleeves, hair, robe hem, and shoes inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, reading pose / record-check pose / counter service pose / thoughtful wait 1-4.
```

### 24. Chamberlain Orla - Palace Chamberlain

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/24-chamberlain-orla-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Chamberlain Orla of Lumen Palace in Hero Sword. Orla is a palace chamberlain with formal service clothing, key ring, folded cloth or ledger, and precise court posture.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of full height, tiny torso, short legs, compact formal silhouette. Adult court identity comes from face, keys, uniform, and posture. Do not make Orla 3-head or 4-head. No tall servant body, no long realistic limbs, no painterly or 3D rendering.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Chamberlain Orla per cell, no background, no shadow, no labels. Keep key ring, sleeves, uniform hem, hair, and shoes inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, court 안내 pose / ledger-check pose / polite bow / strict wait 1-4.
```

### 25. Sanctum Knight - Palace Holy Guard

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/25-sanctum-knight-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Sanctum Knight, a holy palace guard in Hero Sword. The knight wears bright compact armor, white-blue cloth accents, a short cape, and a compact ceremonial weapon.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of total height, tiny torso, short armored legs, compact shoulders. The knight should feel solemn and strong without becoming tall. Do not make this NPC 3-head or 4-head. No realistic knight anatomy, no long cape crossing cells, no painterly rendering, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Sanctum Knight per cell, no background, no shadow, no labels. Keep weapon, cape, helmet, armor edges, and boots inside each cell.

Rows: idle 1-4, patrol walk 1-4, talk/greet 1-4, halt command / guard-ready pose / oath pose / still watch pose 1-4.
```

### 26. Archive Aide - Junior Archivist

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/26-archive-aide-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Archive Aide, a junior palace archive worker in Hero Sword. The aide wears simple scholar clothing, carries small books or scrolls, and has a helpful court assistant presence.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of total height, compact torso, short legs, small hands. Do not make this NPC 3-head or 4-head. No tall academic body, no realistic anatomy, no painterly rendering, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Archive Aide per cell, no background, no shadow, no labels. Keep books, scrolls, sleeves, hair, and shoes inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, carrying books / sorting scroll / listening pose / helpful wait 1-4.
```

### 27. Garden Caretaker - Palace Gardener

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/27-garden-caretaker-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Garden Caretaker, a palace gardener in Hero Sword. The caretaker wears work clothes, apron, gloves, small pruning tool, and a gentle palace service presence.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of total height, tiny torso, short legs, compact tools. Adult caretaker identity comes from outfit and props, not height. Do not make this NPC 3-head or 4-head. No long-legged worker anatomy, no realistic rendering, no painterly style, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Garden Caretaker per cell, no background, no shadow, no labels. Keep pruning tool, apron, gloves, hair, and shoes inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, pruning pose / checking plant pose / gentle wave / relaxed wait 1-4.
```

### 28. Lantern Keeper - Palace Lighting Attendant

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/28-lantern-keeper-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Lantern Keeper, a palace lighting attendant in Hero Sword. The keeper carries a small lantern, wears simple palace service clothing, and has a quiet night-watch mood.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of full height, tiny torso, short legs, compact lantern. Do not make this NPC 3-head or 4-head. No tall lantern bearer silhouette, no long arms, no realistic anatomy, no painterly lighting, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Lantern Keeper per cell, no background, no shadow, no labels. Keep lantern close to body and fully inside each cell. Avoid glow effects crossing cell boundaries.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, lantern-check pose / quiet bow / listening pose / watchful wait 1-4.
```

### 29. Gate Clerk - Palace Entry Clerk

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/29-gate-clerk-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Gate Clerk, a palace entry clerk in Hero Sword. The clerk handles passes, seals, guest records, and gate paperwork. Use compact formal clothes, small ledger, and key or seal cord.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of total height, small torso, short legs. Adult clerk identity comes from uniform, ledger, and orderly posture. Do not make this NPC 3-head or 4-head. No tall clerk body, no realistic anatomy, no painterly or 3D rendering.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Gate Clerk per cell, no background, no shadow, no labels. Keep ledger, seal cord, sleeves, hair, and shoes inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, pass-check pose / stamping pose / counter service pose / waiting pose 1-4.
```

### 30. Traveling Healer - Road Healer

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/30-traveling-healer-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Traveling Healer, a road healer visiting Lumen Village in Hero Sword. The healer wears warm travel robes, carries a small medicine satchel, bandages, and a modest staff kept close.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of total height, tiny torso, short legs, compact hands. Adult healer identity comes from robe, bag, and calm posture. Do not make this NPC 3-head or 4-head. No tall priest body, no long staff outside cells, no realistic anatomy, no painterly glow, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Traveling Healer per cell, no background, no shadow, no labels. Keep satchel, staff, sleeves, robe, hair, and shoes inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, bandage-check pose / small blessing pose / listening pose / wait pose 1-4.
```

### 31. Fountain Vendor - Plaza Seller

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/31-fountain-vendor-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Fountain Vendor, a small plaza seller near the Lumen Village fountain in Hero Sword. Use warm vendor clothing, small tray or pouch, and approachable market posture.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of total height, tiny torso, short legs, compact tray. Adult vendor identity comes from costume, tray, and smile. Do not make this NPC 3-head or 4-head. No tall shopkeeper anatomy, no realistic rendering, no painterly or 3D style.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Fountain Vendor per cell, no background, no shadow, no labels. Keep tray, pouch, sleeves, hair, and shoes inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, offer-goods pose / cheerful wave / tray-check pose / relaxed wait 1-4.
```

### 32. Forge Apprentice - Junior Smith

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/32-forge-apprentice-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Forge Apprentice, a junior smith in Lumen Village in Hero Sword. Use compact work clothes, small apron, gloves, soot marks, and a small tool.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of total height, tiny torso, short legs, compact tool. Youthful apprentice identity comes from expression and slightly oversized work gear. Do not make this NPC 3-head or 4-head. No tall worker body, no realistic anatomy, no painterly rendering, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Forge Apprentice per cell, no background, no shadow, no labels. Keep tool, apron, gloves, hair, and boots inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, tool-ready pose / inspecting metal / nervous wait / eager nod 1-4.
```

### 33. Armor Fitter - Armor Assistant

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/33-armor-fitter-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Armor Fitter, an armor shop assistant in Lumen Village in Hero Sword. Use cloth workwear, measuring tape, leather strap, and small armor fitting tools.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of total height, tiny torso, short legs, compact hands. Adult assistant identity comes from apron, measuring tape, and focused posture. Do not make this NPC 3-head or 4-head. No tall tailoring body, no long legs, no realistic anatomy, no painterly or 3D rendering.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Armor Fitter per cell, no background, no shadow, no labels. Keep measuring tape, straps, sleeves, hair, and shoes inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, measuring pose / checking strap / helpful point / shop wait pose 1-4.
```

### 34. Relic Custodian - Relic Assistant

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/34-relic-custodian-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Relic Custodian, an assistant who cares for relics and seals in Hero Sword. Use compact robes, small gloves, charm pouch, and quiet careful posture.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of total height, tiny torso, short legs, compact robe. Adult custodian identity comes from robe, gloves, charm pouch, and careful pose. Do not make this NPC 3-head or 4-head. No tall mystic body, no large magic effects, no painterly rendering, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Relic Custodian per cell, no background, no shadow, no labels. Keep pouch, sleeves, robe hem, hair, and shoes inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, holding small relic / checking charm / careful bow / quiet wait 1-4.
```

### 35. Palace Page - Palace Attendant

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/35-palace-page-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Palace Page, a young palace attendant in Hero Sword. Use neat palace service clothes, small message scroll, and polite court posture.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of full height, tiny torso, short legs, compact hands. Youthful page identity comes from outfit and expression, not tall body shape. Do not make this NPC 3-head or 4-head. No long-legged court servant body, no realistic anatomy, no painterly or 3D rendering.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Palace Page per cell, no background, no shadow, no labels. Keep message scroll, sleeves, hair, uniform hem, and shoes inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, message delivery pose / polite bow / listening pose / attentive wait 1-4.
```

### 36. Royal Cook - Palace Cook

- target_file: `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03/36-royal-cook-runtime-dot-sheet.png`

```text
Create a transparent PNG runtime NPC sprite sheet for Royal Cook, a palace kitchen worker in Hero Sword. Use compact cook clothing, apron, small chef cap or head cloth, wooden spoon or ladle kept close, and warm practical expression.

Strict style and proportion: modern fantasy pixel art, clean dot-game sprite sheet, super-deformed 2-head chibi body, head about half of total height, tiny torso, short legs, compact arms. Adult cook identity comes from apron, cap, utensil, and posture. Do not make this NPC 3-head or 4-head. No tall kitchen worker anatomy, no long limbs, no painterly rendering, no 3D.

Cut rules: 1792 x 1792 transparent canvas, exact 4 x 4 grid, 384 x 384 cells, 32px transparent gutters, 80px transparent outer margin, one full Royal Cook per cell, no background, no shadow, no labels. Keep ladle, apron, cap, sleeves, and shoes inside each cell.

Rows: idle 1-4, walk 1-4, talk/greet 1-4, tasting pose / ladle-ready pose / cheerful wait / kitchen order pose 1-4.
```

