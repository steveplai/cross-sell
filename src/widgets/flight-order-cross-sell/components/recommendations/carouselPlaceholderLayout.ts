import type { CarouselApi } from '@/components/ui/carousel'

import type { FlightOrderCrossSellSection } from '../../types'

const carouselMaxPageSize = 5
const carouselPageSizeRoundingTolerance = 0.05

export const initialCarouselLayout = {
  pageSize: carouselMaxPageSize,
  slideWidth: 0,
  viewportWidth: 0,
}

export function getVisiblePageSize(api: CarouselApi) {
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

export function getPlaceholderSpan(itemCount: number, pageSize: number) {
  if (pageSize <= 1) {
    return 1
  }

  const remainder = itemCount % pageSize

  return remainder === 0 ? 0 : pageSize - remainder
}

export function getPlaceholderBasis(
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

export function getPlaceholderLabel(section: FlightOrderCrossSellSection) {
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
