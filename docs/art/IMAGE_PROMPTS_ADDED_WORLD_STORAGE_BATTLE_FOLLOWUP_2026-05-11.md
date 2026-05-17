# Additional Image Prompts - World/Storage/Battle Follow-up - 2026-05-11

## 1. town_outer_wall_horizontal_tile.png

Target path after approval: `public/assets/world/town/tiles/town_outer_wall_horizontal_tile.png`

Prompt:

```
Create a transparent-background square 1024x1024 PNG top-down pixel-art castle outer wall tile for a mobile RPG town map. The full canvas must be exactly square, and the wall artwork must be designed as one square tile, not as a long rectangular strip. The tile must represent a horizontal wall segment viewed from above, not a tall side-view wall. It should read as a sturdy stone border tile that can repeat seamlessly left and right on a grid. Include square stone blocks, subtle moss, worn beige-gray masonry, small shadowing only on the wall itself, and clean edge alignment. Everything outside the wall silhouette must be fully transparent alpha: no grass slab, no floor tile, no sky, no painted background, no checkerboard, no opaque border. No characters, no text, no UI, no perspective tower, no panorama, no dramatic height. The asset must work as a single square tile repeated many times to form the town's outer castle boundary.
```

## 2. town_outer_wall_vertical_tile.png

Target path after approval: `public/assets/world/town/tiles/town_outer_wall_vertical_tile.png`

Prompt:

```
Create a transparent-background square 1024x1024 PNG top-down pixel-art castle outer wall tile for a mobile RPG town map. The full canvas must be exactly square, and the wall artwork must be designed as one square tile, not as a long rectangular strip. The tile must represent a vertical wall segment viewed from above, designed to repeat seamlessly up and down on a grid. Use the same stone style as the horizontal tile: worn beige-gray castle masonry, subtle moss, clean square-grid alignment, readable top-down shape, and small ambient shadows only on the wall itself. Everything outside the wall silhouette must be fully transparent alpha: no grass slab, no floor tile, no sky, no painted background, no checkerboard, no opaque border. No characters, no text, no UI, no tall side-view wall, no panorama, no long stretched strip. The tile must connect cleanly with horizontal wall tiles at town boundary corners through overlap or rotation.
```

## 3. battle_top_status_panel.png

Target path after approval: `public/assets/ui/battle/battle_top_status_panel.png`

Prompt:

```
Create a wide mobile RPG battle top status panel frame, dark fantasy stone-and-gold UI, transparent center areas for text and HP bars, 1024x256. The panel must fit a vertical phone game battle screen and leave safe padding for long Korean stage names, objective text, enemy name, and a red HP bar. Include subtle gold corner ornaments and dark slate backing, but keep the center readable and not busy. No text, no icons, no characters, no background scenery. The frame should support compact UI labels and avoid heavy decoration near the text area.
```

## Notes

- The current requested wall scope only requires one horizontal and one vertical square tile.
- Wall outputs must be true transparent PNG files, and each wall asset must remain a square tile. Reject any generated wall image that comes back as a long strip, panorama, non-square crop, or wall pasted onto a visible background.
- If corner seams still fail after implementation, add a later prompt bundle for four dedicated corner tiles.
- The battle top panel prompt is optional and should be used only if code-based resizing cannot make the existing top panel reliable.
