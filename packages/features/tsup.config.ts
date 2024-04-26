import { baseTsupConfig } from "@palladxyz/common"
import svgJsx from "@svgr/plugin-jsx"
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
      svgr({ plugins: [svgJsx] }),
    ],
    external: ["swr"],
    treeshake: true,
  },
])
