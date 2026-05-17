# NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03

This document replaces the old mixed NPC prompt notes with a cleaner production batch.

Scope:
- current named town / palace NPCs
- current ambient NPCs
- additional population wave for the larger village and palace

Total roster:
- current NPCs: `25`
- expansion NPCs: `11`
- total prompts prepared: `72`
  - runtime dot prompts: `36`
  - high-resolution portrait prompts: `36`

Image family split:
- `runtime dot`: for town walking NPCs, palace NPCs, and future animated service NPC use
- `portrait`: for dialogue, story scenes, codex, and gacha-style character reveals

Runtime dot rules:
- one image = one NPC sprite sheet
- transparent PNG
- `1792 x 1792`
- exact `4 x 4` equal grid
- each frame cell exactly `384 x 384`
- `32px` transparent gutter between cells
- `64px` transparent outer margin
- one full character inside one cell only
- head, shoes, cloak edge, bag edge, spear edge, hair edge must stay inside the cell
- no floor shadow, no background, no text, no watermark
- fixed row plan:
  - row 1: `idle 1-4`
  - row 2: `walk 1-4`
  - row 3: `talk / greet 1-4`
  - row 4: `service pose / turn / wait pose 1-4`

Portrait rules:
- one image = one NPC
- transparent PNG
- `2048 x 2560`
- chest-up to thigh-up fantasy dialogue portrait
- one character only
- large safe margin around head, sleeves, cloak, tools, hair
- no background scene, no speech bubble, no UI frame, no text

Style lock for both:
- classic Farland Tactics 1 and 2 inspired fantasy RPG look
- 2D anime fantasy
- warm, readable, slightly charming
- not photorealistic
- not painterly concept art
- not 3D CGI
- not western dark fantasy realism

Expanded roster:
1. Orin
2. Marta
3. Neri
4. Torren
5. Seline
6. Mayor Haru
7. Bram
8. Scribe Len
9. Captain Ysold
10. Quartermaster Dina
11. East Guard
12. South Guard
13. Rookie Sentry
14. Plaza Villager
15. Route Runner
16. Market Courier
17. Dock Loader
18. Square Bard
19. South Ward Child
20. King Aldren
21. Queen Regent Celestine
22. Captain Rowan
23. Archivist Mirel
24. Chamberlain Orla
25. Sanctum Knight
26. Archive Aide
27. Garden Caretaker
28. Lantern Keeper
29. Gate Clerk
30. Traveling Healer
31. Fountain Vendor
32. Forge Apprentice
33. Armor Fitter
34. Relic Custodian
35. Palace Page
36. Royal Cook

---

## Runtime Dot Prompts

### 01. Orin Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/01-orin-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for Orin, the weapon merchant of Lumen Village in Hero Sword. He is a practical middle-aged weapon seller and smith-adjacent shopkeeper. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, warm fantasy tone, not realistic, not painterly, not 3D. Outfit: work tunic, leather apron, weapon-shop gloves, compact utility belt, simple metalworking details. Keep him sturdy, reliable, and readable.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter between cells
- 64px transparent outer margin
- one full character inside one cell only
- no floor shadow
- no background
- no text or watermark
- head, sleeves, apron edge, boots, belt tools, and hand silhouette must stay fully inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: service counter pose, short turn, arms-fold wait, shop-ready pose
```

### 02. Marta Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/02-marta-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for Marta, the armor merchant of Lumen Village in Hero Sword. She is a grounded defensive gear specialist with cloth, leather, shield straps, and plated sample pieces. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, warm fantasy tone, not realistic, not painterly, not 3D. She should look practical, experienced, and dependable rather than noble or glamorous.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no floor shadow, no background, no text
- shoulder cloth, armor skirt, shield strap, and boots must stay fully inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: service pose, measuring pose, hands-on-hip wait, guarded stance
```

### 03. Neri Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/03-neri-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for Neri, the supply merchant of Lumen Village in Hero Sword. She sells potions, travel meals, satchels, and field tools. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, warm fantasy tone, not realistic, not painterly, not 3D. She should feel organized, approachable, and useful.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no floor shadow, no background, no text
- pouch, bottle, satchel, sleeves, and shoes must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: inventory-check pose, pointing pose, wait pose, counter-ready pose
```

### 04. Torren Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/04-torren-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for Torren, the forge master of Lumen Village in Hero Sword. He is a heavy-duty senior blacksmith with soot-marked workwear, gloves, apron, and a forge-built silhouette. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. He should feel strong, grounded, and trustworthy.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no background, no floor shadow, no text
- hammer hand, apron hem, boots, shoulder bulk, and belt tools must stay fully inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: forge-ready stance, inspect-metal pose, arms-rest wait, nod pose
```

