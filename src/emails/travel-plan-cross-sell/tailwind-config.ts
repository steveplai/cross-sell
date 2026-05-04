import { pixelBasedPreset } from '@react-email/components'

const travelPlanCrossSellEmailSpacing = {
  '0.75': '3px',
  '1.25': '5px',
  '3.75': '15px',
  '5.5': '22px',
  '7.5': '30px',
  '11.75': '47px',
  '18': '72px',
  '25': '100px',
  '42.5': '170px',
  '48.5': '194px',
  '74.75': '299px',
  '75': '300px',
  '115': '460px',
  '150': '600px',
}

export const travelPlanCrossSellTailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      spacing: travelPlanCrossSellEmailSpacing,
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
