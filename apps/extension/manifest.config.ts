import { defineManifest } from '@crxjs/vite-plugin'
import packageJson from './package.json'
const { version } = packageJson

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/)

export default defineManifest(async (env) => ({
  manifest_version: 3,
  name: env.mode === 'DEVELOPMENT' ? '[DEV] Pallad' : 'Pallad',
  version: `${major}.${minor}.${patch}.${label}`,
  version_name: version,
  action: { default_popup: 'index.html' },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module'
  }
}))
