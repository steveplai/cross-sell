import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const manifest = {
  widgets: [
    {
      name: 'demo-product-banner',
      tagName: 'demo-product-banner',
      files: {
        webComponent: 'widgets/demo-product-banner.wc.js',
        mountApi: 'widgets/demo-product-banner.mount.js',
      },
      events: ['demo-product:product-select'],
    },
    {
      name: 'themed-demo-product-banner',
      tagName: 'themed-demo-product-banner',
      files: {
        webComponent: 'widgets/themed-demo-product-banner.wc.js',
        mountApi: 'widgets/themed-demo-product-banner.mount.js',
      },
      events: ['demo-product:product-select'],
    },
  ],
  emails: [
    {
      name: 'demo-product-offer',
      file: 'emails/demo-product-offer.html',
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
