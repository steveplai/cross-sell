import type {
  CrossSellWidgetProps,
  CrossSellWidgetResolvedSection,
} from '../../types'
import { CrossSellSection } from './CrossSellSection'

interface CrossSellSectionListProps extends Pick<
  CrossSellWidgetProps,
  'onSelectItem' | 'onViewMore'
> {
  currency: string
  isPromoActive: boolean
  locale: string
  sections: CrossSellWidgetResolvedSection[]
  hideTitle?: boolean
  sectionClassName?: string
}

export function CrossSellSectionList({
  currency,
  hideTitle,
  isPromoActive,
  locale,
  onSelectItem,
  onViewMore,
  sectionClassName,
  sections,
}: CrossSellSectionListProps) {
  return (
    <div className="flex flex-col divide-y divide-(--lion-gray-50)">
      {sections.map((section) => (
        <CrossSellSection
          className={sectionClassName}
          currency={currency}
          hideTitle={hideTitle}
          isPromoActive={isPromoActive}
          key={section.id}
          locale={locale}
          onSelectItem={(item) =>
            onSelectItem?.({ item, sectionId: section.id })
          }
          onViewMore={() => onViewMore?.({ sectionId: section.id })}
          section={section}
        />
      ))}
    </div>
  )
}
