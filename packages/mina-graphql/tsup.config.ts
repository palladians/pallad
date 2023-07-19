import { polyfillNode } from 'esbuild-plugin-polyfill-node'
import { defineConfig } from 'tsup'

export default defineConfig([
  {
    name: 'pallad/mina-graphql',
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
    },
    esbuildPlugins: [
      polyfillNode({
        polyfills: { punycode: true }
      })
    ]
  }
])
