import { IonModal } from "@ionic/react";

interface BottomSheetCounterScrollSpeedProps {
  triggerId: string;
}
const BottomSheetCounterScrollSpeed = ({
  triggerId,
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
      <section
      //    className="pb-10 theme-sheet-content-wrap"
      >
        <h1 className="modal-header-text">Scroll Speed</h1>
      </section>
    </IonModal>
  );
};

export default BottomSheetCounterScrollSpeed;