### 05. Seline Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/05-seline-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for Seline, the relic merchant of Lumen Village in Hero Sword. She handles fragments, seals, and route echoes. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, warm but mysterious fantasy tone, not realistic, not painterly, not 3D. She must look arcane but grounded, elegant but still suitable for a village shop.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell only
- no aura burst, no floating relic effects, no background
- hair, sleeves, charm belt, dress hem, and shoes must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: relic-reading pose, quiet wait pose, hand-raised guide pose, counter service pose
```

### 06. Mayor Haru Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/06-mayor-haru-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for Mayor Haru of Lumen Village in Hero Sword. He is the practical village elder and first major story guide. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, warm and trustworthy, not realistic, not painterly, not 3D. He should read as wise, village-rooted, and calm under pressure.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no floor shadow, no background, no text
- robe edge, staff or cane if present, sleeves, hair, and shoes must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: mayor address pose, thoughtful pose, open-hand guide pose, still wait pose
```

### 07. Bram Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/07-bram-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for Bram in Hero Sword. He is the first companion recruit, a dependable route-ready guard with a grounded practical silhouette. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. He should look reliable and like a future party member, but still belong inside village scenes.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell only
- no floor shadow, no background, no text
- sword hilt, shoulder cape, boots, hair, and gloves must stay fully inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: recruit-ready pose, route-watch pose, firm wait pose, calm guard pose
```

### 08. Scribe Len Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/08-scribe-len-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for Scribe Len of Lumen Village in Hero Sword. Len is a quiet records keeper who tracks names, route logs, and ration tallies. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. The character should feel observant, modest, and paper-work precise.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no background, no text, no floor shadow
- scroll case, sleeves, satchel, and shoes must stay within each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: writing pose, note-check pose, patient wait pose, archive-guide pose
```

### 09. Captain Ysold Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/09-captain-ysold-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for Captain Ysold of Lumen Village in Hero Sword. Ysold is the route security captain tied to the palace watch and village gate pressure. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. The character should look disciplined, alert, and like a field command NPC.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no floor shadow, no background, no text
- spear, mantle, boots, and hands must stay inside the cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: command pose, guard halt pose, map-check pose, stern wait pose
```

### 10. Quartermaster Dina Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/10-quartermaster-dina-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for Quartermaster Dina of Lumen Village in Hero Sword. Dina decides supply wagon flow and post-sortie distribution. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. She should look efficient, alert, and logistics-minded.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no background, no floor shadow, no text
- clipboard or ledger, belt, sleeves, boots, and hair must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: ration-check pose, pointing pose, inventory-wait pose, dispatch pose
```

### 11. East Guard Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/11-east-guard-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the East Guard of Lumen Village in Hero Sword. He is a standard route guard stationed on the eastern lane. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. He should read as dependable safe-zone security, not an elite hero.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no background, no floor shadow, no text
- sword or spear edge, cape edge, boots, and helmet must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: patrol walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: halt pose, watch pose, short turn, ready wait
```

### 12. South Guard Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/12-south-guard-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the South Guard of Lumen Village in Hero Sword. He watches the lower ward and shelter lane. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. He should feel like a grounded village defender with spear-watch duty.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no floor shadow, no background, no text
- spear shaft, cloak edge, gloves, and boots must stay within each cell

Row plan:
- row 1: idle 1 to 4
- row 2: patrol walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: spear-rest pose, ward-check pose, halt pose, ready wait pose
```

### 13. Rookie Sentry Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/13-rookie-sentry-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the Rookie Sentry of Lumen Village in Hero Sword. This is a younger guard still learning duty at the upper lane. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. The pose language should feel eager and slightly less composed than veteran guards.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character inside one cell
- no background, no floor shadow, no text
- weapon, hair, shoulder cloth, boots, and hands must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: patrol walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: nervous attention pose, enthusiastic salute, short turn, ready wait
```

### 14. Plaza Villager Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/14-plaza-villager-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the Plaza Villager of Lumen Village in Hero Sword. This is a general town resident who lingers around the fountain square for news. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, warm everyday fantasy, not realistic, not painterly, not 3D. The villager should feel ordinary, approachable, and readable.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no floor shadow, no background, no text
- hair, sleeves, apron or shawl, and shoes must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: waiting pose, worried pose, chatting pose, calm rest pose
```

