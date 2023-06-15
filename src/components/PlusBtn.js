import { Haptics, ImpactStyle } from "@capacitor/haptics";

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

const PlusBtn = ({
  haptics,
  setActiveCounterNumber,
  activeCounterNumber,
  localSavedCountersArray,
  saveArrayLocally,
  showAnimation,
  activeBackgroundColor,
}) => {
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
  console.log(activeBackgroundColor);
  return (
    <div
      style={{ backgroundColor: activeBackgroundColor }}
      onClick={() => {
        setCounterAndHaptics();
      }}
      className={`increment-btn ${showAnimation ? "fade-up-animation" : null}`}
    ></div>
  );
};

export default PlusBtn;
