import type {
  CrossSellWidgetProps,
  CrossSellWidgetResolvedSection,
} from '../../types'
import { AttractionDecorBanner } from './AttractionDecorBanner'
import { CrossSellSectionList } from './CrossSellSectionList'

interface AttractionRecommendationsPanelProps extends Pick<
  CrossSellWidgetProps,
  'onSelectItem' | 'onViewMore'
> {
  currency: string
  isPromoActive: boolean
  locale: string
  sections: CrossSellWidgetResolvedSection[]
}

export function AttractionRecommendationsPanel({
  currency,
  isPromoActive,
  locale,
  onSelectItem,
  onViewMore,
  sections,
}: AttractionRecommendationsPanelProps) {
  const title = sections[0]?.title ?? ''

  return (
    <div className="overflow-hidden bg-background">
      <AttractionDecorBanner title={title} />
      <div className="relative z-10 -mt-5 overflow-hidden rounded-t-[20px] bg-background lion-desktop:rounded-t-[24px]">
        <CrossSellSectionList
          currency={currency}
          hideTitle
          isPromoActive={isPromoActive}
          locale={locale}
          onSelectItem={onSelectItem}
          onViewMore={onViewMore}
          sectionClassName="pt-3 lion-desktop:pt-3.75"
          sections={sections}
        />
      </div>
    </div>
  )
}
