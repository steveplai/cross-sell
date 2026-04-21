# cross-sell-components

React component packaging project for embeddable demo product widgets and email templates.

## Goals

- Build interactive widgets as standalone browser scripts.
- Offer both Web Component and Mount API integration modes.
- Generate static HTML email templates.
- Keep widget examples close to real handoff usage.
- Test React components and built `dist` artifacts separately.

## Development

```bash
pnpm install
pnpm dev
pnpm build
pnpm test:all
```

## Output

```txt
dist/
  widgets/
    demo-product-banner.wc.js
    demo-product-banner.mount.js
  emails/
    demo-product-offer.html
    order-cross-sell.html
    sales-cross-sell.html
    insurance-cross-sell.html
```

## Widget Split Guidelines

Use one widget when the integration contract is the same and only visual state changes.

Examples that should stay as one widget variant:

- `demo-product-banner` with `layout="compact"`
- `demo-product-banner` with `layout="grid"`
- `demo-product-banner` with `layout="carousel"`

Split into a new widget when the external contract is meaningfully different.

Examples that should be separate widgets:

- `demo-product-banner`: a horizontal promotion block.
- `product-carousel`: a browsable product rail with next/previous controls.
- `bundle-offer`: a bundle purchase card with bundled pricing logic.

The practical rule: if consumers need a different tag name, different global API, different event names, or a different payload shape, split it into a different widget.

## Web Component Usage

Web Component dark mode is enabled by adding `class="dark"` to the custom
element host. A `.dark` class on the outer page does not cross the Shadow DOM
boundary.

```html
<demo-product-banner
  class="dark"
  title="推薦商品"
  locale="zh-TW"
  products='[{"id":"p1","name":"商品 A","price":1200}]'
></demo-product-banner>

<script src="./dist/widgets/demo-product-banner.wc.js"></script>
```

## Mount API Usage

Mount API dark mode follows the host page's Tailwind/shadcn convention. If the
mount target is inside `<html class="dark">` or another `.dark` ancestor, the
mounted widget renders in dark mode.

```html
<div id="demo-product-root"></div>

<script src="./dist/widgets/demo-product-banner.mount.js"></script>
<script>
  DemoProductBanner.mount('#demo-product-root', {
    title: '推薦商品',
    locale: 'zh-TW',
    products: [{ id: 'p1', name: '商品 A', price: 1200 }],
    onSelectProduct(product) {
      console.log(product)
    },
  })
</script>
```

## Testing Strategy

- Storybook is the playground for component states.
- Vitest + Testing Library tests React components and utilities.
- Internal tests protect project contracts and built artifact handoff flows.
- Playwright opens widget examples under `examples/web-component/` and
  `examples/mount-api/` after build and verifies the real `dist` artifacts.
- Storybook testing is intentionally deferred to phase two.

## Documentation

- [React Web Component 注意事項](./docs/react-web-component-considerations.md)
