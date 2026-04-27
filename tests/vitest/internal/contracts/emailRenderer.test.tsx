import { render as renderEmail } from '@react-email/render'
import { describe, expect, it } from 'vitest'

import { DemoProductOfferEmail } from '../../../../src/emails/demo-product-offer/DemoProductOfferEmail'
import { sampleProducts } from '../../../../src/emails/demo-product-offer/sample-data'

function parseEmailHtml(html: string) {
  return new DOMParser().parseFromString(html, 'text/html')
}

describe('email renderer', () => {
  it('renders a React Email template to HTML', async () => {
    const ctaUrl = 'https://example.com/recommendations'
    const title = '你的專屬加購推薦'
    const html = await renderEmail(
      <DemoProductOfferEmail
        ctaUrl={ctaUrl}
        products={sampleProducts}
        title={title}
      />,
    )
    const document = parseEmailHtml(html)

    expect(document.documentElement.getAttribute('lang')).toBe('zh-TW')
    expect(html).toContain(title)
    expect(html).toContain('商品 A')
    expect(
      document.querySelector(`a[href="${ctaUrl}"]`)?.textContent,
    ).toContain('查看推薦')
  })
})
