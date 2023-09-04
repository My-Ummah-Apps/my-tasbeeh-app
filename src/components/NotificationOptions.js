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
  toggleAllNotificationsOff = () => {
    console.log("toggleAllNotificationsOff executed");
    setMorningNotification(false);
    setAfternoonNotification(false);
    setEveningNotification(false);
  };

  let requestPermission;
  let checkPermission;

  const [notificationPermission, setNotificationPermission] = useState(null);

  useEffect(() => {
    // checkPermission.display will give: "granted", "denied", "prompt" or "prompt-with-rationale", not seen "prompt" on iOS thus far
    (async () => {
      checkPermission = await LocalNotifications.checkPermissions();
      console.log("checkPermission.display:");
      console.log(checkPermission);
      if (
        checkPermission.display == "denied" ||
        checkPermission.display == "prompt" ||
        checkPermission.display == "prompt-with-rationale"
      ) {
        console.log("CHECKPERMISSION.DISPLAY IS DENIED OR PROMPT");
        setNotificationPermission(false);
        setMorningNotification(false);
        setAfternoonNotification(false);
        setEveningNotification(false);
        console.log("MORNING NOTIFICATION STATE:");
        console.log(morningNotification);
      } else if (checkPermission.display == "granted") {
        setNotificationPermission(true);
      }
    })();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  // useEffect(() => {
  //   checkNotificationPermissionStatus();
  // }, []);

  const requestNotificationPermission = async () => {
    if (checkPermission == "denied") {
      setMorningNotification(false);
      setAfternoonNotification(false);
      setEveningNotification(false);
      alert(
        "Hey you denied initial permission, now go into settings and allow them!"
      );
      return;
    }

    try {
      requestPermission = await LocalNotifications.requestPermissions();
      console.log("requestPermission.display:");
      console.log(requestPermission.display);
      if (requestPermission.display == "granted") {
        setMorningNotification(true);
        console.log("REQUEST GRANTED WITHIN REQUESTPERMISSION!");
      } else if (requestPermission.display == "denied") {
        alert(
          "Hey you denied initial permission, now go into settings and allow them!"
        );
        setMorningNotification(false);
        setAfternoonNotification(false);
        setEveningNotification(false);
      } else if (requestPermission.display == "prompt") {
        setMorningNotification(false);
        setAfternoonNotification(false);
        setEveningNotification(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  let toggleAllNotificationsOff;

  // let morningToggle;
  // useEffect(() => {
  //   console.log("morningNotification within useEffect:");
  //   console.log(morningNotification);
  //   morningNotification == true
  //     ? (morningToggle = true)
  //     : (morningToggle = false);
  // }, [morningNotification]);

  // checkNotificationPermissionStatus();

  const [notificationsPermissionStatus, setNotificationsPermissionStatus] =
    useState("");

  // console.log(notificationsPermissionStatus);

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
          // checked={morningNotification == true ? true : false}
          className={undefined}
          disabled={undefined}
          handleColor="white"
          name={undefined}
          offColor="white"
          onChange={(e) => {
            if (
              JSON.parse(localStorage.getItem("morning-notification")) == false
            ) {
              requestNotificationPermission();
              console.log("REQUEST PERMISSION HAS RUN!");
            }

            if (
              JSON.parse(localStorage.getItem("morning-notification")) == true
            ) {
              setMorningNotification(false);
              localStorage.setItem(
                "morning-notification",
                JSON.stringify(false)
              );
            } else if (
              JSON.parse(localStorage.getItem("morning-notification")) == false
            ) {
              // setMorningNotification(true);
              localStorage.setItem(
                "morning-notification",
                JSON.stringify(true)
              );
            }

            // else if (checkPermission.display == "denied") {
            //   alert("Please turn on notifications");
            //   setMorningNotification(false);
            // }
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
            // requestNotificationPermission();
            if (checkPermission.display == "granted") {
              if (
                JSON.parse(localStorage.getItem("afternoon-notification")) ==
                true
              ) {
                // console.log(
                //   "localStorage.getItem(afternoon-notification) == true"
                // );
                setAfternoonNotification(false);
                localStorage.setItem(
                  "afternoon-notification",
                  JSON.stringify(false)
                );
              } else if (
                JSON.parse(localStorage.getItem("afternoon-notification")) ==
                false
              ) {
                // console.log(
                //   "localStorage.getItem(afternoon-notification) == false"
                // );
                setAfternoonNotification(true);
                localStorage.setItem(
                  "afternoon-notification",
                  JSON.stringify(true)
                );
              } else if (checkPermission.display == "denied") {
                alert("Please turn on notifications");
              }
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
            // requestNotificationPermission();
            if (checkPermission.display == "granted") {
              if (
                JSON.parse(localStorage.getItem("evening-notification")) == true
              ) {
                // console.log("localStorage.getItem(evening-notification) == true");
                setEveningNotification(false);
                localStorage.setItem(
                  "evening-notification",
                  JSON.stringify(false)
                );
              } else if (
                JSON.parse(localStorage.getItem("evening-notification")) ==
                false
                //    &&
                // checkPermission.display == true
              ) {
                // console.log(
                //   "localStorage.getItem(evening-notification) == false"
                // );
                setEveningNotification(true);
                localStorage.setItem(
                  "evening-notification",
                  JSON.stringify(true)
                );
              } else if (checkPermission.display == "denied") {
                alert("Please turn on notifications");
              }
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
