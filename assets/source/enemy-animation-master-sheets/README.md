# ENEMY ANIMATION MASTER SHEETS

Purpose:
- Store approved enemy animation-frame master sheets before they are split into runtime clip strips.
- Keep the original generated sheets separate from the extracted runtime assets under `public/assets/runtime/enemies`.

Folder rules:
- `approved/`: source master sheets already accepted for runtime slicing
- `legacy-replaced/`: previous approved exports kept for comparison after source-sheet replacement

Current status:
- `approved/`: 30 files
- `legacy-replaced/`: includes the `2026-04-07-source-refresh` backup batch

Notes:
- The full 30-subject enemy frame-sheet set is now present in `approved/`.
- These sheets are processed by `python scripts/generate-runtime-extended-clips.py`.
- Runtime enemy strips were regenerated after the 2026-04-07 intake refresh, but live enemy runtime loading is still gated by QA in `runtimeAnimationAssets.ts`.
