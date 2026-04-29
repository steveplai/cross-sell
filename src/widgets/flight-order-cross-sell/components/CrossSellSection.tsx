import { ChevronRight } from 'lucide-react'
import { type CSSProperties, useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

import type {
  FlightOrderCrossSellItem,
  FlightOrderCrossSellSection as FlightOrderCrossSellSectionData,
} from '../types'
import { ProductCard } from './ProductCard'

const carouselMaxPageSize = 5
const carouselPageSizeRoundingTolerance = 0.05
const carouselItemClassName =
  'min-w-52 basis-[65%] pl-2 sm:basis-1/2 md:min-w-54.75 md:basis-1/3 lg:basis-1/5'
const initialCarouselLayout = {
  pageSize: carouselMaxPageSize,
  slideWidth: 0,
  viewportWidth: 0,
}

interface CrossSellSectionProps {
  currency: string
  isPromoActive: boolean
  locale: string
  section: FlightOrderCrossSellSectionData
  onSelectItem?: (item: FlightOrderCrossSellItem) => void
  onViewMore?: () => void
}

function getVisiblePageSize(api: CarouselApi) {
  const viewportWidth = api?.rootNode().getBoundingClientRect().width ?? 0
  const slideWidth = api?.slideNodes()[0]?.getBoundingClientRect().width ?? 0

  if (viewportWidth <= 0 || slideWidth <= 0) {
    return initialCarouselLayout
  }

  return {
    pageSize: Math.min(
      carouselMaxPageSize,
      Math.max(
        1,
        Math.floor(
          viewportWidth / slideWidth + carouselPageSizeRoundingTolerance,
        ),
      ),
    ),
    slideWidth,
    viewportWidth,
  }
}

function getPlaceholderSpan(itemCount: number, pageSize: number) {
  if (pageSize <= 1) {
    return 1
  }

  const remainder = itemCount % pageSize

  return remainder === 0 ? 0 : pageSize - remainder
}

function getPlaceholderBasis(
  itemCount: number,
  placeholderSpan: number,
  layout: typeof initialCarouselLayout,
) {
  if (placeholderSpan <= 0) {
    return '0px'
  }

  if (layout.slideWidth <= 0 || layout.viewportWidth <= 0) {
    return `${placeholderSpan * 20}%`
  }

  if (layout.pageSize <= 1) {
    return `${layout.slideWidth}px`
  }

  const finalPageItemCount = itemCount % layout.pageSize
  const occupiedWidth = finalPageItemCount * layout.slideWidth
  const remainingWidth = layout.viewportWidth - occupiedWidth
  const minimumPlaceholderWidth = layout.slideWidth * placeholderSpan

  return `${Math.max(minimumPlaceholderWidth, remainingWidth)}px`
}

function getPlaceholderLabel(section: FlightOrderCrossSellSectionData) {
  if (section.title.includes('飯店')) {
    return '更多精選飯店'
  }

  if (section.title.includes('景點')) {
    return '更多精選景點'
  }

  if (section.title.includes('交通')) {
    return '更多交通選擇'
  }

  return section.viewMoreLabel ?? '探索更多'
}

function ViewMorePlaceholder({
  label,
  onViewMore,
}: {
  label: string
  onViewMore?: () => void
}) {
  return (
    <button
      aria-label={label}
      className="flex h-full min-h-70.75 w-full flex-col items-center justify-center gap-3 rounded-lg border border-(--lion-gray-200) bg-card p-4 text-primary shadow-(--lion-product-card-shadow)"
      data-testid="cross-sell-view-more-placeholder"
      onClick={onViewMore}
      type="button"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-(--lion-red-100)">
        <ChevronRight aria-hidden="true" className="size-6" />
      </span>
      <span className="text-xs leading-5.5 font-bold">{label}</span>
    </button>
  )
}

export function CrossSellSection({
  currency,
  isPromoActive,
  locale,
  section,
  onSelectItem,
  onViewMore,
}: CrossSellSectionProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [carouselLayout, setCarouselLayout] = useState(initialCarouselLayout)

  const updateCarouselLayout = useCallback((api: CarouselApi) => {
    if (!api) {
      return
    }

    const nextLayout = getVisiblePageSize(api)

    setCarouselLayout((currentLayout) => {
      if (
        currentLayout.pageSize === nextLayout.pageSize &&
        currentLayout.slideWidth === nextLayout.slideWidth &&
        currentLayout.viewportWidth === nextLayout.viewportWidth
      ) {
        return currentLayout
      }

      return nextLayout
    })
  }, [])

  useEffect(() => {
    if (!carouselApi) {
      return
    }

    const ownerWindow = carouselApi.rootNode().ownerDocument.defaultView
    const animationFrameId = ownerWindow?.requestAnimationFrame(() => {
      updateCarouselLayout(carouselApi)
    })

    carouselApi.on('resize', updateCarouselLayout)
    carouselApi.on('reInit', updateCarouselLayout)

    return () => {
      if (animationFrameId !== undefined) {
        ownerWindow?.cancelAnimationFrame(animationFrameId)
      }

      carouselApi.off('resize', updateCarouselLayout)
      carouselApi.off('reInit', updateCarouselLayout)
    }
  }, [carouselApi, updateCarouselLayout])

  if (section.items.length === 0) {
    return null
  }

  const placeholderSpan = getPlaceholderSpan(
    section.items.length,
    carouselLayout.pageSize,
  )
  const placeholderBasis = getPlaceholderBasis(
    section.items.length,
    placeholderSpan,
    carouselLayout,
  )
  const placeholderLabel = getPlaceholderLabel(section)

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
        <Button
          className="h-auto shrink-0 gap-1 bg-transparent p-0 text-sm leading-5.5 font-bold text-primary hover:bg-transparent hover:text-primary"
          onClick={onViewMore}
          type="button"
          variant="ghost"
        >
          {section.viewMoreLabel ?? '探索更多'}
          <ChevronRight aria-hidden="true" className="size-4" />
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
              style={
                {
                  flexBasis: placeholderBasis,
                } as CSSProperties
              }
            >
              <ViewMorePlaceholder
                label={placeholderLabel}
                onViewMore={onViewMore}
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
