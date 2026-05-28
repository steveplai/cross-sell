import { rename, rm, symlink } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { build, type InlineConfig } from 'vite'

import { getBuildVersion, pruneOldVersions } from './build-version'

const root = process.cwd()
const version = getBuildVersion()

console.log(`Building widgets: ${version}`)

const entries = [
  {
    entry: resolve(root, 'src/entries/demo-product-banner/wc.tsx'),
    fileName: 'demo-product-banner/wc.js',
    name: 'DemoProductBannerWebComponent',
  },
  {
    entry: resolve(root, 'src/entries/demo-product-banner/mount.ts'),
    fileName: 'demo-product-banner/mount.js',
    name: 'DemoProductBanner',
  },
  {
    entry: resolve(root, 'src/entries/themed-demo-product-banner/wc.tsx'),
    fileName: 'themed-demo-product-banner/wc.js',
    name: 'ThemedDemoProductBannerWebComponent',
  },
  {
    entry: resolve(root, 'src/entries/themed-demo-product-banner/mount.ts'),
    fileName: 'themed-demo-product-banner/mount.js',
    name: 'ThemedDemoProductBanner',
  },
  {
    entry: resolve(root, 'src/entries/cross-sell-widget/wc.tsx'),
    fileName: 'cross-sell-widget/wc.js',
    name: 'CrossSellWidgetWebComponent',
  },
  {
    entry: resolve(root, 'src/entries/cross-sell-widget/mount.ts'),
    fileName: 'cross-sell-widget/mount.js',
    name: 'CrossSellWidget',
  },
  {
    entry: resolve(root, 'src/entries/cross-sell-widget/connected.wc.tsx'),
    fileName: 'cross-sell-widget-connected/wc.js',
    name: 'CrossSellWidgetConnectedWebComponent',
  },
  {
    entry: resolve(root, 'src/entries/cross-sell-widget/connected.mount.ts'),
    fileName: 'cross-sell-widget-connected/mount.js',
    name: 'CrossSellWidgetConnected',
  },
]

await rm(resolve(root, 'dist/widgets', version), {
  force: true,
  recursive: true,
})

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
      outDir: resolve(root, 'dist/widgets', version),
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

await pruneOldVersions(resolve(root, 'dist/widgets'), 5)

const latestLink = resolve(root, 'dist/widgets/latest')
const latestTmp = `${latestLink}.tmp`
await symlink(version, latestTmp)
await rename(latestTmp, latestLink)
