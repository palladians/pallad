import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import manifest from './manifest.config'
import commonjs from 'vite-plugin-commonjs'
import { crx } from '@crxjs/vite-plugin'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest }), commonjs(), wasm(), topLevelAwait()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-native': 'react-native-web'
    }
  },
  build: {
    rollupOptions: {
      input: {
        app: 'app.html',
        index: 'index.html'
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  publicDir: './public/',
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        })
      ]
    }
  }
})
