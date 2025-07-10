import { useEffect, useState } from "react";
import { IonList } from "@ionic/react";
import slideToRevealImg from "/src/images/slide-to-reveal.png";

import { MdAdd, MdOutlineRestartAlt } from "react-icons/md";
import CountersListItem from "../components/CountersListItem";
import { materialColors } from "../utils/constants";
import { counterObjType, MaterialColor } from "../utils/types";
import { motion } from "framer-motion";
import BottomSheetForm from "../components/BottomSheets/BottomSheetForm";
import Toast from "../components/Toast";
import ActionSheet from "../components/ActionSheet";
import { useLocation } from "react-router-dom";
import Overlay from "../components/Overlay";

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
  setShowAddSuccessToast: React.Dispatch<React.SetStateAction<boolean>>;
  showAddSuccessToast: boolean;
  setShowEditSuccessToast: React.Dispatch<React.SetStateAction<boolean>>;
  showEditSuccessToast: boolean;
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
  setShowAddSuccessToast,
  showAddSuccessToast,
  setShowEditSuccessToast,
  showEditSuccessToast,
}: CountersPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [showResetToast, setShowResetToast] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [showResetActionSheet, setShowResetActionSheet] = useState(false);
  const [showDeleteActionSheet, setShowDeleteActionSheet] = useState(false);

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
      <Toast
        isOpen={showEditSuccessToast}
        message="Tasbeeh edited successfully"
        setShow={setShowEditSuccessToast}
      />
      <Toast
        isOpen={showAddSuccessToast}
        message="Tasbeeh added successfully"
        setShow={setShowAddSuccessToast}
      />

      {showSwipeHint && (
        <>
          <Overlay />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="slide-to-reveal-options-wrap fixed z-[10001] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          text-center px-6 py-5 rounded-xl shadow-xl w-[90%]"
          >
            <img src={slideToRevealImg} alt="" className="mx-auto mb-3" />
            <h2 className="text-lg font-semibold mb-2">{"Swipe to reveal"}</h2>
            <p className="text-base mb-5">
              {"Swipe left on a tasbeeh to reveal more options"}
            </p>
            <p
              className="pt-5 text-right"
              onClick={() => {
                setShowSwipeHint(false);
              }}
            >
              GOT IT
            </p>
          </motion.div>
        </>
      )}
    </motion.main>
  );
}

export default CountersPage;
