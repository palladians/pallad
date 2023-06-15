import 'dotenv/config'
console.log(process.env.VITE_APP_DEV_SERVER)

import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'xyz.pallad.app',
  appName: 'Pallad',
  webDir: 'dist',
  server: {
    url: process.env.VITE_APP_DEV_SERVER,
    androidScheme: 'https'
  }
}

export default config
