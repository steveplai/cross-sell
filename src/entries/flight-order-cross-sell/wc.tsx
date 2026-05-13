import { createReactWebComponent } from '../../runtime/createReactWebComponent'
import baseStyles from '../../styles/widget.css?inline'
import {
  FlightOrderCrossSell,
  type FlightOrderCrossSellData,
  type FlightOrderCrossSellProps,
} from '../../widgets/flight-order-cross-sell'
import widgetStyles from '../../widgets/flight-order-cross-sell/style.css?inline'

const styles = `${baseStyles}\n${widgetStyles}`

function parseData(value: string | null): FlightOrderCrossSellProps {
  if (!value) {
    return { sections: [] }
  }

  try {
    const parsed = JSON.parse(value)

    return isFlightOrderCrossSellData(parsed)
      ? mapDataToProps(parsed as FlightOrderCrossSellData)
      : { sections: [] }
  } catch {
    return { sections: [] }
  }
}

function isFlightOrderCrossSellData(value: unknown) {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<FlightOrderCrossSellData>

  return (
    typeof candidate === 'object' &&
    (!candidate.sections || Array.isArray(candidate.sections))
  )
}

function mapDataToProps(
  data: FlightOrderCrossSellData,
): FlightOrderCrossSellProps {
  return {
    attractionBannerOverrides: data.attractionBannerOverrides,
    currency: data.currency,
    domainMode: data.domainMode,
    hsrAddon: data.hsrAddon,
    locale: data.locale,
    order: data.order,
    promo: data.promo,
    reminders: data.reminders,
    sections: data.sections ?? [],
    serviceAgent: data.serviceAgent,
  }
}

createReactWebComponent<FlightOrderCrossSellProps>({
  tagName: 'flight-order-cross-sell',
  Component: FlightOrderCrossSell,
  observedAttributes: ['data'],
  styles,
  mapElementToProps: (element) => ({
    ...parseData(element.getAttribute('data')),
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
  }),
})
