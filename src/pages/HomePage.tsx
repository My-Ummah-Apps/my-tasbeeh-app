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
import { nextCounterDelay } from "../utils/constants";
import { IonAlert } from "@ionic/react";

interface HomePageProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  toggleDBConnection: (action: DBConnectionStateType) => Promise<void>;
  userPreferencesState: userPreferencesType;
  updateActiveCounter: (
    counterId: number,
    color: MaterialColor
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
  const [isNextCounterLoading, setIsNextCounterLoading] = useState(false);
  const [showNextCounterToast, setShowNextCounterToast] = useState(false);
  const [showEndOfListAlert, setShowEndOfListAlert] = useState(false);

  useEffect(() => {
    if (count === 0 && !showNextCounterToast) {
      setCount(3);
    }

    if (showNextCounterToast) {
      count > 0 && setTimeout(() => setCount(count - 1), 1000);
    }
  }, [count, showNextCounterToast]);

  useEffect(() => {
    if (showNextCounterToast) {
      setIsNextCounterLoading(true);
    }
  }, [showNextCounterToast]);

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
        <p>Home1</p>
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
        setShowNextCounterToast={setShowNextCounterToast}
        setShowEndOfListAlert={setShowEndOfListAlert}
        userPreferencesState={userPreferencesState}
        updateActiveCounter={updateActiveCounter}
        activeColor={activeColor}
        countersState={countersState}
        updateCountersState={updateCountersState}
        activeCounter={activeCounter}
      />
      <Toast
        isOpen={showNextCounterToast}
        setIsNextCounterLoading={setIsNextCounterLoading}
        message={`Loading next tasbeeh in ${count}`}
        // buttons={[
        //   {
        //     text: "Cancel",
        //     role: "cancel",
        //     handler: () => {
        //       console.log("More Info clicked");
        //     },
        //   },
        //   {
        //     text: "Switch now",
        //     role: "switch now",
        //     handler: () => {
        //       console.log("Dismiss clicked");
        //     },
        //   },
        // ]}
        setShow={setShowNextCounterToast}
        duration={nextCounterDelay}
      />
      <IonAlert
        isOpen={showEndOfListAlert}
        header="No More Tasbeeh left"
        message="You've reached the end of your tasbeeh list."
        buttons={["OK"]}
        backdropDismiss={false}
      />
    </motion.main>
  );
};

export default HomePage;
