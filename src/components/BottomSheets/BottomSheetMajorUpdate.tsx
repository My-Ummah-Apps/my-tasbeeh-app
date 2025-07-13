import { IonModal } from "@ionic/react";

interface BottomSheetMajorUpdateProps {
  setShowMajorUpdateBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showMajorUpdateBottomSheet: boolean;
}

const BottomSheetMajorUpdate = ({
  setShowMajorUpdateBottomSheet,
  showMajorUpdateBottomSheet,
}: BottomSheetMajorUpdateProps) => {
  return (
    <IonModal
      mode="ios"
      isOpen={showMajorUpdateBottomSheet}
      initialBreakpoint={0.97}
      breakpoints={[0, 0.97]}
      // handleBehavior="cycle"
      onWillDismiss={() => setShowMajorUpdateBottomSheet(false)}
    >
      <section>
        <p className="bg-purple-800 p-2 rounded-2xl m-4 inline-block">
          MAJOR UPDATE
        </p>
        <h1 className="text-2xl font-bold ml-4 my-2">Auto Tasbeeh Switch</h1>
        <p className="m-4">
          You can now enable Auto tasbeeh Switch from the settings page. When
          turned on, your tasbeeh will automatically switch to the next one in
          your list after reaching its target — no manual switching needed.
        </p>
        <div>icon</div>
      </section>
    </IonModal>
  );
};

export default BottomSheetMajorUpdate;
