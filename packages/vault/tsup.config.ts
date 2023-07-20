import { baseTsupConfig } from '@palladxyz/common'
import { defineConfig } from 'tsup' // eslint-disable-line import/no-extraneous-dependencies

import packageJson from './package.json'

export default defineConfig([
  {
    ...baseTsupConfig,
    name: packageJson.name
  }
])
