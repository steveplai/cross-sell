import type { ComponentType } from 'react'
import { createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { injectStyles } from './injectStyles'

interface CreateReactWebComponentOptions<Props> {
  tagName: string
  Component: ComponentType<Props>
  observedAttributes: string[]
  styles: string
  mapElementToProps: (element: HTMLElement) => Props
}

export function createReactWebComponent<Props>({
  tagName,
  Component,
  observedAttributes,
  styles,
  mapElementToProps,
}: CreateReactWebComponentOptions<Props>) {
  class ReactWebComponent extends HTMLElement {
    private root?: Root
    private mountNode?: HTMLDivElement
    private shadow?: ShadowRoot

    static get observedAttributes() {
      return observedAttributes
    }

    connectedCallback() {
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

    private renderReact() {
      if (!this.root) {
        return
      }

      this.root.render(createElement(Component, mapElementToProps(this)))
    }
  }

  if (!customElements.get(tagName)) {
    customElements.define(tagName, ReactWebComponent)
  }
}
