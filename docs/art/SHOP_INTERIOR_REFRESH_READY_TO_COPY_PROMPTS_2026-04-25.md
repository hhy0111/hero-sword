# SHOP_INTERIOR_REFRESH_READY_TO_COPY_PROMPTS_2026-04-25

현재 상점 실내를 `한 번에 보강`하기 위한 추가 이미지 프롬프트 묶음이다.

이번 파일에 포함한 범위:

- 공통 실내 벽/카운터/선반/그림자 모듈
- 상점별 전용 소품 세트
- 방어구 상인 / 대장장이 전용 런타임 도트
- 상점 간판/카테고리 아이콘
- 상점 UI 헤더/배지 장식

이번 파일에서 제외한 것:

- 이미 게임에 연결된 외부 건물 리메이크
- 대화 초상 전체 재생성
- 코드나 레이아웃 정리만으로 해결 가능한 항목
- 기존 원본 재절단/재배치로 끝날 수 있는 단순 편집 작업

공통 스타일 규칙:

- `히어로소드`의 루멘 마을과 어울리는 `세밀한 현대형 판타지 픽셀아트`
- 모바일 세로 화면에서 읽히는 선명한 실루엣
- 과장된 복고풍 대형 도트 금지
- 반실사 페인터리 배경 금지
- 체커보드가 이미지에 구워진 결과 금지
- 런타임용 소품/NPC/UI 조각은 `투명 배경 PNG`
- 텍스트, 로고, 워터마크, UI 목업 전체 장면 금지
- 한 시트 안에서는 동일 광원, 동일 픽셀 밀도, 동일 세계관 톤 유지

---

## 01. Shared Shop Interior Modular Kit

- target_file:
  - `assets/source/world/shop-refresh/01-shared-shop-interior-modular-kit.png`

```text
Create a commercial-quality transparent-background modular interior art kit for Hero Sword, a Korean mobile fantasy ARPG for Android.

This kit is for Lumen Village indoor shop scenes and must support five different shop types: weapon, armor, item, forge, and relic.

Use polished modern fantasy pixel art with fine readable mobile density. The camera is a fixed indoor runtime view for a portrait mobile screen. Build reusable pieces that can be layered inside a real game scene, not one finished concept-room painting.

Required pieces in one consistent family:
- back-wall shelf modules
- vertical support beam modules
- short and long counter front modules
- counter top clutter base modules
- hanging ceiling beam or wall-top trim modules
- small wall shadow strips
- soft floor shadow strips near counters and walls
- simple shop backline divider pieces

Important rules:
- every object must be isolated on true transparency
- no full room background
- no characters
- no readable text
- no fake perspective poster composition
- no checkerboard
- no white matte edges

The goal is to stop all five interiors from feeling like the same empty room with only color swaps.
```

---

## 02. Weapon Shop Prop Set

- target_file:
  - `assets/source/world/shop-refresh/02-weapon-shop-prop-set.png`

```text
Create a commercial-quality transparent-background pixel-art prop set for the Lumen Village weapon shop in Hero Sword, a Korean mobile fantasy ARPG for Android.

Use polished modern fantasy pixel art for a fixed indoor runtime camera. These are props placed behind and around the counter to make the room instantly read as a weapon store.

Required props:
- wall-mounted sword rack
- spear or polearm stand
- weapon crate with visible handles or sheaths
- sharpening bench or grindstone station
- compact tool box for weapon maintenance
- one practical weapon-shop sign without readable text

The look should feel like a safe-town field-ready weapon vendor, practical and disciplined, not a giant royal armory and not a dark torture room.

Transparent background PNG only. No characters, no full room, no text, no watermark, no painterly rendering.
```

---

## 03. Armor Shop Prop Set

- target_file:
  - `assets/source/world/shop-refresh/03-armor-shop-prop-set.png`

```text
Create a commercial-quality transparent-background pixel-art prop set for the Lumen Village armor shop in Hero Sword, a Korean mobile fantasy ARPG for Android.

Use polished modern fantasy pixel art for a fixed indoor runtime camera. The goal is to make the room instantly read as a defensive gear and fitting shop.

Required props:
- standing armor mannequin set
- shield wall rack
- folded padding rolls and cloth bolts
- leather repair table or fitting stand
- stacked buckles, straps, or armor maintenance crate
- one practical armor-shop sign without readable text

The shop should feel grounded, sturdy, and survival-oriented. Avoid cathedral armor museum mood and avoid giant throne-room luxury.

Transparent background PNG only. No characters, no full room illustration, no text, no watermark, no blur.
```

---

## 04. Item Shop Supply Prop Set

- target_file:
  - `assets/source/world/shop-refresh/04-item-shop-supply-prop-set.png`

```text
Create a commercial-quality transparent-background pixel-art supply prop set for the Lumen Village item shop in Hero Sword, a Korean mobile fantasy ARPG for Android.

Use polished modern fantasy pixel art for a fixed indoor runtime camera. The room must read as a tidy travel-supply and consumable store.

Required props:
- potion bottle shelf
- ration sacks and small crate stack
- travel bags and rolled bedroll bundles
- counter-top consumable clutter set
- hanging small utility goods such as rope, pouch, or lantern
- one practical item-shop sign without readable text

The mood should be warm and useful, like a town resupply point before heading back out to stages. Avoid comedy potion chaos, giant alchemy lab spectacle, or over-cluttered fantasy shop parody.

Transparent background PNG only. No characters, no full room, no readable text, no watermark.
```

---

## 05. Forge Interior Prop Set

- target_file:
  - `assets/source/world/shop-refresh/05-forge-interior-prop-set.png`

