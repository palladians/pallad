import svgJsx from '@svgr/plugin-jsx'
import { polyfillNode } from 'esbuild-plugin-polyfill-node'
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
    dts: true,
    esbuildPlugins: [
      polyfillNode({
        polyfills: { crypto: true },
        globals: { process: true }
      }),
      svgr({ plugins: [svgJsx] })
    ],
    external: ['swr']
  }
])
