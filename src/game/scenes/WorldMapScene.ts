import Phaser from 'phaser';
import { AtlasFrame } from '../data/atlas';
import { getContinents } from '../data/world';
import {
  WORLD_MAP_IMAGE_KEYS,
  getWorldMapLandmarkKey,
  getWorldMapOverviewKey,
  WORLD_MAP_SCENE_IMAGE_ASSETS,
} from '../data/worldMapRuntimeArt';
import { t } from '../services/i18n';
import { loadSnapshot } from '../services/save';
import { getSelectedContinent, setSelectedContinent } from '../services/session';
import { buildDebugState } from '../ui/debugHud';
import { createButton } from '../ui/widgets';
import type { ContinentDefinition, SaveSnapshot } from '../types';

interface ContinentNodeView {
  continent: ContinentDefinition;
  container: Phaser.GameObjects.Container;
  cardFill: Phaser.GameObjects.Rectangle;
  border: Phaser.GameObjects.Rectangle;
  preview: Phaser.GameObjects.Image;
  label: Phaser.GameObjects.Text;
  status: Phaser.GameObjects.Text;
  lockShade: Phaser.GameObjects.Rectangle;
  hitArea: Phaser.GameObjects.Rectangle;
}

const MAP_NODE_LAYOUT: Record<string, { x: number; y: number }> = {
  continent_01: { x: 98, y: 328 },
  continent_02: { x: 262, y: 328 },
  continent_03: { x: 98, y: 436 },
  continent_04: { x: 262, y: 436 },
  continent_05: { x: 98, y: 544 },
  continent_06: { x: 262, y: 544 },
};

export class WorldMapScene extends Phaser.Scene {
  private snapshot!: SaveSnapshot;
  private selectedIndex = 0;
  private nodes: ContinentNodeView[] = [];
  private detailText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private previewImage!: Phaser.GameObjects.Image;
  private routeGraphics!: Phaser.GameObjects.Graphics;

  constructor() {
    super('world-map');
  }

  create(): void {
    this.nodes = [];
    this.snapshot = loadSnapshot();
    void this.initializeScene();
  }

  private async initializeScene(): Promise<void> {
    const loadingText = this.add.text(
      180,
      320,
      t(this, 'ui.world_map_loading', undefined, '\uc6d4\ub4dc \ub8e8\ud2b8\ub97c \ubd88\ub7ec\uc624\ub294 \uc911...'),
      {
        fontFamily: 'Segoe UI',
        fontSize: '16px',
        color: '#f6ecd0',
      },
    ).setOrigin(0.5);

    await this.ensureWorldMapSceneAssets();
    loadingText.destroy();
    this.drawLayout();
    this.selectInitialCard();
    this.refreshSelection();
  }

  update(_: number, delta: number): void {
    this.stepSimulation(delta);
  }

  public stepSimulation(_: number): void {
  }

  public renderGameToText(): string {
    const selected = this.nodes[this.selectedIndex]?.continent;
    return JSON.stringify(
      buildDebugState('world_map', this.snapshot, {
        selectedContinent: selected?.id ?? null,
        selectedContinentName: selected?.name ?? null,
        availableActions: ['choose_continent', 'back_to_village'],
      }),
    );
  }

