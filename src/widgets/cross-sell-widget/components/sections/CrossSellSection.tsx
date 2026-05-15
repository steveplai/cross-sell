import { ChevronRight } from 'lucide-react'

import { ProductCard } from '../cards/ProductCard'
import type { CrossSellWidgetItem, CrossSellWidgetResolvedSection } from '../../types'

interface CrossSellSectionProps {
  currency: string
  isPromoActive: boolean
  locale: string
  onSelectItem?: (item: CrossSellWidgetItem) => void
  onViewMore?: () => void
  section: CrossSellWidgetResolvedSection
}

export function CrossSellSection({
  currency,
  locale,
  onSelectItem,
  onViewMore,
  section,
}: CrossSellSectionProps) {
  return (
    <section className="bg-background px-4 py-5 lion-desktop:px-6 lion-desktop:py-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg font-bold lion-desktop:text-xl">
            {section.title}
          </h2>

          {section.subtitle ? (
            <p className="text-sm text-muted-foreground">
              {section.subtitle}
            </p>
          ) : null}
        </div>

        {section.viewMoreHref || onViewMore ? (
          <button
            className="inline-flex items-center gap-1 text-sm font-medium text-(--lion-primary-600)"
            onClick={onViewMore}
            type="button"
          >
            {section.viewMoreLabel}
            <ChevronRight className="size-4" />
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 lion-tablet:grid-cols-2 lion-desktop:grid-cols-3">
        {section.items.map((item) => (
          <ProductCard
            currency={currency}
            item={item}
            key={item.id}
            locale={locale}
            onClick={() => onSelectItem?.(item)}
          />
        ))}
      </div>
    </section>
  )
}
