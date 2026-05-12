import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { build, type InlineConfig } from 'vite'

const root = process.cwd()

const entries = [
  {
    entry: resolve(root, 'src/entries/demo-product-banner/wc.tsx'),
    fileName: 'demo-product-banner.wc.js',
    name: 'DemoProductBannerWebComponent',
  },
  {
    entry: resolve(root, 'src/entries/demo-product-banner/mount.ts'),
    fileName: 'demo-product-banner.mount.js',
    name: 'DemoProductBanner',
  },
  {
    entry: resolve(root, 'src/entries/themed-demo-product-banner/wc.tsx'),
    fileName: 'themed-demo-product-banner.wc.js',
    name: 'ThemedDemoProductBannerWebComponent',
  },
  {
    entry: resolve(root, 'src/entries/themed-demo-product-banner/mount.ts'),
    fileName: 'themed-demo-product-banner.mount.js',
    name: 'ThemedDemoProductBanner',
  },
  {
    entry: resolve(root, 'src/entries/flight-order-cross-sell/wc.tsx'),
    fileName: 'flight-order-cross-sell.wc.js',
    name: 'FlightOrderCrossSellWebComponent',
  },
  {
    entry: resolve(root, 'src/entries/flight-order-cross-sell/mount.ts'),
    fileName: 'flight-order-cross-sell.mount.js',
    name: 'FlightOrderCrossSell',
  },
  {
    entry: resolve(
      root,
      'src/entries/flight-order-cross-sell/connected.wc.tsx',
    ),
    fileName: 'flight-order-cross-sell-connected.wc.js',
    name: 'FlightOrderCrossSellConnectedWebComponent',
  },
  {
    entry: resolve(
      root,
      'src/entries/flight-order-cross-sell/connected.mount.ts',
    ),
    fileName: 'flight-order-cross-sell-connected.mount.js',
    name: 'FlightOrderCrossSellConnected',
  },
]

await rm(resolve(root, 'dist/widgets'), { force: true, recursive: true })

for (const item of entries) {
  const config: InlineConfig = {
    configFile: false,
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    mode: 'production',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../src', import.meta.url)),
      },
    },
    build: {
      emptyOutDir: false,
      outDir: resolve(root, 'dist/widgets'),
      lib: {
        entry: item.entry,
        formats: ['iife'],
        name: item.name,
        fileName: () => item.fileName,
      },
      rollupOptions: {
        output: {},
      },
    },
  }

  await build(config)
}
