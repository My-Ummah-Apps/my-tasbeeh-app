import { useState, useEffect, useRef } from "react";
import { Redirect, Route } from "react-router-dom";
// import { IonApp } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { IonApp, IonRouterOutlet, IonTabs } from "@ionic/react";

import { Keyboard } from "@capacitor/keyboard";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";

import {
  DEFAULT_COUNTERS,
  dictPreferencesDefaultValues,
  materialColors,
  todaysDate,
} from "./utils/constants";
import { InAppReview } from "@capacitor-community/in-app-review";
import HomePage from "./pages/HomePage";
import CountersPage from "./pages/CountersPage";
import SettingsPage from "./pages/SettingsPage";
import { LATEST_APP_VERSION } from "./utils/changelog";
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

// import { AnimatePresence } from "framer-motion";
import useSQLiteDB from "./utils/useSqliteDB";
import { DBSQLiteValues } from "@capacitor-community/sqlite";
import BottomSheetChangelog from "./components/BottomSheets/BottomSheetChangelog";
import BottomSheetMajorUpdate from "./components/BottomSheets/BottomSheetMajorUpdate";
import TabBar from "./components/TabBar";
import {
  assertValidDBResult,
  setStatusAndNavBarBGColor,
  showAlert,
} from "./utils/helpers";

