# CHARACTER ANIMATION MASTER SHEETS

Purpose:
- Store approved character animation-frame master sheets before they are split into runtime clip strips.
- Keep the original generated sheets separate from the extracted runtime assets under `public/assets/runtime/characters`.

Folder rules:
- `approved/`: source master sheets already accepted for runtime slicing
- `legacy-replaced/`: previous approved exports kept for comparison after source-sheet replacement
- `review-extra/`: duplicate or extra intake files that were not selected as the active approved source

Current status:
- `approved/`: 21 files
- `legacy-replaced/`: includes the earlier 6-file repair set plus the full `2026-04-07-source-refresh` backup batch
- `review-extra/`: `20-micaela-extra-intake.png`

Notes:
- All 21 playable character source sheets are present and were refreshed again from the 2026-04-07 intake batch.
- Runtime character strips are now enabled at load time so Animation Viewer, village, and battle can review the final runtime path directly.
- Some strips still need per-character visual QA polish for slicing quality, but the runtime hookup itself is live again.
- `20-michaela.png` is the active approved sheet because the runtime generator expects that filename; the extra `20-micaela` intake was moved aside instead of applied.
- The first enemy frame-sheet batch is handled separately under `assets/source/enemy-animation-master-sheets/approved`.
