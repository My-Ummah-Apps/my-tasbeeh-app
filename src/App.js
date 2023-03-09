// Now need to figure out how to remove and add items

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import "./App.css";

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

function App() {
  const [localSavedCountersArray, setLocalSavedCountersArray] = useState([]);
  const [activeCounterName, setActiveCounterName] = useState();
  const [activeCounterNumber, setActiveCounterNumber] = useState();

  const saveArrayLocally = (arrayToSave) => {
    localStorage.setItem(
      "localSavedCountersArray",
      JSON.stringify(arrayToSave)
    );
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("localSavedCountersArray"))) {
      console.log("local data exists");
      defaultArray = JSON.parse(
        localStorage.getItem("localSavedCountersArray")
      );
      console.log(localSavedCountersArray);
    } else if (!JSON.parse(localStorage.getItem("localSavedCountersArray"))) {
      console.log("local data does not exist");
      defaultArray = [
        {
          counter: "Alhumdulillah",
          count: 2000,
          isActive: true,
          id: 0,
        },

        {
          counter: "Subhanallah",
          count: 25,
          isActive: false,
          id: 1,
        },

        {
          counter: "Allahu-Akbar",
          count: 10,
          isActive: false,
          id: 2,
        },

        {
          counter: "Astagfirullah",
          count: 10,
          isActive: false,
          id: 3,
        },
      ];

      console.log(localSavedCountersArray);
      saveArrayLocally(defaultArray);
    }
    // lastUsedCounterIndex = defaultArray.findIndex(
    //   (object) => object.isActive === true
    // );

    defaultArray.findIndex((object) => {
      // return object.isActive === true;
      if (object.isActive === true) {
        lastUsedCounterIndex = defaultArray.indexOf(object);
      } else {
        lastUsedCounterIndex = 0;
        console.log("true");
      }
    });

    counterName = defaultArray[lastUsedCounterIndex].counter;
    currentCount = defaultArray[lastUsedCounterIndex].count;
    counterId = defaultArray[lastUsedCounterIndex].id;
    setActiveCounterName(counterName);
    setActiveCounterNumber(currentCount);
    setLocalSavedCountersArray(defaultArray);
  }, []);

  const addItemToSavedCountersArray = () => {};

  const addCounter = (counterToAdd) => {
    console.log("addCounter fired");
    const randomlyGeneratedId = Math.floor(Math.random() * 10000) + 1;
    const newCounter = {
      counter: counterToAdd,
      count: 0,
      isActive: false,
      id: randomlyGeneratedId,
    };
    const newArray = [...localSavedCountersArray, newCounter];
    setLocalSavedCountersArray(newArray);
    console.log(newArray);
    saveArrayLocally(newArray);
  };

  console.log(localSavedCountersArray);

  const invokeSetActiveCounter = (id) => {
    localSavedCountersArray.map((counterItem) => {
      counterItem.isActive = false;

      if (counterItem.id == id) {
        counterItem.isActive = true;
        counterName = counterItem.counter;
        currentCount = counterItem.count;
        counterId = counterItem.id;
      }

      setActiveCounterName(counterName);
      setActiveCounterNumber(currentCount);
      saveArrayLocally(localSavedCountersArray);

      // saveCountersArray();
    });
  };

  const resetSingleCounter = (id) => {
    localSavedCountersArray.map((counterItem) => {
      if (counterItem.id == id) {
        counterItem.count = 0;
        setActiveCounterNumber(0);
      }
    });
    setLocalSavedCountersArray(localSavedCountersArray);
    saveArrayLocally(localSavedCountersArray);

    console.log(localSavedCountersArray);
  };

  const deleteSingleCounter = (id) => {
    setLocalSavedCountersArray(
      localSavedCountersArray.filter((counterItem) => counterItem.id !== id)
    );
    saveArrayLocally(localSavedCountersArray);
  };

  // document.body.style = "background: #fff;";

  return (
    <BrowserRouter>
      <section className="App">
        <Routes>
          <Route path="SettingsPage" element={<SettingsPage />} />
          <Route
            index
            element={
              <Main
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
                localSavedCountersArray={localSavedCountersArray}
                invokeSetActiveCounter={invokeSetActiveCounter}
                resetSingleCounter={resetSingleCounter}
                activeCounterName={activeCounterName}
                activeCounterNumber={activeCounterNumber}
                addItemToSavedCountersArray={addItemToSavedCountersArray}
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
