import { MdDeleteOutline, MdEdit, MdOutlineRestartAlt } from "react-icons/md";

import { Link } from "react-router-dom";
import {
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from "@ionic/react";
import { direction } from "direction";
import {
  counterObjType,
  DBConnectionStateType,
  MaterialColor,
  PreferenceKeyType,
} from "../utils/types";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { showConfirmDialog } from "../utils/constants";
import { useRef } from "react";

interface CountersListItemProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  toggleDBConnection: (action: DBConnectionStateType) => Promise<void>;
  updateUserPreference: (
    preferenceName: PreferenceKeyType,
    preferenceValue: number | MaterialColor
  ) => Promise<void>;
  setShowResetToast: React.Dispatch<React.SetStateAction<boolean>>;
  resetSingleCounter: (id: number) => Promise<void>;
  deleteCounter: (id: number) => Promise<void>;
  setActiveColor: React.Dispatch<MaterialColor>;
  updateCountersState: (arr: counterObjType[]) => void;
  setCounterId: React.Dispatch<React.SetStateAction<number | null>>;
  countersState: counterObjType[];
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  color: MaterialColor;
  counterItem: counterObjType;
}

const CountersListItem = ({
  dbConnection,
  toggleDBConnection,
  updateUserPreference,
  setShowResetToast,
  resetSingleCounter,
  deleteCounter,
  setActiveColor,
  updateCountersState,
  setCounterId,
  countersState,
  setShowForm,
  color,
  counterItem,
}: CountersListItemProps) => {
  const slidingRef = useRef<HTMLIonItemSlidingElement | null>(null);
  const closeOpenSlidingItems = () => {
    slidingRef.current?.closeOpened();
  };
  return (
    <IonItemSliding ref={slidingRef}>
      <IonItem mode="ios">
        {/* <ion-label>Sliding Item with End Options</ion-label> */}
        <div
          className="single-counter-wrap"
          style={{
            backgroundColor: color + "BF",
          }}
          onClick={async () => {
            setCounterId(counterItem.id);
            setActiveColor(color);
            const updatedCountersArr: counterObjType[] = countersState.map(
              (counter: counterObjType) => {
                return counter.id === counterItem.id
                  ? { ...counter, isActive: 1 }
                  : { ...counter, isActive: 0 };
              }
            );
            updateCountersState(updatedCountersArr);
            await updateUserPreference("activeColor", color);

            try {
              await toggleDBConnection("open");
              await dbConnection.current!.run(
                `UPDATE counterDataTable SET isActive = 0`
              );
              await dbConnection.current!.run(
                `UPDATE counterDataTable SET isActive = 1 WHERE id = ?`,
                [counterItem.id]
              );
            } catch (error) {
              console.error(
                "Error updating active counter/active color: ",
                error
              );
            } finally {
              await toggleDBConnection("close");
            }
          }}
        >
          <div className="single-counter-name-and-count-wrap">
            <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
              <div className="single-counter-count">
                {counterItem.count} / {counterItem.target}
              </div>
              <div
                style={{
                  textAlign:
                    direction(counterItem.name) === "ltr" ? "left" : "right",
                  // direction: direction(counterItem.counter),
                }}
                className="single-counter-counter-name"
              >
                {counterItem.name}
              </div>
            </Link>
          </div>

          <div
            className="single-counter-overlay"
            style={{
              backgroundColor: color,
              width: (counterItem.count / counterItem.target) * 100 + "%",
            }}
          ></div>
        </div>
      </IonItem>

      <IonItemOptions>
        <IonItemOption
          mode="ios"
          className="swipe-options"
          onClick={(e) => {
            e.stopPropagation();
            setCounterId(counterItem.id);
            setShowForm(true);
            setTimeout(() => {
              closeOpenSlidingItems();
            }, 500);
          }}
        >
          <MdEdit className="text-4xl bg-[rgba(92,107,192,0.75)] p-2 rounded-3xl" />
        </IonItemOption>
        <IonItemOption
          mode="ios"
          className="swipe-options"
          onClick={async () => {
            const result = await showConfirmDialog(
              "Reset Tasbeeh",
              "Are you sure you want to reset this Tasbeeh to 0?"
            );
            if (result) {
              await resetSingleCounter(counterItem.id);
              closeOpenSlidingItems();
              setShowResetToast(true);
            }
          }}
        >
          <MdOutlineRestartAlt className="text-4xl bg-[rgba(239,128,80,0.75)] p-2 rounded-3xl" />
        </IonItemOption>
        <IonItemOption
          mode="ios"
          className="swipe-options"
          onClick={async () => {
            const result = await showConfirmDialog(
              "Delete Tasbeeh",
              "Are you sure you want to delete this Tasbeeh?"
            );
            if (result) {
              await deleteCounter(counterItem.id);
              // showToast("Tasbeeh deleted", "bottom", "short");
            }
          }}
        >
          <MdDeleteOutline className="text-4xl bg-[rgba(239,83,80,0.75)] p-2 rounded-3xl" />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default CountersListItem;
