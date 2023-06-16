import CounterNameAndNumber from "../components/CounterNameAndNumber";
import PlusBtn from "../components/PlusBtn";

const MainPage = ({
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
  showAnimation,
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
        showAnimation={showAnimation}
        setActiveBackgroundColor={setActiveBackgroundColor}
        activeBackgroundColor={activeBackgroundColor}
      />
      <PlusBtn
        activeBackgroundColor={activeBackgroundColor}
        haptics={haptics}
        saveArrayLocally={saveArrayLocally}
        localSavedCountersArray={localSavedCountersArray}
        setActiveCounterNumber={setActiveCounterNumber}
        activeCounterNumber={activeCounterNumber}
        activeCounterTarget={activeCounterTarget}
        savedCountersArray={savedCountersArray}
        counterId={counterId}
        showAnimation={showAnimation}
      />
    </div>
  );
};

export default MainPage;
