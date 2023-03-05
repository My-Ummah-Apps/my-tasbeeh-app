import { useState } from "react";
import {
  MdOutlineClose,
  MdOutlineRestartAlt,
  MdAddCircleOutline,
} from "react-icons/md";
import Header from "../components/Header";
import PopUpBox from "../components/PopUpBox";

const CountersPage = ({
  localSavedCountersArray,
  invokeSetActiveCounter,
  resetSingleCounter,
  activeCounterNumber,
  addItemToSavedCountersArray,
}) => {
  const [showPopUpBox, setShowPopUpBox] = useState(false);

  return <div></div>;
};

export default CountersPage;

/*   <Header text={"Counters"} />
      {localSavedCountersArray.map((counterItem) => {
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
            savedCountersArray={localSavedCountersArray}
            setShowPopUpBox={setShowPopUpBox}
          />
        ) : null}
      </span> */
