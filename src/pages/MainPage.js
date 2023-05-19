import CounterNameAndNumber from "../components/CounterNameAndNumber";
import PlusBtn from "../components/PlusBtn";

const MainPage = ({
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
        activeCounterName={activeCounterName}
        activeCounterNumber={activeCounterNumber}
        activeCounterBackgroundColor={activeCounterBackgroundColor}
        activeCounterTarget={activeCounterTarget}
        localSavedCountersArray={localSavedCountersArray}
        showAnimation={showAnimation}
      />
      <PlusBtn
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
