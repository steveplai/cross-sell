import { fireEvent, render, screen } from '@testing-library/react'

import { CrossSellWidget } from './CrossSellWidget'
import { crossSellWidgetSampleData } from './sampleData'

describe('CrossSellWidget', () => {
  it('renders promo title', () => {
    render(<CrossSellWidget {...crossSellWidgetSampleData} />)

    expect(screen.getByText('您已解鎖限時優惠！')).toBeInTheDocument()
  })

  it('renders featured addon', () => {
    render(<CrossSellWidget {...crossSellWidgetSampleData} />)

    expect(screen.getByText('加購交通 行程更順暢')).toBeInTheDocument()
  })

  it('renders sections and items', () => {
    render(<CrossSellWidget {...crossSellWidgetSampleData} />)

    expect(screen.getByText('精選住宿推薦')).toBeInTheDocument()
    expect(screen.getByText('東京灣精選飯店')).toBeInTheDocument()
  })

  it('fires onSelectItem event', () => {
    const onSelectItem = vi.fn()

    render(
      <CrossSellWidget
        {...crossSellWidgetSampleData}
        onSelectItem={onSelectItem}
      />,
    )

    fireEvent.click(screen.getByText('東京灣精選飯店'))

    expect(onSelectItem).toHaveBeenCalled()
  })

  it('fires onSelectAddon event', () => {
    const onSelectAddon = vi.fn()

    render(
      <CrossSellWidget
        {...crossSellWidgetSampleData}
        onSelectAddon={onSelectAddon}
      />,
    )

    fireEvent.click(screen.getByText('前往加購'))

    expect(onSelectAddon).toHaveBeenCalled()
  })
})
