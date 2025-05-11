import Switch from "react-ios-switch";
import { LocalNotifications } from "@capacitor/local-notifications";

const NotificationOptions = ({
  activeCounter,
  setMorningNotification,
  morningNotification,
  afternoonNotification,
  setAfternoonNotification,
  eveningNotification,
  setEveningNotification,
}) => {
  const cancelNotification = async (id) => {
    await LocalNotifications.cancel({ notifications: [{ id: id }] });
  };

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
          checked={morningNotification}
          handleColor="white"
          offColor="white"
          onChange={() => {
            if (
              JSON.parse(localStorage.getItem("morning-notification")) == true
            ) {
              setMorningNotification(false);
              cancelNotification(1);
              localStorage.setItem(
                "morning-notification",
                JSON.stringify(false)
              );
            } else if (
              JSON.parse(localStorage.getItem("morning-notification")) == false
            ) {
              setMorningNotification(true);
              localStorage.setItem(
                "morning-notification",
                JSON.stringify(true)
              );
            }
          }}
          onColor={activeCounter.color}
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
          checked={afternoonNotification}
          handleColor="white"
          name={undefined}
          offColor="white"
          onChange={(e) => {
            if (
              JSON.parse(localStorage.getItem("afternoon-notification")) == true
            ) {
              setAfternoonNotification(false);
              cancelNotification(2);
              localStorage.setItem(
                "afternoon-notification",
                JSON.stringify(false)
              );
            } else if (
              JSON.parse(localStorage.getItem("afternoon-notification")) ==
              false
            ) {
              setAfternoonNotification(true);
              localStorage.setItem(
                "afternoon-notification",
                JSON.stringify(true)
              );
            }
          }}
          onColor={activeCounter.color}
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
          checked={eveningNotification}
          handleColor="white"
          name={undefined}
          offColor="white"
          onChange={(e) => {
            if (
              JSON.parse(localStorage.getItem("evening-notification")) == true
            ) {
              setEveningNotification(false);
              cancelNotification(3);
              localStorage.setItem(
                "evening-notification",
                JSON.stringify(false)
              );
            } else if (
              JSON.parse(localStorage.getItem("evening-notification")) == false
            ) {
              setEveningNotification(true);
              localStorage.setItem(
                "evening-notification",
                JSON.stringify(true)
              );
            }
          }}
          onColor={activeCounter.color}
        />
      </div>
    </div>
  );
};

export default NotificationOptions;
