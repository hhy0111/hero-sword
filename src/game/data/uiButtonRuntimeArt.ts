export interface UiButtonImageAsset {
  key: string;
  path: string;
}

export const UI_BUTTON_IMAGE_KEYS = {
  normal: 'ui-button:normal',
  hover: 'ui-button:hover',
  pressed: 'ui-button:pressed',
  disabled: 'ui-button:disabled',
} as const;

export type UiButtonState = keyof typeof UI_BUTTON_IMAGE_KEYS;

export const UI_BUTTON_IMAGE_ASSETS: readonly UiButtonImageAsset[] = [
  { key: UI_BUTTON_IMAGE_KEYS.normal, path: 'assets/ui/buttons/frame_normal.png' },
  { key: UI_BUTTON_IMAGE_KEYS.hover, path: 'assets/ui/buttons/frame_hover.png' },
  { key: UI_BUTTON_IMAGE_KEYS.pressed, path: 'assets/ui/buttons/frame_pressed.png' },
  { key: UI_BUTTON_IMAGE_KEYS.disabled, path: 'assets/ui/buttons/frame_disabled.png' },
] as const;

export function getUiButtonFrameKey(state: UiButtonState): string {
  return UI_BUTTON_IMAGE_KEYS[state];
}
