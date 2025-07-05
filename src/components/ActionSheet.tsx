import { ActionSheetButton, IonActionSheet } from "@ionic/react";

interface ActionSheetProps {
  isOpen?: boolean;
  setState?: React.Dispatch<React.SetStateAction<boolean>>;
  trigger?: string;
  header?: string;
  buttons: ActionSheetButton[];
}

const ActionSheet = ({
  trigger,
  buttons,
  header,
  isOpen,
  setState,
}: ActionSheetProps) => {
  return (
    <IonActionSheet
      className="action-sheet"
      header={header || "Actions"}
      {...(isOpen !== undefined ? { isOpen } : {})}
      {...(trigger ? { trigger } : {})}
      {...(setState ? { onDidDismiss: () => setState(false) } : {})}
      buttons={buttons}
    ></IonActionSheet>
  );
};

export default ActionSheet;
