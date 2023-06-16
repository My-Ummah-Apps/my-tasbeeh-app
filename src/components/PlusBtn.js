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
  await Haptics.vibrate();
};

const hapticsSelectionStart = async () => {
  await Haptics.selectionStart();
};

const hapticsSelectionChanged = async () => {
  await Haptics.selectionChanged();
};

const hapticsSelectionEnd = async () => {
  await Haptics.selectionEnd();
};

function PlusBtn({
  haptics,
  setActiveCounterNumber,
  activeCounterNumber,
  activeCounterTarget,
  localSavedCountersArray,
  saveArrayLocally,
  showAnimation,
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

    if (haptics == true) {
      hapticsImpactMedium();
    }
  };

  return (
    <button
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
        if (currentNumber == currentCounterTarget) {
          console.log("activeCounterNumber == activeCounterTarget");
          hapticsVibrate();
        }
      }}
      className={`increment-btn ${showAnimation ? "fade-up-animation" : null}`}
    >
      <div className="increment-btn-number-and-target-wrap">
        <div className="increment-btn-number">{currentNumber}</div>
        <div className="increment-btn-target">of {currentCounterTarget}</div>
      </div>
      {/* <div className="plus-svg-wrap">
        <MdAdd />
      </div> */}
    </button>
  );
}

export default PlusBtn;
