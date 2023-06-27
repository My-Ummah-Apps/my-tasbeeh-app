import Switch from "react-ios-switch";
import { LocalNotifications } from "@capacitor/local-notifications";

const test = () => {
  console.log("triggered");
};

const NotificationOptions = ({
  setThreeHourlyNotifications,
  threeHourlyNotifications,
  setMorningNotification,
  morningNotification,
  activeBackgroundColor,
  changeThreeHourlyNotificationState,
}) => {
  return (
    <div className="notification-options-wrap">
      <p className="notifications-heading">Notifications</p>
      <div className="individual-notification-option-wrap">
        <div className="individual-notification-text-wrap">
          <p>Three Hourly Notifications</p>
          <p>Receive notifications every two hours</p>
        </div>
        <Switch
          checked={threeHourlyNotifications}
          className={undefined}
          disabled={undefined}
          handleColor="white"
          name={undefined}
          offColor="white"
          onChange={(e) => {
            if (
              JSON.parse(localStorage.getItem("three-hourly-notifications")) ==
              true
            ) {
              setThreeHourlyNotifications(false);
              // changeThreeHourlyNotificationState(false);
              localStorage.setItem(
                "three-hourly-notifications",
                JSON.stringify(false)
              );
            } else if (
              JSON.parse(localStorage.getItem("three-hourly-notifications")) ==
              false
            ) {
              setThreeHourlyNotifications(true);
              // changeThreeHourlyNotificationState(true);
              localStorage.setItem(
                "three-hourly-notifications",
                JSON.stringify(true)
              );
              // scheduleThreeHourlyNotifications();
            }
          }}
          onColor={activeBackgroundColor}
          pendingOffColor={undefined}
          pendingOnColor={undefined}
          readOnly={undefined}
          style={undefined}
        />
      </div>
      <div className="individual-notification-option-wrap">
        <div className="individual-notification-text-wrap">
          <p>Morning</p>
          <p>Receiving notifications every morning</p>
        </div>
        <Switch
          checked={morningNotification}
          className={undefined}
          disabled={undefined}
          handleColor="white"
          name={undefined}
          offColor="white"
          onChange={(e) => {
            console.log(morningNotification);
            if (
              JSON.parse(localStorage.getItem("morning-notification")) == true
            ) {
              console.log("localStorage.getItem(morning-notification) == true");
              setMorningNotification(false);
              localStorage.setItem(
                "morning-notification",
                JSON.stringify(false)
              );
            } else if (
              JSON.parse(localStorage.getItem("morning-notification")) == false
            ) {
              console.log(
                "localStorage.getItem(morning-notification) == false"
              );
              setMorningNotification(true);
              localStorage.setItem(
                "morning-notification",
                JSON.stringify(true)
              );
            }
          }}
          onColor={activeBackgroundColor}
          pendingOffColor={undefined}
          pendingOnColor={undefined}
          readOnly={undefined}
          style={undefined}
        />
      </div>
      <div className="individual-notification-option-wrap">
        <div className="individual-notification-text-wrap">
          <p>Afternoon</p>
          <p>Receiving notifications every afternoon</p>
        </div>
        <Switch
          //   checked={}
          className={undefined}
          disabled={undefined}
          handleColor="white"
          name={undefined}
          offColor="white"
          onChange={(e) => {}}
          onColor={activeBackgroundColor}
          pendingOffColor={undefined}
          pendingOnColor={undefined}
          readOnly={undefined}
          style={undefined}
        />
      </div>
      <div className="individual-notification-option-wrap">
        <div className="individual-notification-text-wrap">
          <p>Evening</p>
          <p>Receiving notifications every evening</p>
        </div>
        <Switch
          //   checked={}
          className={undefined}
          disabled={undefined}
          handleColor="white"
          name={undefined}
          offColor="white"
          onChange={(e) => {}}
          onColor={activeBackgroundColor}
          pendingOffColor={undefined}
          pendingOnColor={undefined}
          readOnly={undefined}
          style={undefined}
        />
      </div>
    </div>
  );
};

export default NotificationOptions;
