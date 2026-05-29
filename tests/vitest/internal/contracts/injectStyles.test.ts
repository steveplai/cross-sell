import { afterEach, describe, expect, it } from 'vitest'

import { injectStyles } from '../../../../src/runtime/injectStyles'

describe('injectStyles 樣式注入契約', () => {
  afterEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
  })

  it('會將 Shadow DOM 樣式中的 CSS property rules 註冊到 document', () => {
    const host = document.createElement('div')
    const shadow = host.attachShadow({ mode: 'open' })
    const css = [
      '@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}',
      '.shadow{box-shadow:var(--tw-shadow)}',
    ].join('')

    injectStyles(shadow, 'test-widget', css)
    injectStyles(shadow, 'test-widget', css)

    const propertyStyles = document.head.querySelectorAll(
      'style[data-cross-sell-style="test-widget:properties"]',
    )
    const shadowStyles = shadow.querySelectorAll(
      'style[data-cross-sell-style="test-widget"]',
    )

    expect(propertyStyles).toHaveLength(1)
    expect(propertyStyles[0]?.textContent).toBe(
      '@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}',
    )
    expect(shadowStyles).toHaveLength(1)
    expect(shadowStyles[0]?.textContent).toBe(css)
  })
})
