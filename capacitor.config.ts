import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.skillsprint.app',
  appName: 'SkillSprint',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    // Custom plugins if needed
  }
};

export default config;
