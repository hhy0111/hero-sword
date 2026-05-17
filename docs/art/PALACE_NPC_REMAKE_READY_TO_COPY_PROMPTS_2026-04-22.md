# PALACE_NPC_REMAKE_READY_TO_COPY_PROMPTS_2026-04-22

궁궐 내부 NPC는 현재 `왕`, `왕비`, `근위대장`, `기록관` 4명만 실제 씬에서 사용한다.  
이번 재생성 목표는 두 종류다.

- 궁궐 내부에서 실제 보행/대기용으로 쓰는 `도트 런타임 캐릭터 이미지`
- 대화창 왼쪽에 나오는 `대화 초상 이미지`

중요 기준:

- 도트 런타임 이미지는 `주인공 Kain과 같은 계열의 2등신 판타지 픽셀 캐릭터`
- 너무 큰 레트로 도트 금지
- 흐린 반실사 금지
- 한 파일에 한 캐릭터만
- 잘림 금지
- 다른 프레임/다른 캐릭터 혼입 금지
- 런타임 도트 이미지는 `투명 배경 PNG`
- 대화 초상은 `배경을 살린 정사각 초상 PNG`

---

## 1. `king.png`

사용 위치:
- `public/assets/world/palace/npcs/king.png`

복사용 프롬프트:

```text
Create a single full-body fantasy pixel character sprite for the king of Lumen palace. This is a runtime in-game sprite, not a portrait, and it must match the visual family of a clean modern 2-head-tall chibi pixel RPG hero similar to Hero Sword's main protagonist. The king should look clearly royal and elderly but still fit the same cute compact pixel-body proportions as the player character. He should wear a white-and-gold ceremonial crown, blue and gold royal clothing, a white fur-trimmed mantle, and regal boots. Pose: seated upright in a throne posture, but do NOT include the throne itself, only the king character. The silhouette must read clearly from head to feet even in a small size. Transparent background PNG. One character only, centered, no floor shadow, no frame, no text, no additional props, no other people, no cut-off limbs, no blurred painterly rendering. Crisp outline, slightly dark outer contour, readable face, polished fantasy pixel art, not oversized chunky pixels.
```

---

## 2. `queen.png`

사용 위치:
- `public/assets/world/palace/npcs/queen.png`

복사용 프롬프트:

```text
Create a single full-body fantasy pixel character sprite for the queen regent of Lumen palace. This is a runtime in-game sprite, not a portrait, and it must match the same polished 2-head-tall chibi pixel RPG style as the main hero. She should look noble, calm, and authoritative, with a blue-white-gold royal gown adapted into a compact readable chibi silhouette. Add elegant shoulder detail, refined sleeves, and a small crown or jeweled headpiece. Pose: standing, slightly dignified, palace court posture, readable from head to feet. Transparent background PNG. One character only, centered, no floor shadow, no frame, no text, no throne, no extra objects, no extra characters, no cut-off dress hem, no half-transparent areas, no blurry semi-realistic paint look. Crisp outline and slightly darker border line so the sprite reads clearly in-game.
```

---

## 3. `guard.png`

사용 위치:
- `public/assets/world/palace/npcs/guard.png`

복사용 프롬프트:

```text
Create a single full-body fantasy pixel character sprite for Captain Rowan, the palace guard captain of Lumen. This is a runtime in-game sprite and must match the same modern 2-head-tall chibi fantasy pixel style as the main protagonist. He should look disciplined and battle-ready, with blue-and-silver palace guard armor, a short royal guard cloak or scarf, armored boots, and a refined officer silhouette. He should look more elite than a normal town guard. Pose: standing at ease but alert, readable from head to feet, palace interior idle stance. Transparent background PNG. One character only, centered, no floor shadow, no frame, no text, no extra weapons floating outside the body silhouette, no other characters, no cut-off limbs, no mixed frames, no painterly rendering. Clear dark outline and clean readable pixel shading.
```

---

## 4. `scholar.png`

사용 위치:
- `public/assets/world/palace/npcs/scholar.png`

복사용 프롬프트:

