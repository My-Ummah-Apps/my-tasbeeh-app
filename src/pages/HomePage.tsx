import ActiveCounter from "../components/ActiveCounter";
import CounterButton from "../components/CounterButton";
import { counterObjType, languageDirection } from "../utils/types";

interface HomePageProps {
  activeCounter: counterObjType;
  resetSingleCounter: (id: string) => Promise<void>;
  setAndStoreCounters: (arr: counterObjType[]) => void;
  countersArr: counterObjType[];
  setHaptics: React.Dispatch<React.SetStateAction<boolean | null>>;
  haptics: boolean | null;
  setLanguageDirection: React.Dispatch<React.SetStateAction<languageDirection>>;
  languageDirection: languageDirection;
}

const HomePage = ({
  activeCounter,
  resetSingleCounter,
  setAndStoreCounters,
  countersArr,
  setHaptics,
  haptics,
  setLanguageDirection,
  languageDirection,
}: HomePageProps) => {
  return (
    <div className="main-page-wrap">
      <div className="home-page-header">
        <p>Home</p>
      </div>
      <ActiveCounter
        activeCounter={activeCounter}
        resetSingleCounter={resetSingleCounter}
        setLanguageDirection={setLanguageDirection}
        languageDirection={languageDirection}
      />
      <CounterButton
        countersArr={countersArr}
        setAndStoreCounters={setAndStoreCounters}
        activeCounter={activeCounter}
        setHaptics={setHaptics}
        haptics={haptics}
      />
    </div>
  );
};

export default HomePage;
