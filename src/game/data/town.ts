import { AtlasFrame } from './atlas';
import { LUMEN_PALACE_GATE } from './palace';

export interface RectBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export type TownShopId =
  | 'weapon_shop'
  | 'armor_shop'
  | 'item_shop'
  | 'forge_shop'
  | 'relic_shop';

export interface TownSpawnDefinition extends Point2D {
  id: string;
}

export interface TownBuildingDefinition {
  id: TownShopId;
  label: string;
  iconFrame: number;
  tint: number;
  body: RectBounds;
  roofHeight: number;
  door: Point2D;
  returnSpawnId: string;
  shopTitle: string;
  flavorText: string;
  npcName: string;
  npcGreeting: string;
}

export interface TownAmbientNpcDefinition {
  id: string;
  name: string;
  tint: number;
  greeting: string;
  patrol: Point2D[];
  speed: number;
  pauseMs: number;
  runtimeSubjectId?: string;
}

export interface TownStoryNpcDefinition {
  id: string;
  name: string;
  tint: number;
  greeting: string;
  position: Point2D;
  runtimeSubjectId: string;
}

export interface TownInteriorDefinition {
  id: TownShopId;
  title: string;
  npcName: string;
  greeting: string;
  flavorText: string;
  floorTint: number;
  wallTint: number;
  counterTint: number;
  iconFrame: number;
  returnSpawnId: string;
}

export const LUMEN_TOWN_BOUNDS = {
  width: 1536,
  height: 1184,
} as const;

export const LUMEN_PLAZA = {
  x: 560,
  y: 344,
  width: 416,
  height: 300,
} satisfies RectBounds;

export const LUMEN_FOUNTAIN = {
  x: 684,
  y: 404,
  width: 168,
  height: 168,
  centerX: 768,
  centerY: 488,
} as const;

export const LUMEN_WORLD_GATE = {
  x: 768,
  y: 1156,
  width: 200,
  height: 96,
  interactX: 768,
  interactY: 1060,
} as const;

export const LUMEN_SPAWNS: TownSpawnDefinition[] = [
  { id: 'default', x: 236, y: 988 },
  { id: 'starter_square', x: 828, y: 724 },
  { id: 'palace_gate', x: LUMEN_PALACE_GATE.interactX, y: LUMEN_PALACE_GATE.interactY + 70 },
  { id: 'world_gate', x: 768, y: 1022 },
  { id: 'world_gate_return', x: 768, y: 990 },
  { id: 'weapon_shop', x: 260, y: 650 },
  { id: 'armor_shop', x: 282, y: 1010 },
  { id: 'item_shop', x: 1260, y: 674 },
  { id: 'forge_shop', x: 1286, y: 982 },
  { id: 'relic_shop', x: 548, y: 806 },
  { id: 'market_lane', x: 1072, y: 540 },
  { id: 'archive_lane', x: 1018, y: 860 },
];

