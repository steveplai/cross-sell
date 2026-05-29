# cross-sell-components

這是用於交叉銷售 widgets 與靜態 email templates 的 React + TypeScript 元件打包專案。

此 repository 以工程交付套件的形式維護：

```txt
開發 React widget/email 元件
-> 建置並檢查交付檔案
-> 連同範例與文件交付 dist 檔案
```

它不是後台平台，也不是託管應用程式。主要交付項目是可直接在瀏覽器使用的
widget scripts，以及已渲染的 email HTML 檔案。

## 輸出內容

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
    cross-sell-email/
      flight/
        established.html
        sales.html
        insurance.html
      hotel/
        established.html
        sales.html
```

`dist/` 是產生出的輸出內容，不應 commit。

## 技術堆疊

- React + TypeScript
- Vite library builds，用於 widget scripts
- Tailwind CSS + shadcn/ui tokens，用於 widget 樣式
- Web Components + Shadow DOM，用於跨 framework 嵌入
- Mount API，用於 JavaScript 驅動的嵌入
- TanStack Query，用於 connected widget 的 server state
- React Email，用於產生靜態 email HTML
- Storybook，用於 component 與 email previews
- Vitest + Testing Library，用於 unit 與 contract tests
- Playwright，用於 built-artifact handoff tests
- pnpm，用於 package 管理

## 專案結構

```txt
src/widgets/    純 React widget 元件
src/components/ 共用 React UI primitives
src/domains/    connected widgets 的 domain adapters 與 response mappers
src/runtime/    共用 Web Component 與 Mount API runtime helpers
src/entries/    公開 widget entrypoints 與 external contracts
src/emails/     React Email templates、components 與 content data
src/lib/        共用 React/Tailwind utility helpers
src/styles/     共用 widget CSS 與 design tokens
examples/       載入 built dist 檔案的 plain HTML 範例
stories/        Storybook playground stories
tests/          Playwright app tests 與 project-level internal tests
scripts/        Build 與 static server scripts
```

Widget components 應維持在 framework-local 層級，不應知道 Web Components、
globals 或 `dist/` 輸出。公開整合行為屬於 `src/entries/`，共用機制則放在
`src/runtime/`。

## 開發

安裝相依套件：

```bash
pnpm install
```

執行 Storybook：

```bash
pnpm dev
```

建置所有交付檔案：

```bash
pnpm build
```

透過 static server 提供 examples 與 built 檔案：

```bash
pnpm serve:examples
```

常用的聚焦指令：

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

`build:emails` 預設使用 UAT asset domains。若要產生 production asset URLs，請使用
`build:emails:production` 或 `EMAIL_DOMAIN_MODE=production pnpm build:emails`。

## Widgets

### `demo-product-banner`

基礎 demo 商品推薦 widget。

公開契約：

- Web Component tag: `demo-product-banner`
- Mount API global: `window.DemoProductBanner`
- Attributes: `title`, `locale`, `layout`, `products`
- Layout values: `compact`, `grid`, `carousel`
- Event: `demo-product:product-select`
- Event detail shape: `{ product }`

Product 結構：

```ts
interface Product {
  id: string
  name: string
  price: number
  imageUrl?: string
}
```

### `themed-demo-product-banner`

外部行為與 `demo-product-banner` 相同，但提供 widget-specific CSS token
overrides，用於 primary color、ring color 與 radius。

公開契約：

- Web Component tag: `themed-demo-product-banner`
- Mount API global: `window.ThemedDemoProductBanner`
- Attributes: `title`, `locale`, `layout`, `products`
- Layout values: `compact`, `grid`, `carousel`
- Event: `demo-product:product-select`
- Event detail shape: `{ product }`

### `cross-sell-widget`

重新命名後的基礎 cross-sell widget，用於跨產品情境，以 section-driven 方式渲染
cross-sell 內容。

公開契約：

- Web Component tag: `cross-sell-widget`
- Mount API global: `window.CrossSellWidget`
- Attribute/property: `data`
- Events:
  - `cross-sell-widget:item-select`, detail `{ sectionId, item }`
  - `cross-sell-widget:view-more`, detail `{ sectionId }`
  - `cross-sell-widget:addon-select`, detail `{ addonId }`

`data.promo.startsAt` ISO timestamp 與 `data.promo.durationSeconds` 會決定
widget 要渲染有效中的折扣狀態，或已過期的旅遊靈感狀態。

### `cross-sell-widget-connected`

`cross-sell-widget` 的 API-loading 版本。它接受 `orderNumber`、載入 AP-56
section data、將 sections 傳給基礎 widget，並使用基礎 widget 的 static default
content 作為 promo、add-ons 與 reminders。

公開契約：

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
  - `flight`: 顯示所有 blocks
  - `hotel`: 隱藏 hotel recommendations 與 reminders
  - `ticket`: 隱藏 hotel recommendations、HSR add-on 與 reminders
- `visible-blocks` JSON attribute/property 可透過 boolean values 覆寫 block
  visibility，適用於 `promoHeader`、`hotel`、`hsr`、`attraction`、`transport`、
  `flight`、`other` 與 `reminders`
- `config` JSON/property 支援 static content overrides，例如 `promo`、
  `reminders`、`hsrAddon`、`sectionContentOverrides`、`orderDestination`、
  `locale` 與 `currency`
- `config` 不控制 block visibility。Visibility rules 請使用 `source-product` 與
  `visible-blocks`。
- `promo-starts-at` / `promo-duration-seconds` 會覆寫
  `config.promo.startsAt` / `config.promo.durationSeconds`
- Events:
  - `cross-sell-widget:item-select`, detail `{ sectionId, item }`
  - `cross-sell-widget:view-more`, detail `{ sectionId }`
  - `cross-sell-widget:addon-select`, detail `{ addonId }`

預設 API origins：

- `production`: `https://www.liontravel.com`
- `uat`: `https://uwww.liontravel.com`

