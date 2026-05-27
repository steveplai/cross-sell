# cross-sell-components

React + TypeScript component packaging project for cross-sell widgets and
static email templates.

This repository is maintained as an engineering handoff package:

```txt
develop React widget/email components
-> build and inspect deliverables
-> hand off dist files with examples/docs
```

It is not an admin platform or a hosted application. The main deliverables are
browser-ready widget scripts and rendered email HTML files.

## Outputs

```txt
dist/
  widgets/
    demo-product-banner/
      wc.js
      mount.js
    themed-demo-product-banner/
      wc.js
      mount.js
    cross-sell-widget/
      wc.js
      mount.js
    cross-sell-widget-connected/
      wc.js
      mount.js
  emails/
    demo-product-offer/
      index.html
    travel-plan-cross-sell/
      flight/
        established.html
        sales.html
        insurance.html
      hotel/
        established.html
```

`dist/` is generated output and should not be committed.

## Stack

- React + TypeScript
- Vite library builds for widget scripts
- Tailwind CSS + shadcn/ui tokens for widget styling
- Web Components + Shadow DOM for cross-framework embedding
- Mount API for JavaScript-driven embedding
- TanStack Query for connected widget server state
- React Email for static email HTML generation
- Storybook for component and email previews
- Vitest + Testing Library for unit and contract tests
- Playwright for built-artifact handoff tests
- pnpm for package management

## Project Layout

```txt
src/widgets/    Pure React widget components
src/components/ Shared React UI primitives
src/domains/    Domain adapters and response mappers for connected widgets
src/runtime/    Shared Web Component and Mount API runtime helpers
src/entries/    Public widget entrypoints and external contracts
src/emails/     React Email templates, components, and content data
src/lib/        Shared React/Tailwind utility helpers
src/styles/     Shared widget CSS and design tokens
examples/       Plain HTML examples that load built dist files
stories/        Storybook playground stories
tests/          Internal contract and handoff tests
scripts/        Build and static server scripts
```

Widget components should stay framework-local and avoid knowing about Web
Components, globals, or `dist/` output. Public integration behavior belongs in
`src/entries/`, with shared mechanics in `src/runtime/`.

## Development

Install dependencies:

```bash
pnpm install
```

Run Storybook:

```bash
pnpm dev
```

Build all deliverables:

```bash
pnpm build
```

Serve examples and built files through the static server:

```bash
pnpm serve:examples
```

Useful focused commands:

```bash
pnpm build:widgets
pnpm build:emails
pnpm build:emails:uat
pnpm build:emails:production
pnpm build:storybook
pnpm typecheck
pnpm lint
pnpm test:app:unit
pnpm test:internal
pnpm test:internal:handoff
pnpm test:coverage
pnpm test:all
```

`build:emails` defaults to UAT asset domains. Use `build:emails:production` or
`EMAIL_DOMAIN_MODE=production pnpm build:emails` for production asset URLs.

## Widgets

### `demo-product-banner`

Base demo product recommendation widget.

Public contract:

- Web Component tag: `demo-product-banner`
- Mount API global: `window.DemoProductBanner`
- Attributes: `title`, `locale`, `layout`, `products`
- Layout values: `compact`, `grid`, `carousel`
- Event: `demo-product:product-select`
- Event detail shape: `{ product }`

Product shape:

```ts
interface Product {
  id: string
  name: string
  price: number
  imageUrl?: string
}
```

### `themed-demo-product-banner`

Same external behavior as `demo-product-banner`, with widget-specific CSS token
overrides for primary color, ring color, and radius.

Public contract:

- Web Component tag: `themed-demo-product-banner`
- Mount API global: `window.ThemedDemoProductBanner`
- Attributes: `title`, `locale`, `layout`, `products`
- Layout values: `compact`, `grid`, `carousel`
- Event: `demo-product:product-select`
- Event detail shape: `{ product }`

### `cross-sell-widget`

Renamed base cross-sell widget intended for section-driven cross-sell rendering
across product contexts.

Public contract:

- Web Component tag: `cross-sell-widget`
- Mount API global: `window.CrossSellWidget`
- Attribute/property: `data`
- Events:
  - `cross-sell-widget:item-select`, detail `{ sectionId, item }`
  - `cross-sell-widget:view-more`, detail `{ sectionId }`
  - `cross-sell-widget:addon-select`, detail `{ addonId }`

