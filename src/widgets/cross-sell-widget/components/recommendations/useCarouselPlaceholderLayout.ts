import { useCallback, useEffect, useState } from 'react'

import type { CarouselApi } from '@/components/ui/carousel'

const carouselMaxPageSize = 5
const carouselPageSizeRoundingTolerance = 0.05
const initialCarouselLayout = {
  pageSize: carouselMaxPageSize,
  slideWidth: 0,
  viewportWidth: 0,
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

export function useCarouselPlaceholderLayout(itemCount: number) {
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

  const placeholderSpan = getPlaceholderSpan(itemCount, carouselLayout.pageSize)
  const placeholderBasis = getPlaceholderBasis(
    itemCount,
    placeholderSpan,
    carouselLayout,
  )

  return {
    placeholderBasis,
    placeholderSpan,
    setCarouselApi,
  }
}
