import tailwindConfig from '@palladxyz/ui/tailwind.config.mjs'

export default {
  content: [
    ...tailwindConfig.content,
    '../../packages/{ui,features}/src/**/*.{js,jsx,ts,tsx,mdx}'
  ],
  presets: [tailwindConfig]
}
