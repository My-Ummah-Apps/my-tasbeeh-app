import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Keyboard } from "@capacitor/keyboard";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";
import { Sheet } from "react-modal-sheet";

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
  PreferenceKeyType,
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
// localStorage.setItem("dailyCounterReset", "false");

import { AnimatePresence } from "framer-motion";
import useSQLiteDB from "./utils/useSqliteDB";
import { DBSQLiteValues } from "@capacitor-community/sqlite";

function App() {
  const {
    isDBInitialised,
    sqliteConnection,
    dbConnection,
    toggleDBConnection,
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

  const [countersState, setCountersState] = useState<counterObjType[]>([]);
  const [languageDirection, setLanguageDirection] =
    useState<languageDirection>("neutral");
  const [haptics, setHaptics] = useState<boolean | null>(null);
  const [dailyCounterReset, setDailyCounterReset] = useState<0 | 1>(0);
  const [theme, setTheme] = useState<themeType | null>(null);
  const [activeColor, setActiveColor] = useState<MaterialColor>(
    materialColors[0]
  );
  const [userPreferencesState, setUserPreferencesState] =
    useState<userPreferencesType>(dictPreferencesDefaultValues);

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

    const insertStmnt = `
        INSERT INTO userPreferencesTable (preferenceName, preferenceValue) 
        VALUES ${placeholders};
        `;

    await dbConnection.current?.run(insertStmnt, params);

    for (let i = 0; i < DEFAULT_COUNTERS.length; i++) {
      const counterObj = DEFAULT_COUNTERS[i];
      const isActive = counterObj.isActive === 1 ? 1 : 0;

      const insertStmnt = `INSERT into counterDataTable(orderIndex, counterName, count, target, color, isActive) VALUES (?, ?, ?, ?, ?, ?)`;

      await dbConnection.current?.run(insertStmnt, [
        i,
        counterObj.counterName,
        counterObj.count,
        counterObj.target,
        null,
        isActive,
      ]);
    }
  };

  const updateCountersState = async (arr: counterObjType[]) => {
    setCountersState(arr);
    const activeCounter =
      arr.find((counter) => counter.isActive === 1) ?? arr[0];
    setActiveCounter(activeCounter);
  };

  const initialiseAppUI = async () => {
    const splash_hide_delay = 500;
    const android_style_delay = 1000;
    let statusBarThemeColor: string;

    const storedTheme = userPreferencesState.theme;
    console.log("storedTheme: ", storedTheme);

    if (storedTheme === "dark") {
      statusBarThemeColor = "#242424";
      // setTheme("dark");
      if (Capacitor.isNativePlatform()) {
        setStatusAndNavBarBackgroundColor(statusBarThemeColor, Style.Dark);
      }
      document.body.classList.add("dark");
    } else if (storedTheme === "light") {
      statusBarThemeColor = "#EDEDED";
      // setTheme("light");
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

    setTimeout(async () => {
      await SplashScreen.hide({ fadeOutDuration: 250 });
    }, 500);
  };

  useEffect(() => {
    const initialiseApp = async () => {
      if (isDBInitialised === true) {
        const initialiseAndLoadData = async () => {
          await fetchDataFromDB();
        };
        initialiseAndLoadData();
      }
    };

    initialiseApp();
  }, [isDBInitialised]);

  const fetchDataFromDB = async (isDBImported?: boolean) => {
    try {
      //   if (isDBImported) {
      //   await updateUserPreference("isExistingUser", "1");
      // }
      await toggleDBConnection("open");

      let DBResultPreferences = await dbConnection.current?.query(
        `SELECT * FROM userPreferencesTable`
      );

      let DBResultAllCounterData = await dbConnection.current?.query(
        `SELECT * FROM counterDataTable`
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
      await initialiseAppUI();
    } catch (error) {
      console.error(error);
    } finally {
      await updateUserPreference("isExistingUser", 1);
    }
  };

  const handleUserPreferencesDataFromDB = async (
    DBResultPreferences: PreferenceObjType[]
  ) => {
    console.log("Existing user, Preferences are: ", DBResultPreferences);

    DBResultPreferences.forEach((item) => {
      if (
        item.preferenceValue === "0" ||
        item.preferenceValue === "1" ||
        item.preferenceName === "appLaunchCount"
      ) {
        (item as { preferenceValue: number }).preferenceValue = Number(
          item.preferenceValue
        );
      }
    });

    const assignPreference = async (
      preference: PreferenceKeyType
    ): Promise<void> => {
      const preferenceQuery = DBResultPreferences.find(
        (row) => row.preferenceName === preference
      );

      if (preferenceQuery) {
        const prefName = preferenceQuery.preferenceName;
        const prefValue = preferenceQuery.preferenceValue;

        setUserPreferencesState((userPreferences: userPreferencesType) => ({
          ...userPreferences,
          [prefName]: prefValue,
        }));
      } else {
        await updateUserPreference(
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

  useEffect(() => {
    setActiveColor(userPreferencesState.activeColor);
  }, [userPreferencesState.activeColor]);

  useEffect(() => {
    setTheme(userPreferencesState.theme);
    console.log("theme is: ", userPreferencesState.theme);
  }, [userPreferencesState.theme]);

  const handleCounterDataFromDB = async (
    DBResultAllCounterData: DBSQLiteValues
  ) => {
    const countersFromDB = DBResultAllCounterData.values as Array<
      Record<string, any>
    >;

    const counters: counterObjType[] = countersFromDB.map(
      (item): counterObjType => ({
        id: Number(item.id),
        orderIndex: Number(item.index),
        counterName: item.counterName,
        count: Number(item.count),
        target: Number(item.target),
        color: item.color,
        isActive: Number(item.isActive) as 0 | 1,
      })
    );

    await updateCountersState(counters);
  };

  const updateUserPreference = async (
    preferenceName: PreferenceKeyType,
    preferenceValue: number | MaterialColor | themeType
  ) => {
    try {
      await toggleDBConnection("open");
      const query = `INSERT OR REPLACE INTO userPreferencesTable (preferenceName, preferenceValue) VALUES (?, ?)`;
      await dbConnection.current?.run(query, [preferenceName, preferenceValue]);

      setUserPreferencesState((userPreferences: userPreferencesType) => ({
        ...userPreferences,
        [preferenceName]: preferenceValue,
      }));
    } catch (error) {
      console.error(`ERROR ENTERING ${preferenceName} into DB`);
    } finally {
      await toggleDBConnection("close");
    }
  };

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
    const storedLaunchCount = userPreferencesState.appLaunchCount;
    let launchCount = storedLaunchCount ? Number(storedLaunchCount) : 0;
    launchCount++;
    // localStorage.setItem("launch-count", JSON.stringify(launchCount));
    updateUserPreference("appLaunchCount", launchCount);

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
    const haptics = userPreferencesState.haptics;

    if (Capacitor.isNativePlatform()) {
      setHaptics(haptics === 0 ? false : true);
    }
  }, [userPreferencesState.haptics]);

  useEffect(() => {
    const dailyCounterReset = async () => {
      await resetAllCounters();
    };
    // dailyCounterReset();

    setDailyCounterReset(userPreferencesState.dailyCounterReset);
  }, []);

  const resetSingleCounter = async (id: number) => {
    try {
      await toggleDBConnection("open");
      const resetCounterQuery = `UPDATE counterDataTable SET count = ? WHERE id = ?`;
      await dbConnection.current?.run(resetCounterQuery, [0, id]);

      const updatedCountersArr = countersState.map((counter) => {
        return counter.id === id ? { ...counter, count: 0 } : counter;
      });
      await updateCountersState(updatedCountersArr);
    } catch (error) {
      console.error("Error resetting single counter: ", error);
    } finally {
      await toggleDBConnection("close");
    }
  };

  const resetAllCounters = async () => {
    try {
      await toggleDBConnection("open");

      const resetCountersQuery = `UPDATE counterDataTable SET count = 0`;
      await dbConnection.current?.run(resetCountersQuery);

      const resettedCounters = countersState.map((counter) => ({
        ...counter,
        count: 0,
      }));
      await updateCountersState(resettedCounters);
    } catch (error) {
      console.error("Error resetting all counters: ", error);
    } finally {
      await toggleDBConnection("close");
    }
  };

  const addCounter = async (newCounterName: string, target: number) => {
    try {
      await toggleDBConnection("open");

      const maxOrderIndexResult = await dbConnection.current?.query(
        `SELECT MAX(orderIndex) AS maxOrderIndex FROM counterDataTable`
      );
      const maxOrderIndex =
        maxOrderIndexResult?.values?.[0].maxOrderIndex ?? -1;
      const newOrderIndex = maxOrderIndex + 1;

      const insertQuery = `INSERT into counterDataTable(orderIndex, counterName, count, target, color, isActive) VALUES (?, ?, ?, ?, ?, ?)`;
      const insertResult = await dbConnection.current?.run(insertQuery, [
        newOrderIndex,
        newCounterName,
        0,
        target,
        null,
        0,
      ]);

      const lastId = insertResult?.changes?.lastId;

      if (!lastId) {
        throw new Error("result is null");
      }

      const newCounter: counterObjType = {
        id: lastId,
        orderIndex: newOrderIndex,
        counterName: newCounterName,
        count: 0,
        target,
        color: null,
        isActive: 0,
      };
      const updatedCountersArr = [...countersState, newCounter];

      await updateCountersState(updatedCountersArr);
    } catch (error) {
      console.error("Failed to add counter: ", error);
    } finally {
      await toggleDBConnection("close");
    }
  };

  const modifyCounter = async (
    id: number,
    modifiedCounterName: string,
    modifiedCount: number,
    modifiedTarget: number
  ) => {
    try {
      await toggleDBConnection("open");

      const updateCounterQuery = `UPDATE counterDataTable 
      SET counterName = ?,
      count = ?,
      target = ?
      WHERE id = ?`;

      await dbConnection.current?.run(updateCounterQuery, [
        modifiedCounterName,
        modifiedCount,
        modifiedTarget,
        id,
      ]);
    } catch (error) {
      console.error("error modifying counter: ", error);
    } finally {
      await toggleDBConnection("close");
    }

    const updatedCountersArr = countersState.map((counterItem) => {
      return counterItem.id === id
        ? ({
            ...counterItem,
            counterName: modifiedCounterName,
            count: modifiedCount,
            target: modifiedTarget,
          } satisfies counterObjType)
        : counterItem;
    });

    await updateCountersState(updatedCountersArr);
  };

  const deleteSingleCounter = async (id: number) => {
    const remainingCounters = countersState.filter(
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

    try {
      await toggleDBConnection("open");
      const deleteQuery = `DELETE FROM counterDataTable WHERE id = ?`;
      await dbConnection.current?.run(deleteQuery, [id]);
      showToast("Tasbeeh deleted", "top", "short");
      await updateCountersState(updatedCountersArr);
    } catch (error) {
      console.error("Error deleting counter: ", error);
    } finally {
      await toggleDBConnection("close");
    }
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
                    updateUserPreference={updateUserPreference}
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
                    dbConnection={dbConnection}
                    toggleDBConnection={toggleDBConnection}
                    activeColor={activeColor}
                    activeCounter={activeCounter}
                    resetSingleCounter={resetSingleCounter}
                    updateCountersState={updateCountersState}
                    countersArr={countersState}
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
                    dbConnection={dbConnection}
                    toggleDBConnection={toggleDBConnection}
                    updateUserPreference={updateUserPreference}
                    activeColor={activeColor}
                    setActiveColor={setActiveColor}
                    activeCounter={activeCounter}
                    countersState={countersState}
                    modifyCounter={modifyCounter}
                    updateCountersState={updateCountersState}
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
