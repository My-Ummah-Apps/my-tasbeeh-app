import { useRef, useEffect, useState } from "react";

const CounterNameAndNumber = ({ localSavedCountersArray, showAnimation }) => {
  let currentName;
  let currentNumber = 0;
  let currentBackgroundColor;
  let currentCounterTarget;
  let textOverflowProperty;
  localSavedCountersArray.map((counterItem) => {
    if (counterItem.isActive == true) {
      currentBackgroundColor = counterItem.color;

      counterItem.target == 0
        ? (currentCounterTarget = 0.1)
        : (currentCounterTarget = counterItem.target);

      currentName = counterItem.counter;
      currentNumber = counterItem.count;

      currentName.length > 50
        ? (textOverflowProperty = "ellipsis")
        : (textOverflowProperty = "clip");
    }
  });

  const styles = {
    "--value": currentNumber,
    background: `radial-gradient(
      closest-side,
      white 80%,
      transparent 0 99.9%,
      transparent 0
    ),
    conic-gradient(${
      // currentBackgroundColor + "E5"
      currentBackgroundColor + "FF"
    } calc(var(--pgPercentage) * ${100 / currentCounterTarget}%), var(--bg) 0)`,

    fontSize: "calc(var(--size) / 5)",
    color: "var(--fg)",
  };

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
    <div
      className="counter-type-wrap"
      style={{
        // backgroundColor: currentBackgroundColor + "99",
        backgroundColor: currentBackgroundColor + "FF",
        // position: "relative",
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
      <div
        className="main-counter-overlay"
        style={{ backgroundColor: currentBackgroundColor }}
      ></div>

      <div className="progress-bar-wrap">
        <div role="progressbar" style={styles}></div>
        <p className="target-text">
          Target: {currentCounterTarget > 0.5 ? currentCounterTarget : 0}
        </p>
      </div>

      {/* <h1 className="active-counter-number">{activeCounterNumber}</h1> */}
    </div>
  );
};

export default CounterNameAndNumber;

{
  /* <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="160px"
        height="160px"
      >
        <defs>
          <linearGradient id="GradientColor">
            <stop offset="0%" stopColor="#e91e63" />
            <stop offset="100%" stopColor="#673ab7" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r="70" strokeLinecap="round" />
      </svg> */
}