```text
Create a commercial-quality transparent-background pixel-art prop set for the Lumen Village forge in Hero Sword, a Korean mobile fantasy ARPG for Android.

Use polished modern fantasy pixel art for a fixed indoor runtime camera. This room must instantly read as a real blacksmith forge, not just a brown counter room.

Required props:
- forge hearth or furnace base
- anvil station
- hammer and tongs wall rack
- soot-dark workbench
- ingot or metal scrap pile
- coal bucket or ember box
- one practical forge sign without readable text

The result should feel hot, heavy, and work-driven, but still readable on a mobile portrait screen.

Transparent background PNG only. No characters, no full room illustration, no giant cinematic fire burst, no readable text, no watermark.
```

---

## 06. Relic Shop Prop Set

- target_file:
  - `assets/source/world/shop-refresh/06-relic-shop-prop-set.png`

```text
Create a commercial-quality transparent-background pixel-art prop set for the Lumen Village relic shop in Hero Sword, a Korean mobile fantasy ARPG for Android.

Use polished modern fantasy pixel art for a fixed indoor runtime camera. The room must feel like a quiet relic archive and sealed support-item store.

Required props:
- relic display case set
- archive shelf with books and sealed objects
- rune-marked storage chest
- small controlled magical lamp or candle cluster
- floor rug or circular sigil plate for the front area
- one practical relic-shop sign without readable text

Important tone rule:
- mystical but controlled
- sacred and old, but not explosive wizard spectacle
- closer to a guarded archive than a giant boss-room altar

Transparent background PNG only. No characters, no full room, no readable text, no watermark.
```

---

## 07. Armor Merchant Runtime Dot Sprite Sheet

- target_file:
  - `assets/source/world/shop-refresh/07-armor-merchant-runtime-dot-sheet.png`

```text
Create a commercial-quality transparent-background runtime pixel NPC sheet for Hero Sword, a Korean mobile fantasy ARPG for Android.

Character: Marta, the Lumen Village armor merchant.

Use the same visual family as the existing town runtime NPCs: modern polished fantasy pixel art, small mobile-readable chibi proportion, clean outline, not oversized retro pixels.

Required runtime actions:
- idle
- talk
- greet
- counter_stand
- short turn left
- short turn right

Identity rules:
- practical defensive gear specialist
- apron or fitting-work clothing
- cloth, leather, and armor sample cues
- sturdier and more grounded than the weapon merchant
- must not read as a generic villager

No background, no text, no extra props baked into the sheet, no checkerboard.
```

---

## 08. Forge Blacksmith Runtime Dot Sprite Sheet

- target_file:
  - `assets/source/world/shop-refresh/08-forge-blacksmith-runtime-dot-sheet.png`

```text
Create a commercial-quality transparent-background runtime pixel NPC sheet for Hero Sword, a Korean mobile fantasy ARPG for Android.

Character: Torren, the Lumen Village master blacksmith.

Use polished modern fantasy pixel art consistent with the existing runtime town NPCs. This is a mobile-readable chibi blacksmith for a portrait-screen ARPG.

Required runtime actions:
- idle
- talk
- greet
- counter_stand
- hammer_pause_idle
- short turn

Identity rules:
- heavy work apron or forge clothing
- sturdy silhouette
- blacksmith gloves, hammer-side belt, or forge tool cue
- should read immediately as a forge worker, not as the generic weapon merchant

No background, no text, no giant furnace baked into the sprite sheet, no checkerboard.
```

---

## 09. Shop Sign And Category Icon Set

- target_file:
  - `assets/source/world/shop-refresh/09-shop-sign-and-category-icon-set.png`

```text
Create a commercial-quality transparent-background pixel-art sign and icon set for Hero Sword, a Korean mobile fantasy ARPG for Android.

This set is for the five Lumen Village shops:
- weapon shop
- armor shop
- item shop
- forge
- relic shop

Required parts:
- five small category signboards without readable text
- five category icon plaques or hanging emblems
- one neutral shop banner shape
- one selected-state glow badge shape for future UI or interaction use

Each sign must be readable on mobile and instantly distinguishable by silhouette alone. Avoid letters, numbers, logos, and readable words.
```

---

## 10. Indoor Lighting And Shadow Overlay Set

- target_file:
  - `assets/source/world/shop-refresh/10-indoor-lighting-and-shadow-overlay-set.png`

```text
Create a commercial-quality transparent-background pixel-art lighting and shadow overlay set for Hero Sword, a Korean mobile fantasy ARPG for Android.

This set is for indoor Lumen Village shops and should help the rooms feel less flat and empty.

Required pieces:
- soft counter-front floor shadow
- short wall-base shadow strip
- warm lamp light pool
- forge warm ember glow pool
- relic soft mystic light pool
- subtle shelf shadow patches

These are restrained runtime overlays, not giant magic VFX. Keep them practical, readable, and reusable on a portrait mobile screen.

Transparent background PNG only. No full room, no text, no characters, no blur-heavy painterly effects.
```

---

## 11. Shop UI Header And Badge Accent Pack

- target_file:
  - `assets/source/world/shop-refresh/11-shop-ui-header-and-badge-accent-pack.png`

```text
Create a commercial-quality transparent-background pixel-art UI accent pack for Hero Sword, a Korean mobile fantasy ARPG for Android.

This pack is for the in-shop purchase UI. The current layout already works, but it needs stronger commercial polish and better shop identity.

Required pieces:
- one shared premium fantasy shop header bar
- five small category crest inserts for weapon / armor / item / forge / relic
- compact currency badge frames
- selected-item badge frame
- narrow divider strips
- one improved page-arrow housing style

The art must stay readable over dark shop UI backgrounds and should match a polished fantasy mobile RPG, not a glossy painterly MMO shop.

No readable text, no logo, no watermark, no mockup screenshot, transparent background PNG only.
```
