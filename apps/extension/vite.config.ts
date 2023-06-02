import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import manifest from './manifest.config'
import commonjs from 'vite-plugin-commonjs'
import { crx } from '@crxjs/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest }), commonjs()],
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
  publicDir: './public/'
})