export const LUMEN_BUILDINGS: TownBuildingDefinition[] = [
  {
    id: 'weapon_shop',
    label: 'Weapon Shop',
    iconFrame: AtlasFrame.SwordIcon,
    tint: 0xb86f3b,
    body: { x: 142, y: 442, width: 236, height: 186 },
    roofHeight: 58,
    door: { x: 260, y: 628 },
    returnSpawnId: 'weapon_shop',
    shopTitle: 'Lumen Arms',
    flavorText: 'Blades, guard swords, and route-ready steel are lined up here before every sortie.',
    npcName: 'Orin',
    npcGreeting: 'If you plan to hold the road, start with a weapon that will not buckle first.',
  },
  {
    id: 'armor_shop',
    label: 'Armor Shop',
    iconFrame: AtlasFrame.HomeIcon,
    tint: 0x6c8bb5,
    body: { x: 160, y: 778, width: 244, height: 198 },
    roofHeight: 60,
    door: { x: 282, y: 976 },
    returnSpawnId: 'armor_shop',
    shopTitle: 'Bastion Ward',
    flavorText: 'Heavy mail, shields, and reinforced field gear for squads expected to survive the first hit.',
    npcName: 'Marta',
    npcGreeting: 'Steel on the outside buys the healer time. That is worth more than pride.',
  },
  {
    id: 'item_shop',
    label: 'Supply Shop',
    iconFrame: AtlasFrame.BagIcon,
    tint: 0x9b8750,
    body: { x: 1140, y: 490, width: 238, height: 182 },
    roofHeight: 56,
    door: { x: 1260, y: 672 },
    returnSpawnId: 'item_shop',
    shopTitle: 'Supply Counter',
    flavorText: 'Medicine, travel meals, and emergency route kits move through this counter every dawn.',
    npcName: 'Neri',
    npcGreeting: 'Potions left, field kits right, and no one leaves with an empty satchel.',
  },
  {
    id: 'forge_shop',
    label: 'Forge',
    iconFrame: AtlasFrame.StageNode,
    tint: 0x8c5e4f,
    body: { x: 1154, y: 760, width: 264, height: 208 },
    roofHeight: 68,
    door: { x: 1286, y: 968 },
    returnSpawnId: 'forge_shop',
    shopTitle: 'Ash Forge',
    flavorText: 'The forge handles repairs, route plates, and the ugly work left behind after battle.',
    npcName: 'Torren',
    npcGreeting: 'Show me what bent. I can tell where the next break will happen by the sound alone.',
  },
  {
    id: 'relic_shop',
    label: 'Relic Shop',
    iconFrame: AtlasFrame.Star,
    tint: 0x7e6ab7,
    body: { x: 416, y: 610, width: 264, height: 190 },
    roofHeight: 62,
    door: { x: 548, y: 800 },
    returnSpawnId: 'relic_shop',
    shopTitle: 'Quiet Relics',
    flavorText: 'Fragments, seals, and route echoes are handled behind curtains where fewer people can hear them.',
    npcName: 'Seline',
    npcGreeting: 'Some relics answer softly. The dangerous ones are usually the quietest.',
  },
];

