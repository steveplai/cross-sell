import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { PromoCountdown } from './PromoCountdown'

const activePromo = {
  id: 'promo',
  activeTitle: '限時優惠',
  expiredTitle: '優惠已結束',
  startsAt: '2026-04-21T10:00:00Z',
  durationSeconds: 90061,
  serviceLabel: '服務專員',
}

describe('PromoCountdown', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('會渲染 countdown accessibility label 與 unit labels', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-21T10:00:00Z'))

    render(<PromoCountdown promo={activePromo} />)

    expect(
      screen.getByLabelText('優惠倒數 1 天 1 時 1 分 1 秒'),
    ).toBeInTheDocument()

    expect(screen.getByText('天')).toBeInTheDocument()
    expect(screen.getByText('時')).toBeInTheDocument()
    expect(screen.getByText('分')).toBeInTheDocument()
    expect(screen.getByText('秒')).toBeInTheDocument()
  })

  it('會每秒更新 countdown 數字', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-21T10:00:00Z'))

    render(
      <PromoCountdown
        promo={{
          ...activePromo,
          durationSeconds: 10,
        }}
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
  })

  it('倒數歸零後會清除 interval 並停止繼續倒數', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-21T10:00:00Z'))
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval')

    render(
      <PromoCountdown
        promo={{
          ...activePromo,
          durationSeconds: 1,
        }}
      />,
    )

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(clearIntervalSpy).toHaveBeenCalled()
    expect(
      screen.getByLabelText('優惠倒數 0 天 0 時 0 分 0 秒'),
    ).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(
      screen.getByLabelText('優惠倒數 0 天 0 時 0 分 0 秒'),
    ).toBeInTheDocument()
  })

  it('unmount 時會清除 interval', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-21T10:00:00Z'))
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval')

    const { unmount } = render(
      <PromoCountdown
        promo={{
          ...activePromo,
          durationSeconds: 10,
        }}
      />,
    )

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})