### 15. Route Runner Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/15-route-runner-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the Route Runner of Lumen Village in Hero Sword. This NPC carries messages between lanes and gates. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. The silhouette should be lighter and quicker than a villager, but not a rogue assassin.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no floor shadow, no background, no text
- satchel, messenger tube, scarf edge, boots, and hands must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: fast walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: message-ready pose, running-start pose, stop-and-report pose, wait pose
```

### 16. Market Courier Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/16-market-courier-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the Market Courier of Lumen Village in Hero Sword. This NPC moves supply notes and crate counts across the market lanes. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. The look should be efficient, practical, and town-service focused.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no floor shadow, no background, no text
- satchel, rolled list, sleeves, boots, and head silhouette must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: brisk walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: list-check pose, crate-count pose, dispatch pose, waiting pose
```

### 17. Dock Loader Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/17-dock-loader-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the Dock Loader of Lumen Village in Hero Sword. This NPC handles cargo and route supply movements. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. The character should feel sturdy, practical, and a bit weather-worn.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no floor shadow, no background, no text
- rope, gloves, rolled sleeves, belt, and boots must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: lifting-ready pose, load-check pose, wave pose, rest pose
```

### 18. Square Bard Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/18-square-bard-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the Square Bard of Lumen Village in Hero Sword. This NPC brings life to the plaza and reflects the mood of the town. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, slightly charming fantasy tone, not realistic, not painterly, not 3D. The bard should feel artistic but not flashy.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no background, no floor shadow, no text
- lute or flute if used, sleeves, hair, and shoes must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: soft performance pose, listen pose, hand-wave pose, quiet rest pose
```

### 19. South Ward Child Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/19-south-ward-child-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the South Ward Child of Lumen Village in Hero Sword. This is a safe-zone village child used to make the town feel lived in. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, warm and grounded, not doll-like, not realistic, not painterly, not 3D.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no floor shadow, no background, no text
- hair, sleeves, small bag or toy if present, and shoes must stay within each cell

Row plan:
- row 1: idle 1 to 4
- row 2: small walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: curious look pose, small wave, waiting pose, little step pose
```

### 20. King Aldren Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/20-king-aldren-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for King Aldren of Lumen Palace in Hero Sword. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, refined royal fantasy, not realistic, not painterly, not 3D. He should look authoritative, older, composed, and clearly royal, but still in the same compact gameplay family as the other NPCs.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no throne, no background, no floor shadow, no text
- crown, fur mantle, sleeves, robe hem, and boots must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: ceremonial step 1 to 4
- row 3: talk and greet 1 to 4
- row 4: royal address pose, still judgment pose, quiet wait pose, court-ready pose
```

### 21. Queen Regent Celestine Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/21-queen-regent-celestine-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for Queen Regent Celestine of Lumen Palace in Hero Sword. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, graceful royal fantasy, not realistic, not painterly, not 3D. She should look noble, composed, and intelligent, with clean blue-white-gold ceremonial clothing.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no background, no floor shadow, no text
- hair ornament, sleeves, gown edge, and shoes must stay fully inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: ceremonial step 1 to 4
- row 3: talk and greet 1 to 4
- row 4: listening pose, open-hand counsel pose, still wait pose, court stance
```

### 22. Captain Rowan Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/22-captain-rowan-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for Captain Rowan of Lumen Palace in Hero Sword. He is an elite palace guard captain. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. He should look formal, disciplined, and more polished than village guards.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no background, no floor shadow, no text
- spear or sword edge, cloak, shoulder armor, and boots must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: formal march step 1 to 4
- row 3: talk and greet 1 to 4
- row 4: command pose, palace halt pose, short salute, ready wait
```

### 23. Archivist Mirel Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/23-archivist-mirel-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for Archivist Mirel of Lumen Palace in Hero Sword. She is a court historian and record keeper. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. She should look reserved, intelligent, and careful.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no background, no floor shadow, no text
- hair, robe edge, document roll, and shoes must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: note-check pose, archive-guide pose, reading pose, still wait pose
```

### 24. Chamberlain Orla Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/24-chamberlain-orla-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for Chamberlain Orla of Lumen Palace in Hero Sword. She is a senior palace attendant who manages court order and ceremony flow. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. She should look precise, well-composed, and formal without becoming overly extravagant.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no background, no floor shadow, no text
- sleeves, sash, keys or notes if present, and shoes must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: formal walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: ushering pose, court-listen pose, still wait pose, guidance pose
```

