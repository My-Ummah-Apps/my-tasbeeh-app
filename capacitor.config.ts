import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tasbeeh.my',
  appName: 'My Tasbeeh App',
  webDir: 'build', 
  bundledWebRuntime: false,
  server: {
    "hostname": "192.168.242.129:3000",
    "cleartext": true
  }
};

export default config;