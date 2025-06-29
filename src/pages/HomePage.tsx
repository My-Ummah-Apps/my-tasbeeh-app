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
import Toast from "../components/Toast";

interface HomePageProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  toggleDBConnection: (action: DBConnectionStateType) => Promise<void>;
  showNextCounterToast: boolean;
  isNextCounterLoading: boolean;
  setShowNextCounterToast: React.Dispatch<React.SetStateAction<boolean>>;
  userPreferencesState: userPreferencesType;
  updateActiveCounter: (
    counterId: number,
    color: MaterialColor,
    delay?: boolean
  ) => Promise<void>;
  activeColor: MaterialColor;
  activeCounter: counterObjType;
  resetSingleCounter: (id: number) => Promise<void>;
  updateCountersState: (arr: counterObjType[]) => void;
  countersState: counterObjType[];
  setLanguageDirection: React.Dispatch<React.SetStateAction<languageDirection>>;
  languageDirection: languageDirection;
}

const HomePage = ({
  dbConnection,
  toggleDBConnection,
  setShowNextCounterToast,
  isNextCounterLoading,
  showNextCounterToast,
  userPreferencesState,
  updateActiveCounter,
  activeColor,
  activeCounter,
  resetSingleCounter,
  updateCountersState,
  countersState,
  setLanguageDirection,
  languageDirection,
}: HomePageProps) => {
  return (
    <motion.main
      // {...pageTransitionStyles}
      className="main-page-wrap"
    >
      {isNextCounterLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 9999,
            pointerEvents: "auto",
          }}
        />
      )}

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
        updateActiveCounter={updateActiveCounter}
        activeColor={activeColor}
        countersState={countersState}
        updateCountersState={updateCountersState}
        activeCounter={activeCounter}
      />
      <Toast
        isOpen={showNextCounterToast}
        message="Loading next counter..."
        setShow={setShowNextCounterToast}
        duration={1500}
      />
    </motion.main>
  );
};

export default HomePage;
