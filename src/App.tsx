import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Keyboard } from "@capacitor/keyboard";
import { StatusBar, Style } from "@capacitor/status-bar";
import { LocalNotifications } from "@capacitor/local-notifications";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";
import { Dialog } from "@capacitor/dialog";
import { Sheet } from "react-modal-sheet";
import { v4 as uuidv4 } from "uuid";
import { direction } from "direction";
import {
  DEFAULT_COUNTERS,
  setStatusAndNavBarBackgroundColor,
  showerAlert,
  showToast,
  TWEEN_CONFIG,
} from "./utils/constants";
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

// LocalNotifications.createChannel({
//   id: "1",
//   name: "Notification",
//   description: "General Notification",
// });

function App() {
  const [showChangelogModal, setShowChangelogModal] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [activeCounter, setActiveCounter] = useState<counterObjType>({
    counter: "",
    count: 0,
    target: 0,
    color: "",
    isActive: false,
    id: "",
  });
  const [morningNotification, setMorningNotification] = useState(false);
  const [afternoonNotification, setAfternoonNotification] = useState(false);
  const [eveningNotification, setEveningNotification] = useState(false);
  const [countersArr, setCountersArr] = useState<counterObjType[]>([]);
  const [languageDirection, setLanguageDirection] = useState("");
  const [haptics, setHaptics] = useState<boolean | null>(
    JSON.parse(localStorage.getItem("haptics") || "null")
  );
  const [dailyCounterReset, setDailyCounterReset] = useState(false);
  const [lastLaunchDate, setLastLaunchDate] = useState("");

  const setAndStoreCounters = (arr: counterObjType[]) => {
    localStorage.setItem("localSavedCountersArray", JSON.stringify(arr));
    setCountersArr(arr);
    const activeCounter = arr.find((counter) => counter.isActive === true);
    setActiveCounter(activeCounter ?? { ...DEFAULT_COUNTERS[0] });
  };

  useEffect(() => {
    const initialiseApp = async () => {
      const SPLASH_HIDE_DELAY = 500;
      const ANDROID_STYLE_DELAY = 1000;
      let statusBarThemeColor: string;
      const themeString = localStorage.getItem("theme");
      let storedTheme: themeType | null = themeString
        ? JSON.parse(themeString)
        : null;

      if (storedTheme === null) {
        localStorage.setItem("theme", JSON.stringify("light"));
        storedTheme = "light";
      }

      if (storedTheme === "dark") {
        statusBarThemeColor = "#242424";
        if (Capacitor.isNativePlatform()) {
          setStatusAndNavBarBackgroundColor(statusBarThemeColor, Style.Dark);
        }
        document.body.classList.add("dark");
      } else if (storedTheme === "light") {
        statusBarThemeColor = "#EDEDED";
        if (Capacitor.isNativePlatform()) {
          setStatusAndNavBarBackgroundColor(statusBarThemeColor, Style.Light);
        }
        document.body.classList.remove("dark");
      }

      if (Capacitor.getPlatform() === "android") {
        setTimeout(() => {
          if (statusBarThemeColor === "#EDEDED") {
            StatusBar.setStyle({ style: Style.Light });
          } else if (statusBarThemeColor === "#242424") {
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

  // const notifications = [
  //   {
  //     morningNotification: {
  //       storageKey: "morning-notification",
  //       id: 1,
  //       title: "Morning Reminder",
  //       body: `"Therefore remember Me. I will remember you." (Quran 2:152)`,
  //       hour: 8,
  //       minute: 0,
  //       setState: setMorningNotification,
  //     },
  //   },
  //   {
  //     afternoonNotification: {
  //       storageKey: "afternoon-notification",
  //       id: 2,
  //       title: "Afternoon Reminder",
  //       body: `“And remember Allah much, that you may be successful." (Quran 62:10)`,
  //       hour: 14,
  //       minute: 0,
  //       setState: setAfternoonNotification,
  //     },
  //   },
  //   {
  //     eveningNotification: {
  //       storageKey: "evening-notification",
  //       id: 3,
  //       title: "Evening Reminder",
  //       body: `"And the remembrance of Allah is greater." (Quran 29:45)`,
  //       hour: 19,
  //       minute: 0,
  //       setState: setEveningNotification,
  //     },
  //   },
  // ];

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
      localStorage.getItem("haptics") === null &&
      Capacitor.isNativePlatform()
    ) {
      localStorage.setItem("haptics", JSON.stringify(true));
      setHaptics(true);
    }

    if (localStorage.getItem("dailyCounterReset") === null) {
      localStorage.setItem("dailyCounterReset", JSON.stringify(false));
      setDailyCounterReset(false);
    }
  }, []);

  useEffect(() => {
    let counters: counterObjType[] = [];
    const storedCounters = JSON.parse(
      localStorage.getItem("localSavedCountersArray") || "[]"
    );

    if (storedCounters && storedCounters.length > 0) {
      const previousLaunchDate = localStorage.getItem("lastLaunchDate");
      const todaysDate = new Date().toLocaleDateString();
      setLastLaunchDate(todaysDate);
      localStorage.setItem("lastLaunchDate", todaysDate);

      if (previousLaunchDate !== todaysDate && dailyCounterReset === true) {
        counters = storedCounters.map((counterItem: counterObjType) => ({
          ...counterItem,
          count: 0,
        }));
      } else {
        counters = storedCounters;
      }
    } else if (!storedCounters || storedCounters.length === 0) {
      counters = [...DEFAULT_COUNTERS];
      setAndStoreCounters(counters);
      localStorage.setItem("appVersion", LATEST_APP_VERSION);
    }

    setAndStoreCounters(counters);
  }, []);

  const addCounter = (counterToAdd: string, target: number) => {
    const newCounter: counterObjType = {
      counter: counterToAdd,
      count: 0,
      color: "",
      isActive: false,
      target,
      id: uuidv4(),
    };
    const updatedCountersArr = [...countersArr, newCounter];
    // ! Below may not be required, test and remove if needed
    if (updatedCountersArr.length === 1) {
      newCounter.isActive = true;
      // setActiveCounter((prev) => ({ ...prev, count: 0 }));
    }
    setAndStoreCounters(updatedCountersArr);
  };

  const resetAllCounters = () => {
    const resettedCounters = JSON.parse(
      localStorage.getItem("localSavedCountersArray")
    ).map((counter) => ({ ...counter, count: 0 }));

    setAndStoreCounters(resettedCounters);
  };

  const modifyCounter = (
    id: string,
    modifiedCounterName: string,
    modifiedCount: number,
    modifiedTarget: number
  ) => {
    const updatedCountersArr = countersArr.map((counterItem) => {
      return counterItem.id === id
        ? {
            ...counterItem,
            counter: modifiedCounterName,
            count: modifiedCount,
            target: modifiedTarget,
          }
        : { ...counterItem };
    });

    setAndStoreCounters(updatedCountersArr);
  };

  const resetSingleCounter = async (id: string) => {
    const updatedCountersArr = countersArr.map((counter) => {
      if (counter.id === id) {
        return { ...counter, count: 0 };
      }
      return { ...counter };
    });
    setAndStoreCounters(updatedCountersArr);
  };

  const deleteSingleCounter = (id: number) => {
    const filteredArray = countersArr.filter(
      (counterItem) => counterItem.id !== id
    );
    if (filteredArray.length === 0) {
      showerAlert("Unable to delete Tasbeeh", "Atleast one tasbeeh must exist");
      return;
    }
    if (filteredArray.length > 0) {
      filteredArray[0].isActive = true;
      setActiveCounter((prev) => ({ ...prev, count: filteredArray[0].count }));
      showToast("Tasbeeh deleted", "top", "short");
    }

    setAndStoreCounters(filteredArray);
  };

  useEffect(() => {
    console.log("COUNRERS ARR IN APP.TSX: ", countersArr);
  }, [countersArr]);

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
                  activeCounter={activeCounter}
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
                />
              }
            />
            <Route
              index
              element={
                <HomePage
                  setActiveCounter={setActiveCounter}
                  activeCounter={activeCounter}
                  setAndStoreCounters={setAndStoreCounters}
                  countersArr={countersArr}
                  setHaptics={setHaptics}
                  haptics={haptics}
                  setLanguageDirection={setLanguageDirection}
                  languageDirection={languageDirection}
                  resetSingleCounter={resetSingleCounter}
                />
              }
            />
            <Route
              path="CountersPage"
              element={
                <CountersPage
                  setActivePage={setActivePage}
                  activeCounter={activeCounter}
                  countersArr={countersArr}
                  modifyCounter={modifyCounter}
                  setAndStoreCounters={setAndStoreCounters}
                  addCounter={addCounter}
                  deleteSingleCounter={deleteSingleCounter}
                />
              }
            />
          </Routes>
          <NavBar
            activeCounterColor={activeCounter.color}
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
