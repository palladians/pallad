module.exports = function (api) {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]]
    // plugins: [
    //   [
    //     require.resolve('babel-plugin-module-resolver'),
    //     {
    //       root: ['../..'],
    //       alias: {
    //         '@palladxyz/features': '../../packages/@palladxyz/features'
    //       },
    //       extensions: ['.js', '.jsx', '.tsx', '.ts', '.ios.js', '.android.js']
    //     }
    //   ]
    // ]
  }
}
