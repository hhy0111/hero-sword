# Town Rebuild Asset Audit - 2026-05-04

## summary

- Lumen Village exterior is now treated as a runtime-art-only scene.
- Approved town tiles and extracted runtime images are the only visual inputs for ground, roads, plaza, fountain, shops, props, gates, and town NPCs.
- If an image key is missing at runtime, the scene skips that visual and any dependent entrance interaction instead of drawing an atlas/procedural substitute.

## applied runtime images

- Outdoor tiles: `grass_plain`, `grass_wild`, `grass_white_flowers`, `grass_yellow_flowers`, `road_stone`, `road_stone_alt`, `plaza_stone`, `dirt_plain`, `dirt_pebbles`, `dirt_edge`.
- Landmarks: `gate_arch`, `fountain_base`, `fountain_water`.
- Entrance and gate effects: `important_doorway`, `world_gate`, `warp_marker`.
- Shop exteriors: `weapon_shop`, `armor_shop`, `item_shop`, `forge_shop`, `relic_shop`.
- Props: `notice_board`, `bench`, `planter`, `crate_stack`, `lamp_post`.
- Town NPC clips: `guard_east`, `villager_plaza`, `runner_lane`, `child_south`, `market_courier`, `garden_guard`, `plaza_bard`, `dock_loader`, `rookie_sentry`, `elder_haru`, `bram_recruit`, `scribe_len`, `captain_ysold`, `quartermaster_dina`.

## missing or not applied

- `public/assets/world/town/npcs/armor_merchant.png`: not present as a static town NPC image. It is not applied in the village exterior. Armor merchant runtime animation clips exist and are used by interior/dialogue flows where available.
- `02-lumen-collision-border-tiles.png`: approved source exists, but no visible town-border runtime extraction is applied yet. Current collision remains data-driven and invisible.
- `11-weapon-armor-interior-kit.png` and `12-item-relic-interior-kit.png`: approved source exists, but this pass did not redesign shop interiors.
- Runtime wall kit and shop entrance marker are intentionally not applied after the 2026-05-04 review. Replacement prompts are tracked in `docs/art/TOWN_SHOP_MISSING_ART_READY_TO_COPY_PROMPTS_2026-05-04.md`.

## blocked from use

- `assets/source/world/pixel-town-rework/review-needed/*` remains excluded.
- No blurred, wrong-subject, duplicate, or unrelated VFX intake image is used as a substitute.
- No old atlas grass/stone/hero image is used to replace a missing town exterior asset.

## decisions

- Missing shop exterior image: do not draw the shop and do not enable its entrance.
- Missing world gate or palace entrance art: do not expose the matching entrance interaction.
- Missing NPC runtime/static image: do not spawn that NPC in the exterior scene.
- Missing optional visual effect: skip only that effect layer.
