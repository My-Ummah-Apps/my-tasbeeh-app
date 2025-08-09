import { useEffect, useState } from "react";

import slideToRevealImg from "/src/images/slide-to-reveal.png";

import {
  IonList,
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/react";

import CountersListItem from "../components/CountersListItem";
import { materialColors } from "../utils/constants";
import { counterObjType, MaterialColor } from "../utils/types";
import { motion } from "framer-motion";
import BottomSheetForm from "../components/BottomSheets/BottomSheetForm";
import Toast from "../components/Toast";
import ActionSheet from "../components/ActionSheet";
import { useLocation } from "react-router-dom";
import Overlay from "../components/Overlay";
import { add, refresh } from "ionicons/icons";

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
      setShowAddSuccessToast(false);
      setShowEditSuccessToast(false);
    };
  }, [location.pathname]);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="header-toolbar">
          <IonTitle className="">Tasbeehs</IonTitle>
          <IonButtons slot="secondary">
            <IonButton
              id="open-reset-all-counters-action-sheet"
              style={{
                "--padding-end": "12px",
                "--ripple-color": "transparent",
              }}
            >
              <IonIcon
                className="text-2xl text-[var(--ion-text-color)]"
                icon={refresh}
              />
            </IonButton>
          </IonButtons>
          <IonButtons slot="primary">
            <IonButton
              onClick={() => {
                setCounterId(null);
                setShowForm(true);
              }}
              style={{
                "--padding-end": "12px",
                "--ripple-color": "transparent",
              }}
            >
              {" "}
              <IonIcon
                className="text-2xl text-[var(--ion-text-color)]"
                icon={add}
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <motion.main
        // className="relative"
        //  {...pageTransitionStyles}
        >
          <ActionSheet
            trigger="open-reset-all-counters-action-sheet"
            header="Are you sure you want to reset all Tasbeehs to 0?"
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
            message="Tasbeeh reset to 0"
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
        </motion.main>
      </IonContent>
      {showSwipeHint && (
        <>
          <Overlay />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="z-[10001] fixed bottom-[calc(20px+10vh)]
          text-center px-6 py-5 rounded-xl shadow-xl bg-[var(--body-bg-color)] color-[var(--text-color)]"
          >
            <img src={slideToRevealImg} alt="" className="mx-auto mb-3" />
            <h2 className="mb-2 text-lg font-semibold">{"Swipe to reveal"}</h2>
            <p className="mb-5 text-base">
              {"Swipe left on a tasbeeh to reveal more options"}
            </p>
            <IonButton
              className="mt-5"
              onClick={() => {
                setShowSwipeHint(false);
              }}
            >
              CLOSE
            </IonButton>
          </motion.div>
        </>
      )}
    </IonPage>
  );
}

export default CountersPage;
