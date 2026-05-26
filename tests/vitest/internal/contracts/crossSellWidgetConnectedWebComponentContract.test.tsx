import { act, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type {
  CrossSellWidgetConnectedConfig,
  CrossSellWidgetConnectedProps,
  CrossSellWidgetVisibleBlocks,
} from '../../../../src/widgets/cross-sell-widget'

const widgetMockState = vi.hoisted(() => ({
  props: undefined as unknown,
}))

vi.mock('../../../../src/widgets/cross-sell-widget', async (importOriginal) => {
  const actual = await importOriginal<object>()

  return {
    ...actual,
    CrossSellWidgetConnected: (props: unknown) => {
      widgetMockState.props = props

      return null
    },
  }
})

import '../../../../src/entries/cross-sell-widget/connected.wc'

type ConnectedElement = HTMLElement & {
  config?: unknown
  orderDestination?: unknown
  promoDurationSeconds?: unknown
  promoStartsAt?: unknown
  sourceProduct?: unknown
  travelInsuranceContactEmail?: unknown
  visibleBlocks?: unknown
}

function createElement() {
  return document.createElement(
    'cross-sell-widget-connected',
  ) as ConnectedElement
}

async function renderElement(element: HTMLElement) {
  await act(async () => {
    document.body.appendChild(element)
  })

  await waitFor(() => {
    expect(widgetMockState.props).toBeDefined()
  })

  return widgetMockState.props as CrossSellWidgetConnectedProps
}

describe('cross-sell-widget-connected Web Component contract', () => {
  afterEach(async () => {
    await act(async () => {
      document.body.innerHTML = ''
    })

    widgetMockState.props = undefined
  })

  it('keeps the public observed attributes and properties unchanged', () => {
    const elementConstructor = customElements.get(
      'cross-sell-widget-connected',
    ) as
      | (CustomElementConstructor & {
          observedAttributes: string[]
        })
      | undefined

    expect(elementConstructor).toBeDefined()
    expect(elementConstructor?.observedAttributes).toEqual([
      'config',
      'currency',
      'environment',
      'error-mode',
      'locale',
      'order-destination',
      'order-number',
      'promo-duration-seconds',
      'promo-starts-at',
      'recommend-product-types',
      'source-product',
      'travel-insurance-contact-email',
      'visible-blocks',
    ])

    const element = createElement()

    ;[
      'config',
      'orderDestination',
      'promoDurationSeconds',
      'promoStartsAt',
      'sourceProduct',
      'travelInsuranceContactEmail',
      'visibleBlocks',
    ].forEach((property) => {
      const descriptor = Object.getOwnPropertyDescriptor(
        elementConstructor?.prototype,
        property,
      )

      expect(descriptor?.get).toBeTypeOf('function')
      expect(descriptor?.set).toBeTypeOf('function')
      expect(property in element).toBe(true)
    })
  })

  it('falls back safely for invalid JSON and invalid enum-like attributes', async () => {
    const element = createElement()

    element.setAttribute('config', '{')
    element.setAttribute('visible-blocks', '{')
    element.setAttribute('environment', 'preview')
    element.setAttribute('error-mode', 'toast')
    element.setAttribute('source-product', 'cruise')

    const props = await renderElement(element)

    expect(props.currency).toBeUndefined()
    expect(props.visibleBlocks).toBeUndefined()
    expect(props.environment).toBeUndefined()
    expect(props.errorMode).toBe('hidden')
    expect(props.sourceProduct).toBeUndefined()
  })

  it('sanitizes supported config fields from the config attribute', async () => {
    const element = createElement()

    element.setAttribute(
      'config',
      JSON.stringify({
        currency: 'TWD',
        domainMode: 'uat',
        hsrAddon: {
          id: 'hsr-addon',
          title: 'HSR add-on',
          description: 'Add HSR tickets',
          ctaLabel: 'Choose HSR',
          price: 1000,
        },
        locale: 'zh-TW',
        orderDestination: 'Tokyo',
        promo: {
          id: 'promo',
        },
        reminders: {
          title: 'Travel reminder',
        },
        sectionContentOverrides: {
          hotel: {
            title: 'Recommended hotels',
            subtitle: 'Selected hotels',
            viewMoreLabel: 'View more',
            viewMorePlaceholderLabel: 'More hotels coming soon',
            ignored: 'ignored',
          },
          attraction: {
            title: 123,
          },
          unknown: {
            title: 'Unsupported section',
          },
        },
        serviceAgent: {
          email: 'agent@example.com',
        },
      }),
    )

    const props = await renderElement(element)

    expect(props.currency).toBe('TWD')
    expect(props.locale).toBe('zh-TW')
    expect(props.orderDestination).toBe('Tokyo')
    expect(props.hsrAddon).toEqual({
      id: 'hsr-addon',
      title: 'HSR add-on',
      description: 'Add HSR tickets',
      ctaLabel: 'Choose HSR',
    })
    expect(props.promo).toEqual({ id: 'promo' })
    expect(props.reminders).toEqual({ title: 'Travel reminder' })
    expect(props.sectionContentOverrides).toEqual({
      hotel: {
        title: 'Recommended hotels',
        subtitle: 'Selected hotels',
        viewMoreLabel: 'View more',
        viewMorePlaceholderLabel: 'More hotels coming soon',
      },
    })
    expect('domainMode' in props).toBe(false)
    expect('serviceAgent' in props).toBe(false)
  })

  it('preserves scalar attribute priority over properties and config', async () => {
    const element = createElement()

    element.setAttribute(
      'config',
      JSON.stringify({
        currency: 'ATTRIBUTE_CONFIG_CURRENCY',
        locale: 'attribute-config-locale',
        orderDestination: 'attribute config destination',
      }),
    )
    element.config = {
      currency: 'PROPERTY_CONFIG_CURRENCY',
      locale: 'property-config-locale',
      orderDestination: 'property config destination',
    } satisfies CrossSellWidgetConnectedConfig
    element.orderDestination = 'direct property destination'
    element.promoDurationSeconds = 240
    element.visibleBlocks = {
      hotel: true,
      hsr: false,
      promoHeader: 'invalid',
    }

    element.setAttribute('currency', 'SCALAR_ATTRIBUTE_CURRENCY')
    element.setAttribute('locale', 'scalar-attribute-locale')
    element.setAttribute('order-destination', 'scalar attribute destination')
    element.setAttribute('promo-duration-seconds', '120')
    element.setAttribute(
      'visible-blocks',
      JSON.stringify({
        hotel: false,
        attraction: false,
      }),
    )

    const props = await renderElement(element)

    expect(props.currency).toBe('SCALAR_ATTRIBUTE_CURRENCY')
    expect(props.locale).toBe('scalar-attribute-locale')
    expect(props.orderDestination).toBe('scalar attribute destination')
    expect(props.promoDurationSeconds).toBe(120)
    expect(props.visibleBlocks).toEqual({
      hotel: true,
      hsr: false,
    })
  })

  it('uses direct properties and config properties at their current priority when scalar attributes are absent', async () => {
    const element = createElement()

    element.setAttribute(
      'config',
      JSON.stringify({
        currency: 'ATTRIBUTE_CONFIG_CURRENCY',
        locale: 'attribute-config-locale',
        orderDestination: 'attribute config destination',
      }),
    )
    element.config = {
      currency: 'PROPERTY_CONFIG_CURRENCY',
      locale: 'property-config-locale',
      orderDestination: 'property config destination',
    } satisfies CrossSellWidgetConnectedConfig
    element.orderDestination = 'direct property destination'
    element.promoDurationSeconds = 240
    element.visibleBlocks = undefined
    element.setAttribute(
      'visible-blocks',
      JSON.stringify({
        hotel: false,
        hsr: true,
        other: 'invalid',
      }),
    )

    const props = await renderElement(element)

    expect(props.currency).toBe('PROPERTY_CONFIG_CURRENCY')
    expect(props.locale).toBe('property-config-locale')
    expect(props.orderDestination).toBe('direct property destination')
    expect(props.promoDurationSeconds).toBe(240)
    expect(props.visibleBlocks).toEqual({
      hotel: false,
      hsr: true,
    } satisfies CrossSellWidgetVisibleBlocks)
  })

  it('parses valid enum-like attributes and source product properties', async () => {
    const element = createElement()

    element.setAttribute('environment', 'uat')
    element.setAttribute('error-mode', 'message')
    element.sourceProduct = 'hotel'

    const props = await renderElement(element)

    expect(props.environment).toBe('uat')
    expect(props.errorMode).toBe('message')
    expect(props.sourceProduct).toBe('hotel')
  })

  it('bridges callbacks to composed bubbling CustomEvents', async () => {
    const element = createElement()
    const events: CustomEvent[] = []

    ;[
      'cross-sell-widget:item-select',
      'cross-sell-widget:view-more',
      'cross-sell-widget:addon-select',
    ].forEach((eventName) => {
      element.addEventListener(eventName, (event) => {
        events.push(event as CustomEvent)
      })
    })

    const props = await renderElement(element)
    const itemDetail = {
      sectionId: 'hotel',
      item: {
        id: 'hotel-1',
        title: 'Hotel',
        price: 1200,
      },
    }
    const viewMoreDetail = {
      sectionId: 'hotel',
    }
    const addonDetail = {
      addonId: 'hsr-addon',
    }

    props.onSelectItem?.(itemDetail)
    props.onViewMore?.(viewMoreDetail)
    props.onSelectAddon?.(addonDetail)

    expect(events).toHaveLength(3)
    expect(events.map((event) => event.type)).toEqual([
      'cross-sell-widget:item-select',
      'cross-sell-widget:view-more',
      'cross-sell-widget:addon-select',
    ])
    expect(events.map((event) => event.detail)).toEqual([
      itemDetail,
      viewMoreDetail,
      addonDetail,
    ])
    events.forEach((event) => {
      expect(event.bubbles).toBe(true)
      expect(event.composed).toBe(true)
    })
  })
})
