import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { FlightOrderCrossSell } from './FlightOrderCrossSell'
import { flightOrderCrossSellSampleData } from './sampleData'
import type { FlightOrderCrossSellData } from './types'

function cloneSampleData(overrides: Partial<FlightOrderCrossSellData> = {}) {
  const sampleData = JSON.parse(
    JSON.stringify(flightOrderCrossSellSampleData),
  ) as FlightOrderCrossSellData

  return {
    ...sampleData,
    ...overrides,
  }
}

describe('FlightOrderCrossSell', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders active promo countdown and title', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-21T10:00:00Z'))

    render(
      <FlightOrderCrossSell
        data={cloneSampleData({
          promo: {
            ...flightOrderCrossSellSampleData.promo,
            durationSeconds: 7200,
            startsAt: '2026-04-21T09:00:00Z',
          },
        })}
      />,
    )

    expect(screen.getByText('您已解鎖限時優惠！')).toBeInTheDocument()
    expect(
      screen.getByLabelText('優惠倒數 0 天 1 時 0 分 0 秒'),
    ).toBeInTheDocument()
  })

  it('renders sections, products, and action CTAs', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-21T10:00:00Z'))

    render(<FlightOrderCrossSell data={cloneSampleData()} />)

    expect(
      screen.getByRole('heading', { name: '探索東京飯店' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '探索東京 景點不錯過' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '當地交通 一次搞定' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /LA VISTA 東京灣/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /東京迪士尼門票/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /東京成田\/羽田機場至東京都市區/ }),
    ).toBeInTheDocument()
    expect(screen.getAllByLabelText('飯店星等 5 顆星').length).toBeGreaterThan(
      0,
    )
    expect(screen.getAllByText('江東區').length).toBeGreaterThan(0)

    expect(screen.getAllByRole('button', { name: /探索更多/ }).length).toBe(3)
    expect(screen.getByRole('button', { name: '前往加購' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /網路服務/ })).toBeInTheDocument()
  })

  it('shows the full duration before the promo starts', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-21T10:00:00Z'))

    render(
      <FlightOrderCrossSell
        data={cloneSampleData({
          promo: {
            ...flightOrderCrossSellSampleData.promo,
            durationSeconds: 3600,
            startsAt: '2026-04-21T10:10:00Z',
          },
        })}
      />,
    )

    expect(
      screen.getByLabelText('優惠倒數 0 天 1 時 0 分 0 秒'),
    ).toBeInTheDocument()
  })

  it('updates countdown every second and clears the interval on unmount', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-21T10:00:00Z'))
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval')

    const { unmount } = render(
      <FlightOrderCrossSell
        data={cloneSampleData({
          promo: {
            ...flightOrderCrossSellSampleData.promo,
            durationSeconds: 10,
            startsAt: '2026-04-21T10:00:00Z',
          },
        })}
      />,
    )

    expect(
      screen.getByLabelText('優惠倒數 0 天 0 時 0 分 10 秒'),
    ).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(
      screen.getByLabelText('優惠倒數 0 天 0 時 0 分 9 秒'),
    ).toBeInTheDocument()

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })

  it('renders expired state without special offer pricing', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-21T10:00:00Z'))

    render(
      <FlightOrderCrossSell
        data={cloneSampleData({
          promo: {
            ...flightOrderCrossSellSampleData.promo,
            durationSeconds: 3600,
            startsAt: '2026-04-21T08:00:00Z',
          },
        })}
      />,
    )

    expect(screen.getByText('發現更多旅遊靈感！')).toBeInTheDocument()
    expect(screen.queryByText('您已解鎖限時優惠！')).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/優惠倒數/)).not.toBeInTheDocument()
    expect(screen.queryByText('折扣 20%')).not.toBeInTheDocument()
    expect(screen.queryByText(/1,825/)).not.toBeInTheDocument()
    expect(screen.getAllByText('1,224,152').length).toBeGreaterThan(0)
  })

  it('calls callbacks with product, section, and addon payloads', async () => {
    const user = userEvent.setup()
    const onSelectAddon = vi.fn()
    const onSelectItem = vi.fn()
    const onViewMore = vi.fn()

    render(
      <FlightOrderCrossSell
        data={cloneSampleData()}
        onSelectAddon={onSelectAddon}
        onSelectItem={onSelectItem}
        onViewMore={onViewMore}
      />,
    )

    await user.click(screen.getAllByRole('button', { name: /探索更多/ })[0])
    await user.click(screen.getByRole('button', { name: /LA VISTA 東京灣/ }))
    await user.click(screen.getByRole('button', { name: /前往加購/ }))

    expect(onViewMore).toHaveBeenCalledWith({ sectionId: 'tokyo-hotels' })
    expect(onSelectItem).toHaveBeenCalledWith(
      expect.objectContaining({
        sectionId: 'tokyo-hotels',
        item: expect.objectContaining({ id: 'la-vista-tokyo-bay' }),
      }),
    )
    expect(onSelectAddon).toHaveBeenCalledWith({ addonId: 'hsr' })
  })
})
