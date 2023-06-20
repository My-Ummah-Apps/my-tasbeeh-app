import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Device } from "@capacitor/device";

import { v4 as uuidv4 } from "uuid";

import NavBar from "./components/NavBar";

import Main from "./pages/MainPage";
import CountersPage from "./pages/CountersPage";
import SettingsPage from "./pages/SettingsPage";

// STATUS BAR FUNCTIONALITY
const setStatusBarStyleDark = async () => {
  await StatusBar.setStyle({ style: Style.Dark });
};

const setStatusBarStyleLight = async () => {
  await StatusBar.setStyle({ style: Style.Light });
};

const hideStatusBar = async () => {
  await StatusBar.hide();
};

const showStatusBar = async () => {
  await StatusBar.show();
};

let lastUsedCounterIndex; // Used in the two conditional statements immediately below when app is first loaded to grab the last used counter
// let individualCounterDiv; // Used within the createCounterList function, the savedCountersArray is looped through and items added to the DOM with this variable which holds a div
let counterName; // This is the prop that will be passed into the CounterNumber component
let currentCount; // This is the prop that will be passed into the CounterNumber component
let counterId;
let defaultArray;

function App() {
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

  const [showAnimation, setShowAnimation] = useState(false);
  const [haptics, setHaptics] = useState(
    JSON.parse(localStorage.getItem("haptics"))
  );

  const [dailyCounterReset, setDailyCounterReset] = useState(
    JSON.parse(localStorage.getItem("dailyCounterReset"))
  );

  const [theme, setTheme] = useState(JSON.parse(localStorage.getItem("theme")));

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
  let prefersDark;
  useEffect(() => {
    prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    if (localStorage.getItem("theme") == null) {
      localStorage.setItem("theme", JSON.stringify("dark"));
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
    if (JSON.parse(localStorage.getItem("theme")) == "dark") {
      // toggleDarkTheme();
      document.body.classList.add("dark");
      if (device == "ios") {
        setStatusBarStyleDark();
      }
      if (device == "android") {
        StatusBar.setStyle({ style: Style.Dark });
      }

      console.log("useEffect has run, dark theme selected");
    } else if (JSON.parse(localStorage.getItem("theme")) == "light") {
      console.log("useEffect has run, light theme selected");
      document.body.classList.remove("dark");
      if (device == "ios") {
        setStatusBarStyleLight();
      }
      if (device == "android") {
        // StatusBar.setStyle({ style: Style.Dark });
        StatusBar.setBackgroundColor({ color: "#000" });
      }
      // toggleDarkTheme();
    }
  }, [theme, prefersDark]);

  const [lastLaunchDate, setLastLaunchDate] = useState(null);

  useEffect(() => {
    const storedDate = localStorage.getItem("lastLaunchDate");
    // const storedDate = "03/06/2023";
    const currentDate = new Date().toLocaleDateString();

    if (storedDate !== currentDate && dailyCounterReset == true) {
      // Reset your variable or perform any other actions
      resetAllCounters();
      console.log("It is a new day! All counters have been reset");
    }

    setLastLaunchDate(currentDate);
    localStorage.setItem("lastLaunchDate", currentDate);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("haptics") == null) {
      localStorage.setItem("haptics", JSON.stringify(false));
      setHaptics(false);
    }

    if (localStorage.getItem("dailyCounterReset") == null) {
      localStorage.setItem("dailyCounterReset", JSON.stringify(false));
      setDailyCounterReset(false);
    }
  });

  useEffect(() => {
    if (sessionStorage.getItem("showAnimation") == null) {
      setShowAnimation(true);
      console.log("sessionStorage is null");
      sessionStorage.setItem("showAnimation", "no");
    }

    setTimeout(() => {
      if (sessionStorage.getItem("showAnimation") != null) {
        setShowAnimation(false);
      }
    }, 4000);
  }, []);

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
          target: 100,
          id: uuidv4(),
        },

        {
          counter: "Subhanallah",
          count: 0,
          color: "#EC407A",
          isActive: false,
          target: 100,
          id: uuidv4(),
        },

        {
          counter: "Allahu-Akbar",
          count: 0,
          color: "AB47BC",
          isActive: false,
          target: 100,
          id: uuidv4(),
        },

        {
          counter: "Astagfirullah",
          count: 0,
          color: "7E57C2",
          isActive: false,
          target: 100,
          id: uuidv4(),
        },
        {
          counter: "Subhan-Allahi wa bihamdihi, Subhan-Allahil-Azim",
          count: 0,
          color: "5C6BC0",
          isActive: false,
          target: 100,
          id: uuidv4(),
        },
        {
          counter: "La hawla wa la quwwata illa billah",
          count: 0,
          color: "29B6F6",
          isActive: false,
          target: 100,
          id: uuidv4(),
        },
        {
          counter: "La ilaha illallah",
          count: 0,
          color: "26C6DA",
          isActive: false,
          target: 100,
          id: uuidv4(),
        },
        {
          counter: "Subhan-Allahi wa bihamdihi, Subhan-Allahil-Azim",
          count: 0,
          color: "26A69A",
          isActive: false,
          target: 100,
          id: uuidv4(),
        },
        {
          counter: "Subhan-Allahi wa bihamdih",
          count: 0,
          color: "66BB6A",
          isActive: false,
          target: 100,
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
                showAnimation={showAnimation}
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
                showAnimation={showAnimation}
              />
            }
          />
        </Routes>
      </section>

      <NavBar activeBackgroundColor={activeBackgroundColor} />
    </BrowserRouter>
  );
}

export default App;
