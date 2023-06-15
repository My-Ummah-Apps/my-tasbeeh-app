import { useRef, useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";

import { VscDebugRestart } from "react-icons/vsc";

const CounterNameAndNumber = ({
  localSavedCountersArray,
  showAnimation,
  setActiveBackgroundColor,
  activeBackgroundColor,
  resetSingleCounter,
}) => {
  let currentName;
  let currentNumber = 0;
  let currentCounterTarget;
  let currentCounterId;
  let textOverflowProperty;
  localSavedCountersArray.map((counterItem) => {
    if (counterItem.isActive == true) {
      setActiveBackgroundColor(counterItem.color);

      currentName = counterItem.counter;
      currentCounterTarget = counterItem.target;
      currentNumber = counterItem.count;
      currentCounterId = counterItem.id;

      currentName.length > 50
        ? (textOverflowProperty = "ellipsis")
        : (textOverflowProperty = "clip");
    }
  });

  const counterTextContainerRef = useRef(null);
  const textRef = useRef(null);

  const [scroll, setScroll] = useState();

  let scrollingStyle = { overflow: "hidden" };
  const [overflow, setOverflow] = useState({ overflow: "hidden" });

  useEffect(() => {
    const counterTextContainerWidth =
      counterTextContainerRef.current.clientWidth;

    if (textRef.current.clientWidth < counterTextContainerWidth) {
      setScroll(false);

      setOverflow({ overflow: "unset" });
    } else if (textRef.current.clientWidth > counterTextContainerWidth) {
      setScroll(true);

      setOverflow({ overflow: "unset" });
    }
  }, [textRef.current]);

  return (
    <>
      <div
        className="single-counter"
        style={{
          // backgroundColor: nextColor + "99",
          // backgroundColor: nextColor + "FF",
          // color: "black",
          backgroundColor: activeBackgroundColor + "99",
        }}
      >
        <div className="single-counter-name-and-count-wrap">
          <div className="single-counter-count">
            {currentNumber} / {currentCounterTarget}
          </div>
          <div className="single-counter-counter-name">{currentName}</div>
        </div>
        <div
          className="edit-btn-wrap"
          onClick={(e) => {
            e.stopPropagation();
            resetSingleCounter(currentCounterId);
          }}
        >
          <VscDebugRestart />
        </div>

        <div
          className="single-counter-overlay"
          style={{
            backgroundColor: activeBackgroundColor,
            width: (currentNumber / currentCounterTarget) * 100 + "%",

            // width: singleCounterStyles(count, target),
          }}
        ></div>
      </div>
      <div
        className="counter-type-wrap"
        style={{
          // backgroundColor: activeBackgroundColor + "99",
          backgroundColor: activeBackgroundColor + "FF",
        }}
        ref={counterTextContainerRef}
      >
        <div className="counter-text-wrap" ref={textRef}>
          {/* <div
        className={`counter-text-wrap ${
          showAnimation ? "fade-down-animation" : null
        }`}
        ref={textRef}
      > */}
          <div className={scroll ? "scroll" : ""}>
            <div className={scroll ? "m-scroll" : ""}>
              <span
                className="active-counter-name"
                style={{
                  fontSize: "3rem",
                  textOverflow: textOverflowProperty,
                }}
              >
                {currentName}
              </span>
              <span
                className={scroll ? "active-counter-name" : "display-none"}
                style={{
                  fontSize: "3rem",
                  textOverflow: textOverflowProperty,
                }}
              >
                {currentName}
              </span>
            </div>
          </div>
        </div>

        {/* <h1 className="active-counter-number">{activeCounterNumber}</h1> */}
      </div>
    </>
  );
};

export default CounterNameAndNumber;
