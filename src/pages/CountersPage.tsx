import { useState } from "react";
import { MdAdd } from "react-icons/md";
import CountersListItem from "../components/CountersListItem";
import { materialColors } from "../utils/constants";
import { counterObjType, MaterialColor } from "../utils/types";
import BottomSheetForm from "../components/BottomSheets/BottomSheetForm";

interface CountersPageProps {
  activeColor: MaterialColor;
  setActiveColor: React.Dispatch<MaterialColor>;
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
  activeColor,
  setActiveColor,
  activeCounter,
  setAndStoreCounters,
  deleteSingleCounter,
  countersArr,
  modifyCounter,
  addCounter,
}: CountersPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingCounterId, setEditingCounterId] = useState<string | null>(null);

  return (
    <section className={`counters-page-wrap`}>
      <div className="counters-page-header">
        <p>Adhkar</p>
        <MdAdd
          onClick={() => {
            setEditingCounterId(null);
            setShowForm(true);
          }}
        />
      </div>
      <BottomSheetForm
        activeColor={activeColor}
        countersArr={countersArr}
        activeCounter={activeCounter}
        deleteSingleCounter={deleteSingleCounter}
        setEditingCounterId={setEditingCounterId}
        editingCounterId={editingCounterId}
        setShowForm={setShowForm}
        showForm={showForm}
        modifyCounter={modifyCounter}
        addCounter={addCounter}
      />
      <section className="counters-wrap">
        {countersArr.map((counterItem: counterObjType, i) => {
          let color = materialColors[i % materialColors.length];

          return (
            <CountersListItem
              setActiveColor={setActiveColor}
              key={counterItem.id}
              setAndStoreCounters={setAndStoreCounters}
              countersArr={countersArr}
              setEditingCounterId={setEditingCounterId}
              setShowForm={setShowForm}
              color={color}
              counterItem={counterItem}
            />
          );
        })}
      </section>
    </section>
  );
}

export default CountersPage;
