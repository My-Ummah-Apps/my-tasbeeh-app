import { IonModal } from "@ionic/react";
import ActiveCounter from "../ActiveCounter";
import { materialColors } from "../../utils/constants";

import {
  languageDirection,
  MaterialColor,
  PreferenceKeyType,
  scrollSpeedValue,
  themeType,
  userPreferencesType,
} from "../../utils/types";
import { IonRange } from "@ionic/react";

export const dummyCounterText = `This is an example tasbeeh This is an example tasbeeh This is an example tasbeeh This is an example tasbeeh`;

export const renderModalContent = (
  setLanguageDirection: React.Dispatch<React.SetStateAction<languageDirection>>,
  setScrollSpeed: React.Dispatch<React.SetStateAction<scrollSpeedValue>>,
  scrollSpeed: scrollSpeedValue,
  updateUserPreference: (
    preferenceName: PreferenceKeyType,
    preferenceValue: number | MaterialColor | themeType
  ) => Promise<void>,
  userPreferencesState: userPreferencesType
) => {
  return (
    <section
      className="mb-10"
      //    className="pb-10 theme-sheet-content-wrap"
    >
      <h1 className="mb-5 modal-header-text">Scroll Speed</h1>
      <ActiveCounter
        activeColor={"#EF5350"}
        activeCounter={{
          id: -1,
          orderIndex: -1,
          name: dummyCounterText,
          count: 10,
          target: 10,
          color: materialColors[0],
          isActive: 0,
        }}
        //   resetSingleCounter={vi.fn()}
        setLanguageDirection={setLanguageDirection}
        languageDirection={"ltr"}
        setScrollSpeed={setScrollSpeed}
        scrollSpeed={scrollSpeed}
        animationDelay={400}
      />
      <section className="flex justify-between mx-4 mt-10 text-sm">
        <p>Very Slow</p>
        <p>Very Fast</p>
      </section>
      <section className="mx-6">
        <IonRange
          aria-label="Range with ticks"
          value={userPreferencesState.scrollSpeed}
          onIonChange={async ({ detail }) => {
            const speed = detail.value;
            await updateUserPreference("scrollSpeed", speed as number);
          }}
          ticks={true}
          snaps={true}
          min={0}
          max={4}
        ></IonRange>
      </section>
    </section>
  );
};

interface BottomSheetCounterScrollSpeedProps {
  triggerId: string;
  setLanguageDirection: React.Dispatch<React.SetStateAction<languageDirection>>;
  setScrollSpeed: React.Dispatch<React.SetStateAction<scrollSpeedValue>>;
  scrollSpeed: scrollSpeedValue;
  updateUserPreference: (
    preferenceName: PreferenceKeyType,
    preferenceValue: number | MaterialColor | themeType
  ) => Promise<void>;
  userPreferencesState: userPreferencesType;
}
const BottomSheetCounterScrollSpeed = ({
  triggerId,
  setLanguageDirection,
  setScrollSpeed,
  scrollSpeed,
  updateUserPreference,
  userPreferencesState,
}: BottomSheetCounterScrollSpeedProps) => {
  return (
    <IonModal
      mode="ios"
      // ref={ref}
      trigger={triggerId}
      className="modal-fit-content"
      initialBreakpoint={1}
      breakpoints={[0, 1]}
      // handleBehavior="cycle"
      // onWillDismiss={(event) => setScrollSpeed(0)}
    >
      {renderModalContent(
        setLanguageDirection,
        setScrollSpeed,
        scrollSpeed,
        updateUserPreference,
        userPreferencesState
      )}
    </IonModal>
  );
};

export default BottomSheetCounterScrollSpeed;
