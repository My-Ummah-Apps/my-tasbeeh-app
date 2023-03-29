import { useState, useEffect } from "react";
import CounterNameAndNumber from "../components/CounterNameAndNumber";
import Header from "../components/Header";
import PlusBtn from "../components/PlusBtn";
import { FaUndoAlt } from "react-icons/fa";

const MainPage = ({
  currentCount,
  counterName,
  savedCountersArray,
  saveArrayLocally,
  counterId,
  activeCounterName,
  setActiveCounterNumber,
  activeCounterNumber,
  localSavedCountersArray,
}) => {
  // const [activeCountNumber, setActiveCountNumber] = useState(currentCount);

  // const [savedCountersArray, setSavedCountersArray] = useState(savedCountersArray);

  return (
    <div>
      <FaUndoAlt
        className="reset-icon"
        onClick={() => {
          setActiveCounterNumber(0); // Small bug here, this change doesn't reflect on counters page straight away
        }}
      />
      <CounterNameAndNumber
        activeCounterName={activeCounterName}
        activeCounterNumber={activeCounterNumber}
        localSavedCountersArray={localSavedCountersArray}
      />
      <PlusBtn
        saveArrayLocally={saveArrayLocally}
        localSavedCountersArray={localSavedCountersArray}
        setActiveCounterNumber={setActiveCounterNumber}
        activeCounterNumber={activeCounterNumber}
        savedCountersArray={savedCountersArray}
        counterId={counterId}
      />
    </div>
  );
};

export default MainPage;
