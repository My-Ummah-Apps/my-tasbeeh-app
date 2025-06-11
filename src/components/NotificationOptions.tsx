// @ts-ignore
import Switch from "react-ios-switch";
import { LocalNotifications } from "@capacitor/local-notifications";
import {
  counterObjType,
  MaterialColor,
  PreferenceKeyType,
  themeType,
  userPreferencesType,
} from "../utils/types";
// import { Capacitor } from "@capacitor/core";

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

  // LocalNotifications.createChannel({
  //   id: "1",
  //   name: "Notification",
  //   description: "General Notification",
  // });

  return (
    <section className="notification-options-wrap">
      <h2 className="notifications-options-heading-text">Notifications</h2>
      <section className="individual-notification-option-wrap">
        <div className="individual-notification-text-wrap">
          <p>Morning</p>
          <p className="notificatiions-options-sub-text">
            Receive notifications every morning
          </p>
        </div>
        <Switch
          checked={
            userPreferencesState.morningNotification === 1 ? true : false
          }
          handleColor="white"
          offColor="white"
          onChange={async () => {
            if (userPreferencesState.morningNotification === 1) {
              await updateUserPreference("morningNotification", 0);
              await cancelNotification(1);
            } else {
              await LocalNotifications.schedule({
                notifications: [
                  {
                    title: "Morning Reminder",
                    body: `"Therefore remember Me. I will remember you." (Quran 2:152)`,
                    id: 1,
                    schedule: {
                      on: { hour: 8, minute: 0 },
                      allowWhileIdle: true,
                      repeats: true,
                    },
                  },
                ],
              });
              await updateUserPreference("morningNotification", 1);
            }
          }}
          onColor={activeColor}
        />
      </section>
      <div className="individual-notification-option-wrap">
        <div className="individual-notification-text-wrap">
          <p>Afternoon</p>
          <p className="notificatiions-options-sub-text">
            Receive notifications every afternoon
          </p>
        </div>
        <Switch
          checked={
            userPreferencesState.afternoonNotification === 1 ? true : false
          }
          handleColor="white"
          name={undefined}
          offColor="white"
          onChange={async () => {
            if (userPreferencesState.afternoonNotification === 1) {
              await updateUserPreference("afternoonNotification", 0);
              await cancelNotification(2);
            } else {
              await LocalNotifications.schedule({
                notifications: [
                  {
                    title: "Afternoon Reminder",
                    body: `“And remember Allah much, that you may be successful." (Quran 62:10)`,
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
          onColor={activeColor}
        />
      </div>
      <div className="individual-notification-option-wrap">
        <div className="individual-notification-text-wrap">
          <p>Evening</p>
          <p className="notificatiions-options-sub-text">
            Receive notifications every evening
          </p>
        </div>
        <Switch
          checked={
            userPreferencesState.eveningNotification === 1 ? true : false
          }
          handleColor="white"
          name={undefined}
          offColor="white"
          onChange={async () => {
            if (userPreferencesState.eveningNotification === 1) {
              await updateUserPreference("eveningNotification", 0);
              await cancelNotification(3);
            } else {
              await LocalNotifications.schedule({
                notifications: [
                  {
                    title: "Evening Reminder",
                    body: `"And the remembrance of Allah is greater." (Quran 29:45)`,
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
          onColor={activeColor}
        />
      </div>
    </section>
  );
};

export default NotificationOptions;
