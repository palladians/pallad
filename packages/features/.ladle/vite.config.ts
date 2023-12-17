import { defineConfig } from 'vite'
import topLevelAwait from 'vite-plugin-top-level-await'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import svgr from 'vite-plugin-svgr'

const env = (import.meta as any).env

export default defineConfig({
  define: {
    __DEV__: env?.MODE === 'development'
  },
  plugins: [
    topLevelAwait(),
    nodePolyfills({ protocolImports: true, globals: { Buffer: true } }),
    svgr({ exportAsDefault: true })
  ],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})
