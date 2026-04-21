import { createReactWebComponent } from '../../runtime/createReactWebComponent'
import styles from '../../styles/widget.css?inline'
import type {
  DemoProductBannerLayout,
  DemoProductBannerProps,
} from '../../widgets/demo-product-banner'
import { DemoProductBanner } from '../../widgets/demo-product-banner'

const fallbackProducts = [{ id: 'demo-1', name: '加購推薦商品', price: 1200 }]

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

createReactWebComponent<DemoProductBannerProps>({
  tagName: 'demo-product-banner',
  Component: DemoProductBanner,
  observedAttributes: ['title', 'locale', 'layout', 'products'],
  styles,
  mapElementToProps: (element) => ({
    title: element.getAttribute('title') ?? '推薦商品',
    locale: element.getAttribute('locale') ?? 'zh-TW',
    layout:
      (element.getAttribute('layout') as DemoProductBannerLayout | null) ??
      'grid',
    products: parseProducts(element.getAttribute('products')),
    onSelectProduct: (product) => {
      element.dispatchEvent(
        new CustomEvent('demo-product:product-select', {
          bubbles: true,
          composed: true,
          detail: { product },
        }),
      )
    },
  }),
})
