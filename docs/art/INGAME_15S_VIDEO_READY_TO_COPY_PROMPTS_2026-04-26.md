# INGAME_15S_VIDEO_READY_TO_COPY_PROMPTS_2026-04-26

- summary:
  - `히어로소드` 스토리 삽입 영상용 15초 프롬프트를 바로 복사해서 쓸 수 있게 정리한다.
  - 모든 프롬프트는 `공통 프롬프트 분리 없이`, 각 코드블록 하나만 복사해도 바로 생성 요청이 가능하도록 작성한다.
  - 영상 수량은 전체 스토리 기준 `8개`, 현재 1.0 우선 제작 권장본은 `4개`다.
- inputs:
  - [INGAME_CUTSCENE_VIDEO_INSERT_PLAN_2026-04-26.md](D:/dev/game307/docs/story/INGAME_CUTSCENE_VIDEO_INSERT_PLAN_2026-04-26.md)
  - [characters.ts](D:/dev/game307/src/game/data/characters.ts)
  - `public/assets/dialogue/characters/*.png`
  - `public/assets/dialogue/npcs/*.png`
- decisions:
  - 각 프롬프트는 `15초`, `세로형 9:16`, `모바일 RPG 인게임 컷신`, `자막/로고/UI 없음`을 내부에 직접 포함한다.
  - 각 프롬프트는 관련 인물 외형 고정값을 코드블록 안에 직접 포함한다.
  - 지금부터는 `공통 생성 규칙 참조` 없이 개별 프롬프트만 전달해도 된다.
- todo:
  - 생성 단계에서 Kain, Bram, Sera, Luna, King Aldren, Queen Regent Celestine는 고정 reference로 묶기
  - 생성 결과가 나오면 `PASS / EDIT / REJECT` 기준으로 선별하기
- risks:
  - 후반부 장면은 등장인물을 너무 많이 넣으면 모델이 캐릭터 정체성을 흐릴 수 있다.
  - 강한 폭발 연출 위주로 생성하면 게임 톤보다 generic 판타지 예고편처럼 변질될 수 있다.
- artifacts_changed:
  - this file
- handoff_to:
  - `asset_agent`
- handoff_notes:
  - 현재 1.0은 `01~04` 우선 생성, `05~08`은 후속 확장용으로 준비하면 된다.
- done_check:
  - true

## 사용 순서

현재 기준 추천 순서는 아래다.

1. `video_01_opening_lumen_fall`
2. `video_02_first_fragment_audience`
3. `video_03_ironrich_resonance`
4. `video_04_bluemist_warning`
5. 이후 `05~08`

## 01. Opening - Lumen Village Fall

- target_file: `cutscenes/video_01_opening_lumen_fall.mp4`
- use_timing: `new_game_start`

