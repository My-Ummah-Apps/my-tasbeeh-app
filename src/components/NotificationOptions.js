import Switch from "react-ios-switch";
import { LocalNotifications } from "@capacitor/local-notifications";
import { useState, useEffect } from "react";

const NotificationOptions = ({
  setThreeHourlyNotifications,
  threeHourlyNotifications,
  setMorningNotification,
  morningNotification,
  afternoonNotification,
  setAfternoonNotification,
  eveningNotification,
  setEveningNotification,
  activeBackgroundColor,
  changeThreeHourlyNotificationState,
}) => {
  const toggleAllNotificationsOff = () => {
    console.log("toggleAllNotificationsOff executed");
    setMorningNotification(false);
    setAfternoonNotification(false);
    setEveningNotification(false);
  };

  const [notificationsPermissionStatus, setNotificationsPermissionStatus] =
    useState("");

  return (
    <div className="notification-options-wrap">
      {/* <p className="notifications-heading">Notifications</p> */}
      {/* <div className="individual-notification-option-wrap">
        <div className="individual-notification-text-wrap">
          <p>Three Hourly Notifications</p>
          <p className="notificatiions-options-sub-text">
            Receive notifications every three hours
          </p>
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
      </div> */}
      <div className="individual-notification-option-wrap">
        <div className="individual-notification-text-wrap">
          <p>Morning</p>
          <p className="notificatiions-options-sub-text">
            Receive notifications every morning
          </p>
        </div>
        <Switch
          checked={morningNotification}
          className={undefined}
          disabled={undefined}
          handleColor="white"
          name={undefined}
          offColor="white"
          onChange={(e) => {
            console.log("MORNING TOGGLE CLICKED");
            // e.preventDefault();

            if (
              JSON.parse(localStorage.getItem("morning-notification")) == true
            ) {
              console.log("MORNING TOGGLE TURNED OFF");
              setMorningNotification(false);
              localStorage.setItem(
                "morning-notification",
                JSON.stringify(false)
              );
            } else if (
              JSON.parse(localStorage.getItem("morning-notification")) == false
            ) {
              console.log("MORNING TOGGLE TURNED ON");
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
          <p className="notificatiions-options-sub-text">
            Receive notifications every afternoon
          </p>
        </div>
        <Switch
          checked={afternoonNotification}
          className={undefined}
          disabled={undefined}
          handleColor="white"
          name={undefined}
          offColor="white"
          onChange={(e) => {
            if (
              JSON.parse(localStorage.getItem("afternoon-notification")) == true
            ) {
              setAfternoonNotification(false);
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
          <p className="notificatiions-options-sub-text">
            Receive notifications every evening
          </p>
        </div>
        <Switch
          checked={eveningNotification}
          className={undefined}
          disabled={undefined}
          handleColor="white"
          name={undefined}
          offColor="white"
          onChange={(e) => {
            if (
              JSON.parse(localStorage.getItem("evening-notification")) == true
            ) {
              setEveningNotification(false);
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
