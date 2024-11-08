import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import svgr from "vite-plugin-svgr"
import webExtension from "vite-plugin-web-extension"
import { manifest } from "./manifest"

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      webExtension({
        additionalInputs: ["prompt.html"],
        manifest: () => manifest,
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
    server: {
      headers: {
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin",
      },
    },
  }
})
