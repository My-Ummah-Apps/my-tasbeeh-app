import ActiveCounter from "../components/ActiveCounter";
import CounterButton from "../components/CounterButton";
import { motion } from "framer-motion";
// import { pageTransitionStyles } from "../utils/constants";
import {
  counterObjType,
  DBConnectionStateType,
  languageDirection,
  MaterialColor,
} from "../utils/types";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";

interface HomePageProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  toggleDBConnection: (action: DBConnectionStateType) => Promise<void>;
  activeColor: MaterialColor;
  activeCounter: counterObjType;
  resetSingleCounter: (id: string) => Promise<void>;
  updateCountersState: (arr: counterObjType[]) => void;
  countersArr: counterObjType[];
  setHaptics: React.Dispatch<React.SetStateAction<boolean | null>>;
  haptics: boolean | null;
  setLanguageDirection: React.Dispatch<React.SetStateAction<languageDirection>>;
  languageDirection: languageDirection;
}

const HomePage = ({
  dbConnection,
  toggleDBConnection,
  activeColor,
  activeCounter,
  resetSingleCounter,
  updateCountersState,
  countersArr,
  setHaptics,
  haptics,
  setLanguageDirection,
  languageDirection,
}: HomePageProps) => {
  return (
    <motion.main
      // {...pageTransitionStyles}
      className="main-page-wrap"
    >
      <header className="home-page-header">
        <p>Home</p>
      </header>
      <ActiveCounter
        activeColor={activeColor}
        activeCounter={activeCounter}
        resetSingleCounter={resetSingleCounter}
        setLanguageDirection={setLanguageDirection}
        languageDirection={languageDirection}
      />
      <CounterButton
        dbConnection={dbConnection}
        toggleDBConnection={toggleDBConnection}
        activeColor={activeColor}
        countersArr={countersArr}
        updateCountersState={updateCountersState}
        activeCounter={activeCounter}
        setHaptics={setHaptics}
        haptics={haptics}
      />
    </motion.main>
  );
};

export default HomePage;
