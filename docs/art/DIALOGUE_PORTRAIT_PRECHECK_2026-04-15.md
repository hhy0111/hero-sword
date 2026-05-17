# DIALOGUE_PORTRAIT_PRECHECK_2026-04-15

- summary:
  - 현재 대화 초상은 런타임에 연결됐지만, 일부 초상은 실제 도트 NPC/캐릭터와 외형 해석이 어긋난다.
  - 오늘 기준으로 화면에서 명확히 확인된 불합격은 `Young Resident`다.
  - 내일 이미지 재생성은 `현재 씬에 실제로 노출되는 town dialogue portraits`부터 다시 잡는 것이 맞다.
- inputs:
  - runtime speaker mapping: [dialogueOverlay.ts](D:/dev/game307/src/game/ui/dialogueOverlay.ts)
  - town NPC definitions: [town.ts](D:/dev/game307/src/game/data/town.ts)
  - original portrait prompts: [DIALOGUE_FACE_READY_TO_COPY_PROMPTS.md](D:/dev/game307/docs/art/DIALOGUE_FACE_READY_TO_COPY_PROMPTS.md)
  - current runtime capture evidence:
    - [npc-orin.png](D:/dev/game307/output/dialogue-portrait-runtime-check/npc-orin.png)
    - user-provided capture showing `Young Resident`
- decisions:
  - `confirmed remake required`
    - `child_south`
      - in-game label: `Young Resident`
      - current portrait problem: 도트 NPC는 `어린/작은 체형의 양갈래 계열`로 읽히는데, 현재 초상은 `성인 여성/중년 느낌`으로 읽힌다.
      - result: 현재 초상은 캐릭터 정체성과 나이대가 맞지 않아 불합격.
  - `high-risk review targets for tomorrow`
    - `villager_plaza`
    - `runner_lane`
    - `guard_east`
    - `orin`
    - `marta`
    - `neri`
    - `torren`
    - `seline`
    - `weapon_merchant`
    - `armor_merchant`
    - `item_merchant`
    - `relic_merchant`
    - `blacksmith`
  - 이유:
    - 현재 town portraits 전체가 `실제 도트 런타임 캐릭터`보다 `나이대가 높거나`, `현실풍/일러스트풍 해석이 과하게 들어갈` 위험이 있다.
    - 특히 `96x132` 대화창 패널에서 읽을 때는 `나이`, `역할`, `실루엣`이 먼저 맞아야 한다.
- todo:
  - 내일 이미지 재생성 1순위는 `Young Resident`
  - 재생성 후에는 `villager / courier / guard / named merchants` 순서로 town portrait를 다시 검수
- risks:
  - 현재처럼 prompt 해석이 넓으면 `child/teen` 대상이 성인으로 뽑힐 수 있다.
  - `transparent background`만 맞고 `대상 정체성`이 틀리면 런타임 완성도는 여전히 낮다.
- artifacts_changed:
  - this file only
- handoff_to:
  - `asset_agent`
- handoff_notes:
  - 다음 배치는 town dialogue portraits부터 다시 만든다.
  - 목표는 “예쁜 초상”이 아니라 “도트 런타임 주체와 동일 인물로 읽히는 초상”이다.
- done_check:
  - current mismatch documented
  - remake priority fixed

## Confirmed Remake Target

### 1. Young Resident

- speaker id: `child_south`
- current usage:
  - Lumen Village ambient NPC dialogue
- runtime identity:
  - 작은 체형
  - 어린 주민 / child or young teen
  - 화면상 `양갈래/어린 인상`으로 읽히는 방향
- current portrait issue:
  - 성인 여성처럼 읽힘
  - 얼굴 연령대가 높음
  - 마을 어린 주민이라는 설정과 어긋남
- non-negotiables for remake:
  - 절대 성인/중년 느낌 금지
  - child or young teen으로 명확히 읽혀야 함
  - 둥근 얼굴형, 작은 턱선, 과한 성인 메이크업/성숙한 광대/깊은 팔자 느낌 금지
  - 헤어 실루엣은 런타임 도트와 비슷하게 `어린 주민`으로 읽혀야 함
  - 가슴 위 초상만, 투명 배경, 소품 최소화
  - 모바일 대화창 `96x132`에서도 바로 “어린 주민”으로 보여야 함

## Tomorrow Prompt Tightening

아래 기준으로 새로 생성하는 것이 맞다.

```text
Create a commercial-quality square dialogue portrait for Hero Sword, a Korean mobile fantasy ARPG for Android. Character: a young resident of Lumen Village. This portrait must read clearly as a child or very young teen at first glance, not an adult woman. Show a face-first or chest-up portrait only with transparent background, simple small-town fantasy clothing, youthful facial proportions, and a soft village-resident identity suitable for a small ambient NPC. Expression should feel curious, sincere, and lightly impressed by the heroes. Keep the face visibly young with a smaller jaw, softer cheeks, and age-appropriate features. If hairstyle is used, prefer a simple youthful silhouette that can plausibly match a small village child NPC, including twin-tail or clearly youthful tied hair if appropriate. Avoid adult beauty styling, mature facial structure, heavy makeup, middle-aged features, glamorous rendering, full-body framing, text, logos, watermarks, blur, or scenery backgrounds.
```

## Town Portrait Acceptance Checklist

모든 town dialogue portrait는 아래를 통과해야 한다.

- runtime 도트 NPC와 같은 인물/같은 역할로 즉시 읽혀야 함
- 96x132 축소 상태에서 얼굴 인상과 나이대가 무너지지 않아야 함
- 투명 배경이어야 함
- 얼굴을 가리는 큰 소품 금지
- 상점 NPC는 역할이 바로 읽혀야 함
- child 계열은 절대 성인 얼굴로 읽히면 안 됨
