import { describe, expect, it } from 'vitest';
import { getAllCharacters } from '../src/game/data/characters';
import { CUTSCENE_DEFINITIONS } from '../src/game/data/cutscenes';
import { getAllArmors, getAllWeapons } from '../src/game/data/equipment';
import { getPalaceArrivalLine, getPalaceDialogue, LUMEN_PALACE_NPCS } from '../src/game/data/palace';
import { getStageRecruitmentEvents } from '../src/game/data/stageRecruitEvents';
import {
  LUMEN_AMBIENT_NPCS,
  LUMEN_BUILDINGS,
  LUMEN_INTERIORS,
  LUMEN_STORY_NPCS,
} from '../src/game/data/town';
import { t } from '../src/game/services/i18n';

const ENGLISH_WORD_PATTERN = /[A-Za-z]{3,}/;
const PLACEHOLDER_PATTERN = /\{[a-zA-Z0-9_]+\}/g;

const IMPORTANT_UI_KEYS = [
  'ui.world_map_loading',
  'ui.world_route_title',
  'ui.world_map_choose_region',
  'ui.world_map_board',
  'ui.dialogue.manual_prompt',
  'ui.dialogue.timed_prompt',
  'ui.stage_select',
  'ui.route_progress',
  'ui.enter_available',
  'ui.previous_route_required',
  'ui.palace_hall',
  'ui.palace_exit_label',
  'ui.palace_exit',
  'ui.auto',
  'ui.retreat',
  'ui.battle_mode_auto',
  'ui.manual_controls_hint',
  'currency.gold.short',
  'currency.heroStone.short',
] as const;

function collectVisibleEnglishSources(): string[] {
  const values: string[] = [];

  getAllCharacters().forEach((character) => {
    values.push(character.name, character.title, character.weaponType);
  });

  getAllWeapons().forEach((weapon) => values.push(weapon.name));
  getAllArmors().forEach((armor) => values.push(armor.name));
  CUTSCENE_DEFINITIONS.forEach((cutscene) => values.push(cutscene.label));

  LUMEN_BUILDINGS.forEach((building) => {
    values.push(building.label, building.shopTitle, building.flavorText, building.npcName, building.npcGreeting);
  });

  LUMEN_AMBIENT_NPCS.forEach((npc) => values.push(npc.name, npc.greeting));
  LUMEN_STORY_NPCS.forEach((npc) => values.push(npc.name, npc.greeting));
  Object.values(LUMEN_INTERIORS).forEach((interior) => {
    values.push(interior.title, interior.npcName, interior.greeting, interior.flavorText);
  });

  getStageRecruitmentEvents().forEach((event) => {
    values.push(event.characterName);
    event.lines.forEach((line) => {
      values.push(line.speaker.name, line.text);
    });
  });

  LUMEN_PALACE_NPCS.forEach((npc) => values.push(npc.name));
  [0, 1, 2, 3].forEach((storyTier) => {
    const arrivalLine = getPalaceArrivalLine(storyTier);
    values.push(arrivalLine.speaker.name, arrivalLine.text);

    LUMEN_PALACE_NPCS.forEach((npc) => {
      getPalaceDialogue(npc.id, storyTier).forEach((line) => {
        values.push(line.speaker.name, line.text);
      });
    });
  });

  return [...new Set(values)].filter((value) => ENGLISH_WORD_PATTERN.test(value));
}

describe('Korean localization coverage', () => {
  it('translates visible English data used by town, party, shop, and recruit dialogue surfaces', () => {
    const untranslated = collectVisibleEnglishSources()
      .map((source) => ({ source, translated: t('ko', source, undefined, source) }))
      .filter(({ source, translated }) =>
        translated === source || ENGLISH_WORD_PATTERN.test(translated.replace(PLACEHOLDER_PATTERN, '')),
      );

    expect(untranslated).toEqual([]);
  });

  it('keeps high-visibility UI keys translated for Korean mode', () => {
    const untranslated = IMPORTANT_UI_KEYS
      .map((key) => ({ key, translated: t('ko', key) }))
      .filter(({ key, translated }) =>
        translated === key || ENGLISH_WORD_PATTERN.test(translated.replace(PLACEHOLDER_PATTERN, '')),
      );

    expect(untranslated).toEqual([]);
  });
});
