import { createReactWebComponent } from '../../runtime/createReactWebComponent'
import { isLiontravelDomainMode } from '../../shared/utils/liontravelUrl'
import baseStyles from '../../styles/widget.css?inline'
import {
  FlightOrderCrossSellConnected,
  type FlightOrderCrossSellConnectedErrorMode,
  type FlightOrderCrossSellConnectedProps,
  type FlightOrderCrossSellData,
} from '../../widgets/flight-order-cross-sell'
import widgetStyles from '../../widgets/flight-order-cross-sell/style.css?inline'

const styles = `${baseStyles}\n${widgetStyles}`

function parseData(value: string | null): FlightOrderCrossSellData | undefined {
  if (!value) {
    return undefined
  }

  try {
    const parsed = JSON.parse(value)

    return isFlightOrderCrossSellData(parsed)
      ? (parsed as FlightOrderCrossSellData)
      : undefined
  } catch {
    return undefined
  }
}

function isFlightOrderCrossSellData(value: unknown) {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<FlightOrderCrossSellData>

  return (
    !!candidate.promo &&
    typeof candidate.promo.startsAt === 'string' &&
    typeof candidate.promo.durationSeconds === 'number' &&
    Array.isArray(candidate.sections)
  )
}

function parseErrorMode(
  value: string | null | undefined,
): FlightOrderCrossSellConnectedErrorMode {
  return value === 'message' ? 'message' : 'hidden'
}

function getOptionalAttribute(element: HTMLElement, name: string) {
  const value = element.getAttribute(name)?.trim()

  return value || undefined
}

createReactWebComponent<FlightOrderCrossSellConnectedProps>({
  tagName: 'flight-order-cross-sell-connected',
  Component: FlightOrderCrossSellConnected,
  observedAttributes: [
    'base-url',
    'data',
    'domain-mode',
    'error-mode',
    'order-number',
  ],
  styles,
  mapElementToProps: (element) => {
    const domainMode = getOptionalAttribute(element, 'domain-mode')

    return {
      baseUrl: getOptionalAttribute(element, 'base-url'),
      data: parseData(element.getAttribute('data')),
      domainMode: isLiontravelDomainMode(domainMode) ? domainMode : undefined,
      errorMode: parseErrorMode(getOptionalAttribute(element, 'error-mode')),
      orderNumber: getOptionalAttribute(element, 'order-number'),
      onSelectItem: (detail) => {
        element.dispatchEvent(
          new CustomEvent('flight-order-cross-sell:item-select', {
            bubbles: true,
            composed: true,
            detail,
          }),
        )
      },
      onViewMore: (detail) => {
        element.dispatchEvent(
          new CustomEvent('flight-order-cross-sell:view-more', {
            bubbles: true,
            composed: true,
            detail,
          }),
        )
      },
      onSelectAddon: (detail) => {
        element.dispatchEvent(
          new CustomEvent('flight-order-cross-sell:addon-select', {
            bubbles: true,
            composed: true,
            detail,
          }),
        )
      },
    }
  },
})
