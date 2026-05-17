# MONSTER_EXPANSION_READY_TO_COPY_PROMPTS_2026-05-02.md

## 목적

- 모든 몬스터를 `한 이미지 = 한 몬스터` 구조로 다시 생성하기 위한 문서다.
- 가장 중요한 목표는 `편집과 컷팅이 쉬운 원본`을 얻는 것이다.
- 따라서 모든 프롬프트는 `투명 배경`, `큰 안전 여백`, `단일 피사체`, `실루엣 보존`, `배경 효과 배제`를 강하게 요구한다.

## 공통 생성 규칙

- 스타일: `classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster`
- 톤: `cute but dangerous fantasy monster`, `slightly charming`, `stylized face`, `rounded readable shapes`, `game-friendly corruption`, `a little cute even when hostile`
- 표현: `hand-painted 2D anime fantasy`, `sprite-friendly silhouette`, `readable shapes`
- 금지:
  - `photorealistic`
  - `cinematic realism`
  - `3D CGI`
  - `Unreal engine look`
  - `western dark fantasy realism`
  - `movie creature realism`
  - `hyper-detailed anatomy`
  - `grotesque horror`
  - `body horror`
  - `gore`
  - `exposed organs`
  - `rotting flesh realism`
  - `parasite horror`
  - `disgusting slime drool`
  - `corpse-like decay realism`
  - `blur-heavy concept art`
- 출력: `transparent PNG`
- 투명 배경이 안 되는 모델이면 `flat chroma key background #00FF66 only`
- `한 이미지에 몬스터 1마리만` 나온다
- `중복 피사체`, `동료 몬스터`, `소환체`, `배경 NPC`, `추가 머리`, `추가 팔`, `여분 무기` 금지
- `배경`, `지면`, `바닥 텍스처`, `지평선`, `풍경`, `건물`, `배경형 안개`, `연출용 먼지층` 금지
- `텍스트`, `UI`, `라벨`, `워터마크`, `번호`, `테두리` 금지
- 무기, 뿔, 꼬리, 귀, 망토, 후광, 배너 끝이 프레임 밖으로 나가면 안 된다
- 캐릭터 외곽 주변에 `흰 안개`, `흰 halo fringe`, `배경색 번짐`이 없어야 한다
- 큰 전투 이펙트는 본체 시트에 넣지 않는다
- 본체 시트에는 `작은 고유 발광`만 허용한다

## 일반 몬스터 캔버스 규칙

- 캔버스: `1536 x 1536`
- 구도: `single monster only`, `full body visible`, `3/4 battle angle`
- 피사체 크기: `canvas height의 62% ~ 68%`
- 여백: 사방 `최소 160px` 이상 투명 여백
- 그림자: 없거나 아주 얕은 접지감만, 그리고 프레임 안쪽에만

## 보스 몬스터 캔버스 규칙

- 캔버스: `1792 x 2304`
- 구도: `single boss only`, `full body visible`, `3/4 battle angle`
- 피사체 크기: `canvas height의 72% ~ 80%`
- 여백: 사방 `최소 224px` 이상 투명 여백
- 보스는 일반 몬스터보다 더 크고 더 위압적이어야 한다
- 하지만 `이펙트 부풀리기`로 커 보이게 하면 안 되고, `몸체/장비/실루엣`으로 강함이 보여야 한다

## 사용 규칙

- 아래 프롬프트는 `하나씩 따로` 생성한다
- 여러 몬스터를 한 번에 넣지 않는다
- 보스는 반드시 보스 전용 프롬프트를 쓴다

## Continent 01 Greenhaven Plains

### 01. Meadow Slime / 초원 슬라임

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Meadow Slime, a green wet grassland slime with reeds, roots, muddy water tones, and a low readable bouncing silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. rural corruption, wet soil, swamp grass, quiet danger.
```

### 02. Thorn Wolf / 가시늑대

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Thorn Wolf, a gaunt plains wolf with thorn growths piercing from the shoulders and spine, fast charger posture, lean predatory body, readable claws and fangs. Mood: Keep the monster game-friendly and a little cute rather than disgusting. broken farmland edge, root blight, feral pressure.
```

