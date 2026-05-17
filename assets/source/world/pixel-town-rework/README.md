# Pixel Town Rework Intake

## summary

- This folder stores the pixel-runtime town batch for `Lumen Village`.
- Intake on `2026-04-07` split the batch into `approved` and `review-needed`.
- Runtime extraction currently targets outdoor tiles, buildings, landmarks, merchants, ambient NPCs, town props, entrance FX, fountain FX, indoor floor materials, and shop UI decoration.

## approved

- Directly used in runtime or runtime extraction:
  - `01-lumen-outdoor-ground-tiles.png`
  - `03-lumen-outer-wall-gate-kit.png`
  - `04-lumen-fountain-base-kit.png`
  - `05-lumen-fountain-water-animation.png`
  - `06-weapon-shop-exterior.png`
  - `07-armor-shop-exterior.png`
  - `09-forge-shop-exterior.png`
  - `10-relic-rune-shop-exterior.png`
  - `14-weapon-merchant-sprite-sheet.png`
  - `16-item-merchant-sprite-sheet.png`
  - `17-master-blacksmith-sprite-sheet.png`
  - `18-relic-rune-merchant-sprite-sheet.png`
  - `19-ambient-villager-sprite-set.png`
  - `20-ambient-guard-sprite-set.png`
  - `22-entrance-transition-fx-sheet.png`
  - `23-town-sign-utility-prop-sheet.png`
  - `24-shop-item-list-card-ui-sheet.png`
  - `25-indoor-floor-material-tiles.png`
- Approved but not yet runtime-extracted:
  - `02-lumen-collision-border-tiles.png`
  - `11-weapon-armor-interior-kit.png`
  - `12-item-relic-interior-kit.png`

## review-needed

- Not safe for runtime use:
  - wrong subject: `01-outdoor-ground-tiles-wrong-seraphine-sheet.png`
  - duplicate / wrong content: `04-central-square-wrong-duplicate-gate-kit.png`
  - blurred / low-confidence: `17-master-blacksmith-blurred.png`, `23-utility-prop-sheet-blurred.png`
  - mixed or unrelated VFX intake: `01-vfx-extra-blurred-utility-prop.png`, `03-vfx-intake.png`, `04-vfx-intake-mixed-impact.png`, `05-vfx-intake-fire-spell.png`, `06-vfx-intake-holy-heal.png`, `07-vfx-intake-water-support.png`, `08-vfx-intake-arrow-projectiles.png`, `09-vfx-intake-gunner-shots.png`, `10-vfx-intake-dark-dash.png`, `11-vfx-intake-desert-slash.png`, `12-vfx-intake-support-spell.png`

## runtime gaps

- Still missing, not applied, or outside the current exterior rebuild:
  - static exterior `armor_merchant.png` under `public/assets/world/town/npcs/` is not present; runtime animation clips exist for interior/dialogue use.
  - visible collision-border tile extraction from `02-lumen-collision-border-tiles.png` is not applied yet.
  - shop interior redesign from `11-weapon-armor-interior-kit.png` and `12-item-relic-interior-kit.png` is not part of the village exterior rebuild.
  - no atlas/procedural replacement should be used for a missing town exterior asset.

## notes

- The `image` staging folder was cleared and removed after intake.
- Runtime outputs land under `public/assets/world/town/*`.
