import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Keyboard } from "@capacitor/keyboard";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";
import { Sheet } from "react-modal-sheet";
import { v4 as uuidv4 } from "uuid";
import {
  assertValidDBResult,
  DEFAULT_COUNTERS,
  dictPreferencesDefaultValues,
  materialColors,
  setStatusAndNavBarBackgroundColor,
  showerAlert,
  showToast,
  tween_config,
} from "./utils/constants";
import { InAppReview } from "@capacitor-community/in-app-review";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import CountersPage from "./pages/CountersPage";
import SettingsPage from "./pages/SettingsPage";
import { changeLogs, LATEST_APP_VERSION } from "./utils/changelog";
import {
  counterObjType,
  languageDirection,
  MaterialColor,
  PreferenceObjType,
  PreferenceType,
  themeType,
  userPreferencesType,
} from "./utils/types";

// localStorage.setItem("theme", "\"dark\"");
// localStorage.setItem("afternoon-notification", "true");
// localStorage.setItem("lastLaunchDate", "02/06/2025");
// localStorage.setItem("evening-notification", "true");
// localStorage.setItem("haptics", "false");
// localStorage.setItem("localSavedCountersArray", "[{\"counter\":\"Alhumdulillah\",\"count\":0,\"isActive\":true,\"target\":50,\"id\":\"372d741c-27a8-4f6f-a53a-847c3c7b29d7\"},{\"counter\":\"Subhanallah\",\"count\":0,\"isActive\":false,\"target\":50,\"id\":\"cf1dd17c-9b8b-44ad-bf11-171b71610d40\"},{\"counter\":\"Allahu-Akbar\",\"count\":0,\"isActive\":false,\"target\":50,\"id\":\"095717f8-524d-440e-b1b6-e53f65da5b9f\"},{\"counter\":\"Astagfirullah\",\"count\":0,\"isActive\":false,\"target\":50,\"id\":\"f1cb3c53-b9aa-4d4a-aadf-f239a834a20c\"},{\"counter\":\"Subhan-Allahi wa bihamdihi, Subhan-Allahil-Azim\",\"count\":0,\"isActive\":false,\"target\":50,\"id\":\"2d9d35e7-0f65-48a0-a1de-106eccc02bba\"},{\"counter\":\"La hawla wa la quwwata illa billah\",\"count\":0,\"isActive\":false,\"target\":50,\"id\":\"6b9830f7-86cc-45b2-a7e7-f8c3ea9b9511\"},{\"counter\":\"La ilaha illallah\",\"count\":0,\"isActive\":false,\"target\":50,\"id\":\"2fce9b90-3e6e-402d-97c9-733cd3980460\"},{\"counter\":\"Subhan-Allahi wa bihamdih\",\"count\":0,\"isActive\":false,\"target\":50,\"id\":\"7c85aee5-84f3-484f-a8cf-2700218baf0e\"}]");
// localStorage.setItem("morning-notification", "true");
// localStorage.setItem("launch-count", "764");
// localStorage.setItem("appVersion", "2.5");
// localStorage.setItem("activeColor", "#AB47BC");

import { AnimatePresence } from "framer-motion";
import useSQLiteDB from "./utils/useSqliteDB";

