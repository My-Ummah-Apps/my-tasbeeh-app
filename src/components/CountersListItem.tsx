import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { direction } from "direction";
import {
  counterObjType,
  DBConnectionStateType,
  MaterialColor,
  PreferenceKeyType,
} from "../utils/types";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";

interface CountersListItemProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  toggleDBConnection: (action: DBConnectionStateType) => Promise<void>;
  updateUserPreference: (
    preferenceName: PreferenceKeyType,
    preferenceValue: number | MaterialColor
  ) => Promise<void>;
  counterId: number;
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
  counterId,
  setActiveColor,
  updateCountersState,
  setCounterId,
  countersState,
  setShowForm,
  color,
  counterItem,
}: CountersListItemProps) => {
  return (
    <div className="single-counter-wrap-parent">
      <div
        className="single-counter-wrap"
        style={{
          backgroundColor: color + "BF",
        }}
        onClick={async () => {
          setCounterId(counterItem.id);

          try {
            await toggleDBConnection("open");
            // ! ACTIVE COLOR IS NOT PERSISTING UPON RELOAD
            await updateUserPreference("activeColor", color);

            await dbConnection.current?.run(
              `UPDATE counterDataTable SET isActive = 0`
            );
            console.log("COUNTERID", counterItem.id);

            await dbConnection.current?.run(
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

          setActiveColor(color);
          // localStorage.setItem("activeColor", color);
          const updatedCountersArr: counterObjType[] = countersState.map(
            (counter: counterObjType) => {
              return counter.id === counterItem.id
                ? { ...counter, isActive: 1 }
                : { ...counter, isActive: 0 };
            }
          );
          updateCountersState(updatedCountersArr);
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
                  direction(counterItem.counterName) === "ltr"
                    ? "left"
                    : "right",
                // direction: direction(counterItem.counter),
              }}
              className="single-counter-counter-name"
            >
              {counterItem.counterName}
            </div>
          </Link>
        </div>

        <button
          arial-label="Edit Counter"
          className="edit-btn-wrap"
          onClick={(e) => {
            e.stopPropagation();
            setCounterId(counterItem.id);
            setShowForm(true);
          }}
        >
          <MdEdit />
        </button>
        <div
          className="single-counter-overlay"
          style={{
            backgroundColor: color,
            width: (counterItem.count / counterItem.target) * 100 + "%",
          }}
        ></div>
      </div>
    </div>
  );
};

export default CountersListItem;
