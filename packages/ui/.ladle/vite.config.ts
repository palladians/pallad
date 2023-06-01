import { defineConfig } from 'vite'

const env = (import.meta as any).env

export default defineConfig({
  define: {
    __DEV__: env?.MODE === 'development',
    global: {}
  },
  resolve: {
    alias: [{ find: /^react-native$/, replacement: 'react-native-web' }]
  }
})
