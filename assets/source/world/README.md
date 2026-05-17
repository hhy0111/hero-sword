# World Source Assets

## summary

- This folder stores world-environment source assets for town, shop, and battle-background work.
- Intake on `2026-04-07` split the latest batch into `stage-usable battle backgrounds` and `reference-only concept boards`.

## folders

- `pixel-town-rework/approved`
  - Pixel-runtime town assets approved for direct extraction or direct runtime use.
  - Includes building exteriors, merchants, guards, ambient NPC sheets, entrance FX, props, and shop UI boards.
- `pixel-town-rework/review-needed`
  - Incoming pixel-town files that are wrong-subject, blurred, duplicate, or otherwise not safe for runtime use.
- `battle-backgrounds/approved`
  - Stage-specific portrait battle plates approved as source candidates for runtime integration.
  - Files are normalized to `stage_XX_YY.png`.
- `reference-concepts/town-overviews`
  - Large painted town overview boards.
  - Useful for layout, mood, and district planning only.
- `reference-concepts/shop-facades`
  - Painted facade concept boards for shop silhouette reference.
- `reference-concepts/shop-interiors`
  - Painted interior concept boards for camera and room-layout reference.
- `reference-concepts/shop-npcs`
  - Painted merchant character illustrations for costume and personality reference.
- `reference-concepts/shop-ui`
  - Painted shop icon/UI boards kept only as visual direction reference.

## runtime suitability

- `pixel-town-rework/approved`: `RUNTIME_SOURCE`
- `pixel-town-rework/review-needed`: `DO_NOT_USE`
- `battle-backgrounds/approved`: `USE_CANDIDATE`
- `reference-concepts/*`: `REFERENCE_ONLY`

## notes

- The current game is pixel-art runtime oriented, so painted town/shop assets are not treated as direct runtime art.
- Battle backgrounds were kept because the current user direction allows them as provisional stage backplates.
- Pixel-town runtime intake is tracked in `pixel-town-rework/README.md`.
