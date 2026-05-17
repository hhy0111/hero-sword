# STAGE_RECRUIT_EVENTS.md

## Purpose

This document defines the non-gacha companion joins that trigger on stage clear.
Each join is a story event, not a random reward.

## Rules

- Trigger only on the first clear of the mapped stage.
- If the character is already owned, do not trigger the join event again.
- Result scene must show a bottom dialogue event before normal result flow resumes.
- After the final recruitment dialogue line, Result scene shows a spinning character card flying into the center, then an explicit acquisition message.
- Dialogue uses the same portrait box format as town conversations.

## Event List

| Stage ID | Companion | Why They Join |
| --- | --- | --- |
| `stage_01_06` | `Ria` | The bridge evacuation proves the party needs a field medic who can move with the frontline. |
| `stage_01_18` | `Theo` | Theo trusts the party after the plains fragment fight and joins to guide the next routes. |
| `stage_02_04` | `Dorgan` | The mine route breach convinces Dorgan to reclaim the forge lanes in person. |
| `stage_02_11` | `Kiera` | The convoy defense proves the party can protect an artillery engineer in active combat. |
| `stage_02_18` | `Helma` | The fragment reacts to Helma's rune work, so she travels with the only group still making progress. |
| `stage_03_05` | `Marin` | The harbor rescue earns the trust of the local spear line. |
| `stage_03_15` | `Serena` | The sea shrine purge makes it clear the coast cannot be protected from a safe ritual hall. |
| `stage_03_18` | `Fin` | The rescue route needs a navigator-gunner who can keep the escape corridor open. |
| `stage_04_05` | `Iris` | The memorial defense proves the party is fighting for people, not just fragments. |
| `stage_04_08` | `Wolf` | Wolf respects a group that survives a direct heavy clash instead of stalling behind cover. |
| `stage_04_18` | `Erin` | The archive recovery ties the fragment trail to records only Erin can decode quickly. |
| `stage_05_05` | `Nazir` | The trade-route defense pulls Nazir into the campaign against the raiders controlling the road. |
| `stage_05_07` | `Laila` | The ruin search reveals fragment clues Laila cannot afford to study from a rear camp. |
| `stage_05_18` | `Hakan` | The reclaimed desert line needs a sentinel who can move with the strike force. |
| `stage_06_06` | `Seraphin` | The sacred defense line proves the final campaign needs a paladin on the road, not at the wall. |
| `stage_06_12` | `Micaela` | The relay restoration means healing support now has to move with the assault team. |
| `stage_06_23` | `Lucian` | Lucian already has the enemy route traced and joins for the final internal strike. |

## Runtime Source

- Code source: [stageRecruitEvents.ts](/D:/dev/game307/src/game/data/stageRecruitEvents.ts)
- Result scene presentation: [ResultScene.ts](/D:/dev/game307/src/game/scenes/ResultScene.ts)