```text
Create a 15-second vertical pre-rendered 2D hand-drawn cel-animated story cinematic for Hero Sword, a Korean mobile fantasy ARPG for Android. Aspect ratio 9:16. The visual style must feel like a classic late-90s fantasy tactics anime cutscene, with a mood similar to Farland Tactics 1 and 2: clean anime linework, painted fantasy backgrounds, hand-drawn character acting, restrained frame-to-frame motion, and one unified color direction across the whole clip. Use a consistent palette of deep blue, ivory, muted gold, moss green, weathered steel, soft dusk orange, and restrained crimson accents. Make it feel like a premium in-game story movie for a mobile RPG, not a trailer for a different game. No subtitles, no logos, no UI, no readable text, no watermarks. No spoken dialogue, no voice acting, no lip-synced talking, no dialogue balloons, and no narration. Use only quiet background music, ambient background sound, and situation-appropriate sound effects so the viewer understands the scene from visuals, music, and effects alone. Not live action, not western grimdark realism, not chibi comedy, not generic medieval stock art. Absolutely no 3D CGI, no Unreal Engine look, no plastic skin, no realistic physically based rendering, no volumetric 3D lighting, and no game-engine cutscene look. Keep practical armor, readable silhouettes, restrained magic effects, and a strong final frame that can cut back into gameplay.

Scene: the opening fall of Lumen Village at dusk.

Character locks:
Kain is a young male swordsman with short dark brown hair, sharp amber-brown eyes, worn steel armor, a dark navy scarf, and a practical one-hand sword.
Bram is a young shield guard with short brown hair, clean silver plate armor with a blue-gray collar, and a dependable defensive stance.
Sera is a young female arcane mage with cool gray-blue eyes, side-swept dark brown to violet hair, a practical dark robe and travel mantle, and restrained violet-blue magic.
Luna is a young female sanctuary healer with long pale blonde hair, white and pale blue healer garments, soft holy light, and a calm presence.
Black Moon enemies use black smoke, crescent motifs, corrupted beasts, dark cracked armor, and red-black fissure energy.

Shot flow for the full 15 seconds:
0-4s: show Lumen Village under sudden attack, alarm bells, sparks, villagers running, Black Moon corrupted beasts and smoke entering through a broken outer gate, warm village light turning into danger.
4-8s: Bram blocks the road with shield raised, Sera casts a restrained violet barrier near a stone shrine, Luna pulls an injured villager back with soft healing light, clear teamwork, not chaotic unreadable crowd spam.
8-12s: Kain reaches a cracked shrine fragment on the ground, blue-white resonance crawls across the broken metal and his sword hilt, wind and dust pull inward toward the fragment, his expression changes from shock to resolve.
12-15s: close on Kain lifting the fragment as a blue flare cuts through the smoke, revealing the party behind him and the damaged village gate, ending on a heroic but urgent frame that leads directly into gameplay.

Avoid giant dragons, giant castles, floating text, modern effects, comedy posing, oversized armies, or unrealistic explosive magic. Keep the scale grounded and mobile-readable.
```

## 02. First Fragment - Lumen Palace Audience

- target_file: `cutscenes/video_02_first_fragment_audience.mp4`
- use_timing: `after_stage_01_10`

```text
Create a 15-second vertical pre-rendered 2D hand-drawn cel-animated story cinematic for Hero Sword, a Korean mobile fantasy ARPG for Android. Aspect ratio 9:16. The visual style must feel like a classic late-90s fantasy tactics anime cutscene, with a mood similar to Farland Tactics 1 and 2: clean anime linework, painted fantasy backgrounds, hand-drawn character acting, restrained frame-to-frame motion, and one unified color direction across the whole clip. Use a consistent palette of deep blue, ivory, muted gold, moss green, weathered steel, soft dusk orange, and restrained crimson accents. Make it feel like a premium in-game story movie for a mobile RPG, not a trailer for a different game. No subtitles, no logos, no UI, no readable text, no watermarks. No spoken dialogue, no voice acting, no lip-synced talking, no dialogue balloons, and no narration. Use only quiet background music, ambient background sound, and situation-appropriate sound effects so the viewer understands the scene from visuals, music, and effects alone. Not live action, not western grimdark realism, not chibi comedy, not generic medieval stock art. Absolutely no 3D CGI, no Unreal Engine look, no plastic skin, no realistic physically based rendering, no volumetric 3D lighting, and no game-engine cutscene look. Keep practical armor, readable silhouettes, restrained magic effects, and a strong final frame that can cut back into gameplay.

Scene: the first royal audience in Lumen Palace immediately after the first fragment is recovered in Greenhaven Plains.

Character locks:
Kain is a young male swordsman with short dark brown hair, sharp amber-brown eyes, worn steel armor, a dark navy scarf, and a practical one-hand sword.
Bram is a young shield guard with short brown hair, clean silver plate armor with a blue-gray collar, and a dependable defensive stance.
King Aldren is an elderly king with white hair, a full white beard, blue-and-gold royal robes, a fur mantle, a blue gemstone crown, and a stern but protective expression.
Queen Regent Celestine is a blonde royal woman with blue eyes, white-and-blue court attire, gold-and-sapphire crown jewelry, and an elegant but politically sharp presence.
Captain Rowan is a blonde palace captain in blue-silver armor with a disciplined expression and elite royal guard silhouette.

Environment locks:
Lumen Palace is blue, gold, and carved stone, with tall columns, banners, polished floors, royal hall lighting, and formal ceremonial space. Keep the mood solemn and heavy, not festive.

Shot flow for the full 15 seconds:
0-4s: open on the fragment resting on a dark blue ceremonial pedestal in the royal hall, camera rising to reveal King Aldren seated, Queen Regent Celestine standing beside him.
4-8s: Kain steps forward in worn steel armor and navy scarf, presenting the fragment while Captain Rowan and palace guards hold a disciplined line, clear tension that this is both a victory and a dangerous responsibility.
8-12s: the fragment emits a controlled blue projection over the floor, hinting at multiple distant regions and a broken sword silhouette, Queen Celestine narrows her gaze, Aldren leans forward, Rowan turns toward the map-light.
12-15s: finish on Kain and Bram turning toward the palace doors as if the real journey is now beginning, the blue light reflecting on their armor while the throne room remains solemn and heavy.

Avoid giant hologram maps, sci-fi visuals, exaggerated camera spins, crowded court extras, or overdecorated fantasy clutter that hides the main cast.
```

