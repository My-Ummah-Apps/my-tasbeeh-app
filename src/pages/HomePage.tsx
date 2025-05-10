import CounterNameAndNumber from "../components/CounterNameAndNumber";
import CounterButton from "../components/CounterButton";

const HomePage = ({
  setActiveCounter,
  activeCounter,
  setAndStoreCounters,
  countersArr,
  setHaptics,
  haptics,
  setLanguageDirection,
  languageDirection,
  activeBackgroundColor,
  resetSingleCounter,
}) => {
  return (
    <div className="main-page-wrap">
      <div className="home-page-header">
        <p>Home</p>
      </div>
      <CounterNameAndNumber
        activeCounter={activeCounter}
        resetSingleCounter={resetSingleCounter}
        setLanguageDirection={setLanguageDirection}
        languageDirection={languageDirection}
        countersArr={countersArr}
      />
      <CounterButton
        countersArr={countersArr}
        setAndStoreCounters={setAndStoreCounters}
        activeBackgroundColor={activeBackgroundColor}
        setActiveCounter={setActiveCounter}
        activeCounter={activeCounter}
        setHaptics={setHaptics}
        haptics={haptics}
        countersArr={countersArr}
      />
    </div>
  );
};

export default HomePage;
