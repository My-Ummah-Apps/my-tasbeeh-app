import { Haptics, ImpactStyle } from "@capacitor/haptics";
import {
  counterObjType,
  DBConnectionStateType,
  MaterialColor,
} from "../utils/types";
import { Capacitor } from "@capacitor/core";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";

const hapticsImpactMedium = async () => {
  await Haptics.impact({ style: ImpactStyle.Medium });
};

const hapticsVibrate = async () => {
  await Haptics.vibrate({ duration: 1000 });
};

interface CounterButtonProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  toggleDBConnection: (action: DBConnectionStateType) => Promise<void>;
  activeColor: MaterialColor;
  countersArr: counterObjType[];
  activeCounter: counterObjType;
  updateCountersState: (arr: counterObjType[]) => void;
  setHaptics: React.Dispatch<React.SetStateAction<boolean | null>>;
  haptics: boolean | null;
}

function CounterButton({
  dbConnection,
  toggleDBConnection,
  activeColor,
  countersArr,
  activeCounter,
  updateCountersState,
  setHaptics,
  haptics,
}: CounterButtonProps) {
  const setCounterAndHaptics = async () => {
    console.log("Active Counter: ", activeCounter);

    const updatedCountersArr = countersArr.map((counter) => {
      const isActive = counter.isActive === 1;
      console.log(isActive);

      if (isActive) {
        return { ...counter, count: (counter.count += 1) };
      }
      return { ...counter };
    });

    try {
      await toggleDBConnection("open");
      const updateCounterCount = `UPDATE counterDataTable SET count = count + 1 WHERE id = ?`;
      await dbConnection.current?.run(updateCounterCount, [activeCounter.id]);
    } catch (error) {
      console.error("Error incrementing counter: ", error);
    } finally {
      await toggleDBConnection("close");
    }

    updateCountersState(updatedCountersArr);

    if (activeCounter.count === activeCounter.target) {
      if (haptics === true && Capacitor.isNativePlatform()) {
        setHaptics(false);

        setTimeout(() => {
          setHaptics(true);
        }, 1100);
      }
      hapticsVibrate();
      return;
    }

    if (haptics === true) {
      hapticsImpactMedium();
    }
  };

  return (
    <button
      data-testid="counter-increment-button"
      aria-label={`Increase counter for ${activeCounter.counterName}, current value is ${activeCounter.count}`}
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
