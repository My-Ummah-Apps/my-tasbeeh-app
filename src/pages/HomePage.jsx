import { useState, useEffect } from "react";
import CounterNameAndNumber from "../components/CounterNameAndNumber";
import CounterButton from "../components/CounterButton";
// import { RateApp } from "capacitor-rate-app";
import { InAppReview } from "@capacitor-community/in-app-review";
import { Capacitor } from "@capacitor/core";

const HomePage = ({
  showReviewPrompt,
  reviewPrompt,
  setHaptics,
  haptics,
  setLanguageDirection,
  languageDirection,
  saveArrayLocally,
  activeCounterName,
  activeCounterTarget,
  activeCounterNumber,
  setActiveCounterName,
  setActiveCounterNumber,
  localSavedCountersArray,
  setActiveBackgroundColor,
  activeBackgroundColor,
  resetSingleCounter,
}) => {
  if (reviewPrompt && Capacitor.isNativePlatform()) {
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
      <CounterButton
        activeBackgroundColor={activeBackgroundColor}
        setHaptics={setHaptics}
        haptics={haptics}
        saveArrayLocally={saveArrayLocally}
        localSavedCountersArray={localSavedCountersArray}
        activeCounterName={activeCounterName}
        setActiveCounterNumber={setActiveCounterNumber}
        activeCounterNumber={activeCounterNumber}
        activeCounterTarget={activeCounterTarget}
      />
    </div>
  );
};

export default HomePage;
