import { Tailwind } from '@react-email/components'
import { render as renderEmail } from '@react-email/render'
import { describe, expect, it } from 'vitest'

import { crossSellEmailTailwindConfig } from '../tailwind-config'
import { CtaButton } from './CtaButton'

function parseEmailHtml(html: string) {
  return new DOMParser().parseFromString(html, 'text/html')
}

describe('CtaButton', () => {
  async function renderCtaButton({
    iconUrl,
    label,
    variant = 'regular',
  }: {
    iconUrl?: string
    label: string
    variant?: 'compact' | 'regular'
  }) {
    const href = 'https://example.com/search'
    const html = await renderEmail(
      <Tailwind config={crossSellEmailTailwindConfig}>
        <CtaButton
          href={href}
          iconUrl={iconUrl}
          label={label}
          tone="red"
          variant={variant}
        />
      </Tailwind>,
    )

    return {
      document: parseEmailHtml(html),
      href,
      iconUrl,
    }
  }

  it('renders short regular icon buttons with the Figma CTA dimensions', async () => {
    const iconUrl = 'https://example.com/searchIcon.png'
    const { document, href } = await renderCtaButton({
      iconUrl,
      label: '立即搜尋飯店',
    })
    const image = document.querySelector(`img[src="${iconUrl}"]`)
    const iconCell = image?.closest('td')
    const link = document.querySelector(`a[href="${href}"]`)
    const buttonCell = link?.closest('td[width="137"]')
    const spacerCell = Array.from(
      document.querySelectorAll('td[width="5"]'),
    ).find((cell) => cell.getAttribute('height') === '34')

    expect(buttonCell?.getAttribute('height')).toBe('34')
    expect(buttonCell?.getAttribute('width')).toBe('137')
    expect(buttonCell?.getAttribute('style')).toContain('height:34px')
    expect(buttonCell?.getAttribute('style')).toContain('width:137px')
    expect(iconCell?.getAttribute('height')).toBe('34')
    expect(iconCell?.getAttribute('width')).toBe('16')
    expect(image?.getAttribute('height')).toBe('16')
    expect(image?.getAttribute('width')).toBe('16')
    expect(spacerCell).toBeDefined()
    expect(link?.getAttribute('style')).toContain('font-size:16px')
    expect(link?.getAttribute('style')).toContain('line-height:24px')
    expect(link?.getAttribute('style')).toContain('white-space:nowrap')
  })

  it('renders long regular icon buttons with the Figma CTA dimensions', async () => {
    const iconUrl = 'https://example.com/searchIcon.png'
    const { document, href } = await renderCtaButton({
      iconUrl,
      label: '立即預訂交通票券',
    })
    const link = document.querySelector(`a[href="${href}"]`)
    const buttonCell = link?.closest('td[width="169"]')

    expect(buttonCell?.getAttribute('height')).toBe('34')
    expect(buttonCell?.getAttribute('width')).toBe('169')
    expect(buttonCell?.getAttribute('style')).toContain('height:34px')
    expect(buttonCell?.getAttribute('style')).toContain('width:169px')
    expect(link?.getAttribute('style')).toContain('line-height:24px')
  })

  it('keeps compact text-only buttons at the expected width', async () => {
    const { document, href } = await renderCtaButton({
      label: '搜尋附近飯店',
      variant: 'compact',
    })
    const link = document.querySelector(`a[href="${href}"]`)
    const buttonCell = link?.closest('td[width="104"]')

    expect(buttonCell?.getAttribute('height')).toBe('34')
    expect(buttonCell?.getAttribute('width')).toBe('104')
    expect(buttonCell?.getAttribute('style')).toContain('height:34px')
    expect(buttonCell?.getAttribute('style')).toContain('width:104px')
    expect(link?.getAttribute('style')).toContain('line-height:34px')
    expect(link?.getAttribute('style')).toContain('width:104px')
  })
})
