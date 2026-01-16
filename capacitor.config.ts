import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.186d864ee91349fa9010cd4e6f158ae0',
  appName: 'vorli',
  webDir: 'dist',
  server: {
    url: 'https://186d864e-e913-49fa-9010-cd4e6f158ae0.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    // Allow microphone permissions
    allowMixedContent: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#1a1a2e",
      showSpinner: false
    }
  }
};

export default config;
