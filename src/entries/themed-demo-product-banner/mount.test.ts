import './mount'

import { describe, expect, it } from 'vitest'

describe('themed demo product banner Mount API 建置資訊', () => {
  it('會在公開全域 API 物件上暴露建置資訊', () => {
    expect(window.ThemedDemoProductBanner?.version).toBe('development')
    expect(window.ThemedDemoProductBanner?.build).toEqual({
      version: 'development',
      widgetName: 'themed-demo-product-banner',
      commit: 'unknown',
      mode: 'mount',
      builtAt: 'unknown',
    })
    expect(window.ThemedDemoProductBanner?.mount).toBeTypeOf('function')
  })
})
