import { baseTsupConfig } from "@palladco/common"
import { defineConfig } from "tsup"

import packageJson from "./package.json"

export default defineConfig([
  {
    ...baseTsupConfig,
    name: packageJson.name,
    splitting: false,
  },
])
