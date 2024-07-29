import { crx } from "@crxjs/vite-plugin"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"
import topLevelAwait from "vite-plugin-top-level-await"

import manifest from "./manifest.config"

export default defineConfig({
  plugins: [react(), crx({ manifest }), topLevelAwait(), svgr()],
  define: {
    "global.browser": {},
  },
  build: {
    rollupOptions: {
      input: {
        app: "app.html",
        index: "index.html",
        prompt: "prompt.html",
        welcome: "welcome.html",
        inject: "public/pallad_rpc.js",
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    chunkSizeWarningLimit: 5000,
  },
})
