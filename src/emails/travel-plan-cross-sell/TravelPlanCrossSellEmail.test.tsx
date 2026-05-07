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

function expectImagesHaveSize(
  document: Document,
  src: string,
  width: string,
  height: string,
) {
  const images = Array.from(document.querySelectorAll(`img[src="${src}"]`))

  expect(images.length).toBeGreaterThan(0)

  images.forEach((image) => {
    expect(image.getAttribute('width')).toBe(width)
    expect(image.getAttribute('height')).toBe(height)
  })
}

function expectLinksAndSpansDoNotUseCssEllipsis(document: Document) {
  const riskyElements = Array.from(
    document.querySelectorAll('a[style], span[style]'),
  ).filter((element) => {
    const style = element.getAttribute('style')?.replace(/\s/g, '') ?? ''

    return (
      style.includes('text-overflow') ||
      style.includes('overflow:hidden') ||
      style.includes('max-width')
    )
  })

  expect(riskyElements).toHaveLength(0)
}

function expectLinksDoNotRenderUnderlineStyles(document: Document) {
  const underlinedLinks = Array.from(document.querySelectorAll('a')).filter(
    (link) => {
      const style = link.getAttribute('style')?.toLowerCase() ?? ''

      return style.includes('underline')
    },
  )

  expect(underlinedLinks).toHaveLength(0)
}

function expectHeaderCellsUseFixedMiddleAlignment(
  document: Document,
  title: string,
  deadlineText: string,
) {
  const titleCell = Array.from(document.querySelectorAll('td')).find(
    (cell) => cell.textContent?.trim() === title,
  )
  const deadlineTextSpans = Array.from(document.querySelectorAll('span')).filter(
    (span) => span.textContent?.trim() === deadlineText,
  )
  const deadlineSpan = deadlineTextSpans[0]
  const deadlineWrapperCell = deadlineSpan?.closest('td')

  expect(titleCell?.getAttribute('height')).toBe('30')
  expect(titleCell?.getAttribute('valign')).toBe('middle')
  expect(titleCell?.getAttribute('style')).toContain('vertical-align:middle')
  expect(deadlineTextSpans).toHaveLength(1)
  expect(deadlineWrapperCell?.getAttribute('valign')).toBe('middle')
  expect(deadlineWrapperCell?.getAttribute('style')).toContain('height:30px')
  expect(deadlineWrapperCell?.getAttribute('style')).toContain(
    'vertical-align:middle',
  )
  expect(deadlineSpan?.getAttribute('style')).toContain(
    'display:inline-block',
  )
  expect(deadlineSpan?.getAttribute('style')).toContain('height:24px')
  expect(deadlineSpan?.getAttribute('style')).toContain('padding-left:6px')
  expect(deadlineSpan?.getAttribute('style')).toContain('padding-right:6px')
  expect(deadlineSpan?.getAttribute('style')).toContain(
    'vertical-align:middle',
  )
  expect(deadlineSpan?.getAttribute('style')).toContain('line-height:24px')
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
      expectLinksAndSpansDoNotUseCssEllipsis(document)
      expectLinksDoNotRenderUnderlineStyles(document)

      if (content.highlights?.length) {
        expectImage(document, assetUrls.checkIconUrl)
        expectImagesHaveSize(document, assetUrls.checkIconUrl, '16', '16')
      }

      if (content.deadlineText) {
        expect(html).toContain(content.deadlineText)
        expectHeaderCellsUseFixedMiddleAlignment(
          document,
          content.title,
          content.deadlineText,
        )
      }

      if (expectedRecommendation) {
        expect(html).toContain(expectedRecommendation)
        expectImage(document, assetUrls.arrowIconUrl)
        expectImagesHaveSize(document, assetUrls.arrowIconUrl, '16', '16')
      }

      if (content.sections.some((section) => section.ctaIconUrl)) {
        expectImagesHaveSize(document, assetUrls.searchIconUrl, '16', '16')
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
