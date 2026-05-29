import { cleanup, render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { afterEach, describe, expect, it } from 'vitest'

import {
  widgetRootNameAttribute,
  widgetRootSelector,
} from '../../../../src/runtime/widgetRoot'
import {
  CrossSellWidget,
  CrossSellWidgetConnected,
  crossSellWidgetSampleData,
} from '../../../../src/widgets/cross-sell-widget'
import { DemoProductBanner } from '../../../../src/widgets/demo-product-banner'
import { ThemedDemoProductBanner } from '../../../../src/widgets/themed-demo-product-banner'

const products = [{ id: 'p1', name: '商品 A', price: 1200 }]

type WidgetRootMarkerCase = {
  renderWidget: () => ReactElement
  widgetName: string
}

const widgetRootMarkerCases: WidgetRootMarkerCase[] = [
  {
    renderWidget: () => (
      <DemoProductBanner title="推薦商品" products={products} />
    ),
    widgetName: 'demo-product-banner',
  },
  {
    renderWidget: () => (
      <ThemedDemoProductBanner title="推薦商品" products={products} />
    ),
    widgetName: 'themed-demo-product-banner',
  },
  {
    renderWidget: () => <CrossSellWidget {...crossSellWidgetSampleData} />,
    widgetName: 'cross-sell-widget',
  },
  {
    renderWidget: () => <CrossSellWidgetConnected errorMode="message" />,
    widgetName: 'cross-sell-widget-connected',
  },
]

describe('widget 根節點標記', () => {
  afterEach(() => {
    cleanup()
  })

  for (const widget of widgetRootMarkerCases) {
    it(`會渲染 ${widget.widgetName} 的根節點標記`, () => {
      const { container } = render(widget.renderWidget())

      const root = container.querySelector(widgetRootSelector)

      expect(root).not.toBeNull()
      expect(root?.getAttribute(widgetRootNameAttribute)).toBe(
        widget.widgetName,
      )
    })
  }
})
