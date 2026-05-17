import type { CapacitorConfig } from '@capacitor/cli';
import { appMetadata } from './src/config/appMetadata';

const config: CapacitorConfig = {
  appId: appMetadata.packageName,
  appName: appMetadata.name,
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
