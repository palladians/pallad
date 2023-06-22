import { commonjs } from '@hyrious/esbuild-plugin-commonjs'
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
    dts: {
      compilerOptions: {
        moduleResolution: 'Node',
        allowSyntheticDefaultImports: true,
        jsx: 'react'
      }
    },
    esbuildPlugins: [commonjs()],
    external: ['react-native', 'react-native-web']
  }
])
