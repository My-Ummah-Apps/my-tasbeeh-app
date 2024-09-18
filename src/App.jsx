import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import { Keyboard } from "@capacitor/keyboard";
import { StatusBar, Style } from "@capacitor/status-bar";
import { LocalNotifications } from "@capacitor/local-notifications";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";
import { Toast } from "@capacitor/toast";
import { Dialog } from "@capacitor/dialog";
import { Sheet } from "react-modal-sheet";
import { v4 as uuidv4 } from "uuid";
import { direction } from "direction";

import NavBar from "./components/NavBar";
import Main from "./pages/MainPage";
import CountersPage from "./pages/CountersPage";
import SettingsPage from "./pages/SettingsPage";
import { changeLogs, LATEST_APP_VERSION } from "./utils/changelog";
import SheetCloseBtn from "./components/SheetCloseBtn";
// import { Purchases } from "@awesome-cordova-plugins/purchases";
// import { Purchases } from "cordova-plugin-purchase";

window.addEventListener("DOMContentLoaded", () => {
  if (Capacitor.isNativePlatform()) {
    // STATUS BAR FUNCTIONALITY

    const setStatusBarStyleDark = async () => {
      await StatusBar.setStyle({ style: Style.Dark });
    };

    const setStatusBarStyleLight = async () => {
      await StatusBar.setStyle({ style: Style.Light });
    };

    let statusBarThemeColor;
    if (localStorage.getItem("theme") == null) {
      localStorage.setItem("theme", JSON.stringify("light"));
      setStatusBarStyleLight();
      statusBarThemeColor = "#EDEDED";
    } else if (JSON.parse(localStorage.getItem("theme")) == "dark") {
      setStatusBarStyleDark();
      statusBarThemeColor = "#242424";
      document.body.classList.add("dark");
    } else if (JSON.parse(localStorage.getItem("theme")) == "light") {
      setStatusBarStyleLight();
      statusBarThemeColor = "#EDEDED";
      document.body.classList.remove("dark");
    }

    setTimeout(() => {
      SplashScreen.hide({
        fadeOutDuration: 250,
      });
    }, 500);

    if (Capacitor.getPlatform() == "ios") {
      return;
    } else if (Capacitor.getPlatform() == "android") {
      setTimeout(() => {
        if (statusBarThemeColor == "#EDEDED") {
          StatusBar.setStyle({ style: Style.Light });
        } else if (statusBarThemeColor == "#242424") {
          StatusBar.setStyle({ style: Style.Dark });
        }
        StatusBar.setBackgroundColor({ color: statusBarThemeColor });
      }, 1000);
    }
  }
});

let scheduleMorningNotifications;
let scheduleAfternoonNotification;
let scheduleEveningNotification;

