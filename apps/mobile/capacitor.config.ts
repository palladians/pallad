import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'xyz.pallad.app',
  appName: 'Pallad',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
