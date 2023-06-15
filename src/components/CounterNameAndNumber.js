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
        className="single-counter-wrap"
        style={{
          backgroundColor: activeBackgroundColor + "99",
          boxShadow: `0px 5px 20px ${activeBackgroundColor}`,
        }}
      >
        <div
          className="single-counter-name-and-count-wrap"
          ref={counterTextContainerRef}
        >
          <div className="single-counter-count">
            {currentNumber} / {currentCounterTarget}
          </div>
          <div className="single-counter-counter-name" ref={textRef}>
            <div className={scroll ? "scroll" : ""}>
              <div className={scroll ? "m-scroll" : ""}>
                <span
                  className="active-counter-name"
                  style={{
                    textOverflow: textOverflowProperty,
                  }}
                >
                  {currentName}
                </span>
                <span
                  className={scroll ? "active-counter-name" : "display-none"}
                  style={{
                    textOverflow: textOverflowProperty,
                  }}
                >
                  {currentName}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="reset-btn-wrap"
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
      {/* Remove below code */}
      <div className="counter-type-wrap" ref={counterTextContainerRef}>
        <div className="counter-text-wrap" ref={textRef}>
          <span className="active-counter-name">{currentName}</span>
          <span className={scroll ? "active-counter-name" : "display-none"}>
            {currentName}
          </span>
        </div>

        {/* <h1 className="active-counter-number">{activeCounterNumber}</h1> */}
      </div>
    </>
  );
};

export default CounterNameAndNumber;
