import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Device } from "@capacitor/device";
import { LocalNotifications } from "@capacitor/local-notifications";
import { SplashScreen } from "@capacitor/splash-screen";

import { v4 as uuidv4 } from "uuid";

import NavBar from "./components/NavBar";

import Main from "./pages/MainPage";
import CountersPage from "./pages/CountersPage";
import SettingsPage from "./pages/SettingsPage";

import { Purchases } from "@awesome-cordova-plugins/purchases";
// import { Purchases } from "cordova-plugin-purchase";

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    SplashScreen.hide({
      fadeOutDuration: 250,
    });
  }, 500);
});

LocalNotifications.createChannel({
  id: "1",
  name: "Notification",
  description: "General Notification",
});

const scheduleMorningNotifications = async () => {
  await LocalNotifications.schedule({
    notifications: [
      {
        title: "Morning Reminder",
        body: `"Therefore remember Me. I will remember you." (Quran 2:152)`,
        id: 2,
        schedule: {
          on: { hour: 7, minute: 0 }, // THIS WORKS ON IOS
          allowWhileIdle: true,
          foreground: true, // iOS only
          repeats: true,
        },
      },
    ],
  });
};
const scheduleAfternoonNotification = async () => {
  await LocalNotifications.schedule({
    notifications: [
      {
        title: "Afternoon Reminder",
        body: `“And remember Allah much, that you may be successful." (Quran 62:10)`,
        id: 3,
        schedule: {
          allowWhileIdle: true,
          foreground: true, // iOS only
          on: { hour: 14, minute: 0 }, // THIS WORKS ON IOS
          repeats: true,
        },
      },
    ],
  });
};
const scheduleEveningNotification = async () => {
  await LocalNotifications.schedule({
    notifications: [
      {
        title: "Evening Reminder",
        body: `"And the remembrance of Allah is greater." (Quran 29:45)`,
        id: 4,
        schedule: {
          allowWhileIdle: true,
          foreground: true, // iOS only
          on: { hour: 19, minute: 0 }, // THIS WORKS ON IOS
          repeats: true,
        },
      },
    ],
  });
};

// STATUS BAR FUNCTIONALITY
const setStatusBarStyleDark = async () => {
  await StatusBar.setStyle({ style: Style.Dark });
};

const setStatusBarStyleLight = async () => {
  await StatusBar.setStyle({ style: Style.Light });
};

let lastUsedCounterIndex;
let counterName;
let currentCount;
let counterId;
let defaultArray;

