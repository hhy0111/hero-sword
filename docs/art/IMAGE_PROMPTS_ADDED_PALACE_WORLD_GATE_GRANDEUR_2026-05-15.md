# IMAGE_PROMPTS_ADDED_PALACE_WORLD_GATE_GRANDEUR_2026-05-15

## Goal

- Add production-ready prompts for a dedicated palace background facade and a more impressive world-map exit gate.
- Keep every prompt self-contained so each block can be copied directly into an image generation tool.
- Generated assets should replace the current temporary runtime composition when the images are ready.

## 01-town_palace_upper_facade_pixel.png

Create a transparent PNG game asset named `town_palace_upper_facade_pixel.png`, 1024x768 canvas, crisp 2D pixel art / dot art style for a mobile fantasy RPG. The image must be a grand royal palace facade designed to sit at the upper background area of a top-down town map. Show a majestic white-stone palace with blue tiled roofs, gold trim, tall central spire, two side towers, banners, bright royal doorway, and a wide stair/terrace base. The palace should read as a huge landmark even when only the lower half is visible at the top of a phone screen. Keep the lower entrance aligned at the bottom center so it can sit behind the player path, and keep the upper roofs and towers within the image bounds without being cropped. The building should face the camera like a background facade, not a side view, not an isometric building, not a cave entrance. Use strong readable pixel clusters, clean hard edges, limited but rich fantasy RPG palette, blue and gold accents, warm stone shadows, and a scale that feels much larger than the player character. Transparent background outside the palace silhouette only, no sky, no floor, no grass, no checkerboard, no white matte, no text, no UI, no characters, no watermark.

## 02-town_world_exit_grand_gate_pixel.png

Create a transparent PNG game asset named `town_world_exit_grand_gate_pixel.png`, 1024x640 canvas, crisp 2D pixel art / dot art style for a mobile fantasy RPG. The image must be a grand town exit gate for the bottom edge of a castle town map, much more impressive than a small cave. Show a symmetrical fortified royal stone gate with two tall round towers, blue conical roofs, gold caps, blue banners, crenellated wall pieces, a wide open central arch, and a short stone threshold leading into the gate. The gate should feel like the main exit from the town to the world map, not a dungeon entrance, not a cave, not a tunnel mouth. The central arch opening must be bright enough and large enough for a glowing blue portal effect to be placed inside and remain visible. Use transparent background outside the stone gate silhouette only. No baked floor outside the gate, no sky, no grass, no checkerboard, no text, no UI, no characters, no watermark. Keep the image readable at phone-game size with chunky pixel clusters and strong silhouette.

## 03-town_world_exit_portal_effect_sheet.png

Create a transparent PNG sprite sheet named `town_world_exit_portal_effect_sheet.png`, total canvas 768x192, four frames arranged horizontally, each frame exactly 192x192. Crisp 2D pixel art / dot art style for a mobile fantasy RPG. Each frame must show the same circular/oval blue magic portal positioned on the ground inside a town exit gate, with a bright cyan center, rotating water-like swirl, blue-white particles, and a gold-blue rim glow. The animation should read as a looping portal: frame 1 calm glow, frame 2 swirl shifted clockwise, frame 3 brighter pulse, frame 4 swirl shifted again. Keep all frames perfectly centered and the same scale, with no camera movement between frames. Transparent background outside the portal glow only, no checkerboard, no floor, no wall, no text, no UI, no characters, no watermark. The portal must remain visible over stone backgrounds and under a castle gate arch.

## Application Notes

- Use `01-town_palace_upper_facade_pixel.png` as the dedicated upper-background palace facade in the village.
- Use `02-town_world_exit_grand_gate_pixel.png` to replace the current lower `gate_arch.png` composition when generated.
- Use `03-town_world_exit_portal_effect_sheet.png` as a 4-frame, 192x192-per-frame sprite sheet centered inside the lower world exit gate.
