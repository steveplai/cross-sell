export function formatCurrency(value: number, locale = 'zh-TW', currency = 'TWD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}
