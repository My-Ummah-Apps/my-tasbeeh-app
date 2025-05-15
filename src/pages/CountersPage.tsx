import { useState, useRef, useEffect } from "react";
import { Sheet } from "react-modal-sheet";
import { MdAdd } from "react-icons/md";
import CountersListItem from "../components/CountersListItem";
import { materialColors, TWEEN_CONFIG } from "../utils/constants";
import Form from "../components/Form";
import { counterObjType } from "../utils/types";

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
}

function CountersPage({
  activeCounter,
  setAndStoreCounters,
  deleteSingleCounter,
  countersArr,
  modifyCounter,
  addCounter,
}: CountersPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [isEditingCounter, setIsEditingCounter] = useState(false);

  // ! REFACTOR BELOW
  let nextColorIndex = 0;
  let nextColor;

  const [editingCounterId, setEditingCounterId] = useState("");

  return (
    <div className={`counters-page-wrap`}>
      <div className="counters-page-header">
        <p>Adhkar</p>
        <MdAdd
          onClick={() => {
            setIsEditingCounter(false);
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
              isEditingCounter={isEditingCounter}
              editingCounterId={editingCounterId}
              setShowForm={setShowForm}
              showForm={showForm}
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
              setIsEditingCounter={setIsEditingCounter}
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