if (Capacitor.isNativePlatform()) {
  // LocalNotifications.createChannel({
  //   id: "1",
  //   name: "Notification",
  //   description: "General Notification",
  // });

  scheduleMorningNotifications = async () => {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Morning Reminder",
          body: `"Therefore remember Me. I will remember you." (Quran 2:152)`,
          id: 1,
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
  scheduleAfternoonNotification = async () => {
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
  scheduleEveningNotification = async () => {
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
}

let lastUsedCounterIndex;
let counterName;
let currentCount;
let counterId;
let defaultArray;

function App() {
  const [showChangelogModal, setShowChangelogModal] = useState(false);
  // const [iapProducts, setIapProducts] = useState(null);
  // document.addEventListener("deviceready", onDeviceReady, false);

  // function onDeviceReady() {
  //   Purchases.setDebugLogsEnabled(true);

  //   if (Capacitor.getPlatform() === "ios") {
  //     Purchases.configureWith({
  //       apiKey: process.env.REACT_APP_APPLE_APIKEY,
  //     });
  //   } else if (Capacitor.getPlatform() === "android") {
  //     Purchases.configureWith({
  //       apiKey: process.env.REACT_APP_GOOGLE_APIKEY,
  //     });
  //   }
  // }

  useEffect(() => {
    if (
      localStorage.getItem("localSavedCountersArray") &&
      localStorage.getItem("appVersion") !== LATEST_APP_VERSION
    ) {
      setShowChangelogModal(true);
      localStorage.setItem("appVersion", LATEST_APP_VERSION);
    }
  }, []);

  if (Capacitor.getPlatform() === "ios") {
    Keyboard.setAccessoryBarVisible({ isVisible: true });
  }

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

  // const productsArray = [
  //   process.env.REACT_APP_ST,
  //   process.env.REACT_APP_MT,
  //   process.env.REACT_APP_LT,
  //   process.env.REACT_APP_XLT,
  // ];

  // useEffect(() => {
  //   if (Capacitor.isNativePlatform()) {
  //     (async () => {
  //       const fetchedProducts = await Purchases.getProducts(
  //         productsArray,
  //         "inapp"
  //       );
  //       fetchedProducts.sort(function (a, b) {
  //         return a.price - b.price;
  //       });
  //       setIapProducts(fetchedProducts);
  //     })();

  //     return () => {
  //       // Not required right now, but if needed this will get called when the component unmounts
  //     };
  //   }
  // }, []);

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
    if (Capacitor.isNativePlatform()) {
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
    }
  }, [morningNotification]);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
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
    }
  }, [afternoonNotification]);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
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
    }
  }, [eveningNotification]);

  const [localSavedCountersArray, setLocalSavedCountersArray] = useState([]);
  const [activeCounterName, setActiveCounterName] = useState("");
  const [languageDirection, setLanguageDirection] = useState("");
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
      // ! TODO: The below if else statement has been duplicated in the CounterNameAndNumber component for a quick workaround due to text scrolling in the wrong direction if this function wasn't triggered (ie, the user launched the app which would land them on the homescreen), this duplication needs to be resolved in the future
      if (direction(counterName) === "ltr") {
        setLanguageDirection("ltr");
      } else if (direction(counterName) === "rtl") {
        setLanguageDirection("rtl");
      }
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

  const showOneCounterNeededAlert = async () => {
    await Dialog.alert({
      title: "Unable to delete Tasbeeh",
      message: "Atleast one tasbeeh must exist",
    });
  };

  const deleteSingleCounter = (id) => {
    // e.preventDefault();
    const showCounterDeleteToast = async () => {
      await Toast.show({
        text: "Tasbeeh deleted",
        position: "top",
        duration: "short",
      });
    };

    const filteredArray = localSavedCountersArray.filter(
      (counterItem) => counterItem.id !== id
    );
    if (filteredArray.length == 0) {
      // alert("Atleast one counter must be saved");
      showOneCounterNeededAlert();
      return;
    }
    if (filteredArray.length > 0) {
      filteredArray[0].isActive = true;
      setActiveCounterNumber(filteredArray[0].count);
      showCounterDeleteToast();
    }

    setLocalSavedCountersArray(filteredArray);
    saveArrayLocally(filteredArray);
  };

  return (
    <>
      <BrowserRouter>
        <section className="App">
          <Routes>
            <Route
              path="SettingsPage"
              element={
                <SettingsPage
                  // iapProducts={iapProducts}
                  resetAllCounters={resetAllCounters}
                  setMorningNotification={setMorningNotification}
                  morningNotification={morningNotification}
                  afternoonNotification={afternoonNotification}
                  setAfternoonNotification={setAfternoonNotification}
                  eveningNotification={eveningNotification}
                  setEveningNotification={setEveningNotification}
                  modalStyles={modalStyles}
                  setHaptics={setHaptics}
                  haptics={haptics}
                  setDailyCounterReset={setDailyCounterReset}
                  dailyCounterReset={dailyCounterReset}
                  activeBackgroundColor={activeBackgroundColor}
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
                  setLanguageDirection={setLanguageDirection}
                  languageDirection={languageDirection}
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
          <NavBar
            activeBackgroundColor={activeBackgroundColor}
            setActivePage={setActivePage}
            activePage={activePage}
          />
        </section>
      </BrowserRouter>
      <Sheet
        disableDrag={true}
        isOpen={showChangelogModal}
        onClose={() => setShowChangelogModal(false)}
        detent="full-height"
        tweenConfig={{ ease: "easeOut", duration: 0.3 }}
      >
        <Sheet.Container>
          {/* <Sheet.Header /> */}
          <Sheet.Content className="sheet-changelog">
            <h1>Whats new?</h1>
            {changeLogs.map((item) => (
              <section key={item} className="changelog-content-wrap">
                {/* <p>v{item.versionNum}</p> */}
                <p>
                  {item.versionNum === LATEST_APP_VERSION
                    ? `v${item.versionNum} - Latest Version`
                    : `v${item.versionNum}`}
                </p>
                {item.changes.map((item) => (
                  <section
                    key={item.heading}
                    // style={{ border: `1px solid ${activeBackgroundColor}` }}
                    className="changelog-individual-change-wrap"
                  >
                    <h2>{item.heading}</h2>
                    <p>{item.text}</p>
                  </section>
                ))}
              </section>
            ))}
            <button
              onClick={() => setShowChangelogModal(false)}
              className="sheet-changelog-close-btn"
            >
              Close
            </button>
            {/* <SheetCloseBtn closeModalState={setShowChangelogModal} /> */}
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop
          // style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          onTap={() => setShowChangelogModal(false)}
        />
      </Sheet>
    </>
  );
}

export default App;