目前 endpoint path 集中定義在 AP-56 cross-sell domain adapter：
`/category/_fringe/CrossSelling?OrderNo={orderNumber}&RecommendProductType={recommendProductTypes}`.
Connected widget 不接受完整 static `data`；當 sections 與 order data 已經可用時，
請使用 `cross-sell-widget`。

## Web Component 使用方式

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

透過 HTML attributes 傳入的 Web Component data 皆為 string-based。像 `products`
這類 complex props 會由 entrypoint 從 JSON 解析。

Web Component builds 會在 custom element constructor 與每個 element instance 上暴露
runtime metadata：

```js
customElements.get('demo-product-banner').build
document.querySelector('demo-product-banner').build
document.querySelector('demo-product-banner').version
```

每個 connected element 也會收到 `data-cross-sell-version` attribute，方便檢查 DOM。

將 `class="dark"` 加到 custom element host 即可啟用 dark mode：

```html
<demo-product-banner class="dark"></demo-product-banner>
```

外層頁面的 `.dark` class 不會自動跨過 Shadow DOM boundary。

## Mount API 使用方式

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

Mount API scripts 會把 widget CSS 注入 document，並渲染到目標 element。Dark mode
遵循 host page 慣例：若 mount target 位於 `.dark` ancestor 內，widget 會以 dark
tokens 渲染。

Mount API builds 會在公開 global API object 上暴露相同 metadata：

```js
DemoProductBanner.version
DemoProductBanner.build
```

`build` 包含 `version`、`widgetName`、`commit`、`mode` 與 `builtAt`。

## 樣式與主題

共用 widget styles 位於：

```txt
src/styles/widget.css
```

共用 React UI primitives 位於：

```txt
src/components/ui/
```

這些是 project-owned shadcn/ui-style primitives，不是外部 black box。當需要修改
project design system 的 baseline behavior 或 visual language 時，可以編輯它們。

`src/components/ui` 用於 buttons、cards、badges、skeleton states 等 low-level
primitives。當 component 具有產品語意、固定 layout、tracking、event behavior 或公開
integration contract 時，應在這層之上建立 widget-specific 或 domain-specific
components。

不要把 shadcn/ui implementation details 暴露成 widget public API。外部 widget
contracts 應使用 product-oriented props 與 attributes，例如 `layout`、`title`、
`products`、`locale`，以及 `demo-product:product-select` 這類 events。`Button`
variants、`Card` class names 與 Tailwind utility choices 等 internal primitive
details 應留在 React implementation 內。

Web Component host 使用：

```css
:host {
  display: block;
  font-family: inherit;
}
```

這會隔離 widget styles，同時讓 widget 繼承 host page font。

Theme values 以 widget-local CSS variables 定義。Themed widget 會在以下檔案加入自己的
overrides：

```txt
src/widgets/themed-demo-product-banner/style.css
```

支援 theming 時，優先使用 CSS variables，不要要求 host pages 覆寫內部產生的 classes。

## Emails

Email templates 是位於 `src/emails/` 的 React Email components。

目前產生的 email 檔案：

- `demo-product-offer/index.html`
- `cross-sell-email/flight/established.html`
- `cross-sell-email/flight/sales.html`
- `cross-sell-email/flight/insurance.html`
- `cross-sell-email/hotel/established.html`
- `cross-sell-email/hotel/sales.html`

Cross-sell emails 請使用完整 `.html` 檔案進行 preview 與 handoff review。

