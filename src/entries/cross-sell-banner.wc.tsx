import type { CrossSellBannerLayout, CrossSellBannerProps } from '../widgets/cross-sell-banner'
import { CrossSellBanner } from '../widgets/cross-sell-banner'
import { createReactWebComponent } from '../runtime/createReactWebComponent'
import styles from '../styles/widget.css?inline'

const fallbackProducts = [
  { id: 'demo-1', name: '加購推薦商品', price: 1200 },
]

function parseProducts(value: string | null) {
  if (!value) {
    return fallbackProducts
  }

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : fallbackProducts
  } catch {
    return fallbackProducts
  }
}

createReactWebComponent<CrossSellBannerProps>({
  tagName: 'cross-sell-banner',
  Component: CrossSellBanner,
  observedAttributes: ['title', 'locale', 'layout', 'products'],
  styles,
  mapElementToProps: (element) => ({
    title: element.getAttribute('title') ?? '推薦商品',
    locale: element.getAttribute('locale') ?? 'zh-TW',
    layout:
      (element.getAttribute('layout') as CrossSellBannerLayout | null) ?? 'grid',
    products: parseProducts(element.getAttribute('products')),
    onSelectProduct: (product) => {
      element.dispatchEvent(
        new CustomEvent('cross-sell:product-select', {
          bubbles: true,
          composed: true,
          detail: { product },
        }),
      )
    },
  }),
})
