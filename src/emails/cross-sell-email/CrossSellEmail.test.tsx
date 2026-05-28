import { render as renderEmail } from '@react-email/render'
import { describe, expect, it } from 'vitest'

import {
  createCrossSellEmailAssetUrls,
  createFlightEstablishedCrossSellEmailContent,
  createFlightInsuranceCrossSellEmailContent,
  createFlightSalesCrossSellEmailContent,
  createHotelEstablishedCrossSellEmailContent,
  createHotelSalesCrossSellEmailContent,
} from './content/index'
import { CrossSellEmail } from './CrossSellEmail'
import type { CrossSellEmailProps } from './types'

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
    if (element.getAttribute('data-testid') === 'recommendation-link-text') {
      return false
    }

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

function expectRecommendationHoverUsesEmailSafeCss(html: string) {
  expect(html).toContain(
    '.recommendation-link-text-anchor:hover .recommendation-link-text',
  )
  expect(html).not.toContain('x_recommendation-link-text-anchor')
  expect(html).toContain('text-decoration: underline !important')
  expect(html).not.toContain('group-hover_underline')
  expect(html).not.toContain(':where(.group)')
  expect(html).not.toContain('@media (hover:hover)')
}

function expectHeaderCellsUseFixedMiddleAlignment(
  document: Document,
  title: string,
  deadlineText: string,
) {
  const titleCell = Array.from(document.querySelectorAll('td')).find(
    (cell) =>
      cell.textContent?.trim() === title &&
      cell.getAttribute('height') === '30',
  )
  const deadlineTextSpans = Array.from(
    document.querySelectorAll('span'),
  ).filter((span) => span.textContent?.trim() === deadlineText)
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
  expect(deadlineSpan?.getAttribute('style')).toContain('display:inline-block')
  expect(deadlineSpan?.getAttribute('style')).toContain('height:24px')
  expect(deadlineSpan?.getAttribute('style')).toContain('padding-left:6px')
  expect(deadlineSpan?.getAttribute('style')).toContain('padding-right:6px')
  expect(deadlineSpan?.getAttribute('style')).toContain('vertical-align:middle')
  expect(deadlineSpan?.getAttribute('style')).toContain('line-height:24px')
}

function expectFeaturedTimelineRailUsesFixedCentering(document: Document) {
  const railTable = Array.from(
    document.querySelectorAll('table[width="11"]'),
  ).find((table) => table.textContent?.trim() === '▼')
  const arrowCell = railTable
    ? Array.from(
        railTable.querySelectorAll('td[width="11"][align="center"]'),
      ).find((cell) => cell.textContent?.trim() === '▼')
    : undefined
  const lineCell = railTable
    ? Array.from(railTable.querySelectorAll('td[width="1"]')).find((cell) => {
        const style = cell.getAttribute('style') ?? ''

        return (
          style.includes('background-color:rgb(34,34,34)') &&
          style.includes('height:194px') &&
          style.includes('width:1px')
        )
      })
    : undefined

  expect(railTable).toBeDefined()
  expect(railTable?.getAttribute('width')).toBe('11')
  expect(railTable?.getAttribute('style')).toContain('width:11px')
  expect(lineCell?.getAttribute('width')).toBe('1')
  expect(arrowCell?.getAttribute('width')).toBe('11')
  expect(arrowCell?.getAttribute('align')).toBe('center')
  expect(arrowCell?.getAttribute('style')).toContain('width:11px')
  expect(arrowCell?.getAttribute('style')).toContain('text-align:center')
}

