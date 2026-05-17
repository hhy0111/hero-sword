import Phaser from 'phaser';
import { ATLAS_ASSET_PATH, ATLAS_FRAME_SIZE, ATLAS_KEY } from '../data/atlas';
import { BATTLE_UI_IMAGE_ASSETS, BATTLE_UI_IMAGE_KEYS } from '../data/battleUiRuntimeArt';
import { OPENING_CUTSCENE_ID } from '../data/cutscenes';
import { DIALOGUE_PORTRAIT_ASSETS } from '../data/dialoguePortraitAssets';
import { GACHA_ITEM_IMAGE_ASSETS } from '../data/gachaItemRuntimeArt';
import { HOUSING_RUNTIME_IMAGE_ASSETS } from '../data/housingRuntimeArt';
import { MONSTER_ILLUSTRATION_ASSETS } from '../data/monsterIllustrationAssets';
import { PALACE_RUNTIME_IMAGE_ASSETS, PALACE_RUNTIME_IMAGE_KEYS } from '../data/palaceRuntimeArt';
import { SCREEN_RUNTIME_IMAGE_ASSETS, SCREEN_RUNTIME_IMAGE_KEYS } from '../data/screenRuntimeArt';
import { STAGE_SELECT_IMAGE_ASSETS } from '../data/stageSelectRuntimeArt';
import { STORAGE_ITEM_IMAGE_ASSETS } from '../data/storageItemRuntimeArt';
import { UI_BUTTON_IMAGE_ASSETS } from '../data/uiButtonRuntimeArt';
import { SHOP_RUNTIME_IMAGE_ASSETS } from '../data/shopRuntimeArt';
import {
  TOWN_RUNTIME_IMAGE_ASSETS,
  TOWN_RUNTIME_SHEET_ASSETS,
} from '../data/townRuntimeArt';
import { getStageBackgroundAssetPath, getStageBackgroundKey, hasStageBackgroundAsset, STAGES } from '../data/world';
import { WORLD_MAP_IMAGE_ASSETS, WORLD_MAP_SCENE_IMAGE_ASSETS } from '../data/worldMapRuntimeArt';
import {
  loadRuntimeAnimationAssets,
  setRuntimeAnimationState,
} from '../data/runtimeAnimationAssets';
import {
  clearVillageReturn,
  clearBattleResult,
  setSelectedContinent,
  setSelectedDifficulty,
  setStageSelection,
} from '../services/session';
import { initializeLanguage } from '../services/i18n';
import { initializeAds } from '../../platform/ads';
import { initializePurchases } from '../../platform/store';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  preload(): void {
    this.load.spritesheet(ATLAS_KEY, ATLAS_ASSET_PATH, {
      frameWidth: ATLAS_FRAME_SIZE,
      frameHeight: ATLAS_FRAME_SIZE,
    });

    for (const stage of STAGES) {
      if (hasStageBackgroundAsset(stage.id)) {
        this.load.image(getStageBackgroundKey(stage.id), getStageBackgroundAssetPath(stage.id));
      }
    }

    for (const asset of WORLD_MAP_IMAGE_ASSETS) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of DIALOGUE_PORTRAIT_ASSETS) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of MONSTER_ILLUSTRATION_ASSETS) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of PALACE_RUNTIME_IMAGE_ASSETS) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of TOWN_RUNTIME_IMAGE_ASSETS) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of BATTLE_UI_IMAGE_ASSETS) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of STAGE_SELECT_IMAGE_ASSETS) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of STORAGE_ITEM_IMAGE_ASSETS) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of UI_BUTTON_IMAGE_ASSETS) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of SHOP_RUNTIME_IMAGE_ASSETS) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of GACHA_ITEM_IMAGE_ASSETS) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of HOUSING_RUNTIME_IMAGE_ASSETS) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of SCREEN_RUNTIME_IMAGE_ASSETS) {
      this.load.image(asset.key, asset.path);
    }

    for (const asset of TOWN_RUNTIME_SHEET_ASSETS) {
      this.load.spritesheet(asset.key, asset.path, {
        frameWidth: asset.frameWidth,
        frameHeight: asset.frameHeight,
      });
    }
  }

  create(): void {
    if (this.textures.exists(ATLAS_KEY)) {
      this.textures.get(ATLAS_KEY).setFilter(Phaser.Textures.FilterMode.NEAREST);
    }

    for (const asset of TOWN_RUNTIME_IMAGE_ASSETS) {
      if (this.textures.exists(asset.key)) {
        this.textures.get(asset.key).setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
    }

    for (const asset of PALACE_RUNTIME_IMAGE_ASSETS) {
      if (this.textures.exists(asset.key)) {
        const linearPalaceImages = new Set<string>([
          PALACE_RUNTIME_IMAGE_KEYS.exterior,
          PALACE_RUNTIME_IMAGE_KEYS.northGate,
          PALACE_RUNTIME_IMAGE_KEYS.outerCourtGround,
          PALACE_RUNTIME_IMAGE_KEYS.royalAudienceHall,
          PALACE_RUNTIME_IMAGE_KEYS.exteriorTileRuntimeSet,
          PALACE_RUNTIME_IMAGE_KEYS.interiorTileRuntimeSet,
          PALACE_RUNTIME_IMAGE_KEYS.centerCarpetSegment,
        ]);
        const filter = linearPalaceImages.has(asset.key)
          ? Phaser.Textures.FilterMode.LINEAR
          : Phaser.Textures.FilterMode.NEAREST;
        this.textures.get(asset.key).setFilter(filter);
      }
    }

    for (const asset of MONSTER_ILLUSTRATION_ASSETS) {
      if (this.textures.exists(asset.key)) {
        this.textures.get(asset.key).setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
    }

    for (const asset of BATTLE_UI_IMAGE_ASSETS) {
      if (this.textures.exists(asset.key)) {
        const filter = asset.key === BATTLE_UI_IMAGE_KEYS.commandDockBackground
          ? Phaser.Textures.FilterMode.LINEAR
          : Phaser.Textures.FilterMode.NEAREST;
        this.textures.get(asset.key).setFilter(filter);
      }
    }

    for (const asset of STAGE_SELECT_IMAGE_ASSETS) {
      if (this.textures.exists(asset.key)) {
        this.textures.get(asset.key).setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
    }

    for (const asset of STORAGE_ITEM_IMAGE_ASSETS) {
      if (this.textures.exists(asset.key)) {
        this.textures.get(asset.key).setFilter(Phaser.Textures.FilterMode.LINEAR);
      }
    }

    for (const asset of UI_BUTTON_IMAGE_ASSETS) {
      if (this.textures.exists(asset.key)) {
        this.textures.get(asset.key).setFilter(Phaser.Textures.FilterMode.LINEAR);
      }
    }

    for (const asset of SHOP_RUNTIME_IMAGE_ASSETS) {
      if (this.textures.exists(asset.key)) {
        this.textures.get(asset.key).setFilter(Phaser.Textures.FilterMode.LINEAR);
      }
    }

    for (const asset of GACHA_ITEM_IMAGE_ASSETS) {
      if (this.textures.exists(asset.key)) {
        this.textures.get(asset.key).setFilter(Phaser.Textures.FilterMode.LINEAR);
      }
    }

    for (const asset of HOUSING_RUNTIME_IMAGE_ASSETS) {
      if (this.textures.exists(asset.key)) {
        this.textures.get(asset.key).setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
    }

    for (const asset of SCREEN_RUNTIME_IMAGE_ASSETS) {
      if (this.textures.exists(asset.key)) {
        const shouldUseLinearFilter = new Set<string>([
          SCREEN_RUNTIME_IMAGE_KEYS.partyBackground,
          SCREEN_RUNTIME_IMAGE_KEYS.titleHeroSwordLogo,
          SCREEN_RUNTIME_IMAGE_KEYS.characterDetailModal,
          SCREEN_RUNTIME_IMAGE_KEYS.equipmentInventoryPanel,
          SCREEN_RUNTIME_IMAGE_KEYS.equipmentWorkshopBackground,
          SCREEN_RUNTIME_IMAGE_KEYS.summonCardBack,
        ]).has(asset.key);
        this.textures.get(asset.key).setFilter(
          shouldUseLinearFilter ? Phaser.Textures.FilterMode.LINEAR : Phaser.Textures.FilterMode.NEAREST,
        );
      }
    }

    for (const asset of TOWN_RUNTIME_SHEET_ASSETS) {
      if (this.textures.exists(asset.key)) {
        this.textures.get(asset.key).setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
    }

    void this.bootstrap();
  }

  private async bootstrap(): Promise<void> {
    void initializeAds();
    void initializePurchases();
    initializeLanguage(this);
    await this.ensureWorldMapRuntimeAssets();
    setRuntimeAnimationState(this, await loadRuntimeAnimationAssets(this));
    setSelectedContinent(this, 'continent_01');
    setSelectedDifficulty(this, 'normal');
    setStageSelection(this, {
      continentId: 'continent_01',
      stageId: 'stage_01_01',
      difficulty: 'normal',
    });
    clearVillageReturn(this);
    clearBattleResult(this);
    this.scene.start('cutscene', {
      cutsceneId: OPENING_CUTSCENE_ID,
      nextScene: 'title',
    });
  }

  private async ensureWorldMapRuntimeAssets(): Promise<void> {
    const missingAssets = WORLD_MAP_SCENE_IMAGE_ASSETS.filter((asset) => !this.textures.exists(asset.key));
    if (missingAssets.length === 0) {
      return;
    }

    await new Promise<void>((resolve) => {
      const loader = new Phaser.Loader.LoaderPlugin(this);
      for (const asset of missingAssets) {
        loader.image(asset.key, asset.path);
      }

      loader.once(Phaser.Loader.Events.COMPLETE, () => resolve());
      loader.start();
    });
  }
}
