import { useRef, useEffect, useState } from "react";
import { direction } from "direction";
import { MdOutlineRestartAlt } from "react-icons/md";
import { counterObjType } from "../utils/types";

interface CounterNameAndNumberProps {
  activeCounter: counterObjType;
  resetSingleCounter: any;
  setLanguageDirection: any;
  languageDirection: any;
}

function ActiveCounter({
  activeCounter,
  resetSingleCounter,
  setLanguageDirection,
  languageDirection,
}: CounterNameAndNumberProps) {
  const counterTextContainerRef = useRef(null);
  const textRef = useRef(null);
  const mScrollRef = useRef(null);

  const [scroll, setScroll] = useState();

  useEffect(() => {
    const counterTextContainerWidth =
      counterTextContainerRef.current.clientWidth;

    if (direction(activeCounter.counter) === "ltr") {
      setLanguageDirection("ltr");
    } else if (direction(activeCounter.counter) === "rtl") {
      setLanguageDirection("rtl");
    }

    if (textRef.current.clientWidth < counterTextContainerWidth) {
      setScroll(false);
    } else if (textRef.current.clientWidth > counterTextContainerWidth) {
      setScroll(true);
      const scrollSpeed = textRef.current.innerText.length * 0.3;
      mScrollRef.current.style.animationDuration = `${scrollSpeed}s`;
    }
  }, [textRef.current]);

  const counterNameStyles = {
    textOverflow: activeCounter.counter.length > 50 ? "ellipsis" : "clip",
    paddingRight: scroll && languageDirection === "ltr" ? "2rem" : "",
    paddingLeft: scroll && languageDirection === "rtl" ? "2rem" : "",
  };

  return (
    <div className="single-counter-wrap-parent">
      <div
        className={`single-counter-wrap remove-counter-blinking 
          `}
        ref={counterTextContainerRef}
        style={{
          backgroundColor: `${activeCounter.color}BF`,
        }}
      >
        <div className="single-counter-name-and-count-wrap">
          <div
            data-testid="counter-progress-percent-text"
            className="single-counter-count"
          >
            {activeCounter.count <= activeCounter.target
              ? `${Math.floor((activeCounter.count / activeCounter.target) * 100)}%`
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
                <span className="active-counter-name" style={counterNameStyles}>
                  {activeCounter.counter}
                </span>
                {scroll && (
                  <span
                    className={"active-counter-name"}
                    style={counterNameStyles}
                  >
                    {activeCounter.counter}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <button
          aria-label="Reset Counter"
          data-testid="counter-reset-btn"
          className="reset-btn-wrap"
          onClick={(e) => {
            resetSingleCounter(activeCounter.id);
          }}
        >
          <MdOutlineRestartAlt />
        </button>

        <div
          style={{
            backgroundColor: activeCounter.color,
            width:
              activeCounter.target > 0
                ? `${(activeCounter.count / activeCounter.target) * 100}%`
                : "100%",
          }}
          className="single-counter-overlay"
        />
      </div>
      {/* Remove below code */}
      <div
        className="counter-type-wrap"
        style={{ position: "absolute", opacity: 0 }}
      >
        <div ref={textRef}>
          <span>{activeCounter.counter}</span>
        </div>
      </div>
    </div>
  );
}

export default ActiveCounter;
