import type { Options } from "tsup"

export const baseTsupConfig: Options = {
  entry: ["./src/index.ts"],
  outDir: "./dist",
  format: "esm",
  sourcemap: true,
  clean: true,
  bundle: true,
  dts: true,
  silent: true,
}
