import ActiveCounter from "../components/ActiveCounter";
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
}) => {
  return (
    <div className="main-page-wrap">
      <div className="home-page-header">
        <p>Home</p>
      </div>
      <ActiveCounter
        activeCounter={activeCounter}
        setAndStoreCounters={setAndStoreCounters}
        setLanguageDirection={setLanguageDirection}
        languageDirection={languageDirection}
        countersArr={countersArr}
      />
      <CounterButton
        countersArr={countersArr}
        setAndStoreCounters={setAndStoreCounters}
        setActiveCounter={setActiveCounter}
        activeCounter={activeCounter}
        setHaptics={setHaptics}
        haptics={haptics}
      />
    </div>
  );
};

export default HomePage;
