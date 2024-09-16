import { FaPen } from "react-icons/fa";
import { Link } from "react-router-dom";
import { direction } from "direction";

const Counter = ({
  setIsFormFilledSheetOpen,
  nextColor,
  invokeSetActiveCounter,
  counterItem,
  setCurrentCounterName,
  setcurrentCount,
  setCounterTarget,
  setcurrentCounterId,
  handleOpenModal,
  setActivePage,
}) => {
  return (
    <div className="single-counter-wrap-parent">
      <div
        className="single-counter-wrap"
        style={{
          backgroundColor: nextColor + "BF",
          // backgroundColor: nextColor + "FF",
          // color: "black",
          // backgroundColor: nextColor,
        }}
        onClick={() => {
          invokeSetActiveCounter(counterItem.id);
        }}
      >
        <div className="single-counter-name-and-count-wrap">
          <Link
            onClick={() => {
              setActivePage("home");
            }}
            to="/"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            <div className="single-counter-count">
              {counterItem.count} / {counterItem.target}
            </div>

            <div
              style={{
                textAlign:
                  direction(counterItem.counter) === "ltr" ? "left" : "right",
                direction: direction(counterItem.counter),
              }}
              className="single-counter-counter-name"
            >
              {counterItem.counter}
            </div>
          </Link>
        </div>

        <div
          className="edit-btn-wrap"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentCounterName(counterItem.counter);
            setcurrentCount(counterItem.count);
            setCounterTarget(counterItem.target);
            setcurrentCounterId(counterItem.id);
            setIsFormFilledSheetOpen(true);
          }}
        >
          {/* <MdModeEditOutline /> */}
          <FaPen />
        </div>

        <div
          className="single-counter-overlay"
          style={{
            backgroundColor: nextColor,
            width: (counterItem.count / counterItem.target) * 100 + "%",
            // width: singleCounterStyles(count, target),
          }}
        ></div>
      </div>
    </div>
  );
};

export default Counter;
