import { defineConfig } from 'tsup'

export default defineConfig([
  {
    name: 'pallad/api',
    entry: ['./src/trpc.ts'],
    outDir: './dist',
    format: 'esm',
    clean: true,
    splitting: false
  }
])
