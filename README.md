# cross-sell-components

React component packaging project for cross-sell widgets and email templates.

## Goals

- Build interactive widgets as standalone browser scripts.
- Offer both Web Component and Mount API integration modes.
- Generate static HTML email templates.
- Keep examples close to real handoff usage.
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
    cross-sell-banner.wc.js
    cross-sell-banner.mount.js
  emails/
    cross-sell-offer.html
  manifest.json
```

## Widget Split Guidelines

Use one widget when the integration contract is the same and only visual state changes.

Examples that should stay as one widget variant:

- `cross-sell-banner` with `layout="compact"`
- `cross-sell-banner` with `layout="grid"`
- `cross-sell-banner` with `layout="carousel"`

Split into a new widget when the external contract is meaningfully different.

Examples that should be separate widgets:

- `cross-sell-banner`: a horizontal promotion block.
- `product-carousel`: a browsable product rail with next/previous controls.
- `bundle-offer`: a bundle purchase card with bundled pricing logic.

The practical rule: if consumers need a different tag name, different global API, different event names, or a different payload shape, split it into a different widget.

## Web Component Usage

```html
<cross-sell-banner
  title="推薦商品"
  locale="zh-TW"
  products='[{"id":"p1","name":"商品 A","price":1200}]'
></cross-sell-banner>

<script src="./dist/widgets/cross-sell-banner.wc.js"></script>
```

## Mount API Usage

```html
<div id="cross-sell-root"></div>

<script src="./dist/widgets/cross-sell-banner.mount.js"></script>
<script>
  CrossSellBanner.mount('#cross-sell-root', {
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
- Playwright opens `examples/*.html` after build and verifies the real `dist` artifacts.
- Storybook testing is intentionally deferred to phase two.

## Documentation

- [React Web Component 注意事項](./docs/react-web-component-considerations.md)
