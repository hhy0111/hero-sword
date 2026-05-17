import Phaser from 'phaser';
import { buildGameConfig } from '../config';
import { createShowcaseSnapshot } from './state';
import { saveSnapshot, loadSnapshot } from '../services/save';
import { SESSION_KEYS } from '../services/session';
import type { BattleResult, SaveSnapshot, StageDifficulty, StageSelection } from '../types';

interface DebugScene extends Phaser.Scene {
  renderGameToText: () => string;
  stepSimulation: (deltaMs: number) => void;
}

interface HeroSwordDebugTools {
  getActiveScene: () => string | null;
  startScene: (sceneKey: string) => boolean;
  setSaveSnapshot: (snapshot: SaveSnapshot) => void;
  getSaveSnapshot: () => SaveSnapshot;
  applyShowcaseSnapshot: () => SaveSnapshot;
  clearSession: () => void;
  setSelectedContinent: (continentId: string) => void;
  setSelectedDifficulty: (difficulty: StageDifficulty) => void;
  setStageSelection: (selection: StageSelection) => void;
  setBattleResult: (result: BattleResult | null) => void;
}

export function createGame(parent: HTMLElement): Phaser.Game {
  const game = new Phaser.Game(buildGameConfig(parent));
  (window as Window & { __heroSwordGame?: Phaser.Game }).__heroSwordGame = game;

  const getDebugScene = (): DebugScene | null => {
    const activeScenes = game.scene.getScenes(true).reverse();

    for (const scene of activeScenes) {
      if (
        typeof (scene as Partial<DebugScene>).renderGameToText === 'function' &&
        typeof (scene as Partial<DebugScene>).stepSimulation === 'function'
      ) {
        return scene as DebugScene;
      }
    }

    return null;
  };

  window.render_game_to_text = () => {
    const scene = getDebugScene();
    return scene
      ? scene.renderGameToText()
      : JSON.stringify({
          mode: 'booting',
          activeScenes: game.scene.getScenes(true).map((entry) => entry.scene.key),
        });
  };

  window.advanceTime = (ms: number) => {
    const scene = getDebugScene();

    if (!scene) {
      return;
    }

    const steps = Math.max(1, Math.round(ms / (1000 / 60)));

    for (let index = 0; index < steps; index += 1) {
      scene.stepSimulation(1000 / 60);
    }
  };

  window.__heroSwordDebug = createDebugTools(game, getDebugScene);

  return game;
}

function createDebugTools(
  game: Phaser.Game,
  getDebugScene: () => DebugScene | null,
): HeroSwordDebugTools {
  const setRegistryValue = (key: string, value: unknown) => {
    game.registry.set(key, value);
  };

  return {
    getActiveScene: () => getDebugScene()?.scene.key ?? null,
    startScene: (sceneKey) => {
      const hasScene = game.scene.keys[sceneKey];

      if (!hasScene) {
        return false;
      }

      const activeScene = getDebugScene();

      if (activeScene) {
        activeScene.scene.start(sceneKey);
        return true;
      }

      game.scene.start(sceneKey);
      return true;
    },
    setSaveSnapshot: (snapshot) => {
      saveSnapshot(snapshot);
    },
    getSaveSnapshot: () => loadSnapshot(),
    applyShowcaseSnapshot: () => {
      const snapshot = createShowcaseSnapshot();
      saveSnapshot(snapshot);
      return snapshot;
    },
    clearSession: () => {
      game.registry.remove(SESSION_KEYS.continent);
      game.registry.remove(SESSION_KEYS.difficulty);
      game.registry.remove(SESSION_KEYS.selection);
      game.registry.remove(SESSION_KEYS.result);
      game.registry.remove(SESSION_KEYS.villageReturn);
    },
    setSelectedContinent: (continentId) => {
      setRegistryValue(SESSION_KEYS.continent, continentId);
    },
    setSelectedDifficulty: (difficulty) => {
      setRegistryValue(SESSION_KEYS.difficulty, difficulty);
    },
    setStageSelection: (selection) => {
      setRegistryValue(SESSION_KEYS.selection, selection);
      setRegistryValue(SESSION_KEYS.continent, selection.continentId);
      setRegistryValue(SESSION_KEYS.difficulty, selection.difficulty);
    },
    setBattleResult: (result) => {
      if (result === null) {
        game.registry.remove(SESSION_KEYS.result);
        return;
      }

      setRegistryValue(SESSION_KEYS.result, result);
    },
  };
}