## 03. Ironrich - Second Fragment Resonance

- target_file: `cutscenes/video_03_ironrich_resonance.mp4`
- use_timing: `after_stage_02_10`

```text
Create a 15-second vertical pre-rendered 2D hand-drawn cel-animated story cinematic for Hero Sword, a Korean mobile fantasy ARPG for Android. Aspect ratio 9:16. The visual style must feel like a classic late-90s fantasy tactics anime cutscene, with a mood similar to Farland Tactics 1 and 2: clean anime linework, painted fantasy backgrounds, hand-drawn character acting, restrained frame-to-frame motion, and one unified color direction across the whole clip. Use a consistent palette of deep blue, ivory, muted gold, ember orange, weathered steel, smoke gray, and restrained rune-blue accents. Make it feel like a premium in-game story movie for a mobile RPG, not a trailer for a different game. No subtitles, no logos, no UI, no readable text, no watermarks. No spoken dialogue, no voice acting, no lip-synced talking, no dialogue balloons, and no narration. Use only quiet background music, ambient background sound, and situation-appropriate sound effects so the viewer understands the scene from visuals, music, and effects alone. Not live action, not western grimdark realism, not chibi comedy, not generic medieval stock art. Absolutely no 3D CGI, no Unreal Engine look, no plastic skin, no realistic physically based rendering, no volumetric 3D lighting, and no game-engine cutscene look. Keep practical armor, readable silhouettes, restrained magic effects, and a strong final frame that can cut back into gameplay.

Scene: the Ironrich Mountains climax after the second fragment is secured.

Character locks:
Kain is a young male swordsman with short dark brown hair, sharp amber-brown eyes, worn steel armor, a dark navy scarf, and a practical one-hand sword.
Bram is a young shield guard with short brown hair, clean silver plate armor with a blue-gray collar, and a dependable defensive stance.
Helma is a rune smith, a forge-worker and scholar hybrid, carrying a hammer and runic tools, with a practical industrial silhouette lit by sparks and furnace glow.

Environment locks:
Ironrich Mountains should feel like a heavy forge chamber, furnace glow, runic anvils, cracked stone, chain mechanisms, heated metal, and restrained blue-orange contrast. It should look industrial fantasy, not lava fantasy chaos.

Shot flow for the full 15 seconds:
0-4s: show a heavy forge altar deep inside Ironrich Mountains, second fragment set into a broken Hero Sword core, Helma raises a hammer over etched runes while furnace fire breathes in the background.
4-8s: Kain and Bram brace against a burst of pressure from the fragment, Bram anchors the line while Kain reaches toward the light, forge chains shake, sparks and runes flare but remain readable, not explosion spam.
8-12s: Helma strikes the rune point and the fragment locks into place, a clean blue line travels through the broken sword core, the chamber briefly stabilizes instead of blowing apart.
12-15s: end on Kain holding the partially awakened sword core while the forge doors open behind him and the mountain path beyond is visible, signaling that the restoration is real and the journey must continue.

Avoid molten fantasy overload, giant lava demons, cluttered smithy props, superhero lightning, or apocalyptic explosions.
```

