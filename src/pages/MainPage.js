import { useState, useEffect } from "react";
import CounterNameAndNumber from "../components/CounterNameAndNumber";
import PlusBtn from "../components/PlusBtn";
import { FaUndoAlt, FaRegCircle } from "react-icons/fa";

const MainPage = ({
  counterNameFontSize,
  savedCountersArray,
  saveArrayLocally,
  counterId,
  activeCounterName,
  setActiveCounterName,
  setActiveCounterNumber,
  activeCounterBackgroundColor,
  activeCounterTarget,
  activeCounterNumber,
  localSavedCountersArray,
}) => {
  return (
    <div>
      {/* <FaRegCircle className="fa-stack" />
      <FaUndoAlt className="reset-icon fa-stack" /> */}

      {/* onClick={() => {
          setActiveCounterNumber(0); // Small bug here, this change doesn't reflect on counters page straight away
        }} */}

      <CounterNameAndNumber
        setActiveCounterName={setActiveCounterName}
        setActiveCounterNumber={setActiveCounterNumber}
        counterNameFontSize={counterNameFontSize}
        activeCounterName={activeCounterName}
        activeCounterNumber={activeCounterNumber}
        activeCounterBackgroundColor={activeCounterBackgroundColor}
        activeCounterTarget={activeCounterTarget}
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
