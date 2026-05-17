# DIALOGUE_WORLD_MAP_ASSET_TARGETS.md

## Purpose

This file tracks the missing image assets for:

- bottom dialogue portraits
- world map presentation
- world-region landmark cards
- town landmark polish tied to the map flow
- image-based English UI buttons

Current runtime still falls back to:

- runtime character strips
- runtime NPC strips
- stage background thumbnails
- drawn or temporary town landmarks
- atlas-based generic buttons

## Dialogue Face Portrait Targets

### Portrait rules

All dialogue portraits should follow these rules:

- face-first or chest-up composition only
- transparent background
- no full-body poster framing
- readable inside a left portrait box of a bottom dialogue window
- same costume / color identity as the runtime sprite version
- expression-ready for dialogue scenes
- target output size baseline: `256x256` or larger square source

### Playable Character Portraits

- target folder: `assets/source/dialogue/characters/`
- target files:
  - `chr_kain_dialog_v001.png`
  - `chr_bram_dialog_v001.png`
  - `chr_sera_dialog_v001.png`
  - `chr_luna_dialog_v001.png`
  - `chr_ria_dialog_v001.png`
  - `chr_theo_dialog_v001.png`
  - `chr_dorgan_dialog_v001.png`
  - `chr_kiera_dialog_v001.png`
  - `chr_helma_dialog_v001.png`
  - `chr_marin_dialog_v001.png`
  - `chr_serena_dialog_v001.png`
  - `chr_fin_dialog_v001.png`
  - `chr_iris_dialog_v001.png`
  - `chr_wolf_dialog_v001.png`
  - `chr_erin_dialog_v001.png`
  - `chr_nazir_dialog_v001.png`
  - `chr_laila_dialog_v001.png`
  - `chr_hakan_dialog_v001.png`
  - `chr_seraphin_dialog_v001.png`
  - `chr_micaela_dialog_v001.png`
  - `chr_lucian_dialog_v001.png`

### Town NPC Portraits

- target folder: `assets/source/dialogue/npcs/`
- target files:
  - `npc_orin_dialog_v001.png`
  - `npc_marta_dialog_v001.png`
  - `npc_neri_dialog_v001.png`
  - `npc_torren_dialog_v001.png`
  - `npc_seline_dialog_v001.png`
  - `npc_east_gate_guard_dialog_v001.png`
  - `npc_plaza_villager_dialog_v001.png`
  - `npc_courier_dialog_v001.png`
  - `npc_young_resident_dialog_v001.png`
  - `npc_weapon_merchant_dialog_v001.png`
  - `npc_armor_merchant_dialog_v001.png`
  - `npc_item_merchant_dialog_v001.png`
  - `npc_relic_merchant_dialog_v001.png`
  - `npc_blacksmith_dialog_v001.png`

### Antagonist / Boss Portraits

Use these when stage-clear story scenes or boss confrontation scenes need a portrait.

- target folder: `assets/source/dialogue/enemies/`
- target files:
  - `enm_greenhaven_fragment_lord_dialog_v001.png`
  - `enm_ironreach_rebel_captain_dialog_v001.png`
  - `enm_blueharbor_tide_cult_guardian_dialog_v001.png`
  - `enm_frost_grave_commander_dialog_v001.png`
  - `enm_solkazar_relic_tyrant_dialog_v001.png`
  - `enm_black_moon_inquisitor_dialog_v001.png`
  - `enm_black_gate_warlord_dialog_v001.png`

## World Map Image Targets

### Main World Background

- target folder: `assets/source/world-map/`
- target files:
  - `world_overview_background_v001.png`

Background brief:

- portrait mobile composition
- premium fantasy travel-map mood
- no UI text baked in
- darker edge treatment so nodes and buttons stay readable
- enough open center space for region links and node overlays

### Clickable Region Plates

- target folder: `assets/source/world-map/`
- target files:
  - `continent_01_plate_v002.png`
  - `continent_02_plate_v002.png`
  - `continent_03_plate_v002.png`
  - `continent_04_plate_v002.png`
  - `continent_05_plate_v002.png`
  - `continent_06_plate_v002.png`
  - `final_route_plate_v002.png`

Region plate brief:

- one region per image
- clickable card use, not poster use
- no baked text
- must read clearly as a world-region destination on mobile
- use a distinct major landmark silhouette
- leave empty safe area for runtime labels

### Region Landmark Images

These are the extra region images requested for dungeon / tower / gate style map presentation.

