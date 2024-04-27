import { defineConfig } from "vite"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import svgr from "vite-plugin-svgr"
import topLevelAwait from "vite-plugin-top-level-await"

const env = (import.meta as any).env

export default defineConfig({
  define: {
    __DEV__: env?.MODE === "development",
  },
  plugins: [
    topLevelAwait(),
    nodePolyfills({ protocolImports: true, globals: { Buffer: true } }),
    svgr(),
  ],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