### 03. Bramble Kobold Slinger / 브램블 코볼트 슬링어

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Bramble Kobold Slinger, a small lean kobold in rough leather, carrying a stone sling and thorn-seed pouches, mischievous but dangerous ranged silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. rural ambush, thorn brush, dirty field raider.
```

### 04. Reed Shaman / 갈대 주술사

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Reed Shaman, a marshland ritual caster with reed staff, damp wraps, poison charm ornaments, and contained green-black magic near the hands only. Mood: Keep the monster game-friendly and a little cute rather than disgusting. toxic waterway ritual, reeds, rot, slow corruption.
```

### 05. Fence Raider / 울타리 약탈병

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Fence Raider, a rough melee marauder with scavenged farm armor, broken fence planks, hooks, rope, and a desperate raider silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. collapsed frontier homestead, muddy aggression, rural violence.
```

### 06. Seed Bomber / 검은씨앗 투척병

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Seed Bomber, a corrupted raider carrying black seed bombs, patched farm gear, canisters on the belt, and a dangerous throwing posture. Mood: Keep the monster game-friendly and a little cute rather than disgusting. spreading blight, black seeds, rural contamination.
```

### 07. Tusk Boarling / 엄니멧돼지

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Tusk Boarling, a low aggressive corrupted boar beast with enlarged tusks, mud-dark hide, scarred shoulders, and a compact charging silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. trampled fields, brute force, muddy wreckage.
```

### 08. Black Seed Cultist / 흑씨앗 사육사

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Black Seed Cultist, a thin ritual breeder of corruption with root-antler hood, crop blight tools, and sickly green-black seed magic kept close to the body. Mood: Keep the monster game-friendly and a little cute rather than disgusting. hidden cult agriculture, root rot, ritual poison.
```

### 09. Blackhorn Chieftain / 검은뿔 우두머리

```text
Create a single isolated boss monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG boss, hand-painted 2D anime fantasy, cute but dangerous fantasy boss design, stylized commanding face, bold readable silhouette, sprite-friendly but imposing shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1792 x 2304 canvas. Show exactly one boss only, full body visible, centered, 3/4 battle angle, occupying about 72% to 80% of the canvas height, with at least 224px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, and no large battle FX. Boss: Blackhorn Chieftain, a horned plains war-chief in heavy leather and bone armor, broader shoulders, bigger weapons, and obvious mid-boss authority over raiders and beasts. Mood: Keep the monster game-friendly and a little cute rather than disgusting. rural warlord, corrupted frontier command, black shard dominance.
```

### 10. Morgan / 초원의 폭식왕 모건

```text
Create a single isolated final boss monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG final boss, hand-painted 2D anime fantasy, cute but dangerous fantasy final boss design, stylized commanding face, bold readable silhouette, sprite-friendly but highly imposing shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1792 x 2304 canvas. Show exactly one final boss only, full body visible, centered, 3/4 battle angle, occupying about 72% to 80% of the canvas height, with at least 224px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, and no large battle FX. Boss: Morgan, Devourer King of the Plains, a shard-corrupted tyrant with heavy appetite symbolism, swollen authority silhouette, massive armor mass, and a clearly final-boss presence stronger than any plains enemy. Mood: Keep the monster game-friendly and a little cute rather than disgusting. ruined harvest, black shard hunger, final corruption of Greenhaven.
```

## Continent 02 Ironreach Mountains

### 11. Soot Slime / 그을음 슬라임

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Soot Slime, a black-gray slag slime with ember veins and ash-choked surface patterns, readable molten core and industrial corruption. Mood: Keep the monster game-friendly and a little cute rather than disgusting. furnace grime, soot, mining heat.
```

### 12. Ash Mine Worker / 재광 광부

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Ash Mine Worker, a corrupted mining laborer in soot-stained work gear, carrying brutal close-range tools and a bent, exhausted but violent silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. collapsed mine labor, ash choke, forced industry.
```

