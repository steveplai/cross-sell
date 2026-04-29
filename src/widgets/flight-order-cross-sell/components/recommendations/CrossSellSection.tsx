import { ChevronRight } from 'lucide-react'
import { useCallback } from 'react'

import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

import type {
  FlightOrderCrossSellItem,
  FlightOrderCrossSellSection as FlightOrderCrossSellSectionData,
} from '../../types'
import { ProductCard } from './ProductCard'
import { useCarouselPlaceholderLayout } from './useCarouselPlaceholderLayout'
import { ViewMorePlaceholder } from './ViewMorePlaceholder'

const carouselItemClassName =
  'min-w-52 basis-[65%] pl-2 sm:basis-1/2 md:min-w-54.75 md:basis-1/3 lg:basis-1/5'
const viewMoreDestinationUrl = 'https://www.liontravel.com/'

interface CrossSellSectionProps {
  currency: string
  isPromoActive: boolean
  locale: string
  section: FlightOrderCrossSellSectionData
  hideTitle?: boolean
  onSelectItem?: (item: FlightOrderCrossSellItem) => void
  onViewMore?: () => void
}

function getPlaceholderLabel(section: FlightOrderCrossSellSectionData) {
  if (section.kind === 'hotel') {
    return '更多精選飯店'
  }

  if (section.kind === 'attraction') {
    return '更多精選景點'
  }

  if (section.kind === 'transport') {
    return '更多交通選擇'
  }

  if (section.kind === 'flight') {
    return '更多精選機票'
  }

  if (section.title.includes('飯店')) {
    return '更多精選飯店'
  }

  if (section.title.includes('景點')) {
    return '更多精選景點'
  }

  if (section.title.includes('交通')) {
    return '更多交通選擇'
  }

  if (section.title.includes('機票')) {
    return '更多精選機票'
  }

  return section.viewMoreLabel ?? '探索更多'
}

export function CrossSellSection({
  currency,
  hideTitle = false,
  isPromoActive,
  locale,
  section,
  onSelectItem,
  onViewMore,
}: CrossSellSectionProps) {
  const handleViewMore = useCallback(() => {
    onViewMore?.()
  }, [onViewMore])
  const { placeholderBasis, placeholderSpan, setCarouselApi } =
    useCarouselPlaceholderLayout(section.items.length)

  if (section.items.length === 0) {
    return null
  }

  const placeholderLabel = getPlaceholderLabel(section)

  return (
    <section className="bg-background px-5 py-5 md:px-12 md:py-7.5">
      <header className="mb-5 flex items-start justify-between gap-4 md:mb-6">
        <div className="min-w-0">
          {hideTitle ? null : (
            <h2 className="text-base leading-6 font-bold text-foreground md:text-xl">
              {section.title}
            </h2>
          )}
          {section.subtitle ? (
            <p
              className={cn(
                'text-xs text-(--lion-gray-700)',
                hideTitle ? 'mt-0' : 'mt-3',
              )}
            >
              {section.subtitle}
            </p>
          ) : null}
        </div>
        <Button
          asChild
          className="h-auto shrink-0 gap-1 bg-transparent p-0 text-sm leading-5.5 font-bold text-primary hover:bg-transparent hover:text-primary"
          variant="ghost"
        >
          <a
            href={viewMoreDestinationUrl}
            onClick={handleViewMore}
            rel="noopener noreferrer"
            target="_blank"
          >
            {section.viewMoreLabel ?? '探索更多'}
            <ChevronRight aria-hidden="true" className="size-4" />
          </a>
        </Button>
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

      <Carousel
        className="relative"
        data-testid={`section-${section.id}-carousel`}
        opts={{
          align: 'start',
          loop: false,
          slidesToScroll: 'auto',
        }}
        setApi={setCarouselApi}
      >
        <CarouselPrevious
          aria-label="上一組推薦"
          className="-left-10 z-10 hidden size-10 border-0 bg-card p-0 text-(--lion-gray-800) shadow-(--lion-carousel-control-shadow) hover:bg-card hover:text-primary md:flex"
          data-testid={`section-${section.id}-previous`}
          hideWhenUnavailable
        />
        <CarouselContent
          className="-ml-2 pb-2"
          data-testid={`section-${section.id}-items`}
        >
          {section.items.map((item) => (
            <CarouselItem className={carouselItemClassName} key={item.id}>
              <ProductCard
                currency={currency}
                isPromoActive={isPromoActive}
                item={item}
                locale={locale}
                onSelect={() => onSelectItem?.(item)}
              />
            </CarouselItem>
          ))}
          {placeholderSpan > 0 ? (
            <CarouselItem
              className="min-w-52 pl-2 md:min-w-54.75"
              style={{ flexBasis: placeholderBasis }}
            >
              <ViewMorePlaceholder
                href={viewMoreDestinationUrl}
                label={placeholderLabel}
                onViewMore={handleViewMore}
              />
            </CarouselItem>
          ) : null}
        </CarouselContent>
        <CarouselNext
          aria-label="下一組推薦"
          className="-right-10 z-10 hidden size-10 border-0 bg-card p-0 text-(--lion-gray-800) shadow-(--lion-carousel-control-shadow) hover:bg-card hover:text-primary md:flex"
          data-testid={`section-${section.id}-next`}
          hideWhenUnavailable
        />
      </Carousel>
    </section>
  )
}
