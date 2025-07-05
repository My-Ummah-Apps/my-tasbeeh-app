import { useEffect, useState } from "react";
import { IonList } from "@ionic/react";

import { MdAdd, MdOutlineRestartAlt } from "react-icons/md";
import CountersListItem from "../components/CountersListItem";
import { materialColors } from "../utils/constants";
import { counterObjType, MaterialColor } from "../utils/types";
import { motion } from "framer-motion";
import BottomSheetForm from "../components/BottomSheets/BottomSheetForm";
import Toast from "../components/Toast";
import ActionSheet from "../components/ActionSheet";
import { useLocation } from "react-router-dom";

interface CountersPageProps {
  updateActiveCounter: (
    counterId: number,
    color: MaterialColor
  ) => Promise<void>;
  setCounterId: React.Dispatch<React.SetStateAction<number | null>>;
  counterId: number | null;
  activeColor: MaterialColor;
  activeCounter: counterObjType;
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
  resetAllCounters: () => Promise<void>;
  setShowAllResetToast: React.Dispatch<React.SetStateAction<boolean>>;
  showAllResetToast: boolean;
  deleteCounter: (id: number) => Promise<void>;
  setShowDeleteToast: React.Dispatch<React.SetStateAction<boolean>>;
  showDeleteToast: boolean;
}

function CountersPage({
  updateActiveCounter,
  setCounterId,
  counterId,
  activeColor,
  activeCounter,
  countersState,
  closeSlidingItems,
  modifyCounter,
  resetSingleCounter,
  resetAllCounters,
  showAllResetToast,
  setShowAllResetToast,
  addCounter,
  deleteCounter,
  setShowDeleteToast,
  showDeleteToast,
}: CountersPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [showResetToast, setShowResetToast] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [showResetActionSheet, setShowResetActionSheet] = useState(false);
  const [showDeleteActionSheet, setShowDeleteActionSheet] = useState(false);

  showSwipeHint;
  useEffect(() => {
    const hasSeenHint = localStorage.getItem("hasSeenSwipeHint");
    if (!hasSeenHint) {
      setShowSwipeHint(true);
      localStorage.setItem("hasSeenSwipeHint", "true");
    }
  }, []);

  const location = useLocation();

  useEffect(() => {
    return () => {
      setShowResetToast(false);
      setShowDeleteToast(false);
      setShowAllResetToast(false);
    };
  }, [location.pathname]);

  return (
    <motion.main
      // {...pageTransitionStyles}
      className={`counters-page-wrap`}
    >
      <header className="counters-page-header flex justify-between items-center">
        <MdOutlineRestartAlt id="open-reset-all-counters-action-sheet" />
        <p>Tasbeehs</p>
        <MdAdd
          onClick={() => {
            setCounterId(null);
            setShowForm(true);
          }}
        />
      </header>
      <ActionSheet
        trigger="open-reset-all-counters-action-sheet"
        header="Are you sure you want to reset all Tasbeehs?"
        buttons={[
          {
            text: "Reset All Tasbeehs",
            role: "destructive",
            handler: async () => {
              await resetAllCounters();
            },
          },
          {
            text: "Cancel",
            role: "cancel",
          },
        ]}
      />
      <Toast
        isOpen={showAllResetToast}
        message="All Tasbeehs reset to 0"
        setShow={setShowAllResetToast}
      />

      <IonList mode="ios" className="counters-wrap">
        {countersState.map((counterItem: counterObjType, i) => {
          let color = materialColors[i % materialColors.length];

          return (
            <CountersListItem
              key={counterItem.id}
              updateActiveCounter={updateActiveCounter}
              setShowResetActionSheet={setShowResetActionSheet}
              setShowDeleteActionSheet={setShowDeleteActionSheet}
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
