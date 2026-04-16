import '../src/styles/widget.css'

import type { Preview } from '@storybook/react-vite'

function getBackgroundName(backgrounds: unknown) {
  if (typeof backgrounds === 'string') {
    return backgrounds
  }

  if (
    backgrounds &&
    typeof backgrounds === 'object' &&
    'value' in backgrounds &&
    typeof backgrounds.value === 'string'
  ) {
    return backgrounds.value
  }

  return undefined
}

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const backgroundName = getBackgroundName(context.globals.backgrounds)
      const isDark = backgroundName === 'dark'

      return (
        <div
          className={isDark ? 'dark' : undefined}
          style={{
            minHeight: '100vh',
            padding: 24,
          }}
        >
          <Story />
        </div>
      )
    },
  ],
  parameters: {
    backgrounds: {
      default: 'light',
      options: {
        light: { name: 'light', value: 'white' },
        dark: { name: 'dark', value: 'oklch(0.18 0.01 285)' },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
