import { ChevronRight } from 'lucide-react'
import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

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

// Keep carousel density breakpoints in sync with ../../docs/breakpoints.md.
const carouselItemClassName = cn(
  'pl-2',
  'basis-[65%]',
  'min-[488px]:max-[711.98px]:basis-1/2',
  'min-[712px]:max-[935.98px]:basis-1/3',
  'min-[936px]:max-[1189.98px]:basis-1/4',
  'min-[1190px]:basis-1/5',
)
const viewMoreDestinationUrl = 'https://www.liontravel.com/'
const categoryDragThresholdPx = 5
const categoryOverflowIndicatorClassName =
  'pointer-events-none absolute top-0 h-5.75 transition-opacity duration-200 ease-out'
const emptyCategoryOverflow = {
  end: false,
  start: false,
}

interface CrossSellSectionProps {
  currency: string
  isPromoActive: boolean
  locale: string
  section: FlightOrderCrossSellSectionData
  className?: string
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

function useCategoryDragScroll(itemsCount: number) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef({
    hasDragged: false,
    isPointerDown: false,
    pointerId: null as number | null,
    startScrollLeft: 0,
    startX: 0,
  })
  const [isDragging, setIsDragging] = useState(false)
  const [overflow, setOverflow] = useState(emptyCategoryOverflow)

  const updateOverflowState = useCallback(() => {
    const scrollElement = scrollRef.current

    if (!scrollElement) {
      return
    }

    const maxScrollLeft = Math.max(
      0,
      scrollElement.scrollWidth - scrollElement.clientWidth,
    )
    const scrollLeft = Math.min(
      maxScrollLeft,
      Math.max(0, scrollElement.scrollLeft),
    )
    const nextOverflow = {
      // Show the right hint while there is still content available to the right.
      end: maxScrollLeft > 1 && scrollLeft < maxScrollLeft - 1,
      // Show the left hint only after the row reaches the far-right edge.
      start: maxScrollLeft > 1 && scrollLeft >= maxScrollLeft - 1,
    }

    setOverflow((currentOverflow) => {
      if (
        currentOverflow.end === nextOverflow.end &&
        currentOverflow.start === nextOverflow.start
      ) {
        return currentOverflow
      }

      return nextOverflow
    })
  }, [])

  useEffect(() => {
    updateOverflowState()
  }, [itemsCount, updateOverflowState])

  useEffect(() => {
    const scrollElement = scrollRef.current

    if (!scrollElement) {
      return undefined
    }

    const handleScroll = () => {
      updateOverflowState()
    }
    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(updateOverflowState)

    scrollElement.addEventListener('scroll', handleScroll, { passive: true })
    resizeObserver?.observe(scrollElement)
    window.addEventListener('resize', updateOverflowState)

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
      resizeObserver?.disconnect()
      window.removeEventListener('resize', updateOverflowState)
    }
  }, [updateOverflowState])

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const scrollElement = scrollRef.current

      if (
        !scrollElement ||
        event.button !== 0 ||
        scrollElement.scrollWidth - scrollElement.clientWidth <= 1
      ) {
        return
      }

      dragStateRef.current = {
        hasDragged: false,
        isPointerDown: true,
        pointerId: event.pointerId,
        startScrollLeft: scrollElement.scrollLeft,
        startX: event.clientX,
      }
      scrollElement.setPointerCapture?.(event.pointerId)
      setIsDragging(true)
    },
    [],
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const scrollElement = scrollRef.current
      const dragState = dragStateRef.current

      if (!scrollElement || !dragState.isPointerDown) {
        return
      }

      const deltaX = event.clientX - dragState.startX

      if (Math.abs(deltaX) > categoryDragThresholdPx) {
        dragState.hasDragged = true
      }

      if (!dragState.hasDragged) {
        return
      }

      event.preventDefault()
      scrollElement.scrollLeft = dragState.startScrollLeft - deltaX
      updateOverflowState()
    },
    [updateOverflowState],
  )

  const stopDragging = useCallback(
    (_event: ReactPointerEvent<HTMLDivElement>) => {
      const scrollElement = scrollRef.current
      const dragState = dragStateRef.current

      if (!dragState.isPointerDown) {
        return
      }

      if (dragState.pointerId !== null) {
        scrollElement?.releasePointerCapture?.(dragState.pointerId)
      }

      dragState.isPointerDown = false
      dragState.pointerId = null
      setIsDragging(false)
      updateOverflowState()
    },
    [updateOverflowState],
  )

  const handleClickCapture = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      const dragState = dragStateRef.current

      if (!dragState.hasDragged) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      dragState.hasDragged = false
    },
    [],
  )

  return {
    handleClickCapture,
    handlePointerDown,
    handlePointerMove,
    isDragging,
    overflow,
    scrollRef,
    stopDragging,
  }
}

