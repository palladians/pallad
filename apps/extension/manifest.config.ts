import packageJson from './package.json'
const { version } = packageJson
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { defineManifest } = require('@crxjs/vite-plugin')

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/)

export default defineManifest(async (env) => ({
  manifest_version: 3,
  name: env.mode === 'DEVELOPMENT' ? '[DEV] Pallad' : 'Pallad',
  icons: {
    '16': 'icons/16.png',
    '32': 'icons/32.png',
    '48': 'icons/48.png',
    '128': 'icons/128.png'
  },
  version: `${major}.${minor}.${patch}.${label}`,
  version_name: version,
  action: { default_popup: 'index.html' },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module'
  }
}))
