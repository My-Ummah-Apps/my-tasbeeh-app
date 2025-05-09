import CounterNameAndNumber from "../components/CounterNameAndNumber";
import CounterButton from "../components/CounterButton";

const HomePage = ({
  setHaptics,
  haptics,
  setLanguageDirection,
  languageDirection,
  activeCounterName,
  activeCounterTarget,
  activeCounterNumber,
  setActiveCounterNumber,
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
        setLanguageDirection={setLanguageDirection}
        languageDirection={languageDirection}
        localSavedCountersArray={localSavedCountersArray}
        setActiveBackgroundColor={setActiveBackgroundColor}
        activeBackgroundColor={activeBackgroundColor}
      />
      <CounterButton
        activeBackgroundColor={activeBackgroundColor}
        setHaptics={setHaptics}
        haptics={haptics}
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
