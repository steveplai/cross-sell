import {
  createWidgetBuildMetadata,
  type WidgetBuildMetadata,
} from '../../runtime/buildMetadata'
import { createMountApi } from '../../runtime/createMountApi'
import styles from '../../styles/widget.css?inline'
import type { DemoProductBannerProps } from '../../widgets/demo-product-banner'
import { DemoProductBanner } from '../../widgets/demo-product-banner'

const build = createWidgetBuildMetadata('demo-product-banner', 'mount')

declare global {
  interface Window {
    DemoProductBanner?: {
      version: string
      build: WidgetBuildMetadata
      mount: ReturnType<typeof createMountApi<DemoProductBannerProps>>
    }
  }
}

window.DemoProductBanner = {
  version: build.version,
  build,
  mount: createMountApi(DemoProductBanner, 'demo-product-banner', styles),
}