  private drawLayout(): void {
    const backdrop = this.add.graphics().setDepth(-8);
    backdrop.fillGradientStyle(0x061018, 0x061018, 0x09141d, 0x09141d, 1);
    backdrop.fillRect(0, 0, 360, 640);
    backdrop.fillStyle(0x000000, 0.26);
    backdrop.fillRect(0, 0, 360, 640);

    this.add.text(28, 28, t(this, 'ui.world_route_title', undefined, '\uc6d4\ub4dc \ub8e8\ud2b8'), {
      fontFamily: 'Segoe UI',
      fontSize: '21px',
      color: '#fff4d4',
      fontStyle: 'bold',
    }).setDepth(2);

    this.add.rectangle(180, 110, 314, 176, 0x081018, 0.42).setDepth(-1);

    const initialPreviewKey = this.getPreviewTextureKey('continent_01');
    this.previewImage = this.add.image(180, 98, initialPreviewKey).setDepth(1);
    this.fitImageWithin(this.previewImage, initialPreviewKey, 168, 98);

    this.detailText = this.add.text(28, 152, '', {
      fontFamily: 'Segoe UI',
      fontSize: '15px',
      color: '#fff2cf',
      wordWrap: { width: 308 },
      lineSpacing: 2,
    }).setDepth(2);

    this.statusText = this.add.text(28, 208, '', {
      fontFamily: 'Segoe UI',
      fontSize: '11px',
      color: '#f2da9d',
      wordWrap: { width: 308 },
    }).setDepth(2);

    this.add.text(28, 266, t(this, 'ui.world_map_choose_region', undefined, '\uc9c0\uc5ed \uc120\ud0dd'), {
      fontFamily: 'Segoe UI',
      fontSize: '15px',
      color: '#fff1c8',
      fontStyle: 'bold',
    }).setDepth(2);

    this.routeGraphics = this.add.graphics().setDepth(1);
    this.drawRoutes();

    getContinents().forEach((continent, index) => {
      const layout = MAP_NODE_LAYOUT[continent.id] ?? { x: 180, y: 320 + index * 40 };
      const cardFill = this.add.rectangle(0, 0, 136, 98, 0x091119, 0.36).setStrokeStyle(0, 0, 0);
      const previewKey = this.getPreviewTextureKey(continent.id);
      const preview = this.add.image(0, -12, previewKey).setAlpha(0.98);
      this.fitImageWithin(preview, previewKey, 84, 58);
      const border = this.add.rectangle(0, -12, 96, 68).setStrokeStyle(1, 0xd7c27c, 0.06);
      const lockShade = this.add.rectangle(0, 0, 136, 98, 0x05080d, 0.22);
      const label = this.add.text(0, 22, t(this, continent.name, undefined, continent.name), {
        fontFamily: 'Segoe UI',
        fontSize: '12px',
        color: '#fff4d8',
        align: 'center',
      }).setOrigin(0.5);
      const status = this.add.text(0, 40, '', {
        fontFamily: 'Segoe UI',
        fontSize: '10px',
        color: '#eed28f',
        align: 'center',
      }).setOrigin(0.5);
      const hitArea = this.add.rectangle(0, 0, 132, 94, 0x000000, 0);

      const container = this.add.container(layout.x, layout.y, [cardFill, preview, border, lockShade, label, status, hitArea]);
      container.setSize(132, 94);
      container.setDepth(4);

      hitArea.on('pointerdown', () => {
        const alreadySelected = this.selectedIndex === index;
        this.selectedIndex = index;
        this.refreshSelection();
        if (alreadySelected) {
          this.openCurrentContinent();
        }
      });

      this.nodes.push({
        continent,
        container,
        cardFill,
        border,
        preview,
        label,
        status,
        lockShade,
        hitArea,
      });
    });

    createButton(this, 90, 602, {
      width: 128,
      height: 38,
      label: t(this, 'ui.village', undefined, '\ub9c8\uc744'),
      iconFrame: AtlasFrame.HomeIcon,
      onClick: () => this.scene.start('village', { spawnId: 'world_gate_return' }),
    });
    createButton(this, 270, 602, {
      width: 128,
      height: 38,
      label: t(this, 'ui.enter', undefined, '\uc785\uc7a5'),
      iconFrame: AtlasFrame.MapIcon,
      backgroundFrame: AtlasFrame.GoldButton,
      onClick: () => this.openCurrentContinent(),
    });
  }

  private drawRoutes(): void {
    const orderedContinents = getContinents();
    this.routeGraphics.clear();
    this.routeGraphics.lineStyle(2, 0xf0e2b0, 0.12);

    for (let index = 0; index < orderedContinents.length - 1; index += 1) {
      const from = MAP_NODE_LAYOUT[orderedContinents[index].id];
      const to = MAP_NODE_LAYOUT[orderedContinents[index + 1].id];
      if (!from || !to) {
        continue;
      }

      const midX = (from.x + to.x) / 2;
      const midY = Math.min(from.y, to.y) - 26;
      this.routeGraphics.lineBetween(from.x, from.y + 10, midX, midY);
      this.routeGraphics.lineBetween(midX, midY, to.x, to.y + 10);
    }
  }

