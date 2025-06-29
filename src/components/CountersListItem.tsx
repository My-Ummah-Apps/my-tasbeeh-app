import { MdDeleteOutline, MdEdit, MdOutlineRestartAlt } from "react-icons/md";

import { Link } from "react-router-dom";
import {
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonReorder,
} from "@ionic/react";
import { direction } from "direction";
import { counterObjType, MaterialColor } from "../utils/types";
import { useRef } from "react";

interface CountersListItemProps {
  updateActiveCounter: (
    counterId: number,
    color: MaterialColor,
    delay?: boolean
  ) => Promise<void>;
  setShowResetActionSheet: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDeleteActionSheet: React.Dispatch<React.SetStateAction<boolean>>;
  setCounterId: React.Dispatch<React.SetStateAction<number | null>>;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  color: MaterialColor;
  counterItem: counterObjType;
}

const CountersListItem = ({
  updateActiveCounter,
  setShowResetActionSheet,
  setShowDeleteActionSheet,
  setCounterId,
  setShowForm,
  color,
  counterItem,
}: CountersListItemProps) => {
  const slidingRef = useRef<HTMLIonItemSlidingElement | null>(null);
  const closeOpenSlidingItems = () => {
    slidingRef.current?.closeOpened();
  };

  return (
    <IonItemSliding disabled={false} ref={slidingRef}>
      <IonItem mode="ios">
        <div
          className="single-counter-wrap"
          style={{
            backgroundColor: color + "BF",
          }}
          onClick={async () => {
            updateActiveCounter(counterItem.id, color);
          }}
        >
          <div className="single-counter-name-and-count-wrap w-[95%]">
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
        <IonReorder slot="end" />
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
            setCounterId(counterItem.id);
            setShowResetActionSheet(true);
          }}
        >
          <MdOutlineRestartAlt className="text-4xl bg-[rgba(239,128,80,0.75)] p-2 rounded-3xl" />
        </IonItemOption>
        <IonItemOption
          mode="ios"
          className="swipe-options"
          onClick={async () => {
            setCounterId(counterItem.id);
            setShowDeleteActionSheet(true);
          }}
        >
          <MdDeleteOutline className="text-4xl bg-[rgba(239,83,80,0.75)] p-2 rounded-3xl" />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default CountersListItem;