describe('CrossSellEmail', () => {
  it.each([
    {
      name: 'flight established',
      createContent: createFlightEstablishedCrossSellEmailContent,
      expectedCtaLabel: '立即預訂交通票券',
      expectedCtaUrl:
        'https://activity.liontravel.com/search?Foreign=1&SearchKindName=%E4%BA%A4%E9%80%9A%E7%A5%A8%E5%88%B8&utm_source=orderconfirmation&utm_medium=email&utm_campaign=activity-traffic-more-addon&utm_content=flight',
      expectedRecommendation:
        '日本-東京成田/羽田機場至東京市區/郊區 | 機場接送專車',
    },
    {
      name: 'sales',
      createContent: createFlightSalesCrossSellEmailContent,
      expectedCtaLabel: '立即搜尋飯店',
      expectedCtaUrl:
        'https://hotel.liontravel.com/search?searchParam=&utm_source=crosssell&utm_medium=email&utm_campaign=hotel-more-addon&utm_content=flight',
      expectedRecommendation: 'OMO5 東京大塚 by 星野集團',
    },
    {
      name: 'insurance',
      createContent: createFlightInsuranceCrossSellEmailContent,
      expectedCtaLabel: '申請簽證代辦',
      expectedCtaUrl:
        'https://visa.liontravel.com/search?Countrylicensing=TW&utm_source=insurance&utm_medium=email&utm_campaign=visa-addon&utm_content=flight',
    },
  ] satisfies Array<{
    name: string
    createContent: (
      assetUrls: ReturnType<typeof createCrossSellEmailAssetUrls>,
    ) => CrossSellEmailProps
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
      const assetUrls = createCrossSellEmailAssetUrls('production')
      const content = createContent(assetUrls)
      const html = await renderEmail(<CrossSellEmail {...content} />)
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
      expectRecommendationHoverUsesEmailSafeCss(html)

      if (content.sections.some((section) => section.variant === 'featured')) {
        expectFeaturedTimelineRailUsesFixedCentering(document)
      }

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
    const assetUrls = createCrossSellEmailAssetUrls('production')
    const flightEstablishedContent =
      createFlightEstablishedCrossSellEmailContent(assetUrls)
    const flightSalesContent = createFlightSalesCrossSellEmailContent(assetUrls)
    const flightInsuranceContent =
      createFlightInsuranceCrossSellEmailContent(assetUrls)

    expect(
      flightEstablishedContent.sections.find(
        (section) => section.variant === 'featured',
      )?.showHeaderDescriptionAndCta,
    ).toBeUndefined()
    expect(
      flightSalesContent.sections.find(
        (section) => section.variant === 'featured',
      )?.showHeaderDescriptionAndCta,
    ).toBe(true)
    expect(
      flightInsuranceContent.sections.filter(
        (section) => section.showHeaderDescriptionAndCta,
      ),
    ).toHaveLength(0)
  })

  it('renders the hotel established product plan', async () => {
    const assetUrls = createCrossSellEmailAssetUrls('production')
    const content = createHotelEstablishedCrossSellEmailContent(assetUrls)
    const html = await renderEmail(<CrossSellEmail {...content} />)
    const document = parseEmailHtml(html)

    expect(content.sections.map((section) => section.id)).toEqual([
      'transportation',
      'local-experience',
      'rail',
    ])
    expect(content.highlights?.map((highlight) => highlight.id)).toEqual([
      'hotel-discount',
      'rail-discount',
    ])
    expect(html).toContain('抵達啟程')
    expect(html).toContain('在地探索')
    expect(html).toContain('高鐵加購')
    expect(html).toContain('抵達後先搞定交通，行程更順暢')
    expect(html).toContain('推薦熱門交通：')
    expect(html).toContain(
      '日本-東京成田/羽田機場至東京市區/郊區 | 機場接送專車',
    )
    expect(html).not.toContain('飯店下榻')
    expect(html).not.toContain('簽證護照')
    expect(html).not.toContain('航班異動可免費取消住宿')
    expectLink(
      document,
      '立即預訂交通票券',
      'https://activity.liontravel.com/search?Foreign=1&SearchKindName=%E4%BA%A4%E9%80%9A%E7%A5%A8%E5%88%B8&utm_source=orderconfirmation&utm_medium=email&utm_campaign=activity-traffic-more-addon&utm_content=hotel',
    )
    expectImage(document, assetUrls.transportIconUrl)
    expectImage(document, assetUrls.arrowIconUrl)
    expectFeaturedTimelineRailUsesFixedCentering(document)
  })

  it('renders the hotel sales product plan', async () => {
    const assetUrls = createCrossSellEmailAssetUrls('production')
    const content = createHotelSalesCrossSellEmailContent(assetUrls)
    const html = await renderEmail(<CrossSellEmail {...content} />)
    const document = parseEmailHtml(html)

    expect(content.sections.map((section) => section.id)).toEqual([
      'transportation',
      'local-experience',
      'rail',
    ])
    expect(content.highlights?.map((highlight) => highlight.id)).toEqual([
      'hotel-discount',
      'rail-discount',
    ])
    expect(html).toContain('抵達啟程')
    expect(html).toContain('在地探索')
    expect(html).toContain('高鐵加購')
    expect(html).toContain('抵達後先搞定交通，行程更順暢')
    expect(html).toContain('推薦熱門交通：')
    expect(html).toContain(
      '日本-東京成田/羽田機場至東京市區/郊區 | 機場接送專車',
    )
    expect(html).not.toContain('飯店下榻')
    expect(html).not.toContain('簽證護照')
    expect(html).not.toContain('航班異動可免費取消住宿')
    expectLink(
      document,
      '立即預訂交通票券',
      'https://activity.liontravel.com/search?Foreign=1&SearchKindName=%E4%BA%A4%E9%80%9A%E7%A5%A8%E5%88%B8&utm_source=crosssell&utm_medium=email&utm_campaign=activity-traffic-more-addon&utm_content=hotel',
    )
    expectImage(document, assetUrls.transportIconUrl)
    expectImage(document, assetUrls.arrowIconUrl)
    expectFeaturedTimelineRailUsesFixedCentering(document)
  })
})
