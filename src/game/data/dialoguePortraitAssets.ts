import type { DialogueSpeakerCategory } from '../types';

export interface DialoguePortraitAsset {
  key: string;
  path: string;
}

const CHARACTER_DIALOGUE_PORTRAIT_KEYS = {
  hero: 'dialogue:character:hero',
  bram: 'dialogue:character:bram',
  sera: 'dialogue:character:sera',
  luna: 'dialogue:character:luna',
  ria: 'dialogue:character:ria',
  theo: 'dialogue:character:theo',
  dorgan: 'dialogue:character:dorgan',
  kiera: 'dialogue:character:kiera',
  helma: 'dialogue:character:helma',
  marin: 'dialogue:character:marin',
  serena: 'dialogue:character:serena',
  fin: 'dialogue:character:fin',
  iris: 'dialogue:character:iris',
  wolf: 'dialogue:character:wolf',
  erin: 'dialogue:character:erin',
  nazir: 'dialogue:character:nazir',
  laila: 'dialogue:character:laila',
  hakan: 'dialogue:character:hakan',
  seraphin: 'dialogue:character:seraphin',
  micaela: 'dialogue:character:micaela',
  lucian: 'dialogue:character:lucian',
} as const;

const NPC_DIALOGUE_PORTRAIT_KEYS = {
  orin: 'dialogue:npc:orin',
  marta: 'dialogue:npc:marta',
  neri: 'dialogue:npc:neri',
  torren: 'dialogue:npc:torren',
  seline: 'dialogue:npc:seline',
  elder_haru: 'dialogue:npc:elder-haru',
  bram_recruit: 'dialogue:npc:bram-recruit',
  scribe_len: 'dialogue:npc:scribe-len',
  captain_ysold: 'dialogue:npc:captain-ysold',
  quartermaster_dina: 'dialogue:npc:quartermaster-dina',
  guard_east: 'dialogue:npc:guard-east',
  villager_plaza: 'dialogue:npc:villager-plaza',
  runner_lane: 'dialogue:npc:runner-lane',
  child_south: 'dialogue:npc:child-south',
  market_courier: 'dialogue:npc:market-courier',
  garden_guard: 'dialogue:npc:garden-guard',
  plaza_bard: 'dialogue:npc:plaza-bard',
  dock_loader: 'dialogue:npc:dock-loader',
  rookie_sentry: 'dialogue:npc:rookie-sentry',
  king_aldren: 'dialogue:npc:king-aldren',
  queen_regent_celestine: 'dialogue:npc:queen-regent-celestine',
  captain_rowan: 'dialogue:npc:captain-rowan',
  archivist_mirel: 'dialogue:npc:archivist-mirel',
  chamberlain_orla: 'dialogue:npc:chamberlain-orla',
  sanctum_knight: 'dialogue:npc:sanctum-knight',
  archive_aide: 'dialogue:npc:archive-aide',
  garden_caretaker: 'dialogue:npc:garden-caretaker',
  lantern_keeper: 'dialogue:npc:lantern-keeper',
  gate_clerk: 'dialogue:npc:gate-clerk',
  traveling_healer: 'dialogue:npc:traveling-healer',
  fountain_vendor: 'dialogue:npc:fountain-vendor',
  forge_apprentice: 'dialogue:npc:forge-apprentice',
  armor_fitter: 'dialogue:npc:armor-fitter',
  relic_custodian: 'dialogue:npc:relic-custodian',
  palace_page: 'dialogue:npc:palace-page',
  royal_cook: 'dialogue:npc:royal-cook',
  weapon_merchant: 'dialogue:npc:weapon-merchant',
  armor_merchant: 'dialogue:npc:armor-merchant',
  item_merchant: 'dialogue:npc:item-merchant',
  relic_merchant: 'dialogue:npc:relic-merchant',
  blacksmith: 'dialogue:npc:blacksmith',
} as const;