export const LUMEN_AMBIENT_NPCS: TownAmbientNpcDefinition[] = [
  {
    id: 'guard_east',
    name: 'East Guard',
    tint: 0x5b76a8,
    greeting: 'The eastern lane is still open. If the squad goes out, they go out through us.',
    patrol: [
      { x: 1324, y: 514 },
      { x: 1402, y: 514 },
      { x: 1402, y: 592 },
      { x: 1324, y: 592 },
    ],
    speed: 46,
    pauseMs: 700,
    runtimeSubjectId: 'guard_east',
  },
  {
    id: 'villager_plaza',
    name: 'Plaza Villager',
    tint: 0x7d9c5f,
    greeting: 'The fountain square is where people wait when they need news before dawn.',
    patrol: [
      { x: 520, y: 520 },
      { x: 620, y: 604 },
      { x: 500, y: 682 },
      { x: 434, y: 584 },
    ],
    speed: 38,
    pauseMs: 900,
    runtimeSubjectId: 'villager_plaza',
  },
  {
    id: 'runner_lane',
    name: 'Route Runner',
    tint: 0xc17f58,
    greeting: 'If the route board changes, I am the one who has to run it to every gate post.',
    patrol: [
      { x: 312, y: 500 },
      { x: 632, y: 500 },
      { x: 944, y: 500 },
      { x: 1232, y: 500 },
      { x: 944, y: 500 },
      { x: 632, y: 500 },
    ],
    speed: 70,
    pauseMs: 250,
    runtimeSubjectId: 'runner_lane',
  },
  {
    id: 'child_south',
    name: 'South Ward Child',
    tint: 0xd3a65b,
    greeting: 'The forge is too loud. I like the fountain better.',
    patrol: [
      { x: 700, y: 748 },
      { x: 854, y: 748 },
      { x: 854, y: 846 },
      { x: 700, y: 846 },
    ],
    speed: 34,
    pauseMs: 1100,
    runtimeSubjectId: 'child_south',
  },
  {
    id: 'market_courier',
    name: 'Market Courier',
    tint: 0xc17f58,
    greeting: 'Supply wagons are being counted twice now. That only happens when the outer routes are unstable.',
    patrol: [
      { x: 1026, y: 596 },
      { x: 1184, y: 596 },
      { x: 1184, y: 690 },
      { x: 1026, y: 690 },
    ],
    speed: 42,
    pauseMs: 860,
    runtimeSubjectId: 'market_courier',
  },
  {
    id: 'garden_guard',
    name: 'South Guard',
    tint: 0x5b76a8,
    greeting: 'The lower ward is fuller than usual. Every spare yard is turning into a shelter lane.',
    patrol: [
      { x: 420, y: 930 },
      { x: 560, y: 930 },
      { x: 560, y: 1040 },
      { x: 420, y: 1040 },
    ],
    speed: 36,
    pauseMs: 900,
    runtimeSubjectId: 'garden_guard',
  },
  {
    id: 'plaza_bard',
    name: 'Square Bard',
    tint: 0xd3a65b,
    greeting: 'Every town sounds different when it is scared. Lumen has started humming instead of shouting.',
    patrol: [
      { x: 946, y: 548 },
      { x: 1032, y: 548 },
      { x: 1032, y: 628 },
      { x: 946, y: 628 },
    ],
    speed: 26,
    pauseMs: 1200,
    runtimeSubjectId: 'plaza_bard',
  },
  {
    id: 'dock_loader',
    name: 'Dock Loader',
    tint: 0x8bb296,
    greeting: 'People keep saying the coast is farther away than it feels. That usually means trouble is moving.',
    patrol: [
      { x: 1180, y: 908 },
      { x: 1332, y: 908 },
      { x: 1332, y: 1020 },
      { x: 1180, y: 1020 },
    ],
    speed: 32,
    pauseMs: 1100,
    runtimeSubjectId: 'dock_loader',
  },
  {
    id: 'rookie_sentry',
    name: 'Rookie Sentry',
    tint: 0x89a9d8,
    greeting: 'Captain Ysold says even quiet days count as route duty now.',
    patrol: [
      { x: 602, y: 404 },
      { x: 704, y: 404 },
      { x: 704, y: 462 },
      { x: 602, y: 462 },
    ],
    speed: 34,
    pauseMs: 800,
    runtimeSubjectId: 'rookie_sentry',
  },
];

export const LUMEN_STORY_NPCS: TownStoryNpcDefinition[] = [
  {
    id: 'elder_haru',
    name: 'Mayor Haru',
    tint: 0x9dbe7d,
    greeting: 'If the road opens, the village lives. If it closes, we starve behind the wall.',
    position: { x: 536, y: 776 },
    runtimeSubjectId: 'elder_haru',
  },
  {
    id: 'bram_recruit',
    name: 'Bram',
    tint: 0x8ca5c9,
    greeting: 'No one should step onto the route alone while the gate is this unstable.',
    position: { x: 902, y: 724 },
    runtimeSubjectId: 'bram_recruit',
  },
  {
    id: 'scribe_len',
    name: 'Scribe Len',
    tint: 0x8bb296,
    greeting: 'Routes, names, ration tallies, fragment rumors. I keep the town breathing on paper.',
    position: { x: 1010, y: 860 },
    runtimeSubjectId: 'scribe_len',
  },
  {
    id: 'captain_ysold',
    name: 'Captain Ysold',
    tint: 0x6b8db5,
    greeting: 'The palace watches the roads more closely now. Every unlocked route changes the whole town.',
    position: { x: 920, y: 424 },
    runtimeSubjectId: 'captain_ysold',
  },
  {
    id: 'quartermaster_dina',
    name: 'Quartermaster Dina',
    tint: 0xc79b5c,
    greeting: 'If the squad wins a route, I am the one who decides which wagons can move through it first.',
    position: { x: 1060, y: 608 },
    runtimeSubjectId: 'quartermaster_dina',
  },
];

