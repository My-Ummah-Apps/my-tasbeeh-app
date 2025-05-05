import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { MdAdd } from "react-icons/md";

import { useState } from "react";

const hapticsImpactMedium = async () => {
  await Haptics.impact({ style: ImpactStyle.Medium });
};

const hapticsImpactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

const hapticsVibrate = async () => {
  await Haptics.vibrate({ duration: 1000 });
};

function PlusBtn({
  setHaptics,
  haptics,
  setActiveCounterNumber,
  activeCounterNumber,
  activeCounterTarget,
  localSavedCountersArray,
  saveArrayLocally,
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
    saveArrayLocally(localSavedCountersArray);

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
      aria-label={`Increase counter, current value is ${currentNumber}`}
      style={{
        backgroundColor: `${activeBackgroundColor}`,
        boxShadow: `0px 0px 10px ${activeBackgroundColor}`,
        // boxShadow: isClicked
        //   ? `0px 0px 10px ${activeBackgroundColor}`
        //   : `0px 0px 20px ${activeBackgroundColor}`,
      }}
      onClick={() => {
        setCounterAndHaptics();
        handleClick();
      }}
      //       ${showAnimation ? "fade-up-animation" : null}
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
      {/* <div className="plus-svg-wrap">
        <MdAdd />
      </div> */}
    </button>
  );
}

export default PlusBtn;
