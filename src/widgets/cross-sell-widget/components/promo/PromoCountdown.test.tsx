import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PromoCountdown } from './PromoCountdown'

describe('PromoCountdown', () => {
  it('renders the countdown accessibility label and unit labels', () => {
    render(<PromoCountdown remainingSeconds={90061} />)

    expect(
      screen.getByLabelText('優惠倒數 1 天 1 時 1 分 1 秒'),
    ).toBeInTheDocument()

    expect(screen.getByText('天')).toBeInTheDocument()
    expect(screen.getByText('時')).toBeInTheDocument()
    expect(screen.getByText('分')).toBeInTheDocument()
    expect(screen.getByText('秒')).toBeInTheDocument()
  })
})
