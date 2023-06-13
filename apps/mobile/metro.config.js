// Learn more https://docs.expo.dev/guides/monorepos
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')
const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks')
// Find the project and workspace directories
const projectRoot = __dirname
// This can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot]

config.resolver.unstable_enablePackageExports = true
config.resolver.resolverMainFields = [
  'react-native',
  'browser',
  'module',
  'main'
]
config.resolver.resolveRequest = MetroSymlinksResolver()
config.resolver.extraNodeModules = {
  '@palladxyz/features': path.resolve(workspaceRoot, 'packages/features')
}
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules')
]
// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true

module.exports = config
