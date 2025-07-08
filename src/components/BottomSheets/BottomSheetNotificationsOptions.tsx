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
  triggerId: string;
  updateUserPreference: (
    preferenceName: PreferenceKeyType,
    preferenceValue: number | MaterialColor | themeType
  ) => Promise<void>;
  userPreferencesState: userPreferencesType;
  activeColor: MaterialColor;
  activeCounter: counterObjType;
}

const BottomSheetNotificationsOptions = ({
  triggerId,
  updateUserPreference,
  userPreferencesState,
  activeColor,
  activeCounter,
}: BottomSheetNotificationsOptionsProps) => {
  return (
    <IonModal
      // ref={modalRef}
      mode="ios"
      expandToScroll={false}
      // canDismiss={true}
      className="modal-fit-content"
      trigger={triggerId}
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