export const LUMEN_STATIC_BLOCKERS: RectBounds[] = [
  { x: 0, y: 0, width: 92, height: 1184 },
  { x: 0, y: 0, width: 1536, height: 160 },
  { x: 0, y: 1088, width: 1536, height: 96 },
  { x: 1444, y: 0, width: 92, height: 1184 },
  { x: 508, y: 160, width: 520, height: 122 },
  { x: 694, y: 446, width: 148, height: 112 },
  { x: 166, y: 450, width: 188, height: 150 },
  { x: 184, y: 780, width: 190, height: 162 },
  { x: 1164, y: 498, width: 188, height: 148 },
  { x: 1184, y: 770, width: 204, height: 166 },
  { x: 446, y: 638, width: 204, height: 126 },
];

export const LUMEN_INTERIORS: Record<TownShopId, TownInteriorDefinition> = {
  weapon_shop: {
    id: 'weapon_shop',
    title: 'Weapon Shop Interior',
    npcName: 'Orin',
    greeting: 'The route eats weak steel first. Pick something you can trust.',
    flavorText: 'A narrow room packed with blades, braces, and sortie steel.',
    floorTint: 0x74583f,
    wallTint: 0x4a3828,
    counterTint: 0x8b6a4e,
    iconFrame: AtlasFrame.SwordIcon,
    returnSpawnId: 'weapon_shop',
  },
  armor_shop: {
    id: 'armor_shop',
    title: 'Armor Shop Interior',
    npcName: 'Marta',
    greeting: 'Take the hit on iron instead of bone. That is what armor is for.',
    flavorText: 'Hooks, shields, and plate racks fill the front of the ward room.',
    floorTint: 0x66615e,
    wallTint: 0x3f3f46,
    counterTint: 0x79818c,
    iconFrame: AtlasFrame.HomeIcon,
    returnSpawnId: 'armor_shop',
  },
  item_shop: {
    id: 'item_shop',
    title: 'Supply Shop Interior',
    npcName: 'Neri',
    greeting: 'Potions left, meal packs right, and field kits by the crate.',
    flavorText: 'Everything is packed to move fast, because the road rarely waits.',
    floorTint: 0x85754d,
    wallTint: 0x5e4b31,
    counterTint: 0xa28958,
    iconFrame: AtlasFrame.BagIcon,
    returnSpawnId: 'item_shop',
  },
  forge_shop: {
    id: 'forge_shop',
    title: 'Forge Interior',
    npcName: 'Torren',
    greeting: 'Bring me the bent gear first. I can hear the next crack before I see it.',
    flavorText: 'Heat, tools, and route salvage cover every work surface in the forge.',
    floorTint: 0x5d5049,
    wallTint: 0x3d312e,
    counterTint: 0x8a6956,
    iconFrame: AtlasFrame.StageNode,
    returnSpawnId: 'forge_shop',
  },
  relic_shop: {
    id: 'relic_shop',
    title: 'Relic Shop Interior',
    npcName: 'Seline',
    greeting: 'The quieter the relic, the more carefully you should listen to it.',
    flavorText: 'A dim room of seals, fragment cases, and strange route echoes.',
    floorTint: 0x57466c,
    wallTint: 0x33294b,
    counterTint: 0x6e5f8c,
    iconFrame: AtlasFrame.Star,
    returnSpawnId: 'relic_shop',
  },
};

export function getTownSpawnDefinition(spawnId: string | undefined): TownSpawnDefinition {
  return LUMEN_SPAWNS.find((entry) => entry.id === spawnId) ?? LUMEN_SPAWNS[0];
}

export function getTownBuilding(shopId: TownShopId): TownBuildingDefinition {
  return LUMEN_BUILDINGS.find((entry) => entry.id === shopId) ?? LUMEN_BUILDINGS[0];
}

export function getTownInterior(shopId: TownShopId | undefined): TownInteriorDefinition {
  return LUMEN_INTERIORS[shopId ?? 'item_shop'] ?? LUMEN_INTERIORS.item_shop;
}
