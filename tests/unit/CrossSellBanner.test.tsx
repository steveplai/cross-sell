import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  widgetRootNameAttribute,
  widgetRootSelector,
} from '../../src/runtime/widgetRoot'
import { CrossSellBanner } from '../../src/widgets/cross-sell-banner'
import { ThemedCrossSellBanner } from '../../src/widgets/themed-cross-sell-banner'

const products = [{ id: 'p1', name: '商品 A', price: 1200 }]

describe('CrossSellBanner root marker', () => {
  it('renders the base widget root marker', () => {
    const { container } = render(
      <CrossSellBanner title="推薦商品" products={products} />,
    )

    const root = container.querySelector(widgetRootSelector)

    expect(root).not.toBeNull()
    expect(root?.getAttribute(widgetRootNameAttribute)).toBe(
      'cross-sell-banner',
    )
  })

  it('renders the themed widget root marker', () => {
    const { container } = render(
      <ThemedCrossSellBanner title="推薦商品" products={products} />,
    )

    const root = container.querySelector(widgetRootSelector)

    expect(root).not.toBeNull()
    expect(root?.getAttribute(widgetRootNameAttribute)).toBe(
      'themed-cross-sell-banner',
    )
  })
})
