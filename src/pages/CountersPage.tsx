import { useState } from "react";
import { MdAdd } from "react-icons/md";
import CountersListItem from "../components/CountersListItem";
import { materialColors } from "../utils/constants";
import { counterObjType } from "../utils/types";
import BottomSheetForm from "../components/BottomSheets/BottomSheetsForm";

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
  const [editingCounterId, setEditingCounterId] = useState("");

  return (
    <section className={`counters-page-wrap`}>
      <div className="counters-page-header">
        <p>Adhkar</p>
        <MdAdd
          onClick={() => {
            setIsEditingCounter(false);
            setShowForm(true);
          }}
        />
      </div>
      <BottomSheetForm
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

      <div className="counters-wrap">
        {countersArr.map((counterItem: counterObjType, i) => {
          let nextColor = materialColors[i % materialColors.length];
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
    </section>
  );
}

export default CountersPage;
