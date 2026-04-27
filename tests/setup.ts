import '@testing-library/jest-dom/vitest'

class ResizeObserverMock implements ResizeObserver {
  disconnect() {
    return undefined
  }
  observe() {
    return undefined
  }
  unobserve() {
    return undefined
  }
}

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly scrollMargin = ''
  readonly thresholds = []

  disconnect() {
    return undefined
  }
  observe() {
    return undefined
  }
  takeRecords() {
    return []
  }
  unobserve() {
    return undefined
  }
}

globalThis.ResizeObserver ??= ResizeObserverMock
globalThis.IntersectionObserver ??= IntersectionObserverMock

globalThis.matchMedia ??= (query: string): MediaQueryList => {
  return {
    addEventListener() {
      return undefined
    },
    addListener() {
      return undefined
    },
    dispatchEvent() {
      return false
    },
    matches: false,
    media: query,
    onchange: null,
    removeEventListener() {
      return undefined
    },
    removeListener() {
      return undefined
    },
  }
}
