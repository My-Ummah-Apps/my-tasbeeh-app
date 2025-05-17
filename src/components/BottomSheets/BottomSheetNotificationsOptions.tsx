import { tween_config } from "../../utils/constants";
import { counterObjType, MaterialColor } from "../../utils/types";
import { Sheet } from "react-modal-sheet";
import NotificationOptions from "../NotificationOptions";

interface BottomSheetNotificationsOptionsProps {
  activeColor: MaterialColor;
  activeCounter: counterObjType;
  setShowNotificationsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showNotificationsSheet: boolean;
  setMorningNotification: React.Dispatch<React.SetStateAction<boolean>>;
  morningNotification: boolean;
  setAfternoonNotification: React.Dispatch<React.SetStateAction<boolean>>;
  afternoonNotification: boolean;
  setEveningNotification: React.Dispatch<React.SetStateAction<boolean>>;
  eveningNotification: boolean;
}

const BottomSheetNotificationsOptions = ({
  activeColor,
  activeCounter,
  setShowNotificationsSheet,
  showNotificationsSheet,
  setMorningNotification,
  morningNotification,
  afternoonNotification,
  setAfternoonNotification,
  eveningNotification,
  setEveningNotification,
}: BottomSheetNotificationsOptionsProps) => {
  return (
    <Sheet
      disableDrag={false}
      isOpen={showNotificationsSheet}
      onClose={() => setShowNotificationsSheet(false)}
      detent="content-height"
      tweenConfig={tween_config}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          {" "}
          <NotificationOptions
            activeColor={activeColor}
            activeCounter={activeCounter}
            setMorningNotification={setMorningNotification}
            morningNotification={morningNotification}
            afternoonNotification={afternoonNotification}
            setAfternoonNotification={setAfternoonNotification}
            eveningNotification={eveningNotification}
            setEveningNotification={setEveningNotification}
          />
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        // style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        onTap={() => setShowNotificationsSheet(false)}
      />
    </Sheet>
  );
};

export default BottomSheetNotificationsOptions;