### 13. Scrap Kobold Gunner / 고철 코볼트 사수

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Scrap Kobold Gunner, a scavenger kobold wearing iron scraps and aiming a crude bolt launcher, with a wiry industrial ranged silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. mining junkyard, rogue bolts, iron dust.
```

### 14. Furnace Rigger / 용광 배관술사

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Furnace Rigger, an industrial caster with valves, control rods, heat pipes, and compact contained forge magic around the hands. Mood: Keep the monster game-friendly and a little cute rather than disgusting. heat pressure, unstable pipes, forge ritual machinery.
```

### 15. Chain Breaker / 사슬 파쇄병

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Chain Breaker, a heavy shock trooper using broken restraint chains and a brutal hammer frame, built for frontal impact and high mass readability. Mood: Keep the monster game-friendly and a little cute rather than disgusting. runaway iron labor, chained violence, furnace assault.
```

### 16. Ember Crossbowman / 잿불 석궁수

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Ember Crossbowman, a soot-covered ranged soldier firing heated bolts, furnace glow limited to the weapon and eyes, compact military silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. iron foundry warfare, ember shots, disciplined heat.
```

### 17. Slag Hound / 슬래그 사냥개

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Slag Hound, a furnace-bred pursuit beast with blackened hide, ember cracks, and a vicious industrial predator silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. molten waste, tunnel ambush, ember-fed pursuit.
```

### 18. Rune Forge Tender / 룬 용광 조형사

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Rune Forge Tender, a rune engineer-mage tending unstable foundry sigils, carrying rods, clamps, and restrained molten rune light near the hands. Mood: Keep the monster game-friendly and a little cute rather than disgusting. corrupt industrial sorcery, forge pressure, machine-lit ritual.
```

### 19. Bares / 철식 광부장 바레스

```text
Create a single isolated boss monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG boss, hand-painted 2D anime fantasy, cute but dangerous fantasy boss design, stylized commanding face, bold readable silhouette, sprite-friendly but imposing shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1792 x 2304 canvas. Show exactly one boss only, full body visible, centered, 3/4 battle angle, occupying about 72% to 80% of the canvas height, with at least 224px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, and no large battle FX. Boss: Bares, a mine foreman warlord in heavy industrial armor, massive upper body, brutal mining authority, and a clearly mid-boss command silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. iron oppression, mine revolt, furnace command.
```

### 20. Dravorn / 용광 군주 드라보른

```text
Create a single isolated final boss monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG final boss, hand-painted 2D anime fantasy, cute but dangerous fantasy final boss design, stylized commanding face, bold readable silhouette, sprite-friendly but highly imposing shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1792 x 2304 canvas. Show exactly one final boss only, full body visible, centered, 3/4 battle angle, occupying about 72% to 80% of the canvas height, with at least 224px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, and no large battle FX. Boss: Dravorn, Furnace Lord of Ironreach, a tyrant fused to forge power and mining industry, larger, heavier, and more sovereign than any mountain enemy. Mood: Keep the monster game-friendly and a little cute rather than disgusting. burning foundry throne, iron dominion, final furnace corruption.
```

## Continent 03 Bluemist Coast

### 21. Salt Slime / 염수 슬라임

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Salt Slime, a pale brine slime with shells, foam, salt crystals, and cold coastal translucency. Mood: Keep the monster game-friendly and a little cute rather than disgusting. wet shoreline rot, sea salt, creeping tide corruption.
```

### 22. Mist Raider / 해무 약탈병

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Mist Raider, a coastal ambush fighter using soaked leather gear, fog-hunting posture, and a nimble ranged silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. salt mist, ruined docks, hidden raiders.
```

### 23. Tide Kobold Harpooner / 조수 코볼트 작살수

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Tide Kobold Harpooner, a sea-rat kobold with harpoon launcher, rope harness, wet scavenger gear, and a clean ranged silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. tide trap, rope rigging, coastal hunt.
```

### 24. Brine Marauder / 염수 습격병

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Brine Marauder, a salt-crusted melee raider using tidal scavenger armor and a hooked cutlass-like weapon. Mood: Keep the monster game-friendly and a little cute rather than disgusting. drowned plunder, slick sea rust, tide violence.
```

