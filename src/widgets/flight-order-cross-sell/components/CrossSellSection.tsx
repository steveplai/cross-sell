import { ChevronRight } from 'lucide-react'
import { useRef } from 'react'

import type {
  FlightOrderCrossSellItem,
  FlightOrderCrossSellSection as FlightOrderCrossSellSectionData,
} from '../types'
import { CarouselNavButton } from './CarouselNavButton'
import { ProductCard } from './ProductCard'

interface CrossSellSectionProps {
  currency: string
  isPromoActive: boolean
  locale: string
  section: FlightOrderCrossSellSectionData
  onSelectItem?: (item: FlightOrderCrossSellItem) => void
  onViewMore?: () => void
}

export function CrossSellSection({
  currency,
  isPromoActive,
  locale,
  section,
  onSelectItem,
  onViewMore,
}: CrossSellSectionProps) {
  const listRef = useRef<HTMLDivElement>(null)

  if (section.items.length === 0) {
    return null
  }

  function scrollByCard(direction: 'next' | 'previous') {
    listRef.current?.scrollBy({
      behavior: 'smooth',
      left: direction === 'next' ? 442 : -442,
    })
  }

  return (
    <section className="bg-background px-5 py-5 md:px-12 md:py-7.5">
      <header className="mb-5 flex items-start justify-between gap-4 md:mb-6">
        <div className="min-w-0">
          <h2 className="text-base leading-6 font-bold text-foreground md:text-xl">
            {section.title}
          </h2>
          {section.subtitle ? (
            <p className="mt-3 text-xs text-(--lion-gray-700)">
              {section.subtitle}
            </p>
          ) : null}
        </div>
        <button
          className="flex shrink-0 items-center gap-1 border-0 bg-transparent p-0 text-sm leading-5.5 font-bold text-primary"
          onClick={onViewMore}
          type="button"
        >
          {section.viewMoreLabel ?? '探索更多'}
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </header>

      {section.categories && section.categories.length > 0 ? (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {section.categories.map((category, index) => (
            <span
              className="shrink-0 rounded-full bg-(--lion-gray-50) px-3 py-1 text-xs leading-5 text-(--lion-gray-700)"
              key={`${category}-${index}`}
            >
              {category}
            </span>
          ))}
        </div>
      ) : null}

      <div className="relative">
        <CarouselNavButton
          direction="previous"
          onClick={() => scrollByCard('previous')}
        />
        <div
          className="flex gap-2 overflow-x-auto scroll-smooth px-0 pb-2 md:gap-2.5 md:px-0"
          data-testid={`section-${section.id}-items`}
          ref={listRef}
        >
          {section.items.map((item) => (
            <ProductCard
              currency={currency}
              isPromoActive={isPromoActive}
              item={item}
              key={item.id}
              locale={locale}
              onSelect={() => onSelectItem?.(item)}
            />
          ))}
        </div>
        <CarouselNavButton
          direction="next"
          onClick={() => scrollByCard('next')}
        />
      </div>
    </section>
  )
}