function App() {
  const justLaunched = useRef(true);
  const { isDBInitialised, dbConnection, toggleDBConnection } = useSQLiteDB();

  const [showChangelogBottomSheet, setShowChangelogBottomSheet] =
    useState(false);
  const [showMajorUpdateBottomSheet, setShowMajorUpdateBottomSheet] =
    useState(false);

  // const [isNextCounterLoading, setIsNextCounterLoading] = useState(false);
  const [activeCounter, setActiveCounter] = useState<counterObjType>({
    id: -1,
    orderIndex: -1,
    name: "",
    count: 0,
    target: 0,
    color: materialColors[0],
    isActive: 0,
  });

  const closeSlidingItems = () => {
    const slidingItems = document.querySelectorAll("ion-item-sliding");
    slidingItems.forEach((item) => item.closeOpened());
  };

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

  const [countersState, setCountersState] = useState<counterObjType[]>([]);
  const [counterId, setCounterId] = useState<number | null>(null);
  const [languageDirection, setLanguageDirection] =
    useState<languageDirection>("neutral");
  const [theme, setTheme] = useState<themeType | null>(null);
  const [activeColor, setActiveColor] = useState<MaterialColor>(
    materialColors[0]
  );
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [showAllResetToast, setShowAllResetToast] = useState(false);
  const [userPreferencesState, setUserPreferencesState] =
    useState<userPreferencesType>(dictPreferencesDefaultValues);
  const [showAddSuccessToast, setShowAddSuccessToast] = useState(false);
  const [showEditSuccessToast, setShowEditSuccessToast] = useState(false);

  const clearLocalStorage = () => {
    localStorage.removeItem("localSavedCountersArray");
    localStorage.removeItem("theme");
    localStorage.removeItem("morning-notification");
    localStorage.removeItem("afternoon-notification");
    localStorage.removeItem("evening-notification");
    localStorage.removeItem("lastLaunchDate");
    localStorage.removeItem("haptics");
    localStorage.removeItem("launch-count");
    localStorage.removeItem("activeColor");
    localStorage.removeItem("dailyCounterReset");
  };

  const handleTheme = (theme?: themeType) => {
    let themeColor = theme ? theme : userPreferencesState.theme;

    setTheme(themeColor);
    let statusBarThemeColor: string = "#242424";

    if (themeColor === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      themeColor = media.matches ? "dark" : "light";
    }

    if (themeColor === "dark") {
      statusBarThemeColor = "#242424";
      document.body.classList.add("dark");
      if (Capacitor.isNativePlatform()) {
        setStatusAndNavBarBGColor(statusBarThemeColor, Style.Dark);
      }
    } else if (themeColor === "light") {
      statusBarThemeColor = "#EDEDED";
      document.body.classList.remove("dark");
      if (Capacitor.isNativePlatform()) {
        setStatusAndNavBarBGColor(statusBarThemeColor, Style.Light);
      }
    }

    if (Capacitor.isNativePlatform()) {
      const statusBarIconsColor =
        statusBarThemeColor === "#EDEDED" ? Style.Light : Style.Dark;
      if (Capacitor.getPlatform() === "android" && justLaunched.current) {
        setTimeout(() => {
          setStatusAndNavBarBGColor(statusBarThemeColor, statusBarIconsColor);
          justLaunched.current = false;
        }, 1000);
      } else {
        setStatusAndNavBarBGColor(statusBarThemeColor, statusBarIconsColor);
      }
    }

    return statusBarThemeColor;
  };

  const migrationToDB = async () => {
    console.log("MIGRATION HAS BEGUN");

    try {
      await toggleDBConnection("open");

      // PREFERENCES MIGRATION

      const todaysDate = new Date().toLocaleDateString("en-CA");

      const theme = JSON.parse(localStorage.getItem("theme") || "dark");
      const morningNotification =
        localStorage.getItem("morning-notification") === "true" ? 1 : 0;
      const afternoonNotification =
        localStorage.getItem("afternoon-notification") === "true" ? 1 : 0;
      const eveningNotification =
        localStorage.getItem("evening-notification") === "true" ? 1 : 0;
      const haptics = localStorage.getItem("haptics") === "true" ? 1 : 0;
      const launchCount = localStorage.getItem("launch-count") || 0;
      const activeColor =
        localStorage.getItem("activeColor") || materialColors[0];
      const dailyCounterReset =
        localStorage.getItem("dailyCounterReset") === "true" ? 1 : 0;

      const prefs: userPreferencesType = {
        morningNotification: morningNotification,
        afternoonNotification: afternoonNotification,
        eveningNotification: eveningNotification,
        isExistingUser: 1,
        appLaunchCount: Number(launchCount),
        haptics: haptics,
        previousLaunchDate: todaysDate,
        dailyCounterReset: dailyCounterReset,
        // @ts-ignore
        activeColor: activeColor,
        theme: theme,
      };

      const params = Object.keys(prefs)
        .map((key) => {
          const value = prefs[key as keyof userPreferencesType];
          return [key, Array.isArray(value) ? value.join(",") : value];
        })
        .flat();

      const placeholders = Array(params.length / 2)
        .fill("(?, ?)")
        .join(", ");

      const insertStmnt = `
        INSERT OR IGNORE INTO userPreferencesTable (preferenceName, preferenceValue) 
        VALUES ${placeholders};
        `;

      await dbConnection.current!.run(insertStmnt, params);

      // COUNTERS MIGRATION

      const countersArr: counterObjType[] = JSON.parse(
        // @ts-ignore
        localStorage.getItem("localSavedCountersArray")
      );
      // console.log("LOCALSTORAGE COUNTERS: ", countersArr);

      for (let i = 0; i < countersArr.length; i++) {
        const counterObj = countersArr[i];

        // @ts-ignore
        const isActive = counterObj.isActive === true ? 1 : 0;

        const insertStmnt = `INSERT OR IGNORE into counterDataTable(orderIndex, name, count, target, color, isActive) VALUES (?, ?, ?, ?, ?, ?)`;

        if (!dbConnection.current) {
          throw new Error("dbConnection.current does not exist");
        }

        await dbConnection.current.run(insertStmnt, [
          i,
          // @ts-ignore
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
      await toggleDBConnection("close");
    }
    clearLocalStorage();
    console.log("MIGRATION HAS FINISHED, LOCALSTORAGE CLEARED");
  };

  const initialiseDefaultPrefsAndCounters = async () => {
    try {
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
            INSERT OR IGNORE INTO userPreferencesTable (preferenceName, preferenceValue) 
            VALUES ${placeholders};
            `;

      await dbConnection.current!.run(insertStmnt, params);

      for (let i = 0; i < DEFAULT_COUNTERS.length; i++) {
        const counterObj = DEFAULT_COUNTERS[i];
        const isActive = counterObj.isActive === 1 ? 1 : 0;

        const insertStmnt = `INSERT into counterDataTable(orderIndex, name, count, target, color, isActive) VALUES (?, ?, ?, ?, ?, ?)`;

        await dbConnection.current!.run(insertStmnt, [
          i,
          counterObj.name,
          counterObj.count,
          counterObj.target,
          null,
          isActive,
        ]);
      }
    } catch (error) {
      console.error("Error initialising default preferences and counters");
    }
  };

  const updateCountersState = (arr: counterObjType[]) => {
    setCountersState([...arr].sort((a, b) => a.orderIndex - b.orderIndex));
    const activeCounter =
      arr.find((counter) => counter.isActive === 1) ?? arr[0];

    setActiveCounter(activeCounter);
  };

  const initialiseAppUI = async (theme: themeType) => {
    const splash_hide_delay = 500;
    const android_style_delay = 1000;
    const statusBarThemeColor = handleTheme(theme);

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
      if (isDBImported) {
        // await updateUserPreference("isExistingUser", "1");
      }

      await toggleDBConnection("open");

      let DBResultPreferences = await dbConnection.current!.query(
        `SELECT * FROM userPreferencesTable`
      );

      assertValidDBResult(DBResultPreferences, "DBResultPreferences");

      const isExistingUser = DBResultPreferences.values.find(
        (item) => item.preferenceName === "isExistingUser"
      );

      if (
        localStorage.getItem("appVersion") !== LATEST_APP_VERSION &&
        isExistingUser
      ) {
        // setShowChangelogBottomSheet(true);
        // setShowMajorUpdateBottomSheet(true);
      }

      if (DBResultPreferences.values.length === 0) {
        await initialiseDefaultPrefsAndCounters();
        DBResultPreferences = await dbConnection.current!.query(
          `SELECT * FROM userPreferencesTable`
        );
        assertValidDBResult(DBResultPreferences, "DBResultPreferences");
      }

      const theme: themeType =
        DBResultPreferences.values.find(
          (item) => item.preferenceName === "theme"
        )?.preferenceValue ?? "light";

      const rawDailyCounterResetPrefValue =
        DBResultPreferences.values.find(
          (item) => item.preferenceName === "dailyCounterReset"
        )?.preferenceValue ?? "0";

      const dailyCounterResetPrefValue: BinaryValue =
        rawDailyCounterResetPrefValue === "0" ? 0 : 1;

      const previousLaunchDate: string = DBResultPreferences.values.find(
        (item) => item.preferenceName === "previousLaunchDate"
      )?.preferenceValue;

      const resetCounters =
        dailyCounterResetPrefValue === 1 && previousLaunchDate !== todaysDate;

      const DBResultAllCounterData = await dbConnection.current!.query(
        `SELECT * FROM counterDataTable`
      );

      // console.log("DBResultAllCounterData: ", DBResultAllCounterData.values);
      // console.log("DBResultPreferences.values: ", DBResultPreferences.values);

      assertValidDBResult(DBResultAllCounterData, "DBResultAllCounterData");

      await handleUserPreferencesDataFromDB(
        DBResultPreferences.values as PreferenceObjType[]
      );
      await handleCounterDataFromDB(DBResultAllCounterData, resetCounters);
      await updateUserPreference("isExistingUser", 1);
      await updateUserPreference("previousLaunchDate", todaysDate);
      await initialiseAppUI(theme);
      await reviewPrompt();
      localStorage.setItem("appVersion", LATEST_APP_VERSION);
    } catch (error) {
      console.error(error);
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

    // ? Some of the below code may not be required, as default preferences are being initialised within the initialiseDefaultPrefsAndCounters function

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
    DBResultAllCounterData: DBSQLiteValues,
    resetCounters: boolean
  ) => {
    const countersFromDB = DBResultAllCounterData.values as Array<
      Record<string, any>
    >;

    if (resetCounters) {
      try {
        await toggleDBConnection("open");
        const resetAllCountersStatement = `UPDATE counterDataTable SET count = 0`;
        await dbConnection.current!.run(resetAllCountersStatement);
      } catch (error) {
        console.error("Error resetting counters: ", error);
      } finally {
        await toggleDBConnection("close");
      }
    }

    const counters: counterObjType[] = countersFromDB.map(
      (item): counterObjType => ({
        id: Number(item.id),
        orderIndex: Number(item.orderIndex),
        name: item.name,
        count: resetCounters ? 0 : Number(item.count),
        target: Number(item.target),
        color: item.color,
        isActive: Number(item.isActive) as BinaryValue,
      })
    );

    updateCountersState(counters);
  };

  const updateUserPreference = async (
    preferenceName: PreferenceKeyType,
    preferenceValue: number | MaterialColor | themeType | string
  ) => {
    try {
      await toggleDBConnection("open");
      const query = `INSERT OR REPLACE INTO userPreferencesTable (preferenceName, preferenceValue) VALUES (?, ?)`;
      await dbConnection.current!.run(query, [preferenceName, preferenceValue]);

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
    handleTheme(userPreferencesState.theme);
  }, [userPreferencesState.theme]);

  if (Capacitor.getPlatform() === "ios") {
    Keyboard.setAccessoryBarVisible({ isVisible: true });
  }

  const resetSingleCounter = async (id: number) => {
    try {
      await toggleDBConnection("open");
      const resetCounterQuery = `UPDATE counterDataTable SET count = ? WHERE id = ?`;
      await dbConnection.current!.run(resetCounterQuery, [0, id]);

      const updatedCountersArr = countersState.map((counter) => {
        return counter.id === id ? { ...counter, count: 0 } : counter;
      });
      updateCountersState(updatedCountersArr);
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
      await dbConnection.current!.run(resetCountersQuery);

      const resettedCounters = countersState.map((counter) => ({
        ...counter,
        count: 0,
      }));
      updateCountersState(resettedCounters);
      setShowAllResetToast(true);
      closeSlidingItems();
    } catch (error) {
      console.error("Error resetting all counters: ", error);
    } finally {
      await toggleDBConnection("close");
    }
  };

  const addCounter = async (newCounterName: string, target: number) => {
    try {
      await toggleDBConnection("open");

      const maxOrderIndexResult = await dbConnection.current!.query(
        `SELECT MAX(orderIndex) AS maxOrderIndex FROM counterDataTable`
      );
      const maxOrderIndex =
        maxOrderIndexResult?.values?.[0].maxOrderIndex ?? -1;
      const newOrderIndex = maxOrderIndex + 1;

      const insertQuery = `INSERT OR IGNORE into counterDataTable(orderIndex, name, count, target, color, isActive) VALUES (?, ?, ?, ?, ?, ?)`;
      const insertResult = await dbConnection.current!.run(insertQuery, [
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
      updateCountersState(updatedCountersArr);
      setShowAddSuccessToast(true);
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

      await dbConnection.current!.run(updateCounterQuery, [
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

    updateCountersState(updatedCountersArr);
    setShowEditSuccessToast(true);
  };

  const deleteCounter = async (id: number) => {
    const remainingCounters = countersState.filter(
      (counter) => counter.id !== id
    );
    if (remainingCounters.length === 0) {
      showAlert("Unable to delete Tasbeeh", "At least one tasbeeh must exist");
      return;
    }

    const updatedCountersArr: counterObjType[] = remainingCounters.map(
      (counter, i) => ({
        ...counter,
        isActive: activeCounter.id === id && i === 0 ? 1 : counter.isActive,
      })
    );

    const remainingCountersAfterDelete: counterObjType[] =
      remainingCounters.filter((counter) => counter.id !== id);

    // console.log("updatedCountersArr: ", updatedCountersArr);

    try {
      await toggleDBConnection("open");
      await dbConnection.current!.run(
        `DELETE FROM counterDataTable WHERE id = ?`,
        [id]
      );
      const isActiveCounterBeingDeleted = countersState.some(
        (counter) => counter.id === id && counter.isActive === 1
      );

      // const test = await dbConnection.current!.query(
      //   `SELECT * FROM counterDataTable`
      // );
      // console.log("COUNTERS BEFORE IS ACTIVE BEING RESET: ", test);

      if (isActiveCounterBeingDeleted) {
        // console.log("UPDATING ISACTIVE COUNTER");
        await dbConnection.current!.run(
          `UPDATE counterDataTable SET isActive = 1 WHERE id = ?`,
          [remainingCountersAfterDelete[0].id]
        );
      }
      // const test1 = await dbConnection.current!.query(
      //   `SELECT * FROM counterDataTable`
      // );
      // console.log("COUNTERS AFTER IS ACTIVE BEING RESET: ", test1);

      updateCountersState(updatedCountersArr);
      setShowDeleteToast(true);
      closeSlidingItems();
    } catch (error) {
      console.error("Error deleting counter: ", error);
    } finally {
      await toggleDBConnection("close");
    }
  };

  const updateActiveCounter = async (
    counterId: number,
    color: MaterialColor
  ) => {
    setCounterId(counterId);

    const updatedCountersArr: counterObjType[] = countersState.map(
      (counter: counterObjType) => {
        return counter.id === counterId
          ? { ...counter, isActive: 1 }
          : { ...counter, isActive: 0 };
      }
    );

    // setActiveColor(color);
    updateCountersState(updatedCountersArr);
    await updateUserPreference("activeColor", color);

    try {
      await toggleDBConnection("open");
      await dbConnection.current!.run(
        `UPDATE counterDataTable SET isActive = 0`
      );
      await dbConnection.current!.run(
        `UPDATE counterDataTable SET isActive = 1 WHERE id = ?`,
        [counterId]
      );
    } catch (error) {
      console.error("Error updating active counter/active color: ", error);
    } finally {
      await toggleDBConnection("close");
    }
  };

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs className="app">
          <IonRouterOutlet
          //  animated={false}
          >
            <Route
              exact
              path="/HomePage"
              render={() => (
                <HomePage
                  dbConnection={dbConnection}
                  toggleDBConnection={toggleDBConnection}
                  userPreferencesState={userPreferencesState}
                  updateActiveCounter={updateActiveCounter}
                  activeColor={activeColor}
                  activeCounter={activeCounter}
                  resetSingleCounter={resetSingleCounter}
                  updateCountersState={updateCountersState}
                  countersState={countersState}
                  setLanguageDirection={setLanguageDirection}
                  languageDirection={languageDirection}
                />
              )}
            />
            <Route
              exact
              path="/CountersPage"
              render={() => (
                <CountersPage
                  updateActiveCounter={updateActiveCounter}
                  activeColor={activeColor}
                  setCounterId={setCounterId}
                  counterId={counterId}
                  activeCounter={activeCounter}
                  countersState={countersState}
                  closeSlidingItems={closeSlidingItems}
                  modifyCounter={modifyCounter}
                  resetSingleCounter={resetSingleCounter}
                  resetAllCounters={resetAllCounters}
                  showAllResetToast={showAllResetToast}
                  setShowAllResetToast={setShowAllResetToast}
                  addCounter={addCounter}
                  deleteCounter={deleteCounter}
                  setShowDeleteToast={setShowDeleteToast}
                  showDeleteToast={showDeleteToast}
                  setShowAddSuccessToast={setShowAddSuccessToast}
                  showAddSuccessToast={showAddSuccessToast}
                  setShowEditSuccessToast={setShowEditSuccessToast}
                  showEditSuccessToast={showEditSuccessToast}
                />
              )}
            />
            <Route
              exact
              path="/SettingsPage"
              render={() => (
                <SettingsPage
                  dbConnection={dbConnection}
                  toggleDBConnection={toggleDBConnection}
                  // iapProducts={iapProducts}
                  // setUserPreferencesState={setUserPreferencesState}
                  userPreferencesState={userPreferencesState}
                  updateUserPreference={updateUserPreference}
                  updateCountersState={updateCountersState}
                  countersState={countersState}
                  setLanguageDirection={setLanguageDirection}
                  activeColor={activeColor}
                  activeCounter={activeCounter}
                  closeSlidingItems={closeSlidingItems}
                  theme={theme}
                  setShowChangelogBottomSheet={setShowChangelogBottomSheet}
                />
              )}
            />
          </IonRouterOutlet>

          <TabBar activeColor={activeColor} />
        </IonTabs>
        <Route exact path="/" render={() => <Redirect to="/HomePage" />} />
      </IonReactRouter>
      <BottomSheetChangelog
        showChangelogBottomSheet={showChangelogBottomSheet}
        setShowChangelogBottomSheet={setShowChangelogBottomSheet}
      />
      ;
      {showMajorUpdateBottomSheet && (
        <BottomSheetMajorUpdate
          setShowMajorUpdateBottomSheet={setShowMajorUpdateBottomSheet}
        />
      )}
    </IonApp>
  );
}

export default App;
