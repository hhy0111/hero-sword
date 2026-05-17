# Implementation Follow-up Image Prompts - 2026-05-11

- summary:
  - 이번 구현 패스에서 코드로 우선 반영했지만, 최종 품질을 위해 새로 제작해야 하거나 교체 후보로 남은 이미지를 한 파일에 정리한다.
  - 성안/마을 성벽은 긴 이미지가 아니라 정사각형 타일 반복 구조를 기준으로 제작한다.
- inputs:
  - 사용자 추가 지시: 성벽을 체계적인 정사각형 타일 구조로 교체, 누락 이미지 프롬프트 신규 정리.
  - 적용 이미지 폴더: `image/IMAGE_PROMPTS_ADDED_PALACE_GACHA_BATTLE_FIXES_2026-05-11`.
- decisions:
  - 성벽은 우선 `가로 정사각형 1개`, `세로 정사각형 1개`를 필수 제작 단위로 둔다.
  - 창고/스테이지/전투 UI 이미지는 현재 코드형 프레임으로 동작하게 두고, 최종 아트 교체용 프롬프트만 추적한다.
- todo:
  - 아래 프롬프트로 신규 이미지를 생성한 뒤 `public/assets/...` 경로에 승인본을 덮어쓴다.
  - 승인본 적용 후 모바일 화면에서 잘림, 반복 티, 텍스트 침범을 확인한다.
- risks:
  - 성벽 타일이 정사각형 기준을 지키지 않으면 구석 맞춤 문제가 재발한다.
  - 소모품 아이콘이 UI처럼 보이면 창고에서 게임 아이템 감각이 약해진다.
- artifacts_changed:
  - `docs/art/IMAGE_PROMPTS_ADDED_IMPLEMENTATION_FOLLOWUP_2026-05-11.md`
- handoff_to:
  - `asset_agent`, `ui_agent`, `qa_agent`
- handoff_notes:
  - 아래 파일명은 최종 타겟 파일명 기준이다. 생성 원본은 `image/...` 아래 별도 폴더에 보관 후 승인본만 `public/assets`에 복사한다.
- done_check:
  - false

## 1. Castle Wall Square Tiles

### town_outer_wall_horizontal_tile.png

Target path:

`public/assets/world/town/tiles/town_outer_wall_horizontal_tile.png`

Prompt:

```text
Create a transparent-background square 1024x1024 PNG top-down pixel-art castle wall tile for a mobile RPG town map. The full canvas must be exactly square, and the wall artwork must be designed as one square tile, not as a long rectangular strip. The tile is a horizontal outer wall segment viewed from above, designed to repeat seamlessly left and right on a 64px game grid after downscaling. Use worn beige-gray stone blocks, subtle moss, clean square masonry edges, small ambient shadows only on the wall itself, and a readable fortress-border silhouette. Everything outside the wall silhouette must be fully transparent alpha: no grass slab, no floor tile, no sky, no painted background, no checkerboard, no opaque border. It must not be a long wall strip and must not use tall side-view perspective. No characters, no text, no UI, no towers, no gate. The tile must connect cleanly with identical copies and with a vertical wall tile at corners through overlap.
```

### town_outer_wall_vertical_tile.png

Target path:

`public/assets/world/town/tiles/town_outer_wall_vertical_tile.png`

Prompt:

```text
Create a transparent-background square 1024x1024 PNG top-down pixel-art castle wall tile for a mobile RPG town map. The full canvas must be exactly square, and the wall artwork must be designed as one square tile, not as a long rectangular strip. The tile is a vertical outer wall segment viewed from above, designed to repeat seamlessly up and down on a 64px game grid after downscaling. Match the horizontal tile style: worn beige-gray stone blocks, subtle moss, clean square masonry edges, small ambient shadows only on the wall itself, and a readable fortress-border silhouette. Everything outside the wall silhouette must be fully transparent alpha: no grass slab, no floor tile, no sky, no painted background, no checkerboard, no opaque border. It must not be a long wall strip and must not use tall side-view perspective. No characters, no text, no UI, no towers, no gate. The tile must connect cleanly with horizontal wall tiles at corners through overlap.
```

## 2. Palace Carpet Replacement

### palace_center_carpet_segment_v2.png

Target path:

