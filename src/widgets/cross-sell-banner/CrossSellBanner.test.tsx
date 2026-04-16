import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CrossSellBanner } from './CrossSellBanner'

const products = [
  { id: 'p1', name: '商品 A', price: 1200 },
  { id: 'p2', name: '商品 B', price: 900 },
]

describe('CrossSellBanner', () => {
  it('renders products and calls onSelectProduct', async () => {
    const user = userEvent.setup()
    const onSelectProduct = vi.fn()

    render(
      <CrossSellBanner
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
    render(<CrossSellBanner products={[]} title="推薦商品" />)

    expect(screen.getByText('目前沒有可推薦的商品。')).toBeInTheDocument()
  })

  it('renders loading state', () => {
    render(<CrossSellBanner loading products={[]} title="推薦商品" />)

    expect(screen.getByText('推薦商品')).toBeInTheDocument()
    expect(screen.getAllByTestId('loading-card')).toHaveLength(2)
  })
})
