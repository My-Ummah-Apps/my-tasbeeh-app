import { Haptics } from "@capacitor/haptics";
import {
  counterObjType,
  DBConnectionStateType,
  MaterialColor,
  userPreferencesType,
} from "../utils/types";
import { Capacitor } from "@capacitor/core";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { materialColors } from "../utils/constants";

// const hapticsImpactMedium = async () => {
//   await Haptics.impact({ style: ImpactStyle.Medium });
// };

const hapticsVibrate = async () => {
  await Haptics.vibrate({ duration: 1000 });
};

interface CounterButtonProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  toggleDBConnection: (action: DBConnectionStateType) => Promise<void>;
  userPreferencesState: userPreferencesType;
  updateActiveCounter: (
    counterId: number,
    color: string,
    delay?: boolean
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
  updateActiveCounter,
  activeColor,
  countersState,
  activeCounter,
  updateCountersState,
}: CounterButtonProps) {
  const setCounterAndHaptics = async () => {
    const updatedCountersArr = countersState.map((counter) => {
      const isActive = counter.isActive === 1;

      if (isActive) {
        return { ...counter, count: (counter.count += 1) };
      }
      return { ...counter };
    });

    try {
      await toggleDBConnection("open");
      const updateCounterCount = `UPDATE counterDataTable SET count = count + 1 WHERE id = ?`;
      await dbConnection.current!.run(updateCounterCount, [activeCounter.id]);
    } catch (error) {
      console.error("Error incrementing counter: ", error);
    } finally {
      await toggleDBConnection("close");
    }

    updateCountersState(updatedCountersArr);

    if (activeCounter.count === activeCounter.target) {
      if (Capacitor.isNativePlatform()) {
        if (userPreferencesState.haptics === 1) {
          hapticsVibrate();
        }
      }

      if (userPreferencesState.autoSwitchCounter === 1) {
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

        await updateActiveCounter(nextCounterId, nextCounterColor, true);
        console.log("TARGET HIT");
      }

      // if (userPreferencesState.haptics === 1) {
      //   hapticsImpactMedium();
      // }
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
        setCounterAndHaptics();
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
