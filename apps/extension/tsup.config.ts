import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/inject/rpc.ts"],
  outDir: "public",
  format: "esm",
  noExternal: [/(.*)/],
  splitting: false,
  bundle: true,
})
