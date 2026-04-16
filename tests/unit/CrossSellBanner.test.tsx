import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CrossSellBanner } from '../../src/widgets/cross-sell-banner'

const products = [{ id: 'p1', name: '商品 A', price: 1200 }]

describe('CrossSellBanner root marker', () => {
  it('renders a stable widget root marker', () => {
    const { container } = render(
      <CrossSellBanner title="推薦商品" products={products} />,
    )

    expect(container.querySelector('[data-cross-sell-widget]')).not.toBeNull()
  })
})
