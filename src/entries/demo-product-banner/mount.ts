import { createMountApi } from '../../runtime/createMountApi'
import styles from '../../styles/widget.css?inline'
import type { DemoProductBannerProps } from '../../widgets/demo-product-banner'
import { DemoProductBanner } from '../../widgets/demo-product-banner'

declare global {
  interface Window {
    DemoProductBanner?: {
      mount: ReturnType<typeof createMountApi<DemoProductBannerProps>>
    }
  }
}

window.DemoProductBanner = {
  mount: createMountApi(DemoProductBanner, 'demo-product-banner', styles),
}