### 25. Coastal Horror / 해안 파식수

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Coastal Horror, a reef-grown marine predator with wet flesh, coral protrusions, and a low powerful lunging silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. wave crash, reef rot, shoreline terror.
```

### 26. Drowned Rite Keeper / 침수 의식사

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Drowned Rite Keeper, a shrine ritual caster in soaked robes, shell relics, and tight contained tide magic around hands or staff. Mood: Keep the monster game-friendly and a little cute rather than disgusting. flooded ceremony, drowned faith, sea shrine corruption.
```

### 27. Reef Stalker / 산호 추적수

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Reef Stalker, a sharp marine hunter slipping through coral and rock, aggressive charger posture, clean predator silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. hidden reef paths, saltwater ambush, marine pursuit.
```

### 28. Sea Shrine Hexer / 성소 저주술사

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Sea Shrine Hexer, a coastal curse mage with wet ceremonial cloth, shell mask, and compact tidal curse glow contained close to the body. Mood: Keep the monster game-friendly and a little cute rather than disgusting. moonlit shrine blasphemy, salt curse, drowned liturgy.
```

### 29. Elrent / 심해 사제 엘렌트

```text
Create a single isolated boss monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG boss, hand-painted 2D anime fantasy, cute but dangerous fantasy boss design, stylized commanding face, bold readable silhouette, sprite-friendly but imposing shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1792 x 2304 canvas. Show exactly one boss only, full body visible, centered, 3/4 battle angle, occupying about 72% to 80% of the canvas height, with at least 224px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, and no large battle FX. Boss: Elrent, an abyssal shrine priest with larger ceremonial relics, stronger religious authority, and clear mid-boss scale above all coast cult enemies. Mood: Keep the monster game-friendly and a little cute rather than disgusting. drowned sanctum command, tide ritual authority, abyss prayer.
```

### 30. Nereph / 해룡의 사자 네레프

```text
Create a single isolated final boss monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG final boss, hand-painted 2D anime fantasy, cute but dangerous fantasy final boss design, stylized commanding face, bold readable silhouette, sprite-friendly but highly imposing shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1792 x 2304 canvas. Show exactly one final boss only, full body visible, centered, 3/4 battle angle, occupying about 72% to 80% of the canvas height, with at least 224px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, and no large battle FX. Boss: Nereph, herald of the sea dragon, moon-tide ruler of the coast, elegant but terrifying, clearly more sovereign and dangerous than any other marine enemy. Mood: Keep the monster game-friendly and a little cute rather than disgusting. abyss tide, dragon omen, final coastal catastrophe.
```

## Continent 04 Frostveil Plateau

### 31. Frost Slime / 서리 슬라임

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Frost Slime, an icy undead slime with frozen core shards, cold translucency, and clear rounded silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. glacial burial grounds, frozen seep, pale danger.
```

### 32. Frozen Legion Trooper / 동결 군단병

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Frozen Legion Trooper, a dead legion melee soldier in cracked cold armor, stiff disciplined stance, and military readability. Mood: Keep the monster game-friendly and a little cute rather than disgusting. ruined fort line, frozen oath, cold discipline.
```

### 33. Grave Kobold Scout / 묘역 코볼트 정찰병

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Grave Kobold Scout, a burial-ground kobold with scavenged fur, bone charms, and thrown ice spikes, lean ranged silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. cold cemetery path, grave theft, winter ambush.
```

### 34. Snow Hexer / 눈보라 주술사

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Snow Hexer, a pale winter caster with snow-veiled robes, frost glyph focus, and tightly contained cold spell light. Mood: Keep the monster game-friendly and a little cute rather than disgusting. whiteout ritual, frozen whisper, occult blizzard.
```

### 35. Frost Hound / 서리 사냥개

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Frost Hound, a lean icy pursuit beast with sharp mane, frozen breath kept close to the muzzle, and strong running silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. snow pursuit, ice fang, relentless hunt.
```

### 36. Ice Ward Archer / 빙창 궁병

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Ice Ward Archer, a disciplined frozen sentry archer in blue-white armor with ice arrows and a guard-line silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. frozen battlement, cold defense, disciplined watch.
```

