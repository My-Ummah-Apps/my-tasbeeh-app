import ActiveCounter from "../components/ActiveCounter";
import CounterButton from "../components/CounterButton";
// import { motion } from "framer-motion";

import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";

import {
  counterObjType,
  DBConnectionStateType,
  languageDirection,
  MaterialColor,
  scrollSpeedValue,
  userPreferencesType,
} from "../utils/types";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import Toast from "../components/Toast";
import { useEffect, useRef, useState } from "react";
import { nextCounterDelay, speedMap } from "../utils/constants";
import { IonAlert } from "@ionic/react";
import Overlay from "../components/Overlay";
import { useLocation } from "react-router-dom";

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
  setScrollSpeed: React.Dispatch<React.SetStateAction<scrollSpeedValue>>;
  scrollSpeed: scrollSpeedValue;
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
  setScrollSpeed,
  scrollSpeed,
}: HomePageProps) => {
  const [count, setCount] = useState(3);
  const [isNextCounterLoading, setIsNextCounterLoading] = useState(false);
  const [showNextCounterToast, setShowNextCounterToast] = useState(false);
  const [showEndOfListAlert, setShowEndOfListAlert] = useState(false);
  let isAutoSwitchCancelled = useRef(false);

  // ! For some reason, userPreferencesState?.scrollSpeed below is reverting to 2
  // ! ie the initial state value thats set in app.tsx upon app launch or on page switch,
  // ! settings page -> homepage
  // ! as opposed to the latest value from the scroll sheet

  // console.log("userPreferencesState in homepage: ", userPreferencesState);

  // useIonViewWillEnter(() => {
  //   setScrollSpeed(userPreferencesState.scrollSpeed);
  //   console.log(
  //     "userPreferencesState?.scrollSpeed in homepage: ",
  //     userPreferencesState?.scrollSpeed
  //   );
  // });

  const location = useLocation();

  // useEffect(() => {
  //   setScrollSpeed(userPreferencesState.scrollSpeed);
  //   console.log(
  //     "userPreferencesState?.scrollSpeed in homepage state: ",
  //     userPreferencesState?.scrollSpeed
  //   );
  // }, [location]);

  useEffect(() => {
    if (count === 1 && !showNextCounterToast) {
      setCount(3);
    }

    if (showNextCounterToast) {
      count > 1 && setTimeout(() => setCount(count - 1), 1000);
    }
  }, [count, showNextCounterToast]);

  useEffect(() => {
    if (showNextCounterToast) {
      setIsNextCounterLoading(true);
    }
  }, [showNextCounterToast]);

  const cancellableDelay = () => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let rejectFn: (reason?: any) => void;

    const initiateDelay = () => {
      return new Promise((resolve, reject) => {
        timeoutId = setTimeout(resolve, nextCounterDelay);
        rejectFn = reject;
      });
    };

    const cancelDelay = () => {
      clearTimeout(timeoutId);
      if (rejectFn) rejectFn();
    };

    return {
      initiateDelay,
      cancelDelay,
    };
  };

  const cancellableDelayRef = useRef<ReturnType<
    typeof cancellableDelay
  > | null>(null);

  if (cancellableDelayRef.current === null) {
    cancellableDelayRef.current = cancellableDelay();
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="header-toolbar">
          <IonTitle className="">Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* <section className="home-page-wrap"> */}
        {isNextCounterLoading && <Overlay />}

        {/* <motion.main
          className="home-page-content-wrap"
          //  {...pageTransitionStyles}
        > */}
        <ActiveCounter
          userPreferencesState={userPreferencesState}
          activeColor={activeColor}
          activeCounter={activeCounter}
          resetSingleCounter={resetSingleCounter}
          setLanguageDirection={setLanguageDirection}
          languageDirection={languageDirection}
          setScrollSpeed={setScrollSpeed}
          scrollSpeed={scrollSpeed}
        />
        <CounterButton
          dbConnection={dbConnection}
          toggleDBConnection={toggleDBConnection}
          setShowNextCounterToast={setShowNextCounterToast}
          cancellableDelayRef={cancellableDelayRef}
          isAutoSwitchCancelled={isAutoSwitchCancelled}
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
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              handler: () => {
                isAutoSwitchCancelled.current = true;
                cancellableDelayRef.current?.cancelDelay();
              },
            },
            {
              text: "Switch now",
              role: "switch now",
              handler: () => {
                cancellableDelayRef.current?.cancelDelay();
              },
            },
          ]}
          setShow={setShowNextCounterToast}
          duration={nextCounterDelay - 500}
        />
        <IonAlert
          isOpen={showEndOfListAlert}
          header="No More Tasbeehs left"
          message="You've reached the end of your tasbeeh list."
          buttons={["GOT IT"]}
          backdropDismiss={false}
        />
        {/* </motion.main> */}
        {/* </section> */}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
