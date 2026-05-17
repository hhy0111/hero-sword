# CHARACTER_ANIMATION_FRAME_REGEN_DETAILED_READY_TO_COPY_PROMPTS.md

## 목적

- 현재 캐릭터 프레임 시트 재생성 시 `머리 잘림`, `발 잘림`, `무기 누락`, `내부 투명 구멍`, `행 겹침`, `프레임 간 충돌`, `라벨 오염`, `포스터형 레이아웃`을 막기 위한 상세 재생성 기준이다.
- 이 문서는 `캐릭터 애니메이션 프레임 마스터 시트` 전용이다.
- 출력 대상은 모두 `transparent-background PNG`이며 `64x64 base sprite extraction` 기준이다.

## 공통 강제 규칙

아래 규칙은 모든 캐릭터에 공통으로 강제한다.

```text
Create a commercial-quality transparent-background animation frame master sheet for Hero Sword, a Korean mobile fantasy ARPG for Android. Use one consistent character only in a fixed gameplay 3/4 front-side combat angle suitable for runtime sprite extraction. This must be a true gameplay animation source sheet, not a poster, not splash art, not concept lineup art, not a turnaround sheet, and not a showcase layout. Use a truly cute super-deformed 2-head-tall chibi body plan with a visibly large head, short torso, short limbs, compact hands and feet, and a thick readable silhouette. Do not use elongated adult anatomy, long heroic legs, fashion-model proportions, lanky calves, or a tall slim action-figure build. Every frame must show full head, full feet, and full weapon or tool. No frame may crop the top of the head, toes, heels, cape tip, spear tip, sword tip, shield edge, staff head, bow tip, or gun barrel. Keep all body parts connected with believable anatomy. No missing hands, no merged wrists, no detached weapons, no duplicated heads, no transparent holes inside the torso, face, arms, or legs except intentional leg gaps. Keep effects compact and secondary to the body silhouette, with generous empty spacing between frames and between rows so automatic slicing never captures neighboring frames. If frame numbers are present, place them only below the safe sprite area with clear vertical spacing and never let text overlap the character art. Use transparent background only. The rendering should feel like polished sprite-source art for a dot-game pipeline: crisp and readable, but not harsh ultra-low-resolution crunchy pixel mush, not broken jagged block noise, and not over-dithered retro artifacting. Avoid blur, bloom, checkerboard residue, painterly rendering, soft focus, motion smear, giant cinematic effects, presentation boards, title cards, logos, watermarks, extra characters, alternate costumes, mixed identities, and obvious AI-generated anatomy or costume errors. The result must look like professional runtime source art prepared for a shipped 2D mobile ARPG.
```

## Proportion And Render Quality Reinforcement

```text
Make the character read immediately as a cute SD hero at gameplay size. Prioritize a large readable head, short sturdy legs, compact feet, and a rounded torso mass instead of a tall elegant silhouette. Keep the face area simple and readable, not realistic. Keep the body volume solid and closed so no accidental transparent holes appear inside the character. Preserve clean edge readability and moderate pixel density so the sprite still looks refined after downscaling to runtime size. Do not render the sheet as harsh low-resolution retro pixel art with random crunchy stair-step edges or broken noisy pixels.
```

## 시트 배치 강제 규칙

```text
Use separated horizontal action rows with large vertical gutters between rows. Inside each row, keep each frame isolated with large transparent padding on all sides. Do not place a giant hero illustration anywhere on the sheet. Do not place decorative borders, background panels, or category boxes behind the sprite rows. Keep all rows aligned cleanly so a pipeline can identify each action by row order. Do not let action effects from one frame touch the next frame. The body silhouette must remain the primary readable shape in every frame. The head should stay noticeably larger than the torso and the character should never look stretched vertically from one row to the next.
```

## 액션 품질 강제 규칙