### 37. Barrow Wraith / 매장귀

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Barrow Wraith, a burial spirit in torn grave cloth, pale spectral core, floating posture, and compact ghostly frost. Mood: Keep the monster game-friendly and a little cute rather than disgusting. crypt memory, frozen lament, grave magic.
```

### 38. Avalanche Mauler / 설사태 파쇄수

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Avalanche Mauler, a thick snow-packed charger beast with brutal impact shoulders and downhill-force readability. Mood: Keep the monster game-friendly and a little cute rather than disgusting. collapsing ridge, white fury, snow shockwave.
```

### 39. Hrod / 서리 거인 흐로드

```text
Create a single isolated boss monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG boss, hand-painted 2D anime fantasy, cute but dangerous fantasy boss design, stylized commanding face, bold readable silhouette, sprite-friendly but imposing shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1792 x 2304 canvas. Show exactly one boss only, full body visible, centered, 3/4 battle angle, occupying about 72% to 80% of the canvas height, with at least 224px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, and no large battle FX. Boss: Hrod, a giant of the frozen plateau, huge mass, broad arms, ancient war brute silhouette, clearly stronger and larger than all surrounding frost enemies. Mood: Keep the monster game-friendly and a little cute rather than disgusting. ancient snow giant wrath, shattered watchtower, frozen dominance.
```

### 40. Valtern / 동토의 군주 발테른

```text
Create a single isolated final boss monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG final boss, hand-painted 2D anime fantasy, cute but dangerous fantasy final boss design, stylized commanding face, bold readable silhouette, sprite-friendly but highly imposing shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1792 x 2304 canvas. Show exactly one final boss only, full body visible, centered, 3/4 battle angle, occupying about 72% to 80% of the canvas height, with at least 224px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, and no large battle FX. Boss: Valtern, lord of the frozen ruins, regal but broken military ruler with heavy cold authority, stronger and more sovereign than any plateau monster. Mood: Keep the monster game-friendly and a little cute rather than disgusting. frozen citadel ruin, dead command, final winter throne.
```

## Continent 05 Sunscar Desert

### 41. Glass Slime / 유리모래 슬라임

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Glass Slime, a translucent amber slime packed with glittering glass sand and heat-scorched shine. Mood: Keep the monster game-friendly and a little cute rather than disgusting. relic desert shimmer, hot wind, dangerous beauty.
```

### 42. Dune Reaver / 사구 습격병

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Dune Reaver, a close-range desert raider with shard blade, wrapped cloth, relic scraps, and a low aggressive silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. sand ambush, ruined trade route, relic scavenger violence.
```

### 43. Dune Kobold Slinger / 사막 코볼트 투석병

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Dune Kobold Slinger, a wrapped desert kobold using glass-sand bombs and sling stones, small but readable ranged silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. relic dunes, heat pressure, hidden nuisance attacker.
```

### 44. Sun Mirage Hexer / 환영 태양술사

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Sun Mirage Hexer, a desert caster using heat haze illusions, ceremonial relic cloth, and compact occult sigils near the hands only. Mood: Keep the monster game-friendly and a little cute rather than disgusting. mirage ritual, blinding heat, false horizons.
```

### 45. Sand Tracker Beast / 모래 추적수

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Sand Tracker Beast, a desert charger that hunts footprints, low muscular frame, dune-running legs, and an aggressive tracking posture. Mood: Keep the monster game-friendly and a little cute rather than disgusting. hot pursuit, open dunes, relentless predation.
```

### 46. Bone Slinger / 백골 투척수

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Bone Slinger, a skeletal or half-mummified desert ranged raider throwing carved bone darts and relic fragments. Mood: Keep the monster game-friendly and a little cute rather than disgusting. tomb theft, dry death, desert cruelty.
```

