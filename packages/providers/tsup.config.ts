import { baseTsupConfig } from "@palladco/common"
import { polyfillNode } from "esbuild-plugin-polyfill-node"
import { defineConfig } from "tsup"

import packageJson from "./package.json"

export default defineConfig([
  {
    ...baseTsupConfig,
    name: packageJson.name,
    esbuildPlugins: [
      polyfillNode({
        polyfills: { punycode: true },
      }),
    ],
  },
])
