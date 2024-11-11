import { baseTsupConfig } from "@palladco/common"
import { polyfillNode } from "esbuild-plugin-polyfill-node"
import svgr from "esbuild-plugin-svgr"
import { defineConfig } from "tsup"

import packageJson from "./package.json"

export default defineConfig([
  {
    ...baseTsupConfig,
    name: packageJson.name,
    esbuildPlugins: [
      polyfillNode({
        polyfills: { crypto: true },
        globals: { process: true },
      }),
      svgr(),
    ],
    external: ["swr"],
    treeshake: true,
  },
])
