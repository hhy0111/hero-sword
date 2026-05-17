/// <reference types="vite/client" />

declare global {
  interface HeroSwordDebugTools {
    getActiveScene: () => string | null;
    startScene: (sceneKey: string) => boolean;
    setSaveSnapshot: (snapshot: import('./game/types').SaveSnapshot) => void;
    getSaveSnapshot: () => import('./game/types').SaveSnapshot;
    applyShowcaseSnapshot: () => import('./game/types').SaveSnapshot;
    clearSession: () => void;
    setSelectedContinent: (continentId: string) => void;
    setSelectedDifficulty: (difficulty: import('./game/types').StageDifficulty) => void;
    setStageSelection: (selection: import('./game/types').StageSelection) => void;
    setBattleResult: (result: import('./game/types').BattleResult | null) => void;
  }

  interface Window {
    render_game_to_text?: () => string;
    advanceTime?: (ms: number) => void;
    __heroSwordGame?: import('phaser').Game;
    __heroSwordDebug?: HeroSwordDebugTools;
  }
}

export {};
