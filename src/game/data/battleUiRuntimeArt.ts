export interface BattleUiImageAsset {
  key: string;
  path: string;
}

export const BATTLE_UI_IMAGE_KEYS = {
  topHudFrame: 'battle-ui:top-hud-frame',
  bottomCommandFrame: 'battle-ui:bottom-command-frame',
  commandDockBackground: 'battle-ui:command-dock-background',
  allyHpFrame: 'battle-ui:ally-hp-frame',
  enemyHpFrame: 'battle-ui:enemy-hp-frame',
  resultClearFrame: 'battle-ui:result-clear-frame',
  resultFailFrame: 'battle-ui:result-fail-frame',
} as const;

export const BATTLE_UI_IMAGE_ASSETS: readonly BattleUiImageAsset[] = [
  { key: BATTLE_UI_IMAGE_KEYS.topHudFrame, path: 'assets/ui/battle/top_hud_frame.png' },
  { key: BATTLE_UI_IMAGE_KEYS.bottomCommandFrame, path: 'assets/ui/battle/bottom_command_frame.png' },
  { key: BATTLE_UI_IMAGE_KEYS.commandDockBackground, path: 'assets/ui/battle/battle_command_dock_background.png' },
  { key: BATTLE_UI_IMAGE_KEYS.allyHpFrame, path: 'assets/ui/battle/ally_hp_frame.png' },
  { key: BATTLE_UI_IMAGE_KEYS.enemyHpFrame, path: 'assets/ui/battle/enemy_hp_frame.png' },
  { key: BATTLE_UI_IMAGE_KEYS.resultClearFrame, path: 'assets/ui/battle/result_clear_frame.png' },
  { key: BATTLE_UI_IMAGE_KEYS.resultFailFrame, path: 'assets/ui/battle/result_fail_frame.png' },
] as const;
