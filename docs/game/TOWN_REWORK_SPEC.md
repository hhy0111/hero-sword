# TOWN_REWORK_SPEC.md

## summary

- Objective: replace the current single-screen village lobby with a tile-based exploration town.
- First target town: `Lumen Village`
- Delivery order:
  1. prompt + asset spec
  2. source asset generation
  3. town map runtime implementation
  4. shop interior flow
  5. ambient NPC interaction

## target experience

- The player walks through a wider town instead of seeing all facilities on one screen.
- The camera follows the player and keeps the hero near the center.
- Shop buildings are entered by walking into visible doors.
- The world-map or stage route is entered through a large outer gate.
- Enterable spots show a subtle looped entrance marker effect.
- Nearby NPCs show a talk marker, and `Space` triggers interaction.

## town map structure

### Lumen Village layout

- Central plaza with fountain as the visual anchor.
- Weapon shop, armor shop, item shop, forge, and relic or rune shop around the main routes.
- Guild board and utility props near the plaza.
- Outer wall around the town edge.
- Large main gate that leads to the world-map or stage selection flow.

### map size target

- No more full-town one-screen presentation.
- Build the town wide enough for horizontal and light vertical exploration.
- Initial target: roughly `3 to 4 mobile screens` worth of walkable area.

## tile and collision rules

### passable

- grass
- road
- plaza brick
- shop entry threshold
- indoor floor
- gate threshold

### blocked

- outer wall
- building footprint body
- fountain rim and fountain center
- fences
- heavy props like crates stacked as barriers
- counter back side
- closed gate states

### mixed or event-driven

- shop doorway
- world gate doorway
- indoor exit doorway
- special interaction tiles

These tiles should be implemented as passable only when the relevant transition trigger is active.

## fountain rules

- The first town has a central fountain.
- The fountain uses a static base plus layered looping water animation.
- The fountain area is blocked for player movement.
- The surrounding plaza remains walkable.

## camera rules

- Use follow-camera behavior instead of a fixed full-town camera.
- Keep the hero near screen center during movement.
- Clamp camera bounds to the town map extents.
- Do not allow the camera to scroll beyond map edges.

## transition markers

- Shop entrances show a subtle loop marker on the ground or doorway.
- The world gate shows a stronger but still safe-zone marker.
- Interior exits also show a return marker.
- These effects must read as navigation helpers, not battle magic attacks.

## shop flow

1. Player approaches a shop entrance marker.
2. Crossing the doorway threshold automatically enters the building.
3. Interior scene loads with a shop NPC.
4. Near the NPC, a talk marker appears.
5. `Space` opens the shop UI.
6. Exiting the interior returns the player to the town exterior near that shop.

## ambient NPC flow

1. Ambient NPC patrols or idles in town.
2. Near the NPC, a talk marker appears.
3. `Space` opens a short greeting dialog.
4. Greeting NPCs do not open a shop UI.

## asset groups required

- Outdoor ground tiles
- Collision border tiles
- Outer wall and main gate kit
- Fountain base kit
- Fountain water animation sheet
- Shop exteriors
- Shop interior tile kits
- Shop NPC sprite sheets
- Ambient town NPC sprite sheets
- Interaction marker sheet
- Entrance transition FX sheet
- Shop item-list UI sheet

## battle background stance

- The current painted battle backgrounds are accepted as provisional stage backplates.
- They can be integrated stage-by-stage before a full pixel battle-background pass is finished.
- Town and shop runtime art still requires pixel regeneration.

## implementation order

1. Create the new pixel asset batch from `TOWN_REWORK_PIXEL_RUNTIME_READY_TO_COPY_PROMPTS.md`.
2. Implement tile map foundations and camera follow in the village scene.
3. Add collision layers and blocked zones.
4. Add fountain animation layer and entrance marker FX.
5. Add shop interior scenes and NPC interaction flow.
6. Add ambient NPC greetings and patrol behavior.

## risks

- Mixing painted town art with pixel runtime assets will look inconsistent.
- Town interaction density can become noisy if entrance markers and NPC markers are both over-bright.
- Collision readability will fail if blocked-edge tiles are not modular.
