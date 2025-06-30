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
import { useEffect, useState } from "react";

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
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0 && !showNextCounterToast) {
      setCount(3);
    }

    if (showNextCounterToast) {
      count > 0 && setTimeout(() => setCount(count - 1), 1000);
    }
  }, [count, showNextCounterToast]);

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
        // isOpen={showNextCounterToast}
        isOpen={showNextCounterToast}
        message={`Loading next counter in ${count}`}
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              console.log("More Info clicked");
            },
          },
          {
            text: "Switch now",
            role: "switch now",
            handler: () => {
              console.log("Dismiss clicked");
            },
          },
        ]}
        setShow={setShowNextCounterToast}
        duration={3000}
      />
    </motion.main>
  );
};

export default HomePage;
