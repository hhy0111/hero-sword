export interface StageSelectImageAsset {
  key: string;
  path: string;
}

export const STAGE_SELECT_IMAGE_KEYS = {
  previewFrame: 'stage-select:preview-frame',
  routeCardOpen: 'stage-select:route-card-open',
  routeCardLocked: 'stage-select:route-card-locked',
  routeCardSelected: 'stage-select:route-card-selected',
  routeCardBoss: 'stage-select:route-card-boss',
  routeMarkerAvailable: 'stage-select:route-marker-available',
  routeMarkerCleared: 'stage-select:route-marker-cleared',
  routeMarkerLocked: 'stage-select:route-marker-locked',
} as const;

export const STAGE_SELECT_IMAGE_ASSETS: readonly StageSelectImageAsset[] = [
  { key: STAGE_SELECT_IMAGE_KEYS.previewFrame, path: 'assets/ui/stage-select/preview_frame.png' },
  { key: STAGE_SELECT_IMAGE_KEYS.routeCardOpen, path: 'assets/ui/stage-select/route_card_open.png' },
  { key: STAGE_SELECT_IMAGE_KEYS.routeCardLocked, path: 'assets/ui/stage-select/route_card_locked.png' },
  { key: STAGE_SELECT_IMAGE_KEYS.routeCardSelected, path: 'assets/ui/stage-select/route_card_selected.png' },
  { key: STAGE_SELECT_IMAGE_KEYS.routeCardBoss, path: 'assets/ui/stage-select/route_card_boss.png' },
  { key: STAGE_SELECT_IMAGE_KEYS.routeMarkerAvailable, path: 'assets/ui/stage-select/stage_route_marker_available.png' },
  { key: STAGE_SELECT_IMAGE_KEYS.routeMarkerCleared, path: 'assets/ui/stage-select/stage_route_marker_cleared.png' },
  { key: STAGE_SELECT_IMAGE_KEYS.routeMarkerLocked, path: 'assets/ui/stage-select/stage_route_marker_locked.png' },
] as const;

export function getStageRouteCardFrameKey(state: 'open' | 'locked' | 'selected' | 'boss'): string {
  switch (state) {
    case 'locked':
      return STAGE_SELECT_IMAGE_KEYS.routeCardLocked;
    case 'selected':
      return STAGE_SELECT_IMAGE_KEYS.routeCardSelected;
    case 'boss':
      return STAGE_SELECT_IMAGE_KEYS.routeCardBoss;
    case 'open':
    default:
      return STAGE_SELECT_IMAGE_KEYS.routeCardOpen;
  }
}

export function getStageRouteMarkerKey(state: 'available' | 'cleared' | 'locked'): string {
  switch (state) {
    case 'locked':
      return STAGE_SELECT_IMAGE_KEYS.routeMarkerLocked;
    case 'cleared':
      return STAGE_SELECT_IMAGE_KEYS.routeMarkerCleared;
    case 'available':
    default:
      return STAGE_SELECT_IMAGE_KEYS.routeMarkerAvailable;
  }
}