## 04. Bluemist - Sea Shrine Warning

- target_file: `cutscenes/video_04_bluemist_warning.mp4`
- use_timing: `after_stage_03_10`

```text
Create a 15-second vertical pre-rendered 2D hand-drawn cel-animated story cinematic for Hero Sword, a Korean mobile fantasy ARPG for Android. Aspect ratio 9:16. The visual style must feel like a classic late-90s fantasy tactics anime cutscene, with a mood similar to Farland Tactics 1 and 2: clean anime linework, painted fantasy backgrounds, hand-drawn character acting, restrained frame-to-frame motion, and one unified color direction across the whole clip. Use a consistent palette of storm blue, sea gray, muted gold, wet stone green, ivory, and restrained black-crimson corruption accents. Make it feel like a premium in-game story movie for a mobile RPG, not a trailer for a different game. No subtitles, no logos, no UI, no readable text, no watermarks. No spoken dialogue, no voice acting, no lip-synced talking, no dialogue balloons, and no narration. Use only quiet background music, ambient background sound, and situation-appropriate sound effects so the viewer understands the scene from visuals, music, and effects alone. Not live action, not western grimdark realism, not chibi comedy, not generic medieval stock art. Absolutely no 3D CGI, no Unreal Engine look, no plastic skin, no realistic physically based rendering, no volumetric 3D lighting, and no game-engine cutscene look. Keep practical armor, readable silhouettes, restrained magic effects, and a strong final frame that can cut back into gameplay.

Scene: the sea-shrine warning on the Bluemist Coast.

Character locks:
Kain is a young male swordsman with short dark brown hair, sharp amber-brown eyes, worn steel armor, a dark navy scarf, and a practical one-hand sword.
Sera is a young female arcane mage with cool gray-blue eyes, side-swept dark brown to violet hair, a practical dark robe and travel mantle, and restrained violet-blue magic.
Luna is a young female sanctuary healer with long pale blonde hair, white and pale blue healer garments, soft holy light, and a calm presence.
Serena is a tide ritualist support caster with sea-themed priestly clothing, sacred coastal ritual styling, and a serious watchful expression.
Black Moon corruption should appear as black tide, fissure-like stains, dark mist, and desecrated sacred stone.

Environment locks:
Bluemist Coast should feel like a stormy harbor coast with shrine beacon, sea cliffs, wet stone, rain mist, cold sea wind, and sacred architecture under pressure.

Shot flow for the full 15 seconds:
0-4s: open on a coastal shrine tower under storm clouds, waves crash below, black fissure-like corruption spreads through wet stone and shallow water, the sacred beacon flickers instead of shining steadily.
4-8s: Kain climbs the shrine steps with Sera and Luna close behind, Serena turns toward the sea as if she senses something larger than a local monster attack, keep each figure readable.
8-12s: Sera's restrained violet-blue magic and Luna's pale healing light interact with the fragment glow in Kain's hand, revealing a dark Black Moon route hidden beneath sea mist and offshore ruins.
12-15s: finish on the shrine beacon cutting a narrow beam across the sea toward the next horizon, with the party staring toward an unseen wider threat, more ominous than triumphant.

Avoid pirate comedy, oversized sea monsters filling the frame, tropical vacation color palettes, or overly bright cartoon water.
```

## 05. Frostbell - Archive Truth

- target_file: `cutscenes/video_05_archive_truth.mp4`
- use_timing: `after_stage_04_09_or_04_10`

