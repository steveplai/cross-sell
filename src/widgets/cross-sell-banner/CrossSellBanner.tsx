import type { Product } from '../../shared/types/product'
import { formatCurrency } from '../../shared/utils/formatCurrency'

export type CrossSellBannerLayout = 'compact' | 'grid' | 'carousel'

export interface CrossSellBannerProps {
  title: string
  locale?: string
  layout?: CrossSellBannerLayout
  products: Product[]
  loading?: boolean
  onSelectProduct?: (product: Product) => void
}

export function CrossSellBanner({
  title,
  locale = 'zh-TW',
  layout = 'grid',
  products,
  loading = false,
  onSelectProduct,
}: CrossSellBannerProps) {
  const listClass =
    layout === 'compact'
      ? 'grid grid-cols-1 gap-3'
      : layout === 'carousel'
        ? 'flex gap-3 overflow-x-auto pb-2'
        : 'grid grid-cols-1 gap-3 sm:grid-cols-2'

  if (loading) {
    return (
      <section className="w-full rounded-lg border border-zinc-200 bg-white p-4 text-zinc-900 shadow-sm">
        <h2 className="text-base font-semibold">{title}</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[0, 1].map((item) => (
            <div
              aria-hidden="true"
              className="h-24 animate-pulse rounded-lg bg-zinc-100"
              data-testid="loading-card"
              key={item}
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="w-full rounded-lg border border-zinc-200 bg-white p-4 text-zinc-900 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-normal text-emerald-700">
            Cross-sell
          </p>
          <h2 className="mt-1 text-lg font-semibold leading-tight">{title}</h2>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="mt-4 rounded-lg bg-zinc-50 px-3 py-4 text-sm text-zinc-600">
          目前沒有可推薦的商品。
        </p>
      ) : (
        <div className={`mt-4 ${listClass}`} data-testid="product-list">
          {products.map((product) => (
            <article
              className={
                layout === 'carousel'
                  ? 'min-w-60 rounded-lg border border-zinc-200 bg-zinc-50 p-3'
                  : 'rounded-lg border border-zinc-200 bg-zinc-50 p-3'
              }
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
                    className="flex h-16 w-16 flex-none items-center justify-center rounded-lg bg-emerald-100 text-sm font-semibold text-emerald-800"
                  >
                    {product.name.slice(0, 1)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="break-words text-sm font-semibold leading-snug">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    {formatCurrency(product.price, locale)}
                  </p>
                </div>
              </div>
              <button
                className="mt-3 w-full rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                onClick={() => onSelectProduct?.(product)}
                type="button"
              >
                加入 {product.name}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
