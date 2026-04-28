import { MapPin, Star, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

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

function getStarRating(starRating?: number) {
  if (typeof starRating !== 'number' || Number.isNaN(starRating)) {
    return undefined
  }

  return Math.min(5, Math.max(0, Math.round(starRating)))
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
  const starRating = getStarRating(item.starRating)
  const formattedPrice = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(item.price)

  return (
    <article className="h-full min-w-0">
      <Button
        className="block h-full w-full rounded-[5px] bg-transparent p-0 text-left font-normal whitespace-normal text-card-foreground shadow-none hover:bg-transparent hover:text-card-foreground"
        onClick={onSelect}
        type="button"
        variant="ghost"
      >
        <Card className="h-full gap-0 overflow-hidden rounded-[5px] border border-(--lion-gray-200) bg-card py-0 shadow-(--lion-product-card-shadow)">
          <div className="relative h-29.25 w-full overflow-hidden rounded-t-[5px] bg-(--lion-gray-50)">
            {item.imageUrl ? (
              <img
                alt=""
                className="h-full w-full object-cover"
                src={item.imageUrl}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-(--lion-gray-50) text-sm font-bold text-muted-foreground">
                {item.title.slice(0, 1)}
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-6.75 bg-linear-to-b from-black/0 to-black/80" />
            {imageBadge ? (
              <Badge className="absolute top-1.25 left-1.25 h-5.5 rounded-[5px] bg-primary px-1.25 py-0 text-xs leading-5.5 font-normal text-primary-foreground shadow-none hover:bg-primary">
                {imageBadge}
              </Badge>
            ) : null}
            {item.location ? (
              <span className="absolute bottom-0 left-0 flex max-w-full items-center gap-1 truncate px-2 py-1 text-xs leading-5.5 text-white">
                <MapPin aria-hidden="true" className="size-4 shrink-0" />
                <span className="truncate">{item.location}</span>
              </span>
            ) : null}
          </div>

          <CardContent className="flex min-h-44.25 flex-1 flex-col gap-2.5 p-2">
            <div className="flex flex-1 flex-col gap-1">
              <h3 className="line-clamp-2 min-h-8.5 text-xs leading-5.5 font-bold text-card-foreground">
                {item.title}
              </h3>

              {starRating !== undefined || item.detailLocation ? (
                <div className="flex items-center gap-1 text-xs leading-5.5 text-(--lion-gray-800)">
                  {starRating !== undefined ? (
                    <span
                      aria-label={`飯店星等 ${starRating} 顆星`}
                      className="flex items-center gap-[1.5px]"
                    >
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          aria-hidden="true"
                          className="size-3 fill-(--lion-orange-400) text-(--lion-orange-400)"
                          key={index}
                        />
                      )).slice(0, starRating)}
                    </span>
                  ) : null}
                  {item.detailLocation ? (
                    <span className="flex min-w-0 items-center gap-0.75">
                      <MapPin
                        aria-hidden="true"
                        className="size-3 shrink-0 text-(--lion-gray-800)"
                      />
                      <span className="truncate">{item.detailLocation}</span>
                    </span>
                  ) : null}
                </div>
              ) : null}

              {item.rating ? (
                <div className="flex items-center gap-1 text-xs leading-5.5">
                  <Badge className="h-5 rounded bg-(--lion-orange-100) px-1.5 py-0 text-sm leading-5 font-medium text-(--lion-orange-600) shadow-none hover:bg-(--lion-orange-100)">
                    {item.rating}
                  </Badge>
                  {item.ratingLabel ? (
                    <span className="font-bold text-(--lion-gray-800)">
                      {item.ratingLabel}
                    </span>
                  ) : (
                    <Star
                      aria-hidden="true"
                      className="size-3 fill-(--lion-orange-600) text-(--lion-orange-600)"
                    />
                  )}
                  {reviewCount ? (
                    <span className="text-[10px] text-muted-foreground">
                      {reviewCount}
                    </span>
                  ) : null}
                </div>
              ) : null}

              {item.interestLabel ? (
                <p className="flex items-center gap-0.75 text-xs leading-5.5 text-(--lion-gray-800)">
                  <Users
                    aria-hidden="true"
                    className="size-3 text-(--lion-gray-700)"
                  />
                  {item.interestLabel}
                </p>
              ) : null}

              {item.cancellationLabel ? (
                <p className="text-[10px] leading-5.5 text-info">
                  {item.cancellationLabel}
                </p>
              ) : null}
            </div>

            <CardFooter className="flex flex-col items-end p-0">
              {isPromoActive && (item.originalPrice || item.discountLabel) ? (
                <div className="flex w-full items-center justify-end gap-1 text-right">
                  {item.originalPrice ? (
                    <span className="text-[10px] leading-5.5 text-muted-foreground line-through">
                      {formatCurrency(item.originalPrice, locale, currency)}
                    </span>
                  ) : null}
                  {item.discountLabel ? (
                    <Badge className="h-5.75 rounded bg-(--lion-red-100) px-2 py-0.5 text-xs leading-4.75 font-medium text-primary shadow-none hover:bg-(--lion-red-100)">
                      {item.discountLabel}
                    </Badge>
                  ) : null}
                </div>
              ) : null}
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-xs leading-5.5 text-(--lion-product-card-price-foreground)">
                  {item.pricePrefix ?? currency}
                </span>
                <span className="text-lg leading-7 font-bold text-primary">
                  {formattedPrice}
                </span>
                {item.priceSuffix ? (
                  <span className="text-xs leading-5.5 text-(--lion-product-card-price-foreground)">
                    {item.priceSuffix}
                  </span>
                ) : null}
              </div>
            </CardFooter>
          </CardContent>
        </Card>
      </Button>
    </article>
  )
}
