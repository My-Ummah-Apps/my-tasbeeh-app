import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle, Keyboard } from '@capacitor/keyboard';



const config: CapacitorConfig = {
  appId: 'com.tasbeeh.my',
  appName: 'My Tasbeeh App',
  webDir: 'build', 
  bundledWebRuntime: false,

  plugins: {
    Keyboard: {
      // resize: KeyboardResize.Native,
      "resizeOnFullScreen": true
      
    },
    // LocalNotifications: {
    //   smallIcon: "logo192",
    //   iconColor: "#488AFF",
    //   sound: "beep.wav"
    // }
    
  },

  



  // "ios": {
  //   "contentInset": "always"
  // }




};

Keyboard.setScroll({isDisabled: false})

export default config;