```text
Create a 15-second vertical pre-rendered 2D hand-drawn cel-animated story cinematic for Hero Sword, a Korean mobile fantasy ARPG for Android. Aspect ratio 9:16. The visual style must feel like a classic late-90s fantasy tactics anime cutscene, with a mood similar to Farland Tactics 1 and 2: clean anime linework, painted fantasy backgrounds, hand-drawn character acting, restrained frame-to-frame motion, and one unified color direction across the whole clip. Use a consistent palette of winter blue, ivory, candle amber, desaturated stone gray, pale gold, and restrained abyss-black accents. Make it feel like a premium in-game story movie for a mobile RPG, not a trailer for a different game. No subtitles, no logos, no UI, no readable text, no watermarks. No spoken dialogue, no voice acting, no lip-synced talking, no dialogue balloons, and no narration. Use only quiet background music, ambient background sound, and situation-appropriate sound effects so the viewer understands the scene from visuals, music, and effects alone. Not live action, not western grimdark realism, not chibi comedy, not generic medieval stock art. Absolutely no 3D CGI, no Unreal Engine look, no plastic skin, no realistic physically based rendering, no volumetric 3D lighting, and no game-engine cutscene look. Keep practical armor, readable silhouettes, restrained magic effects, and a strong final frame that can cut back into gameplay.

Scene: the truth reveal inside a frozen archive in Frostbell Highlands.

Character locks:
Kain is a young male swordsman with short dark brown hair, sharp amber-brown eyes, worn steel armor, a dark navy scarf, and a practical one-hand sword.
Erin is an archive keeper support character with scholar-combat styling, record-focused gear, and a calm but alert reading posture.
Archivist Mirel is a young blond scholar with glasses, blue-and-white archive robes, composed expression, and the presence of someone guarding dangerous records.

Environment locks:
Frostbell Highlands archive should feel cold, candlelit, ancient, and defensive: frosted shelves, old records, stone tablets, faint winter air, blue-white ambient light, and carved seals instead of modern technology.

Shot flow for the full 15 seconds:
0-4s: open on a sealed archive chamber with frozen bookcases and stone tablets, Mirel and Erin uncover an ancient panel while Kain approaches with fragment light in hand.
4-8s: the panel activates and shows a mural-like memory of the Hero Sword sealing a vast black gate rather than simply winning a battle, mystical and ancient, not sci-fi projection.
8-12s: close on Erin and Mirel realizing the implication, papers and frost swirl gently, Kain watches the image of a broken sword and a sealed abyss, his expression shifts from victory to burden.
12-15s: end on a carved route line extending from the archive record toward the desert and holy capital, turning the story from recovery into final preparation.

Avoid giant exposition walls full of readable text, hologram interfaces, giant crowds, or puzzle-room gimmick comedy.
```

## 06. Sunscar - Route Reveal

- target_file: `cutscenes/video_06_desert_route_reveal.mp4`
- use_timing: `after_stage_05_10`

```text
Create a 15-second vertical pre-rendered 2D hand-drawn cel-animated story cinematic for Hero Sword, a Korean mobile fantasy ARPG for Android. Aspect ratio 9:16. The visual style must feel like a classic late-90s fantasy tactics anime cutscene, with a mood similar to Farland Tactics 1 and 2: clean anime linework, painted fantasy backgrounds, hand-drawn character acting, restrained frame-to-frame motion, and one unified color direction across the whole clip. Use a consistent palette of desert dusk gold, sand beige, relic blue, weathered bronze, deep night blue, and restrained black-crimson route accents. Make it feel like a premium in-game story movie for a mobile RPG, not a trailer for a different game. No subtitles, no logos, no UI, no readable text, no watermarks. No spoken dialogue, no voice acting, no lip-synced talking, no dialogue balloons, and no narration. Use only quiet background music, ambient background sound, and situation-appropriate sound effects so the viewer understands the scene from visuals, music, and effects alone. Not live action, not western grimdark realism, not chibi comedy, not generic medieval stock art. Absolutely no 3D CGI, no Unreal Engine look, no plastic skin, no realistic physically based rendering, no volumetric 3D lighting, and no game-engine cutscene look. Keep practical armor, readable silhouettes, restrained magic effects, and a strong final frame that can cut back into gameplay.

Scene: the route reveal in Sunscar Desert after the relic conflict.

Character locks:
Kain is a young male swordsman with short dark brown hair, sharp amber-brown eyes, worn steel armor, a dark navy scarf, and a practical one-hand sword.
Nazir is a desert duelist in light armor with a curved blade, fast tracking posture, road-scarred confidence, and a practical desert silhouette.
Laila is a relic scholar caster with robe-based styling, ancient artifact focus, observant intelligence, and controlled magic rather than explosive spell spam.

Environment locks:
Sunscar Desert should feel like night desert ruins, half-buried stone arches, relic tower silhouette, thinning sandstorm, old caravan route logic, and hidden war-path revelation.

Shot flow for the full 15 seconds:
0-4s: open on a desert ruin half buried in sand at night, wind pushes across broken arches and a dormant relic mechanism, Nazir scans the horizon while Laila studies a carved device.
4-8s: Kain places a fragment near the mechanism, blue light runs through the ruin carvings, Laila identifies the alignment, Nazir spots movement traces and a hidden route line beyond the dunes.
8-12s: the sandstorm peels back just enough to reveal Black Moon supply paths and a distant direction toward Lumina Sanctuary and the Black Gate approach, keep the revelation visual, not text based.
12-15s: finish with the three characters framed against a newly exposed road of ruins and markers in the sand, the story now clearly pointing toward the final campaign.

Avoid endless camel caravans, modern desert war imagery, treasure-hunter comedy, or parody adventure tone.
```

