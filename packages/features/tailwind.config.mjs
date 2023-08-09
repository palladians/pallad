import tailwindConfig from '@palladxyz/ui/tailwind.config.mjs'

export default {
  content: [
    ...tailwindConfig.content,
    './ladle/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx,mdx}'
  ],
  presets: [tailwindConfig]
}