  private selectInitialCard(): void {
    const selectedContinentId = getSelectedContinent(this) ?? 'continent_01';
    const initialIndex = this.nodes.findIndex((card) => card.continent.id === selectedContinentId);
    this.selectedIndex = initialIndex >= 0 ? initialIndex : 0;
  }

  private refreshSelection(): void {
    this.nodes.forEach((node, index) => {
      const unlocked = this.snapshot.world.unlockedContinents.includes(node.continent.id);
      const selected = index === this.selectedIndex;

      node.cardFill.setFillStyle(0x0b1219, selected ? 0.58 : 0.28);
      node.border.setStrokeStyle(2, 0xe6d39d, selected ? 0.82 : 0.04);
      node.container.setScale(selected ? 1.03 : 1);
      node.lockShade.setVisible(true);
      node.lockShade.setAlpha(unlocked ? 0.04 : 0.74);
      node.preview.setAlpha(unlocked ? 1 : 0.2);
      node.status.setText(unlocked ? t(this, 'ui.open') : t(this, 'ui.locked'));
      node.label.setColor(selected ? '#fff6db' : '#f2e6c2');

      if (unlocked) {
        if (!node.hitArea.input?.enabled) {
          node.hitArea.setInteractive({ useHandCursor: true });
        }
      } else {
        node.hitArea.disableInteractive();
      }
    });

    const continent = this.nodes[this.selectedIndex].continent;
    const unlocked = this.snapshot.world.unlockedContinents.includes(continent.id);
    const previewKey = this.getPreviewTextureKey(continent.id);

    if (this.textures.exists(previewKey)) {
      this.previewImage.setTexture(previewKey);
      this.fitImageWithin(this.previewImage, previewKey, 212, 112);
    }

    this.detailText.setText([
      `${t(this, continent.storyAct, undefined, continent.storyAct)}  ${t(this, continent.name, undefined, continent.name)}`,
      t(this, 'ui.town_label', { town: t(this, continent.townName, undefined, continent.townName) }),
    ]);
    this.statusText.setText(
      unlocked
        ? t(this, 'ui.enter_available')
        : t(this, 'ui.previous_route_required'),
    );
  }

  private openCurrentContinent(): void {
    const continent = this.nodes[this.selectedIndex].continent;
    if (!this.snapshot.world.unlockedContinents.includes(continent.id)) {
      this.statusText.setText(t(this, 'ui.previous_route_required'));
      return;
    }

    setSelectedContinent(this, continent.id);
    this.scene.start('stage-select');
  }

  private async ensureWorldMapSceneAssets(): Promise<void> {
    for (const asset of WORLD_MAP_SCENE_IMAGE_ASSETS) {
      if (this.textures.exists(asset.key)) {
        continue;
      }

      await new Promise<void>((resolve) => {
        const loader = new Phaser.Loader.LoaderPlugin(this);
        loader.image(asset.key, asset.path);
        loader.once(Phaser.Loader.Events.COMPLETE, () => resolve());
        loader.start();
      });
    }
  }

  private getPreviewTextureKey(continentId: string): string {
    const landmarkKey = getWorldMapLandmarkKey(continentId);
    if (landmarkKey && this.textures.exists(landmarkKey)) {
      return landmarkKey;
    }
    return getWorldMapOverviewKey();
  }

  private fitImageWithin(
    image: Phaser.GameObjects.Image,
    textureKey: string,
    maxWidth: number,
    maxHeight: number,
  ): void {
    if (!this.textures.exists(textureKey)) {
      image.setDisplaySize(maxWidth, maxHeight);
      return;
    }

    const source = this.textures.get(textureKey).getSourceImage() as { width?: number; height?: number };
    const width = source.width ?? maxWidth;
    const height = source.height ?? maxHeight;
    if (width <= 0 || height <= 0) {
      image.setDisplaySize(maxWidth, maxHeight);
      return;
    }

    const scale = Math.min(maxWidth / width, maxHeight / height);
    image.setDisplaySize(Math.round(width * scale), Math.round(height * scale));
  }
}
