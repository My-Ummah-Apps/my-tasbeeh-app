import { useState } from "react";
import {
  MdOutlineClose,
  MdOutlineRestartAlt,
  MdAddCircleOutline,
} from "react-icons/md";
import Header from "../components/Header";
import PopUpBox from "../components/PopUpBox";

const CountersPage = ({
  resetSingleCounter,
  invokeSetActiveCounter,
  activeCounterNumber,
  addItemToSavedCountersArray,
  setLocalSavedCountersArray,
  localSavedCountersArray,
  addCounter,
  deleteSingleCounter,
  materialColors,
}) => {
  let nextColorIndex = 0;
  let nextColor;

  const [showPopUpBox, setShowPopUpBox] = useState(false);
  // console.log("counterpage has run");
  // console.log(localSavedCountersArray);
  return (
    <div className="counters-wrap">
      {/* <Header text={"Counters"} /> */}
      {localSavedCountersArray.map((counterItem) => {
        nextColorIndex > materialColors.length
          ? (nextColorIndex = 0)
          : (nextColorIndex += 1);
        nextColor = materialColors[nextColorIndex];
        counterItem.color = nextColor;
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
              <p>{counterItem.target}</p>
            </div>
            <span>
              <MdOutlineRestartAlt
                onClick={() => {
                  resetSingleCounter(counterItem.id);
                }}
              />
            </span>
            <span>
              <MdOutlineClose
                onClick={() => {
                  deleteSingleCounter(counterItem.id);
                }}
              />
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
            localSavedCountersArray={localSavedCountersArray}
            addCounter={addCounter}
          />
        ) : null}
      </span>
    </div>
  );
};

export default CountersPage;
