// @ts-ignore
import Switch from "react-ios-switch";
import { LocalNotifications } from "@capacitor/local-notifications";
import {
  counterObjType,
  MaterialColor,
  NotificationParams,
  Notifications,
  userPreferencesType,
} from "../utils/types";
import { Capacitor } from "@capacitor/core";
import { useEffect } from "react";

interface NotificationOptionsProps {
  setUserPreferencesState: React.Dispatch<
    React.SetStateAction<userPreferencesType>
  >;
  userPreferencesState: userPreferencesType;
  activeColor: MaterialColor;
  activeCounter: counterObjType;
}

const NotificationOptions = ({
  setUserPreferencesState,
  userPreferencesState,
  activeColor,
}: NotificationOptionsProps) => {
  // const manageNotification = (
  //   storageKey: Notifications,
  //   setState: React.Dispatch<React.SetStateAction<boolean>>
  // ) => {
  //   if (Capacitor.isNativePlatform()) {
  //     const notificationValue: boolean = JSON.parse(
  //       localStorage.getItem(storageKey) || "false"
  //     );

  //     if (notificationValue === null || notificationValue === false) {
  //       // localStorage.setItem(storageKey, JSON.stringify(false));
  //       setState(false);
  //     } else if (notificationValue === true) {
  //       setState(true);
  //     }
  //   }
  // };

  useEffect(() => {
    // manageNotification("morning-notification", setMorningNotification);
    // manageNotification("afternoon-notification", setAfternoonNotification);
    // manageNotification("evening-notification", setEveningNotification);
  }, []);

  const toggleNotification = async ({
    storageKey,
    setState,
    id,
    title,
    body,
    hour,
    minute,
  }: NotificationParams) => {
    const notificationValue = JSON.parse(
      localStorage.getItem(storageKey) || "false"
    );

    if (notificationValue === true) {
      setState(false);
      cancelNotification(id);
      // localStorage.setItem(storageKey, JSON.stringify(false));
    } else if (notificationValue === false) {
      setState(true);
      // localStorage.setItem(storageKey, JSON.stringify(true));
      await LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: body,
            id: id,
            schedule: {
              on: { hour: hour, minute: minute },
              allowWhileIdle: true,
              repeats: true,
            },
          },
        ],
      });
    }
  };

  const cancelNotification = async (id: number) => {
    await LocalNotifications.cancel({ notifications: [{ id: id }] });
  };

  // LocalNotifications.createChannel({
  //   id: "1",
  //   name: "Notification",
  //   description: "General Notification",
  // });

  return (
    <div className="notification-options-wrap">
      <h2 className="notifications-options-heading-text">Notifications</h2>
      <div className="individual-notification-option-wrap">
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
            await toggleNotification({
              storageKey: "morning-notification",
              setState: setMorningNotification,
              id: 1,
              title: "Morning Reminder",
              body: `"Therefore remember Me. I will remember you." (Quran 2:152)`,
              hour: 8,
              minute: 0,
            });
          }}
          onColor={activeColor}
        />
      </div>
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
            await toggleNotification({
              storageKey: "afternoon-notification",
              setState: setAfternoonNotification,
              id: 2,
              title: "Afternoon Reminder",
              body: `“And remember Allah much, that you may be successful." (Quran 62:10)`,
              hour: 14,
              minute: 0,
            });
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
            await toggleNotification({
              storageKey: "evening-notification",
              setState: setEveningNotification,
              id: 3,
              title: "Evening Reminder",
              body: `"And the remembrance of Allah is greater." (Quran 29:45)`,
              hour: 19,
              minute: 0,
            });
          }}
          onColor={activeColor}
        />
      </div>
    </div>
  );
};

export default NotificationOptions;
