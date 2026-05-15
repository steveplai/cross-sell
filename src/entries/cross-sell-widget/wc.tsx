import { createReactWebComponent } from '../../runtime/createReactWebComponent'
import baseStyles from '../../styles/widget.css?inline'
import {
  CrossSellWidget,
  type CrossSellWidgetProps,
} from '../../widgets/cross-sell-widget'
import widgetStyles from '../../widgets/flight-order-cross-sell/style.css?inline'

const styles = `${baseStyles}\n${widgetStyles}`

//#region - Functions

function parseData(value: string | null): CrossSellWidgetProps {
  if (!value) {
    return { sections: [] }
  }

  try {
    const parsed = JSON.parse(value)

    return isCrossSellWidgetProps(parsed)
      ? mapDataToProps(parsed as CrossSellWidgetProps)
      : { sections: [] }
  } catch {
    return { sections: [] }
  }
}

function getDataProperty(element: HTMLElement): CrossSellWidgetProps | undefined {
  const value = (element as HTMLElement & { data?: unknown }).data

  return isCrossSellWidgetProps(value)
    ? mapDataToProps(value as CrossSellWidgetProps)
    : undefined
}

function isCrossSellWidgetProps(value: unknown) {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<CrossSellWidgetProps>

  return (
    typeof candidate === 'object' &&
    (!candidate.sections || Array.isArray(candidate.sections))
  )
}

function mapDataToProps(data: CrossSellWidgetProps): CrossSellWidgetProps {
  return {
    currency: data.currency,
    domainMode: data.domainMode,
    hsrAddon: data.hsrAddon,
    locale: data.locale,
    order: data.order,
    orderDestination: data.orderDestination,
    promo: data.promo,
    reminders: data.reminders,
    sectionContentOverrides: data.sectionContentOverrides,
    sections: data.sections ?? [],
    serviceAgent: data.serviceAgent,
  }
}

//#endregion - Functions

createReactWebComponent<CrossSellWidgetProps>({
  tagName: 'cross-sell-widget',
  Component: CrossSellWidget,
  observedAttributes: ['data'],
  observedProperties: ['data'],
  styles,
  mapElementToProps: (element) => ({
    ...(getDataProperty(element) ?? parseData(element.getAttribute('data'))),
    onSelectItem: (detail) => {
      element.dispatchEvent(
        new CustomEvent('cross-sell-widget:item-select', {
          bubbles: true,
          composed: true,
          detail,
        }),
      )
    },
    onViewMore: (detail) => {
      element.dispatchEvent(
        new CustomEvent('cross-sell-widget:view-more', {
          bubbles: true,
          composed: true,
          detail,
        }),
      )
    },
    onSelectAddon: (detail) => {
      element.dispatchEvent(
        new CustomEvent('cross-sell-widget:addon-select', {
          bubbles: true,
          composed: true,
          detail,
        }),
      )
    },
  }),
})