const ENEMY_DIALOGUE_PORTRAIT_KEYS = {
  greenhaven_fragment_lord: 'dialogue:enemy:greenhaven-fragment-lord',
  ironreach_rebel_captain: 'dialogue:enemy:ironreach-rebel-captain',
  blueharbor_tide_cult_guardian: 'dialogue:enemy:blueharbor-tide-cult-guardian',
  frost_grave_commander: 'dialogue:enemy:frost-grave-commander',
  solkazar_relic_tyrant: 'dialogue:enemy:solkazar-relic-tyrant',
  black_moon_inquisitor: 'dialogue:enemy:black-moon-inquisitor',
  black_gate_warlord: 'dialogue:enemy:black-gate-warlord',
} as const;

export const DIALOGUE_PORTRAIT_ASSETS: readonly DialoguePortraitAsset[] = [
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.hero, path: 'assets/dialogue/characters/hero.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.bram, path: 'assets/dialogue/characters/bram.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.sera, path: 'assets/dialogue/characters/sera.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.luna, path: 'assets/dialogue/characters/luna.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.ria, path: 'assets/dialogue/characters/ria.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.theo, path: 'assets/dialogue/characters/theo.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.dorgan, path: 'assets/dialogue/characters/dorgan.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.kiera, path: 'assets/dialogue/characters/kiera.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.helma, path: 'assets/dialogue/characters/helma.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.marin, path: 'assets/dialogue/characters/marin.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.serena, path: 'assets/dialogue/characters/serena.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.fin, path: 'assets/dialogue/characters/fin.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.iris, path: 'assets/dialogue/characters/iris.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.wolf, path: 'assets/dialogue/characters/wolf.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.erin, path: 'assets/dialogue/characters/erin.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.nazir, path: 'assets/dialogue/characters/nazir.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.laila, path: 'assets/dialogue/characters/laila.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.hakan, path: 'assets/dialogue/characters/hakan.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.seraphin, path: 'assets/dialogue/characters/seraphin.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.micaela, path: 'assets/dialogue/characters/micaela.png' },
  { key: CHARACTER_DIALOGUE_PORTRAIT_KEYS.lucian, path: 'assets/dialogue/characters/lucian.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.orin, path: 'assets/dialogue/npcs/orin.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.marta, path: 'assets/dialogue/npcs/marta.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.neri, path: 'assets/dialogue/npcs/neri.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.torren, path: 'assets/dialogue/npcs/torren.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.seline, path: 'assets/dialogue/npcs/seline.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.elder_haru, path: 'assets/dialogue/npcs/elder_haru.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.bram_recruit, path: 'assets/dialogue/npcs/bram_recruit.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.scribe_len, path: 'assets/dialogue/npcs/scribe_len.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.captain_ysold, path: 'assets/dialogue/npcs/captain_ysold.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.quartermaster_dina, path: 'assets/dialogue/npcs/quartermaster_dina.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.guard_east, path: 'assets/dialogue/npcs/guard_east.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.villager_plaza, path: 'assets/dialogue/npcs/villager_plaza.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.runner_lane, path: 'assets/dialogue/npcs/runner_lane.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.child_south, path: 'assets/dialogue/npcs/child_south.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.market_courier, path: 'assets/dialogue/npcs/market_courier.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.garden_guard, path: 'assets/dialogue/npcs/garden_guard.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.plaza_bard, path: 'assets/dialogue/npcs/plaza_bard.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.dock_loader, path: 'assets/dialogue/npcs/dock_loader.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.rookie_sentry, path: 'assets/dialogue/npcs/rookie_sentry.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.king_aldren, path: 'assets/dialogue/npcs/king_aldren.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.queen_regent_celestine, path: 'assets/dialogue/npcs/queen_regent_celestine.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.captain_rowan, path: 'assets/dialogue/npcs/captain_rowan.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.archivist_mirel, path: 'assets/dialogue/npcs/archivist_mirel.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.chamberlain_orla, path: 'assets/dialogue/npcs/chamberlain_orla.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.sanctum_knight, path: 'assets/dialogue/npcs/sanctum_knight.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.archive_aide, path: 'assets/dialogue/npcs/archive_aide.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.garden_caretaker, path: 'assets/dialogue/npcs/garden_caretaker.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.lantern_keeper, path: 'assets/dialogue/npcs/lantern_keeper.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.gate_clerk, path: 'assets/dialogue/npcs/gate_clerk.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.traveling_healer, path: 'assets/dialogue/npcs/traveling_healer.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.fountain_vendor, path: 'assets/dialogue/npcs/fountain_vendor.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.forge_apprentice, path: 'assets/dialogue/npcs/forge_apprentice.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.armor_fitter, path: 'assets/dialogue/npcs/armor_fitter.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.relic_custodian, path: 'assets/dialogue/npcs/relic_custodian.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.palace_page, path: 'assets/dialogue/npcs/palace_page.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.royal_cook, path: 'assets/dialogue/npcs/royal_cook.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.weapon_merchant, path: 'assets/dialogue/npcs/weapon_merchant.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.armor_merchant, path: 'assets/dialogue/npcs/armor_merchant.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.item_merchant, path: 'assets/dialogue/npcs/item_merchant.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.relic_merchant, path: 'assets/dialogue/npcs/relic_merchant.png' },
  { key: NPC_DIALOGUE_PORTRAIT_KEYS.blacksmith, path: 'assets/dialogue/npcs/blacksmith.png' },
  { key: ENEMY_DIALOGUE_PORTRAIT_KEYS.greenhaven_fragment_lord, path: 'assets/dialogue/enemies/greenhaven_fragment_lord.png' },
  { key: ENEMY_DIALOGUE_PORTRAIT_KEYS.ironreach_rebel_captain, path: 'assets/dialogue/enemies/ironreach_rebel_captain.png' },
  { key: ENEMY_DIALOGUE_PORTRAIT_KEYS.blueharbor_tide_cult_guardian, path: 'assets/dialogue/enemies/blueharbor_tide_cult_guardian.png' },
  { key: ENEMY_DIALOGUE_PORTRAIT_KEYS.frost_grave_commander, path: 'assets/dialogue/enemies/frost_grave_commander.png' },
  { key: ENEMY_DIALOGUE_PORTRAIT_KEYS.solkazar_relic_tyrant, path: 'assets/dialogue/enemies/solkazar_relic_tyrant.png' },
  { key: ENEMY_DIALOGUE_PORTRAIT_KEYS.black_moon_inquisitor, path: 'assets/dialogue/enemies/black_moon_inquisitor.png' },
  { key: ENEMY_DIALOGUE_PORTRAIT_KEYS.black_gate_warlord, path: 'assets/dialogue/enemies/black_gate_warlord.png' },
] as const;

