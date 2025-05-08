import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import { Keyboard } from "@capacitor/keyboard";
import { StatusBar, Style } from "@capacitor/status-bar";
// import { EdgeToEdge } from "@capawesome/capacitor-android-edge-to-edge-support";
import { LocalNotifications } from "@capacitor/local-notifications";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";
import { Toast } from "@capacitor/toast";
import { Dialog } from "@capacitor/dialog";
import { Sheet } from "react-modal-sheet";
import { v4 as uuidv4 } from "uuid";
import { direction } from "direction";
import { DEFAULT_COUNTERS, TWEEN_CONFIG } from "./utils/constants";
import { InAppReview } from "@capacitor-community/in-app-review";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import CountersPage from "./pages/CountersPage";
import SettingsPage from "./pages/SettingsPage";
import { changeLogs, LATEST_APP_VERSION } from "./utils/changelog";
import SheetCloseBtn from "./components/SheetCloseBtn";
import {
  counterObjType,
  InitialiseNotificationParams,
  NotificationParams,
  themeType,
} from "./utils/types";
// import { Purchases } from "@awesome-cordova-plugins/purchases";
// import { Purchases } from "cordova-plugin-purchase";

// LocalNotifications.createChannel({
//   id: "1",
//   name: "Notification",
//   description: "General Notification",
// });

let lastUsedCounterIndex;
let counterName;
let currentCount;
let counterId;
let defaultArray: singleCounterType[];

