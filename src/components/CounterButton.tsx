import { Haptics, ImpactStyle } from "@capacitor/haptics";
import {
  counterObjType,
  DBConnectionStateType,
  MaterialColor,
  userPreferencesType,
} from "../utils/types";
import { motion } from "framer-motion";
import { Capacitor } from "@capacitor/core";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { materialColors } from "../utils/constants";
import { MutableRefObject, useRef, useState } from "react";
// import { incrementCounter } from "../utils/helpers";

const hapticsImpactMedium = async () => {
  await Haptics.impact({ style: ImpactStyle.Medium });
};
// const hapticsImpactHeavy = async () => {
//   await Haptics.impact({ style: ImpactStyle.Heavy });
// };

const hapticsVibrate = async (duration: number) => {
  await Haptics.vibrate({ duration: duration });
};

export const incrementCounter = (countersState: counterObjType[]) => {
  return countersState.map((counter) => {
    const isActive = counter.isActive === 1;

    if (isActive) {
      return { ...counter, count: counter.count + 1 };
    }
    return { ...counter };
  });
};

export const getNextCounterInfo = (
  currentCounterIndex: number,
  updatedCounters: counterObjType[]
) => {
  const nextCounterIndex = currentCounterIndex + 1;
  return {
    nextCounterIndex,
    nextCounterId: updatedCounters[nextCounterIndex].id,
    nextCounterColor: materialColors[nextCounterIndex % materialColors.length],
  };
};

export const incrementCounterInDB = async (
  toggleDBConnection: (action: DBConnectionStateType) => Promise<void>,
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>,
  newActiveCounter: counterObjType
) => {
  try {
    await toggleDBConnection("open");
    const updateCounterCount = `UPDATE counterDataTable SET count = count + 1 WHERE id = ?`;
    await dbConnection.current!.run(updateCounterCount, [newActiveCounter.id]);
  } catch (error) {
    console.error("Error incrementing counter: ", error);
  } finally {
    await toggleDBConnection("close");
  }
};

interface CounterButtonProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  toggleDBConnection: (action: DBConnectionStateType) => Promise<void>;
  userPreferencesState: userPreferencesType;
  cancellableDelayRef: MutableRefObject<{
    initiateDelay: () => Promise<unknown>;
    cancelDelay: () => void;
  } | null>;
  isAutoSwitchCancelled: MutableRefObject<boolean>;
  setShowNextCounterToast: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEndOfListAlert: React.Dispatch<React.SetStateAction<boolean>>;
  updateActiveCounter: (
    counterId: number,
    color: MaterialColor
  ) => Promise<void>;
  activeColor: MaterialColor;
  countersState: counterObjType[];
  activeCounter: counterObjType;
  updateCountersState: (arr: counterObjType[]) => void;
}

function CounterButton({
  dbConnection,
  toggleDBConnection,
  userPreferencesState,
  cancellableDelayRef,
  isAutoSwitchCancelled,
  setShowNextCounterToast,
  setShowEndOfListAlert,
  updateActiveCounter,
  activeColor,
  countersState,
  activeCounter,
  updateCountersState,
}: CounterButtonProps) {
  const buttonRef = useRef(null);

  // const countLength = useRef(activeCounter.count.toString.length);

  const [countLength, setCountLength] = useState(
    activeCounter.count.toString.length
  );

  const baseFontSize = 8;
  let fontSize = Math.max(baseFontSize - (countLength - 3) * 1, 3);

  // useEffect(() => {
  //   console.log("HAS RUN");
  //   if (countLength > 3) {
  //     // fontSize = 2;
  //   }
  // }, [countLength]);

  // const hapticInterval = useRef<number | null>(null);

  // const controls = useAnimation();

  // useEffect(() => {
  //   controls.start({
  //     scale: [1, 1.15, 1],
  //     // rotate: [0, 5, -5, 0],
  //     // y: [0, -10, 0],
  //     // transition: { type: "spring", stiffness: 300, damping: 10 },
  //     boxShadow: [
  //       `0px 0px 10px ${activeColor}`,
  //       `0px 0px 25px ${activeColor}`,
  //       `0px 0px 10px ${activeColor}`,
  //     ],
  //     transition: { duration: 0.6, ease: "easeInOut" },
  //   });
  // }, [activeCounter.id]);

  const handleCounterButtonClick = async () => {
    if (Capacitor.isNativePlatform() && userPreferencesState.haptics === 1) {
      hapticsImpactMedium();
    }

    const updatedCounters = incrementCounter(countersState);
    updateCountersState(updatedCounters);

    const newActiveCounter = updatedCounters.filter(
      (counter) => counter.isActive === 1
    )[0];

    // countLength.current =
    //   updatedCounters
    //     .find((counter) => counter.isActive === 1)
    //     ?.count.toString().length ?? activeCounter.count.toString().length;

    setCountLength(
      updatedCounters
        .find((counter) => counter.isActive === 1)
        ?.count.toString().length ?? activeCounter.count.toString().length
    );

    await incrementCounterInDB(
      toggleDBConnection,
      dbConnection,
      newActiveCounter
    );

    if (newActiveCounter.count === newActiveCounter.target) {
      if (userPreferencesState.autoSwitchCounter === 1) {
        if (Capacitor.isNativePlatform()) {
          hapticsVibrate(1500);
        }

        const currentCounterIndex = updatedCounters.findIndex(
          (counter) => counter.isActive === 1
        );

        const isLastCounter =
          currentCounterIndex === updatedCounters.length - 1;

        if (isLastCounter) {
          setShowEndOfListAlert(true);
          return;
        }

        const { nextCounterId, nextCounterColor } = getNextCounterInfo(
          currentCounterIndex,
          updatedCounters
        );

        setShowNextCounterToast(true);

        const delayActiveCounterUpdate = async () => {
          try {
            await cancellableDelayRef.current!.initiateDelay();
          } catch (error) {
            console.error("Delay cancelled");
          }

          if (!isAutoSwitchCancelled.current) {
            await updateActiveCounter(nextCounterId, nextCounterColor);
          }
        };

        // if (hapticInterval.current !== null) {
        //   clearInterval(hapticInterval.current);
        // }

        await delayActiveCounterUpdate();
        isAutoSwitchCancelled.current = false;
      } else if (Capacitor.isNativePlatform()) {
        hapticsVibrate(1250);
      }
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      // animate={controls}
      data-testid="counter-increment-button"
      aria-label={`Increase counter for ${activeCounter.name}, current value is ${activeCounter.count}`}
      style={{
        backgroundColor: `${activeColor}`,
        boxShadow: `0px 0px 10px ${activeColor}`,
      }}
      onClick={() => {
        handleCounterButtonClick();
      }}
      className={`increment-btn`}
    >
      <div className="increment-btn-number-and-target-wrap">
        <div
          style={{ fontSize: `${fontSize}rem` }}
          // className="text-[8rem]"

          data-testid="counter-current-count-text"
        >
          {activeCounter.count}
        </div>
        <div data-testid="counter-target-text" className="increment-btn-target">
          of {activeCounter.target}
        </div>
      </div>
    </motion.button>
  );
}

export default CounterButton;
