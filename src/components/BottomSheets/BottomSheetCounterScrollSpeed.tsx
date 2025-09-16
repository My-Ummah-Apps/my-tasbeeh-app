import { IonModal } from "@ionic/react";
import ActiveCounter from "../ActiveCounter";
import { materialColors } from "../../utils/constants";
import { languageDirection } from "../../utils/types";

export const renderModalContent = (
  setLanguageDirection: React.Dispatch<React.SetStateAction<languageDirection>>
) => (
  <section
  //    className="pb-10 theme-sheet-content-wrap"
  >
    <h1 className="modal-header-text">Scroll Speed</h1>
    <ActiveCounter
      activeColor={"#EF5350"}
      activeCounter={{
        id: -1,
        orderIndex: -1,
        name: "This is an example tasbeeh This is an example tasbeeh",
        count: 10,
        target: 10,
        color: materialColors[0],
        isActive: 0,
      }}
      // resetSingleCounter={resetSingleCounter}
      setLanguageDirection={setLanguageDirection}
      languageDirection={"ltr"}
    />
  </section>
);

interface BottomSheetCounterScrollSpeedProps {
  triggerId: string;
  setLanguageDirection: React.Dispatch<React.SetStateAction<languageDirection>>;
}
const BottomSheetCounterScrollSpeed = ({
  triggerId,
  setLanguageDirection,
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
      // onWillDismiss={(event) => onWillDismiss(event)}
    >
      {renderModalContent(setLanguageDirection)}
    </IonModal>
  );
};

export default BottomSheetCounterScrollSpeed;
