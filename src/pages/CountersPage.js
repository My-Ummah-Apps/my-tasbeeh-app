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
  const [showPopUpBox, setShowPopUpBox] = useState(false);

  return (
    <div>
      <Header text={"Counters"} />
      {savedCountersArray.map((counterItem) => {
        return (
          <div className="counter-page-single-counter" key={counterItem.id}>
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
