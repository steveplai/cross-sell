# Flight Order Cross Sell 斷點設計

這份文件記錄 `cross-sell-widget` widget 目前的斷點設計。

此 widget 目前刻意分成兩套斷點策略：

- 整體版面使用 Lion 品牌桌機斷點：`lion-desktop`，對應 `980px`。
- Carousel 使用依卡片可容納數量反推的斷點，讓跑馬燈在不同寬度下盡可能維持合理密度。

## 整體 Widget 斷點

`src/widgets/cross-sell-widget/` 內多數版面切換使用：

```txt
lion-desktop:
```

這個 breakpoint 定義在 shared widget stylesheet：

```css
--breakpoint-lion-desktop: 61.25rem;
```

目前定義位置：

```txt
src/styles/widget.css
```

`61.25rem` 在預設 `16px` root font size 下等於 `980px`。這裡使用 `rem` 是為了與 Tailwind 預設斷點單位一致，避免自訂 `px` breakpoint 與預設 `rem` breakpoint 混用時產生排序問題。

這不是覆寫 Tailwind 原本的 `md:` 或 `lg:`。其他 widgets 仍可維持既有的 `sm`、`md`、`lg` 等斷點行為；若未來其他 Lion widgets 也需要同一個品牌桌機斷點，則可以共用 `lion-desktop:`。

`lion-desktop` 主要控制大範圍版面切換，例如：

- panel 圓角
- section padding
- 標題與輔助文字字級
- mobile / desktop 裝飾圖切換
- 高鐵加購 banner 的 desktop 間距、字級、裝飾圖切換
- desktop carousel 控制按鈕顯示
- reminder cards 雙欄排列

目前整體行為：

```txt
<980px   mobile / compact layout
>=980px  desktop layout
```

實作上的重要原則：

```txt
不重新定義 Tailwind 既有的 sm:、md: 或 lg:
```

若單一元件需要更細的區間，應使用 Tailwind arbitrary breakpoint，例如：

```txt
min-[712px]:max-[935.98px]:...
```

或使用元件自己的 container query。避免為了此 widget 覆寫 Tailwind 既有 breakpoint。

## 高鐵加購 Banner Container Query

高鐵加購 banner 的橫向排列沒有完全跟著 `lion-desktop`。

原因是這個 banner 的可讀性主要取決於自身可用寬度，而不是整個 viewport 是否已經進入桌機規格。因此目前使用命名 container query：

```txt
@container/hsr
@min-[590px]/hsr
```

目前行為：

```txt
<590px container content width   title / description / CTA 直向排列
>=590px container content width  title / description / CTA 橫向排列
>=980px viewport width           套用 lion-desktop 的 padding、gap、字級與 desktop 裝飾圖
```

這裡的 `590px` 不是新的全域斷點。它來自設計上希望在 section 整體約 `630px` 時切成橫向排列；但 CSS container query 判斷的是 container content box，不包含 section 左右 padding。mobile padding 是左右各 `20px`，因此：

```txt
630px - 20px - 20px = 590px
```

## Carousel 斷點策略

推薦商品 Carousel 沒有跟著整體 widget 使用單一 `980px` 斷點。

原因是兩者回答的問題不同：

```txt
整體 lion-desktop 斷點：
是否切換成 desktop layout？

Carousel 斷點：
目前寬度可以舒適地顯示幾張商品卡片？
```

若 Carousel 只跟著 `980px` 切換，部分中間寬度會顯得卡片過大、畫面偏空。因此 Carousel 改採「可容納卡片數量」導向的斷點。

## Carousel 計算基準

斷點推導時參考了原本的卡片寬度與 section padding：

```txt
原本小尺寸卡片 min width：約 208px
原本桌機卡片 min width：約 219px

Section padding:
  <980px   左右各 20px
  >=980px  左右各 48px
```

計算時每張卡片額外保留約 `16px` 緩衝，避免剛切換到下一個張數時顯得太擠。

推導後的斷點：

| Viewport         |  顯示張數 | 推導                                                                 |
| ---------------- | --------: | -------------------------------------------------------------------- |
| `<488px`         | 約 1.5 張 | 低於 2 張的安全寬度                                                  |
| `488px - 711px`  |      2 張 | `2 * (208 + 16) + 40 = 488`                                          |
| `712px - 935px`  |      3 張 | `3 * (208 + 16) + 40 = 712`                                          |
| `936px - 1189px` |      4 張 | `4 * (208 + 16) + 40 = 936`；980px 後 padding 變大，但仍在可接受範圍 |
| `>=1190px`       |      5 張 | 接近 widget 最大寬度時切到 5 張                                      |

補充：若嚴格要求 5 張都滿足「219px + 16px 緩衝」，再加上 `>=980px` 的左右 padding，需要：

```txt
5 * (219 + 16) + 96 = 1271px
```

但此 widget 外層目前 `max-w-297.5` 約為 `1190px`，因此不可能等到完整滿足 `1271px` 才顯示 5 張。最後採用的取捨是：

```txt
>=1190px 顯示 5 張
```

這讓 Carousel 在接近 widget 最大寬度時能達到最多 5 張，同時避免在 `1024px` 附近過早切成 5 張導致擁擠。

## 目前 Carousel 實作

目前 carousel item class：

```tsx
'basis-[65%] pl-2 min-[488px]:max-[711.98px]:basis-1/2 min-[712px]:max-[935.98px]:basis-1/3 min-[936px]:max-[1189.98px]:basis-1/4 min-[1190px]:basis-1/5'
```

目前行為：

```txt
<488px       basis 65%，約 1.5 張
488-711px    2 張
712-935px    3 張
936-1189px   4 張
>=1190px     5 張
```

## 與整體斷點的差異

整體 widget 在 `980px` 切換 desktop layout，但 Carousel 不在 `980px` 切換張數。

這是刻意設計：

```txt
980px 仍控制 section padding、標題字級、控制按鈕等桌機版面。
Carousel 張數則依可用寬度增加。
```

因此 `980px` 仍是重要檢查點，因為 section padding 會改變；但 Carousel 張數在 `936px` 到 `1189px` 間維持 4 張。

## 目前取捨

Carousel item 與 placeholder item 目前避免使用固定 `min-w-*` class。

原因是若保留：

```txt
min-w-52
lion-desktop:min-w-54.75
```

這些最小寬度可能會壓過 `basis-1/5`，導致即使設定了 5 張，也不一定能完整顯示 5 張。

目前採用的取捨：

```txt
用明確的 basis 斷點控制顯示張數。
讓卡片內容適應該 basis。
當 ProductCard 內容變多時，重新檢查最緊的寬度。
```

建議檢查寬度：

```txt
487px
488px
712px
936px
980px
1189px
1190px
```

## 相關檔案

```txt
src/widgets/cross-sell-widget/CrossSellWidget.tsx
src/widgets/cross-sell-widget/components/addons/HsrAddonBanner.tsx
src/widgets/cross-sell-widget/components/addons/ReminderCards.tsx
src/widgets/cross-sell-widget/components/promo/CountdownBackground.tsx
src/widgets/cross-sell-widget/components/promo/PromoCountdown.tsx
src/widgets/cross-sell-widget/components/promo/PromoHeader.tsx
src/widgets/cross-sell-widget/components/recommendations/AttractionDecorBanner.tsx
src/widgets/cross-sell-widget/components/recommendations/CrossSellSection.tsx
src/widgets/cross-sell-widget/components/recommendations/useCarouselPlaceholderLayout.ts
src/styles/widget.css
```