const NPC_ALIAS_MAP: Record<string, keyof typeof NPC_DIALOGUE_PORTRAIT_KEYS> = {
  weapon_shop: 'orin',
  armor_shop: 'marta',
  item_shop: 'neri',
  forge_shop: 'torren',
  relic_shop: 'seline',
  mayor_haru: 'elder_haru',
  east_guard: 'guard_east',
  south_guard: 'garden_guard',
  plaza_villager: 'villager_plaza',
  route_runner: 'runner_lane',
  south_ward_child: 'child_south',
  guard_sword: 'guard_east',
  guard_spear: 'guard_east',
  guard_crossbow: 'guard_east',
  villager: 'villager_plaza',
  traveler: 'runner_lane',
  child: 'child_south',
};

const ENEMY_ALIAS_MAP: Record<string, keyof typeof ENEMY_DIALOGUE_PORTRAIT_KEYS> = {
  black_moon_vanguard: 'black_moon_inquisitor',
};

export function getDialoguePortraitKey(category: DialogueSpeakerCategory, subjectId: string): string | null {
  if (category === 'character') {
    return CHARACTER_DIALOGUE_PORTRAIT_KEYS[subjectId as keyof typeof CHARACTER_DIALOGUE_PORTRAIT_KEYS] ?? null;
  }

  if (category === 'npc') {
    const resolvedId = NPC_ALIAS_MAP[subjectId] ?? subjectId;
    return NPC_DIALOGUE_PORTRAIT_KEYS[resolvedId as keyof typeof NPC_DIALOGUE_PORTRAIT_KEYS] ?? null;
  }

  const resolvedId = ENEMY_ALIAS_MAP[subjectId] ?? subjectId;
  return ENEMY_DIALOGUE_PORTRAIT_KEYS[resolvedId as keyof typeof ENEMY_DIALOGUE_PORTRAIT_KEYS] ?? null;
}
