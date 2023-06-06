import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";

import NavBar from "./components/NavBar";

import Main from "./pages/MainPage";
import CountersPage from "./pages/CountersPage";
import SettingsPage from "./pages/SettingsPage";

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

  const [lastLaunchDate, setLastLaunchDate] = useState(null);

  console.log(lastLaunchDate);

  useEffect(() => {
    const storedDate = localStorage.getItem("lastLaunchDate");
    // const storedDate = "03/06/2023";
    const currentDate = new Date().toLocaleDateString();

    console.log(storedDate);
    console.log(currentDate);

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
          id: 0,
        },

        {
          counter: "Subhanallah",
          count: 0,
          color: "#EC407A",
          isActive: false,
          target: 100,
          id: 1,
        },

        {
          counter: "Allahu-Akbar",
          count: 0,
          color: "AB47BC",
          isActive: false,
          target: 100,
          id: 2,
        },

        {
          counter: "Astagfirullah",
          count: 0,
          color: "7E57C2",
          isActive: false,
          target: 100,
          id: 3,
        },
        {
          counter: "Subhan-Allahi wa bihamdihi, Subhan-Allahil-Azim",
          count: 0,
          color: "5C6BC0",
          isActive: false,
          target: 100,
          id: 4,
        },
        {
          counter: "La hawla wa la quwwata illa billah",
          count: 0,
          color: "29B6F6",
          isActive: false,
          target: 100,
          id: 5,
        },
        {
          counter: "La ilaha illallah",
          count: 0,
          color: "26C6DA",
          isActive: false,
          target: 100,
          id: 6,
        },
        {
          counter: "Subhan-Allahi wa bihamdihi, Subhan-Allahil-Azim",
          count: 0,
          color: "26A69A",
          isActive: false,
          target: 100,
          id: 7,
        },
        {
          counter: "Subhan-Allahi wa bihamdih",
          count: 0,
          color: "66BB6A",
          isActive: false,
          target: 100,
          id: 8,
        },
      ];

      saveArrayLocally(defaultArray);
    }

    defaultArray.findIndex((object) => {
      if (object.isActive == true) {
        lastUsedCounterIndex = defaultArray.indexOf(object);

        setActiveCounterName(defaultArray[lastUsedCounterIndex].counter);
        setActiveCounterNumber(defaultArray[lastUsedCounterIndex].count);
      } else {
        lastUsedCounterIndex = 0;
      }
    });

    setLocalSavedCountersArray(defaultArray);
    saveArrayLocally(defaultArray);
  }, []);
  const addItemToSavedCountersArray = () => {};

  const addCounter = (counterToAdd, target) => {
    const randomlyGeneratedId = Math.floor(Math.random() * 10000) + 1;
    const newCounter = {
      counter: counterToAdd,
      count: 0,
      isActive: false,
      target: target,
      id: randomlyGeneratedId,
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

        setLocalSavedCountersArray(localSavedCountersArray);
      }
    });

    saveArrayLocally(localSavedCountersArray);
  };

  const deleteSingleCounter = (id) => {
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

      <NavBar />
    </BrowserRouter>
  );
}

export default App;
