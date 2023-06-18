import { defineConfig } from 'tsup'

export default defineConfig([
  {
    name: 'pallad/api',
    entry: ['./src/index.ts', './src/server.ts'],
    outDir: './dist',
    format: 'esm',
    clean: true,
    dts: {
      compilerOptions: {
        moduleResolution: 'Node',
        lib: ['dom']
      }
    }
  }
])
