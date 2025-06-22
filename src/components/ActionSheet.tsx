import { ActionSheetButton, IonActionSheet } from "@ionic/react";

interface ActionSheetProps {
  isOpen: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  buttons: ActionSheetButton[];
}

const ActionSheet = ({ isOpen, setState, buttons }: ActionSheetProps) => {
  return (
    <IonActionSheet
      isOpen={isOpen}
      header="Actions"
      buttons={buttons}
      onDidDismiss={() => setState(false)}
    ></IonActionSheet>
  );
};

export default ActionSheet;
