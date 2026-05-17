# EQUIPMENT_SUMMON_HOUSING_REWORK_READY_TO_COPY_PROMPTS_2026-04-26

- summary:
  - 장비 정비실, 소환의 제단, 거점 꾸미기 화면의 테스트 느낌을 제거하기 위한 추가 이미지 프롬프트 묶음이다.
  - 기존 dialogue portrait는 재사용하고, 이번 문서는 `프레임/배경/가구/결과 연출` 위주로 요청한다.
- inputs:
  - 현재 UI 캡처: `output/ui-polish-pass-2026-04-26/*`
  - 재사용 portrait 문서: `docs/art/CHARACTER_SHOWCASE_PORTRAIT_REUSE_AUDIT_2026-04-26.md`
- decisions:
  - 장비 화면은 `프로필 카드 + 장비 슬롯 판넬 + 다크 메탈 프레임` 방향으로 강화한다.
  - 소환 화면은 `배너 리스트 + 제단 배경 + 결과 카드 프레임 + 안내 모달` 방향으로 강화한다.
  - 하우징 용어는 `거점 꾸미기`로 유지하고, 화면 이해를 돕는 `가구 전용 아이콘/프리뷰`를 새로 요청한다.
- todo:
  - 생성된 이미지가 들어오면 `PASS / EDIT / HOLD` 검수 후 반영한다.
- risks:
  - 가구 PNG는 현재 저장소의 기존 prop 이미지가 크롭이 깨져 있어 재사용 가치가 낮다.
  - 소환 화면은 새 배경 없이 구조만 정리된 상태라 최종 퀄리티 상승폭이 제한적이다.
- artifacts_changed:
  - `docs/art/EQUIPMENT_SUMMON_HOUSING_REWORK_READY_TO_COPY_PROMPTS_2026-04-26.md`
- handoff_to:
  - `asset_agent`
- handoff_notes:
  - 모든 프롬프트는 `세로 모바일 화면`, `픽셀/하이브리드 판타지`, `현재 주인공 도트와 어울림`을 기준으로 작성했다.
- done_check:
  - true

## 1. 장비 정비실 UI 프레임

```text
Create a premium vertical mobile RPG equipment-management UI frame for a fantasy game that already uses a dark-haired pixel hero in town and battle scenes.
The screen purpose is "equipment maintenance room" for hero loadout management.

Requirements:
- 9:16 portrait mobile layout
- dark navy + aged gold + worn steel palette
- top hero profile card area
- two side-by-side equipment list panels: weapon list and armor list
- bottom detail/status panel
- separate export pieces, not one merged mockup:
  1) main outer frame PNG
  2) section title bar PNG
  3) hero profile card frame PNG
  4) weapon list card frame PNG
  5) armor list card frame PNG
  6) bottom info panel PNG
- transparent background outside the frame
- no text baked into the art
- no green-screen, no checkerboard remnants, no placeholder marks
- elegant but game-readable, not realistic UI photography
- style must feel compatible with polished Korean mobile fantasy RPG interfaces
```

## 2. 장비 화면 전용 증명사진 카드 프레임

```text
Create a set of fantasy RPG profile photo card frames for character portraits.
These frames will hold existing bust portraits, so the portrait itself is not needed.

Requirements:
- portrait mobile RPG style
- aged gold trim, dark enamel, subtle jewel accent
- three rarity-neutral variants:
  1) standard hero portrait frame
  2) summon-result portrait frame
  3) NPC audience frame
- transparent PNG
- center opening sized for bust portraits
- must read clearly at small mobile scale
- no text, no badges with words
- no glow overload
- no green or white fringing
```

## 3. 소환의 제단 메인 배경

```text
Create a vertical mobile fantasy summoning altar background for a Korean RPG.
This is not the whole UI, only the background illustration behind the summon interface.

Requirements:
- 9:16 portrait
- dramatic but readable
- magical altar, floating sigils, faint blue-gold light, sacred stone floor
- clear dark center area where UI cards can sit without losing readability
- top area calm enough for banner title
- middle area suitable for featured portrait cards
- bottom area darker and quieter for summon result cards
- no giant character illustration
- no text baked in
- no hard frame edges; frame will be separate
- compatible with existing pixel hero world tone, but higher-detail painted UI backdrop
```

## 4. 소환 결과 카드 프레임 세트

```text
Create a set of vertical mobile gacha result card frames for a fantasy RPG.

Requirements:
- transparent PNG assets
- separate frames for:
  1) normal rarity
  2) high rarity
  3) legendary rarity
- each frame must support portrait art or weapon icon inside
- subtle glow and rune accents
- readable on small mobile screens
- premium feeling, no toy-like colors
- no text baked in
- no cropped decorations that intrude into the portrait too much
```

## 5. 소환 안내 모달 장식

```text
Create a summon-confirmation modal art set for a vertical mobile fantasy RPG.

Requirements:
- separate transparent PNG pieces:
  1) modal outer frame
  2) title ornament
  3) cost row divider
  4) confirm-button background
  5) close-button background
- dark navy and gold
- sacred altar motif
- should feel important and ceremonial
- no text baked into the art
- no placeholder iconography
```

## 6. 거점 꾸미기 전용 가구 아이콘 세트

```text
Create a clean furniture icon set for a fantasy RPG base-decoration screen called "outpost decorating".

Need one polished icon each for:
- knight banner
- sword rack
- training stand
- supply crate
- small plant
- lumen lamp

Requirements:
- transparent PNG
- each icon centered and fully visible
- square composition for UI slots
- consistent hand-painted fantasy game style
- readable at very small mobile size
- no cropped objects
- no background tiles
- no text
```

## 7. 거점 꾸미기 메인 프리뷰 배경

```text
Create a vertical mobile RPG room-preview background for an outpost decorating screen.

Requirements:
- 9:16 portrait
- cozy fantasy barracks / command room feel
- three clear decoration positions:
  1) left wall area
  2) center floor display area
  3) right accent area
- subtle depth, warm indoor light
- must remain readable under UI overlays
- no hard frame; frame will be separate
- no text baked in
- no giant props blocking the layout
```

## 8. 궁성 왕 좌상 전용 런타임 보강 컷

```text
Create a seated king sprite-style character illustration for a royal audience hall in a fantasy RPG.

Requirements:
- full-body seated pose on throne
- regal blue-gold costume
- compatible with an in-game palace background, not a dialogue portrait
- transparent PNG
- centered composition
- readable in a vertical mobile scene from mid distance
- not too realistic, should still harmonize with polished game scene art
- no extra throne included if possible; character only
```
