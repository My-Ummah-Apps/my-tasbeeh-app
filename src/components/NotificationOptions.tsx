import { LocalNotifications } from "@capacitor/local-notifications";
import {
  counterObjType,
  MaterialColor,
  PreferenceKeyType,
  themeType,
  userPreferencesType,
} from "../utils/types";
import { IonToggle, isPlatform } from "@ionic/react";
import { toggleStyles } from "../utils/helpers";

interface NotificationOptionsProps {
  updateUserPreference: (
    preferenceName: PreferenceKeyType,
    preferenceValue: number | MaterialColor | themeType
  ) => Promise<void>;
  userPreferencesState: userPreferencesType;
  activeColor: MaterialColor;
  activeCounter: counterObjType;
}

const NotificationOptions = ({
  updateUserPreference,
  userPreferencesState,
  activeColor,
}: NotificationOptionsProps) => {
  const cancelNotification = async (id: number) => {
    await LocalNotifications.cancel({ notifications: [{ id: id }] });
  };

  // ! If below code is uncommented, createChannel should only be triggered on Android devices, as it will throw an error on iOS
  // LocalNotifications.createChannel({
  //   id: "1",
  //   name: "Notification",
  //   description: "General Notification",
  // });

  const remembranceVerses = [
    `"So remember Me; I will remember you." (Quran 2:152)`,
    `"O believers! Always remember Allah often." (Quran 33:41)`,
    `"Surely in the remembrance of Allah do hearts find comfort." (Quran 13:28)`,
    `"Remember your Lord often and glorify ˹Him˺ morning and evening." (Quran 3:41)`,
    `"Remember the Name of your Lord, and devote yourself to Him wholeheartedly." (Quran 73:8)`,
    `"Remember the name of your Lord morning and evening." (Quran 76:25)`,
    `“And remember Allah much, that you may be successful." (Quran 62:10)`,
    `"And the remembrance of Allah is greater." (Quran 29:45)`,
  ];

  return (
    <section className="notification-options-wrap">
      <h1 className="modal-header-text">Notifications</h1>
      <div className="individual-notification-option-wrap">
        <div className="individual-notification-text-wrap">
          <p>Morning</p>
          <p className="notificatiions-options-sub-text">
            Receive notifications every morning
          </p>
        </div>
        <IonToggle
          mode={isPlatform("ios") ? "ios" : "md"}
          color={isPlatform("ios") ? activeColor : ""}
          style={toggleStyles(
            userPreferencesState,
            "morningNotification",
            activeColor
          )}
          checked={userPreferencesState.morningNotification === 1}
          onIonChange={async (e) => {
            const morningNotificationValue = e.detail.checked;
            if (!morningNotificationValue) {
              await updateUserPreference("morningNotification", 0);
              await cancelNotification(1);
            } else {
              await LocalNotifications.schedule({
                notifications: [
                  {
                    title: "Morning Reminder",
                    // body: `"Therefore remember Me. I will remember you." (Quran 2:152)`,
                    body: remembranceVerses[
                      Math.floor(Math.random() * remembranceVerses.length)
                    ],
                    id: 1,
                    schedule: {
                      on: { hour: 7, minute: 0 },
                      allowWhileIdle: true,
                      repeats: true,
                    },
                  },
                ],
              });
              await updateUserPreference("morningNotification", 1);
            }
          }}
        ></IonToggle>
      </div>
      <div className="individual-notification-option-wrap">
        <div className="individual-notification-text-wrap">
          <p>Afternoon</p>
          <p className="notificatiions-options-sub-text">
            Receive notifications every afternoon
          </p>
        </div>
        <IonToggle
          mode={isPlatform("ios") ? "ios" : "md"}
          color={isPlatform("ios") ? activeColor : ""}
          style={toggleStyles(
            userPreferencesState,
            "afternoonNotification",
            activeColor
          )}
          checked={userPreferencesState.afternoonNotification === 1}
          onIonChange={async (e) => {
            const afternoonNotificationValue = e.detail.checked;
            if (!afternoonNotificationValue) {
              await updateUserPreference("afternoonNotification", 0);
              await cancelNotification(2);
            } else {
              await LocalNotifications.schedule({
                notifications: [
                  {
                    title: "Afternoon Reminder",
                    body: remembranceVerses[
                      Math.floor(Math.random() * remembranceVerses.length)
                    ],
                    id: 2,
                    schedule: {
                      on: { hour: 14, minute: 0 },
                      allowWhileIdle: true,
                      repeats: true,
                    },
                  },
                ],
              });
              await updateUserPreference("afternoonNotification", 1);
            }
          }}
        ></IonToggle>
      </div>
      <div className="individual-notification-option-wrap">
        <div className="individual-notification-text-wrap">
          <p>Evening</p>
          <p className="notificatiions-options-sub-text">
            Receive notifications every evening
          </p>
        </div>
        <IonToggle
          mode={isPlatform("ios") ? "ios" : "md"}
          color={isPlatform("ios") ? activeColor : ""}
          style={toggleStyles(
            userPreferencesState,
            "eveningNotification",
            activeColor
          )}
          checked={userPreferencesState.eveningNotification === 1}
          onIonChange={async (e) => {
            const eveningNotificationValue = e.detail.checked;
            if (!eveningNotificationValue) {
              await updateUserPreference("eveningNotification", 0);
              await cancelNotification(3);
            } else {
              await LocalNotifications.schedule({
                notifications: [
                  {
                    title: "Evening Reminder",
                    body: remembranceVerses[
                      Math.floor(Math.random() * remembranceVerses.length)
                    ],
                    id: 3,
                    schedule: {
                      on: { hour: 19, minute: 0 },
                      allowWhileIdle: true,
                      repeats: true,
                    },
                  },
                ],
              });
              await updateUserPreference("eveningNotification", 1);
            }
          }}
        ></IonToggle>
      </div>
    </section>
  );
};

export default NotificationOptions;
