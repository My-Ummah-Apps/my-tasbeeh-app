// Now need to figure out how to remove and add items

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";

import PlusBtn from "./components/PlusBtn";
import NavBar from "./components/NavBar";

import Main from "./pages/MainPage";
import CountersPage from "./pages/CountersPage";
import SettingsPage from "./pages/SettingsPage";

let currentSelectedCounterIndex; // Stores the index of the current active counter
let lastUsedCounterIndex; // Used in the two conditional statements immediately below when app is first loaded to grab the last used counter
let individualCounterDiv; // Used within the createCounterList function, the savedCountersArray is looped through and items added to the DOM with this variable which holds a div
let counterName; // This is the prop that will be passed into the CounterNumber component
let currentCount; // This is the prop that will be passed into the CounterNumber component
let counterId;
let defaultArray;
console.log("APP STARTED");
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
    "#D4E157",
    "#FFEE58",
    "#FFCA28",
    "#FFA726",
    "#FF7043",
    "#8D6E63",
  ];

  const [localSavedCountersArray, setLocalSavedCountersArray] = useState([]);
  const [activeCounterName, setActiveCounterName] = useState("");
  const [activeCounterNumber, setActiveCounterNumber] = useState(0);

  const saveArrayLocally = (arrayToSave) => {
    localStorage.setItem(
      "localSavedCountersArray",
      JSON.stringify(arrayToSave)
    );
  };

  let currentBackgroundColor;
  let currentCounterTarget;

  // localStorage.clear();
  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("localSavedCountersArray")) &&
      JSON.parse(localStorage.getItem("localSavedCountersArray")).length > 0
    ) {
      console.log("local data exists");
      defaultArray = JSON.parse(
        localStorage.getItem("localSavedCountersArray")
      );
      console.log(localSavedCountersArray);
    } else if (
      !localStorage.getItem("localSavedCountersArray") ||
      JSON.parse(localStorage.getItem("localSavedCountersArray")).length == 0
    ) {
      console.log("local data does not exist");
      defaultArray = [
        {
          counter: "Alhumdulillah",
          count: 0,
          color: "rgb(236, 64, 122)",
          isActive: true,
          target: 100,
          id: 0,
        },

        {
          counter: "Subhanallah",
          count: 0,
          color: "rgb(171, 71, 188)",
          isActive: false,
          target: 100,
          id: 1,
        },

        {
          counter: "Allahu-Akbar",
          count: 0,
          color: "rgb(126, 87, 194)",
          isActive: false,
          target: 100,
          id: 2,
        },

        {
          counter: "Astagfirullah",
          count: 0,
          color: "rgb(92, 107, 192)",
          isActive: false,
          target: 100,
          id: 3,
        },
      ];

      defaultArray.map((counterItem) => {
        if (counterItem.isActive) {
          // setActiveCounterName(counterItem.counter);
          // setActiveCounterNumber(counterItem.count);
          // saveArrayLocally(localSavedCountersArray);
        }
      });

      console.log(localSavedCountersArray);
      // invokeSetActiveCounter(0);
      saveArrayLocally(defaultArray);
    }

    defaultArray.findIndex((object) => {
      if (object.isActive === true) {
        lastUsedCounterIndex = defaultArray.indexOf(object);
      } else {
        lastUsedCounterIndex = 0;
        console.log("true");
      }
    });

    // counterName = defaultArray[lastUsedCounterIndex].counter;
    // currentCount = defaultArray[lastUsedCounterIndex].count;
    // counterId = defaultArray[lastUsedCounterIndex].id;
    // activeCounterName = defaultArray[lastUsedCounterIndex].counter;
    // invokeSetActiveCounter(defaultArray[lastUsedCounterIndex].id);
    setActiveCounterName(defaultArray[lastUsedCounterIndex].counter);
    setActiveCounterNumber(defaultArray[lastUsedCounterIndex].count);
    setLocalSavedCountersArray(defaultArray);
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
    setLocalSavedCountersArray(newArray);
    saveArrayLocally(newArray);
  };

  const modifyTheCountersArray = (
    id,
    modifiedCounterName,
    modifiedCount,
    modifiedTarget
  ) => {
    localSavedCountersArray.map((counterItem) => {
      if (counterItem.id == id && counterItem.isActive) {
        // invokeSetActiveCounter(counterItem.id);
        setActiveCounterNumber(Number(modifiedCount));
      }
      if (counterItem.id == id) {
        counterItem.counter = modifiedCounterName;
        counterItem.count = Number(modifiedCount);
        counterItem.target = Number(modifiedTarget);
        console.log(modifiedCount);
        console.log(counterItem);
      }
    });
    console.log(localSavedCountersArray);
    setLocalSavedCountersArray(localSavedCountersArray);
    saveArrayLocally(localSavedCountersArray);
  };

  const [counterNameFontSize, setCounterNameFontSize] = useState("3rem");
  const invokeSetActiveCounter = (id) => {
    console.log("invokeSetActiveCounter fired");
    localSavedCountersArray.map((counterItem) => {
      counterItem.isActive = false;

      if (counterItem.id == id) {
        counterItem.isActive = true;
        counterName = counterItem.counter;
        currentCount = counterItem.count;
        counterId = counterItem.id;
        console.log(counterItem.counter.length);
        // if (counterItem.counter.length < 14) {
        //   setCounterNameFontSize("3rem");
        // } else if (counterItem.counter.length > 14) {
        //   setCounterNameFontSize("0.3rem");
        // }
      }

      setActiveCounterName(counterName);
      setActiveCounterNumber(currentCount);
      saveArrayLocally(localSavedCountersArray);

      // saveCountersArray();
    });
  };
  // let testArray;
  const resetSingleCounter = (id) => {
    localSavedCountersArray.map((counterItem1) => {
      if (counterItem1.id == id) {
        counterItem1.count = 0;
        console.log(counterItem1);
        setLocalSavedCountersArray(localSavedCountersArray);
      }
    });

    saveArrayLocally(localSavedCountersArray);

    console.log(localSavedCountersArray);
  };

  const deleteSingleCounter = (id) => {
    console.log(localSavedCountersArray[id]);
    const filteredArray = localSavedCountersArray.filter(
      (counterItem) => counterItem.id !== id
    );
    setLocalSavedCountersArray(filteredArray);

    saveArrayLocally(filteredArray);
  };

  // document.body.style = "background: #fff;";

  // const [homePage, setHomePage] = useState(true);
  const homePage = true;

  return (
    <BrowserRouter>
      <section className="App">
        <Routes>
          <Route path="SettingsPage" element={<SettingsPage />} />
          <Route
            index
            element={
              <Main
                setActiveCounterName={setActiveCounterName}
                setActiveCounterNumber={setActiveCounterNumber}
                counterNameFontSize={counterNameFontSize}
                saveArrayLocally={saveArrayLocally}
                currentCount={currentCount}
                counterName={counterName}
                localSavedCountersArray={localSavedCountersArray}
                counterId={counterId}
                activeCounterName={activeCounterName}
                setActiveCounterNumber={setActiveCounterNumber}
                activeCounterNumber={activeCounterNumber}
              />
            }
          />
          <Route
            path="CountersPage"
            element={
              <CountersPage
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
                deleteSingleCounter={deleteSingleCounter}
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
