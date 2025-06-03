import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { counterObjType, MaterialColor } from "../utils/types";
import { Capacitor } from "@capacitor/core";

const hapticsImpactMedium = async () => {
  await Haptics.impact({ style: ImpactStyle.Medium });
};

const hapticsVibrate = async () => {
  await Haptics.vibrate({ duration: 1000 });
};

interface CounterButtonProps {
  activeColor: MaterialColor;
  countersArr: counterObjType[];
  activeCounter: counterObjType;
  setAndStoreCounters: (arr: counterObjType[]) => void;
  setHaptics: React.Dispatch<React.SetStateAction<boolean | null>>;
  haptics: boolean | null;
}

function CounterButton({
  activeColor,
  countersArr,
  activeCounter,
  setAndStoreCounters,
  setHaptics,
  haptics,
}: CounterButtonProps) {
  const setCounterAndHaptics = () => {
    const updatedCountersArr = countersArr.map((counter) => {
      const isActive = counter.isActive === 1;

      if (isActive) {
        return { ...counter, count: (counter.count += 1) };
      }
      return { ...counter };
    });

    setAndStoreCounters(updatedCountersArr);

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
