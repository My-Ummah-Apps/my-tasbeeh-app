import { useState, useRef, useEffect } from "react";
import { Sheet } from "react-modal-sheet";
import { MdAdd } from "react-icons/md";
import CountersListItem from "../components/CountersListItem";
import { materialColors, TWEEN_CONFIG } from "../utils/constants";
import Form from "../components/Form";
import { counterObjType } from "../utils/types";
import { Capacitor } from "@capacitor/core";

interface CountersPageProps {
  activeCounter: counterObjType;
  setAndStoreCounters: (arr: counterObjType[]) => void;
  deleteSingleCounter: (id: string) => void;
  countersArr: counterObjType[];
  modifyCounter: (
    id: string,
    modifiedCounterName: string,
    modifiedCount: number,
    modifiedTarget: number
  ) => void;
  addCounter: (counterToAdd: string, target: number) => void;
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
}

function CountersPage({
  activeCounter,
  setAndStoreCounters,
  deleteSingleCounter,
  countersArr,
  modifyCounter,
  addCounter,
  setActivePage,
}: CountersPageProps) {
  const formFilledRef = useRef(null);
  // ! Is the below even needed? wasn't even being utilised
  if (Capacitor.getPlatform() === "ios") {
    // Keyboard.setAccessoryBarVisible({ isVisible: true });
    window.addEventListener("keyboardWillShow", (e) => {
      if (formFilledRef.current) {
        formFilledRef.current.style.marginBottom = e.keyboardHeight + "px";
      }
    });
    window.addEventListener("keyboardWillHide", (e) => {
      if (formFilledRef.current) {
        formFilledRef.current.style.marginBottom = "0px";
      }
    });
  }

  const [showForm, setShowForm] = useState(false);
  const [addNewCounter, setAddNewCounter] = useState(false);

  let nextColorIndex = 0;
  let nextColor;

  const [editingCounterId, setEditingCounterId] = useState(0);

  return (
    <div className={`counters-page-wrap`}>
      <div className="counters-page-header">
        <p>Adhkar</p>
        <MdAdd
          onClick={() => {
            setAddNewCounter(true);
            setShowForm(true);
          }}
        />
      </div>

      <Sheet
        style={{ willChange: "transform" }}
        disableDrag={false}
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        detent="full-height"
        tweenConfig={TWEEN_CONFIG}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            {/* <Sheet.Scroller> */}{" "}
            <Form
              countersArr={countersArr}
              activeCounter={activeCounter}
              deleteSingleCounter={deleteSingleCounter}
              addNewCounter={addNewCounter}
              editingCounterId={editingCounterId}
              setShowForm={setShowForm}
              modifyCounter={modifyCounter}
              addCounter={addCounter}
            />
            {/* </Sheet.Scroller> */}
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setShowForm(false)} />
      </Sheet>

      <div className="counters-wrap">
        {countersArr.map((counterItem: counterObjType) => {
          nextColor = materialColors[nextColorIndex];
          counterItem.color = nextColor;
          nextColorIndex == materialColors.length - 1
            ? (nextColorIndex = 0)
            : (nextColorIndex += 1);
          return (
            <CountersListItem
              key={counterItem.id}
              setAndStoreCounters={setAndStoreCounters}
              countersArr={countersArr}
              setEditingCounterId={setEditingCounterId}
              setActivePage={setActivePage}
              setAddNewCounter={setAddNewCounter}
              setShowForm={setShowForm}
              nextColor={nextColor}
              counterItem={counterItem}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CountersPage;
