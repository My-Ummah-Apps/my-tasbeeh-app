import { ActionSheetButton, IonActionSheet } from "@ionic/react";

interface ActionSheetProps {
  isOpen: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  header?: string;
  buttons: ActionSheetButton[];
}

const ActionSheet = ({
  isOpen,
  setState,
  buttons,
  header,
}: ActionSheetProps) => {
  return (
    <IonActionSheet
      mode="md"
      className="action-sheet"
      isOpen={isOpen}
      header={header || "Actions"}
      buttons={buttons}
      onDidDismiss={() => setState(false)}
    ></IonActionSheet>
  );
};

export default ActionSheet;
