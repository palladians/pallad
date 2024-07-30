import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import svgr from "vite-plugin-svgr"
import webExtension from "vite-plugin-web-extension"

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      webExtConfig: {
        startUrl: ["pallad.co"],
      },
      additionalInputs: ["prompt.html"],
    }),
    svgr(),
    nodePolyfills({ protocolImports: true, globals: { Buffer: true } }),
  ],
  define: {
    "global.browser": {},
    "process.env": {},
  },
  build: {
    chunkSizeWarningLimit: 5000,
    emptyOutDir: true,
  },
})
