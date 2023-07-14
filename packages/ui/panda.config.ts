import { preset } from './src/preset'
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  prefix: 'pallad',
  jsxFramework: 'react',
  presets: ['@pandacss/dev/presets', preset]
})
