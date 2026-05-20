import { createMountApi } from '../../runtime/createMountApi'
import baseStyles from '../../styles/widget.css?inline'
import {
  CrossSellWidgetConnected,
  type CrossSellWidgetConnectedProps,
} from '../../widgets/cross-sell-widget'
import widgetStyles from '../../widgets/cross-sell-widget/style.css?inline'

const styles = `${baseStyles}\n${widgetStyles}`

declare global {
  interface Window {
    CrossSellWidgetConnected?: {
      mount: ReturnType<typeof createMountApi<CrossSellWidgetConnectedProps>>
    }
  }
}

window.CrossSellWidgetConnected = {
  mount: createMountApi(
    CrossSellWidgetConnected,
    'cross-sell-widget-connected',
    styles,
  ),
}
