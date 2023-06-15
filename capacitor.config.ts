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
    
  },



  // "ios": {
  //   "contentInset": "always"
  // }




};

Keyboard.setScroll({isDisabled: false})

export default config;