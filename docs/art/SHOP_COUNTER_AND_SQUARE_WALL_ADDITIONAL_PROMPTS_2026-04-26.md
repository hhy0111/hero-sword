# SHOP_COUNTER_AND_SQUARE_WALL_ADDITIONAL_PROMPTS_2026-04-26

이번 보강에서 실제로 추가 요청이 필요한 아트만 따로 모았습니다.

- 목적:
  - 상점 실내에서 `NPC와 플레이어 사이의 카운터 / 테이블`이 확실히 보이게 만들기
  - 마을 외곽 성벽을 `동/서/남/북` 어디에나 반복 적용 가능한 `정사각형 타일형` 구조로 교체하기

---

## 01. Shop Counter Front Kit

- target_file:
  - `assets/source/world/shop-refresh/shop_counter_front_kit_v001.png`

```text
Create a commercial-quality transparent-background pixel-art shop counter front kit for Hero Sword, a Korean mobile fantasy ARPG for Android.

This asset is used inside portrait mobile shop interiors to create a clear visual divider between the merchant NPC and the player character. The result must feel like a functional counter or service desk, not a random table dropped into the room.

Required parts in one consistent art family:
- one neutral wooden counter front
- one weapon-shop counter variation
- one item-shop counter variation
- one relic-shop counter variation
- one narrow top plank / countertop strip that can be stretched slightly in runtime
- one subtle shadow-only strip for the floor contact

Visual direction:
- refined fantasy pixel art
- readable on a phone screen
- grounded craftsmanship, not ornate palace furniture
- clear front-facing silhouette
- enough empty middle area so merchant hands or chest can overlap naturally

Important constraints:
- transparent background PNG only
- no checkerboard
- no wall, floor, carpet, or room background baked in
- no full merchant character included
- no floating props outside the counter silhouette
- no text, logo, watermark, or UI frame

The counter should look appropriate for a practical mobile RPG shop interior and must harmonize with the current merchant and protagonist dot characters.
```

---

## 02. Lumen Village Four-Side Square Wall Tile Kit

- target_file:
  - `assets/source/world/town-polish/lumen_village_four_side_square_wall_tile_kit_v001.png`

```text
Create a commercial-quality transparent-background square wall tile kit for Hero Sword, a Korean mobile fantasy ARPG for Android.

This is the final village perimeter wall kit for Lumen Village. It must support runtime placement on all four directions of a portrait mobile town map: north wall, south wall, east wall, and west wall.

Build a clean square-tile modular system based on rectangular pale-stone masonry. Do NOT create a curved panorama wall. Do NOT paint a full background scene. This must behave like reusable runtime pieces.

Required pieces:
- square wall fill tile
- north-facing wall top tile
- south-facing wall bottom tile
- east-facing wall side tile
- west-facing wall side tile
- inner corner tile
- outer corner tile
- one corner tower variation
- one short gate-join tile for left side of a gate
- one short gate-join tile for right side of a gate
- one clean south-facing main village gate module

Visual direction:
- safe bright first-town perimeter
- practical fantasy construction
- readable rectangular stone blocks
- polished but not luxurious like a palace
- clear depth and silhouette on a vertical phone screen

Important constraints:
- every piece on true transparency
- no grass slab
- no road tile baked in
- no sky panel
- no characters
- no portal glow baked in
- no text, logo, or watermark
- no broken alpha or white matte

The pieces must tile together cleanly and allow the game to build east, west, north, and south wall runs without relying on stretched illustration panels.
```
