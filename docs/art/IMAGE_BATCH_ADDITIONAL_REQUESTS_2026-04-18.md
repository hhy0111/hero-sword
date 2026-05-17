# IMAGE_BATCH_ADDITIONAL_REQUESTS_2026-04-18

- summary:
- `image/` 배치에서 바로 게임에 쓰지 못한 파일과, 추가로 다시 만들어야 하는 자산만 따로 분리했다.
- 이 문서는 다음 이미지 요청 배치의 기준 목록이다.

- remake_now:
- `02-lumen-village-outer-wall-and-right-edge-stage-gate.png`
- 이유: 파일명과 실제 내용이 맞지 않는다. 현재 용도는 `마을 외벽 + 오른쪽 스테이지 게이트`인데 실제로는 랜드마크 시트에 가깝다.
- 다시 필요한 형태:
- `horizontal_wall`
- `vertical_wall`
- `inner_corner_wall`
- `outer_corner_wall`
- `bottom_wall`
- `right_edge_stage_gate`

- `03-lumen-plaza-ground-remake.png`
- 이유: 광장 바닥이 아니라 외벽 파츠 시트 성격이고, 현재는 상단 가로 벽 일부만 안정적으로 쓸 수 있다.
- 다시 필요한 형태:
- 광장 타일 시트 1장
- 외벽 모듈 시트 1장

- `09-english-primary-button-sheet-remake.png`
- 이유: 흐림
- 다시 필요한 형태:
- 선명한 버튼 프레임만
- 텍스트는 가능하면 제거

- `10-english-utility-button-sheet-remake.png`
- 이유: 흐림
- 다시 필요한 형태:
- 선명한 버튼 프레임만
- 텍스트는 가능하면 제거

- `11-english-battle-button-sheet-remake.png`
- 이유: 이미지 품질은 되지만 버튼에 영문 문구가 직접 박혀 있어서 다국어 시스템과 충돌
- 다시 필요한 형태:
- `blank battle button frame`
- `active / hover / disabled` 상태만 포함
- 텍스트는 넣지 않음

- `13-battle-bottom-command-frame-1.png`
- `13-battle-bottom-command-frame-2.png`
- 이유: 하단 프레임이 아니라 버튼 시트라서 실제 전투 하단 배경으로 쓰면 버튼이 중복 표시됨
- 다시 필요한 형태:
- 버튼 없는 `bottom command bar frame`
- 가운데 전투 로그/스킬 버튼 영역을 감싸는 빈 프레임

- `16-battle-result-clear-frame.png`
- 이유: 흐림
- 다시 필요한 형태:
- `clear result frame`
- 텍스트 없는 빈 프레임

- `25-palace-core-runtime-npc-sheet.png`
- 이유: 고스트/번짐이 커서 런타임 NPC 시트로 불가
- 다시 필요한 형태:
- 왕, 왕비, 근위대장, 기록관
- 각 4방향 또는 최소 `idle / talk / walk`
- 한 프레임당 한 캐릭터만 명확히 분리

- needs_followup_but_not_rejected:
- `01-world-landmark-sheet-remake.png`
- 품질은 나쁘지 않지만 현재 UI에서 직접 쓰는 슬롯이 없다.
- `18-lumen-palace-exterior.png`
- 품질은 사용 가능. 다만 현재 장면 구조상 외부 전경을 안정적으로 노출하는 씬이 아직 부족하다.
- `20-lumen-palace-outer-court-ground.png`
- 품질은 사용 가능. 왕궁 외부/중정 씬이 추가되면 바로 연결 가능하다.
- `23-the-archive-corridor-inside-lumen-palace.png`
- 품질은 사용 가능. 기록보관소 전용 씬이 추가되면 바로 연결 가능하다.

- references:
- 기존 통합 프롬프트: [UNIFIED_REMAKE_AND_EXPANSION_READY_TO_COPY_PROMPTS_2026-04-17.md](/D:/dev/game307/docs/art/UNIFIED_REMAKE_AND_EXPANSION_READY_TO_COPY_PROMPTS_2026-04-17.md)
- 1차 판정 문서: [IMAGE_BATCH_REVIEW_2026-04-17.md](/D:/dev/game307/docs/art/IMAGE_BATCH_REVIEW_2026-04-17.md)
