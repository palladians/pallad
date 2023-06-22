import { defineConfig } from 'vite'
import topLevelAwait from "vite-plugin-top-level-await";

const env = (import.meta as any).env

export default defineConfig({
  define: {
    __DEV__: env?.MODE === 'development'
  },
  resolve: {
    alias: [{ find: /^react-native$/, replacement: 'react-native-web' }]
  },
  plugins: [topLevelAwait()],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})
