import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Keyboard } from "@capacitor/keyboard";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";
import { Sheet } from "react-modal-sheet";
import { v4 as uuidv4 } from "uuid";
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
import { counterObjType, languageDirection, themeType } from "./utils/types";

function App() {
  const [showChangelogModal, setShowChangelogModal] = useState(false);
  const [activeCounter, setActiveCounter] = useState<counterObjType>({
    counter: "",
    count: 0,
    target: 0,
    color: "",
    isActive: false,
    id: "",
  });

  const [countersArr, setCountersArr] = useState<counterObjType[]>([]);
  const [languageDirection, setLanguageDirection] =
    useState<languageDirection>(null);
  const [haptics, setHaptics] = useState<boolean | null>(null);
  const [dailyCounterReset, setDailyCounterReset] = useState(false);
  const [theme, setTheme] = useState<themeType | null>(null);

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
        setTheme("light");
      }

      if (storedTheme === "dark") {
        statusBarThemeColor = "#242424";
        setTheme("dark");
        if (Capacitor.isNativePlatform()) {
          setStatusAndNavBarBackgroundColor(statusBarThemeColor, Style.Dark);
        }
        document.body.classList.add("dark");
      } else if (storedTheme === "light") {
        statusBarThemeColor = "#EDEDED";
        setTheme("light");
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
    const storedLaunchCount = localStorage.getItem("launch-count");
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

  useEffect(() => {
    if (
      Capacitor.isNativePlatform() &&
      localStorage.getItem("haptics") === null
    ) {
      localStorage.setItem("haptics", JSON.stringify(true));
      setHaptics(true);
    }
  }, []);

  useEffect(() => {
    setDailyCounterReset(
      JSON.parse(localStorage.getItem("dailyCounterReset") || "false")
    );

    let counters: counterObjType[] = [];
    const storedCounters = JSON.parse(
      localStorage.getItem("localSavedCountersArray") || "[]"
    );

    if (storedCounters && storedCounters.length > 0) {
      const previousLaunchDate = localStorage.getItem("lastLaunchDate");
      const todaysDate = new Date().toLocaleDateString();
      // const todaysDate = "20/05/2025";
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
    setAndStoreCounters(updatedCountersArr);
  };

  const resetSingleCounter = async (id: string) => {
    const updatedCountersArr = countersArr.map((counter) => {
      return counter.id === id ? { ...counter, count: 0 } : { ...counter };
    });
    setAndStoreCounters(updatedCountersArr);
  };

  const resetAllCounters = () => {
    const resettedCounters = countersArr.map((counter: counterObjType) => ({
      ...counter,
      count: 0,
    }));

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

  const deleteSingleCounter = (id: string) => {
    const remainingCounters = countersArr.filter(
      (counter) => counter.id !== id
    );
    if (remainingCounters.length === 0) {
      showerAlert(
        "Unable to delete Tasbeeh",
        "At least one tasbeeh must exist"
      );
      return;
    }

    const updatedCountersArr: counterObjType[] = remainingCounters.map(
      (counter, i) => ({
        ...counter,
        isActive: activeCounter.id === id && i === 0 ? true : counter.isActive,
      })
    );

    showToast("Tasbeeh deleted", "top", "short");
    setAndStoreCounters(updatedCountersArr);
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
                  setHaptics={setHaptics}
                  haptics={haptics}
                  setDailyCounterReset={setDailyCounterReset}
                  dailyCounterReset={dailyCounterReset}
                  setTheme={setTheme}
                  theme={theme}
                />
              }
            />
            <Route
              index
              element={
                <HomePage
                  activeCounter={activeCounter}
                  resetSingleCounter={resetSingleCounter}
                  setAndStoreCounters={setAndStoreCounters}
                  countersArr={countersArr}
                  setHaptics={setHaptics}
                  haptics={haptics}
                  setLanguageDirection={setLanguageDirection}
                  languageDirection={languageDirection}
                />
              }
            />
            <Route
              path="CountersPage"
              element={
                <CountersPage
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
          <NavBar activeCounterColor={activeCounter.color} />
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
