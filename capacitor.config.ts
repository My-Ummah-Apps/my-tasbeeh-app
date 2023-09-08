import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, Keyboard } from '@capacitor/keyboard';



const config: CapacitorConfig = {
  appId: 'com.tasbeeh.my',
  appName: 'My Tasbeeh App',
  webDir: 'build', 
  bundledWebRuntime: false,

  plugins: {
    Keyboard: {
      resize: KeyboardResize.Native,
      resizeOnFullScreen: true
    },
    LocalNotifications: {
      smallIcon: "res:///ic_stat_five",
      // iconColor: "#ff000",
      // sound: "beep.wav"
    }
    
  },

  // "ios": {
  //   "contentInset": "always"
  // }




};

Keyboard.setScroll({isDisabled: false})
Keyboard.setAccessoryBarVisible({isVisible: true})
// Keyboard.setScroll({isDisabled: true})

export default config;