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
      document.querySelector(
        'img[src="https://example.com/transportIcon.png"]',
      ),
    ).not.toBeNull()
    expect(document.querySelector('img[src$="searchIcon.png"]')).toBeNull()
    expect(html).not.toContain('推薦熱門')
  })
})