`pnpm build:emails` 會在寫入目前 email outputs 前清除 `dist/emails`，因此該目錄應只
包含最新 email build 產生的檔案。

Cross-sell emails 支援兩種 asset domain modes：

- `uat`: `https://uwww.liontravel.com`
- `production`: `https://www.liontravel.com`

建置範例：

```bash
pnpm build:emails
pnpm build:emails:uat
pnpm build:emails:production
EMAIL_DOMAIN_MODE=production pnpm build:emails
```

寄送 preview 範例：

```bash
pnpm send:email:preview --source=dist --template=flight-insurance
pnpm send:email:preview --source=react --template=flight-insurance
```

手動 full-email diagnostics 可使用 `manual-emails/` 下複製進來的 HTML 檔案。這些檔案
不是由 `pnpm build:emails` 產生。

```bash
pnpm send:email:preview --source=file --template=full-flight-insurance
```

Storybook 在 `Emails/Travel Plan Cross Sell` 下提供 full email previews 與較小的
component previews。

## 範例

Built widget handoff 範例位於：

```txt
examples/
  <widget>/
    wc/
    mount/
```

這些 examples 會刻意直接載入 `dist/widgets/<widget>/{wc,mount}.js`。Internal
Playwright handoff tests 會透過 `scripts/dev/serve-static.mjs` 提供它們，讓檔案
行為接近真實 handoff artifacts，且不經過 Vite dev-server transforms。

## 測試策略

- Storybook 是 widget 與 email states 的 playground。
- Vitest + Testing Library 覆蓋 source React components、email templates、entry
  contracts 與小型 project-level contracts。
- Internal Vitest tests 保護 project-level runtime 與 tooling contracts；這些 tests
  不應因為新增 widget 或 email template 就持續增加。
- Playwright 會開啟 built examples 並驗證真實 `dist` artifacts。App Playwright
  tests 覆蓋 browser-specific widget behavior；internal Playwright tests 覆蓋
  project-level handoff mechanics。
- Storybook executable tests 目前刻意延後。

`tests/` 下的 test folders 先依 runner，再依責任範圍組織：

```txt
tests/vitest/internal/contracts/
tests/playwright/app/widgets/
tests/playwright/internal/handoff/
```

Source-level Vitest app tests 以 `src/**/*.test.*` 的形式靠近被覆蓋的程式碼。
Widget-specific Web Component 與 Mount API entry contracts 屬於 app tests，即使它們
覆蓋 tag names、global names、observed attributes、DOM properties、config
priority 與 custom events 等 public integration details。除非需要 built artifact 與
真實 browser，否則優先放在 `src/entries/` 附近。

Internal tests 保留給 shared project mechanics 與 tooling contracts：runtime helpers、
build/preview helpers、metadata helpers，以及適用於所有 examples 的 handoff workflow
rules。它們不應為每個新增 widget 或 email template 都新增 test case。
Internal handoff tests 使用代表性的 artifact smoke checks；完整 example rendering、
entry behavior、events、theme tokens 與 config priority 應放在 app Playwright tests。

不要機械式地替每個 `src/components/ui` primitive 加 tests。當 primitive 包含
project-owned behavior、custom variants、accessibility logic、controlled state、
callback behavior 或其他非平凡決策時，再加入聚焦的 tests。若 primitive 只是 styling
building block，優先透過 widgets、emails、entries 與 runtime contracts 測試產品行為。

Coverage reports 應保留 `src/components/ui`，讓 custom primitive usage 與 gaps 容易被
發現。避免用 coverage thresholds 強迫為未修改的 shadcn-style primitives 撰寫低價值
tests。若未碰過的 generated 或 vendor-like primitives 開始扭曲 coverage，優先使用精準
exclude rule，而不是排除所有 shared UI components。

## Widget 拆分準則

當 external integration contract 相同、只有 visual state 不同時，使用同一個 widget。

以下情境應維持為同一個 widget 的 variants：

- `demo-product-banner` 搭配 `layout="compact"`
- `demo-product-banner` 搭配 `layout="grid"`
- `demo-product-banner` 搭配 `layout="carousel"`

當 consumers 需要不同 public contract 時，拆成新的 widget。

以下情境應拆成獨立 widgets：

- `demo-product-banner`: 橫向促銷/推薦區塊
- `product-carousel`: 可瀏覽的商品 rail，含 carousel controls
- `bundle-offer`: bundle purchase card，含 bundled pricing behavior

實務規則：如果 consumers 需要不同 tag name、global API、event name 或 payload shape，
就拆成獨立 widget。

## 其他文件

- [React Web Component 注意事項](./docs/react-web-component-considerations.md)
