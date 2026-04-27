import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FlipNumber } from './FlipNumber'

function getFlipNumberElement(container: HTMLElement) {
  const element = container.querySelector('.csc-flip-number')

  expect(element).toBeInstanceOf(HTMLElement)

  return element as HTMLElement
}

describe('FlipNumber', () => {
  it('pads numeric values to the minimum digit count', () => {
    const { container } = render(<FlipNumber value={9} />)

    expect(getFlipNumberElement(container).textContent).toBe('09')
  })

  it('renders non-numeric strings without padding', () => {
    const { container } = render(<FlipNumber value="AB" />)

    expect(getFlipNumberElement(container).textContent).toBe('AB')
  })

  it('pads numeric string values to the minimum digit count', () => {
    const { container } = render(<FlipNumber value="9" />)

    expect(getFlipNumberElement(container).textContent).toBe('09')
  })

  it('marks the divider as hidden when disabled', () => {
    const { container } = render(
      <FlipNumber divider={{ visible: false }} value={9} />,
    )

    expect(getFlipNumberElement(container)).toHaveAttribute(
      'data-flip-number-divider',
      'hidden',
    )
  })

  it('maps divider options to CSS variables', () => {
    const { container } = render(
      <FlipNumber
        divider={{
          color: '#111827',
          opacity: 0.12,
          thickness: 2,
        }}
        value={9}
      />,
    )
    const element = getFlipNumberElement(container)

    expect(
      element.style.getPropertyValue('--csc-flip-number-divider-color'),
    ).toBe('#111827')
    expect(
      element.style.getPropertyValue('--csc-flip-number-divider-opacity'),
    ).toBe('0.12')
    expect(
      element.style.getPropertyValue('--csc-flip-number-divider-thickness'),
    ).toBe('2px')
  })
})
