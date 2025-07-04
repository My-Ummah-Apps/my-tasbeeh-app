import { ActionSheetButton, IonActionSheet } from "@ionic/react";

interface ActionSheetProps {
  trigger?: string;
  header?: string;
  buttons: ActionSheetButton[];
}

const ActionSheet = ({ trigger, buttons, header }: ActionSheetProps) => {
  return (
    <IonActionSheet
      className="action-sheet"
      trigger={trigger}
      header={header || "Actions"}
      buttons={buttons}
    ></IonActionSheet>
  );
};

export default ActionSheet;
