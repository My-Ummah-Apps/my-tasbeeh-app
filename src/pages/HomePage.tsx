import ActiveCounter from "../components/ActiveCounter";
import CounterButton from "../components/CounterButton";
import {
  counterObjType,
  languageDirection,
  MaterialColor,
} from "../utils/types";

interface HomePageProps {
  activeColor: MaterialColor;
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
  activeColor,
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
        activeColor={activeColor}
        activeCounter={activeCounter}
        resetSingleCounter={resetSingleCounter}
        setLanguageDirection={setLanguageDirection}
        languageDirection={languageDirection}
      />
      <CounterButton
        activeColor={activeColor}
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
