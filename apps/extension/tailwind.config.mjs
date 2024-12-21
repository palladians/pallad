import tailwindConfig from "@palladco/features/tailwind.config.mjs"

export default {
  content: [
    ...tailwindConfig.content,
    "../../packages/features/src/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  presets: [tailwindConfig],
}
