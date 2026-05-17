import type { DialogueLine, SaveSnapshot } from '../types';

export interface StageRecruitmentEvent {
  stageId: string;
  characterId: string;
  characterName: string;
  reason: string;
  lines: DialogueLine[];
}

const STAGE_RECRUIT_EVENTS: StageRecruitmentEvent[] = [
  {
    stageId: 'stage_01_06',
    characterId: 'ria',
    characterName: 'Ria',
    reason: 'Ria joins after the bridge evacuation because the frontline needs a medic who can move with the squad.',
    lines: [
      {
        speaker: { category: 'character', subjectId: 'hero', name: 'Kain' },
        text: 'The evac lane is open. We can get the wounded back to town now.',
      },
      {
        speaker: { category: 'character', subjectId: 'ria', name: 'Ria' },
        text: 'Then I am not staying behind. Your route keeps finding the worst places to bleed out.',
      },
      {
        speaker: { category: 'character', subjectId: 'ria', name: 'Ria' },
        text: 'I will walk with your team and keep them standing until the plains are stable again.',
      },
    ],
  },
  {
    stageId: 'stage_01_18',
    characterId: 'theo',
    characterName: 'Theo',
    reason: 'Theo joins after the first fragment boss because he trusts the party to push beyond the plains and needs to guide them forward.',
    lines: [
      {
        speaker: { category: 'character', subjectId: 'theo', name: 'Theo' },
        text: 'You broke the plains front faster than the scouts predicted.',
      },
      {
        speaker: { category: 'character', subjectId: 'hero', name: 'Kain' },
        text: 'Then stop scouting from the fence line and guide us to the next breach.',
      },
      {
        speaker: { category: 'character', subjectId: 'theo', name: 'Theo' },
        text: 'Fine. I will join the march. Someone has to keep this route clean and readable.',
      },
    ],
  },
  {
    stageId: 'stage_02_04',
    characterId: 'dorgan',
    characterName: 'Dorgan',
    reason: 'Dorgan joins to reclaim the forge lanes after the enemy mine route is broken open.',
    lines: [
      {
        speaker: { category: 'character', subjectId: 'dorgan', name: 'Dorgan' },
        text: 'That tunnel was feeding iron straight into enemy hands.',
      },
      {
        speaker: { category: 'character', subjectId: 'hero', name: 'Kain' },
        text: 'Then come with us and help shut the rest of the line down.',
      },
      {
        speaker: { category: 'character', subjectId: 'dorgan', name: 'Dorgan' },
        text: 'Gladly. I would rather swing for the forge than watch it disappear piece by piece.',
      },
    ],
  },
  {
    stageId: 'stage_02_11',
    characterId: 'kiera',
    characterName: 'Kiera',
    reason: 'Kiera joins after the convoy defense because the party proves it can protect an artillery specialist in the field.',
    lines: [
      {
        speaker: { category: 'character', subjectId: 'kiera', name: 'Kiera' },
        text: 'Most escorts panic when the carts start burning. You did not.',
      },
      {
        speaker: { category: 'character', subjectId: 'hero', name: 'Kain' },
        text: 'Keep the cannon working and we will keep the line open.',
      },
      {
        speaker: { category: 'character', subjectId: 'kiera', name: 'Kiera' },
        text: 'Deal. I am joining your party. My firepower should not stay tied to one convoy.',
      },
    ],
  },
  {
    stageId: 'stage_02_18',
    characterId: 'helma',
    characterName: 'Helma',
    reason: 'Helma joins when the fragment reacts to her rune work and she decides to travel with the one group still making progress.',
    lines: [
      {
        speaker: { category: 'character', subjectId: 'helma', name: 'Helma' },
        text: 'The fragment answered your strike pattern and my runes at the same time.',
      },
      {
        speaker: { category: 'character', subjectId: 'hero', name: 'Kain' },
        text: 'Then we need both of them moving in the same direction.',
      },
      {
        speaker: { category: 'character', subjectId: 'helma', name: 'Helma' },
        text: 'Agreed. I will carry the rune rig and travel with your squad from here on.',
      },
    ],
  },
  {
    stageId: 'stage_03_05',
    characterId: 'marin',
    characterName: 'Marin',
    reason: 'Marin joins after the harbor breakwater rescue because the party earns the trust of the local spear line.',
    lines: [
      {
        speaker: { category: 'character', subjectId: 'marin', name: 'Marin' },
        text: 'You did not run when the breakwater started collapsing. That matters here.',
      },
      {
        speaker: { category: 'character', subjectId: 'hero', name: 'Kain' },
        text: 'Then stand with us and we will keep the coast from folding.',
      },
      {
        speaker: { category: 'character', subjectId: 'marin', name: 'Marin' },
        text: 'Done. I will take point on the next push.',
      },
    ],
  },
  {
    stageId: 'stage_03_15',
    characterId: 'serena',
    characterName: 'Serena',
    reason: 'Serena joins after the sea shrine purge because she can no longer protect the coast by staying inside the ritual hall.',
    lines: [
      {
        speaker: { category: 'character', subjectId: 'serena', name: 'Serena' },
        text: 'The shrine is breathing again, but the corruption came from farther out.',
      },
      {
        speaker: { category: 'character', subjectId: 'hero', name: 'Kain' },
        text: 'Then come with us and cut the source out at sea.',
      },
      {
        speaker: { category: 'character', subjectId: 'serena', name: 'Serena' },
        text: 'I will. A healer who stays behind cannot protect the tide routes for long.',
      },
    ],
  },
  {
    stageId: 'stage_03_18',
    characterId: 'fin',
    characterName: 'Fin',
    reason: 'Fin joins after the timed rescue because the route needs a navigator-gunner who can keep the escape corridor open.',
    lines: [
      {
        speaker: { category: 'character', subjectId: 'fin', name: 'Fin' },
        text: 'You made that escape lane look almost organized.',
      },
      {
        speaker: { category: 'character', subjectId: 'hero', name: 'Kain' },
        text: 'Make it real, then. We need a shot caller who can read the coast on the move.',
      },
      {
        speaker: { category: 'character', subjectId: 'fin', name: 'Fin' },
        text: 'Now that sounds useful. I am in.',
      },
    ],
  },
  {
    stageId: 'stage_04_05',
    characterId: 'iris',
    characterName: 'Iris',
    reason: 'Iris joins after the memorial defense because the party proves it is fighting for the fallen, not just for fragments.',
    lines: [
      {
        speaker: { category: 'character', subjectId: 'iris', name: 'Iris' },
        text: 'You defended the memorial line instead of rushing the easier route.',
      },
      {
        speaker: { category: 'character', subjectId: 'hero', name: 'Kain' },
        text: 'If we abandon the dead, we lose the living next.',
      },
      {
        speaker: { category: 'character', subjectId: 'iris', name: 'Iris' },
        text: 'That answer is enough. I will join you and carry this front properly.',
      },
    ],
  },
  {
    stageId: 'stage_04_08',
    characterId: 'wolf',
    characterName: 'Wolf',
    reason: 'Wolf joins after a direct boss clash because he respects a party that survives head-on pressure instead of hiding behind walls.',
    lines: [
      {
        speaker: { category: 'character', subjectId: 'wolf', name: 'Wolf' },
        text: 'Most squads talk big until the first heavy swing lands. Yours stayed in range.',
      },
      {
        speaker: { category: 'character', subjectId: 'hero', name: 'Kain' },
        text: 'Then stop measuring us from a distance and hit with us.',
      },
      {
        speaker: { category: 'character', subjectId: 'wolf', name: 'Wolf' },
        text: 'Gladly. I wanted a harder fight anyway.',
      },
    ],
  },
  {
    stageId: 'stage_04_18',
    characterId: 'erin',
    characterName: 'Erin',
    reason: 'Erin joins after the archive recovery because the fragment trail is now tied to lost records only she can decode quickly.',
    lines: [
      {
        speaker: { category: 'character', subjectId: 'erin', name: 'Erin' },
        text: 'These records were not meant to leave the archive, but neither were the fragment routes.',
      },
      {
        speaker: { category: 'character', subjectId: 'hero', name: 'Kain' },
        text: 'Then bring the archive with you. We need answers before the next gate opens.',
      },
      {
        speaker: { category: 'character', subjectId: 'erin', name: 'Erin' },
        text: 'Understood. I will travel with the party and translate what the enemy buried.',
      },
    ],
  },
  {
    stageId: 'stage_05_05',
    characterId: 'nazir',
    characterName: 'Nazir',
    reason: 'Nazir joins after the trade-route defense because he refuses to let the desert roads fall under raider control again.',
    lines: [
      {
        speaker: { category: 'character', subjectId: 'nazir', name: 'Nazir' },
        text: 'That caravan line is the only honest road left in this region.',
      },
      {
        speaker: { category: 'character', subjectId: 'hero', name: 'Kain' },
        text: 'Then help us keep it alive and cut the raiders off at the source.',
      },
      {
        speaker: { category: 'character', subjectId: 'nazir', name: 'Nazir' },
        text: 'I was going to hunt them anyway. Working with your squad just makes it faster.',
      },
    ],
  },
  {
    stageId: 'stage_05_07',
    characterId: 'laila',
    characterName: 'Laila',
    reason: 'Laila joins after the relic search because the party uncovers fragment clues she cannot afford to study from a safe camp.',
    lines: [
      {
        speaker: { category: 'character', subjectId: 'laila', name: 'Laila' },
        text: 'The ruin marks match fragment theory, but only in pieces.',
      },
      {
        speaker: { category: 'character', subjectId: 'hero', name: 'Kain' },
        text: 'Then stay close and read the next piece before the enemy does.',
      },
      {
        speaker: { category: 'character', subjectId: 'laila', name: 'Laila' },
        text: 'That is exactly why I am joining you. Field research beats another dead archive.',
      },
    ],
  },
  {
    stageId: 'stage_05_18',
    characterId: 'hakan',
    characterName: 'Hakan',
    reason: 'Hakan joins after the desert union boss is broken because the route needs a sentinel who can hold the reclaimed line.',
    lines: [
      {
        speaker: { category: 'character', subjectId: 'hakan', name: 'Hakan' },
        text: 'The line is open, but it will collapse again if no one holds it tomorrow.',
      },
      {
        speaker: { category: 'character', subjectId: 'hero', name: 'Kain' },
        text: 'Hold it with us. We are not stopping in the desert.',
      },
      {
        speaker: { category: 'character', subjectId: 'hakan', name: 'Hakan' },
        text: 'Good. I prefer a moving front to another static watch post.',
      },
    ],
  },
  {
    stageId: 'stage_06_06',
    characterId: 'seraphin',
    characterName: 'Seraphin',
    reason: 'Seraphin joins after the sacred recovery line is defended because the final campaign needs a paladin who will move instead of just guarding ruins.',
    lines: [
      {
        speaker: { category: 'character', subjectId: 'seraphin', name: 'Seraphin' },
        text: 'You held a sacred line without turning it into a tomb.',
      },
      {
        speaker: { category: 'character', subjectId: 'hero', name: 'Kain' },
        text: 'Then march with us and help finish the route before the holy city falls for good.',
      },
      {
        speaker: { category: 'character', subjectId: 'seraphin', name: 'Seraphin' },
        text: 'I will. This is no longer a wall to defend. It is a road to reclaim.',
      },
    ],
  },
  {
    stageId: 'stage_06_12',
    characterId: 'micaela',
    characterName: 'Micaela',
    reason: 'Micaela joins after the fragment relay is restored because the wounded and the choir routes now move with the strike team.',
    lines: [
      {
        speaker: { category: 'character', subjectId: 'micaela', name: 'Micaela' },
        text: 'The relay sings again, but the wounded are still following your path.',
      },
      {
        speaker: { category: 'character', subjectId: 'hero', name: 'Kain' },
        text: 'Then stay with the path. We will need healing where the city breaks hardest.',
      },
      {
        speaker: { category: 'character', subjectId: 'micaela', name: 'Micaela' },
        text: 'Understood. I will carry the choir rites with your party.',
      },
    ],
  },
  {
    stageId: 'stage_06_23',
    characterId: 'lucian',
    characterName: 'Lucian',
    reason: 'Lucian joins before the final advance because he has already traced the enemy movement pattern and needs the party to finish the hunt.',
    lines: [
      {
        speaker: { category: 'character', subjectId: 'lucian', name: 'Lucian' },
        text: 'I tracked the Black Moon patrol line. It ends at your final breach route.',
      },
      {
        speaker: { category: 'character', subjectId: 'hero', name: 'Kain' },
        text: 'Then stop shadowing us and strike from inside the formation.',
      },
      {
        speaker: { category: 'character', subjectId: 'lucian', name: 'Lucian' },
        text: 'Fine. I will join the party for the last push. No more separate trails.',
      },
    ],
  },
];

const STAGE_RECRUITMENT_MAP = new Map(STAGE_RECRUIT_EVENTS.map((event) => [event.stageId, event]));

export function getStageRecruitmentEvents(): StageRecruitmentEvent[] {
  return STAGE_RECRUIT_EVENTS;
}

export function getStageRecruitmentEvent(stageId: string): StageRecruitmentEvent | null {
  return STAGE_RECRUITMENT_MAP.get(stageId) ?? null;
}

export function applyStageRecruitmentReward(
  snapshot: SaveSnapshot,
  stageId: string,
  now: number,
): { snapshot: SaveSnapshot; event: StageRecruitmentEvent | null } {
  const event = getStageRecruitmentEvent(stageId);

  if (!event) {
    return { snapshot, event: null };
  }

  const currentCopies = snapshot.roster.ownedCharacters[event.characterId]?.copies ?? 0;
  if (currentCopies > 0) {
    return { snapshot, event: null };
  }

  return {
    snapshot: {
      ...snapshot,
      updatedAt: now,
      roster: {
        ...snapshot.roster,
        ownedCharacters: {
          ...snapshot.roster.ownedCharacters,
          [event.characterId]: { copies: 1 },
        },
      },
    },
    event,
  };
}
