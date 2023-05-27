import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { crx } from '@crxjs/vite-plugin'
import path from 'path'
import manifest from './manifest.config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
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
    }
  }
})
