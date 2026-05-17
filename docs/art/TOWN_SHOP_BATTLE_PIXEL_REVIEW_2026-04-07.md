# TOWN_SHOP_BATTLE_PIXEL_REVIEW_2026-04-07.md

## Summary

- verdict: `runtime direct use = fail`
- reason: this batch follows the current prompt file too literally, and the prompt file itself asks for `commercial-quality`, `non-pixel`, painted mobile ARPG illustration output rather than pixel-runtime assets
- project fit: `Hero Sword` is currently configured and presented as a `pixelArt` Phaser game, so the town / shop / battle environment layer should be regenerated as dot or pixel assets

## Core Decision

The problem is not mainly that the image model failed.
The main problem is that the prompt direction itself is wrong for the current game.

Examples from the current prompt file:

- [TOWN_SHOP_BATTLE_READY_TO_COPY_PROMPTS.md](D:/dev/game307/docs/art/TOWN_SHOP_BATTLE_READY_TO_COPY_PROMPTS.md#L9)
  explicitly says `This must not be a tiny one-screen pixel village`
- [TOWN_SHOP_BATTLE_READY_TO_COPY_PROMPTS.md](D:/dev/game307/docs/art/TOWN_SHOP_BATTLE_READY_TO_COPY_PROMPTS.md#L58)
  explicitly asks for `non-pixel`

That means the generated result is naturally painterly and illustration-heavy.
For the current runtime, that is a style mismatch.

## Current Runtime Fit

- Town overworld panoramas: `REJECT`
  These are painterly scene illustrations, not tile-ready pixel maps or crop-safe map chunks.
- Shop facade sets: `REJECT`
  These are concept-art facade boards, not pixel buildings or tileset pieces.
- Shop interiors: `REJECT`
  These are painted rooms, not pixel interior tilesets or gameplay-safe tile chunks.
- Battle backgrounds: `REJECT`
  These are high-detail painted battle plates and will clash with current pixel characters and pixel UI language.
- Shop NPC full-body + portrait images: `REFERENCE ONLY`
  They can work as concept reference or optional portrait reference, but not as runtime in-world NPC sprites.
- Shop UI icon / frame sheets: `REGEN RECOMMENDED`
  They are cleaner than the environment assets, but still illustration-style rather than pixel-style. For a consistent pixel game, they should be regenerated too.

## Category Verdict

| Category | Current output verdict | Why |
| --- | --- | --- |
| Town overworld `01~07` | `FAIL` | Wrong style and wrong asset form. Needs pixel town kit or tile-based map resources. |
| Shop facades `08~14` | `FAIL` | Good concept reference, but not runtime-ready pixel building assets. |
| Shop interiors `15~20` | `FAIL` | Painterly interiors; should be pixel tiles, counters, walls, floor, and props. |
| Shop NPC images `21~26` | `REFERENCE ONLY` | Good reference art, but not runtime NPC sprites. |
| Shop UI sheets `27~34` | `REGEN RECOMMENDED` | Usable only if UI goes non-pixel; current project direction suggests regenerating as pixel UI sheets. |
| Battle backgrounds `35~94` | `FAIL` | Painted backgrounds clash with the pixel runtime and should be remade as pixel battle plates. |

## Practical Conclusion

The current `TOWN_SHOP_BATTLE_READY_TO_COPY_PROMPTS` batch should not be moved into game-runtime usage as-is.

What should happen instead:

1. Replace the prompt strategy, not just rerun the same prompts.
2. Regenerate town assets as `pixel town kits`, not painterly wide illustrations.
3. Regenerate shop interiors as `pixel interior kits`, not fully rendered rooms.
4. Regenerate NPC runtime assets as `pixel NPC sprite sheets`.
5. Regenerate shop UI sheets as `pixel UI icon / frame sheets`.
6. Regenerate battle backgrounds as `pixel portrait battle plates`.

## Keep vs Redo

- `KEEP AS REFERENCE`
  - Town panoramas
  - Shop facade concept boards
  - Shop interiors
  - NPC portraits
  - UI icon concepts
  These can still guide palette, mood, signage, silhouette, and district identity.

- `REDO FOR RUNTIME`
  - all environment runtime assets
  - all in-world building assets
  - all in-world shop interiors
  - all runtime NPC presence assets
  - all battle backgrounds
  - all shop UI sheets if pixel-style consistency is required

## Decision

- final decision: `redo prompts required`
- next artifact: [TOWN_SHOP_BATTLE_PIXEL_REGEN_READY_TO_COPY_PROMPTS.md](D:/dev/game307/docs/art/TOWN_SHOP_BATTLE_PIXEL_REGEN_READY_TO_COPY_PROMPTS.md)
