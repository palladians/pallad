import { defineConfig } from "vite"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import svgr from "vite-plugin-svgr"

const env = (import.meta as any).env

export default defineConfig({
  define: {
    __DEV__: env?.MODE === "development",
    "global.browser": {},
    "process.env": {},
  },
  plugins: [
    svgr(),
    nodePolyfills({ protocolImports: true, globals: { Buffer: true } }),
  ],
  build: {
    chunkSizeWarningLimit: 5000,
    emptyOutDir: true,
  },
})
