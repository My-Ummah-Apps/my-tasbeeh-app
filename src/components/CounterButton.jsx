import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { storeCounters } from "../utils/constants";

import { useState } from "react";

const hapticsImpactMedium = async () => {
  await Haptics.impact({ style: ImpactStyle.Medium });
};

const hapticsVibrate = async () => {
  await Haptics.vibrate({ duration: 1000 });
};

function CounterButton({
  setHaptics,
  haptics,
  setActiveCounterNumber,
  activeCounterName,
  activeCounterNumber,
  localSavedCountersArray,
  activeBackgroundColor,
}) {
  let currentNumber;
  let currentCounterTarget;
  localSavedCountersArray.map((counterItem) => {
    if (counterItem.isActive == true) {
      currentNumber = counterItem.count;
      currentCounterTarget = counterItem.target;
    }
  });

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const setCounterAndHaptics = () => {
    setActiveCounterNumber((activeCounterNumber += 1));

    localSavedCountersArray.map((counterItem) => {
      if (counterItem.isActive == true) {
        counterItem.count = activeCounterNumber;
      }
    });
    storeCounters(localSavedCountersArray);

    if (currentNumber == currentCounterTarget - 1) {
      if (haptics == true) {
        setHaptics(false);

        setTimeout(() => {
          setHaptics(true);
        }, 1100);
      }
      hapticsVibrate();
      return;
    }

    if (haptics == true) {
      hapticsImpactMedium();
    }
  };

  return (
    <button
      data-testid="counter-increment-button"
      aria-label={`Increase counter for ${activeCounterName}, current value is ${currentNumber}`}
      style={{
        backgroundColor: `${activeBackgroundColor}`,
        boxShadow: `0px 0px 10px ${activeBackgroundColor}`,
      }}
      onClick={() => {
        setCounterAndHaptics();
        handleClick();
      }}
      className={`increment-btn`}
    >
      <div className="increment-btn-number-and-target-wrap">
        <div
          data-testid="counter-current-count-text"
          className="increment-btn-number"
        >
          {currentNumber}
        </div>
        <div data-testid="counter-target-text" className="increment-btn-target">
          of {currentCounterTarget}
        </div>
      </div>
    </button>
  );
}

export default CounterButton;