### 25. Sanctum Knight Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/25-sanctum-knight-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the Sanctum Knight of Lumen Palace in Hero Sword. This NPC represents late-game sacred military authority. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. The knight should look firm, disciplined, and ceremonial.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no background, no floor shadow, no text
- weapon edge, cloak, armor spikes, and boots must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: disciplined step 1 to 4
- row 3: talk and greet 1 to 4
- row 4: guard-rest pose, formal halt, short turn, ready wait
```

### 26. Archive Aide Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/26-archive-aide-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the Archive Aide of Lumen Palace in Hero Sword. This expansion NPC helps Mirel with records and document movement. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. The character should look young, diligent, and palace-trained.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no background, no floor shadow, no text
- rolled papers, sleeves, tunic hem, and shoes must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: brisk walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: carry-record pose, sorting pose, waiting pose, short bow pose
```

### 27. Garden Caretaker Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/27-garden-caretaker-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the Garden Caretaker of Lumen Village in Hero Sword. This expansion NPC tends herbs and decorative green spaces around the enlarged town. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. The character should feel peaceful, practical, and warm.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no background, no floor shadow, no text
- watering can or pruning tool if present, apron edge, hair, and shoes must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: tending pose, watering pose, relaxed wait pose, gentle wave
```

### 28. Lantern Keeper Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/28-lantern-keeper-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the Lantern Keeper of Lumen Village in Hero Sword. This expansion NPC maintains lights in the town after dusk. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. The character should look methodical and service-focused.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no background, no floor shadow, no text
- ladder hook or lamp tool if present, sleeves, coat edge, and shoes must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: lamp-check pose, upward look pose, relaxed wait pose, maintenance pose
```

### 29. Gate Clerk Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/29-gate-clerk-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the Gate Clerk of Lumen Village in Hero Sword. This expansion NPC handles route permissions, logs, and gate board notices. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. The character should feel administrative, alert, and lightly stressed.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no background, no floor shadow, no text
- ledger, satchel, sleeves, and shoes must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: route-board pose, ledger-check pose, waiting pose, dispatch pose
```

### 30. Traveling Healer Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/30-traveling-healer-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the Traveling Healer in Hero Sword. This expansion NPC is a mobile support figure in the widened town population. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, caring but grounded fantasy tone, not realistic, not painterly, not 3D. The character should feel compassionate, practical, and route-experienced.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no background, no floor shadow, no text
- satchel, healer wrap, sleeves, and shoes must stay within each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: aid-ready pose, calm wait pose, checkup pose, reassurance pose
```

### 31. Fountain Vendor Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/31-fountain-vendor-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the Fountain Vendor of Lumen Village in Hero Sword. This expansion NPC sells simple snacks, drinks, or charms near the square. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. The character should feel lively, friendly, and very town-centered.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no background, no floor shadow, no text
- tray or basket if present, sleeves, apron edge, and shoes must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: selling pose, cheerful wait pose, call-out pose, tidy-rest pose
```

### 32. Forge Apprentice Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/32-forge-apprentice-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the Forge Apprentice of Lumen Village in Hero Sword. This expansion NPC works under Torren and helps the forge feel active. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. The character should feel younger, hardworking, and a little rough around the edges.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no background, no floor shadow, no text
- tool belt, gloves, apron edge, and boots must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: work-ready pose, carrying-tools pose, waiting pose, quick nod pose
```

### 33. Armor Fitter Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/33-armor-fitter-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the Armor Fitter of Lumen Village in Hero Sword. This expansion NPC assists Marta with straps, padding, and adjustments. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. The character should feel skilled, patient, and tactile.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no floor shadow, no background, no text
- cloth strap, measuring tape, sleeves, and shoes must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: fitting pose, measuring pose, ready wait pose, workshop pose
```

### 34. Relic Custodian Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/34-relic-custodian-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the Relic Custodian of Lumen Village in Hero Sword. This expansion NPC supports Seline and handles safe storage of fragments and sealed objects. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. The character should feel quiet, careful, and ritual-aware.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no magical explosion, no background, no floor shadow, no text
- sleeves, charm cord, robe edge, and shoes must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: relic-hold pose, seal-check pose, patient wait pose, guide pose
```