```text
Idle and town actions must be stable and readable, with minimal drift. Walk and run must preserve planted foot rhythm and full-body readability. Attack chains must clearly show anticipation, contact, and recovery instead of blurry repeated poses. Guard actions must keep the defensive silhouette fully readable. Dodge and charge must never collapse into horizontal smear cards. Casting actions must show distinct phase separation between start, hold or loop, and release. Victory and down_or_death must preserve the whole body silhouette and must not crop the floor contact area. In every action, keep the cute 2-head-tall ratio intact so the character never turns into a tall adult proportion during motion extremes.
```

## 캐릭터별 상세 입력값

### 01. Kain

- expected_filename: `01-kain.png`
- output_path: `assets/source/character-animation-master-sheets/approved/01-kain.png`
- role: protagonist swordsman / balanced melee dealer
- silhouette focus: one-handed sword, short cape, light plate armor, beginner knight discipline
- motion focus:
  - `idle`: compact and steady
  - `walk`: disciplined short knight walk
  - `run`: torso lowered, forward commitment
  - `attack_basic_01`: first clean slash
  - `attack_basic_02`: follow-up slash with clear recovery
  - `attack_basic_03`: reverse-slash finisher, must not duplicate attack_basic_02
  - `skill_cast`: sword-led burst, not giant magic cloud
  - `guard_or_block`: stable sword-guard silhouette
  - `charge`: forward sword rush, full body visible
  - `down_or_death`: full body on ground, feet must remain visible
- action_rows: `idle 6f@8`, `walk 8f@10`, `run 8f@12`, `attack_basic_01 6f@12`, `attack_basic_02 6f@12`, `attack_basic_03 7f@12`, `skill_cast 8f@12`, `hit_react 4f@12`, `dash_or_dodge 6f@14`, `guard_or_block 4f@8 hold`, `charge 6f@12`, `town_idle 6f@6`, `talk 4f@8`, `victory 8f@10 hold`, `down_or_death 6f@8 hold`

### 02. Bram

- expected_filename: `02-bram.png`
- output_path: `assets/source/character-animation-master-sheets/approved/02-bram.png`
- role: shield guardian / frontline tank
- silhouette focus: sword and shield, broad shoulders, grounded military armor
- motion focus:
  - shield always fully visible
  - heavy attack must read much heavier than basic attacks
  - guard rows must not crop shield top or bottom
  - taunt should show command presence, not comedy
- action_rows: `idle 6f@7`, `walk 8f@8`, `run 8f@10`, `attack_basic_01 7f@10`, `attack_basic_02 6f@10`, `heavy_attack 9f@9`, `skill_cast 8f@10`, `hit_react 4f@12`, `dash_or_dodge 5f@12`, `guard_or_block 4f@8 hold`, `taunt_or_command 6f@8`, `town_idle 6f@6`, `interact 6f@8`, `victory 8f@9 hold`, `down_or_death 6f@8 hold`

### 03. Sera

- expected_filename: `03-sera.png`
- output_path: `assets/source/character-animation-master-sheets/approved/03-sera.png`
- role: mage / ranged area dealer
- silhouette focus: tome, practical mage layers, slim readable caster silhouette
- motion focus:
  - tome must remain attached to hand logic in every frame
  - `cast_start`, `cast_loop`, `cast_release` must clearly differ
  - effects must stay compact and never overpower body readability
- action_rows: `idle 6f@8`, `walk 8f@9`, `run 8f@11`, `attack_basic_01 5f@12`, `attack_basic_02 5f@12`, `cast_start 4f@10`, `cast_loop 4f@8`, `cast_release 6f@12`, `hit_react 4f@12`, `dash_or_dodge 6f@13`, `town_idle 6f@6`, `talk 4f@8`, `victory 8f@10 hold`, `down_or_death 6f@8 hold`

### 04. Luna

