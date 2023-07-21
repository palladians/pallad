import { defineConfig } from 'tsup'

export default defineConfig([
  {
    name: 'pallad/key-management-agnostic',
    entry: ['./src/index.ts'],
    outDir: './dist',
    format: 'esm',
    sourcemap: true,
    clean: true,
    bundle: true,
    dts: {
      compilerOptions: {
        moduleResolution: 'Node',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true
      }
    }
  }
])
