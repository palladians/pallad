import { commonjs } from '@hyrious/esbuild-plugin-commonjs'
import svgJsx from '@svgr/plugin-jsx'
import svgr from 'esbuild-plugin-svgr'
import { defineConfig } from 'tsup'

export default defineConfig([
  {
    name: 'pallad/features',
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
    esbuildPlugins: [commonjs(), svgr({ plugins: [svgJsx] })],
    external: ['react-native', 'react-native-web']
  }
])
