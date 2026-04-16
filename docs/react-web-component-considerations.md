# React Web Component 注意事項

本專案會透過 `createReactWebComponent` 將 React widget 渲染到 Web Component 裡。

目前的 runtime model 是：

```txt
custom element connected
-> attachShadow()
-> 注入 widget CSS
-> 建立 mount node
-> React createRoot(mountNode)
-> render React component
```

這個模型很適合可嵌入式 widget SDK，但它不等同於把 React app 直接掛到 document 裡。每一個 Web Component instance 都會是 Shadow DOM 邊界內的一個獨立 React root。

## 適用範圍

這個做法適合：

- Banner widget
- Product card
- Product recommendation block
- Cross-sell offer block
- Embedded CTA
- 小型互動 UI 區塊

以下情境需要更多設計後再處理：

- 大型表單
- Modal、tooltip、popover、toast、dropdown 類 UI
- 複雜 drag and drop
- 需要宿主 React context 的元件
- SSR hydration
- 深度宿主頁主題客製

## 已知限制

### Attribute 都是字串

HTML attribute 天然承載的是字串：

```html
<cross-sell-banner title="推薦商品" locale="zh-TW"></cross-sell-banner>
```

這對簡單值很適合，但複雜資料就需要解析：

```html
<cross-sell-banner
  products='[{"id":"p1","name":"商品 A","price":1200}]'
></cross-sell-banner>
```

這在小型範例中可行，但有一些限制：

- JSON 放在 attribute 裡可能會遇到跳脫字元問題。
- 大型 payload 不適合透過 attribute 傳遞。
- 透過 `setAttribute` 更新 object-like data 會比較彆扭。
- 型別安全比 React props 弱。
- Function 不能透過 attribute 傳遞。

如果 widget 變得更複雜，應該加入 DOM property 支援：

```js
const el = document.querySelector('cross-sell-banner')
el.products = [{ id: 'p1', name: '商品 A', price: 1200 }]
```

### Callback 會轉成 CustomEvent

React callback 不能透過純 HTML 傳入。Web Component entry 應該把 React callback 轉成瀏覽器事件。

例如 React callback：

```tsx
onSelectProduct(product)
```

會轉成：

```txt
cross-sell:product-select
```

宿主頁可以這樣監聽：

```js
el.addEventListener('cross-sell:product-select', (event) => {
  console.log(event.detail.product)
})
```

如果事件是從 Shadow DOM 裡 dispatch，應該使用：

```ts
new CustomEvent('cross-sell:product-select', {
  bubbles: true,
  composed: true,
  detail: { product },
})
```

事件名稱與 `detail` payload 都是 public API，應該為每個 widget 文件化。

### Shadow DOM 同時是隔離與限制

Shadow DOM 可以保護 widget，避免大多數宿主頁 CSS 污染。這對嵌入未知頁面很有用。

但也代表：

- 宿主頁不容易覆寫 widget 內部樣式。
- 宿主頁的全域 CSS reset 不會套用到 widget 內部。
- 字型與主題繼承要刻意設計。
- Focus、z-index、overlay 行為需要額外測試。

建議用 CSS variables 提供安全的主題客製能力，而不是要求宿主頁覆寫內部 class：

```css
:host {
  --cross-sell-primary: #047857;
}
```

### Portal 需要策略

很多 React UI library 預設會把 overlay render 到 `document.body`：

- Modal
- Popover
- Tooltip
- Dropdown
- Toast
- Date picker

在 Shadow DOM widget 裡，這可能會造成問題：

- Portal 出去的 UI 可能失去 widget 樣式。
- UI 可能逃出原本預期的視覺邊界。
- Focus trap 行為可能和宿主頁衝突。
- z-index 行為可能變得難以預期。

如果需要 overlay，應該選擇支援 custom portal container 的 library，或在 widget shadow root 內建立 portal target。

### React Context 以 Widget Instance 為邊界

每個 Web Component 都會建立自己的 React root：

