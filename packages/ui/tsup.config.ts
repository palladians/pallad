import { defineConfig } from 'tsup'

export default defineConfig([
  {
    name: 'pallad/ui',
    entry: ['./src/index.ts'],
    outDir: './dist',
    format: 'esm',
    sourcemap: true,
    clean: true,
    bundle: true,
    dts: true
  }
])
