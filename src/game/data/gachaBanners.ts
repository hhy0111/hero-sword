export interface GachaBannerDefinition {
  id: string;
  name: string;
  tagLine: string;
  featuredIds: string[];
}

const GACHA_BANNERS: GachaBannerDefinition[] = [
  {
    id: 'featured_hero',
    name: '성검의 맹세',
    tagLine: '세라핀 / 루시안 / 라일라 픽업',
    featuredIds: ['seraphin', 'lucian', 'laila', 'micaela'],
  },
  {
    id: 'featured_weapon',
    name: '복원 무기고',
    tagLine: '서약의 성검 / 흑월 추적쌍검 픽업',
    featuredIds: ['wp_oath_blade', 'wp_black_moon_daggers', 'wp_sand_relic_staff', 'wp_frost_greatsword'],
  },
];

export function getGachaBanners(): GachaBannerDefinition[] {
  return GACHA_BANNERS;
}

export function getGachaBanner(id: string): GachaBannerDefinition {
  const banner = GACHA_BANNERS.find((entry) => entry.id === id);

  if (!banner) {
    throw new Error(`Unknown gacha banner: ${id}`);
  }

  return banner;
}
