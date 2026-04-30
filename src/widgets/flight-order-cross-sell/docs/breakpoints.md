# Flight Order Cross Sell 斷點設計

這份文件記錄 `flight-order-cross-sell` widget 目前的斷點設計。

此 widget 目前刻意分成兩套斷點策略：

- 整體版面使用單一桌機斷點：`980px`。
- Carousel 使用依卡片可容納數量反推的斷點，讓跑馬燈在不同寬度下盡可能維持合理密度。

## 整體 Widget 斷點

`src/widgets/flight-order-cross-sell/` 內多數版面切換使用：

```txt
min-[980px]:
```

這是只針對此 widget 將原本的 Tailwind `md:` 行為改成 `980px`。Tailwind 全域 theme 沒有被修改，所以其他 widgets 仍維持既有的 `sm`、`md`、`lg` 等斷點行為。

`980px` 主要控制大範圍版面切換，例如：

- panel 圓角
- section padding
- 標題與輔助文字字級
- mobile / desktop 裝飾圖切換
- 高鐵加購 banner 的橫向排列
- desktop carousel 控制按鈕顯示
- reminder cards 雙欄排列

目前整體行為：

```txt
<980px   mobile / compact layout
>=980px  desktop layout
```

實作上的重要原則：

```txt
不重新定義全域 sm: 或 lg:
```

若單一元件需要更細的區間，應使用 Tailwind arbitrary breakpoint，例如：

```txt
min-[712px]:max-[935.98px]:...
```

避免為了此 widget 修改全域 Tailwind breakpoint。

## Carousel 斷點策略

推薦商品 Carousel 沒有跟著整體 widget 使用單一 `980px` 斷點。

原因是兩者回答的問題不同：

```txt
整體 980px 斷點：
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

| Viewport | 顯示張數 | 推導 |
| --- | ---: | --- |
| `<488px` | 約 1.5 張 | 低於 2 張的安全寬度 |
| `488px - 711px` | 2 張 | `2 * (208 + 16) + 40 = 488` |
| `712px - 935px` | 3 張 | `3 * (208 + 16) + 40 = 712` |
| `936px - 1189px` | 4 張 | `4 * (208 + 16) + 40 = 936`；980px 後 padding 變大，但仍在可接受範圍 |
| `>=1190px` | 5 張 | 接近 widget 最大寬度時切到 5 張 |

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
min-[980px]:min-w-54.75
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
src/widgets/flight-order-cross-sell/FlightOrderCrossSell.tsx
src/widgets/flight-order-cross-sell/components/addons/HsrAddonBanner.tsx
src/widgets/flight-order-cross-sell/components/addons/ReminderCards.tsx
src/widgets/flight-order-cross-sell/components/promo/CountdownBackground.tsx
src/widgets/flight-order-cross-sell/components/promo/PromoCountdown.tsx
src/widgets/flight-order-cross-sell/components/promo/PromoHeader.tsx
src/widgets/flight-order-cross-sell/components/recommendations/AttractionDecorBanner.tsx
src/widgets/flight-order-cross-sell/components/recommendations/CrossSellSection.tsx
src/widgets/flight-order-cross-sell/components/recommendations/useCarouselPlaceholderLayout.ts
```
