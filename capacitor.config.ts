import { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize, Keyboard } from "@capacitor/keyboard";
import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(__dirname, ".env") });

const isDevelopment = process.env.NODE_ENV === "development";

const config: CapacitorConfig = {
  appId: "com.tasbeeh.my",
  appName: "My Tasbeeh App",
  webDir: "dist",

  server: {
    // androidScheme: 'https',
    // url: isDevelopment ? process.env.VITE_DEV_SERVER_IP : undefined,
    // url: process.env.VITE_DEV_SERVER_IP,
    cleartext: true,
  },

  plugins: {
    Keyboard: {
      resize: KeyboardResize.None,
      resizeOnFullScreen: false,
      // resizeOnFullScreen: true, // This is a workaround for Android devices to stop the delete button from jumping up and down as the user switches between the alphabet keyboard and number keypad as both keyboards have different heights, without resizeOnFullScreen: true they push the delete button up and down
    },
    SystemBars: {
      insetsHandling: "disable",
    },
    LocalNotifications: {
      smallIcon: "res:///ic_statusbar_notification_icon",
    },
    SplashScreen: {
      launchAutoHide: false,
    },
    EdgeToEdge: {
      backgroundColor: "#ffffff",
    },
    CapacitorSQLite: {
      iosIsEncryption: false,
      iosKeychainPrefix: "my-tasbeeh-app-data",
      iosBiometric: {
        biometricAuth: false,
      },
      androidIsEncryption: false,
      androidBiometric: {
        biometricAuth: false,
      },
    },
  },
};

Keyboard.setAccessoryBarVisible({ isVisible: true });

export default config;
