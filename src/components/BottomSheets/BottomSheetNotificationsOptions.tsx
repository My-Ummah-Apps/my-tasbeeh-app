import {
  counterObjType,
  MaterialColor,
  PreferenceKeyType,
  themeType,
  userPreferencesType,
} from "../../utils/types";

import NotificationOptions from "../NotificationOptions";
import { IonModal } from "@ionic/react";

interface BottomSheetNotificationsOptionsProps {
  // triggerId: string;
  setShowNotificationsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showNotificationsSheet: boolean;
  updateUserPreference: (
    preferenceName: PreferenceKeyType,
    preferenceValue: number | MaterialColor | themeType
  ) => Promise<void>;
  userPreferencesState: userPreferencesType;
  activeColor: MaterialColor;
  activeCounter: counterObjType;
}

const BottomSheetNotificationsOptions = ({
  // triggerId,
  setShowNotificationsSheet,
  showNotificationsSheet,
  updateUserPreference,
  userPreferencesState,
  activeColor,
  activeCounter,
}: BottomSheetNotificationsOptionsProps) => {
  return (
    <IonModal
      // ref={modalRef}
      isOpen={showNotificationsSheet}
      mode="ios"
      expandToScroll={false}
      onDidDismiss={() => {
        setShowNotificationsSheet(false);
      }}
      // canDismiss={true}
      className="modal-fit-content"
      // trigger={triggerId}
      initialBreakpoint={1}
      breakpoints={[0, 1]}
    >
      <NotificationOptions
        updateUserPreference={updateUserPreference}
        activeColor={activeColor}
        activeCounter={activeCounter}
        userPreferencesState={userPreferencesState}
      />
      {/* // style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} */}
    </IonModal>
  );
};

export default BottomSheetNotificationsOptions;
