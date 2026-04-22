import { MapPin, Star, Users } from 'lucide-react'

import { formatCurrency } from '../../../shared/utils/formatCurrency'
import type { FlightOrderCrossSellItem } from '../types'

interface ProductCardProps {
  currency: string
  isPromoActive: boolean
  item: FlightOrderCrossSellItem
  locale: string
  onSelect: () => void
}

function formatReviewCount(reviewCount?: number) {
  return typeof reviewCount === 'number' ? `(${reviewCount})` : undefined
}

export function ProductCard({
  currency,
  isPromoActive,
  item,
  locale,
  onSelect,
}: ProductCardProps) {
  const imageBadge = isPromoActive
    ? (item.promoBadge ?? item.badge)
    : item.badge
  const reviewCount = formatReviewCount(item.reviewCount)

  return (
    <article className="w-50 shrink-0 overflow-hidden rounded-[5px] bg-white shadow-[0_0_8px_rgba(0,0,0,0.18)] md:w-52.75">
      <button
        className="block w-full border-0 bg-transparent p-0 text-left text-inherit"
        onClick={onSelect}
        type="button"
      >
        <div className="relative h-29.25 w-full overflow-hidden rounded-t-[5px] bg-[#f4f4f4]">
          {item.imageUrl ? (
            <img
              alt=""
              className="h-full w-full object-cover"
              src={item.imageUrl}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#f7f7f7] text-sm font-bold text-[#999]">
              {item.title.slice(0, 1)}
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-8 bg-linear-to-b from-black/0 to-black/80" />
          {imageBadge ? (
            <span className="absolute top-1.25 left-1.25 rounded-[5px] bg-[#f03742] px-1.25 py-0.5 text-xs leading-4.5 text-white">
              {imageBadge}
            </span>
          ) : null}
          {item.location ? (
            <span className="absolute bottom-1 left-2 flex max-w-[calc(100%-16px)] items-center gap-1 truncate text-xs leading-5.5 text-white">
              <MapPin aria-hidden="true" className="size-3 shrink-0" />
              <span className="truncate">{item.location}</span>
            </span>
          ) : null}
        </div>

        <div className="flex min-h-41.5 flex-col gap-3 p-2">
          <div className="flex flex-1 flex-col gap-1">
            <h3 className="line-clamp-2 min-h-8.5 text-xs leading-4.25 font-bold text-[#222]">
              {item.title}
            </h3>

            {item.rating ? (
              <div className="flex items-center gap-1 text-xs leading-5.5">
                <span className="inline-flex items-center rounded bg-[#fff3e5] px-1.5 text-sm leading-5 font-medium text-[#ff8400]">
                  {item.rating}
                </span>
                {item.ratingLabel ? (
                  <span className="font-bold text-[#444]">
                    {item.ratingLabel}
                  </span>
                ) : (
                  <Star
                    aria-hidden="true"
                    className="size-3 fill-[#ff8400] text-[#ff8400]"
                  />
                )}
                {reviewCount ? (
                  <span className="text-[10px] text-[#999]">{reviewCount}</span>
                ) : null}
              </div>
            ) : null}

            {item.interestLabel ? (
              <p className="flex items-center gap-1 text-xs leading-5.5 text-[#444]">
                <Users aria-hidden="true" className="size-3 text-[#777]" />
                {item.interestLabel}
              </p>
            ) : null}

            {item.cancellationLabel ? (
              <p className="text-[10px] leading-4.5 text-[#3ea5d9]">
                {item.cancellationLabel}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col items-end">
            {isPromoActive && (item.originalPrice || item.discountLabel) ? (
              <div className="flex items-center justify-end gap-1 text-right">
                {item.originalPrice ? (
                  <span className="text-[10px] leading-4.5 text-[#999] line-through">
                    {formatCurrency(item.originalPrice, locale, currency)}
                  </span>
                ) : null}
                {item.discountLabel ? (
                  <span className="rounded bg-[#ffefef] px-2 py-0.5 text-xs leading-4.75 font-medium text-[#f03742]">
                    {item.discountLabel}
                  </span>
                ) : null}
              </div>
            ) : null}
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-xs leading-5.5 text-[#383838]">
                {item.pricePrefix ?? currency}
              </span>
              <span className="text-lg leading-7 font-bold text-[#f03742]">
                {new Intl.NumberFormat(locale, {
                  maximumFractionDigits: 0,
                }).format(item.price)}
              </span>
              {item.priceSuffix ? (
                <span className="text-xs leading-5.5 text-[#383838]">
                  {item.priceSuffix}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </button>
    </article>
  )
}
