import Phaser from 'phaser';
import type { BattleResult, StageDifficulty, StageSelection } from '../types';

export const SESSION_KEYS = {
  continent: 'hero-sword:selected-continent',
  difficulty: 'hero-sword:selected-difficulty',
  selection: 'hero-sword:selected-stage',
  result: 'hero-sword:last-battle-result',
  villageReturn: 'hero-sword:village-return',
} as const;

export interface VillageReturnState {
  x?: number;
  y?: number;
  spawnId?: string;
}

export function getSelectedContinent(scene: Phaser.Scene): string | null {
  return scene.registry.get(SESSION_KEYS.continent) ?? null;
}

export function setSelectedContinent(scene: Phaser.Scene, continentId: string): void {
  scene.registry.set(SESSION_KEYS.continent, continentId);
}

export function getSelectedDifficulty(scene: Phaser.Scene): StageDifficulty | null {
  return scene.registry.get(SESSION_KEYS.difficulty) ?? null;
}

export function setSelectedDifficulty(scene: Phaser.Scene, difficulty: StageDifficulty): void {
  scene.registry.set(SESSION_KEYS.difficulty, difficulty);
}

export function getStageSelection(scene: Phaser.Scene): StageSelection | null {
  return scene.registry.get(SESSION_KEYS.selection) ?? null;
}

export function setStageSelection(scene: Phaser.Scene, selection: StageSelection): void {
  scene.registry.set(SESSION_KEYS.selection, selection);
  setSelectedContinent(scene, selection.continentId);
  setSelectedDifficulty(scene, selection.difficulty);
}

export function getBattleResult(scene: Phaser.Scene): BattleResult | null {
  return scene.registry.get(SESSION_KEYS.result) ?? null;
}

export function setBattleResult(scene: Phaser.Scene, result: BattleResult): void {
  scene.registry.set(SESSION_KEYS.result, result);
}

export function clearBattleResult(scene: Phaser.Scene): void {
  scene.registry.remove(SESSION_KEYS.result);
}

export function getVillageReturn(scene: Phaser.Scene): VillageReturnState | null {
  return scene.registry.get(SESSION_KEYS.villageReturn) ?? null;
}

export function setVillageReturn(scene: Phaser.Scene, state: VillageReturnState): void {
  scene.registry.set(SESSION_KEYS.villageReturn, state);
}

export function clearVillageReturn(scene: Phaser.Scene): void {
  scene.registry.remove(SESSION_KEYS.villageReturn);
}
