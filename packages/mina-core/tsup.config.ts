import { baseTsupConfig } from "@palladxyz/common"
import { defineConfig } from "tsup"

import packageJson from "./package.json"

export default defineConfig([
  {
    ...baseTsupConfig,
    name: packageJson.name,
  },
])
