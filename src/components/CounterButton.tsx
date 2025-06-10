import { Haptics, ImpactStyle } from "@capacitor/haptics";
import {
  BinaryValue,
  counterObjType,
  DBConnectionStateType,
  MaterialColor,
  userPreferencesType,
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
  setUserPreferencesState: React.Dispatch<
    React.SetStateAction<userPreferencesType>
  >;
  userPreferencesState: userPreferencesType;
  activeColor: MaterialColor;
  countersArr: counterObjType[];
  activeCounter: counterObjType;
  updateCountersState: (arr: counterObjType[]) => void;
}

function CounterButton({
  dbConnection,
  toggleDBConnection,
  setUserPreferencesState,
  userPreferencesState,
  activeColor,
  countersArr,
  activeCounter,
  updateCountersState,
}: CounterButtonProps) {
  const setCounterAndHaptics = async () => {
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

    if (Capacitor.isNativePlatform()) {
      if (
        activeCounter.count === activeCounter.target &&
        userPreferencesState.haptics === 1
      ) {
        // setHaptics(0);
        // setUserPreferencesState(prev => ({...prev, haptics: 0}))
        // setTimeout(() => {
        //   setHaptics(1);
        // }, 1100);
        hapticsVibrate();
        return;
      }

      if (userPreferencesState.haptics === 1) {
        hapticsImpactMedium();
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