- expected_filename: `04-luna.png`
- output_path: `assets/source/character-animation-master-sheets/approved/04-luna.png`
- role: healer / pure support
- silhouette focus: staff, healer robe, calm holy posture
- motion focus:
  - `heal_cast` must show buildup, release, recovery
  - `pray_idle` must keep whole body and staff readable
  - no giant holy bloom or fog
- action_rows: `idle 6f@8`, `walk 8f@9`, `run 8f@10`, `attack_basic_01 5f@11`, `attack_basic_02 5f@11`, `heal_cast 8f@10`, `buff_cast 6f@10`, `pray_idle 6f@6`, `hit_react 4f@12`, `dash_or_dodge 6f@13`, `town_idle 6f@6`, `talk 4f@8`, `victory 8f@9 hold`, `down_or_death 6f@8 hold`

### 05. Ria

- expected_filename: `05-ria.png`
- output_path: `assets/source/character-animation-master-sheets/approved/05-ria.png`
- role: field healer / active support
- silhouette focus: travel-ready sanctuary clothing, sacred staff, practical field posture
- motion focus:
  - more active than Luna
  - interact and town motions must be small and practical
  - no effect should swallow the silhouette
- action_rows: `idle 6f@8`, `walk 8f@10`, `run 8f@11`, `attack_basic_01 5f@12`, `attack_basic_02 5f@12`, `heal_cast 8f@10`, `buff_cast 6f@10`, `hit_react 4f@12`, `dash_or_dodge 6f@13`, `town_idle 6f@6`, `interact 6f@8`, `talk 4f@8`, `victory 8f@10 hold`, `down_or_death 6f@8 hold`

### 06. Theo

- expected_filename: `06-theo.png`
- output_path: `assets/source/character-animation-master-sheets/approved/06-theo.png`
- role: archer / long-range damage
- silhouette focus: longbow, low-profile ranger silhouette
- motion focus:
  - bow line, draw hand, release hand must always read cleanly
  - `aim`, `shoot_loop`, `reload_or_reset` must all be visually distinct
  - no cropped bow tips
- action_rows: `idle 6f@8`, `walk 8f@10`, `run 8f@13`, `aim 4f@8 hold`, `shoot_loop 4f@12`, `reload_or_reset 5f@10`, `skill_cast 7f@12`, `hit_react 4f@12`, `dash_or_dodge 6f@15`, `town_idle 6f@6`, `interact 6f@8`, `victory 8f@10 hold`, `down_or_death 6f@8 hold`

### 07. Dorgan

- expected_filename: `07-dorgan.png`
- output_path: `assets/source/character-animation-master-sheets/approved/07-dorgan.png`
- role: blacksmith warrior / hammer tank
- silhouette focus: heavy hammer, thick torso, smith-warrior armor
- motion focus:
  - hammer weight and inertia must read clearly
  - overheads must not crop hammer head
  - charge is short, heavy, grounded
- action_rows: `idle 6f@7`, `walk 8f@8`, `run 8f@10`, `attack_basic_01 7f@10`, `attack_basic_02 8f@10`, `heavy_attack 9f@9`, `skill_cast 8f@10`, `charge 6f@11`, `hit_react 4f@12`, `guard_or_block 4f@8 hold`, `dash_or_dodge 5f@12`, `town_idle 6f@6`, `interact 6f@8`, `victory 8f@9 hold`, `down_or_death 6f@8 hold`

### 08. Kiera

- expected_filename: `08-kiera.png`
- output_path: `assets/source/character-animation-master-sheets/approved/08-kiera.png`
- role: engineer gunner / artillery dealer
- silhouette focus: compact arcane cannon, practical engineer gear
- motion focus:
  - cannon grip and recoil logic must remain stable
  - `aim`, `shoot_loop`, `reload_or_reset` must be distinct
  - muzzle effects compact only
