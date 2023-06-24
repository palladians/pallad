import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import topLevelAwait from 'vite-plugin-top-level-await'

import manifest from './manifest.config'

export default defineConfig({
  plugins: [react(), crx({ manifest }), topLevelAwait(), nodePolyfills()],
  resolve: {
    alias: {
      'react-native': 'react-native-web'
    }
  },
  build: {
    rollupOptions: {
      input: {
        app: 'app.html',
        index: 'index.html',
        inject: 'src/inject/script.js'
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})
