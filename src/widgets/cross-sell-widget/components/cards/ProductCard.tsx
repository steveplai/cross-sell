import { cn } from '@/lib/utils'

import type { CrossSellWidgetItem } from '../../types'

interface ProductCardProps {
  currency: string
  item: CrossSellWidgetItem
  locale: string
  onClick?: () => void
}

export function ProductCard({
  currency,
  item,
  locale,
  onClick,
}: ProductCardProps) {
  const formatter = new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: 0,
    style: 'currency',
  })

  return (
    <button
      className={cn(
        'group flex w-full flex-col overflow-hidden rounded-2xl bg-background text-left',
        'transition-transform duration-200 hover:-translate-y-0.5',
      )}
      onClick={onClick}
      type="button"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-(--lion-gray-100)">
        {item.imageUrl ? (
          <img
            alt={item.title}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            src={item.imageUrl}
          />
        ) : null}

        {item.badge ? (
          <div className="absolute top-3 left-3 rounded-full bg-(--lion-primary-500) px-2 py-1 text-xs font-medium text-white">
            {item.badge}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-sm font-semibold lion-desktop:text-base">
            {item.title}
          </h3>

          {item.location ? (
            <p className="text-xs text-muted-foreground lion-desktop:text-sm">
              {item.location}
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="space-y-1">
            {item.originalPrice ? (
              <p className="text-xs text-muted-foreground line-through">
                {formatter.format(item.originalPrice)}
              </p>
            ) : null}

            <div className="flex items-baseline gap-1">
              {item.pricePrefix ? (
                <span className="text-xs text-muted-foreground">
                  {item.pricePrefix}
                </span>
              ) : null}

              <span className="text-lg font-bold text-(--lion-primary-600)">
                {formatter.format(item.price)}
              </span>

              {item.priceSuffix ? (
                <span className="text-xs text-muted-foreground">
                  {item.priceSuffix}
                </span>
              ) : null}
            </div>
          </div>

          {item.rating ? (
            <div className="rounded-full bg-(--lion-gray-100) px-2 py-1 text-xs font-medium">
              ★ {item.rating}
            </div>
          ) : null}
        </div>
      </div>
    </button>
  )
}
