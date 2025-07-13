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
import { MutableRefObject, useRef } from "react";

const hapticsImpactMedium = async () => {
  await Haptics.impact({ style: ImpactStyle.Medium });
};
// const hapticsImpactHeavy = async () => {
//   await Haptics.impact({ style: ImpactStyle.Heavy });
// };

const hapticsVibrate = async (duration: number) => {
  await Haptics.vibrate({ duration: duration });
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

    const updatedCountersArr = countersState.map((counter) => {
      const isActive = counter.isActive === 1;

      if (isActive) {
        return { ...counter, count: (counter.count += 1) };
      }
      return { ...counter };
    });

    updateCountersState(updatedCountersArr);

    try {
      await toggleDBConnection("open");
      const updateCounterCount = `UPDATE counterDataTable SET count = count + 1 WHERE id = ?`;
      await dbConnection.current!.run(updateCounterCount, [activeCounter.id]);
    } catch (error) {
      console.error("Error incrementing counter: ", error);
    } finally {
      await toggleDBConnection("close");
    }

    if (activeCounter.count === activeCounter.target) {
      if (userPreferencesState.autoSwitchCounter === 1) {
        if (Capacitor.isNativePlatform()) {
          hapticsVibrate(2000);
        }

        const currentCounterIndex = countersState.findIndex(
          (counter) => counter.isActive === 1
        );

        const isLastCounter = currentCounterIndex === countersState.length - 1;

        if (isLastCounter) {
          setShowEndOfListAlert(true);
          return;
        }

        const nextCounterIndex = currentCounterIndex + 1;
        const nextCounterId = countersState[nextCounterIndex].id;
        const nextCounterColor =
          materialColors[nextCounterIndex % materialColors.length];

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
          data-testid="counter-current-count-text"
          className="increment-btn-number"
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
