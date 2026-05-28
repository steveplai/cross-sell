import {
  createWidgetBuildMetadata,
  type WidgetBuildMetadata,
} from '../../runtime/buildMetadata'
import { createMountApi } from '../../runtime/createMountApi'
import baseStyles from '../../styles/widget.css?inline'
import {
  CrossSellWidgetConnected,
  type CrossSellWidgetConnectedProps,
} from '../../widgets/cross-sell-widget'
import widgetStyles from '../../widgets/cross-sell-widget/style.css?inline'

const styles = `${baseStyles}\n${widgetStyles}`
const build = createWidgetBuildMetadata('cross-sell-widget-connected', 'mount')

declare global {
  interface Window {
    CrossSellWidgetConnected?: {
      version: string
      build: WidgetBuildMetadata
      mount: ReturnType<typeof createMountApi<CrossSellWidgetConnectedProps>>
    }
  }
}

window.CrossSellWidgetConnected = {
  version: build.version,
  build,
  mount: createMountApi(
    CrossSellWidgetConnected,
    'cross-sell-widget-connected',
    styles,
  ),
}