## 07. Final Decree - Last Advance

- target_file: `cutscenes/video_07_final_decree.mp4`
- use_timing: `after_stage_06_09`

```text
Create a 15-second vertical pre-rendered 2D hand-drawn cel-animated story cinematic for Hero Sword, a Korean mobile fantasy ARPG for Android. Aspect ratio 9:16. The visual style must feel like a classic late-90s fantasy tactics anime cutscene, with a mood similar to Farland Tactics 1 and 2: clean anime linework, painted fantasy backgrounds, hand-drawn character acting, restrained frame-to-frame motion, and one unified color direction across the whole clip. Use a consistent palette of royal blue, ivory, muted gold, sanctuary white, weathered steel, and restrained shadow-black accents. Make it feel like a premium in-game story movie for a mobile RPG, not a trailer for a different game. No subtitles, no logos, no UI, no readable text, no watermarks. No spoken dialogue, no voice acting, no lip-synced talking, no dialogue balloons, and no narration. Use only quiet background music, ambient background sound, and situation-appropriate sound effects so the viewer understands the scene from visuals, music, and effects alone. Not live action, not western grimdark realism, not chibi comedy, not generic medieval stock art. Absolutely no 3D CGI, no Unreal Engine look, no plastic skin, no realistic physically based rendering, no volumetric 3D lighting, and no game-engine cutscene look. Keep practical armor, readable silhouettes, restrained magic effects, and a strong final frame that can cut back into gameplay.

Scene: the final decree before the last advance.

Character locks:
Kain is a young male swordsman with short dark brown hair, sharp amber-brown eyes, worn steel armor, a dark navy scarf, and a practical one-hand sword.
King Aldren is an elderly king with white hair, full white beard, blue-and-gold royal robes, fur mantle, blue gemstone crown, and a stern but protective expression.
Queen Regent Celestine is a blonde royal woman with blue eyes, white-and-blue court attire, gold-and-sapphire crown jewelry, and an elegant but politically sharp presence.
Captain Rowan is a blonde palace captain in blue-silver armor with a disciplined expression and elite royal guard silhouette.
Seraphin is a holy paladin in white-gold-blue late-game armor with sacred authority and a wall-like defender presence.
Lucian is a moon tracker assassin in light dark-toned gear with dual daggers and an alert late-game scout silhouette.

Environment locks:
The chamber should feel like a royal war room connected to sanctuary strategy halls, blue banners, sacred light, polished stone, and an opening route toward the final gate. It is a command scene, not a coronation or banquet.

Shot flow for the full 15 seconds:
0-4s: open on a war chamber where King Aldren stands rather than sits, Queen Regent Celestine and Captain Rowan beside him, the atmosphere is not celebration but final resolve.
4-8s: Kain faces the royal line while Seraphin stands like a sacred wall and Lucian waits in the shadows of the route map, showing that every kind of ally is now committed to the same final push.
8-12s: Aldren gives the final silent order with a firm gesture, banners move in the draft, sanctuary light and fragment light align, the chamber doors open toward a dark distant path.
12-15s: end on Kain walking forward first, with Seraphin and Lucian joining the advance as the palace and sanctuary forces part to make a road, final-campaign mood, no victory yet.

Avoid coronation pageantry, smiling festival extras, modern military tech, or giant battlefield panoramas that lose the character focus.
```

