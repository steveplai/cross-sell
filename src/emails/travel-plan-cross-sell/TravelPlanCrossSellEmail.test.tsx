import { render as renderEmail } from '@react-email/render'
import { describe, expect, it } from 'vitest'

import { createInsuranceCrossSellEmailContent } from './content/insurance'
import { createOrderCrossSellEmailContent } from './content/order'
import { createSalesCrossSellEmailContent } from './content/sales'
import { createTravelPlanCrossSellAssetUrls } from './content/shared-assets'
import { TravelPlanCrossSellEmail } from './TravelPlanCrossSellEmail'
import type { TravelPlanCrossSellEmailProps } from './types'

function parseEmailHtml(html: string) {
  return new DOMParser().parseFromString(html, 'text/html')
}

function expectLink(document: Document, label: string, href: string) {
  const links = Array.from(document.querySelectorAll('a'))

  expect(
    links.some(
      (link) =>
        link.textContent?.includes(label) && link.getAttribute('href') === href,
    ),
  ).toBe(true)
}

function expectImage(document: Document, src: string) {
  const imageSrcs = Array.from(document.querySelectorAll('img')).map((image) =>
    image.getAttribute('src'),
  )

  expect(imageSrcs).toContain(src)
}

describe('TravelPlanCrossSellEmail', () => {
  it.each([
    {
      name: 'order',
      createContent: createOrderCrossSellEmailContent,
      expectedCtaLabel: '立即預訂交通票券',
      expectedCtaUrl: 'https://example.com/order-cross-sell/transportation',
      expectedRecommendation:
        '日本-東京成田/羽田機場至東京市區/郊區 | 機場接送專車',
    },
    {
      name: 'sales',
      createContent: createSalesCrossSellEmailContent,
      expectedCtaLabel: '立即搜尋飯店',
      expectedCtaUrl: 'https://example.com/sales-cross-sell/hotels',
      expectedRecommendation: 'OMO5 東京大塚 by 星野集團',
    },
    {
      name: 'insurance',
      createContent: createInsuranceCrossSellEmailContent,
      expectedCtaLabel: '申請簽證代辦',
      expectedCtaUrl:
        'https://example.com/insurance-cross-sell/visa-passport?utm_source=insurance&utm_medium=email&utm_campaign=visa-addon&utm_content=flight',
    },
  ] satisfies Array<{
    name: string
    createContent: (
      assetUrls: ReturnType<typeof createTravelPlanCrossSellAssetUrls>,
    ) => TravelPlanCrossSellEmailProps
    expectedCtaLabel: string
    expectedCtaUrl: string
    expectedRecommendation?: string
  }>)(
    'renders the $name cross-sell content contract',
    async ({
      createContent,
      expectedCtaLabel,
      expectedCtaUrl,
      expectedRecommendation,
    }) => {
      const assetUrls = createTravelPlanCrossSellAssetUrls('production')
      const content = createContent(assetUrls)
      const html = await renderEmail(<TravelPlanCrossSellEmail {...content} />)
      const document = parseEmailHtml(html)

      expect(document.documentElement.getAttribute('lang')).toBe('zh-TW')
      expect(html).toContain(content.previewText)
      expect(html).toContain(content.title)
      expect(html).toContain('抵達啟程')
      expect(html).toContain('飯店下榻')
      expect(html).toContain('在地探索')
      expect(html).toContain('高鐵加購')
      expectLink(document, expectedCtaLabel, expectedCtaUrl)
      expectImage(document, assetUrls.transportIconUrl)

      if (content.highlights?.length) {
        expectImage(document, assetUrls.checkIconUrl)
      }

      if (content.deadlineText) {
        expect(html).toContain(content.deadlineText)
      }

      if (expectedRecommendation) {
        expect(html).toContain(expectedRecommendation)
        expectImage(document, assetUrls.arrowIconUrl)
      }
    },
  )

  it('enables header description and CTA only for the configured featured content', () => {
    const assetUrls = createTravelPlanCrossSellAssetUrls('production')
    const orderContent = createOrderCrossSellEmailContent(assetUrls)
    const salesContent = createSalesCrossSellEmailContent(assetUrls)
    const insuranceContent = createInsuranceCrossSellEmailContent(assetUrls)

    expect(
      orderContent.sections.find((section) => section.variant === 'featured')
        ?.showHeaderDescriptionAndCta,
    ).toBeUndefined()
    expect(
      salesContent.sections.find((section) => section.variant === 'featured')
        ?.showHeaderDescriptionAndCta,
    ).toBe(true)
    expect(
      insuranceContent.sections.filter(
        (section) => section.showHeaderDescriptionAndCta,
      ),
    ).toHaveLength(0)
  })
})
