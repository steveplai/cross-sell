import type {
  TravelPlanCrossSellSection,
  TravelPlanCrossSellSectionVariant,
} from '../types'
import type { TravelPlanCrossSellAssetUrls } from './shared-assets'

export type TravelPlanCrossSellSectionKey =
  | 'transportation'
  | 'hotel'
  | 'localExperience'
  | 'rail'
  | 'visaPassport'

type AssetUrlKey = keyof Pick<
  TravelPlanCrossSellAssetUrls,
  | 'bedIconUrl'
  | 'mountainIconUrl'
  | 'passportIconUrl'
  | 'trainIconUrl'
  | 'transportIconUrl'
>

interface SectionCatalogItem {
  ctaLabel: string
  description: string
  iconAlt: string
  iconUrlKey: AssetUrlKey
  id: string
  title: string
}

interface CreateSectionOptions {
  assetUrls: TravelPlanCrossSellAssetUrls
  ctaIconUrl?: string
  ctaUrl: string
  description?: string
  recommendations?: TravelPlanCrossSellSection['recommendations']
  recommendationsTitle?: string
  showHeaderDescriptionAndCta?: boolean
  variant?: TravelPlanCrossSellSectionVariant
}

const sectionCatalog = {
  hotel: {
    ctaLabel: '搜尋附近飯店',
    description: '熱門的優質住宿極易滿房，建議您優先卡位！',
    iconAlt: '訂房',
    iconUrlKey: 'bedIconUrl',
    id: 'hotel',
    title: '飯店下榻',
  },
  localExperience: {
    ctaLabel: '探索遊玩體驗',
    description: '行程沒頭緒？熱門票券與一日遊先卡位',
    iconAlt: '當地遊',
    iconUrlKey: 'mountainIconUrl',
    id: 'local-experience',
    title: '在地探索',
  },
  rail: {
    ctaLabel: '查詢高鐵班次',
    description: '結束完美旅程，預訂回程高鐵安心返家',
    iconAlt: '台灣高鐵',
    iconUrlKey: 'trainIconUrl',
    id: 'rail',
    title: '高鐵加購',
  },
  transportation: {
    ctaLabel: '預訂交通票券',
    description: '落地第一步，先搞定機場到市區交通',
    iconAlt: '交通',
    iconUrlKey: 'transportIconUrl',
    id: 'transportation',
    title: '抵達啟程',
  },
  visaPassport: {
    ctaLabel: '申請簽證代辦',
    description: '出發前最重要的事！確認效期與簽證早安心',
    iconAlt: '簽證護照',
    iconUrlKey: 'passportIconUrl',
    id: 'visa-passport',
    title: '簽證護照',
  },
} satisfies Record<TravelPlanCrossSellSectionKey, SectionCatalogItem>

export function createTravelPlanCrossSellSection(
  key: TravelPlanCrossSellSectionKey,
  {
    assetUrls,
    ctaIconUrl,
    ctaUrl,
    description,
    recommendations,
    recommendationsTitle,
    showHeaderDescriptionAndCta,
    variant,
  }: CreateSectionOptions,
): TravelPlanCrossSellSection {
  const section = sectionCatalog[key]

  return {
    ctaIconUrl,
    ctaLabel: section.ctaLabel,
    ctaUrl,
    description: description ?? section.description,
    iconAlt: section.iconAlt,
    iconUrl: assetUrls[section.iconUrlKey],
    id: section.id,
    recommendations,
    recommendationsTitle,
    showHeaderDescriptionAndCta,
    title: section.title,
    variant,
  }
}
