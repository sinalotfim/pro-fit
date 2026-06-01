import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sinalotfi.profit',
  appName: 'Pro Fit',
  webDir: 'www',
  // Allows http:// dev server when `server.url` is set (e.g. `npm run ios:live`).
  server: {
    cleartext: true,
  },
};

export default config;
