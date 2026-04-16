import type { CrossSellBannerProps } from '../widgets/cross-sell-banner'
import { CrossSellBanner } from '../widgets/cross-sell-banner'
import { createMountApi } from '../runtime/createMountApi'
import styles from '../styles/widget.css?inline'

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
