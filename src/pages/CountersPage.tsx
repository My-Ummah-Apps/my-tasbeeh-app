import { useEffect, useState } from "react";
import { IonList } from "@ionic/react";

import { MdAdd } from "react-icons/md";
import CountersListItem from "../components/CountersListItem";
import { materialColors } from "../utils/constants";
import {
  counterObjType,
  DBConnectionStateType,
  MaterialColor,
  PreferenceKeyType,
} from "../utils/types";
import { motion } from "framer-motion";
import BottomSheetForm from "../components/BottomSheets/BottomSheetForm";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import Toast from "../components/Toast";
import ActionSheet from "../components/ActionSheet";

interface CountersPageProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  toggleDBConnection: (action: DBConnectionStateType) => Promise<void>;
  updateUserPreference: (
    preferenceName: PreferenceKeyType,
    preferenceValue: number | MaterialColor
  ) => Promise<void>;
  activeColor: MaterialColor;
  setActiveColor: React.Dispatch<MaterialColor>;
  activeCounter: counterObjType;
  updateCountersState: (arr: counterObjType[]) => void;
  countersState: counterObjType[];
  addCounter: (counterToAdd: string, target: number) => Promise<void>;
  closeSlidingItems: () => void;
  modifyCounter: (
    id: number,
    modifiedCounterName: string,
    modifiedCount: number,
    modifiedTarget: number
  ) => Promise<void>;
  resetSingleCounter: (id: number) => Promise<void>;
  deleteCounter: (id: number) => Promise<void>;
  setShowDeleteToast: React.Dispatch<React.SetStateAction<boolean>>;
  showDeleteToast: boolean;
}

function CountersPage({
  dbConnection,
  toggleDBConnection,
  updateUserPreference,
  activeColor,
  setActiveColor,
  activeCounter,
  updateCountersState,
  countersState,
  closeSlidingItems,
  modifyCounter,
  resetSingleCounter,
  addCounter,
  deleteCounter,
  setShowDeleteToast,
  showDeleteToast,
}: CountersPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [counterId, setCounterId] = useState<number | null>(null);
  const [showResetActionSheet, setShowResetActionSheet] = useState(false);
  const [showDeleteActionSheet, setShowDeleteActionSheet] = useState(false);
  const [showResetToast, setShowResetToast] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);

  useEffect(() => {
    const hasSeenHint = localStorage.getItem("hasSeenSwipeHint");
    if (!hasSeenHint) {
      setShowSwipeHint(true);
      localStorage.setItem("hasSeenSwipeHint", "true");
    }
  }, []);

  return (
    <motion.main
      // {...pageTransitionStyles}
      className={`counters-page-wrap`}
    >
      <header className="counters-page-header">
        <p>Adhkar</p>
        <MdAdd
          onClick={() => {
            setCounterId(null);
            setShowForm(true);
          }}
        />
      </header>
      <IonList mode="ios" className="counters-wrap ">
        {countersState.map((counterItem: counterObjType, i) => {
          let color = materialColors[i % materialColors.length];

          return (
            <CountersListItem
              key={counterItem.id}
              dbConnection={dbConnection}
              toggleDBConnection={toggleDBConnection}
              updateUserPreference={updateUserPreference}
              setShowResetActionSheet={setShowResetActionSheet}
              setShowDeleteActionSheet={setShowDeleteActionSheet}
              setActiveColor={setActiveColor}
              updateCountersState={updateCountersState}
              countersState={countersState}
              setCounterId={setCounterId}
              setShowForm={setShowForm}
              color={color}
              counterItem={counterItem}
            />
          );
        })}
      </IonList>
      <BottomSheetForm
        activeColor={activeColor}
        countersState={countersState}
        activeCounter={activeCounter}
        setCounterId={setCounterId}
        counterId={counterId}
        setShowForm={setShowForm}
        showForm={showForm}
        modifyCounter={modifyCounter}
        addCounter={addCounter}
      />
      <ActionSheet
        setState={setShowResetActionSheet}
        isOpen={showResetActionSheet}
        header="Are you sure you want to reset this tasbeeh?"
        buttons={[
          {
            text: "Reset Tasbeeh",
            role: "destructive",
            handler: async () => {
              if (counterId == null) {
                console.error(
                  "CounterId does not exist within Reset Tasbeeh ActionSheet Buttons"
                );
                return;
              }

              await resetSingleCounter(counterId);
              closeSlidingItems();
              setShowResetToast(true);
              setCounterId(null);
            },
          },

          {
            text: "Cancel",
            role: "cancel",
            handler: async () => {
              setCounterId(null);
            },
          },
        ]}
      />
      <ActionSheet
        setState={setShowDeleteActionSheet}
        isOpen={showDeleteActionSheet}
        header="Are you sure you want to delete this tasbeeh?"
        buttons={[
          {
            text: "Delete Tasbeeh",
            role: "destructive",
            handler: async () => {
              if (counterId == null) {
                console.error(
                  "CounterId does not exist within Delete Tasbeeh ActionSheet Buttons"
                );
                return;
              }
              await deleteCounter(counterId);
              setCounterId(null);
            },
          },
          {
            text: "Cancel",
            role: "cancel",
            handler: async () => {
              setCounterId(null);
            },
          },
        ]}
      />
      <Toast
        isOpen={showResetToast}
        message="Tasbeeh reset"
        setShow={setShowResetToast}
      />
      <Toast
        isOpen={showDeleteToast}
        message="Tasbeeh deleted"
        setShow={setShowDeleteToast}
      />
    </motion.main>
  );
}

export default CountersPage;
