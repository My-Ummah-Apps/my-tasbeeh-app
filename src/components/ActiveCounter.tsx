import { useRef, useEffect, useState } from "react";
import { direction } from "direction";
import { MdOutlineRestartAlt } from "react-icons/md";
import {
  counterObjType,
  languageDirection,
  MaterialColor,
} from "../utils/types";
import ActionSheet from "./ActionSheet";

interface CounterNameAndNumberProps {
  activeColor: MaterialColor;
  activeCounter: counterObjType;
  resetSingleCounter: (id: number) => Promise<void>;
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
  const [showResetActionSheetHomePage, setShowResetActionSheetHomePage] =
    useState(false);

  useEffect(() => {
    const counterTextContainerWidth = counterTextContainerRef.current
      ? counterTextContainerRef.current.clientWidth
      : 0;

    if (direction(activeCounter.name) === "ltr") {
      setLanguageDirection("ltr");
    } else if (direction(activeCounter.name) === "rtl") {
      setLanguageDirection("rtl");
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
  }, [activeCounter.name]);

  const counterNameStyles = {
    textOverflow: activeCounter.name.length > 50 ? "ellipsis" : "clip",
    paddingRight: scroll && languageDirection === "ltr" ? "2rem" : "",
    paddingLeft: scroll && languageDirection === "rtl" ? "2rem" : "",
  };

  return (
    <>
      <section className="single-counter-wrap-parent">
        <section
          className={`single-counter-wrap active-counter remove-counter-blinking 
          `}
          ref={counterTextContainerRef}
          style={{
            backgroundColor: `${activeColor}BF`,
          }}
        >
          <div className="w-[85%] single-counter-name-and-count-wrap">
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
                  <span
                    className="active-counter-name"
                    style={counterNameStyles}
                  >
                    {activeCounter.name}
                  </span>
                  {scroll && (
                    <span
                      className={"active-counter-name"}
                      style={counterNameStyles}
                    >
                      {activeCounter.name}
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
            onClick={async () => {
              // await resetSingleCounter(activeCounter.id);
              setShowResetActionSheetHomePage(true);
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
            <span>{activeCounter.name}</span>
          </div>
        </section>
      </section>
      <ActionSheet
        setState={setShowResetActionSheetHomePage}
        isOpen={showResetActionSheetHomePage}
        header="Are you sure you want to reset this tasbeeh?"
        buttons={[
          {
            text: "Reset Tasbeeh",
            role: "destructive",
            handler: async () => {
              await resetSingleCounter(activeCounter.id);
            },
          },
          {
            text: "Cancel",
            role: "cancel",
          },
        ]}
      />
    </>
  );
}

export default ActiveCounter;
