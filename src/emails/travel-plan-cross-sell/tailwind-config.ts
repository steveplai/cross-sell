import { pixelBasedPreset } from '@react-email/components'

export const travelPlanCrossSellTailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        ink: '#222222',
        muted: '#666666',
        nature: '#f7f7f7',
        orange: '#ff5b1a',
        'brand-red': '#f03742',
        'brand-red-soft': 'rgba(240, 55, 66, 0.1)',
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'Arial', 'sans-serif'],
      },
    },
  },
}
