import { act, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { WidgetBuildMetadata } from '../../runtime/buildMetadata'
import type { CrossSellWidgetProps } from '../../widgets/cross-sell-widget'

const widgetMockState = vi.hoisted(() => ({
  props: undefined as unknown,
}))

vi.mock('../../widgets/cross-sell-widget', async (importOriginal) => {
  const actual = await importOriginal<object>()

  return {
    ...actual,
    CrossSellWidget: (props: unknown) => {
      widgetMockState.props = props

      return null
    },
  }
})

import './wc'

type CrossSellElement = HTMLElement & {
  version?: string
  build?: WidgetBuildMetadata
  data?: unknown
}

function createElement() {
  return document.createElement('cross-sell-widget') as CrossSellElement
}

async function renderElement(element: HTMLElement) {
  await act(async () => {
    document.body.appendChild(element)
  })

  await waitFor(() => {
    expect(widgetMockState.props).toBeDefined()
  })

  return widgetMockState.props as CrossSellWidgetProps
}

describe('cross-sell-widget Web Component 契約', () => {
  afterEach(async () => {
    await act(async () => {
      document.body.innerHTML = ''
    })

    widgetMockState.props = undefined
  })

  it('會維持公開 observed attributes 與 properties 不變', () => {
    const elementConstructor = customElements.get('cross-sell-widget') as
      | (CustomElementConstructor & {
          observedAttributes: string[]
        })
      | undefined

    expect(elementConstructor).toBeDefined()
    expect(elementConstructor?.observedAttributes).toEqual(['data'])

    const element = createElement()
    const descriptor = Object.getOwnPropertyDescriptor(
      elementConstructor?.prototype,
      'data',
    )

    expect(descriptor?.get).toBeTypeOf('function')
    expect(descriptor?.set).toBeTypeOf('function')
    expect('data' in element).toBe(true)
  })

  it('會在 constructor 與 element instance 上暴露建置資訊', async () => {
    const elementConstructor = customElements.get('cross-sell-widget') as
      | (CustomElementConstructor & {
          version?: string
          build?: WidgetBuildMetadata
        })
      | undefined

    expect(elementConstructor?.version).toBe('development')
    expect(elementConstructor?.build).toEqual({
      version: 'development',
      widgetName: 'cross-sell-widget',
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

  it('沒有 data attribute 時會 fallback 成空 sections', async () => {
    const props = await renderElement(createElement())

    expect(props.sections).toEqual([])
  })

  it('遇到無效 data JSON 時會安全 fallback 成空 sections', async () => {
    const element = createElement()

    element.setAttribute('data', '{')

    const props = await renderElement(element)

    expect(props.sections).toEqual([])
  })

  it('會從 data attribute 解析公開 widget props', async () => {
    const element = createElement()

    element.setAttribute(
      'data',
      JSON.stringify({
        currency: 'TWD',
        locale: 'zh-TW',
        orderDestination: '東京',
        sections: [
          {
            id: 'hotel-section',
            kind: 'hotel',
            items: [
              {
                id: 'hotel-1',
                title: '東京飯店',
                price: 1200,
              },
            ],
          },
        ],
      }),
    )

    const props = await renderElement(element)

    expect(props.currency).toBe('TWD')
    expect(props.locale).toBe('zh-TW')
    expect(props.orderDestination).toBe('東京')
    expect(props.sections).toEqual([
      {
        id: 'hotel-section',
        kind: 'hotel',
        items: [
          {
            id: 'hotel-1',
            title: '東京飯店',
            price: 1200,
          },
        ],
      },
    ])
  })

  it('會讓 data property 優先於 data attribute 並補齊缺省 sections', async () => {
    const element = createElement()

    element.setAttribute(
      'data',
      JSON.stringify({
        currency: 'ATTRIBUTE_CURRENCY',
        sections: [
          {
            id: 'attribute-section',
            items: [],
          },
        ],
      }),
    )
    element.data = {
      currency: 'PROPERTY_CURRENCY',
      orderDestination: '東京',
    }

    const props = await renderElement(element)

    expect(props.currency).toBe('PROPERTY_CURRENCY')
    expect(props.orderDestination).toBe('東京')
    expect(props.sections).toEqual([])
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
      addonId: 'hsr',
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