function App() {
  const {
    isDatabaseInitialised,
    sqliteConnection,
    dbConnection,
    checkAndOpenOrCloseDBConnection,
  } = useSQLiteDB();

  const [showChangelogModal, setShowChangelogModal] = useState(false);
  const [activeCounter, setActiveCounter] = useState<counterObjType>({
    counterName: "",
    count: 0,
    target: 0,
    // color: materialColors[0],
    isActive: 0,
    id: "",
  });

  const [countersArr, setCountersArr] = useState<counterObjType[]>([]);
  const [languageDirection, setLanguageDirection] =
    useState<languageDirection>("neutral");
  const [haptics, setHaptics] = useState<boolean | null>(null);
  const [dailyCounterReset, setDailyCounterReset] = useState(false);
  const [theme, setTheme] = useState<themeType | null>(null);
  const [activeColor, setActiveColor] = useState<MaterialColor>(
    materialColors[0]
  );
  const [userPreferences, setUserPreferences] = useState<userPreferencesType>(
    dictPreferencesDefaultValues
  );

  const initiateDefaultPrefsAndCounters = async () => {
    const params = Object.keys(dictPreferencesDefaultValues)
      .map((key) => {
        const value =
          dictPreferencesDefaultValues[key as keyof userPreferencesType];
        return [key, Array.isArray(value) ? value.join(",") : value];
      })
      .flat();

    const placeholders = Array(params.length / 2)
      .fill("(?, ?)")
      .join(", ");

    const insertQuery = `
        INSERT INTO userPreferencesTable (preferenceName, preferenceValue) 
        VALUES ${placeholders};
        `;

    await dbConnection.current?.run(insertQuery, params);

    for (let i = 0; i < DEFAULT_COUNTERS.length; i++) {
      const counterObj = DEFAULT_COUNTERS[i];
      const isActive = counterObj.isActive === 1 ? 1 : 0;

      const insertQuery = `INSERT into counterDataTable(orderIndex, counterName, count, target, color, isActive) VALUES (?, ?, ?, ?, ?, ?)`;

      await dbConnection.current?.run(insertQuery, [
        i,
        counterObj.counterName,
        counterObj.count,
        counterObj.target,
        null,
        isActive,
      ]);
    }
  };

  const setAndStoreCounters = async (arr: counterObjType[]) => {
    console.log("arr: ", arr);
    setCountersArr(arr);
    const activeCounter =
      arr.find((counter) => counter.isActive === 1) ?? arr[0];
    setActiveCounter(activeCounter);

    // try {
    //   await checkAndOpenOrCloseDBConnection("open");

    //   for (let i = 0; i < arr.length; i++) {
    //     const counterObj = arr[i];
    //     const isActive = counterObj.isActive === 1 ? 1 : 0;

    //     const insertQuery = `INSERT into counterDataTable(orderIndex, counterName, count, target, color, isActive) VALUES (?, ?, ?, ?, ?, ?)`;

    //     await dbConnection.current?.run(insertQuery, [
    //       i,
    //       counterObj.counterName,
    //       counterObj.count,
    //       counterObj.target,
    //       null,
    //       isActive,
    //     ]);
    //   }
    // } catch (error) {
    // } finally {
    //   await checkAndOpenOrCloseDBConnection("close");
    //   setCountersArr(arr);
    //   const activeCounter =
    //     arr.find((counter) => counter.isActive === 1) ?? arr[0];
    //   console.log("ACTIVE COUNTER IS: ", activeCounter);
    //   setActiveCounter(activeCounter);
    // }
  };

  useEffect(() => {
    const initialiseApp = async () => {
      const splash_hide_delay = 500;
      const android_style_delay = 1000;
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
        }, android_style_delay);
      }

      if (Capacitor.isNativePlatform()) {
        setTimeout(() => {
          SplashScreen.hide({
            fadeOutDuration: 250,
          });
        }, splash_hide_delay);
      }

      if (isDatabaseInitialised === true) {
        const initialiseAndLoadData = async () => {
          await fetchDataFromDB();
        };
        initialiseAndLoadData();
        setTimeout(async () => {
          await SplashScreen.hide({ fadeOutDuration: 250 });
        }, 500);
      }
    };

    initialiseApp();
  }, [isDatabaseInitialised]);

  const fetchDataFromDB = async (isDBImported?: boolean) => {
    try {
      //   if (isDBImported) {
      //   await modifyDataInUserPreferencesTable("isExistingUser", "1");
      // }
      await checkAndOpenOrCloseDBConnection("open");

      let DBResultPreferences = await dbConnection.current?.query(
        `SELECT * FROM userPreferencesTable`
      );

      let DBResultAllCounterData = await dbConnection.current?.query(
        `SELECT * FROM counterDataTable`
      );

      console.log(
        "DBResultPreferences upon app start are: ",
        DBResultPreferences
      );

      assertValidDBResult(DBResultPreferences, "DBResultPreferences");
      assertValidDBResult(DBResultAllCounterData, "DBResultAllCounterData");

      if (DBResultPreferences.values.length === 0) {
        console.log("New user, initiating default preferences and counters");
        await initiateDefaultPrefsAndCounters();
      }

      DBResultPreferences = await dbConnection.current?.query(
        `SELECT * FROM userPreferencesTable`
      );

      DBResultAllCounterData = await dbConnection.current?.query(
        `SELECT * FROM counterDataTable`
      );

      console.log(
        "DBResultPreferences after preferences have been set: ",
        DBResultPreferences
      );

      assertValidDBResult(DBResultPreferences, "DBResultPreferences");
      assertValidDBResult(DBResultAllCounterData, "DBResultAllCounterData");

      await handleUserPreferencesDataFromDB(
        DBResultPreferences.values as PreferenceObjType[]
      );
      await handleCounterDataFromDB(DBResultAllCounterData);
    } catch (error) {
      console.error(error);
    } finally {
      await modifyDataInUserPreferencesTable("isExistingUser", 1);
    }
  };

  const handleUserPreferencesDataFromDB = async (
    DBResultPreferences: PreferenceObjType[]
  ) => {
    console.log("Existing user, Preferences are: ", DBResultPreferences);

    DBResultPreferences.forEach((item) => {
      if (typeof item.preferenceValue !== "number") {
        item.preferenceValue = Number(item.preferenceValue);
      }
    });

    const assignPreference = async (
      preference: PreferenceType
    ): Promise<void> => {
      const preferenceQuery = DBResultPreferences.find(
        (row) => row.preferenceName === preference
      );

      if (preferenceQuery) {
        const prefName = preferenceQuery.preferenceName;
        const prefValue = preferenceQuery.preferenceValue;

        setUserPreferences((userPreferences: userPreferencesType) => ({
          ...userPreferences,
          [prefName]: prefValue,
        }));
      } else {
        await modifyDataInUserPreferencesTable(
          preference,
          dictPreferencesDefaultValues[preference]
        );
      }
    };

    const batchAssignPreferences = async () => {
      for (const key of Object.keys(dictPreferencesDefaultValues)) {
        await assignPreference(key as keyof userPreferencesType);
      }
    };

    await batchAssignPreferences();
  };

  const handleCounterDataFromDB = async (DBResultAllCounterData) => {
    console.log(
      "DBResultAllCounterData.values: ",
      DBResultAllCounterData.values
    );

    DBResultAllCounterData.values.forEach((item) => {
      console.log("before assignment: ", typeof item.isActive);
      item.isActive = Number(item.isActive);
      console.log("after assignment: ", typeof item.isActive);
    });
    await setAndStoreCounters(DBResultAllCounterData.values);
  };

  useEffect(() => {
    console.log("preference state: ", userPreferences);
  }, [userPreferences]);

  const modifyDataInUserPreferencesTable = async (
    preferenceName: PreferenceType,
    preferenceValue: number
  ) => {
    try {
      await checkAndOpenOrCloseDBConnection("open");
      const query = `INSERT OR REPLACE INTO userPreferencesTable (preferenceName, preferenceValue) VALUES (?, ?)`;
      await dbConnection.current?.run(query, [preferenceName, preferenceValue]);

      setUserPreferences((userPreferences: userPreferencesType) => ({
        ...userPreferences,
        [preferenceName]: preferenceValue,
      }));
    } catch (error) {
      console.log(`ERROR ENTERING ${preferenceName} into DB`);
      console.error(error);
    } finally {
      await checkAndOpenOrCloseDBConnection("close");
    }
  };

  useEffect(() => {
    const storedActiveColor: any = localStorage.getItem("activeColor");
    if (storedActiveColor) {
      setActiveColor(storedActiveColor);
    } else if (!storedActiveColor) {
      setActiveColor(materialColors[0]);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("appVersion") !== LATEST_APP_VERSION) {
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
    // localStorage.setItem("launch-count", JSON.stringify(launchCount));
    modifyDataInUserPreferencesTable("launchcount", launchCount);

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
    const haptics = localStorage.getItem("haptics");

    if (Capacitor.isNativePlatform()) {
      if (haptics === null) {
        localStorage.setItem("haptics", JSON.stringify(true));
        setHaptics(true);
      } else if (haptics) {
        setHaptics(haptics === "false" ? false : true);
      }
    }
  }, []);

  // useEffect(() => {
  //   const resetAllCounters = JSON.parse(
  //     localStorage.getItem("dailyCounterReset") || "false"
  //   );
  //   setDailyCounterReset(resetAllCounters);

  //   let counters: counterObjType[] = [];
  //   const storedCounters = JSON.parse(
  //     localStorage.getItem("localSavedCountersArray") || "[]"
  //   );

  //   setAndStoreCounters(counters);
  // }, []);

  const resetSingleCounter = async (id: string) => {
    const updatedCountersArr = countersArr.map((counter) => {
      return counter.id === id ? { ...counter, count: 0 } : { ...counter };
    });
    setAndStoreCounters(updatedCountersArr);
  };

  const resetAllCounters = async () => {
    const resettedCounters = countersArr.map((counter: counterObjType) => ({
      ...counter,
      count: 0,
    }));
    await setAndStoreCounters(resettedCounters);
  };

  const addCounter = async (counterToAdd: string, target: number) => {
    const newCounter: counterObjType = {
      counterName: counterToAdd,
      count: 0,
      isActive: 0,
      target,
      id: uuidv4(),
    };
    const updatedCountersArr = [...countersArr, newCounter];
    await setAndStoreCounters(updatedCountersArr);
    const index = updatedCountersArr.length;
    try {
      await checkAndOpenOrCloseDBConnection("open");
      const insertQuery = `INSERT into counterDataTable(orderIndex, counterName, count, target, color, isActive) VALUES (?, ?, ?, ?, ?, ?)`;
      await dbConnection.current?.run(insertQuery, [
        index,
        counterToAdd,
        0,
        target,
        null,
        0,
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      await checkAndOpenOrCloseDBConnection("close");
    }
  };

  const modifyCounter = async (
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
    try {
      await checkAndOpenOrCloseDBConnection("open");
      // ! COntiNUE FROM HERE
      const query = `UPDATE counterDataTable 
      SET counterName = ?
      SET count = ?
      target = ?
      WHERE id = ?`;

      await dbConnection.current.run(query, [
        modifiedCounterName,
        modifiedCount,
        modifiedTarget,
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      await checkAndOpenOrCloseDBConnection("close");
    }

    await setAndStoreCounters(updatedCountersArr);
  };

  const deleteSingleCounter = async (id: string) => {
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
        isActive: activeCounter.id === id && i === 0 ? 1 : counter.isActive,
      })
    );

    showToast("Tasbeeh deleted", "top", "short");
    await setAndStoreCounters(updatedCountersArr);
  };

  return (
    <>
      <BrowserRouter>
        <section className="App">
          <AnimatePresence>
            <Routes>
              <Route
                path="SettingsPage"
                element={
                  <SettingsPage
                    // iapProducts={iapProducts}
                    activeColor={activeColor}
                    activeCounter={activeCounter}
                    resetAllCounters={resetAllCounters}
                    setHaptics={setHaptics}
                    haptics={haptics}
                    setDailyCounterReset={setDailyCounterReset}
                    dailyCounterReset={dailyCounterReset}
                    setTheme={setTheme}
                    theme={theme}
                    setShowChangelogModal={setShowChangelogModal}
                  />
                }
              />
              <Route
                index
                element={
                  <HomePage
                    activeColor={activeColor}
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
                    activeColor={activeColor}
                    setActiveColor={setActiveColor}
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
          </AnimatePresence>
          <NavBar activeColor={activeColor} />
        </section>
      </BrowserRouter>
      <Sheet
        disableDrag
        isOpen={showChangelogModal}
        onClose={() => setShowChangelogModal(false)}
        detent="full-height"
        tweenConfig={tween_config}
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
