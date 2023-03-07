import { useState } from "react";
import {
  MdOutlineClose,
  MdOutlineRestartAlt,
  MdAddCircleOutline,
} from "react-icons/md";
import Header from "../components/Header";
import PopUpBox from "../components/PopUpBox";

const CountersPage = ({
  savedCountersArray,
  invokeSetActiveCounter,
  resetSingleCounter,
  activeCounterNumber,
  addItemToSavedCountersArray,
  setLocalSavedCountersArray,
  localSavedCountersArray,
  addCounter,
}) => {
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

  let nextColorIndex = 0;
  let nextColor;

  const [showPopUpBox, setShowPopUpBox] = useState(false);
  // console.log("counterpage has run");
  // console.log(localSavedCountersArray);
  return (
    <div>
      {/* <Header text={"Counters"} /> */}
      {localSavedCountersArray.map((counterItem) => {
        nextColorIndex == materialColors.length
          ? (nextColorIndex = 0)
          : (nextColorIndex += 1);
        nextColor = materialColors[nextColorIndex];
        return (
          <div
            className="counter-page-single-counter"
            key={counterItem.id}
            style={{ backgroundColor: nextColor }}
          >
            <div
              className="counter-and-count-wrap"
              onClick={() => {
                invokeSetActiveCounter(counterItem.id);
              }}
            >
              <p>{counterItem.counter}</p>
              <p>{counterItem.count}</p>
            </div>
            <span>
              <MdOutlineRestartAlt
                onClick={() => {
                  resetSingleCounter(counterItem.id);
                }}
              />
            </span>
            <span>
              <MdOutlineClose />
            </span>
          </div>
        );
      })}
      <span className="add-btn" onClick={() => setShowPopUpBox(true)}>
        +
      </span>
      <span>
        {showPopUpBox ? (
          <PopUpBox
            setShowPopUpBox={setShowPopUpBox}
            setLocalSavedCountersArray={setLocalSavedCountersArray}
            savedCountersArray={savedCountersArray}
            localSavedCountersArray={localSavedCountersArray}
            addCounter={addCounter}
          />
        ) : null}
      </span>
    </div>
  );
};

export default CountersPage;
