import { useState, useEffect } from "react";
import CounterNameAndNumber from "../components/CounterNameAndNumber";
import PlusBtn from "../components/PlusBtn";

const MainPage = ({
  counterNameFontSize,
  savedCountersArray,
  saveArrayLocally,
  counterId,
  activeCounterName,
  setActiveCounterName,
  setActiveCounterNumber,
  activeCounterNumber,
  localSavedCountersArray,
}) => {
  // invokeSetActiveCounter(1);

  return (
    <div>
      {/* <FaUndoAlt
        className="reset-icon"
        onClick={() => {
          setActiveCounterNumber(0); // Small bug here, this change doesn't reflect on counters page straight away
        }}
      /> */}
      <CounterNameAndNumber
        setActiveCounterName={setActiveCounterName}
        setActiveCounterNumber={setActiveCounterNumber}
        counterNameFontSize={counterNameFontSize}
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