### 35. Palace Page Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/35-palace-page-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the Palace Page of Lumen Palace in Hero Sword. This expansion NPC helps messages, court movement, and attendance around the hall. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. The character should feel quick, respectful, and palace-trained.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no background, no floor shadow, no text
- letter case, sleeves, page uniform tails, and shoes must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: brisk walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: message-offer pose, bow pose, waiting pose, court-runner pose
```

### 36. Royal Cook Runtime Dot Sheet

- target_file:
  - `assets/source/world/npc-runtime-v2/36-royal-cook-runtime-sheet.png`

```text
Create a production-ready runtime dot NPC sprite sheet for the Royal Cook of Lumen Palace in Hero Sword. This expansion NPC helps the palace feel inhabited beyond ceremony and war. Use classic Farland Tactics 1 and 2 inspired fantasy RPG NPC art, clean 2D dot-game style, not realistic, not painterly, not 3D. The cook should feel capable, grounded, and palace-service practical rather than comedic.

Cut-friendly rules:
- transparent PNG
- 1792 x 1792
- exact 4 x 4 equal grid
- each frame cell exactly 384 x 384
- 32px transparent gutter
- 64px transparent outer margin
- one full character per cell
- no background, no floor shadow, no text
- apron, cap or hair tie, ladle or tray if present, and shoes must stay inside each cell

Row plan:
- row 1: idle 1 to 4
- row 2: walk 1 to 4
- row 3: talk and greet 1 to 4
- row 4: serving pose, kitchen-ready pose, waiting pose, polite nod pose
```

---

## High-Resolution Portrait Prompts

### 01. Orin Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/01-orin-portrait.png`

```text
Create a high-resolution transparent-background portrait of Orin, the weapon merchant of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, warm and grounded, not photorealistic, not 3D, not painterly concept art. Show a practical middle-aged craftsman and weapon seller with leather apron layers, working hands, sturdy posture, and a no-nonsense but reliable expression. One character only. 2048 x 2560 transparent PNG. Large safe margin around head, shoulders, sleeves, and props. No background, no text, no UI frame.
```

### 02. Marta Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/02-marta-portrait.png`

```text
Create a high-resolution transparent-background portrait of Marta, the armor merchant of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, warm and grounded, not photorealistic, not 3D, not painterly concept art. Show a practical armor specialist with layered cloth, leather, fittings, and a firm dependable expression. One character only. 2048 x 2560 transparent PNG. Large safe margin around head, shoulders, sleeves, and silhouette. No background, no text, no UI frame.
```

### 03. Neri Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/03-neri-portrait.png`

```text
Create a high-resolution transparent-background portrait of Neri, the supply merchant of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, slightly bright and friendly, not photorealistic, not 3D, not painterly concept art. Show a neat and capable shopkeeper with pouches, bottles, travel gear, and a helpful expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 04. Torren Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/04-torren-portrait.png`

```text
Create a high-resolution transparent-background portrait of Torren, the master blacksmith of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, grounded and strong, not photorealistic, not 3D, not painterly concept art. Show a senior forge artisan with soot marks, heavy apron, practical workwear, and a trustworthy expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 05. Seline Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/05-seline-portrait.png`

```text
Create a high-resolution transparent-background portrait of Seline, the relic merchant of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, arcane but grounded, not photorealistic, not 3D, not painterly concept art. Show a calm and watchful relic handler with refined but restrained mystical costume cues. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 06. Mayor Haru Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/06-mayor-haru-portrait.png`

```text
Create a high-resolution transparent-background portrait of Mayor Haru of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, warm and wise, not photorealistic, not 3D, not painterly concept art. Show a respected village elder with layered practical clothing, age, calm dignity, and trustworthiness. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 07. Bram Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/07-bram-portrait.png`

```text
Create a high-resolution transparent-background portrait of Bram from Hero Sword, the first recruit companion found in Lumen Village. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, heroic but grounded, not photorealistic, not 3D, not painterly concept art. Show a dependable route-ready guard with practical armor, a calm brave expression, and clear future-party-member presence. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 08. Scribe Len Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/08-scribe-len-portrait.png`

```text
Create a high-resolution transparent-background portrait of Scribe Len of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, quiet and intelligent, not photorealistic, not 3D, not painterly concept art. Show a records keeper with scroll cases, practical writing tools, modest clothing, and a focused expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 09. Captain Ysold Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/09-captain-ysold-portrait.png`

