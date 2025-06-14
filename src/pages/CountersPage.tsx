import { useState } from "react";
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
  modifyCounter: (
    id: number,
    modifiedCounterName: string,
    modifiedCount: number,
    modifiedTarget: number
  ) => Promise<void>;
  deleteCounter: (id: number) => Promise<void>;
}

function CountersPage({
  dbConnection,
  toggleDBConnection,
  updateUserPreference,
  activeColor,
  setActiveColor,
  activeCounter,
  updateCountersState,
  deleteCounter: deleteCounter,
  countersState,
  modifyCounter,
  addCounter,
}: CountersPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [counterId, setCounterId] = useState<number | null>(null);

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
      <BottomSheetForm
        activeColor={activeColor}
        countersState={countersState}
        activeCounter={activeCounter}
        deleteCounter={deleteCounter}
        setCounterId={setCounterId}
        counterId={counterId}
        setShowForm={setShowForm}
        showForm={showForm}
        modifyCounter={modifyCounter}
        addCounter={addCounter}
      />
      <section className="counters-wrap">
        {countersState.map((counterItem: counterObjType, i) => {
          let color = materialColors[i % materialColors.length];

          return (
            <CountersListItem
              key={counterItem.id}
              dbConnection={dbConnection}
              toggleDBConnection={toggleDBConnection}
              updateUserPreference={updateUserPreference}
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
      </section>
    </motion.main>
  );
}

export default CountersPage;
