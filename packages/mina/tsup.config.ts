import { defineConfig } from 'tsup'

export default defineConfig([
  {
    name: 'pallad/mina',
    entry: ['./src/index.ts'],
    outDir: './dist',
    format: 'esm',
    sourcemap: true,
    clean: true,
    bundle: true,
    dts: {
      compilerOptions: {
        moduleResolution: 'Node',
        allowSyntheticDefaultImports: true
      }
    }
  }
])
