import {
  createWidgetBuildMetadata,
  type WidgetBuildMetadata,
} from '../../runtime/buildMetadata'
import { createMountApi } from '../../runtime/createMountApi'
import baseStyles from '../../styles/widget.css?inline'
import type { ThemedDemoProductBannerProps } from '../../widgets/themed-demo-product-banner'
import { ThemedDemoProductBanner } from '../../widgets/themed-demo-product-banner'
import widgetStyles from '../../widgets/themed-demo-product-banner/style.css?inline'

const styles = `${baseStyles}\n${widgetStyles}`
const build = createWidgetBuildMetadata('themed-demo-product-banner', 'mount')

declare global {
  interface Window {
    ThemedDemoProductBanner?: {
      version: string
      build: WidgetBuildMetadata
      mount: ReturnType<typeof createMountApi<ThemedDemoProductBannerProps>>
    }
  }
}

window.ThemedDemoProductBanner = {
  version: build.version,
  build,
  mount: createMountApi(
    ThemedDemoProductBanner,
    'themed-demo-product-banner',
    styles,
  ),
}
