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
  setStatusAndNavBarBGColor,
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
  BinaryValue,
} from "./utils/types";

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
    name: "",
    count: 0,
    target: 0,
    color: materialColors[0],
    isActive: 0,
    id: "",
  });

  const [countersState, setCountersState] = useState<counterObjType[]>([]);
  const [languageDirection, setLanguageDirection] =
    useState<languageDirection>("neutral");
  const [theme, setTheme] = useState<themeType | null>(null);
  const [activeColor, setActiveColor] = useState<MaterialColor>(
    materialColors[0]
  );
  const [userPreferencesState, setUserPreferencesState] =
    useState<userPreferencesType>(dictPreferencesDefaultValues);

  const injectDummyData = () => {
    localStorage.setItem(
      "localSavedCountersArray",
      '[{"counter":"Counter 1","count":0,"isActive":true,"target":50,"id":"372d741c-27a8-4f6f-a53a-847c3c7b29d7"},{"counter":"Counter 2","count":0,"isActive":false,"target":50,"id":"cf1dd17c-9b8b-44ad-bf11-171b71610d40"},{"counter":"Counter 3","count":0,"isActive":false,"target":50,"id":"095717f8-524d-440e-b1b6-e53f65da5b9f"},{"counter":"Counter 4","count":0,"isActive":false,"target":50,"id":"f1cb3c53-b9aa-4d4a-aadf-f239a834a20c"},{"counter":"Counter 5","count":0,"isActive":false,"target":50,"id":"2d9d35e7-0f65-48a0-a1de-106eccc02bba"},{"counter":"Counter 6","count":0,"isActive":false,"target":50,"id":"6b9830f7-86cc-45b2-a7e7-f8c3ea9b9511"},{"counter":"Counter 7","count":0,"isActive":false,"target":50,"id":"2fce9b90-3e6e-402d-97c9-733cd3980460"},{"counter":"Counter 8","count":0,"isActive":false,"target":50,"id":"7c85aee5-84f3-484f-a8cf-2700218baf0e"}]'
    );
    localStorage.setItem("theme", '"dark"');
    localStorage.setItem("morning-notification", "true");
    localStorage.setItem("afternoon-notification", "true");
    localStorage.setItem("evening-notification", "true");
    localStorage.setItem("lastLaunchDate", "02/06/2025");
    localStorage.setItem("haptics", "false");
    localStorage.setItem("launch-count", "764");
    localStorage.setItem("appVersion", "2.5");
    localStorage.setItem("activeColor", "#AB47BC");
    localStorage.setItem("dailyCounterReset", "false");
  };

  // injectDummyData();

  const migrationToDB = async () => {
    try {
      await toggleDBConnection("open");

      // PREFERENCES MIGRATION

      const todaysDate = new Date().toLocaleDateString("en-CA");

      const theme =
        localStorage.getItem("theme") === "light" ? "light" : "dark";
      const morningNotification =
        localStorage.getItem("morning-notification") === "true" ? 1 : 0;
      const afternoonNotification =
        localStorage.getItem("afternoon-notification") === "true" ? 1 : 0;
      const eveningNotification =
        localStorage.getItem("evening-notification") === "true" ? 1 : 0;
      const lastLaunchDate =
        localStorage.getItem("lastLaunchDate") || todaysDate;
      const haptics = localStorage.getItem("haptics") === "true" ? 1 : 0;
      const launchCount = localStorage.getItem("launch-count") || 0;
      const appVersion = localStorage.getItem("appVersion") || "2.6";
      const activeColor =
        localStorage.getItem("activeColor") || DEFAULT_COUNTERS[0].color;
      const dailyCounterReset =
        localStorage.getItem("dailyCounterReset") === "true" ? 1 : 0;

      const prefs: userPreferencesType = {
        morningNotification: morningNotification,
        afternoonNotification: afternoonNotification,
        eveningNotification: eveningNotification,
        isExistingUser: 1,
        appLaunchCount: Number(launchCount),
        haptics: haptics,
        previousLaunchDate: lastLaunchDate,
        dailyCounterReset: dailyCounterReset,
        activeColor: activeColor,
        theme: theme,
      };

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

      // await dbConnection.current?.run(insertStmnt, params);

      // COUNTERS MIGRATION

      const countersArr: counterObjType[] = JSON.parse(
        localStorage.getItem("localSavedCountersArray")
      );
      console.log("LOCALSTORAGE COUNTERS: ", countersArr);

      for (let i = 0; i < countersArr.length; i++) {
        const counterObj = countersArr[i];
        console.log("counterObj: ", counterObj.counter);

        const isActive = counterObj.isActive === "true" ? 1 : 0;

        const insertStmnt = `INSERT OR IGNORE into counterDataTable(orderIndex, name, count, target, color, isActive) VALUES (?, ?, ?, ?, ?, ?)`;

        if (!dbConnection.current) {
          throw new Error("dbConnection.current does not exist");
        }

        await dbConnection.current.run(insertStmnt, [
          i,
          counterObj.counter,
          counterObj.count,
          counterObj.target,
          null,
          isActive,
        ]);
      }
    } catch (error) {
      console.error("Error migrating data: ", error);
    } finally {
      toggleDBConnection("close");
    }

    // localStorage.clear();
  };

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

      const insertStmnt = `INSERT into counterDataTable(orderIndex, name, count, target, color, isActive) VALUES (?, ?, ?, ?, ?, ?)`;

      await dbConnection.current?.run(insertStmnt, [
        i,
        counterObj.name,
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
        if (localStorage.getItem("localSavedCountersArray")) {
          await migrationToDB();
        }
        // const initialiseAndLoadData = async () => {
        await fetchDataFromDB();
        // };
        // initialiseAndLoadData();
      }
    };

    initialiseApp();
  }, [isDBInitialised]);

  const fetchDataFromDB = async (isDBImported?: boolean) => {
    try {
      //   if (isDBImported) {
      //   await updateUserPreference("isExistingUser", "1");
      // }
      console.log("fetchDataFromDB HAS RUN");

      await toggleDBConnection("open");

      let DBResultPreferences = await dbConnection.current!.query(
        `SELECT * FROM userPreferencesTable`
      );
      assertValidDBResult(DBResultPreferences, "DBResultPreferences");

      if (DBResultPreferences.values.length > 0) {
        const todaysDate = new Date().toLocaleDateString("en-CA");

        const dailyCounterResetPref: PreferenceObjType =
          DBResultPreferences.values.find(
            (item) => item.preferenceName === "dailyCounterReset"
          );

        const previousLaunchDatePref: PreferenceObjType =
          DBResultPreferences.values.find(
            (item) => item.preferenceName === "previousLaunchDate"
          );

        if (
          previousLaunchDatePref.preferenceValue !== todaysDate &&
          dailyCounterResetPref.preferenceValue === 1
        ) {
          const resetAllCountersStatement = `UPDATE counterDataTable SET count = 0`;
          await dbConnection.current!.run(resetAllCountersStatement);
        }

        const updatePreviousLaunchDateStatement = `
        UPDATE userPreferencesTable
        SET preferenceValue = ? 
        WHERE preferenceName = 'previousLaunchDate'`;
        await dbConnection.current!.run(updatePreviousLaunchDateStatement, [
          todaysDate,
        ]);
      }

      // let DBResultAllCounterData = await dbConnection.current!.query(
      //   `SELECT * FROM counterDataTable`
      // );

      if (DBResultPreferences.values.length === 0) {
        await initiateDefaultPrefsAndCounters();
      }

      DBResultPreferences = await dbConnection.current?.query(
        `SELECT * FROM userPreferencesTable`
      );

      const DBResultAllCounterData = await dbConnection.current?.query(
        `SELECT * FROM counterDataTable`
      );
      console.log("DBResultAllCounterData: ", DBResultAllCounterData?.values);

      assertValidDBResult(DBResultAllCounterData, "DBResultAllCounterData");
      assertValidDBResult(DBResultPreferences, "DBResultPreferences");

      await handleUserPreferencesDataFromDB(
        DBResultPreferences.values as PreferenceObjType[]
      );
      await handleCounterDataFromDB(DBResultAllCounterData);
      await initialiseAppUI();
      await reviewPrompt();
    } catch (error) {
      console.error(error);
    } finally {
      await updateUserPreference("isExistingUser", 1);
    }
  };

  const reviewPrompt = async () => {
    const storedLaunchCount = userPreferencesState.appLaunchCount;
    let launchCount = storedLaunchCount ? Number(storedLaunchCount) : 0;
    launchCount++;

    await updateUserPreference("appLaunchCount", launchCount);

    const shouldTriggerReview =
      launchCount === 3 ||
      launchCount === 10 ||
      launchCount === 20 ||
      launchCount % 50 === 0;

    if (Capacitor.isNativePlatform() && shouldTriggerReview) {
      InAppReview.requestReview();
    }
  };

  const handleUserPreferencesDataFromDB = async (
    DBResultPreferences: PreferenceObjType[]
  ) => {
    console.log(
      "Existing user, Preferences from DB are: ",
      DBResultPreferences
    );

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
        name: item.name,
        count: Number(item.count),
        target: Number(item.target),
        color: item.color,
        isActive: Number(item.isActive) as BinaryValue,
      })
    );

    await updateCountersState(counters);
  };

  const updateUserPreference = async (
    preferenceName: PreferenceKeyType,
    preferenceValue: number | MaterialColor | themeType | string
  ) => {
    console.log("updateUserPreference has run");

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
    setActiveColor(userPreferencesState.activeColor);
  }, [userPreferencesState.activeColor]);

  useEffect(() => {
    setTheme(userPreferencesState.theme);
    const android_style_delay = 1000;
    let statusBarThemeColor: string;

    const storedTheme = userPreferencesState.theme;

    if (storedTheme === "dark") {
      statusBarThemeColor = "#242424";

      if (Capacitor.isNativePlatform()) {
        setStatusAndNavBarBGColor(statusBarThemeColor, Style.Dark);
      }
      document.body.classList.add("dark");
    } else if (storedTheme === "light") {
      statusBarThemeColor = "#EDEDED";

      if (Capacitor.isNativePlatform()) {
        setStatusAndNavBarBGColor(statusBarThemeColor, Style.Light);
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
  }, [userPreferencesState.theme]);

  useEffect(() => {
    if (localStorage.getItem("appVersion") !== LATEST_APP_VERSION) {
      setShowChangelogModal(true);
      localStorage.setItem("appVersion", LATEST_APP_VERSION);
    }
  }, []);

  if (Capacitor.getPlatform() === "ios") {
    Keyboard.setAccessoryBarVisible({ isVisible: true });
  }

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

      const insertQuery = `INSERT into counterDataTable(orderIndex, name, count, target, color, isActive) VALUES (?, ?, ?, ?, ?, ?)`;
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
        name: newCounterName,
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
      SET name = ?,
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
            name: modifiedCounterName,
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
                    setUserPreferencesState={setUserPreferencesState}
                    userPreferencesState={userPreferencesState}
                    updateUserPreference={updateUserPreference}
                    activeColor={activeColor}
                    activeCounter={activeCounter}
                    resetAllCounters={resetAllCounters}
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
                    setUserPreferencesState={setUserPreferencesState}
                    userPreferencesState={userPreferencesState}
                    activeColor={activeColor}
                    activeCounter={activeCounter}
                    resetSingleCounter={resetSingleCounter}
                    updateCountersState={updateCountersState}
                    countersArr={countersState}
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
