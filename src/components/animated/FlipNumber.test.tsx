import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FlipNumber } from './FlipNumber'

function getFlipNumberElement(container: HTMLElement) {
  const element = container.querySelector('.csc-flip-number')

  expect(element).toBeInstanceOf(HTMLElement)

  return element as HTMLElement
}

describe('FlipNumber', () => {
  it('會將 numeric values 補齊到 minimum digit count', () => {
    const { container } = render(<FlipNumber value={9} />)

    expect(getFlipNumberElement(container).textContent).toBe('09')
  })

  it('會渲染 non-numeric strings 且不補位', () => {
    const { container } = render(<FlipNumber value="AB" />)

    expect(getFlipNumberElement(container).textContent).toBe('AB')
  })

  it('會將 numeric string values 補齊到 minimum digit count', () => {
    const { container } = render(<FlipNumber value="9" />)

    expect(getFlipNumberElement(container).textContent).toBe('09')
  })

  it('disabled 時會將 divider 標記為 hidden', () => {
    const { container } = render(
      <FlipNumber divider={{ visible: false }} value={9} />,
    )

    expect(getFlipNumberElement(container)).toHaveAttribute(
      'data-flip-number-divider',
      'hidden',
    )
  })

  it('會將 divider options 對應到 CSS variables', () => {
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
