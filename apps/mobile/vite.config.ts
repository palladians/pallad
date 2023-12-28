import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import svgr from 'vite-plugin-svgr'
import topLevelAwait from 'vite-plugin-top-level-await'

export default defineConfig({
  plugins: [
    react(),
    topLevelAwait(),
    nodePolyfills({ protocolImports: true, globals: { Buffer: true } }),
    svgr({ exportAsDefault: true })
  ],
  define: {
    'global.browser': {}
  },
  build: {
    rollupOptions: {
      input: {
        index: 'index.html'
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})
