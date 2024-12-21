import { baseTsupConfig } from "@palladco/common"
import { defineConfig } from "tsup"

import packageJson from "./package.json"

export default defineConfig([
  {
    ...baseTsupConfig,
    name: packageJson.name,
    env: {
      VITE_APP_DEFAULT_NETWORK_ID:
        process.env.VITE_APP_DEFAULT_NETWORK_ID ?? "mina:mainnet",
    },
  },
])
