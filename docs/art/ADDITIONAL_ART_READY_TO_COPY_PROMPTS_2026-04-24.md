# ADDITIONAL_ART_READY_TO_COPY_PROMPTS_2026-04-24

현재 기준으로 `추가 제작이 실제로 필요한 이미지`만 한 파일로 묶은 문서다.

이번 파일에 포함한 범위:

- 루멘 마을 `사각형 성벽 타일 + 남쪽 게이트`
- 궁궐 전용 `런타임 도트 NPC`
- 궁궐 전용 `대화 초상`
- 선택 추가용 `왕 전용 이벤트 초상`

이번 파일에서 제외한 것:

- 코드/레이아웃 정리만으로 해결 가능한 화면
- 이미 게임에 연결되어 있고 당장 교체 필요가 없는 이미지
- 캐릭터 원본 재재단 작업처럼 `새 이미지 생성`이 아니라 `기존 원본 재편집`으로 처리할 항목

공통 스타일 규칙:

- `히어로소드`의 주인공 `Kain` 계열과 어울리는 `세밀한 현대형 판타지 픽셀아트`
- 너무 큰 복고풍 도트 금지
- 반실사 페인터리 느낌 금지
- 체커보드가 이미지에 구워진 결과 금지
- 흰색 매트 배경 금지
- 런타임용 이미지는 반드시 `투명 배경 PNG`
- 대화 초상은 `배경이 살아 있는 정사각 초상 PNG`
- 텍스트, 로고, UI 프레임, 플레이스홀더 금지

---

## 01. Lumen Village Square South Wall + South Gate Tile Set

- target_file:
  - `assets/source/world/town-polish/lumen_village_square_wall_south_gate_tile_set_v004.png`

```text
Create a commercial-quality transparent-background square wall tile set and south-facing gate set for Hero Sword, a Korean mobile fantasy ARPG for Android.

This replaces the lower village boundary of Lumen Village. Do NOT create a curved castle wall. Do NOT create a sculpted wall panorama. Build a practical square-tile wall system based on clean rectangular stone masonry.

Required parts in one consistent art family:
- square wall fill tile
- horizontal wall top tile
- vertical wall side tile
- inner corner tile
- outer corner tile
- one corner-tower variation for map corners
- one simple south-facing main gate module
- one short left gate-join wall piece
- one short right gate-join wall piece

The wall should feel like a safe early-game town perimeter: bright pale stone, readable rectangular construction, practical fantasy design, polished but not luxurious like a royal palace. The gate should feel like a clear village exit toward battle stages on a portrait mobile screen, placed on the SOUTH / LOWER side of the town.

Every piece must be isolated on true transparency. No ground slab, no grass baked in, no plaza tile, no sky, no characters, no text, no portal effect, no checkerboard, and no broken alpha holes.

Important style rule: refined modern fantasy pixel-art environment, fine pixel density, clean runtime readability on mobile, not painterly illustration and not oversized retro pixels.
```

---

## 02. Palace Core Runtime NPC Sheet Remake

- target_file:
  - `assets/source/world/palace/lumen_palace_core_runtime_npc_sheet_v003.png`

```text
Create a commercial-quality transparent-background runtime pixel NPC sheet for Hero Sword, a Korean mobile fantasy ARPG for Android.

This sheet is for the core palace NPCs and must match the same visual family as the main protagonist Kain: modern polished fantasy pixel art, about 2 heads tall, compact chibi proportions, clean readable silhouette, slightly darker outer outline, not oversized retro pixels.

Characters required in the same sheet:
- King Aldren
- Queen Regent Celestine
- Captain Rowan
- Archivist Mirel

For every frame, the most important rule is:
- exactly one complete character only
- fully visible from head to feet
- no cropped hair, no missing boots, no cut-off cape
- no previous frame or next frame leaking in from the left or right
- no mixed silhouettes
- no ghosting
- no scenery
- no checkerboard
- transparent background PNG

At minimum, provide clearly sliceable runtime rows for:
- idle
- talk
- walk

Character identity requirements:
- King Aldren: elderly king, blue-gold royal costume, white fur collar, crown, dignified but readable small-scale silhouette
- Queen Regent Celestine: refined royal woman, blue-white-gold attire, elegant but compact readable silhouette
- Captain Rowan: elite palace guard officer, blue-silver armor, disciplined military silhouette
- Archivist Mirel: palace scholar, cream-muted-blue robes, calm and intelligent silhouette

Do not make them generic guards or villagers. They must feel like palace-exclusive characters. Do not include throne, props, books, banners, or background scene cards inside the sheet.
```

---

## 03. Palace Dialogue Portrait Set Remake

- target_file:
  - `assets/source/dialogue/palace/lumen_palace_dialogue_portraits_v003.png`

```text
Create a dialogue portrait set for Hero Sword, a Korean mobile fantasy ARPG for Android.

This set contains square dialogue portraits for:
- King Aldren
- Queen Regent Celestine
- Captain Rowan
- Archivist Mirel

These are NOT transparent runtime sprites. These are square dialogue portraits with a living painted background inside each portrait.

Global portrait rules:
- face and upper body must be large and readable
- identity must match the runtime palace NPC sprites exactly
- background should stay inside the portrait and feel like the palace environment
- no checkerboard transparency
- no UI frame
- no text
- no extra people
- no throne or background object blocking the face

Portrait identity rules:
- King Aldren: elderly royal man, blue-gold-white royal costume, crown, burdened but dignified expression, throne room or royal audience chamber background
- Queen Regent Celestine: elegant and composed royal woman, blue-white-gold palace attire, intelligent authority, refined palace interior background
- Captain Rowan: stern elite palace guard officer, blue-silver armor with officer accents, disciplined expression, palace guard hall or corridor background
- Archivist Mirel: calm palace archivist, cream-muted-blue robes, thoughtful scholarly expression, archive room or candlelit records chamber background

The portraits should harmonize with the in-game fantasy pixel world while still reading as polished dialogue artwork.
```

---

## 04. Optional King Throne Event Portrait

- target_file:
  - `assets/source/dialogue/palace/king_aldren_throne_event_portrait_v002.png`

```text
Create a square dramatic event portrait of King Aldren seated on the throne of Lumen palace for Hero Sword, a Korean mobile fantasy ARPG for Android.

This is not a runtime sprite. This is a story-event illustration used for a high-importance palace dialogue moment.

Requirements:
- square composition
- the king must remain the main subject
- enough throne context to communicate royal authority
- blue-gold-white royal palette
- burdened but powerful expression
- polished palace interior lighting
- no transparency
- no text
- no UI frame
- no extra characters

The face and upper torso must still dominate the composition so the image remains readable in a dialogue panel.
```
