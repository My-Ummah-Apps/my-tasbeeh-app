import Switch from "react-ios-switch";
import { LocalNotifications } from "@capacitor/local-notifications";
import { useState, useEffect } from "react";

const NotificationOptions = ({
  setMorningNotification,
  morningNotification,
  afternoonNotification,
  setAfternoonNotification,
  eveningNotification,
  setEveningNotification,
  activeBackgroundColor,
}) => {
  return (
    <div className="notification-options-wrap">
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
          onChange={() => {
            console.log("MORNING TOGGLE CLICKED");

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
