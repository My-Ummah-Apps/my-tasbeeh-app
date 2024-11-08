import { useState, useEffect } from "react";
import CounterNameAndNumber from "../components/CounterNameAndNumber";
import PlusBtn from "../components/PlusBtn";
// import { RateApp } from "capacitor-rate-app";
import { InAppReview } from "@capacitor-community/in-app-review";
import { Capacitor } from "@capacitor/core";

const MainPage = ({
  showReviewPrompt,
  reviewPrompt,
  setHaptics,
  haptics,
  setLanguageDirection,
  languageDirection,
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
  if (reviewPrompt && Capacitor.isNativePlatform) {
    // RateApp.requestReview();
    InAppReview.requestReview();
    showReviewPrompt(false);
  }
  return (
    <div className="main-page-wrap">
      <div className="home-page-header">
        <p>Home</p>
      </div>
      <CounterNameAndNumber
        resetSingleCounter={resetSingleCounter}
        setActiveCounterName={setActiveCounterName}
        setLanguageDirection={setLanguageDirection}
        languageDirection={languageDirection}
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
