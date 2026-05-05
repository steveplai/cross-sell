import { MapPin, Star } from 'lucide-react'
import type { SVGProps, SyntheticEvent } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

import { formatCurrency } from '../../../../shared/utils/formatCurrency'
import type { FlightOrderCrossSellItem } from '../../types'

interface ProductCardProps {
  currency: string
  isPromoActive: boolean
  item: FlightOrderCrossSellItem
  locale: string
  onSelect: () => void
}

const defaultProductImageUrl =
  'https://static.liontech.com.tw/CommonResources/images/lionTravel/default_img.png'

function SolidFlameIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      focusable="false"
      viewBox="0 0 12 12"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.07785 3.6615L1.07685 3.6625L1.07485 3.664L1.06985 3.668C1.04813 3.68444 1.02711 3.70179 1.00685 3.72C0.954313 3.76616 0.903926 3.81471 0.855852 3.8655C0.735852 3.992 0.581852 4.18 0.437352 4.4315C0.146352 4.939 -0.0981476 5.6955 0.0393524 6.707C0.174852 7.7055 0.594352 8.54 1.30335 9.122C2.01035 9.702 2.96735 10 4.12485 10C5.31835 10 6.27135 9.5525 6.90185 8.785C7.52685 8.0245 7.80585 6.987 7.73935 5.853C7.67535 4.765 7.08285 3.9395 6.55935 3.2105L6.40985 3.002C5.83885 2.196 5.38835 1.4535 5.49785 0.4145C5.50339 0.362208 5.49787 0.309335 5.48165 0.259315C5.46543 0.209294 5.43886 0.163245 5.40369 0.124157C5.36852 0.0850684 5.32551 0.0538147 5.27747 0.0324251C5.22944 0.0110354 5.17744 -1.20688e-05 5.12485 9.89394e-09C4.93385 9.89394e-09 4.71485 0.059 4.50385 0.148C4.2595 0.252709 4.02894 0.387049 3.81735 0.548C3.35485 0.897 2.89235 1.423 2.64585 2.126C2.39985 2.827 2.52485 3.495 2.70485 3.9815C2.82335 4.301 2.69485 4.6165 2.50135 4.7085C2.41902 4.74745 2.32482 4.75307 2.23844 4.72418C2.15206 4.6953 2.08019 4.63414 2.03785 4.5535L1.63485 3.788C1.60963 3.73998 1.57429 3.698 1.53127 3.66496C1.48825 3.63192 1.43857 3.60861 1.38567 3.59663C1.33276 3.58465 1.27789 3.58429 1.22483 3.59558C1.17178 3.60686 1.1218 3.62953 1.07835 3.662"
        fill="currentColor"
        transform="translate(2 1)"
      />
    </svg>
  )
}

function handleProductImageError(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget

  if (image.src !== defaultProductImageUrl) {
    image.src = defaultProductImageUrl
  }
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
  const imageUrl = item.imageUrl || defaultProductImageUrl

  return (
    <article className="h-full min-w-0">
      <Button
        className="group block h-full w-full rounded-lg bg-transparent p-0 text-left font-normal whitespace-normal text-card-foreground shadow-none hover:bg-transparent hover:text-card-foreground"
        onClick={onSelect}
        type="button"
        variant="ghost"
      >
        <Card className="h-full gap-0 overflow-hidden rounded-lg border border-(--lion-gray-200) bg-card py-0 shadow-(--lion-product-card-shadow) transition-shadow duration-300 ease-out group-hover:shadow-(--lion-product-card-shadow-hover)">
          <div className="relative h-29.25 w-full overflow-hidden rounded-t-[5px] bg-(--lion-gray-50)">
            <img
              alt=""
              className="h-full w-full origin-center object-cover transition-transform duration-300 ease-out group-hover:scale-125"
              onError={handleProductImageError}
              src={imageUrl}
            />
            <div className="absolute inset-x-0 bottom-0 h-6.75 bg-linear-to-b from-black/0 to-black/80" />
            {imageBadge ? (
              <Badge className="absolute top-1.25 left-1.25 h-5.5 rounded-lg bg-primary px-1.25 py-0 text-xs leading-5.5 font-normal text-primary-foreground shadow-none hover:bg-primary">
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
                      className="gap-0.375 flex items-center"
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
                    <span className="text-2xs text-muted-foreground">
                      {reviewCount}
                    </span>
                  ) : null}
                </div>
              ) : null}

              {item.interestLabel ? (
                <p className="flex items-center gap-0.75 text-xs leading-5.5 text-(--lion-gray-800)">
                  <SolidFlameIcon
                    aria-hidden="true"
                    className="size-3 shrink-0 text-(--lion-gray-700)"
                  />
                  {item.interestLabel}
                </p>
              ) : null}

              {item.cancellationLabel ? (
                <p className="text-2xs leading-5.5 text-(--lion-gray-700)">
                  {item.cancellationLabel}
                </p>
              ) : null}
            </div>

            <CardFooter className="flex flex-col items-end p-0">
              {isPromoActive && (item.originalPrice || item.discountLabel) ? (
                <div className="flex w-full items-center justify-end gap-1 text-right">
                  {item.originalPrice ? (
                    <span className="text-2xs leading-5.5 text-muted-foreground line-through">
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
