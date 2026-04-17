import { createMountApi } from '../../runtime/createMountApi'
import baseStyles from '../../styles/widget.css?inline'
import type { CrossSellBannerProps } from '../../widgets/themed-cross-sell-banner'
import { ThemedCrossSellBanner } from '../../widgets/themed-cross-sell-banner'
import widgetStyles from '../../widgets/themed-cross-sell-banner/style.css?inline'

const styles = `${baseStyles}\n${widgetStyles}`

declare global {
  interface Window {
    ThemedCrossSellBanner?: {
      mount: ReturnType<typeof createMountApi<CrossSellBannerProps>>
    }
  }
}

window.ThemedCrossSellBanner = {
  mount: createMountApi(
    ThemedCrossSellBanner,
    'themed-cross-sell-banner',
    styles,
  ),
}
