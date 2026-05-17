export interface ScreenRuntimeImageAsset {
  key: string;
  path: string;
}

export const SCREEN_RUNTIME_IMAGE_KEYS = {
  titleHeroSwordLogo: 'screen:title:hero-sword-logo',
  partyBackground: 'screen:party:background',
  characterDetailModal: 'screen:character:detail-modal',
  equipmentInventoryPanel: 'screen:equipment:inventory-panel',
  equipmentWorkshopBackground: 'screen:equipment:workshop-background',
  equipmentFrame: 'screen:equipment:frame',
  equipmentPortraitPanel: 'screen:equipment:portrait-panel',
  equipmentWeaponPanel: 'screen:equipment:weapon-panel',
  equipmentArmorPanel: 'screen:equipment:armor-panel',
  equipmentDetailPanel: 'screen:equipment:detail-panel',
  gachaBackdrop: 'screen:gacha:backdrop',
  gachaFeaturePanel: 'screen:gacha:feature-panel',
  gachaConfirmPanel: 'screen:gacha:confirm-panel',
  gachaBannerPanel: 'screen:gacha:banner-panel',
  summonCardBack: 'screen:gacha:summon-card-back',
  gachaRarityBackplate3: 'screen:gacha:rarity-backplate-3',
  gachaRarityBackplate4: 'screen:gacha:rarity-backplate-4',
  gachaRarityBackplate5: 'screen:gacha:rarity-backplate-5',
} as const;

export const SCREEN_RUNTIME_IMAGE_ASSETS: readonly ScreenRuntimeImageAsset[] = [
  { key: SCREEN_RUNTIME_IMAGE_KEYS.titleHeroSwordLogo, path: 'assets/ui/screens/title_hero_sword_logo.png' },
  { key: SCREEN_RUNTIME_IMAGE_KEYS.partyBackground, path: 'assets/ui/screens/party_background.png' },
  { key: SCREEN_RUNTIME_IMAGE_KEYS.characterDetailModal, path: 'assets/ui/screens/character_detail_modal.png' },
  { key: SCREEN_RUNTIME_IMAGE_KEYS.equipmentInventoryPanel, path: 'assets/ui/screens/equipment_inventory_panel.png' },
  { key: SCREEN_RUNTIME_IMAGE_KEYS.equipmentWorkshopBackground, path: 'assets/ui/screens/equipment_workshop_background.png' },
  { key: SCREEN_RUNTIME_IMAGE_KEYS.equipmentFrame, path: 'assets/ui/screens/equipment_frame.png' },
  { key: SCREEN_RUNTIME_IMAGE_KEYS.equipmentPortraitPanel, path: 'assets/ui/screens/equipment_portrait_panel.png' },
  { key: SCREEN_RUNTIME_IMAGE_KEYS.equipmentWeaponPanel, path: 'assets/ui/screens/equipment_weapon_panel.png' },
  { key: SCREEN_RUNTIME_IMAGE_KEYS.equipmentArmorPanel, path: 'assets/ui/screens/equipment_armor_panel.png' },
  { key: SCREEN_RUNTIME_IMAGE_KEYS.equipmentDetailPanel, path: 'assets/ui/screens/equipment_detail_panel.png' },
  { key: SCREEN_RUNTIME_IMAGE_KEYS.gachaBackdrop, path: 'assets/ui/screens/gacha_backdrop.png' },
  { key: SCREEN_RUNTIME_IMAGE_KEYS.gachaFeaturePanel, path: 'assets/ui/screens/gacha_feature_panel.png' },
  { key: SCREEN_RUNTIME_IMAGE_KEYS.gachaConfirmPanel, path: 'assets/ui/screens/gacha_confirm_panel.png' },
  { key: SCREEN_RUNTIME_IMAGE_KEYS.gachaBannerPanel, path: 'assets/ui/screens/gacha_banner_panel.png' },
  { key: SCREEN_RUNTIME_IMAGE_KEYS.summonCardBack, path: 'assets/ui/gacha/summon_card_back.png' },
  { key: SCREEN_RUNTIME_IMAGE_KEYS.gachaRarityBackplate3, path: 'assets/ui/gacha/rarity_3_backplate.png' },
  { key: SCREEN_RUNTIME_IMAGE_KEYS.gachaRarityBackplate4, path: 'assets/ui/gacha/rarity_4_backplate.png' },
  { key: SCREEN_RUNTIME_IMAGE_KEYS.gachaRarityBackplate5, path: 'assets/ui/gacha/rarity_5_backplate.png' },
] as const;