### 47. Ruin Automaton / 유적 자동병기

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Ruin Automaton, an ancient desert construct with relic core, faded imperial machinery, and compact magical articulation points. Mood: Keep the monster game-friendly and a little cute rather than disgusting. buried empire machine, dry relic power, ancient defense.
```

### 48. Sunscorch Mauler / 열사 파쇄병

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Sunscorch Mauler, a desert heavy charger with sand-blasted armor, brutal forward weight, and hot-wind assault silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. scorching advance, shattered stone, heat violence.
```

### 49. Setra / 모래사자장 세트라

```text
Create a single isolated boss monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG boss, hand-painted 2D anime fantasy, cute but dangerous fantasy boss design, stylized commanding face, bold readable silhouette, sprite-friendly but imposing shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1792 x 2304 canvas. Show exactly one boss only, full body visible, centered, 3/4 battle angle, occupying about 72% to 80% of the canvas height, with at least 224px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, and no large battle FX. Boss: Setra, desert war champion of the dunes, broader and more regal than all field enemies, with clear mid-boss stature and command weight. Mood: Keep the monster game-friendly and a little cute rather than disgusting. desert command, lion-like authority, relic war pride.
```

### 50. Kazer / 사막의 심판자 카제르

```text
Create a single isolated final boss monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG final boss, hand-painted 2D anime fantasy, cute but dangerous fantasy final boss design, stylized commanding face, bold readable silhouette, sprite-friendly but highly imposing shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1792 x 2304 canvas. Show exactly one final boss only, full body visible, centered, 3/4 battle angle, occupying about 72% to 80% of the canvas height, with at least 224px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, and no large battle FX. Boss: Kazer, shattered empire judge of the desert, final tyrant bound to shard power, with unmistakable sovereign scale and final-boss authority. Mood: Keep the monster game-friendly and a little cute rather than disgusting. relic judgment, sun-burned empire doom, final desert trial.
```

## Continent 06 Lumina Sanctuary

### 51. Sanctum Ooze / 성역 점액체

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Sanctum Ooze, a pale sacred-corruption mass with white-gold tones, void cracks, and soft but readable religious contamination. Mood: Keep the monster game-friendly and a little cute rather than disgusting. collapsed sanctuary residue, broken holiness, creeping blasphemy.
```

### 52. Fallen Acolyte / 타락 수련사

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Fallen Acolyte, a corrupted sanctuary melee servant with broken devotion symbols, short blade or staff, and fanatical close-range posture. Mood: Keep the monster game-friendly and a little cute rather than disgusting. broken prayer, sanctum betrayal, dark discipline.
```

### 53. Choir Kobold Caster / 성가 코볼트 주술사

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Choir Kobold Caster, a small corrupted choir-servant creature with broken hymn scrolls, warped halo fragments, and compact liturgical magic. Mood: Keep the monster game-friendly and a little cute rather than disgusting. twisted hymn, sanctuary echo, small but malignant ritual.
```

### 54. Ashen Crossbowman / 성역 석궁수

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Ashen Crossbowman, a sanctuary ranged soldier in worn ceremonial armor with soot-dark bolts and disciplined firing posture. Mood: Keep the monster game-friendly and a little cute rather than disgusting. desecrated wall defense, chapel ash, cold execution.
```

### 55. Fallen Holy Knight / 추락 성기사

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Fallen Holy Knight, a heavy sanctum charger in damaged holy armor, noble shape ruined by corruption, with clear cavalry-like impact presence. Mood: Keep the monster game-friendly and a little cute rather than disgusting. broken vow, sanctified ruin, corrupted charge.
```

### 56. Choir Hexer / 왜곡 성가술사

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Choir Hexer, a fallen liturgical mage with torn blue-gold cloth, broken hymn authority, and compact sacred distortion glow close to the hands. Mood: Keep the monster game-friendly and a little cute rather than disgusting. warped liturgy, sanctuary blasphemy, false grace.
```

