import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { build, type InlineConfig } from 'vite'

const root = process.cwd()

const entries = [
  {
    entry: resolve(root, 'src/entries/cross-sell-banner.wc.tsx'),
    fileName: 'cross-sell-banner.wc.js',
    name: 'CrossSellBannerWebComponent',
  },
  {
    entry: resolve(root, 'src/entries/cross-sell-banner.mount.ts'),
    fileName: 'cross-sell-banner.mount.js',
    name: 'CrossSellBanner',
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