- action_rows: `idle 6f@8`, `walk 8f@10`, `run 8f@12`, `aim 4f@8 hold`, `shoot_loop 4f@12`, `reload_or_reset 5f@10`, `charge 6f@12`, `skill_cast 8f@10`, `hit_react 4f@12`, `dash_or_dodge 6f@14`, `town_idle 6f@6`, `victory 8f@10 hold`, `down_or_death 6f@8 hold`

### 09. Helma

- expected_filename: `09-helma.png`
- output_path: `assets/source/character-animation-master-sheets/approved/09-helma.png`
- role: rune smith / buffer support
- silhouette focus: rune hammer, artisan robe, stable elder posture
- motion focus:
  - buff and rune actions must not become glyph clutter
  - guard must preserve full hammer silhouette
  - no hand-tool separation
- action_rows: `idle 6f@7`, `walk 8f@8`, `run 8f@9`, `attack_basic_01 6f@10`, `attack_basic_02 6f@10`, `buff_cast 6f@10`, `summon_or_rune 8f@10`, `charge 6f@10`, `hit_react 4f@12`, `guard_or_block 4f@8 hold`, `dash_or_dodge 5f@12`, `town_idle 6f@6`, `interact 6f@8`, `victory 8f@9 hold`, `down_or_death 6f@8 hold`

### 10. Marin

- expected_filename: `10-marin.png`
- output_path: `assets/source/character-animation-master-sheets/approved/10-marin.png`
- role: lancer / assault dealer
- silhouette focus: long spear, forward-driving body line
- motion focus:
  - spear always fully visible
  - `attack_basic_03` must extend the combo instead of repeating earlier attacks
  - charge must show clear thrust commitment
- action_rows: `idle 6f@8`, `walk 8f@10`, `run 8f@13`, `attack_basic_01 6f@12`, `attack_basic_02 6f@12`, `attack_basic_03 7f@12`, `charge 6f@13`, `skill_cast 7f@12`, `hit_react 4f@12`, `dash_or_dodge 6f@15`, `town_idle 6f@6`, `talk 4f@8`, `victory 8f@10 hold`, `down_or_death 6f@8 hold`

### 11. Serena

- expected_filename: `11-serena.png`
- output_path: `assets/source/character-animation-master-sheets/approved/11-serena.png`
- role: tide priestess / healer-support hybrid
- silhouette focus: water ritual staff, calm support body line
- motion focus:
  - water sigils compact and secondary
  - `pray_idle` and `town_idle` must stay readable and stable
  - no giant splash screens
- action_rows: `idle 6f@8`, `walk 8f@9`, `run 8f@10`, `attack_basic_01 5f@11`, `attack_basic_02 5f@11`, `heal_cast 8f@10`, `buff_cast 6f@10`, `cast_loop 4f@8`, `hit_react 4f@12`, `dash_or_dodge 6f@13`, `town_idle 6f@6`, `pray_idle 6f@6`, `victory 8f@9 hold`, `down_or_death 6f@8 hold`

### 12. Finn

- expected_filename: `12-finn.png`
- output_path: `assets/source/character-animation-master-sheets/approved/12-finn.png`
- role: pistol user / mobile ranged dealer
- silhouette focus: fantasy flintlock pistol, agile body rhythm
- motion focus:
  - pistol always attached and readable
  - shoot and reload must be clearly different
  - no oversized muzzle flash cards
- action_rows: `idle 6f@8`, `walk 8f@10`, `run 8f@13`, `aim 4f@8 hold`, `shoot_loop 4f@12`, `reload_or_reset 5f@10`, `skill_cast 7f@12`, `hit_react 4f@12`, `dash_or_dodge 6f@15`, `town_idle 6f@6`, `talk 4f@8`, `victory 8f@10 hold`, `down_or_death 6f@8 hold`

### 13. Iris

- expected_filename: `13-iris.png`
- output_path: `assets/source/character-animation-master-sheets/approved/13-iris.png`
- role: knight / balanced frontline
- silhouette focus: clean knight sword posture, disciplined armor mass
- motion focus:
  - upright trained control
  - guard must stay readable and not hide or crop weapon
  - charge must look committed, not decorative
