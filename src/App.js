// Now need to figure out how to remove and add items

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import "./App.css";

import PlusBtn from "./components/PlusBtn";
import NavBar from "./components/NavBar";

import Main from "./pages/MainPage";
import CountersPage from "./pages/CountersPage";
import SettingsPage from "./pages/SettingsPage";

let savedCountersArray; // This array will hold the counters locally
let currentSelectedCounterIndex; // Stores the index of the current active counter
let lastUsedCounterIndex; // Used in the two conditional statements immediately below when app is first loaded to grab the last used counter
let individualCounterDiv; // Used within the createCounterList function, the savedCountersArray is looped through and items added to the DOM with this variable which holds a div
let counterName; // This is the prop that will be passed into the CounterNumber component
let currentCount; // This is the prop that will be passed into the CounterNumber component
let counterId;

// function saveCountersArray() {
//   localStorage.setItem(
//     "savedCountersArray",
//     JSON.stringify(savedCountersArray)
//   );
// }

// if (
//   localStorage.getItem("firstLaunch") == null ||
//   JSON.parse(localStorage.getItem("savedCountersArray")).length === 0
// ) {
//   console.log("FIRST LAUNCH");

//   // Sets a keyname + value so when the user launches the app again, this if statement will return false
//   // and the next one will return true
//   localStorage.setItem("firstLaunch", "firstLaunch");

//   // As it's the users first time using the application, the savedCountersArray is populated with a few counters

//   // The isActive key:value pair will help determine which counter (and count) to show and update both on screen
//   // and within the localStorage (savedCountersArray)

//   // savedCountersArray = [
//   //   {
//   //     counter: "Alhumdulillah",
//   //     count: 0,
//   //     isActive: true,
//   //     id: 0,
//   //   },

//   //   {
//   //     counter: "Subhanallah",
//   //     count: 0,
//   //     isActive: false,
//   //     id: 1,
//   //   },

//   //   {
//   //     counter: "Allahu-Akbar",
//   //     count: 10,
//   //     isActive: false,
//   //     id: 2,
//   //   },

//   //   {
//   //     counter: "Astagfirullah",
//   //     count: 10,
//   //     isActive: false,
//   //     id: 3,
//   //   },
//   // ];

//   // Saved the array to local storage and store it in the savedCountersArray variable
//   saveCountersArray();
//   savedCountersArray = JSON.parse(localStorage.getItem("savedCountersArray"));
//   // This function will loop through the savedCountersArray and will populate the menu with the counters present in the array
//   // createCounterList();

//   // This will find the last object in the savedCountersArray with the isActive property marked as true
//   lastUsedCounterIndex = savedCountersArray.findIndex(
//     (object) => object.isActive === true
//   );

//   // The lastUsedCounterIndex variable is then used to populate the counter and count fields on the main page
//   // with the active counter from savedCountersArray
//   counterName = savedCountersArray[lastUsedCounterIndex].counter;
//   currentCount = savedCountersArray[lastUsedCounterIndex].count;
//   counterId = savedCountersArray[lastUsedCounterIndex].id;
// } else if (localStorage.getItem("firstLaunch") !== null) {
//   // Grab the savedCountersArray already present and parse it
//   savedCountersArray = JSON.parse(localStorage.getItem("savedCountersArray"));

//   // Find the object with the isActive property set to true
//   lastUsedCounterIndex = savedCountersArray.findIndex(
//     (object) => object.isActive === true
//   );

//   // The lastUsedCounterIndex variable is then used to locate the last used counter and
//   // populate the counter and count fields on the main page
//   // with the currently active counter from savedCountersArray
//   counterName = savedCountersArray[lastUsedCounterIndex].counter;
//   currentCount = savedCountersArray[lastUsedCounterIndex].count;
//   counterId = savedCountersArray[lastUsedCounterIndex].id;

//   // This function will loop through the savedCountersArray and will populate the menu with the counters present in the array
//   // createCounterList();
// }

const saveCountersArray = [
  [
    {
      counter: "Alhumdulillah",
      count: 0,
      isActive: true,
      id: 0,
    },

    {
      counter: "Subhanallah",
      count: 0,
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
  ],
];

function App() {
  const [localSavedCountersArray, setLocalSavedCountersArray] = useState();

  // useEffect(() => {
  //   console.log("useEffect has run");
  //   if (localStorage.getItem("localSavedCountersArray")) {
  //     console.log("it exists");
  //     console.log(localSavedCountersArray);
  //     console.log(JSON.parse(localStorage.getItem("localSavedCountersArray")));
  //     setLocalSavedCountersArray(
  //       JSON.parse(localStorage.getItem("localSavedCountersArray"))
  //     );
  //   } else {
  //     console.log("it doesn't exist");
  //     setLocalSavedCountersArray(defaultArray);
  //     console.log(localSavedCountersArray);
  //     localStorage.setItem(
  //       "localSavedCountersArray",
  //       JSON.stringify(localSavedCountersArray)
  //     );
  //   }
  // }, []);

  const [activeCounterName, setActiveCounterName] = useState(counterName);
  const [activeCounterNumber, setActiveCounterNumber] = useState(currentCount);
  const invokeSetActiveCounter = (id) => {
    savedCountersArray.map((counterItem) => {
      counterItem.isActive = false;

      if (counterItem.id == id) {
        counterItem.isActive = true;
        counterName = counterItem.counter;
        currentCount = counterItem.count;
        counterId = counterItem.id;
      }

      setActiveCounterName(counterName);
      setActiveCounterNumber(currentCount);
      // saveCountersArray();
    });
  };

  const resetSingleCounter = (id) => {
    savedCountersArray.map((counterItem) => {
      if (counterItem.id == id) {
        counterItem.count = 0;
        currentCount = counterItem.count;
        setActiveCounterNumber(currentCount);
        // saveCountersArray();
      }
    });
  };

  const addItemToSavedCountersArray = () => {};

  document.body.style = "background: #000;";

  return (
    <BrowserRouter>
      <section className="App">
        <Routes>
          <Route path="SettingsPage" element={<SettingsPage />} />
          <Route
            index
            element={
              <Main
                currentCount={currentCount}
                counterName={counterName}
                savedCountersArray={savedCountersArray}
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
                activeCounterNumber={activeCounterNumber}
                addItemToSavedCountersArray={addItemToSavedCountersArray}
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
