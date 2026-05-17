# IMAGE_BATCH_REVIEW_2026-04-17

- summary:
- 2026-04-17 `image/` 배치를 직접 열어 검수했고, 실제 런타임 장면까지 연결한 뒤 적용 유지 / 보류 / 재생성 필요를 분리했다.
- 현재 기준으로 `월드맵 배경/노드 프레임`, `분수`, `워프 마커`, `왕궁 상단 게이트`, `왕궁 접견실 배경`, `왕궁 핵심 NPC 대화 초상`, `전투 상단 HUD`, `아군/적 HP 프레임`, `패배 결과 프레임`은 적용 유지다.
- 반면 `마을 외벽 세트`, `전투 하단 커맨드 프레임`, `영문 버튼 시트`, `왕궁 런타임 NPC 시트`, 일부 파일명 불일치 자산은 그대로 쓰기 어렵다.

- applied:
- `04-lumen-fountain-base-remake.png` -> [fountain_base.png](/D:/dev/game307/public/assets/world/town/landmarks/fountain_base.png)
- `05-lumen-fountain-water-layer-remake.png` -> [fountain_water.png](/D:/dev/game307/public/assets/world/town/landmarks/fountain_water.png)
- `06-safe-warp-marker-remake.png` -> [warp_marker.png](/D:/dev/game307/public/assets/world/town/effects/warp_marker.png)
- `07-world-route-full-screen-background-replacement.png` -> [overview.png](/D:/dev/game307/public/assets/world/world-map/overview.png)
- `08-world-route-node-card-frame-sheet-1.png` -> [node_open.png](/D:/dev/game307/public/assets/world/world-map/node_open.png), [node_locked.png](/D:/dev/game307/public/assets/world/world-map/node_locked.png), [node_selected.png](/D:/dev/game307/public/assets/world/world-map/node_selected.png), [node_disabled.png](/D:/dev/game307/public/assets/world/world-map/node_disabled.png)
- `12-battle-top-hud-frame.png` -> [top_hud_frame.png](/D:/dev/game307/public/assets/ui/battle/top_hud_frame.png)
- `14-ally-hp-bar-frame-2.png` -> [ally_hp_frame.png](/D:/dev/game307/public/assets/ui/battle/ally_hp_frame.png)
- `15-enemy-hp-bar-frame.png` -> [enemy_hp_frame.png](/D:/dev/game307/public/assets/ui/battle/enemy_hp_frame.png)
- `17-battle-result-fail-frame-1.png` -> [result_fail_frame.png](/D:/dev/game307/public/assets/ui/battle/result_fail_frame.png)
- `19-lumen-palace-north-gate.png` -> [north_gate.png](/D:/dev/game307/public/assets/world/palace/north_gate.png)
- `21-lumen-palace-royal-audience-hall.png` -> [royal_audience_hall.png](/D:/dev/game307/public/assets/world/palace/royal_audience_hall.png)
- `24-palace-core-npc-dialogue-portrait-set.png` -> [king_aldren.png](/D:/dev/game307/public/assets/dialogue/npcs/king_aldren.png), [queen_regent_celestine.png](/D:/dev/game307/public/assets/dialogue/npcs/queen_regent_celestine.png), [captain_rowan.png](/D:/dev/game307/public/assets/dialogue/npcs/captain_rowan.png), [archivist_mirel.png](/D:/dev/game307/public/assets/dialogue/npcs/archivist_mirel.png)

- prepared_but_not_wired:
- `01-world-landmark-sheet-remake.png`
- `18-lumen-palace-exterior.png`
- `20-lumen-palace-outer-court-ground.png`
- `22-lumen-palace-throne-platform.png`
- `23-the-archive-corridor-inside-lumen-palace.png`
- 위 파일들은 잘라서 런타임 자산으로 생성해 두었지만, 현재 플레이 플로우에 바로 보이는 장면 슬롯이 없어 아직 화면 배치까지는 하지 않았다.

- held_or_rejected:
- `02-lumen-village-outer-wall-and-right-edge-stage-gate.png`
- 파일명과 실제 내용이 맞지 않는다. 현재 내용은 마을 외벽/오른쪽 게이트 세트가 아니라 랜드마크 시트 쪽에 가깝다.
- `03-lumen-plaza-ground-remake.png`
- 파일명은 광장 바닥이지만 실제 내용은 외벽 모듈 세트다. 상단 가로 벽 조각과 게이트 일부는 쓸 수 있으나, 좌/우/하단을 안정적으로 닫을 만큼의 `vertical / corner / bottom` 모듈 구성이 부족하다.
- `08-world-route-node-card-frame-sheet-2.png`
- `sheet-1`만으로 `open / locked / selected / disabled`가 충분히 구성돼서 이번 배치에서는 불필요했다.
- `09-english-primary-button-sheet-remake.png`
- 흐릿하고 텍스트 경계가 무너져 런타임 버튼으로 쓰기 어렵다.
- `10-english-utility-button-sheet-remake.png`
- `09`와 동일하게 선명도가 부족하다.
- `11-english-battle-button-sheet-remake.png`
- 이미지 품질 자체는 쓸 수 있지만, 버튼에 영문 문구가 직접 구워져 있어서 현재 다국어 언어팩 구조와 충돌한다.
- `13-battle-bottom-command-frame-1.png`
- `13-battle-bottom-command-frame-2.png`
- 하단 프레임이 아니라 버튼 시트 성격이다. 실제 전투 화면에 배경으로 깔면 버튼이 중복 렌더링된다.
- `16-battle-result-clear-frame.png`
- 전체가 흐려서 결과 화면 프레임으로 쓰기 어렵다.
- `25-palace-core-runtime-npc-sheet.png`
- 흐릿하고 고스트 잔상이 커서 런타임 NPC 스프라이트 시트로 불합격이다.

- current_issues_after_apply:
- 마을 외벽:
- 현재는 `03`에서 상단 일부와 게이트만 부분 활용 가능하다. `left / right / bottom / corner` 전용 성벽 세트가 추가로 필요하다.
- 월드맵:
- 새 배경과 노드 프레임은 적용됐다. 다만 일부 지역 프리뷰 이미지는 이전 배치 자산이라 색감이 떠 보이거나 품질이 고르지 않다.
- 왕궁:
- 접견실 배경과 왕실 대화 초상은 적용됐다. 하지만 `25`가 불합격이라 왕궁 NPC 런타임 스프라이트는 아직 임시 캐릭터를 쓰고 있다.
- 전투:
- 상단 HUD와 HP 프레임은 적용 유지다.
- 하단 커맨드 프레임은 버튼 중복이 생겨 적용 보류다.
- 전투 자체 배경/중앙 전장 패널은 이번 배치 범위 밖이라 기존 구조가 남아 있다.

- verification_artifacts:
- [village.png](/D:/dev/game307/output/manual-verify-2026-04-17-image-pass-4/village.png)
- [world-map.png](/D:/dev/game307/output/manual-verify-2026-04-17-image-pass-4/world-map.png)
- [palace.png](/D:/dev/game307/output/manual-verify-2026-04-17-image-pass-4/palace.png)
- [battle.png](/D:/dev/game307/output/manual-verify-2026-04-17-image-pass-4/battle.png)

