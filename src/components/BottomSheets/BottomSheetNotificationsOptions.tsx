import { tween_config } from "../../utils/constants";
import {
  counterObjType,
  MaterialColor,
  PreferenceKeyType,
  themeType,
  userPreferencesType,
} from "../../utils/types";
import { Sheet } from "react-modal-sheet";
import NotificationOptions from "../NotificationOptions";

interface BottomSheetNotificationsOptionsProps {
  updateUserPreference: (
    preferenceName: PreferenceKeyType,
    preferenceValue: number | MaterialColor | themeType
  ) => Promise<void>;
  userPreferencesState: userPreferencesType;
  activeColor: MaterialColor;
  activeCounter: counterObjType;
  setShowNotificationsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showNotificationsSheet: boolean;
}

const BottomSheetNotificationsOptions = ({
  updateUserPreference,
  userPreferencesState,
  activeColor,
  activeCounter,
  setShowNotificationsSheet,
  showNotificationsSheet,
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
            updateUserPreference={updateUserPreference}
            activeColor={activeColor}
            activeCounter={activeCounter}
            userPreferencesState={userPreferencesState}
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
