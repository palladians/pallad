import { createRequire } from 'node:module'
import { defineConfig } from 'tsup'
import alias from 'esbuild-plugin-alias'
import { commonjs } from '@hyrious/esbuild-plugin-commonjs'
const require = createRequire(import.meta.url)

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
    esbuildPlugins: [
      alias({
        'react-native': require.resolve('react-native-web')
      }),
      commonjs()
    ],
    external: ['react-native']
  }
])
