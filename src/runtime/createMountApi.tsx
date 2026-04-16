import type { ComponentType } from 'react'
import { createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'

import { injectStyles } from './injectStyles'

export interface MountedWidget<Props extends object> {
  update(nextProps: Props): void
  unmount(): void
}

export function createMountApi<Props extends object>(
  Component: ComponentType<Props>,
  styleId: string,
  styles: string,
) {
  const roots = new WeakMap<Element, Root>()

  return function mount(
    target: string | Element,
    props: Props,
  ): MountedWidget<Props> {
    const element =
      typeof target === 'string' ? document.querySelector(target) : target

    if (!element) {
      throw new Error(`Mount target not found: ${String(target)}`)
    }

    injectStyles(document, styleId, styles)

    let root = roots.get(element)

    if (!root) {
      root = createRoot(element)
      roots.set(element, root)
    }

    root.render(createElement(Component, props))

    return {
      update(nextProps) {
        root?.render(createElement(Component, nextProps))
      },
      unmount() {
        root?.unmount()
        roots.delete(element)
      },
    }
  }
}
