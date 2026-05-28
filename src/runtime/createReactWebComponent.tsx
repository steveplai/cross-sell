import type { ComponentType } from 'react'
import { createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'

import type { WidgetBuildMetadata } from './buildMetadata'
import { injectStyles } from './injectStyles'

interface CreateReactWebComponentOptions<Props extends object> {
  tagName: string
  Component: ComponentType<Props>
  build?: WidgetBuildMetadata
  observedAttributes: string[]
  observedProperties?: string[]
  styles: string
  mapElementToProps: (element: HTMLElement) => Props
}

export function createReactWebComponent<Props extends object>({
  tagName,
  Component,
  build: buildMetadata,
  observedAttributes,
  observedProperties = [],
  styles,
  mapElementToProps,
}: CreateReactWebComponentOptions<Props>) {
  const propertyValues = new WeakMap<HTMLElement, Map<string, unknown>>()

  function getPropertyValues(element: HTMLElement) {
    let values = propertyValues.get(element)

    if (!values) {
      values = new Map<string, unknown>()
      propertyValues.set(element, values)
    }

    return values
  }

  class ReactWebComponent extends HTMLElement {
    static version = buildMetadata?.version
    static build = buildMetadata

    private root?: Root
    private mountNode?: HTMLDivElement
    private shadow?: ShadowRoot

    constructor() {
      super()
      this.capturePreUpgradeProperties()
    }

    static get observedAttributes() {
      return observedAttributes
    }

    get version() {
      return buildMetadata?.version
    }

    get build() {
      return buildMetadata
    }

    connectedCallback() {
      if (buildMetadata) {
        this.setAttribute('data-cross-sell-version', buildMetadata.version)
      }

      if (!this.mountNode) {
        this.shadow = this.attachShadow({ mode: 'open' })
        injectStyles(this.shadow, tagName, styles)
        this.mountNode = document.createElement('div')
        this.shadow.appendChild(this.mountNode)
      }

      if (!this.root) {
        this.root = createRoot(this.mountNode)
      }

      this.renderReact()
    }

    attributeChangedCallback() {
      this.renderReact()
    }

    disconnectedCallback() {
      this.root?.unmount()
      this.root = undefined
    }

    renderReact() {
      if (!this.root) {
        return
      }

      this.root.render(createElement(Component, mapElementToProps(this)))
    }

    private capturePreUpgradeProperties() {
      observedProperties.forEach((property) => {
        if (!Object.prototype.hasOwnProperty.call(this, property)) {
          return
        }

        const properties = this as unknown as Record<string, unknown>
        const value = properties[property]

        delete properties[property]
        properties[property] = value
      })
    }
  }

  observedProperties.forEach((property) => {
    Object.defineProperty(ReactWebComponent.prototype, property, {
      configurable: true,
      enumerable: true,
      get(this: HTMLElement) {
        return getPropertyValues(this).get(property)
      },
      set(this: ReactWebComponent, value: unknown) {
        getPropertyValues(this).set(property, value)
        this.renderReact()
      },
    })
  })

  if (!customElements.get(tagName)) {
    customElements.define(tagName, ReactWebComponent)
  }
}
