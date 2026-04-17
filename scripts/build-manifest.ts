import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const manifest = {
  widgets: [
    {
      name: 'cross-sell-banner',
      tagName: 'cross-sell-banner',
      files: {
        webComponent: 'widgets/cross-sell-banner.wc.js',
        mountApi: 'widgets/cross-sell-banner.mount.js',
      },
      events: ['cross-sell:product-select'],
    },
    {
      name: 'themed-cross-sell-banner',
      tagName: 'themed-cross-sell-banner',
      files: {
        webComponent: 'widgets/themed-cross-sell-banner.wc.js',
        mountApi: 'widgets/themed-cross-sell-banner.mount.js',
      },
      events: ['cross-sell:product-select'],
    },
  ],
  emails: [
    {
      name: 'cross-sell-offer',
      file: 'emails/cross-sell-offer.html',
    },
    {
      name: 'order-cross-sell',
      file: 'emails/order-cross-sell.html',
    },
    {
      name: 'sales-cross-sell',
      file: 'emails/sales-cross-sell.html',
    },
    {
      name: 'insurance-cross-sell',
      file: 'emails/insurance-cross-sell.html',
    },
  ],
}

const outDir = resolve(process.cwd(), 'dist')

await mkdir(outDir, { recursive: true })
await writeFile(
  resolve(outDir, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
)