- target folder: `assets/source/world-map/landmarks/`
- target files:
  - `continent_01_bramble_watch_v001.png`
  - `continent_02_granforge_tower_v001.png`
  - `continent_03_blueharbor_shrine_v001.png`
  - `continent_04_winterguard_fort_v001.png`
  - `continent_05_solkazar_relic_tower_v001.png`
  - `continent_06_lumina_citadel_v001.png`
  - `final_black_gate_v001.png`

Landmark brief:

- single landmark focus
- transparent background preferred
- usable as node art, card art, or overlay art
- tower / dungeon / fortress / gate readability first

### World Map UI Support

- target folder: `assets/source/world-map/ui/`
- target files:
  - `world_node_open_v001.png`
  - `world_node_locked_v001.png`
  - `world_node_selected_v001.png`
  - `world_route_glow_v001.png`
  - `world_final_gate_v001.png`

## Town Map Polish Targets

These are still needed because current runtime uses temporary or weak fallbacks.

- target folder: `assets/source/world/town-polish/`
- target files:
  - `lumen_outer_wall_runtime_v001.png`
  - `lumen_stage_gate_runtime_v001.png`
  - `lumen_fountain_base_runtime_v001.png`
  - `lumen_fountain_water_runtime_v001.png`
  - `lumen_safe_warp_marker_runtime_v001.png`

Use case notes:

- `lumen_outer_wall_runtime_v001.png`
  - proper castle-wall edge instead of stitched placeholder geometry
- `lumen_stage_gate_runtime_v001.png`
  - cleaner world-exit gate image
- `lumen_fountain_base_runtime_v001.png`
  - dedicated fountain base so center landmark is not hand-drawn fallback
- `lumen_fountain_water_runtime_v001.png`
  - cleaner water loop with no broken alpha
- `lumen_safe_warp_marker_runtime_v001.png`
  - subtle doorway / warp effect replacing broken portal strips

## English Button Image Targets

All button images should use consistent English labels and the same main text-button size.

- target folder: `assets/source/ui/buttons/`
- target files:
  - `ui_button_primary_sheet_v001.png`
  - `ui_button_utility_sheet_v001.png`
  - `ui_button_menu_sheet_v001.png`
  - `ui_button_world_sheet_v001.png`

Button rules:

- use English labels only
- same text-button size baseline for all labeled buttons: `160x48`
- include normal / hover / pressed / disabled states on the sheet
- clean transparent background around each button plate
- readable on portrait mobile
- no bevel-heavy MMO look
- avoid baked controller hints or Korean text

Button label coverage:

- menu and lobby:
  - `MENU`
  - `PARTY`
  - `GEAR`
  - `GACHA`
  - `HOME`
  - `OPTIONS`
  - `SHOP`
  - `EXIT`
  - `AD`
- world and stage flow:
  - `VILLAGE`
  - `WORLD`
  - `STAGES`
  - `ENTER`
  - `START`
  - `DIFFICULTY`
  - `OPEN`
  - `RETRY`
- collection and shop:
  - `BUY`
  - `RESTORE`
  - `EQUIP`
  - `CLEAR`
  - `SINGLE`
  - `TEN`
  - `PREV`
  - `NEXT`
- battle and modal:
  - `AUTO`
  - `SKILL`
  - `RETREAT`
  - `CONFIRM`
  - `CANCEL`
  - `CLOSE`
  - `BACK`

## Current Runtime Fallbacks

- dialogue portraits currently use:
  - runtime character strips
  - runtime NPC strips
  - town NPC images
  - runtime enemy strips when available
- world map currently uses:
  - stage background thumbnails as region previews
- village landmark presentation currently uses:
  - mixed runtime images + temporary drawn fallback
- main UI buttons currently use:
  - atlas-based generic button widgets

## Runtime Integration Paths

- Dialogue UI: [dialogueOverlay.ts](/D:/dev/game307/src/game/ui/dialogueOverlay.ts)
- Stage recruit event story: [stageRecruitEvents.ts](/D:/dev/game307/src/game/data/stageRecruitEvents.ts)
- World scene: [WorldMapScene.ts](/D:/dev/game307/src/game/scenes/WorldMapScene.ts)
- Village scene: [VillageLobbyScene.ts](/D:/dev/game307/src/game/scenes/VillageLobbyScene.ts)
- Town art registry: [townRuntimeArt.ts](/D:/dev/game307/src/game/data/townRuntimeArt.ts)
