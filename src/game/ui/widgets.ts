import Phaser from 'phaser';
import { ATLAS_KEY, AtlasFrame } from '../data/atlas';
import { getUiButtonFrameKey } from '../data/uiButtonRuntimeArt';

interface ButtonOptions {
  width: number;
  height: number;
  label: string;
  iconFrame?: number;
  onClick: () => void;
  backgroundFrame?: number;
  disabled?: boolean;
  labelColor?: string;
  contentOffsetY?: number;
}

export function paintBackdrop(scene: Phaser.Scene, frame: number, tint = 0xffffff): void {
  const cols = Math.ceil(scene.scale.width / 64);
  const rows = Math.ceil(scene.scale.height / 64);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      scene.add
        .image(col * 64 + 32, row * 64 + 32, ATLAS_KEY, frame)
        .setDisplaySize(64, 64)
        .setTint(tint)
        .setDepth(-10);
    }
  }
}

export function createPanel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  title?: string,
): Phaser.GameObjects.Container {
  const background = scene.add
    .image(0, 0, ATLAS_KEY, AtlasFrame.Panel)
    .setDisplaySize(width, height)
    .setTint(0xf6edd0);
  const frame = scene.add
    .rectangle(0, 0, width, height)
    .setStrokeStyle(2, 0x4c3f31, 0.65)
    .setFillStyle(0x000000, 0);
  const children: Phaser.GameObjects.GameObject[] = [background, frame];

  if (title) {
    children.push(
      scene.add
        .text(-width / 2 + 14, -height / 2 + 10, title, {
          fontFamily: 'Segoe UI',
          fontSize: '16px',
          color: '#3b3128',
        })
        .setOrigin(0, 0),
    );
  }

  return scene.add.container(x, y, children);
}

export function createButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  options: ButtonOptions,
): Phaser.GameObjects.Container {
  const {
    width,
    height,
    label,
    iconFrame,
    onClick,
    backgroundFrame = AtlasFrame.BlueButton,
    disabled = false,
    labelColor = '#f7f4ea',
    contentOffsetY = 0,
  } = options;

  const runtimeButtonFrameKeys = {
    normal: getUiButtonFrameKey('normal'),
    hover: getUiButtonFrameKey('hover'),
    pressed: getUiButtonFrameKey('pressed'),
  } as const;
  const useRuntimeButtonFrames =
    scene.textures.exists(runtimeButtonFrameKeys.normal) &&
    scene.textures.exists(runtimeButtonFrameKeys.hover) &&
    scene.textures.exists(runtimeButtonFrameKeys.pressed);
  const runtimeButtonShadowOffsetY = useRuntimeButtonFrames ? 1 : 3;
  const runtimeButtonLabelOffsetY = (useRuntimeButtonFrames ? 0 : 0) + contentOffsetY;
  const runtimeButtonIconOffsetY = (useRuntimeButtonFrames ? 0 : 0) + contentOffsetY;
  const iconSize = iconFrame !== undefined ? Math.max(16, Math.min(height - 8, useRuntimeButtonFrames ? 18 : 22)) : 0;

  const shadow = scene.add
    .rectangle(0, runtimeButtonShadowOffsetY, Math.max(24, width - 8), Math.max(18, height - 10))
    .setFillStyle(0x000000, disabled ? 0.12 : 0.24)
    .setStrokeStyle(0, 0x000000, 0);
  const background = useRuntimeButtonFrames
    ? scene.add
        .image(0, 0, runtimeButtonFrameKeys.normal)
        .setDisplaySize(width, height)
    : scene.add
        .image(0, 0, ATLAS_KEY, backgroundFrame)
        .setDisplaySize(width, height)
        .setTint(disabled ? 0x777777 : 0xffffff);
  if (useRuntimeButtonFrames && disabled) {
    background.setAlpha(0.52);
  }
  const gloss = scene.add
    .rectangle(0, -height * 0.14, width - 10, Math.max(10, height * 0.28))
    .setFillStyle(0xffffff, useRuntimeButtonFrames ? (disabled ? 0.01 : 0.04) : disabled ? 0.03 : 0.08);
  const border = scene.add
    .rectangle(0, 0, width, height)
    .setStrokeStyle(useRuntimeButtonFrames ? 0 : 2, 0x1f1b18, disabled ? 0.35 : 0.84)
    .setFillStyle(0x000000, 0);
  const children: Phaser.GameObjects.GameObject[] = [shadow, background, gloss, border];

  if (iconFrame !== undefined) {
    children.push(
      scene.add
        .image(-width / 2 + 22, runtimeButtonIconOffsetY, ATLAS_KEY, iconFrame)
        .setDisplaySize(iconSize, iconSize),
    );
  }

  const labelWidth = Math.max(36, width - (iconFrame !== undefined ? 56 : 20));
  const baseFontSize = useRuntimeButtonFrames ? (width <= 96 ? 12 : 13) : width <= 96 ? 12 : 13;
  const labelCenterX = iconFrame !== undefined ? 8 : 0;
  const labelCenterY = runtimeButtonLabelOffsetY;
  const labelText = scene.add.text(labelCenterX, labelCenterY, label, {
    fontFamily: 'Segoe UI',
    fontSize: `${baseFontSize}px`,
    fontStyle: 'bold',
    color: labelColor,
    align: 'center',
    stroke: '#16110c',
    strokeThickness: useRuntimeButtonFrames ? 1 : 2,
    shadow: {
      offsetX: 0,
      offsetY: 1,
      color: '#000000',
      blur: 0,
      fill: true,
    },
  }).setOrigin(0.5, 0.5);

  let fittedFontSize = baseFontSize;
  while (labelText.width > labelWidth - 4 && fittedFontSize > 8) {
    fittedFontSize -= 1;
    labelText.setFontSize(fittedFontSize);
  }

  if (labelText.width > labelWidth) {
    labelText.setScale(Math.max(0.82, labelWidth / Math.max(labelText.width, 1)), 1);
  }

  labelText.setOrigin(0.5, 0.5);

  children.push(labelText);

  const button = scene.add.container(x, y, children);

  if (!disabled) {
    background.setInteractive({ useHandCursor: true });
    background.on('pointerover', () => {
      button.setScale(1.02);
      gloss.setAlpha(useRuntimeButtonFrames ? 0.07 : 0.12);
      if (useRuntimeButtonFrames) {
        background.setAlpha(1);
        background.setTexture(runtimeButtonFrameKeys.hover);
      }
    });
    background.on('pointerout', () => {
      button.setScale(1);
      gloss.setAlpha(useRuntimeButtonFrames ? 0.04 : 0.08);
      if (useRuntimeButtonFrames) {
        background.setAlpha(disabled ? 0.52 : 1);
        background.setTexture(runtimeButtonFrameKeys.normal);
      }
    });
    background.on('pointerdown', () => {
      button.setScale(0.98);
      gloss.setAlpha(useRuntimeButtonFrames ? 0.02 : 0.04);
      if (useRuntimeButtonFrames) {
        background.setAlpha(1);
        background.setTexture(runtimeButtonFrameKeys.pressed);
      }
    });
    background.on('pointerup', () => {
      button.setScale(1.02);
      gloss.setAlpha(useRuntimeButtonFrames ? 0.07 : 0.12);
      if (useRuntimeButtonFrames) {
        background.setAlpha(1);
        background.setTexture(runtimeButtonFrameKeys.hover);
      }
      onClick();
    });
  }

  return button;
}
