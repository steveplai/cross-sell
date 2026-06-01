import { act, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { WidgetBuildMetadata } from '../../runtime/buildMetadata'
import type { ThemedDemoProductBannerProps } from '../../widgets/themed-demo-product-banner'

const widgetMockState = vi.hoisted(() => ({
  props: undefined as unknown,
}))

vi.mock('../../widgets/themed-demo-product-banner', async (importOriginal) => {
  const actual = await importOriginal<object>()

  return {
    ...actual,
    ThemedDemoProductBanner: (props: unknown) => {
      widgetMockState.props = props

      return null
    },
  }
})

import './wc'

type ThemedDemoProductBannerElement = HTMLElement & {
  version?: string
  build?: WidgetBuildMetadata
}

function createElement() {
  return document.createElement(
    'themed-demo-product-banner',
  ) as ThemedDemoProductBannerElement
}

async function renderElement(element: HTMLElement) {
  await act(async () => {
    document.body.appendChild(element)
  })

  await waitFor(() => {
    expect(widgetMockState.props).toBeDefined()
  })

  return widgetMockState.props as ThemedDemoProductBannerProps
}

describe('themed-demo-product-banner Web Component 契約', () => {
  afterEach(async () => {
    await act(async () => {
      document.body.innerHTML = ''
    })

    widgetMockState.props = undefined
  })

  it('會維持公開 observed attributes 不變', () => {
    const elementConstructor = customElements.get(
      'themed-demo-product-banner',
    ) as
      | (CustomElementConstructor & {
          observedAttributes: string[]
        })
      | undefined

    expect(elementConstructor).toBeDefined()
    expect(elementConstructor?.observedAttributes).toEqual([
      'title',
      'locale',
      'layout',
      'products',
    ])
  })

  it('會在 constructor 與 element instance 上暴露建置資訊', async () => {
    const elementConstructor = customElements.get(
      'themed-demo-product-banner',
    ) as
      | (CustomElementConstructor & {
          version?: string
          build?: WidgetBuildMetadata
        })
      | undefined

    expect(elementConstructor?.version).toBe('development')
    expect(elementConstructor?.build).toEqual({
      version: 'development',
      widgetName: 'themed-demo-product-banner',
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

  it('沒有 attributes 時會使用預設 props 與 fallback products', async () => {
    const props = await renderElement(createElement())

    expect(props).toMatchObject({
      title: '推薦商品',
      locale: 'zh-TW',
      layout: 'grid',
      products: [{ id: 'demo-1', name: '加購推薦商品', price: 1200 }],
    })
  })

  it('遇到無效 products JSON 時會安全 fallback', async () => {
    const element = createElement()

    element.setAttribute('products', '{')

    const props = await renderElement(element)

    expect(props.products).toEqual([
      { id: 'demo-1', name: '加購推薦商品', price: 1200 },
    ])
  })

  it('會從 attributes 解析公開 widget props', async () => {
    const products = [
      {
        id: 'product-1',
        name: '商品 A',
        price: 1200,
      },
    ]
    const element = createElement()

    element.setAttribute('title', '客製主題推薦')
    element.setAttribute('locale', 'en-US')
    element.setAttribute('layout', 'carousel')
    element.setAttribute('products', JSON.stringify(products))

    const props = await renderElement(element)

    expect(props.title).toBe('客製主題推薦')
    expect(props.locale).toBe('en-US')
    expect(props.layout).toBe('carousel')
    expect(props.products).toEqual(products)
  })

  it('會將 onSelectProduct callback 橋接成 composed bubbling CustomEvent', async () => {
    const element = createElement()
    const events: CustomEvent[] = []

    element.addEventListener('demo-product:product-select', (event) => {
      events.push(event as CustomEvent)
    })

    const props = await renderElement(element)
    const product = {
      id: 'product-1',
      name: '商品 A',
      price: 1200,
    }

    props.onSelectProduct?.(product)

    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('demo-product:product-select')
    expect(events[0].detail).toEqual({ product })
    expect(events[0].bubbles).toBe(true)
    expect(events[0].composed).toBe(true)
  })
})
