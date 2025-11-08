import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.phonelunk.app',
  appName: 'Phone Lunk',
  webDir: 'out',
  server: {
    hostname: 'localhost',
    iosScheme: 'https',      // Critical for getUserMedia on iOS
    androidScheme: 'https'   // Ensures consistent behavior
  }
};

export default config;
