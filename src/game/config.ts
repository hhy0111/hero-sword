import Phaser from 'phaser';
import { AssetStatusScene } from './scenes/AssetStatusScene';
import { AnimationViewerScene } from './scenes/AnimationViewerScene';
import { BattleScene } from './scenes/BattleScene';
import { BootScene } from './scenes/BootScene';
import { CashShopScene } from './scenes/CashShopScene';
import { CutsceneScene } from './scenes/CutsceneScene';
import { EquipmentScene } from './scenes/EquipmentScene';
import { GachaScene } from './scenes/GachaScene';
import { HousingScene } from './scenes/HousingScene';
import { OptionsScene } from './scenes/OptionsScene';
import { PalaceScene } from './scenes/PalaceScene';
import { PartyScene } from './scenes/PartyScene';
import { ResultScene } from './scenes/ResultScene';
import { ShopScene } from './scenes/ShopScene';
import { StageSelectScene } from './scenes/StageSelectScene';
import { StorageScene } from './scenes/StorageScene';
import { TitleScene } from './scenes/TitleScene';
import { TownInteriorScene } from './scenes/TownInteriorScene';
import { VillageLobbyScene } from './scenes/VillageLobbyScene';
import { WorldMapScene } from './scenes/WorldMapScene';

export function buildGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.CANVAS,
    parent,
    width: 360,
    height: 640,
    backgroundColor: '#1d281d',
    scene: [
      BootScene,
      CutsceneScene,
      TitleScene,
      VillageLobbyScene,
      PalaceScene,
      OptionsScene,
      AssetStatusScene,
      AnimationViewerScene,
      EquipmentScene,
      PartyScene,
      GachaScene,
      CashShopScene,
      ShopScene,
      StorageScene,
      HousingScene,
      TownInteriorScene,
      WorldMapScene,
      StageSelectScene,
      BattleScene,
      ResultScene,
    ],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    input: {
      keyboard: false,
      touch: true,
      gamepad: false,
    },
    audio: {
      disableWebAudio: true,
      noAudio: true,
    },
    render: {
      antialias: true,
      pixelArt: false,
    },
    dom: {
      createContainer: true,
    },
  };
}
