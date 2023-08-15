import { useState, useEffect } from "react";
import CounterNameAndNumber from "../components/CounterNameAndNumber";
import PlusBtn from "../components/PlusBtn";

const MainPage = ({
  setHaptics,
  haptics,
  savedCountersArray,
  saveArrayLocally,
  counterId,
  activeCounterName,
  activeCounterTarget,
  activeCounterNumber,
  setActiveCounterName,
  setActiveCounterNumber,
  activeCounterBackgroundColor,
  localSavedCountersArray,
  setActiveBackgroundColor,
  activeBackgroundColor,
  resetSingleCounter,
}) => {
  return (
    <div className="main-page-wrap">
      <div className="home-page-header">
        <p>Home</p>
      </div>
      <CounterNameAndNumber
        resetSingleCounter={resetSingleCounter}
        setActiveCounterName={setActiveCounterName}
        setActiveCounterNumber={setActiveCounterNumber}
        activeCounterName={activeCounterName}
        activeCounterNumber={activeCounterNumber}
        activeCounterTarget={activeCounterTarget}
        localSavedCountersArray={localSavedCountersArray}
        setActiveBackgroundColor={setActiveBackgroundColor}
        activeBackgroundColor={activeBackgroundColor}
      />
      <PlusBtn
        activeBackgroundColor={activeBackgroundColor}
        setHaptics={setHaptics}
        haptics={haptics}
        saveArrayLocally={saveArrayLocally}
        localSavedCountersArray={localSavedCountersArray}
        setActiveCounterNumber={setActiveCounterNumber}
        activeCounterNumber={activeCounterNumber}
        activeCounterTarget={activeCounterTarget}
        savedCountersArray={savedCountersArray}
        counterId={counterId}
      />
    </div>
  );
};

export default MainPage;
