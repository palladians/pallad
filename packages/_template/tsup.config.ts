import { baseTsupConfig } from '@palladxyz/common'
import { defineConfig } from 'tsup'

export default defineConfig([
  {
    ...baseTsupConfig,
    name: 'pallad/template'
  }
])
