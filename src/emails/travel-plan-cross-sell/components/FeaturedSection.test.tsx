import { render as renderEmail } from '@react-email/render'
import { describe, expect, it } from 'vitest'

import type { TravelPlanCrossSellSection } from '../types'
import { FeaturedSection } from './FeaturedSection'

function parseEmailHtml(html: string) {
  return new DOMParser().parseFromString(html, 'text/html')
}

describe('FeaturedSection', () => {
  it('renders without optional CTA icon and recommendations', async () => {
    const section = {
      ctaLabel: '立即查看',
      ctaUrl: 'https://example.com/featured-section',
      description: '落地第一步，先搞定交通',
      iconAlt: '交通',
      iconUrl: 'https://example.com/transportIcon.png',
      id: 'transportation',
      title: '抵達啟程',
      variant: 'featured',
    } satisfies TravelPlanCrossSellSection

    const html = await renderEmail(<FeaturedSection section={section} />)
    const document = parseEmailHtml(html)

    expect(html).toContain(section.title)
    expect(html).toContain(section.description)
    expect(
      document.querySelector(`a[href="${section.ctaUrl}"]`)?.textContent,
    ).toContain(section.ctaLabel)
    expect(
      document.querySelectorAll(`a[href="${section.ctaUrl}"]`),
    ).toHaveLength(1)
    expect(
      document.querySelector(
        'img[src="https://example.com/transportIcon.png"]',
      ),
    ).not.toBeNull()
    expect(document.querySelector('img[src$="searchIcon.png"]')).toBeNull()
    expect(html).not.toContain('推薦熱門')
  })

  it('can repeat description and CTA in the header for configured featured sections', async () => {
    const section = {
      ctaLabel: '立即查看',
      ctaUrl: 'https://example.com/featured-section',
      description: '落地第一步，先搞定交通',
      iconAlt: '交通',
      iconUrl: 'https://example.com/transportIcon.png',
      id: 'transportation',
      showHeaderDescriptionAndCta: true,
      title: '抵達啟程',
      variant: 'featured',
    } satisfies TravelPlanCrossSellSection

    const html = await renderEmail(<FeaturedSection section={section} />)
    const document = parseEmailHtml(html)

    expect(html.match(new RegExp(section.description, 'g'))).toHaveLength(2)
    expect(
      document.querySelectorAll(`a[href="${section.ctaUrl}"]`),
    ).toHaveLength(2)
  })

  it('renders each recommendation as one no-wrap link containing text and arrow', async () => {
    const section = {
      ctaLabel: '立即查看',
      ctaUrl: 'https://example.com/featured-section',
      description: '落地第一步，先搞定交通',
      iconAlt: '交通',
      iconUrl: 'https://example.com/transportIcon.png',
      id: 'transportation',
      recommendationsTitle: '推薦熱門交通：',
      recommendations: [
        {
          arrowIconUrl: 'https://example.com/arrowIcon.png',
          text: '日本-東京成田/羽田機場至東京市區/郊區 | 機場接送專車',
          url: 'https://example.com/featured-section/recommendation',
        },
      ],
      title: '抵達啟程',
      variant: 'featured',
    } satisfies TravelPlanCrossSellSection

    const html = await renderEmail(<FeaturedSection section={section} />)
    const document = parseEmailHtml(html)
    const recommendation = section.recommendations[0]
    const links = document.querySelectorAll(`a[href="${recommendation.url}"]`)
    const link = links[0]
    const textSpan = Array.from(link.querySelectorAll('span')).find((span) =>
      span.textContent?.includes(recommendation.text),
    )
    const textCell = textSpan?.closest('td')
    const arrowImage = link.querySelector(
      `img[src="${recommendation.arrowIconUrl}"]`,
    )
    const arrowCell = arrowImage?.closest('td')

    expect(links).toHaveLength(1)
    expect(link.textContent).toContain(recommendation.text)
    expect(arrowImage).not.toBeNull()
    expect(link.getAttribute('class')).toContain('whitespace-nowrap')
    expect(link.getAttribute('style')).toContain('white-space:nowrap')
    expect(link.getAttribute('style')).toContain('display:block')
    expect(textSpan?.getAttribute('class')).toContain('group-hover:underline')
    expect(textSpan?.getAttribute('class')).toContain('whitespace-nowrap')
    expect(textCell?.getAttribute('height')).toBe('24')
    expect(textCell?.getAttribute('valign')).toBe('middle')
    expect(textCell?.getAttribute('width')).toBe('100%')
    expect(textCell?.getAttribute('style')).toContain('height:24px')
    expect(textCell?.getAttribute('style')).toContain('overflow:hidden')
    expect(textCell?.getAttribute('style')).toContain('vertical-align:middle')
    expect(textCell?.getAttribute('style')).toContain('width:100%')
    expect(arrowCell?.getAttribute('height')).toBe('24')
    expect(arrowCell?.getAttribute('valign')).toBe('middle')
    expect(arrowCell?.getAttribute('width')).toBe('20')
    expect(arrowCell?.getAttribute('style')).toContain('height:24px')
    expect(arrowCell?.getAttribute('style')).toContain('vertical-align:middle')
    expect(arrowCell?.getAttribute('style')).toContain('width:20px')
  })
})
