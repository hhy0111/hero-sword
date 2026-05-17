# PALACE_NPC_RUNTIME_AND_DIALOGUE_REMAKE_READY_TO_COPY_PROMPTS_2026-04-23

목표:

- 궁궐 내부에서 쓰는 도트 NPC 4종을 `주인공 Kain과 같은 계열의 2등신 현대형 판타지 픽셀` 스타일로 다시 만든다.
- 궁궐 대화창에 쓰는 초상 4종도 같은 인물 디자인으로 다시 만든다.
- 가장 중요한 기준은 `게임 안에서 바로 써도 어색하지 않은 일관성`이다.

공통 아트 규칙:

- 런타임 도트는 `2등신`, `선명한 외곽선`, `현대형 정교한 픽셀 판타지`, `너무 큰 레트로 도트 금지`
- Kain과 같은 계열의 체형과 명암 밀도
- 얼굴부터 발끝까지 한 캐릭터만 단독으로 들어가야 함
- 흐린 반실사 렌더 금지
- 배경이 섞인 이미지 금지
- 다른 프레임/다른 캐릭터 섞임 금지
- 런타임 도트는 `투명 배경 PNG`
- 대화 초상은 `배경이 살아 있는 정사각 초상 PNG`

## 1. `king.png`

사용 위치:
- `public/assets/world/palace/npcs/king.png`

프롬프트:

```text
Create a single full-body runtime pixel sprite for the king of Lumen palace. Use the same polished fantasy pixel art family as Hero Sword's main protagonist Kain: modern clean chibi RPG pixel art, about 2 heads tall, compact body, readable silhouette, slightly dark outer outline, not oversized chunky retro pixels. The king must look royal, elderly, and dignified, wearing a blue-and-gold royal outfit, white fur trim, royal boots, and a crown. Important: one complete character only, from head to feet, fully visible in one frame, transparent background PNG, centered, no throne, no floor shadow, no text, no frame, no painterly blur, no extra props, no other people, no cropped limbs.
```

## 2. `queen.png`

사용 위치:
- `public/assets/world/palace/npcs/queen.png`

프롬프트:

```text
Create a single full-body runtime pixel sprite for the queen regent of Lumen palace. Match the exact visual family of Hero Sword protagonist Kain: modern polished fantasy pixel art, 2-head-tall chibi proportions, compact silhouette, clean readable shading, slightly dark outline. She should wear an elegant blue-white-gold royal gown adapted into a readable chibi runtime sprite, with a small crown or jeweled royal headpiece. One complete character only, from head to feet, transparent background PNG, centered, no throne, no floor shadow, no text, no frame, no blurred semi-realistic rendering, no other characters, no cropped hem or missing hair.
```

## 3. `guard.png`

사용 위치:
- `public/assets/world/palace/npcs/guard.png`

프롬프트:

```text
Create a single full-body runtime pixel sprite for Captain Rowan, elite palace guard captain of Lumen. Match the exact runtime style of Hero Sword protagonist Kain: modern clean fantasy pixel art, 2-head-tall chibi proportions, compact but readable armor silhouette, darker outline around the body, polished shading, not retro blocky. He should wear blue-and-silver elite royal guard armor with a short cape or scarf and officer-level presence. One complete character only, head to feet fully visible, transparent background PNG, centered, no extra weapon floating outside the body, no floor shadow, no text, no frame, no extra characters, no cropped limbs.
```

## 4. `scholar.png`

사용 위치:
- `public/assets/world/palace/npcs/scholar.png`

프롬프트:

```text
Create a single full-body runtime pixel sprite for Archivist Mirel of the Lumen palace archives. Match the same polished modern fantasy pixel style as Hero Sword protagonist Kain: 2-head-tall chibi proportions, clean compact silhouette, readable face, slightly dark outline, controlled pixel detail. She should wear cream, muted blue, and gold-accented palace scholar robes, looking intelligent and reserved. One complete character only, fully visible head to feet, transparent background PNG, centered, no extra props, no books in hand, no text, no frame, no floor shadow, no painterly blur, no cropped dress or hair.
```

## 5. `king_aldren.png`

사용 위치:
- `public/assets/dialogue/npcs/king_aldren.png`

프롬프트:

```text
Create a square dialogue portrait of King Aldren of Lumen palace. This is a dialogue portrait, not a full-body runtime sprite. Show the face and upper body large and readable. Match the same character identity as the runtime king sprite: elderly royal man, blue-and-gold outfit, white fur collar, crown, dignified but burdened expression. Background should be a palace throne room or royal hall, fully painted and kept inside the portrait, not transparent. No checkerboard transparency, no UI frame, no text, no extra people, no giant throne blocking the face.
```

## 6. `queen_regent_celestine.png`

사용 위치:
- `public/assets/dialogue/npcs/queen_regent_celestine.png`

프롬프트:

```text
Create a square dialogue portrait of Queen Regent Celestine of Lumen palace. Show face and upper body large in frame. Match the same identity as the runtime queen sprite: elegant royal woman, blue-white-gold attire, small crown or jeweled tiara, composed and intelligent expression. Background should be a palace interior, fully painted inside the square portrait, not transparent. No text, no checkerboard, no UI frame, no extra characters, no wide scene composition.
```

## 7. `captain_rowan.png`

사용 위치:
- `public/assets/dialogue/npcs/captain_rowan.png`

프롬프트:

```text
Create a square dialogue portrait of Captain Rowan, elite palace guard captain of Lumen. Show face and upper body large and readable. Match the same identity as the runtime guard sprite: disciplined officer, blue-and-silver palace armor, deep royal accent cloth, stern but controlled expression. Background should suggest a palace guard hall or royal corridor, fully painted inside the square portrait, not transparent. No text, no UI frame, no checkerboard, no extra people, no cropped helmet top.
```

## 8. `archivist_mirel.png`

사용 위치:
- `public/assets/dialogue/npcs/archivist_mirel.png`

프롬프트:

```text
Create a square dialogue portrait of Archivist Mirel from the Lumen palace archive. Show face and upper body large and readable. Match the same identity as the runtime scholar sprite: calm palace archivist, cream and muted blue layered robes, thoughtful expression, refined scholarly presence. Background should suggest a palace archive or royal records room, fully painted inside the square portrait, not transparent. No text, no checkerboard, no UI frame, no extra people, no oversized props blocking the face.
```
