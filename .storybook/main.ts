import { fileURLToPath, URL } from 'node:url'

import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal(config, { configType }) {
    config.resolve ??= {}
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@': fileURLToPath(new URL('../src', import.meta.url)),
    }

    if (configType === 'DEVELOPMENT') {
      config.server ??= {}
      config.server.proxy = {
        ...(config.server.proxy ?? {}),
        '/__liontravel-ap56-uat-proxy': {
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/__liontravel-ap56-uat-proxy/, ''),
          secure: true,
          target: 'https://uwww.liontravel.com',
        },
        '/__liontravel-ap56-production-proxy': {
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(/^\/__liontravel-ap56-production-proxy/, ''),
          secure: true,
          target: 'https://www.liontravel.com',
        },
      }
    }

    return config
  },
}

export default config
