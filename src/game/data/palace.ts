import type { DialogueLine } from '../types';

export interface PalaceNpcDefinition {
  id: string;
  name: string;
  x: number;
  y: number;
  tint: number;
}

export const LUMEN_PALACE_ROOM = {
  width: 1184,
  height: 864,
} as const;

export const LUMEN_PALACE_EXIT = {
  x: 592,
  y: 786,
  interactX: 592,
  interactY: 772,
} as const;

export const LUMEN_PALACE_GATE = {
  x: 768,
  y: 216,
  interactX: 768,
  interactY: 318,
} as const;

export const LUMEN_PALACE_NPCS: PalaceNpcDefinition[] = [
  { id: 'king_aldren', name: 'King Aldren', x: 592, y: 322, tint: 0xc8b47b },
  { id: 'queen_regent_celestine', name: 'Queen Regent Celestine', x: 744, y: 418, tint: 0xb09be3 },
  { id: 'captain_rowan', name: 'Captain Rowan', x: 430, y: 430, tint: 0x89a9d8 },
  { id: 'archivist_mirel', name: 'Archivist Mirel', x: 900, y: 520, tint: 0x8bb296 },
  { id: 'chamberlain_orla', name: 'Chamberlain Orla', x: 272, y: 548, tint: 0xd3a65b },
  { id: 'sanctum_knight', name: 'Sanctum Knight', x: 912, y: 376, tint: 0x80a7c9 },
] as const;

const PALACE_NPC_RUNTIME_SUBJECTS: Record<string, string> = {
  king_aldren: 'king_aldren',
  queen_regent_celestine: 'queen_regent_celestine',
  captain_rowan: 'captain_rowan',
  archivist_mirel: 'archivist_mirel',
  chamberlain_orla: 'chamberlain_orla',
  sanctum_knight: 'sanctum_knight',
};

export function getPalaceNpc(npcId: string): PalaceNpcDefinition | null {
  return LUMEN_PALACE_NPCS.find((entry) => entry.id === npcId) ?? null;
}

export function getPalaceNpcFallbackName(npcId: string): string {
  return getPalaceNpc(npcId)?.name ?? 'Palace Attendant';
}

export function getPalaceNpcRuntimeSubjectId(npcId: string): string {
  return PALACE_NPC_RUNTIME_SUBJECTS[npcId] ?? 'villager';
}

export function getPalaceStoryTier(unlockedContinents: readonly string[]): number {
  const unlockedCount = unlockedContinents.filter((entry) => entry.startsWith('continent_')).length;

  if (unlockedCount >= 6) {
    return 3;
  }

  if (unlockedCount >= 4) {
    return 2;
  }

  if (unlockedCount >= 2) {
    return 1;
  }

  return 0;
}

export function getPalaceArrivalLine(storyTier: number): DialogueLine {
  switch (storyTier) {
    case 3:
      return buildLine('king_aldren', 'The palace has stopped whispering. Everyone here knows the final road is open.');
    case 2:
      return buildLine('queen_regent_celestine', 'Court order is fraying. The more routes you clear, the more the palace starts reacting to you.');
    case 1:
      return buildLine('captain_rowan', 'The watch has doubled on every northern gate. What changed outside is reaching the throne room.');
    default:
      return buildLine('king_aldren', 'Lumen does not survive on walls alone. It survives when someone can still reopen the road.');
  }
}

export function getPalaceDialogue(npcId: string, storyTier: number): DialogueLine[] {
  switch (npcId) {
    case 'king_aldren':
      return storyTier >= 3
        ? [
            buildLine('king_aldren', 'The last fragment matters less than the choice it will force on everyone who follows you.'),
            buildLine('king_aldren', 'Finish the road first. Let the throne answer after the truth is in front of us.'),
          ]
        : storyTier >= 1
          ? [
              buildLine('king_aldren', 'Every route you reclaim shifts the balance inside this hall.'),
              buildLine('king_aldren', 'Keep opening the roads. The palace can endure pressure longer than a starving village can.'),
            ]
          : [
              buildLine('king_aldren', 'People remember swords. I remember who keeps the roads from breaking.'),
              buildLine('king_aldren', 'If Lumen breathes again, it will be because your squad kept one route alive at a time.'),
            ];
    case 'queen_regent_celestine':
      return storyTier >= 2
        ? [
            buildLine('queen_regent_celestine', 'Fear spreads faster than supplies. That is why every road you clear changes the mood of the court.'),
            buildLine('queen_regent_celestine', 'Bring us proof before panic writes its own history.'),
          ]
        : [
            buildLine('queen_regent_celestine', 'Order is fragile when every messenger arrives with different numbers.'),
            buildLine('queen_regent_celestine', 'If the squad can steady the routes, the palace can steady the city.'),
          ];
    case 'captain_rowan':
      return storyTier >= 1
        ? [
            buildLine('captain_rowan', 'The enemy does not need to break the palace walls if it can poison the roads first.'),
            buildLine('captain_rowan', 'Your squad is buying us time. Do not waste it on sloppy movement.'),
          ]
        : [
            buildLine('captain_rowan', 'The palace gate is not the front line. The roads are.'),
            buildLine('captain_rowan', 'If you march, march with a reason and a fallback route.'),
          ];
    case 'archivist_mirel':
      return storyTier >= 2
        ? [
            buildLine('archivist_mirel', 'Old records and fresh route logs have started matching in ways I do not like.'),
            buildLine('archivist_mirel', 'Whatever woke beneath the fragments was planned long before this war reached us.'),
          ]
        : [
            buildLine('archivist_mirel', 'Archives remember failures better than victories. That is why they are useful.'),
            buildLine('archivist_mirel', 'If you want the truth, follow the records no one wanted to keep.'),
          ];
    case 'chamberlain_orla':
      return [
        buildLine('chamberlain_orla', storyTier >= 2
          ? 'Every messenger now carries route news before court notices. That is how I know the town has changed.'
          : 'When the throne room grows quiet, it usually means the town is carrying the real burden outside.'),
        buildLine('chamberlain_orla', storyTier >= 2
          ? 'The court is learning to wait for your reports before it decides what kind of fear to wear.'
          : 'Keep the road alive long enough and even palace people start remembering what villages are for.'),
      ];
    case 'sanctum_knight':
      return [
        buildLine('sanctum_knight', storyTier >= 3
          ? 'If the final route opens, the palace guard marches after you, not before you.'
          : 'We hold the hall. You hold the road. That division is all that keeps Lumen standing.'),
        buildLine('sanctum_knight', storyTier >= 3
          ? 'Say the word when the gate must move. We are done pretending this war stops at the stair.'
          : 'Come back alive. The court only understands courage after someone survives it.'),
      ];
    default:
      return [buildLine('captain_rowan', 'Keep moving. The palace feels every route you unlock.')];
  }
}

function buildLine(npcId: string, text: string): DialogueLine {
  const npc = getPalaceNpc(npcId);
  return {
    speaker: {
      category: 'npc',
      subjectId: npcId,
      name: npc?.name ?? 'Palace Attendant',
    },
    text,
  };
}
