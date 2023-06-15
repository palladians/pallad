/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.alias = {
      'react-native$': 'react-native-web'
    }
    return config
  }
}

module.exports = nextConfig