```text
Create a high-resolution transparent-background portrait of Captain Ysold of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, disciplined and practical, not photorealistic, not 3D, not painterly concept art. Show a route security captain with field authority, spear-guard identity, and a serious duty-first expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 10. Quartermaster Dina Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/10-quartermaster-dina-portrait.png`

```text
Create a high-resolution transparent-background portrait of Quartermaster Dina of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, efficient and grounded, not photorealistic, not 3D, not painterly concept art. Show a logistics expert with ration notes, dispatch gear, and a sharp practical expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 11. East Guard Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/11-east-guard-portrait.png`

```text
Create a high-resolution transparent-background portrait of the East Guard of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, grounded and readable, not photorealistic, not 3D, not painterly concept art. Show a dependable safe-zone guard with practical armor and a calm watchman expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 12. South Guard Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/12-south-guard-portrait.png`

```text
Create a high-resolution transparent-background portrait of the South Guard of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, village-defense focused and grounded, not photorealistic, not 3D, not painterly concept art. Show a spear-duty ward guard with shelter-lane responsibility and a dependable expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 13. Rookie Sentry Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/13-rookie-sentry-portrait.png`

```text
Create a high-resolution transparent-background portrait of the Rookie Sentry of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, youthful and earnest, not photorealistic, not 3D, not painterly concept art. Show a younger town guard still learning, with eager posture and a slightly nervous but sincere expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 14. Plaza Villager Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/14-plaza-villager-portrait.png`

```text
Create a high-resolution transparent-background portrait of the Plaza Villager of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, simple and warm, not photorealistic, not 3D, not painterly concept art. Show an ordinary resident whose role is to bring life and concern to the central square. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 15. Route Runner Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/15-route-runner-portrait.png`

```text
Create a high-resolution transparent-background portrait of the Route Runner of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, agile and practical, not photorealistic, not 3D, not painterly concept art. Show a messenger with route tools, satchel, and a fast alert expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 16. Market Courier Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/16-market-courier-portrait.png`

```text
Create a high-resolution transparent-background portrait of the Market Courier of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, organized and efficient, not photorealistic, not 3D, not painterly concept art. Show a supply-lane courier with note bundles, satchel, and a sharp practical expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 17. Dock Loader Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/17-dock-loader-portrait.png`

```text
Create a high-resolution transparent-background portrait of the Dock Loader of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, sturdy and weather-worn, not photorealistic, not 3D, not painterly concept art. Show a cargo worker with rope gear, rolled sleeves, and a practical expression shaped by hard work. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 18. Square Bard Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/18-square-bard-portrait.png`

```text
Create a high-resolution transparent-background portrait of the Square Bard of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, charming but grounded, not photorealistic, not 3D, not painterly concept art. Show a modest plaza musician whose role is to color the town's mood without becoming flashy or theatrical. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 19. South Ward Child Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/19-south-ward-child-portrait.png`

```text
Create a high-resolution transparent-background portrait of the South Ward Child of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, natural and grounded, not photorealistic, not 3D, not painterly concept art. Show a believable town child with simple clothes and gentle curiosity, not doll-like or exaggeratedly cute. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 20. King Aldren Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/20-king-aldren-portrait.png`

```text
Create a high-resolution transparent-background portrait of King Aldren of Lumen Palace in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, royal and dignified, not photorealistic, not 3D, not painterly concept art. Show an older king with blue-and-gold authority, white fur mantle, restrained crown, and the presence of a ruler who has carried a long crisis. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 21. Queen Regent Celestine Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/21-queen-regent-celestine-portrait.png`

```text
Create a high-resolution transparent-background portrait of Queen Regent Celestine of Lumen Palace in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, noble and composed, not photorealistic, not 3D, not painterly concept art. Show a thoughtful royal figure in blue-white-gold court attire with an intelligent listening expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 22. Captain Rowan Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/22-captain-rowan-portrait.png`

```text
Create a high-resolution transparent-background portrait of Captain Rowan of Lumen Palace in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, disciplined and elite, not photorealistic, not 3D, not painterly concept art. Show a palace guard captain with refined armor, officer authority, and a calm soldier's expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 23. Archivist Mirel Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/23-archivist-mirel-portrait.png`

