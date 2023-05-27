import { createRequire } from 'node:module'
import { defineConfig } from 'tsup'
import alias from 'esbuild-plugin-alias'

const require = createRequire(import.meta.url)

export default defineConfig([
  {
    name: 'main',
    entry: ['./src/index.ts'],
    outDir: './dist',
    format: ['esm', 'cjs'],
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
      })
    ],
    external: ['react-native']
  }
])
