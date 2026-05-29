import { act, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { WidgetBuildMetadata } from '../../runtime/buildMetadata'
import type {
  CrossSellWidgetConnectedConfig,
  CrossSellWidgetConnectedProps,
  CrossSellWidgetVisibleBlocks,
} from '../../widgets/cross-sell-widget'

const widgetMockState = vi.hoisted(() => ({
  props: undefined as unknown,
}))

vi.mock('../../widgets/cross-sell-widget', async (importOriginal) => {
  const actual = await importOriginal<object>()

  return {
    ...actual,
    CrossSellWidgetConnected: (props: unknown) => {
      widgetMockState.props = props

      return null
    },
  }
})

import './connected.wc'

type ConnectedElement = HTMLElement & {
  version?: string
  build?: WidgetBuildMetadata
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

describe('cross-sell-widget-connected Web Component 契約', () => {
  afterEach(async () => {
    await act(async () => {
      document.body.innerHTML = ''
    })

    widgetMockState.props = undefined
  })

  it('會維持公開 observed attributes 與 properties 不變', () => {
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

  it('會在 constructor 與 element instance 上暴露建置資訊', async () => {
    const elementConstructor = customElements.get(
      'cross-sell-widget-connected',
    ) as
      | (CustomElementConstructor & {
          version?: string
          build?: WidgetBuildMetadata
        })
      | undefined

    expect(elementConstructor?.version).toBe('development')
    expect(elementConstructor?.build).toEqual({
      version: 'development',
      widgetName: 'cross-sell-widget-connected',
      commit: 'unknown',
      mode: 'wc',
      builtAt: 'unknown',
    })

    const element = createElement()

    await renderElement(element)

    expect(element.version).toBe('development')
    expect(element.build).toEqual(elementConstructor?.build)
    expect(element.getAttribute('data-cross-sell-version')).toBe('development')
  })

  it('遇到無效 JSON 與無效 enum-like attributes 時會安全 fallback', async () => {
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

  it('會從 config attribute 清理出支援的 config 欄位', async () => {
    const element = createElement()

    element.setAttribute(
      'config',
      JSON.stringify({
        currency: 'TWD',
        domainMode: 'uat',
        hsrAddon: {
          id: 'hsr-addon',
          title: '高鐵加購',
          description: '加購高鐵票券',
          ctaLabel: '選擇高鐵',
          price: 1000,
        },
        locale: 'zh-TW',
        orderDestination: '東京',
        promo: {
          id: 'promo',
        },
        reminders: {
          title: '旅遊提醒',
        },
        sectionContentOverrides: {
          hotel: {
            title: '推薦飯店',
            subtitle: '精選飯店',
            viewMoreLabel: '查看更多',
            viewMorePlaceholderLabel: '更多飯店即將推出',
            ignored: 'ignored',
          },
          attraction: {
            title: 123,
          },
          unknown: {
            title: '不支援的區塊',
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
    expect(props.orderDestination).toBe('東京')
    expect(props.hsrAddon).toEqual({
      id: 'hsr-addon',
      title: '高鐵加購',
      description: '加購高鐵票券',
      ctaLabel: '選擇高鐵',
    })
    expect(props.promo).toEqual({ id: 'promo' })
    expect(props.reminders).toEqual({ title: '旅遊提醒' })
    expect(props.sectionContentOverrides).toEqual({
      hotel: {
        title: '推薦飯店',
        subtitle: '精選飯店',
        viewMoreLabel: '查看更多',
        viewMorePlaceholderLabel: '更多飯店即將推出',
      },
    })
    expect('domainMode' in props).toBe(false)
    expect('serviceAgent' in props).toBe(false)
  })

  it('會保留 scalar attributes 高於 properties 與 config 的優先序', async () => {
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

    element.setAttribute('currency', 'SCALAR_ATTRIBUTE_CURRENCY')
    element.setAttribute('locale', 'scalar-attribute-locale')
    element.setAttribute('order-destination', 'scalar attribute destination')
    element.setAttribute('promo-duration-seconds', '120')

    const props = await renderElement(element)

    expect(props.currency).toBe('SCALAR_ATTRIBUTE_CURRENCY')
    expect(props.locale).toBe('scalar-attribute-locale')
    expect(props.orderDestination).toBe('scalar attribute destination')
    expect(props.promoDurationSeconds).toBe(120)
  })

  it('會保留 visibleBlocks property 高於 visible-blocks attribute 的優先序', async () => {
    const element = createElement()

    element.visibleBlocks = {
      hotel: true,
      hsr: false,
      promoHeader: 'invalid',
    }
    element.setAttribute(
      'visible-blocks',
      JSON.stringify({
        hotel: false,
        attraction: false,
      }),
    )

    const props = await renderElement(element)

    expect(props.visibleBlocks).toEqual({
      hotel: true,
      hsr: false,
    })
  })

  it('沒有 scalar attributes 時會依目前優先序使用 direct properties 與 config properties', async () => {
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

  it('會解析有效的 enum-like attributes 與 source product properties', async () => {
    const element = createElement()

    element.setAttribute('environment', 'uat')
    element.setAttribute('error-mode', 'message')
    element.sourceProduct = 'hotel'

    const props = await renderElement(element)

    expect(props.environment).toBe('uat')
    expect(props.errorMode).toBe('message')
    expect(props.sourceProduct).toBe('hotel')
  })

  it('會將 callbacks 橋接成 composed bubbling CustomEvents', async () => {
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
        title: '飯店',
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
