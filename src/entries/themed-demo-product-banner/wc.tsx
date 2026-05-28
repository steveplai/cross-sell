import { createWidgetBuildMetadata } from '../../runtime/buildMetadata'
import { createReactWebComponent } from '../../runtime/createReactWebComponent'
import baseStyles from '../../styles/widget.css?inline'
import type {
  ThemedDemoProductBannerLayout,
  ThemedDemoProductBannerProps,
} from '../../widgets/themed-demo-product-banner'
import { ThemedDemoProductBanner } from '../../widgets/themed-demo-product-banner'
import widgetStyles from '../../widgets/themed-demo-product-banner/style.css?inline'

const fallbackProducts = [{ id: 'demo-1', name: '加購推薦商品', price: 1200 }]
const styles = `${baseStyles}\n${widgetStyles}`

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

createReactWebComponent<ThemedDemoProductBannerProps>({
  tagName: 'themed-demo-product-banner',
  Component: ThemedDemoProductBanner,
  build: createWidgetBuildMetadata('themed-demo-product-banner', 'wc'),
  observedAttributes: ['title', 'locale', 'layout', 'products'],
  styles,
  mapElementToProps: (element) => ({
    title: element.getAttribute('title') ?? '推薦商品',
    locale: element.getAttribute('locale') ?? 'zh-TW',
    layout:
      (element.getAttribute(
        'layout',
      ) as ThemedDemoProductBannerLayout | null) ?? 'grid',
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
