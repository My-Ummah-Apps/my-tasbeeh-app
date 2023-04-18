import { useState, useReducer } from "react";
import {
  MdOutlineClose,
  MdOutlineRestartAlt,
  MdAddCircleOutline,
  MdModeEditOutline,
} from "react-icons/md";
import Header from "../components/Header";
import PopUpBoxBlank from "../components/PopUpBoxBlank";
import PopUpBoxFilled from "../components/PopUpBoxFilled";

const CountersPage = ({
  useForceUpdate,
  resetSingleCounter,
  invokeSetActiveCounter,
  activeCounterNumber,
  addItemToSavedCountersArray,
  modifyTheCountersArray,
  setLocalSavedCountersArray,
  localSavedCountersArray,
  addCounter,
  deleteSingleCounter,
  materialColors,
}) => {
  let nextColorIndex = 0;
  let nextColor;

  const [showPopUpBoxBlank, setShowPopUpBoxBlank] = useState(false);
  const [showPopUpBoxFilled, setShowPopUpBoxFilled] = useState(false);
  const [counterNumber, setCounterNumber] = useState(0);

  const [currentCounterName, setCurrentCounterName] = useState(0);
  const [currentCount, setcurrentCount] = useState(0);
  const [currentCounterTarget, setCounterTarget] = useState(0);
  const [currentCounterId, setcurrentCounterId] = useState(0);

  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
  console.log(localSavedCountersArray);
  return (
    <>
      <table className="counters-wrap">
        {/* <Header text={"Counters"} /> */}
        <thead>
          <tr className="heading-table-row">
            <th colSpan="2">Counter</th>
            <th>Count</th>
            <th>Target</th>
            <th>Edit</th>
            <th>Reset</th>
            <th>Delete</th>
          </tr>
        </thead>
        {localSavedCountersArray.map((counterItem) => {
          nextColorIndex > materialColors.length
            ? (nextColorIndex = 0)
            : (nextColorIndex += 1);
          nextColor = materialColors[nextColorIndex];
          counterItem.color = nextColor;

          return (
            <tbody>
              <tr
                className="counter-page-single-counter"
                key={counterItem.id}
                style={{ backgroundColor: nextColor }}
              >
                <td
                  colSpan="2"
                  className="counter"
                  onClick={() => {
                    invokeSetActiveCounter(counterItem.id);
                  }}
                >
                  <span className="counter-name-td" style={{ border: "none" }}>
                    {counterItem.counter}
                  </span>
                </td>

                <td>{counterItem.count}</td>
                <td>{counterItem.target}</td>
                <td>
                  <MdModeEditOutline
                    onClick={(e) => {
                      setCurrentCounterName(counterItem.counter);
                      setcurrentCount(counterItem.count);
                      setCounterTarget(counterItem.target);
                      setcurrentCounterId(counterItem.id);
                      setShowPopUpBoxFilled(true);
                    }}
                  />
                </td>
                <td>
                  <MdOutlineRestartAlt
                    onClick={() => {
                      resetSingleCounter(counterItem.id);
                      if (counterItem.isActive) {
                        invokeSetActiveCounter(counterItem.id);
                      }
                      handleClick();
                    }}
                  />
                </td>
                <td>
                  <MdOutlineClose
                    onClick={() => {
                      deleteSingleCounter(counterItem.id);
                    }}
                  />
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
      <div className="add-btn" onClick={() => setShowPopUpBoxBlank(true)}>
        +
      </div>
      <div>
        {showPopUpBoxBlank ? (
          <PopUpBoxBlank
            nextColor={nextColor}
            setShowPopUpBoxBlank={setShowPopUpBoxBlank}
            setLocalSavedCountersArray={setLocalSavedCountersArray}
            localSavedCountersArray={localSavedCountersArray}
            addCounter={addCounter}
          />
        ) : null}
      </div>
      <div>
        {showPopUpBoxFilled ? (
          <PopUpBoxFilled
            modifyTheCountersArray={modifyTheCountersArray}
            currentCounterName={currentCounterName}
            currentCount={currentCount}
            currentCounterTarget={currentCounterTarget}
            currentCounterId={currentCounterId}
            setShowPopUpBoxFilled={setShowPopUpBoxFilled}
            setLocalSavedCountersArray={setLocalSavedCountersArray}
            localSavedCountersArray={localSavedCountersArray}
            addCounter={addCounter}
          />
        ) : null}
      </div>
    </>
  );
};

export default CountersPage;