export function CrossSellSection({
  className,
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
  const {
    handleClickCapture,
    handlePointerDown,
    handlePointerMove,
    isDragging,
    overflow: categoryOverflow,
    scrollRef: categoryScrollRef,
    stopDragging,
  } = useCategoryDragScroll(section.categories?.length ?? 0)
  const { placeholderBasis, placeholderSpan, setCarouselApi } =
    useCarouselPlaceholderLayout(section.items.length)

  if (section.items.length === 0) {
    return null
  }

  const placeholderLabel = getPlaceholderLabel(section)
  const canDragCategories = categoryOverflow.start || categoryOverflow.end

  return (
    <section
      className={cn(
        'bg-background px-5 py-5 lion-desktop:px-12 lion-desktop:py-7.5',
        className,
      )}
    >
      <header className="mb-5 flex items-start justify-between gap-4 lion-desktop:mb-6">
        <div className="min-w-0">
          {hideTitle ? null : (
            <h2 className="text-base leading-6 font-bold text-foreground lion-desktop:text-xl">
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
        <div className="relative mb-4">
          <div
            className={cn(
              'flex touch-pan-y gap-2 overflow-x-auto overscroll-x-contain pb-1 select-none',
              '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
              canDragCategories &&
                (isDragging ? 'cursor-grabbing' : 'cursor-grab'),
            )}
            data-testid={`section-${section.id}-categories`}
            onClickCapture={handleClickCapture}
            onLostPointerCapture={stopDragging}
            onPointerCancel={stopDragging}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            ref={categoryScrollRef}
          >
            {section.categories.map((category, index) => (
              <Button
                asChild
                className={cn(
                  'h-5.75 shrink-0 rounded-[4px] bg-(--lion-gray-100) px-2 py-0.5',
                  'text-xs leading-4.75 font-normal text-(--lion-gray-800) shadow-none',
                  'hover:bg-(--lion-gray-100) hover:text-primary',
                )}
                key={category.id ?? `${category.label}-${index}`}
                size="xs"
                variant="ghost"
              >
                <a
                  draggable={false}
                  href={category.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {category.label}
                </a>
              </Button>
            ))}
          </div>
          <div
            aria-hidden="true"
            className={cn(
              categoryOverflowIndicatorClassName,
              'left-0 w-18 bg-linear-to-r from-background/90 via-background/50 to-background/0',
              'shadow-(--lion-category-overflow-shadow-start)',
              categoryOverflow.start ? 'opacity-100' : 'opacity-0',
            )}
            data-testid={`section-${section.id}-categories-overflow-start`}
          />
          <div
            aria-hidden="true"
            className={cn(
              categoryOverflowIndicatorClassName,
              'right-0 w-18 bg-linear-to-l from-background/90 via-background/50 to-background/0',
              'shadow-(--lion-category-overflow-shadow-end)',
              categoryOverflow.end ? 'opacity-100' : 'opacity-0',
            )}
            data-testid={`section-${section.id}-categories-overflow-end`}
          />
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
          className="-left-10 z-10 hidden size-10 border-0 bg-card p-0 text-(--lion-gray-800) shadow-(--lion-carousel-control-shadow) hover:bg-card hover:text-primary lion-desktop:flex"
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
              className="pl-2"
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
          className="-right-10 z-10 hidden size-10 border-0 bg-card p-0 text-(--lion-gray-800) shadow-(--lion-carousel-control-shadow) hover:bg-card hover:text-primary lion-desktop:flex"
          data-testid={`section-${section.id}-next`}
          hideWhenUnavailable
        />
      </Carousel>
    </section>
  )
}
