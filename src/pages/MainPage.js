import { useState, useEffect } from "react";
import CounterNameAndNumber from "../components/CounterNameAndNumber";
import PlusBtn from "../components/PlusBtn";
import { RateApp } from "capacitor-rate-app";

const MainPage = ({
  showReviewPrompt,
  reviewPrompt,
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
  if (reviewPrompt) {
    RateApp.requestReview();
    showReviewPrompt(false);
    // let launchCount = localStorage.getItem("launch-count");
    // let launchCountNumber = Number(launchCount);
    // if (launchCountNumber > 14) {
    //   launchCount = 0;
    // }
    // else if (launchCountNumber < 15) {
    //     launchCount = launchCountNumber + 1;
    //   }

    // localStorage.setItem("launch-count", JSON.stringify(launchCount));
  }
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
