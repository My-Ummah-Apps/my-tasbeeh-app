import { Haptics, ImpactStyle } from "@capacitor/haptics";
import {
  counterObjType,
  DBConnectionStateType,
  MaterialColor,
  userPreferencesType,
} from "../utils/types";
import { Capacitor } from "@capacitor/core";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { materialColors, nextCounterDelay } from "../utils/constants";

const hapticsImpactMedium = async () => {
  await Haptics.impact({ style: ImpactStyle.Medium });
};

const hapticsVibrate = async (duration: number) => {
  await Haptics.vibrate({ duration: duration });
};

interface CounterButtonProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  toggleDBConnection: (action: DBConnectionStateType) => Promise<void>;
  userPreferencesState: userPreferencesType;
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
  setShowNextCounterToast,
  setShowEndOfListAlert,
  updateActiveCounter,
  activeColor,
  countersState,
  activeCounter,
  updateCountersState,
}: CounterButtonProps) {
  const handleCounterButtonClick = async () => {
    console.log("HAS RUN");

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

        const nextCounterId =
          countersState[
            currentCounterIndex < countersState.length - 1
              ? currentCounterIndex + 1
              : 0
          ].id;

        const nextCounterColor =
          materialColors[
            currentCounterIndex < materialColors.length
              ? currentCounterIndex + 1
              : 0
          ];

        if (currentCounterIndex !== countersState.length - 1) {
          setShowNextCounterToast(true);
        } else {
          setShowEndOfListAlert(true);
          return;
        }

        const delay = (ms: number) => {
          return new Promise((resolve) => setTimeout(resolve, ms));
        };

        const delayActiveCounterUpdate = async () => {
          await delay(nextCounterDelay);
          await updateActiveCounter(nextCounterId, nextCounterColor);
        };

        await delayActiveCounterUpdate();
      } else if (Capacitor.isNativePlatform()) {
        hapticsVibrate(1250);
      }
    }
  };

  return (
    <button
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
    </button>
  );
}

export default CounterButton;