- action_rows: `idle 6f@8`, `walk 8f@9`, `run 8f@11`, `attack_basic_01 6f@11`, `attack_basic_02 6f@11`, `attack_basic_03 7f@11`, `charge 6f@11`, `skill_cast 8f@10`, `hit_react 4f@12`, `guard_or_block 4f@8 hold`, `dash_or_dodge 6f@13`, `town_idle 6f@6`, `interact 6f@8`, `victory 8f@10 hold`, `down_or_death 6f@8 hold`

### 14. Volf

- expected_filename: `14-volf.png`
- output_path: `assets/source/character-animation-master-sheets/approved/14-volf.png`
- role: greatsword bruiser
- silhouette focus: huge blade weight, fur-cold gear, broad torso
- motion focus:
  - heavy blade inertia must read in every attack
  - heavy attack must be heavier than both basic attacks
  - no cropped blade tips
- action_rows: `idle 6f@7`, `walk 8f@8`, `run 8f@10`, `attack_basic_01 8f@10`, `attack_basic_02 8f@10`, `heavy_attack 10f@9`, `charge 6f@10`, `taunt_or_command 6f@8`, `hit_react 4f@12`, `dash_or_dodge 5f@12`, `town_idle 6f@6`, `interact 6f@8`, `victory 8f@9 hold`, `down_or_death 6f@8 hold`

### 15. Erin

- expected_filename: `15-erin.png`
- output_path: `assets/source/character-animation-master-sheets/approved/15-erin.png`
- role: archivist / support caster
- silhouette focus: record book, calm scholar-mage posture
- motion focus:
  - book shape must remain readable in every frame
  - `cast_start` and `cast_loop` must feel distinct
  - zero blur allowed
- action_rows: `idle 6f@8`, `walk 8f@9`, `run 8f@10`, `attack_basic_01 5f@11`, `attack_basic_02 5f@11`, `cast_start 4f@10`, `cast_loop 4f@8`, `summon_or_rune 8f@10`, `hit_react 4f@12`, `dash_or_dodge 6f@13`, `town_idle 6f@6`, `interact 6f@8`, `victory 8f@10 hold`, `down_or_death 6f@8 hold`

### 16. Nazir

- expected_filename: `16-nazir.png`
- output_path: `assets/source/character-animation-master-sheets/approved/16-nazir.png`
- role: curved-sword assassin-like vanguard
- silhouette focus: low predatory body line, curved sword, desert cloth restraint
- motion focus:
  - every frame must keep full head, feet, and sword
  - `attack_basic_03` must be a distinct final finisher
  - `stealth_entry`, `dash_or_dodge`, `charge` must preserve full-body readability and must not become smear cards
- action_rows: `idle 6f@8`, `walk 8f@10`, `run 8f@14`, `attack_basic_01 6f@13`, `attack_basic_02 6f@13`, `attack_basic_03 7f@13`, `charge 6f@13`, `skill_cast 7f@12`, `stealth_entry 6f@12`, `hit_react 4f@12`, `dash_or_dodge 6f@15`, `town_idle 6f@6`, `talk 4f@8`, `victory 8f@10 hold`, `down_or_death 6f@8 hold`

### 17. Laila

- expected_filename: `17-laila.png`
- output_path: `assets/source/character-animation-master-sheets/approved/17-laila.png`
- role: archaeologist mage / relic decoder
- silhouette focus: artifact staff, field scholar robe, deliberate casting pose
- motion focus:
  - rune and relic effects compact only
  - artifact and hand connection must always read clearly
  - interact and town motions should remain practical
- action_rows: `idle 6f@8`, `walk 8f@9`, `run 8f@10`, `attack_basic_01 5f@11`, `attack_basic_02 5f@11`, `cast_start 4f@10`, `cast_release 6f@12`, `summon_or_rune 8f@10`, `hit_react 4f@12`, `dash_or_dodge 6f@13`, `town_idle 6f@6`, `interact 6f@8`, `victory 8f@10 hold`, `down_or_death 6f@8 hold`

