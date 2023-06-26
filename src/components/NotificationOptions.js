import Switch from "react-ios-switch";

const test = () => {
  console.log("triggered");
};

const NotificationOptions = ({
  setSimpleNotifications,
  simpleNotifications,
  activeBackgroundColor,
}) => {
  return (
    <div className="notification-options-wrap">
      <p className="notifications-heading">Notifications</p>
      <div className="individual-notification-option-wrap">
        <div className="individual-notification-text-wrap">
          <p>Simple Notifications</p>
          <p>Receive notifications every two hours</p>
        </div>
        <Switch
          checked={simpleNotifications}
          className={undefined}
          disabled={undefined}
          handleColor="white"
          name={undefined}
          offColor="white"
          onChange={(e) => {
            if (
              JSON.parse(localStorage.getItem("simple-notifications")) == true
            ) {
              setSimpleNotifications(false);
              localStorage.setItem(
                "simple-notifications",
                JSON.stringify(false)
              );
            } else if (
              JSON.parse(localStorage.getItem("simple-notifications")) == false
            ) {
              setSimpleNotifications(true);
              localStorage.setItem(
                "simple-notifications",
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
          <p>Morning</p>
          <p>Receiving notifications every morning</p>
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
