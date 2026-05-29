import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import {
  widgetRootNameAttribute,
  widgetRootSelector,
} from '../../runtime/widgetRoot'
import { DemoProductBanner } from './DemoProductBanner'

const products = [
  { id: 'p1', name: '商品 A', price: 1200 },
  { id: 'p2', name: '商品 B', price: 900 },
]

describe('DemoProductBanner', () => {
  it('renders its widget root marker', () => {
    const { container } = render(
      <DemoProductBanner products={products} title="推薦商品" />,
    )

    const root = container.querySelector(widgetRootSelector)

    expect(root).not.toBeNull()
    expect(root?.getAttribute(widgetRootNameAttribute)).toBe(
      'demo-product-banner',
    )
  })

  it('renders products and calls onSelectProduct', async () => {
    const user = userEvent.setup()
    const onSelectProduct = vi.fn()

    render(
      <DemoProductBanner
        onSelectProduct={onSelectProduct}
        products={products}
        title="推薦商品"
      />,
    )

    expect(screen.getByText('推薦商品')).toBeInTheDocument()
    expect(screen.getByText('商品 A')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /加入 商品 A/i }))

    expect(onSelectProduct).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'p1' }),
    )
  })

  it('renders empty state without crashing', () => {
    render(<DemoProductBanner products={[]} title="推薦商品" />)

    expect(screen.getByText('目前沒有可推薦的商品。')).toBeInTheDocument()
  })

  it('renders loading state', () => {
    render(<DemoProductBanner loading products={[]} title="推薦商品" />)

    expect(screen.getByText('推薦商品')).toBeInTheDocument()
    expect(screen.getAllByTestId('loading-card')).toHaveLength(2)
  })

  it.each([
    ['compact', 'grid-cols-1'],
    ['carousel', 'overflow-x-auto'],
  ] as const)('renders the %s layout class', (layout, expectedClassName) => {
    render(
      <DemoProductBanner
        layout={layout}
        products={products}
        title="推薦商品"
      />,
    )

    expect(screen.getByTestId('product-list')).toHaveClass(expectedClassName)
  })

  it('renders product images when imageUrl is provided', () => {
    const { container } = render(
      <DemoProductBanner
        products={[
          {
            id: 'p1',
            imageUrl: 'https://example.com/product-a.jpg',
            name: '商品 A',
            price: 1200,
          },
        ]}
        title="推薦商品"
      />,
    )

    expect(
      container.querySelector('img[src="https://example.com/product-a.jpg"]'),
    ).toBeInTheDocument()
  })
})