```text
Create a high-resolution transparent-background portrait of Archivist Mirel of Lumen Palace in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, quiet and thoughtful, not photorealistic, not 3D, not painterly concept art. Show a court archivist with layered scholar robes, record tools, and a measured analytical expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 24. Chamberlain Orla Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/24-chamberlain-orla-portrait.png`

```text
Create a high-resolution transparent-background portrait of Chamberlain Orla of Lumen Palace in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, formal and orderly, not photorealistic, not 3D, not painterly concept art. Show a palace chamberlain with court-management dignity, precise dress, and a capable calm expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 25. Sanctum Knight Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/25-sanctum-knight-portrait.png`

```text
Create a high-resolution transparent-background portrait of the Sanctum Knight of Lumen Palace in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, solemn and martial, not photorealistic, not 3D, not painterly concept art. Show a sacred guard with controlled holy-knight styling, disciplined armor, and a stoic expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 26. Archive Aide Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/26-archive-aide-portrait.png`

```text
Create a high-resolution transparent-background portrait of the Archive Aide of Lumen Palace in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, diligent and modest, not photorealistic, not 3D, not painterly concept art. Show a younger assistant carrying records and helping the palace archive function. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 27. Garden Caretaker Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/27-garden-caretaker-portrait.png`

```text
Create a high-resolution transparent-background portrait of the Garden Caretaker of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, peaceful and practical, not photorealistic, not 3D, not painterly concept art. Show a caretaker who tends herbs and village greenery with a gentle but capable expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 28. Lantern Keeper Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/28-lantern-keeper-portrait.png`

```text
Create a high-resolution transparent-background portrait of the Lantern Keeper of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, practical and service-minded, not photorealistic, not 3D, not painterly concept art. Show a town worker responsible for lights, ladders, and evening maintenance. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 29. Gate Clerk Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/29-gate-clerk-portrait.png`

```text
Create a high-resolution transparent-background portrait of the Gate Clerk of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, administrative and alert, not photorealistic, not 3D, not painterly concept art. Show a route-office worker with a ledger, satchel, and the expression of someone who tracks every sortie. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 30. Traveling Healer Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/30-traveling-healer-portrait.png`

```text
Create a high-resolution transparent-background portrait of the Traveling Healer in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, calm and compassionate, not photorealistic, not 3D, not painterly concept art. Show a road-worn support figure with clean healer gear and a reassuring expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 31. Fountain Vendor Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/31-fountain-vendor-portrait.png`

```text
Create a high-resolution transparent-background portrait of the Fountain Vendor of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, cheerful but grounded, not photorealistic, not 3D, not painterly concept art. Show a plaza-side seller who brings life to the square with simple goods and friendly energy. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 32. Forge Apprentice Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/32-forge-apprentice-portrait.png`

```text
Create a high-resolution transparent-background portrait of the Forge Apprentice of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, hardworking and young, not photorealistic, not 3D, not painterly concept art. Show an apprentice smith with practical forge gear, soot traces, and a determined expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 33. Armor Fitter Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/33-armor-fitter-portrait.png`

```text
Create a high-resolution transparent-background portrait of the Armor Fitter of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, skilled and practical, not photorealistic, not 3D, not painterly concept art. Show a specialist who adjusts straps, padding, and fit, with a focused professional expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 34. Relic Custodian Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/34-relic-custodian-portrait.png`

```text
Create a high-resolution transparent-background portrait of the Relic Custodian of Lumen Village in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, restrained and careful, not photorealistic, not 3D, not painterly concept art. Show a quiet support figure who protects sealed relics and fragments with ritual-aware caution. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 35. Palace Page Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/35-palace-page-portrait.png`

```text
Create a high-resolution transparent-background portrait of the Palace Page of Lumen Palace in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, respectful and quick-footed, not photorealistic, not 3D, not painterly concept art. Show a younger court messenger with tidy palace uniform details and a dutiful expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```

### 36. Royal Cook Portrait

- target_file:
  - `assets/source/world/npc-portraits-v2/36-royal-cook-portrait.png`

```text
Create a high-resolution transparent-background portrait of the Royal Cook of Lumen Palace in Hero Sword. Use classic Farland Tactics 1 and 2 inspired 2D anime fantasy portrait art, grounded and service-proud, not photorealistic, not 3D, not painterly concept art. Show a palace kitchen leader whose presence makes the palace feel inhabited and functional, with practical cooking attire and a capable expression. One character only. 2048 x 2560 transparent PNG. Large safe margin. No background, no text, no UI frame.
```