### 57. Black Moon Vanguard / 흑월 전위병

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Black Moon Vanguard, a disciplined dark sanctuary elite guard with black-silver military authority, ranged readiness, and clean elite silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. black gate approach, sacred war line, cold obedience.
```

### 58. Gate Executioner / 검은문 처형수

```text
Create a single isolated monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG monster, hand-painted 2D anime fantasy, cute but dangerous fantasy monster design, slightly charming stylized face, rounded readable shapes, sprite-friendly shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1536 x 1536 canvas. Show exactly one monster only, full body visible, centered, 3/4 battle angle, occupying about 62% to 68% of the canvas height, with at least 160px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, no detached FX outside the silhouette. Monster: Gate Executioner, a brutal black-gate charger with execution armor, large cleaving weapon, and heavy punitive silhouette. Mood: Keep the monster game-friendly and a little cute rather than disgusting. threshold judgment, gate terror, sanctum punishment.
```

### 59. Cardinal Serdin / 추기경 세르딘

```text
Create a single isolated boss monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG boss, hand-painted 2D anime fantasy, cute but dangerous fantasy boss design, stylized commanding face, bold readable silhouette, sprite-friendly but imposing shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1792 x 2304 canvas. Show exactly one boss only, full body visible, centered, 3/4 battle angle, occupying about 72% to 80% of the canvas height, with at least 224px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, and no large battle FX. Boss: Cardinal Serdin, a sanctuary church authority twisted by forbidden faith, with stronger ornament hierarchy, ceremonial weight, and unmistakable mid-boss presence. Mood: Keep the monster game-friendly and a little cute rather than disgusting. broken cathedral politics, false holiness, black moon intrigue.
```

### 60. Varkan / 흑월왕 바르칸

```text
Create a single isolated final boss monster for Hero Sword, a Korean mobile fantasy action RPG. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG final boss, hand-painted 2D anime fantasy, cute but dangerous fantasy final boss design, stylized commanding face, bold readable silhouette, sprite-friendly but highly imposing shape design. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not western dark fantasy realism, not grotesque horror, not body horror, not gore, not disgusting monster realism. Output a transparent PNG on a 1792 x 2304 canvas. Show exactly one final boss only, full body visible, centered, 3/4 battle angle, occupying about 72% to 80% of the canvas height, with at least 224px empty transparent padding on every side. No background, no floor, no fog haze, no text, no watermark, no duplicate creature, and no large battle FX. Boss: Varkan, King of the Black Moon, the final ruler at the gate, larger and more sovereign than every sanctuary enemy, with heavy final-boss scale, authority, and sacred-corruption grandeur. Mood: Keep the monster game-friendly and a little cute rather than disgusting. last sanctuary throne, black moon dominion, endgame judgment.
```

## Single Monster Effect Companion Prompt

```text
Create a single isolated combat effect sheet for one Hero Sword monster. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG effect, hand-painted 2D anime fantasy, simple readable layered glow, sprite-friendly shapes. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not smoky-realistic film VFX. Output a transparent PNG on a 1024 x 1024 canvas. Show only one monster's compact effect set, centered, fully visible, with at least 128px transparent padding on every side. No background, no text, no watermark, no duplicate subjects. Include only: attack flash, projectile or slash trail, hit spark, charge aura. Keep each effect isolated and easy to cut.

Monster:
[replace with one exact monster name]

Palette:
match the monster body colors, but simplify the effect shapes and keep them cleaner than the body art
```

## Single Boss Effect Companion Prompt

```text
Create a single isolated boss combat effect sheet for one Hero Sword boss. Style: classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG boss effect, hand-painted 2D anime fantasy, readable layered glow, bold but clean silhouettes, sprite-friendly composition. Not photorealistic, not cinematic, not 3D CGI, not Unreal-like, not smoky-realistic film VFX. Output a transparent PNG on a 1280 x 1280 canvas. Show only one boss's effect set, centered, fully visible, with at least 144px transparent padding on every side. No background, no text, no watermark, no duplicate subjects. Include only: heavy hit flash, charge ring, projectile or wave core, burst impact. Keep all shapes isolated and easy to cut.

Boss:
[replace with one exact boss name]

Palette:
match the boss body colors, but keep the effect shapes cleaner and more graphic than the body art
```