```text
Create a single full-body fantasy pixel character sprite for Archivist Mirel of the Lumen palace archives. This is a runtime in-game sprite and must match the same polished 2-head-tall chibi fantasy pixel style as the main hero. She should look intelligent, reserved, and courtly, wearing layered palace scholar robes in cream, muted blue, and gold accents, with parchment-keeper or archivist design cues but no oversized props. Pose: standing calmly, readable from head to feet, compact silhouette suitable for a palace interior NPC. Transparent background PNG. One character only, centered, no floor shadow, no frame, no text, no bookshelf, no scroll stack, no extra characters, no cut-off hem or hair, no blurry painting style. Clean crisp outline with slightly darker edge line for in-game readability.
```

---

## 5. `king_aldren.png`

사용 위치:
- `public/assets/dialogue/npcs/king_aldren.png`

복사용 프롬프트:

```text
Create a square dialogue portrait of King Aldren of Lumen palace. This is not a full-body sprite. Show a close-up head-and-upper-body portrait with a noble aged male face, white-and-gold crown, blue-and-gold royal robes, white fur collar, and a strong but weary kingly expression. Background should be palace interior themed and fully painted in, not transparent. The portrait must match the character identity of the in-game pixel king sprite, but rendered as a polished dialogue illustration. No text, no UI frame, no checkerboard transparency, no other people, no throne blocking the face. Keep the king centered and readable inside a square crop.
```

---

## 6. `queen_regent_celestine.png`

사용 위치:
- `public/assets/dialogue/npcs/queen_regent_celestine.png`

복사용 프롬프트:

```text
Create a square dialogue portrait of Queen Regent Celestine of Lumen palace. Show a close-up head-and-upper-body portrait of a refined royal woman with blue-white-gold court attire, elegant crown or jeweled tiara, composed eyes, and intelligent authority. Background should be palace interior themed and fully painted in, not transparent. Match the same identity as her runtime pixel sprite. No text, no UI frame, no checkerboard, no extra characters, no wide scene composition. Keep the face and upper body large and readable inside the square portrait.
```

---

## 7. `captain_rowan.png`

사용 위치:
- `public/assets/dialogue/npcs/captain_rowan.png`

복사용 프롬프트:

```text
Create a square dialogue portrait of Captain Rowan, palace guard captain of Lumen. Show a close-up head-and-upper-body portrait of a stern elite royal guard officer with blue-and-silver armor, a disciplined military expression, and red or deep royal accent cloth near the neck or shoulders. Background should be palace stone hall or royal guard corridor, fully painted in, not transparent. Match the identity of the runtime palace guard captain sprite. No text, no UI frame, no checkerboard transparency, no extra people, no cropped helmet top. Keep the face and armor readable in a square dialogue portrait.
```

---

## 8. `archivist_mirel.png`

사용 위치:
- `public/assets/dialogue/npcs/archivist_mirel.png`

복사용 프롬프트:

```text
Create a square dialogue portrait of Archivist Mirel from the Lumen palace archive. Show a close-up head-and-upper-body portrait of a calm palace scholar with layered cream and muted blue robes, neat hair, thoughtful eyes, and a quiet but sharp expression. Background should suggest a royal archive or candlelit palace record chamber, fully painted in, not transparent. Match the identity of the runtime scholar sprite. No text, no UI frame, no checkerboard transparency, no extra characters, no oversized props blocking the face. Keep the portrait square, centered, and easy to read.
```

---

## 9. 선택 추가 권장 `king_aldren_full_throne_portrait.png`

이 파일은 현재 코드에서 직접 쓰지는 않지만, 나중에 왕 첫 대사 전용 컷신 이미지로 쓰기 좋다.

복사용 프롬프트:

```text
Create a square royal audience portrait of King Aldren seated on the throne of Lumen palace. This is a dialogue-event illustration, not a runtime sprite. Show the king seated in a majestic throne composition with enough throne context to communicate power, but keep the face and torso dominant in the frame. Blue-gold-white royal palette, palace light, dignified but burdened mood. Fully painted palace background, no transparency, no text, no UI frame, no extra characters. Keep it suitable for a dramatic story dialogue panel.
```

