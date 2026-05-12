// Raw AP-56 response contracts. Keep these separate from widget-facing types so
// backend field names do not leak into React components.
export interface Ap56CrossSellingResponseSection {
  Type?: unknown
  pList?: unknown
  CombineTagList?: unknown
}

export interface Ap56ProductInfo {
  ID?: unknown
  Title?: unknown
  ProductUrl?: unknown
  Price?: unknown
  ImgUrl?: unknown
  SaleCurr?: unknown
  CityName?: unknown
  SalePrice?: unknown
  Discount?: unknown
  Location?: unknown
  Level?: unknown
  Rating?: unknown
  RatingCount?: unknown
  Likeability?: unknown
  CancelTag?: unknown
  url?: unknown
}
