import { useRef, useEffect, useState } from "react";
import { direction } from "direction";
import { MdOutlineRestartAlt } from "react-icons/md";
import {
  counterObjType,
  languageDirection,
  MaterialColor,
} from "../utils/types";

interface CounterNameAndNumberProps {
  activeColor: MaterialColor;
  activeCounter: counterObjType;
  resetSingleCounter: (id: string) => Promise<void>;
  setLanguageDirection: React.Dispatch<React.SetStateAction<languageDirection>>;
  languageDirection: languageDirection;
}

function ActiveCounter({
  activeColor,
  activeCounter,
  resetSingleCounter,
  setLanguageDirection,
  languageDirection,
}: CounterNameAndNumberProps) {
  const counterTextContainerRef = useRef<HTMLElement | null>(null);
  const activeCounterTextRef = useRef<HTMLDivElement | null>(null);
  const mScrollRef = useRef<HTMLDivElement | null>(null);

  const [scroll, setScroll] = useState<boolean>(false);

  useEffect(() => {
    const counterTextContainerWidth = counterTextContainerRef.current
      ? counterTextContainerRef.current.clientWidth
      : 0;
    console.log("RUN");

    if (direction(activeCounter.counterName) === "ltr") {
      setLanguageDirection("ltr");
      console.log("DIRECTION IS LTR");
    } else if (direction(activeCounter.counterName) === "rtl") {
      setLanguageDirection("rtl");
      console.log("DIRECTION IS RTL");
    }

    if (
      activeCounterTextRef.current &&
      activeCounterTextRef.current.clientWidth < counterTextContainerWidth
    ) {
      setScroll(false);
    } else if (
      activeCounterTextRef.current &&
      mScrollRef.current &&
      activeCounterTextRef.current.clientWidth > counterTextContainerWidth
    ) {
      setScroll(true);
      const scrollSpeed = activeCounterTextRef.current.innerText.length * 0.3;
      mScrollRef.current.style.animationDuration = `${scrollSpeed}s`;
    } else {
      console.error("Error in setting scroll");
    }
  }, [activeCounter.counterName]);

  const counterNameStyles = {
    textOverflow: activeCounter.counterName.length > 50 ? "ellipsis" : "clip",
    paddingRight: scroll && languageDirection === "ltr" ? "2rem" : "",
    paddingLeft: scroll && languageDirection === "rtl" ? "2rem" : "",
  };

  return (
    <section className="single-counter-wrap-parent">
      <section
        className={`single-counter-wrap remove-counter-blinking 
          `}
        ref={counterTextContainerRef}
        style={{
          backgroundColor: `${activeColor}BF`,
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

          <section
            data-testid="active-counter-name"
            className="single-counter-counter-name"
            style={{
              textAlign: languageDirection === "ltr" ? "left" : "right",
              direction: languageDirection === "ltr" ? "ltr" : "rtl",
            }}
            ref={activeCounterTextRef}
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
                  {activeCounter.counterName}
                </span>
                {scroll && (
                  <span
                    className={"active-counter-name"}
                    style={counterNameStyles}
                  >
                    {activeCounter.counterName}
                  </span>
                )}
              </div>
            </div>
          </section>
        </div>
        <button
          aria-label="Reset Counter"
          data-testid="counter-reset-btn"
          className="reset-btn-wrap"
          onClick={() => {
            resetSingleCounter(activeCounter.id);
          }}
        >
          <MdOutlineRestartAlt />
        </button>

        <div
          style={{
            backgroundColor: activeColor,
            width:
              activeCounter.target > 0
                ? `${(activeCounter.count / activeCounter.target) * 100}%`
                : "100%",
          }}
          className="single-counter-overlay"
        />
      </section>
      <section
        className="counter-type-wrap"
        style={{ position: "absolute", opacity: 0 }}
      >
        <div ref={activeCounterTextRef}>
          <span>{activeCounter.counterName}</span>
        </div>
      </section>
    </section>
  );
}

export default ActiveCounter;