### 18. Hakan

- expected_filename: `18-hakan.png`
- output_path: `assets/source/character-animation-master-sheets/approved/18-hakan.png`
- role: lancer sub-tank / oasis guardian
- silhouette focus: long spear, chest-led forward pressure
- motion focus:
  - spear fully visible at all times
  - `charge` must be his clearest strongest motion
  - guard must preserve the spear silhouette
- action_rows: `idle 6f@7`, `walk 8f@9`, `run 8f@12`, `attack_basic_01 7f@11`, `attack_basic_02 7f@11`, `heavy_attack 9f@10`, `charge 6f@13`, `skill_cast 8f@10`, `hit_react 4f@12`, `guard_or_block 4f@8 hold`, `dash_or_dodge 5f@12`, `town_idle 6f@6`, `taunt_or_command 6f@8`, `victory 8f@9 hold`, `down_or_death 6f@8 hold`

### 19. Seraphine

- expected_filename: `19-seraphine.png`
- output_path: `assets/source/character-animation-master-sheets/approved/19-seraphine.png`
- role: paladin / holy frontline guardian
- silhouette focus: holy sword, heavy armor, shieldless defense stance
- motion focus:
  - holy effects secondary only
  - guard and pray actions must keep whole body readable
  - armor mass must stay grounded
- action_rows: `idle 6f@7`, `walk 8f@8`, `run 8f@10`, `attack_basic_01 7f@10`, `attack_basic_02 7f@10`, `heavy_attack 9f@9`, `skill_cast 8f@10`, `heal_cast 8f@10`, `hit_react 4f@12`, `guard_or_block 4f@8 hold`, `dash_or_dodge 5f@12`, `pray_idle 6f@6`, `town_idle 6f@6`, `victory 8f@9 hold`, `down_or_death 6f@8 hold`

### 20. Micaela

- expected_filename: `20-michaela.png`
- output_path: `assets/source/character-animation-master-sheets/approved/20-michaela.png`
- role: hymn caster / healer-support leader
- silhouette focus: catalyst or hymn focus, graceful support robe, stable hand arcs
- motion focus:
  - `heal_cast` and `buff_cast` must clearly differ
  - no frame may lose hands, catalyst, or robe hem
  - no idol-stage visuals
- action_rows: `idle 6f@8`, `walk 8f@9`, `run 8f@10`, `attack_basic_01 5f@11`, `attack_basic_02 5f@11`, `cast_start 4f@10`, `heal_cast 8f@10`, `buff_cast 6f@10`, `pray_idle 6f@6`, `hit_react 4f@12`, `dash_or_dodge 6f@13`, `town_idle 6f@6`, `victory 8f@9 hold`, `down_or_death 6f@8 hold`

### 21. Lucian

- expected_filename: `21-lucian.png`
- output_path: `assets/source/character-animation-master-sheets/approved/21-lucian.png`
- role: dark assassin / twin-dagger tracker
- silhouette focus: twin daggers, low silent posture, extremely clean readable motion
- motion focus:
  - both daggers visible and connected in every frame
  - `attack_basic_03` must be a true finisher
  - `stealth_entry` and `dash_or_dodge` must keep a readable full-body silhouette
- action_rows: `idle 6f@8`, `walk 8f@10`, `run 8f@14`, `attack_basic_01 6f@13`, `attack_basic_02 6f@13`, `attack_basic_03 7f@13`, `charge 6f@13`, `skill_cast 7f@12`, `stealth_entry 6f@12`, `hit_react 4f@12`, `dash_or_dodge 6f@15`, `town_idle 6f@6`, `interact 6f@8`, `victory 8f@10 hold`, `down_or_death 6f@8 hold`
