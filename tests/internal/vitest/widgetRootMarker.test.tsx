import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  widgetRootNameAttribute,
  widgetRootSelector,
} from '../../../src/runtime/widgetRoot'
import { DemoProductBanner } from '../../../src/widgets/demo-product-banner'
import { ThemedDemoProductBanner } from '../../../src/widgets/themed-demo-product-banner'

const products = [{ id: 'p1', name: '商品 A', price: 1200 }]

describe('widget root marker', () => {
  it('renders the base widget root marker', () => {
    const { container } = render(
      <DemoProductBanner title="推薦商品" products={products} />,
    )

    const root = container.querySelector(widgetRootSelector)

    expect(root).not.toBeNull()
    expect(root?.getAttribute(widgetRootNameAttribute)).toBe(
      'demo-product-banner',
    )
  })

  it('renders the themed widget root marker', () => {
    const { container } = render(
      <ThemedDemoProductBanner title="推薦商品" products={products} />,
    )

    const root = container.querySelector(widgetRootSelector)

    expect(root).not.toBeNull()
    expect(root?.getAttribute(widgetRootNameAttribute)).toBe(
      'themed-demo-product-banner',
    )
  })
})