function App() {
  const [iapProducts, setIapProducts] = useState(null);
  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {
    // if (device == "android") {
    //   console.log("DEVICE IS ANDROID SETTINGS STATUS BAR COLOR TO WHITE");
    //   StatusBar.setBackgroundColor({ color: "#EDEDED" });
    // }
    // console.log("ONDEVICEREADY FIRED");
    // const checkDevice = async () => {
    //   const info = await Device.getInfo();
    //   if (info.operatingSystem == "ios") {
    //   }
    //   if (info.operatingSystem == "android") {
    //     StatusBar.setOverlaysWebView({ overlay: true });
    //   }
    // };
    // checkDevice();

    Purchases.setDebugLogsEnabled(true);

    if (window.cordova.platformId === "ios") {
      Purchases.configureWith({
        apiKey: process.env.REACT_APP_APPLE_APIKEY,
      });
    } else if (window.cordova.platformId === "android") {
      Purchases.configureWith({
        apiKey: process.env.REACT_APP_GOOGLE_APIKEY,
      });
    }
  }

  const productsArray = [
    process.env.REACT_APP_ST,
    process.env.REACT_APP_MT,
    process.env.REACT_APP_LT,
    process.env.REACT_APP_XLT,
  ];

  useEffect(() => {
    (async () => {
      const fetchedProducts = await Purchases.getProducts(
        productsArray,
        "inapp"
      );
      fetchedProducts.sort(function (a, b) {
        return a.price - b.price;
      });
      setIapProducts(fetchedProducts);
    })();

    return () => {
      // Not required right now, but if needed this will get called when the component unmounts
    };
  }, []);

  const materialColors = [
    "#EF5350",
    "#EC407A",
    "#AB47BC",
    "#7E57C2",
    "#5C6BC0",
    "#42A5F5",
    "#29B6F6",
    "#26C6DA",
    "#26A69A",
    "#66BB6A",
    "#9CCC65",
    "#FF7043",
  ];
  const [activePage, setActivePage] = useState("home");
  const [device, setDevice] = useState("");
  const logDeviceInfo = async () => {
    const info = await Device.getInfo();

    if (info.operatingSystem == "ios") {
      setDevice("ios");
    } else if (info.operatingSystem == "android") {
      setDevice("android");
    }
  };

  useEffect(() => {
    logDeviceInfo();
  }, []);

  const [morningNotification, setMorningNotification] = useState(
    JSON.parse(localStorage.getItem("morning-notification"))
  );

  const [afternoonNotification, setAfternoonNotification] = useState(
    JSON.parse(localStorage.getItem("afternoon-notification"))
  );

  const [eveningNotification, setEveningNotification] = useState(
    JSON.parse(localStorage.getItem("evening-notification"))
  );

  const [reviewPrompt, showReviewPrompt] = useState(false);

  useEffect(() => {
    let launchCount = localStorage.getItem("launch-count");
    if (launchCount > 14) {
      launchCount = 0;
    } else if (launchCount == null) {
      launchCount = 1;
    } else if (launchCount != null) {
      let launchCountNumber = Number(launchCount);
      launchCount = launchCountNumber + 1;
    }
    localStorage.setItem("launch-count", JSON.stringify(launchCount));

    if (launchCount == 3 || launchCount == 8 || launchCount == 14) {
      showReviewPrompt(true);
    }
  }, []);

  useEffect(() => {
    if (
      localStorage.getItem("morning-notification") == null ||
      localStorage.getItem("morning-notification") == "false"
    ) {
      localStorage.setItem("morning-notification", JSON.stringify(false));
      setMorningNotification(false);
      LocalNotifications.cancel({ notifications: [{ id: 2 }] });
    } else if (localStorage.getItem("morning-notification") == "true") {
      localStorage.setItem("morning-notification", JSON.stringify(true));
      setMorningNotification(true);
      scheduleMorningNotifications();
    }
  }, [morningNotification]);

  useEffect(() => {
    if (
      localStorage.getItem("afternoon-notification") == null ||
      localStorage.getItem("afternoon-notification") == "false"
    ) {
      localStorage.setItem("afternoon-notification", JSON.stringify(false));
      setAfternoonNotification(false);
      LocalNotifications.cancel({ notifications: [{ id: 3 }] });
    } else if (localStorage.getItem("afternoon-notification") == "true") {
      localStorage.setItem("afternoon-notification", JSON.stringify(true));
      setAfternoonNotification(true);
      scheduleAfternoonNotification();
    }
  }, [afternoonNotification]);

  useEffect(() => {
    if (
      localStorage.getItem("evening-notification") == null ||
      localStorage.getItem("evening-notification") == "false"
    ) {
      localStorage.setItem("evening-notification", JSON.stringify(false));
      setEveningNotification(false);
      LocalNotifications.cancel({ notifications: [{ id: 4 }] });
    } else if (localStorage.getItem("evening-notification") == "true") {
      localStorage.setItem("evening-notification", JSON.stringify(true));
      setEveningNotification(true);
      scheduleEveningNotification();
    }
  }, [eveningNotification]);

  const [localSavedCountersArray, setLocalSavedCountersArray] = useState([]);
  const [activeCounterName, setActiveCounterName] = useState("");
  const [activeCounterNumber, setActiveCounterNumber] = useState(0);
  const [activeBackgroundColor, setActiveBackgroundColor] = useState("");

  const saveArrayLocally = (arrayToSave) => {
    localStorage.setItem(
      "localSavedCountersArray",
      JSON.stringify(arrayToSave)
    );
  };

  const [haptics, setHaptics] = useState(
    JSON.parse(localStorage.getItem("haptics"))
  );

  const [dailyCounterReset, setDailyCounterReset] = useState(
    JSON.parse(localStorage.getItem("dailyCounterReset"))
  );

  const [theme, setTheme] = useState(JSON.parse(localStorage.getItem("theme")));

  const [modalStyles, setModalStyles] = useState({
    overlay: {
      backgroundColor: "rgba(53, 53, 53, 0.75)",
      boxShadow: "none",
    },
    content: {
      backgroundColor: "rgba(53, 53, 53, 0.75)",
      boxShadow: "none",
    },
  });

  // // DARK MODE FUNCTIONALITY
  // // Use matchMedia to check the user preference
  // const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  // toggleDarkTheme(prefersDark.matches);

  // // Listen for changes to the prefers-color-scheme media query
  // prefersDark.addEventListener("change", (mediaQuery) =>
  //   toggleDarkTheme(mediaQuery.matches)
  // );

  // Add or remove the "dark" class based on if the media query matches
  // function toggleDarkTheme(shouldAdd) {
  //   document.body.classList.toggle("dark", shouldAdd);
  //   console.log(shouldAdd);
  // }

  // let prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  // let prefersDark;

  useEffect(() => {
    console.log("CHECKING LOCAL STORAGE THEME...");
    // prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    if (localStorage.getItem("theme") == null) {
      localStorage.setItem("theme", JSON.stringify("light"));
      setTheme("light");
      StatusBar.setBackgroundColor({ color: "#EDEDED" });
      if (device == "android") {
        // StatusBar.setBackgroundColor({ color: "#EDEDED" });
        // setStatusBarStyleLight();
      }
    }

    // System theme functionality removed for now until bugs are fixed
    // if (JSON.parse(localStorage.getItem("theme")) == "system") {
    //   // Use matchMedia to check the user preference

    //   console.log("prefersDark value is:");
    //   console.log(prefersDark);

    //   prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    //   // Add or remove the "dark" class based on if the media query matches
    //   function toggleDarkTheme(boolean) {
    //     if (boolean == true) {
    //       console.log("boolean true");
    //       document.body.classList.add("dark");
    //       // StatusBar.setStyle({ style: Style.Light });
    //     } else if (boolean == false) {
    //       console.log("boolean false");
    //       document.body.classList.remove("dark");
    //       // StatusBar.setStyle({ style: Style.Dark });
    //     }
    //   }

    //   // Listen for changes to the prefers-color-scheme media query
    //   prefersDark.addEventListener("change", (mediaQuery) => {
    //     console.log("mediaQuery is:");
    //     console.log(mediaQuery.matches);
    //     return toggleDarkTheme(mediaQuery.matches);
    //   });

    //   toggleDarkTheme(prefersDark.matches);

    //   console.log("useEffect has run, system theme selected");
    // }
    else if (JSON.parse(localStorage.getItem("theme")) == "dark") {
      console.log("STORED THEME IS DARK!");
      setStatusBarStyleDark();
      setTheme("dark");
      StatusBar.setBackgroundColor({ color: "#242424" });
      if (device == "android") {
        // StatusBar.setBackgroundColor({ color: "#242424" });
      }

      document.body.classList.add("dark");

      setModalStyles({
        overlay: {
          backgroundColor: "rgba(53, 53, 53, 0.75)",
        },
        content: {
          backgroundColor: "rgba(53, 53, 53, 0.75)",
        },
      });
    } else if (JSON.parse(localStorage.getItem("theme")) == "light") {
      console.log("STORED THEME IS LIGHT!");
      setStatusBarStyleLight();
      setTheme("light");
      StatusBar.setBackgroundColor({ color: "#EDEDED" });
      if (device == "android") {
        console.log("DEVICE IS ANDROID SETTINGS STATUS BAR COLOR TO WHITE");
        // StatusBar.setBackgroundColor({ color: "#EDEDED" });
      }

      document.body.classList.remove("dark");

      setModalStyles({
        overlay: {
          backgroundColor: "rgba(98, 98, 98, 0.75)",
        },
        content: {
          backgroundColor: "rgba(98, 98, 98, 0.75)",
        },
      });
    }
  }, [theme]);

  const [lastLaunchDate, setLastLaunchDate] = useState(null);

  useEffect(() => {
    const storedDate = localStorage.getItem("lastLaunchDate");
    const currentDate = new Date().toLocaleDateString();

    if (storedDate !== currentDate && dailyCounterReset == true) {
      // Reset variable or perform any other actions
      resetAllCounters();
    }

    setLastLaunchDate(currentDate);
    localStorage.setItem("lastLaunchDate", currentDate);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("haptics") == null) {
      localStorage.setItem("haptics", JSON.stringify(true));
      setHaptics(true);
    }

    if (localStorage.getItem("dailyCounterReset") == null) {
      localStorage.setItem("dailyCounterReset", JSON.stringify(false));
      setDailyCounterReset(false);
    }
  });

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("localSavedCountersArray")) &&
      JSON.parse(localStorage.getItem("localSavedCountersArray")).length > 0
    ) {
      defaultArray = JSON.parse(
        localStorage.getItem("localSavedCountersArray")
      );
    } else if (
      !localStorage.getItem("localSavedCountersArray") ||
      JSON.parse(localStorage.getItem("localSavedCountersArray")).length == 0
    ) {
      defaultArray = [
        {
          counter: "Alhumdulillah",
          count: 0,
          color: "#EF5350",
          isActive: true,
          target: 50,
          id: uuidv4(),
        },

        {
          counter: "Subhanallah",
          count: 0,
          color: "#EC407A",
          isActive: false,
          target: 50,
          id: uuidv4(),
        },

        {
          counter: "Allahu-Akbar",
          count: 0,
          color: "AB47BC",
          isActive: false,
          target: 50,
          id: uuidv4(),
        },

        {
          counter: "Astagfirullah",
          count: 0,
          color: "7E57C2",
          isActive: false,
          target: 50,
          id: uuidv4(),
        },
        {
          counter: "Subhan-Allahi wa bihamdihi, Subhan-Allahil-Azim",
          count: 0,
          color: "5C6BC0",
          isActive: false,
          target: 50,
          id: uuidv4(),
        },
        {
          counter: "La hawla wa la quwwata illa billah",
          count: 0,
          color: "29B6F6",
          isActive: false,
          target: 50,
          id: uuidv4(),
        },
        {
          counter: "La ilaha illallah",
          count: 0,
          color: "26C6DA",
          isActive: false,
          target: 50,
          id: uuidv4(),
        },
        {
          counter: "Subhan-Allahi wa bihamdihi, Subhan-Allahil-Azim",
          count: 0,
          color: "26A69A",
          isActive: false,
          target: 50,
          id: uuidv4(),
        },
        {
          counter: "Subhan-Allahi wa bihamdih",
          count: 0,
          color: "66BB6A",
          isActive: false,
          target: 50,
          id: uuidv4(),
        },
      ];

      saveArrayLocally(defaultArray);
    }

    defaultArray.findIndex((object) => {
      if (object.isActive == true) {
        lastUsedCounterIndex = defaultArray.indexOf(object);

        setActiveCounterName(defaultArray[lastUsedCounterIndex].counter);
        setActiveCounterNumber(defaultArray[lastUsedCounterIndex].count);
        setActiveBackgroundColor(defaultArray[lastUsedCounterIndex].color);
      } else {
        lastUsedCounterIndex = 0;
      }
    });

    setLocalSavedCountersArray(defaultArray);
    saveArrayLocally(defaultArray);
  }, []);
  const addItemToSavedCountersArray = () => {};

  const addCounter = (counterToAdd, target) => {
    const newCounter = {
      counter: counterToAdd,
      count: 0,
      isActive: false,
      target: target,
      id: uuidv4(),
    };
    const newArray = [...localSavedCountersArray, newCounter];
    if (newArray.length == 1) {
      newCounter.isActive = true;
      setActiveCounterNumber(0);
    }
    setLocalSavedCountersArray(newArray);
    saveArrayLocally(newArray);
  };

  const resetAllCounters = () => {
    localSavedCountersArray.map((counterItem) => {
      counterItem.count = 0;
    });
    setLocalSavedCountersArray(localSavedCountersArray);
    saveArrayLocally(localSavedCountersArray);
    setActiveCounterNumber(0);
  };

  const modifyTheCountersArray = (
    id,
    modifiedCounterName,
    modifiedCount,
    modifiedTarget
  ) => {
    localSavedCountersArray.map((counterItem) => {
      if (counterItem.id == id && counterItem.isActive) {
        setActiveCounterNumber(Number(modifiedCount));
      }
      if (counterItem.id == id) {
        counterItem.counter = modifiedCounterName;
        counterItem.count = Number(modifiedCount);
        counterItem.target = Number(modifiedTarget);
      }
    });

    setLocalSavedCountersArray(localSavedCountersArray);
    saveArrayLocally(localSavedCountersArray);
  };

  const invokeSetActiveCounter = (id) => {
    localSavedCountersArray.map((counterItem) => {
      counterItem.isActive = false;

      if (counterItem.id == id) {
        counterItem.isActive = true;
        counterName = counterItem.counter;
        currentCount = counterItem.count;
        counterId = counterItem.id;
        setActiveBackgroundColor(counterItem.color);
      }
      saveArrayLocally(localSavedCountersArray);
      setActiveCounterName(counterName);
      setActiveCounterNumber(currentCount);
    });
  };

  const resetSingleCounter = (id) => {
    localSavedCountersArray.map((counterItem1) => {
      if (counterItem1.id == id) {
        counterItem1.count = 0;
        setActiveCounterNumber(0);
        setLocalSavedCountersArray(localSavedCountersArray);
      }
    });

    saveArrayLocally(localSavedCountersArray);
  };

  const deleteSingleCounter = (id) => {
    // e.preventDefault();
    const filteredArray = localSavedCountersArray.filter(
      (counterItem) => counterItem.id !== id
    );
    if (filteredArray.length == 0) {
      alert("Atleast one counter must be saved");
      return;
    }
    if (filteredArray.length > 0) {
      filteredArray[0].isActive = true;
      setActiveCounterNumber(filteredArray[0].count);
    }

    setLocalSavedCountersArray(filteredArray);
    saveArrayLocally(filteredArray);
  };

  return (
    <BrowserRouter>
      <section className="App">
        <Routes>
          <Route
            path="SettingsPage"
            element={
              <SettingsPage
                iapProducts={iapProducts}
                resetAllCounters={resetAllCounters}
                setMorningNotification={setMorningNotification}
                morningNotification={morningNotification}
                afternoonNotification={afternoonNotification}
                setAfternoonNotification={setAfternoonNotification}
                eveningNotification={eveningNotification}
                setEveningNotification={setEveningNotification}
                modalStyles={modalStyles}
                device={device}
                setHaptics={setHaptics}
                haptics={haptics}
                setDailyCounterReset={setDailyCounterReset}
                dailyCounterReset={dailyCounterReset}
                activeBackgroundColor={activeBackgroundColor}
                theme={theme}
                setTheme={setTheme}
              />
            }
          />
          <Route
            index
            element={
              <Main
                showReviewPrompt={showReviewPrompt}
                reviewPrompt={reviewPrompt}
                setHaptics={setHaptics}
                haptics={haptics}
                setActiveCounterName={setActiveCounterName}
                setActiveCounterNumber={setActiveCounterNumber}
                saveArrayLocally={saveArrayLocally}
                currentCount={currentCount}
                counterName={counterName}
                localSavedCountersArray={localSavedCountersArray}
                counterId={counterId}
                activeCounterName={activeCounterName}
                activeCounterNumber={activeCounterNumber}
                setActiveBackgroundColor={setActiveBackgroundColor}
                activeBackgroundColor={activeBackgroundColor}
                resetSingleCounter={resetSingleCounter}
              />
            }
          />
          <Route
            path="CountersPage"
            element={
              <CountersPage
                setActivePage={setActivePage}
                modalStyles={modalStyles}
                activeBackgroundColor={activeBackgroundColor}
                materialColors={materialColors}
                localSavedCountersArray={localSavedCountersArray}
                invokeSetActiveCounter={invokeSetActiveCounter}
                resetSingleCounter={resetSingleCounter}
                activeCounterName={activeCounterName}
                activeCounterNumber={activeCounterNumber}
                addItemToSavedCountersArray={addItemToSavedCountersArray}
                modifyTheCountersArray={modifyTheCountersArray}
                setLocalSavedCountersArray={setLocalSavedCountersArray}
                addCounter={addCounter}
                resetAllCounters={resetAllCounters}
                deleteSingleCounter={deleteSingleCounter}
              />
            }
          />
        </Routes>
      </section>

      <NavBar
        activeBackgroundColor={activeBackgroundColor}
        setActivePage={setActivePage}
        activePage={activePage}
      />
    </BrowserRouter>
  );
}

export default App;
