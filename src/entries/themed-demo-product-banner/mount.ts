import { createMountApi } from '../../runtime/createMountApi'
import baseStyles from '../../styles/widget.css?inline'
import type { ThemedDemoProductBannerProps } from '../../widgets/themed-demo-product-banner'
import { ThemedDemoProductBanner } from '../../widgets/themed-demo-product-banner'
import widgetStyles from '../../widgets/themed-demo-product-banner/style.css?inline'

const styles = `${baseStyles}\n${widgetStyles}`

declare global {
  interface Window {
    ThemedDemoProductBanner?: {
      mount: ReturnType<typeof createMountApi<ThemedDemoProductBannerProps>>
    }
  }
}

window.ThemedDemoProductBanner = {
  mount: createMountApi(
    ThemedDemoProductBanner,
    'themed-demo-product-banner',
    styles,
  ),
}