function App() {
  const [showChangelogModal, setShowChangelogModal] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [morningNotification, setMorningNotification] = useState(false);
  const [afternoonNotification, setAfternoonNotification] = useState(false);
  const [eveningNotification, setEveningNotification] = useState(false);
  const [reviewPrompt, showReviewPrompt] = useState(false);
  const [localSavedCountersArray, setLocalSavedCountersArray] = useState([]);
  const [activeCounterName, setActiveCounterName] = useState("");
  const [languageDirection, setLanguageDirection] = useState("");
  const [activeCounterNumber, setActiveCounterNumber] = useState(0);
  const [activeBackgroundColor, setActiveBackgroundColor] = useState("");
  const [haptics, setHaptics] = useState<boolean | null>(
    JSON.parse(localStorage.getItem("haptics") || "null")
  );
  const [dailyCounterReset, setDailyCounterReset] = useState(
    JSON.parse(localStorage.getItem("dailyCounterReset"))
  );
  const [lastLaunchDate, setLastLaunchDate] = useState(null);
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
    const initialiseApp = async () => {
      const SPLASH_HIDE_DELAY = 500;
      const ANDROID_STYLE_DELAY = 400;
      let statusBarThemeColor: string;
      const themeString = localStorage.getItem("theme");
      let storedTheme: themeType | null = themeString
        ? JSON.parse(themeString)
        : null;

      if (storedTheme === null) {
        localStorage.setItem("theme", JSON.stringify("light"));
        storedTheme = "light";
      }

      // const enable = async () => {
      //   await EdgeToEdge.enable();
      // };

      // if (Capacitor.isNativePlatform()) {
      //   await enable();
      // }

      // const insets = await EdgeToEdge.getInsets();
      // console.log("INSETS: ", insets);

      const setStatusAndNavBarBackgroundColor = async (
        backgroundColor: string,
        iconColor: Style
      ) => {
        // await EdgeToEdge.setBackgroundColor({ color: backgroundColor });
        await StatusBar.setStyle({ style: iconColor });
      };

      if (storedTheme === "dark") {
        statusBarThemeColor = "#242424";
        if (Capacitor.isNativePlatform()) {
          setStatusAndNavBarBackgroundColor("#D75B2A", Style.Dark);
          // setStatusAndNavBarBackgroundColor("#242424", Style.Dark);
        }
        document.body.classList.add("dark");
      } else if (storedTheme === "light") {
        statusBarThemeColor = "#EDEDED";
        if (Capacitor.isNativePlatform()) {
          // setStatusAndNavBarBackgroundColor("#EDEDED", Style.Light);
          setStatusAndNavBarBackgroundColor("#D75B2A", Style.Light);
        }
        document.body.classList.remove("dark");
      }

      if (Capacitor.getPlatform() === "android") {
        setTimeout(() => {
          if (statusBarThemeColor == "#EDEDED") {
            StatusBar.setStyle({ style: Style.Light });
          } else if (statusBarThemeColor == "#242424") {
            StatusBar.setStyle({ style: Style.Dark });
          }
        }, ANDROID_STYLE_DELAY);
      }

      if (Capacitor.isNativePlatform()) {
        setTimeout(() => {
          SplashScreen.hide({
            fadeOutDuration: 250,
          });
        }, SPLASH_HIDE_DELAY);
      }
    };

    initialiseApp();
  }, []);

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

  useEffect(() => {
    let storedLaunchCount = localStorage.getItem("launch-count");
    let launchCount = storedLaunchCount ? Number(storedLaunchCount) : 0;
    launchCount++;
    localStorage.setItem("launch-count", JSON.stringify(launchCount));

    const shouldTriggerReview =
      launchCount === 3 ||
      launchCount === 10 ||
      launchCount === 20 ||
      launchCount % 50 === 0;

    if (Capacitor.isNativePlatform() && shouldTriggerReview) {
      InAppReview.requestReview();
    }
  }, []);

  const scheduleNotification = async ({
    id,
    title,
    body,
    hour,
    minute,
  }: NotificationParams) => {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: body,
          id: id,
          schedule: {
            on: { hour: hour, minute: minute },
            allowWhileIdle: true,
            repeats: true,
          },
        },
      ],
    });
  };

  const intialiseNotification = async ({
    storageKey,
    id,
    title,
    body,
    hour,
    minute,
    setState,
  }: InitialiseNotificationParams) => {
    if (Capacitor.isNativePlatform()) {
      const notificationStatus = localStorage.getItem(storageKey);
      if (notificationStatus === null || notificationStatus === "false") {
        localStorage.setItem(storageKey, JSON.stringify(false));
        setState(false);
      } else if (notificationStatus === "true") {
        localStorage.setItem(storageKey, JSON.stringify(true));
        setState(true);

        await scheduleNotification({
          id: id,
          title: title,
          body: body,
          hour: hour,
          minute: minute,
        });
      }
    }
  };

  useEffect(() => {
    (async () => {
      await intialiseNotification({
        storageKey: "morning-notification",
        id: 1,
        title: "Morning Reminder",
        body: `"Therefore remember Me. I will remember you." (Quran 2:152)`,
        hour: 8,
        minute: 0,
        setState: setMorningNotification,
      });
    })();
  }, [morningNotification]);

  useEffect(() => {
    (async () => {
      await intialiseNotification({
        storageKey: "afternoon-notification",
        id: 2,
        title: "Afternoon Reminder",
        body: `“And remember Allah much, that you may be successful." (Quran 62:10)`,
        hour: 14,
        minute: 0,
        setState: setAfternoonNotification,
      });
    })();
  }, [afternoonNotification]);

  useEffect(() => {
    (async () => {
      await intialiseNotification({
        storageKey: "evening-notification",
        id: 3,
        title: "Evening Reminder",
        body: `"And the remembrance of Allah is greater." (Quran 29:45)`,
        hour: 19,
        minute: 0,
        setState: setEveningNotification,
      });
    })();
  }, [eveningNotification]);

  useEffect(() => {
    if (
      localStorage.getItem("haptics") == null &&
      Capacitor.isNativePlatform()
    ) {
      localStorage.setItem("haptics", JSON.stringify(true));
      setHaptics(true);
    }

    if (localStorage.getItem("dailyCounterReset") == null) {
      localStorage.setItem("dailyCounterReset", JSON.stringify(false));
      setDailyCounterReset(false);
    }
  });

  useEffect(() => {
    const storedCounters = localStorage.getItem("localSavedCountersArray");
    if (JSON.parse(storedCounters) && JSON.parse(storedCounters).length > 0) {
      // localStorage.setItem("lastLaunchDate", "19.09.2024");
      const previousLaunchDate = localStorage.getItem("lastLaunchDate");
      const todaysDate = new Date().toLocaleDateString();
      setLastLaunchDate(todaysDate);
      localStorage.setItem("lastLaunchDate", todaysDate);

      if (previousLaunchDate !== todaysDate && dailyCounterReset == true) {
        defaultArray = JSON.parse(storedCounters).map((counterItem) => ({
          ...counterItem,
          count: 0,
        }));
      } else {
        defaultArray = JSON.parse(storedCounters);
      }
    } else if (!storedCounters || JSON.parse(storedCounters).length == 0) {
      defaultArray = DEFAULT_COUNTERS;

      saveArrayLocally(defaultArray);
      localStorage.setItem("appVersion", LATEST_APP_VERSION);
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

  const saveArrayLocally = (arrayToSave) => {
    localStorage.setItem(
      "localSavedCountersArray",
      JSON.stringify(arrayToSave)
    );
  };

  const addCounter = (counterToAdd, target) => {
    const newCounter = {
      counter: counterToAdd,
      count: 0,
      isActive: false,
      target,
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
    const resettedCounters = JSON.parse(
      localStorage.getItem("localSavedCountersArray")
    ).map((counter) => ({ ...counter, count: 0 }));

    setLocalSavedCountersArray(resettedCounters);
    saveArrayLocally(resettedCounters);
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
                <HomePage
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
                  activeBackgroundColor={activeBackgroundColor}
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
        disableDrag
        isOpen={showChangelogModal}
        onClose={() => setShowChangelogModal(false)}
        detent="full-height"
        tweenConfig={TWEEN_CONFIG}
      >
        <Sheet.Container>
          {/* <Sheet.Header /> */}
          <Sheet.Content className="sheet-changelog">
            <h1>Whats new?</h1>
            {changeLogs.map((item, i) => (
              <section key={i} className="changelog-content-wrap">
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
