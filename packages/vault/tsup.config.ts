import { baseTsupConfig } from "@palladxyz/common"
import "dotenv/config"
import { defineConfig } from "tsup"

import packageJson from "./package.json"

export default defineConfig([
  {
    ...baseTsupConfig,
    name: packageJson.name,
    env: {
      VITE_APP_DEFAULT_NETWORK:
        process.env.VITE_APP_DEFAULT_NETWORK ?? "Mainnet",
    },
  },
])
