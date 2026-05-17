# PALACE_RUNTIME_DOT_REMAKE_READY_TO_COPY_PROMPTS_2026-04-25

이번 문서는 `궁궐 내부에서 실제로 움직이는 도트 NPC`만 다시 만들기 위한 프롬프트 묶음이다.  
`대화 초상`은 현재 수준을 유지하고, 여기서는 포함하지 않는다.

목표:

- `주인공 Kain`과 같은 계열의 `현대형 2등신 판타지 도트 캐릭터`
- 게임 필드에서 바로 쓸 수 있는 `런타임 전신 도트 이미지`
- `머리부터 발끝까지 한 캐릭터만` 또렷하게 보이는 형태
- `투명 배경 PNG`
- `체커보드/흰 배경/그림자 박스/다른 캐릭터/배경 오브젝트` 금지

공통 규칙:

- `Hero Sword`의 주인공 `Kain`과 같은 비주얼 계열
- 귀엽지만 너무 유아체형은 아닌 `세련된 2등신 도트`
- 머리, 어깨, 팔, 다리, 망토 끝이 절대 잘리지 않게
- 한 장에 캐릭터 1명만
- 다른 프레임, 다른 캐릭터, 이전/다음 동작 흔적 금지
- 배경 완전 투명
- 외곽선은 약간 진하고 읽기 쉬운 판타지 픽셀 스타일
- 지나치게 큰 레트로 블록 도트 금지
- 반실사 일러스트 느낌 금지
- 흐림, 고스트, 반투명 누수 금지

---

## 1. `king.png`

사용 위치:
- `public/assets/world/palace/npcs/king.png`

복사 프롬프트:

```text
Create a single full-body runtime pixel character sprite for King Aldren of the Lumen palace. This must match the same polished modern 2-head-tall fantasy pixel style as the main protagonist Kain from Hero Sword. The king should look clearly royal, older, and authoritative, but still use the same compact readable chibi proportions as the hero. Outfit: blue and gold royal clothing, white fur mantle, refined boots, royal crown, elegant throne-room court style. Pose: standing royal idle pose for an in-game NPC, readable from head to feet. Transparent background PNG. One character only. No throne, no background, no floor shadow, no frame, no text, no extra props, no other people, no cut-off limbs, no semi-realistic paint look, no blurry edges, no checkerboard, no white matte. Crisp dark outline, clean fantasy pixel rendering, same visual family as the protagonist runtime sprite.
```

---

## 2. `queen.png`

사용 위치:
- `public/assets/world/palace/npcs/queen.png`

복사 프롬프트:

```text
Create a single full-body runtime pixel character sprite for Queen Regent Celestine of the Lumen palace. The style must match the same polished modern 2-head-tall fantasy pixel character style as Hero Sword's protagonist Kain. She should look noble, composed, and regal, with a blue-white-gold royal gown adapted into a readable compact chibi silhouette. Add a small crown or jeweled headpiece, elegant sleeves, palace-grade details, and a strong readable outline. Pose: standing palace idle pose, full body visible from head to feet. Transparent background PNG. One character only. No background, no throne, no shadow plate, no extra props, no other people, no cut-off dress hem, no blurry painterly render, no checkerboard, no white fringe. Clean dark outline and sharp pixel readability consistent with the hero.
```

---

## 3. `guard.png`

사용 위치:
- `public/assets/world/palace/npcs/guard.png`

복사 프롬프트:

```text
Create a single full-body runtime pixel character sprite for Captain Rowan, elite palace guard captain of Lumen. This must match the same polished modern 2-head-tall fantasy pixel style as Hero Sword's protagonist Kain. He should look like a high-ranking royal guard, not a generic town soldier. Outfit: blue-and-silver palace armor, refined guard cloak or short mantle, disciplined knight silhouette, officer-class armor detailing. Pose: standing alert in a palace interior idle stance, full body visible from head to feet. Transparent background PNG. One character only. No floor shadow, no background, no banner, no other characters, no extra floating weapons outside the silhouette, no cut-off helmet or boots, no blur, no semi-realistic rendering, no checkerboard, no white edge residue. Strong readable dark outline and clean high-quality fantasy pixel finish.
```

---

## 4. `scholar.png`

사용 위치:
- `public/assets/world/palace/npcs/scholar.png`

복사 프롬프트:

```text
Create a single full-body runtime pixel character sprite for Archivist Mirel of the Lumen palace archives. This must match the same polished modern 2-head-tall fantasy pixel style as Hero Sword's protagonist Kain. She should look intelligent, reserved, and elegant, wearing layered palace scholar robes in cream, navy, and muted gold accents. Her silhouette should read clearly as a palace archivist or court scholar, but remain compact and readable in the same game style as the hero. Pose: calm standing idle pose for a palace interior NPC, full body visible from head to feet. Transparent background PNG. One character only. No bookshelf, no scroll pile, no background, no other characters, no floor shadow, no cropped hair or robe hem, no semi-realistic paint look, no checkerboard, no white matte. Clean dark outline and sharp modern fantasy pixel readability.
```

---

## 품질 체크 기준

- `Kain`과 나란히 두었을 때 이질감이 없어야 한다
- 너무 실사풍이면 불합격
- 너무 큰 도트 덩어리면 불합격
- 머리/손/망토/발이 잘리면 불합격
- 배경이 투명하지 않으면 불합격
- 다른 캐릭터 잔상, 프레임 흔적, 체커보드, 흰 테두리가 있으면 불합격
