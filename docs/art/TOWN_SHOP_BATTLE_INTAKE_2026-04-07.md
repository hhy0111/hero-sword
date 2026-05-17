# TOWN_SHOP_BATTLE_INTAKE_2026-04-07.md

## summary

- Intake target: the `TOWN_SHOP_BATTLE_READY_TO_COPY_PROMPTS` image batch.
- Decision date: `2026-04-07`
- Current user direction overrides the earlier blanket rejection of battle backgrounds.

## classification

| Group | Count | Verdict | Reason | Destination |
| --- | --- | --- | --- | --- |
| Town overviews | 7 | REFERENCE_ONLY | Painted exploration boards, not pixel-runtime town tiles | `assets/source/world/reference-concepts/town-overviews` |
| Shop facades | 7 | REFERENCE_ONLY | Good silhouette reference, not direct pixel-runtime buildings | `assets/source/world/reference-concepts/shop-facades` |
| Shop interiors | 6 | REFERENCE_ONLY | Good room-layout reference, not direct pixel-runtime interiors | `assets/source/world/reference-concepts/shop-interiors` |
| Shop NPC illustrations | 6 | REFERENCE_ONLY | Good costume/personality reference, not runtime sprite sheets | `assets/source/world/reference-concepts/shop-npcs` |
| Shop UI illustration sheets | 8 | REFERENCE_ONLY | Good style reference, but not pixel-runtime UI assets | `assets/source/world/reference-concepts/shop-ui` |
| Battle backgrounds | 60 | APPROVED_AS_STAGE_SOURCE | User approved them as acceptable provisional battle backplates by stage | `assets/source/world/battle-backgrounds/approved` |

## moved assets

- `35~94` battle backgrounds were renamed to:
  - `stage_01_01.png` through `stage_06_10.png`
- `01~34` stayed with original file names under `reference-concepts/*`

## blocked for runtime

- Town overviews, shop facades, shop interiors, shop NPCs, and shop UI sheets still need pixel-art regeneration for actual in-game runtime use.
- The issue is not that the images are low quality.
- The issue is that the earlier prompt direction explicitly asked for non-pixel, painterly output.

## next use

- Use `battle-backgrounds/approved` as the source pool for stage-specific battle backplates.
- Use `reference-concepts/*` only to guide new pixel town, interior, NPC, and shop UI generation.
- Use `TOWN_REWORK_PIXEL_RUNTIME_READY_TO_COPY_PROMPTS.md` for the next image generation wave.
