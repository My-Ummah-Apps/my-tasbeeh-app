import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { direction } from "direction";
import { counterObjType, MaterialColor } from "../utils/types";

interface CountersListItemProps {
  setActiveColor: React.Dispatch<MaterialColor>;
  updateCountersState: (arr: counterObjType[]) => void;
  setEditingCounterId: React.Dispatch<React.SetStateAction<number | null>>;
  countersArr: counterObjType[];
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  color: MaterialColor;
  counterItem: counterObjType;
}

const CountersListItem = ({
  setActiveColor,
  updateCountersState,
  setEditingCounterId,
  countersArr,
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
        onClick={() => {
          setEditingCounterId(counterItem.id);
          setActiveColor(color);
          localStorage.setItem("activeColor", color);
          const updatedCountersArr: counterObjType[] = countersArr.map(
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
            setEditingCounterId(counterItem.id);
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
