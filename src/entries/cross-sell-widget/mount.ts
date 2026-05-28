import {
  createWidgetBuildMetadata,
  type WidgetBuildMetadata,
} from '../../runtime/buildMetadata'
import { createMountApi } from '../../runtime/createMountApi'
import baseStyles from '../../styles/widget.css?inline'
import {
  CrossSellWidget,
  type CrossSellWidgetProps,
} from '../../widgets/cross-sell-widget'
import widgetStyles from '../../widgets/cross-sell-widget/style.css?inline'

const styles = `${baseStyles}\n${widgetStyles}`
const build = createWidgetBuildMetadata('cross-sell-widget', 'mount')

declare global {
  interface Window {
    CrossSellWidget?: {
      version: string
      build: WidgetBuildMetadata
      mount: ReturnType<typeof createMountApi<CrossSellWidgetProps>>
    }
  }
}

window.CrossSellWidget = {
  version: build.version,
  build,
  mount: createMountApi(CrossSellWidget, 'cross-sell-widget', styles),
}
