import { defineConfig } from 'tsup'

export default defineConfig([
  {
    name: 'pallad/api',
    entry: ['./src/functions/'],
    outDir: './netlify/edge-functions',
    format: 'esm',
    clean: true,
    splitting: false
  }
])