The `data.promo.startsAt` ISO timestamp and `data.promo.durationSeconds`
determine whether the widget renders the active discount state or the expired
travel-inspiration state.

### `cross-sell-widget-connected`

API-loading version of `cross-sell-widget`. It accepts an `orderNumber`, loads
AP-56 section data, passes those sections to the base widget, and uses the base
widget's static default content for promo, add-ons, and reminders.

Public contract:

- Web Component tag: `cross-sell-widget-connected`
- Mount API global: `window.CrossSellWidgetConnected`
- Attributes: `order-number`, `order-destination`, `recommend-product-types`,
  `source-product`, `visible-blocks`, `environment`, `error-mode`, `locale`,
  `currency`, `promo-starts-at`, `promo-duration-seconds`,
  `travel-insurance-contact-email`, `config`
- `environment` values: `uat`, `production`
- `error-mode` values: `hidden`, `message`
- `recommend-product-types` default: `htl,etk`
- `source-product` values: `flight`, `hotel`, `ticket`
- `source-product` presets:
  - `flight`: shows all blocks
  - `hotel`: hides hotel recommendations and reminders
  - `ticket`: hides hotel recommendations, HSR add-on, and reminders
- `visible-blocks` JSON attribute/property can override block visibility with
  boolean values for `promoHeader`, `hotel`, `hsr`, `attraction`, `transport`,
  `flight`, `other`, and `reminders`
- `config` JSON/property supports static content overrides such as `promo`,
  `reminders`, `hsrAddon`, `sectionContentOverrides`, `orderDestination`,
  `locale`, and `currency`
- `config` does not control block visibility. Use `source-product` and
  `visible-blocks` for visibility rules.
- `promo-starts-at` / `promo-duration-seconds` override
  `config.promo.startsAt` / `config.promo.durationSeconds`
- Events:
  - `cross-sell-widget:item-select`, detail `{ sectionId, item }`
  - `cross-sell-widget:view-more`, detail `{ sectionId }`
  - `cross-sell-widget:addon-select`, detail `{ addonId }`

Default API origins:

- `production`: `https://www.liontravel.com`
- `uat`: `https://uwww.liontravel.com`

The current endpoint path is centralized in the AP-56 cross-sell domain adapter as
`/category/_fringe/CrossSelling?OrderNo={orderNumber}&RecommendProductType={recommendProductTypes}`.
The connected widget does not accept full static `data`; use
`cross-sell-widget` when sections and order data are already available.

## Web Component Usage

```html
<demo-product-banner
  title="推薦商品"
  locale="zh-TW"
  layout="grid"
  products='[
    {"id":"p1","name":"商品 A","price":1200},
    {"id":"p2","name":"商品 B","price":900}
  ]'
></demo-product-banner>

<script src="./dist/widgets/demo-product-banner/wc.js"></script>
<script>
  const widget = document.querySelector('demo-product-banner')

  widget.addEventListener('demo-product:product-select', (event) => {
    console.log(event.detail.product)
  })
</script>
```

Web Component data passed through HTML attributes is string-based. Complex props
such as `products` are parsed from JSON by the entrypoint.

Dark mode is enabled by adding `class="dark"` to the custom element host:

```html
<demo-product-banner class="dark"></demo-product-banner>
```

A `.dark` class on the outer page does not automatically cross the Shadow DOM
boundary.

## Mount API Usage

```html
<div id="demo-product-root"></div>

<script src="./dist/widgets/demo-product-banner/mount.js"></script>
<script>
  const widget = DemoProductBanner.mount('#demo-product-root', {
    title: '推薦商品',
    locale: 'zh-TW',
    layout: 'grid',
    products: [
      { id: 'p1', name: '商品 A', price: 1200 },
      { id: 'p2', name: '商品 B', price: 900 },
    ],
    onSelectProduct(product) {
      console.log(product)
    },
  })

  widget.update({
    title: '更新後商品',
    locale: 'zh-TW',
    layout: 'compact',
    products: [{ id: 'p3', name: '商品 C', price: 1500 }],
  })

  widget.unmount()
</script>
```

Mount API scripts inject widget CSS into the document and render into the target
element. Dark mode follows the host page convention: if the mount target is
inside a `.dark` ancestor, the widget renders with dark tokens.

## Styling and Theming

Shared widget styles live in:

```txt
src/styles/widget.css
```

Shared React UI primitives live in:

