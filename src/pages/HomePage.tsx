import ActiveCounter from "../components/ActiveCounter";
import CounterButton from "../components/CounterButton";
import { motion } from "framer-motion";
// import { pageTransitionStyles } from "../utils/constants";
import {
  counterObjType,
  DBConnectionStateType,
  languageDirection,
  MaterialColor,
  userPreferencesType,
} from "../utils/types";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";

interface HomePageProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  toggleDBConnection: (action: DBConnectionStateType) => Promise<void>;
  // setUserPreferencesState: React.Dispatch<
  //   React.SetStateAction<userPreferencesType>
  // >;
  userPreferencesState: userPreferencesType;
  activeColor: MaterialColor;
  activeCounter: counterObjType;
  resetSingleCounter: (id: number) => Promise<void>;
  updateCountersState: (arr: counterObjType[]) => Promise<void>;
  countersArr: counterObjType[];
  setLanguageDirection: React.Dispatch<React.SetStateAction<languageDirection>>;
  languageDirection: languageDirection;
}

const HomePage = ({
  dbConnection,
  toggleDBConnection,
  // setUserPreferencesState,
  userPreferencesState,
  activeColor,
  activeCounter,
  resetSingleCounter,
  updateCountersState,
  countersArr,
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
        userPreferencesState={userPreferencesState}
        activeColor={activeColor}
        countersArr={countersArr}
        updateCountersState={updateCountersState}
        activeCounter={activeCounter}
      />
    </motion.main>
  );
};

export default HomePage;
