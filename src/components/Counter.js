import { FaPen } from "react-icons/fa";

const Counter = ({
  nextColor,
  invokeSetActiveCounter,
  counterItem,
  setCurrentCounterName,
  setcurrentCount,
  setCounterTarget,
  setcurrentCounterId,
  handleOpenModal,
}) => {
  return (
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
        <div className="single-counter-count">
          {counterItem.count} / {counterItem.target}
        </div>
        <div className="single-counter-counter-name">{counterItem.counter}</div>
      </div>
      <div
        className="edit-btn-wrap"
        onClick={(e) => {
          e.stopPropagation();
          setCurrentCounterName(counterItem.counter);
          setcurrentCount(counterItem.count);
          setCounterTarget(counterItem.target);
          setcurrentCounterId(counterItem.id);
          handleOpenModal();
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
  );
};

export default Counter;
