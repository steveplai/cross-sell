import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

import { createWidgetRootProps } from '../../runtime/widgetRoot'
import type { Product } from '../../shared/types/product'
import { formatCurrency } from '../../shared/utils/formatCurrency'

const demoProductBannerRootProps = createWidgetRootProps('demo-product-banner')

export type DemoProductBannerLayout = 'compact' | 'grid' | 'carousel'

export interface DemoProductBannerProps {
  title: string
  locale?: string
  layout?: DemoProductBannerLayout
  products: Product[]
  loading?: boolean
  onSelectProduct?: (product: Product) => void
}

export function DemoProductBanner({
  title,
  locale = 'zh-TW',
  layout = 'grid',
  products,
  loading = false,
  onSelectProduct,
}: DemoProductBannerProps) {
  const listClass =
    layout === 'compact'
      ? 'grid grid-cols-1 gap-3'
      : layout === 'carousel'
        ? 'flex gap-3 overflow-x-auto pb-2'
        : 'grid grid-cols-1 gap-3 sm:grid-cols-2'

  if (loading) {
    return (
      <section
        className="w-full rounded-lg border border-border bg-background p-4 text-foreground shadow-sm"
        {...demoProductBannerRootProps}
      >
        <h2 className="text-base font-semibold">{title}</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[0, 1].map((item) => (
            <Skeleton
              aria-hidden="true"
              className="h-24 rounded-lg"
              data-testid="loading-card"
              key={item}
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      className="w-full rounded-lg border border-border bg-background p-4 text-foreground shadow-sm"
      {...demoProductBannerRootProps}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge
            className="tracking-normal text-primary uppercase"
            variant="secondary"
          >
            Demo product
          </Badge>
          <h2 className="mt-1 text-lg leading-tight font-semibold">{title}</h2>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="mt-4 rounded-lg bg-muted px-3 py-4 text-sm text-muted-foreground">
          目前沒有可推薦的商品。
        </p>
      ) : (
        <div className={`mt-4 ${listClass}`} data-testid="product-list">
          {products.map((product) => (
            <Card
              className={cn(
                'p-3 shadow-none',
                layout === 'carousel' && 'min-w-60',
              )}
              key={product.id}
            >
              <div className="flex gap-3">
                {product.imageUrl ? (
                  <img
                    alt=""
                    className="h-16 w-16 flex-none rounded-lg object-cover"
                    src={product.imageUrl}
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex h-16 w-16 flex-none items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary"
                  >
                    {product.name.slice(0, 1)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm leading-snug font-semibold wrap-break-word">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatCurrency(product.price, locale)}
                  </p>
                </div>
              </div>
              <Button onClick={() => onSelectProduct?.(product)} type="button">
                加入 {product.name}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
