import { createMountApi } from '../../runtime/createMountApi'
import baseStyles from '../../styles/widget.css?inline'
import type { CrossSellBannerProps } from '../../widgets/cross-sell-banner'
import { CrossSellBanner } from '../../widgets/cross-sell-banner'
import widgetStyles from '../../widgets/cross-sell-banner/style.css?inline'

const styles = `${baseStyles}\n${widgetStyles}`

declare global {
  interface Window {
    CrossSellBanner?: {
      mount: ReturnType<typeof createMountApi<CrossSellBannerProps>>
    }
  }
}

window.CrossSellBanner = {
  mount: createMountApi(CrossSellBanner, 'cross-sell-banner', styles),
}
