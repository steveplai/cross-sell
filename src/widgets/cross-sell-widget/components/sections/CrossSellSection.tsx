import { ChevronRight } from 'lucide-react'

import { ProductCard } from '../cards/ProductCard'
import { ViewMorePlaceholder } from './ViewMorePlaceholder'
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

      <div
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
        data-testid="cross-sell-carousel"
      >
        {section.items.map((item) => (
          <div
            className="min-w-[280px] flex-1 snap-start lion-desktop:min-w-[360px]"
            key={item.id}
          >
            <ProductCard
              currency={currency}
              item={item}
              locale={locale}
              onClick={() => onSelectItem?.(item)}
            />
          </div>
        ))}

        <div className="min-w-[220px] snap-start lion-desktop:min-w-[260px]">
          <ViewMorePlaceholder
            href={section.viewMoreHref}
            label={section.viewMorePlaceholderLabel}
            onViewMore={onViewMore}
          />
        </div>
      </div>
    </section>
  )
}
