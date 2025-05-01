// @ts-nocheck
import { useRef, useEffect, useState } from "react";
import { direction } from "direction";
import { FaPen } from "react-icons/fa";

import { VscDebugRestart } from "react-icons/vsc";
import { MdOutlineRestartAlt } from "react-icons/md";

interface CounterNameAndNumberProps {
  localSavedCountersArray: any;
  setActiveBackgroundColor: any;
  activeBackgroundColor: any;
  resetSingleCounter: any;
}

function CounterNameAndNumber({
  localSavedCountersArray,
  setActiveBackgroundColor,
  setLanguageDirection,
  languageDirection,
  activeBackgroundColor,
  resetSingleCounter,
}: CounterNameAndNumberProps) {
  // const [showAnimation, setShowAnimation] = useState(
  //   sessionStorage.getItem("showAnimationMainPageCounter")
  // );
  // useEffect(() => {
  //   if (sessionStorage.getItem("showAnimationMainPageCounter") == "false") {
  //     setShowAnimation(false);
  //   } else if (sessionStorage.getItem("showAnimationMainPageCounter") == null) {
  //     setShowAnimation(true);

  //     sessionStorage.setItem("showAnimationMainPageCounter", "false");
  //   }
  // }, []);

  let currentName;
  let currentNumber = 0;
  let currentCounterTarget;
  let currentCounterId: any;
  let textOverflowProperty;
  localSavedCountersArray.map((counterItem: any) => {
    if (counterItem.isActive == true) {
      // setActiveBackgroundColor(counterItem.color);

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
  const mScrollRef = useRef(null);

  const [scroll, setScroll] = useState();
  // const [languageDirection, setLanguageDirection] = useState("");

  let scrollingStyle = { overflow: "hidden" };
  // const [overflow, setOverflow] = useState({ overflow: "hidden" });

  useEffect(() => {
    const counterTextContainerWidth =
      counterTextContainerRef.current.clientWidth;

    if (languageDirection !== "ltr" && languageDirection !== "rtl") {
      if (direction(textRef.current.innerText) === "ltr") {
        setLanguageDirection("ltr");
      } else if (direction(textRef.current.innerText) === "rtl") {
        setLanguageDirection("rtl");
      }
    }

    if (textRef.current.clientWidth < counterTextContainerWidth) {
      setScroll(false);

      // setOverflow({ overflow: "unset" });
    } else if (textRef.current.clientWidth > counterTextContainerWidth) {
      setScroll(true);
      const scrollSpeed = textRef.current.innerText.length * 0.3;
      mScrollRef.current.style.animationDuration = `${scrollSpeed}s`;

      // setOverflow({ overflow: "unset" });
    }
  }, [textRef.current]);
  // ${showAnimation ? "fade-down-animation" : ""}
  // debugger;
  // TODO: Un-duplicate styles in below spans which hold currentName
  return (
    <div className="single-counter-wrap-parent">
      <div
        className={`single-counter-wrap remove-counter-blinking 
          `}
        ref={counterTextContainerRef}
        style={{
          backgroundColor: activeBackgroundColor + "BF",
          // boxShadow: `0px 5px 20px ${activeBackgroundColor}`,
          // boxShadow: `0px 7px 10px 0px ${activeBackgroundColor}`,
        }}
      >
        <div className="single-counter-name-and-count-wrap">
          <div className="single-counter-count">
            {currentNumber <= currentCounterTarget
              ? Math.floor((currentNumber / currentCounterTarget) * 100) + "%"
              : "100%"}
          </div>

          <div
            data-testid="active-counter-name"
            className="single-counter-counter-name"
            style={{
              textAlign: languageDirection === "ltr" ? "left" : "right",
              direction: languageDirection === "ltr" ? "ltr" : "rtl",
            }}
            ref={textRef}
          >
            <div className={scroll ? "scroll" : ""}>
              {/* <div ref={mScrollRef} className={scroll ? "m-scroll" : ""}> */}
              <div
                ref={mScrollRef}
                className={`single-counter-text-wrap ${
                  scroll
                    ? languageDirection === "ltr"
                      ? "scroll-ltr"
                      : "scroll-rtl"
                    : ""
                }`}
              >
                <span
                  className="active-counter-name"
                  style={{
                    textOverflow: textOverflowProperty,
                    paddingRight:
                      scroll && languageDirection === "ltr" ? "2rem" : "",
                    paddingLeft:
                      scroll && languageDirection === "rtl" ? "2rem" : "",
                  }}
                >
                  {currentName}
                </span>
                <span
                  className={scroll ? "active-counter-name" : "display-none"}
                  style={{
                    textOverflow: textOverflowProperty,
                    paddingRight:
                      scroll && languageDirection === "ltr" ? "2rem" : "",
                    paddingLeft:
                      scroll && languageDirection === "rtl" ? "2rem" : "",
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
          <MdOutlineRestartAlt />
          {/* <VscDebugRestart /> */}
        </div>

        <div
          style={{
            backgroundColor: activeBackgroundColor,

            width:
              currentCounterTarget > 0
                ? (currentNumber / currentCounterTarget) * 100 + "%"
                : "100%",

            // width: singleCounterStyles(count, target),
          }}
          // ${showAnimation ? "width-animation" : ""}
          className={`single-counter-overlay`}
        ></div>
      </div>
      {/* Remove below code */}
      <div
        className="counter-type-wrap"
        style={{ position: "absolute", opacity: 0 }}
      >
        <div ref={textRef}>
          <span>{currentName}</span>
        </div>
      </div>
    </div>
  );
}

export default CounterNameAndNumber;
