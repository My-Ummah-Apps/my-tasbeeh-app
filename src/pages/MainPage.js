import CounterNameAndNumber from "../components/CounterNameAndNumber";
import PlusBtn from "../components/PlusBtn";

const MainPage = ({
  haptics,
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
  showAnimation,
  setActiveBackgroundColor,
  activeBackgroundColor,
  resetSingleCounter,
}) => {
  return (
    <div>
      {/* <FaRegCircle className="fa-stack" />
      <FaUndoAlt className="reset-icon fa-stack" /> */}
      {/* onClick={() => {
          setActiveCounterNumber(0); // Small bug here, this change doesn't reflect on counters page straight away
        }} */}

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
        savedCountersArray={savedCountersArray}
        counterId={counterId}
        showAnimation={showAnimation}
      />
    </div>
  );
};

export default MainPage;