`public/assets/world/palace/tiles/palace_center_carpet_segment.png`

Prompt:

```text
Create a repeatable 1024x1536 top-down pixel-art royal palace carpet segment for a vertical mobile RPG map. The carpet should be blue fabric with gold trim, ornamental corner motifs, and clean tileable top and bottom edges so multiple segments can be stacked vertically. Keep the camera top-down and grid-friendly. Do not include characters, furniture, UI, text, perspective walls, or floor outside the carpet except a transparent or tightly cropped edge. The pattern should be elegant but not busy, readable at small mobile size, and align cleanly when repeated.
```

## 3. Stage Route Markers

### stage_route_marker_available.png

Target path:

`public/assets/ui/stage-select/stage_route_marker_available.png`

Prompt:

```text
Create a 512x512 transparent-background pixel-art route marker icon for a mobile RPG stage list. It should look like an available route node: small glowing green-gold travel seal, subtle stone base, fantasy map styling, readable at 24px. No text, no numbers, no UI frame, no characters.
```

### stage_route_marker_cleared.png

Target path:

`public/assets/ui/stage-select/stage_route_marker_cleared.png`

Prompt:

```text
Create a 512x512 transparent-background pixel-art cleared route marker icon for a mobile RPG stage list. It should look like a completed route seal with a small golden star set into a green-gold emblem, readable at 24px. No text, no numbers, no UI frame, no characters.
```

### stage_route_marker_locked.png

Target path:

`public/assets/ui/stage-select/stage_route_marker_locked.png`

Prompt:

```text
Create a 512x512 transparent-background pixel-art locked route marker icon for a mobile RPG stage list. It should look like a dim sealed route stone with a small lock shape and muted gray-blue metal, readable at 24px. No text, no numbers, no UI frame, no characters.
```

## 4. Consumable Storage Icons

### fatigue_tonic_small.png

Target path:

`public/assets/ui/storage/items/fatigue_tonic_small.png`

Prompt:

```text
Create a square 1024x1024 fantasy RPG consumable item icon: a small blue fatigue recovery tonic bottle with cork, subtle glow, and compact leather tag. Centered item on transparent background, readable at 32px, no text, no UI frame, no character.
```

### fatigue_tonic_large.png

Target path:

`public/assets/ui/storage/items/fatigue_tonic_large.png`

Prompt:

```text
Create a square 1024x1024 fantasy RPG consumable item icon: a large blue fatigue recovery tonic bottle with reinforced glass, gold cap, and stronger glow than the small tonic. Centered item on transparent background, readable at 32px, no text, no UI frame, no character.
```

### item_field_ration_bundle.png

Target path:

`public/assets/ui/storage/items/item_field_ration_bundle.png`

Prompt:

```text
Create a square 1024x1024 fantasy RPG consumable item icon: field ration bundle with wrapped bread, dried fruit, small cloth pouch, and simple healer bandage. Centered on transparent background, readable at 32px, no text, no UI frame, no character.
```

### item_route_guard_supplies.png

Target path:

`public/assets/ui/storage/items/item_route_guard_supplies.png`

Prompt:

```text
Create a square 1024x1024 fantasy RPG consumable item icon: route guard supplies pack with compact wooden crate, green cloth wrap, small road patrol badge, and emergency salve. Centered on transparent background, readable at 32px, no text, no UI frame, no character.
```

### item_frontline_recovery_case.png

Target path:

`public/assets/ui/storage/items/item_frontline_recovery_case.png`

Prompt:

```text
Create a square 1024x1024 fantasy RPG premium consumable item icon: frontline recovery case, sturdy dark medical case with blue crystal vials and gold corner protectors. Centered on transparent background, readable at 32px, no text, no UI frame, no character.
```

## 5. Battle UI Optional Replacement

### battle_top_status_panel.png

Target path:

`public/assets/ui/battle/battle_top_status_panel.png`

Prompt:

```text
Create a wide 1024x256 dark fantasy mobile RPG battle top status panel frame. It should have dark stone and muted gold trim, readable transparent center zones for Korean stage names, objective text, enemy name, and a red HP bar. Keep decoration restrained near text areas. No text, no characters, no background scenery, no icons. The panel must scale down cleanly to a 360px wide vertical phone game screen.
```
