import { useRef, useEffect, useState } from "react";
import { direction } from "direction";
import {
  counterObjType,
  languageDirection,
  MaterialColor,
  scrollSpeedValue,
  userPreferencesType,
} from "../utils/types";
import ActionSheet from "./ActionSheet";
import { IonIcon } from "@ionic/react";
import { refresh } from "ionicons/icons";
import { speedMap } from "../utils/constants";
import { useLocation } from "react-router-dom";

interface CounterNameAndNumberProps {
  userPreferencesState?: userPreferencesType;
  activeColor: MaterialColor;
  activeCounter: counterObjType;
  resetSingleCounter?: (id: number) => Promise<void>;
  setLanguageDirection: React.Dispatch<React.SetStateAction<languageDirection>>;
  languageDirection: languageDirection;
  setScrollSpeed?: React.Dispatch<React.SetStateAction<scrollSpeedValue>>;
  scrollSpeed: scrollSpeedValue;
  animationDelay: number;
}

function ActiveCounter({
  userPreferencesState,
  activeColor,
  activeCounter,
  resetSingleCounter,
  setLanguageDirection,
  languageDirection,
  setScrollSpeed,
  scrollSpeed,
  animationDelay,
}: CounterNameAndNumberProps) {
  const counterTextContainerRef = useRef<HTMLElement | null>(null);
  const activeCounterTextRef = useRef<HTMLDivElement | null>(null);
  const mScrollRef = useRef<HTMLDivElement | null>(null);

  const [scroll, setScroll] = useState<boolean>(false);

  const location = useLocation();

  useEffect(() => {
    if (!setScrollSpeed || !userPreferencesState?.scrollSpeed) return;

    setScrollSpeed(userPreferencesState?.scrollSpeed);

    handleUpdateScrollSpeed();
  }, [location, userPreferencesState?.scrollSpeed]);

  const handleUpdateScrollSpeed = () => {
    setScroll(true);
    if (!activeCounterTextRef.current || !mScrollRef.current) return;
    const scrollSpeedCalc =
      activeCounterTextRef.current.innerText.length * speedMap[scrollSpeed];
    mScrollRef.current.style.animationDuration = `${scrollSpeedCalc}s`;
  };

  useEffect(() => {
    if (direction(activeCounter.name) === "ltr") {
      setLanguageDirection("ltr");
    } else if (direction(activeCounter.name) === "rtl") {
      setLanguageDirection("rtl");
    }

    // The reason for the below code being wrapped in requestAnimationFrame and setTimeout is
    // so that this code runs only after the DOM has fully rendered, without the code
    // being wrapped counterTextContainerRef can end up being null breaking the scroll functionality
    requestAnimationFrame(() => {
      setTimeout(() => {
        const counterTextContainerWidth = counterTextContainerRef.current
          ? counterTextContainerRef.current.clientWidth
          : 0;

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
          handleUpdateScrollSpeed();
        } else {
          console.warn("Scroll refs not ready, skipping scroll setup.");
        }
      }, 0);
    });
  }, [activeCounter?.name, scrollSpeed, location]);

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
          <div className="w-[85%] relative z-[1] py-[0.7rem]">
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
                  style={{ animationDelay: `${animationDelay}ms` }}
                  data-testid="scroll-container"
                  className={`single-counter-text-wrap  ${
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
            id="open-reset-single-counter-action-sheet-homepage"
            className="mr-[0.7rem] text-[1.2rem] z-10 bg-none border-none text-white inline-flex items-center justify-center cursor-pointer text-[var(--ion-text-color)]"
          >
            <IonIcon className="text-2xl" icon={refresh} />
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
        trigger="open-reset-single-counter-action-sheet-homepage"
        header="Are you sure you want to reset this tasbeeh to 0?"
        buttons={[
          {
            text: "Reset Tasbeeh",
            role: "destructive",
            handler: async () => {
              if (!resetSingleCounter) return;
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
