import { useState, useReducer } from "react";
import {
  MdOutlineClose,
  MdOutlineRestartAlt,
  MdAddCircleOutline,
} from "react-icons/md";
import Header from "../components/Header";
import PopUpBox from "../components/PopUpBox";

const CountersPage = ({
  useForceUpdate,
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
  const [counterNumber, setCounterNumber] = useState(0);

  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }

  return (
    <div className="counters-wrap">
      {/* <Header text={"Counters"} /> */}
      {localSavedCountersArray.map((counterItem) => {
        console.log(localSavedCountersArray);
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
              className="counter"
              onClick={() => {
                invokeSetActiveCounter(counterItem.id);
              }}
            >
              <p>{counterItem.counter}</p>
            </div>
            <div className="stats-and-icons-wrap">
              <p>{counterItem.count}</p>
              <p>{counterItem.target}</p>
              <span>
                <MdOutlineRestartAlt
                  onClick={() => {
                    resetSingleCounter(counterItem.id);
                    handleClick();
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
