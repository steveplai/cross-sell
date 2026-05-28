import '../../../../src/entries/cross-sell-widget/mount'

import { describe, expect, it } from 'vitest'

describe('widget Mount API build metadata', () => {
  it('exposes build metadata on the public global API object', () => {
    expect(window.CrossSellWidget?.version).toBe('development')
    expect(window.CrossSellWidget?.build).toEqual({
      version: 'development',
      widgetName: 'cross-sell-widget',
      commit: 'unknown',
      mode: 'mount',
      builtAt: 'unknown',
    })
    expect(window.CrossSellWidget?.mount).toBeTypeOf('function')
  })
})