```ts
createRoot(this.mountNode)
```

這代表：

- React context 在單一 widget instance 內正常運作。
- Context 不會在不同 widget instance 之間共享。
- 宿主 React app 的 context 不會流入 Web Component。

跨邊界設定應該透過：

- Attributes
- DOM properties
- Global config
- CSS variables
- Custom events

### SSR Hydration 不屬於這個 Runtime

目前 Web Component runtime 使用 client-side rendering：

```ts
createRoot(mountNode).render(...)
```

它沒有使用：

```ts
hydrateRoot(...)
```

如果某個 widget 需要預先輸出 HTML，再由 client 接手 hydration，應該新增一條獨立的 hydrate entry，而不是混進目前的 Web Component entry。

### Attribute 變更會立即 Re-render

目前 `attributeChangedCallback` 會直接呼叫 `renderReact()`。這對低頻率更新沒有問題。

如果未來有高頻率更新，建議改用 DOM properties，或加入 `requestAnimationFrame` batching。

### 目前沒有內建 Error Boundary

Runtime 目前沒有替 widget 包 Error Boundary。

如果要走向 production SDK，建議在每個 rendered widget 外層加上 boundary，讓 render error 可以被限制在 widget 內並回報，不要影響宿主頁。

```tsx
<WidgetErrorBoundary>
  <Component {...props} />
</WidgetErrorBoundary>
```

### Form 與 Focus 需要 Integration Tests

基本的 button 和 input 在 Shadow DOM 裡可以正常運作，但細節會和一般 document-level React app 不同：

- `document.activeElement` 可能會是 custom element host。
- Analytics script 不一定會檢查 shadow root 內部。
- 宿主頁的 form tracking script 可能看不到內部 inputs。
- Playwright 測試必要時應該明確檢查 shadow root。

### 第三方 React UI Library 需要先評估

在 Web Component widget 裡使用第三方 UI library 前，應該確認它是否：

- Portal 到 `document.body`
- 注入樣式到 `document.head`
- 需要全域 CSS reset
- 假設 document-level layout
- 支援 Shadow DOM
- 支援 custom portal container

很多在一般 React app 中好用的 library，在 Shadow DOM 裡可能需要額外設定。

## 目前 Runtime 行為

目前 wrapper 已處理這些基本行為：

- 每個 custom element 建立自己的 Shadow DOM。
- 將 widget CSS 注入 shadow root。
- 每個 connected lifecycle 只建立一次 React root。
- observed attributes 變更時 re-render。
- custom element disconnected 時 unmount React。
- 允許同一個 element 被移除後再插回 DOM。

當 element 被 disconnected 後又 reconnected：

```txt
existing mount node remains
root is recreated
component renders again
```

這對目前的 widget model 是可接受的。

## 建議後續補強

當 widget SDK 開始走向 production-facing 時，建議補上：

1. 支援複雜 props 的 DOM property API。
2. Widget-level Error Boundary。
3. 以 CSS variables 為基礎的主題系統。
4. 在 README 與 manifest 中補齊事件契約文件。
5. Modal 類 UI 的 overlay 與 portal 策略。
6. 當 widget 變得更互動時，補上 focus 與 form 行為測試。

## 總結

在 Web Component 內渲染 React，是這個專案可行且合理的架構。重要的是要知道：它是 Shadow DOM 裡的一個獨立 React root，不是一般掛在 document 裡的 React app root。

主要 tradeoffs 是：

- Props 需要 attribute 或 property mapping。
- Callback 會變成 CustomEvents。
- 樣式被隔離，但也比較難被外部覆寫。
- React context 不會跨過 custom element boundary。
- Portal 與 overlay 需要明確處理。
- SSR hydration 應該是另一種獨立輸出模式。
- Production hardening 前應補上 Error Boundary。

目前實作適合第一階段的 cross-sell widgets。下一個主要 runtime 升級建議是 DOM property support 與 Error Boundary handling。