```txt
src/components/ui/
```

These are project-owned shadcn/ui-style primitives, not an external black box.
It is acceptable to edit them when changing the baseline behavior or visual
language of the project design system.

Use `src/components/ui` for low-level primitives such as buttons, cards, badges,
and skeleton states. Build widget-specific or domain-specific components above
that layer when the component has product meaning, fixed layout, tracking, event
behavior, or a public integration contract.

Do not expose shadcn/ui implementation details as widget public API. External
widget contracts should use product-oriented props and attributes such as
`layout`, `title`, `products`, `locale`, and events such as
`demo-product:product-select`. Keep internal primitive details such as
`Button` variants, `Card` class names, and Tailwind utility choices inside the
React implementation.

The Web Component host uses:

```css
:host {
  display: block;
  font-family: inherit;
}
```

This keeps widget styles isolated while allowing the widget to inherit the host
page font.

Theme values are defined as widget-local CSS variables. The themed widget adds
its own overrides in:

```txt
src/widgets/themed-demo-product-banner/style.css
```

Prefer CSS variables for supported theming instead of asking host pages to
override internal generated classes.

## Emails

Email templates are React Email components under `src/emails/`.

Current generated email files:

- `demo-product-offer/index.html`
- `travel-plan-cross-sell/flight/established.html`
- `travel-plan-cross-sell/flight/sales.html`
- `travel-plan-cross-sell/flight/insurance.html`
- `travel-plan-cross-sell/hotel/established.html`

For travel plan cross-sell emails, use the full `.html` file for preview and
handoff review.

`pnpm build:emails` clears `dist/emails` before writing the current email
outputs, so the directory should only contain files generated by the latest
email build.

Travel plan cross-sell emails support two asset domain modes:

- `uat`: `https://uwww.liontravel.com`
- `production`: `https://www.liontravel.com`

Build examples:

```bash
pnpm build:emails
pnpm build:emails:uat
pnpm build:emails:production
EMAIL_DOMAIN_MODE=production pnpm build:emails
```

Storybook contains full email previews and smaller component previews under
`Emails/Travel Plan Cross Sell`.

## Examples

Built widget handoff examples live in:

```txt
examples/
  <widget>/
    wc/
    mount/
```

These examples intentionally load `dist/widgets/<widget>/{wc,mount}.js` directly. Internal
Playwright handoff tests serve them with `scripts/serve-static.mjs` so the files
behave like real handoff artifacts, without Vite dev-server transforms.

## Testing Strategy

- Storybook is the playground for widget and email states.
- Vitest + Testing Library cover source React components and small contracts.
- Internal Vitest tests protect project-level runtime contracts.
- Playwright opens built examples and verifies real `dist` artifacts.
- Storybook executable tests are intentionally deferred.

Test folders under `tests/` are organized by runner first, then responsibility:

```txt
tests/vitest/internal/contracts/
tests/playwright/app/widgets/
tests/playwright/internal/handoff/
```

Source-level Vitest app tests stay near the code they cover as `src/**/*.test.*`.

Do not add tests to every `src/components/ui` primitive mechanically. Add focused
tests when a primitive contains project-owned behavior, custom variants,
accessibility logic, controlled state, callback behavior, or other non-trivial
decisions. Prefer testing product behavior through widgets, emails, entries, and
runtime contracts when the primitive is only a styling building block.

Coverage reports should keep `src/components/ui` visible so custom primitive
usage and gaps are easy to spot. Avoid using coverage thresholds to force
low-value tests for unchanged shadcn-style primitives. If untouched generated or
vendor-like primitives start distorting coverage, prefer a precise exclude rule
over excluding all shared UI components.

## Widget Split Guidelines

Use one widget when the external integration contract is the same and only
visual state changes.

Keep these as variants of one widget:

- `demo-product-banner` with `layout="compact"`
- `demo-product-banner` with `layout="grid"`
- `demo-product-banner` with `layout="carousel"`

Split into a new widget when consumers need a different public contract.

Make these separate widgets:

- `demo-product-banner`: horizontal promotion/recommendation block
- `product-carousel`: browsable product rail with carousel controls
- `bundle-offer`: bundle purchase card with bundled pricing behavior

Practical rule: if consumers need a different tag name, global API, event name,
or payload shape, make it a separate widget.

## Additional Docs

- [React Web Component 注意事項](./docs/react-web-component-considerations.md)