## 08. Ending - Black Gate Sealed

- target_file: `cutscenes/video_08_black_gate_ending.mp4`
- use_timing: `after_stage_06_10`

```text
Create a 15-second vertical pre-rendered 2D hand-drawn cel-animated ending cinematic for Hero Sword, a Korean mobile fantasy ARPG for Android. Aspect ratio 9:16. The visual style must feel like a classic late-90s fantasy tactics anime cutscene, with a mood similar to Farland Tactics 1 and 2: clean anime linework, painted fantasy backgrounds, hand-drawn character acting, restrained frame-to-frame motion, and one unified color direction across the whole clip. Use a consistent palette of dawn blue, ivory, muted gold, weathered steel, pale sunrise orange, and fading black-crimson corruption accents. Make it feel like a premium in-game story movie for a mobile RPG, not a trailer for a different game. No subtitles, no logos, no UI, no readable text, no watermarks. No spoken dialogue, no voice acting, no lip-synced talking, no dialogue balloons, and no narration. Use only quiet background music, ambient background sound, and situation-appropriate sound effects so the viewer understands the scene from visuals, music, and effects alone. Not live action, not western grimdark realism, not chibi comedy, not generic medieval stock art. Absolutely no 3D CGI, no Unreal Engine look, no plastic skin, no realistic physically based rendering, no volumetric 3D lighting, and no game-engine cutscene look. Keep practical armor, readable silhouettes, restrained magic effects, and a strong final frame that can cut back into gameplay.

Scene: the sealing of the Black Gate and the restoration of the Hero Sword.

Character locks:
Kain is a young male swordsman with short dark brown hair, sharp amber-brown eyes, worn steel armor, a dark navy scarf, and a practical one-hand sword.
Bram is a young shield guard with short brown hair, clean silver plate armor with a blue-gray collar, and a dependable defensive stance.
Sera is a young female arcane mage with cool gray-blue eyes, side-swept dark brown to violet hair, a practical dark robe and travel mantle, and restrained violet-blue magic.
Luna is a young female sanctuary healer with long pale blonde hair, white and pale blue healer garments, soft holy light, and a calm presence.
Black Moon corruption should appear as shattered black stone, red-black fissure energy, collapsing smoke, and a dying curse rather than a living monster swarm.

Environment locks:
Black Gate should feel like a ruined threshold at dawn, cracked stone, corrupted seal platform, fading red-black haze, and a battlefield after the hardest fight, not a cosmic outer-space scene.

Shot flow for the full 15 seconds:
0-4s: open on the shattered Black Gate platform, corruption writhing like smoke and cracked glass, Kain steps forward with the restored Hero Sword glowing blue-white, battered but upright.
4-8s: Bram anchors the rear defense, Sera channels restrained arcane support, Luna stabilizes the light around the wounded field, all three clearly readable as the first companions who stayed with Kain from the beginning.
8-12s: Kain drives the restored Hero Sword power into the gate seal, the black fissure contracts instead of exploding outward, dawn light starts to break through the red-black haze.
12-15s: finish on the corruption fading from the sky, the gate quiet, and Kain lowering the restored sword while the first light of morning reaches the road home, ending with relief and earned closure rather than exaggerated triumph.

Avoid planet-scale explosions, space scenes, giant monsters swallowing the whole frame, or comic victory poses. The ending should feel noble, emotional, and final.
```
