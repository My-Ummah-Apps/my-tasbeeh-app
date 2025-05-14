import { useEffect, useState, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { Dialog } from "@capacitor/dialog";
import {
  NativeSettings,
  AndroidSettings,
  IOSSettings,
} from "capacitor-native-settings";

import { MdOutlineChevronRight } from "react-icons/md";
import { Sheet } from "react-modal-sheet";
import Switch from "react-ios-switch";
import NotificationOptions from "../components/NotificationOptions";
import AboutUs from "../components/AboutUs";
// import { Purchases } from "@awesome-cordova-plugins/purchases";
// import { PURCHASE_TYPE } from "cordova-plugin-purchases";
import { Share } from "@capacitor/share";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Style } from "@capacitor/status-bar";

import {
  setStatusAndNavBarBackgroundColor,
  showConfirmDialog,
  showToast,
  TWEEN_CONFIG,
} from "../utils/constants";
import { counterObjType, themeType } from "../utils/types";

// import ThemeOptions from "../components/ThemeOptions";

interface SettingsageProps {
  activeCounter: counterObjType;
  setHaptics: React.Dispatch<React.SetStateAction<boolean | null>>;
  haptics: boolean | null;
  resetAllCounters: () => void;
  setDailyCounterReset: React.Dispatch<React.SetStateAction<boolean>>;
  dailyCounterReset: boolean;
}

const SettingsPage = ({
  // iapProducts,
  activeCounter,
  setHaptics,
  haptics,
  resetAllCounters,
  setDailyCounterReset,
  dailyCounterReset,
}: SettingsageProps) => {
  const [morningNotification, setMorningNotification] = useState(false);
  const [afternoonNotification, setAfternoonNotification] = useState(false);
  const [eveningNotification, setEveningNotification] = useState(false);
  const [theme, setTheme] = useState<themeType | null>(null);
  const [showNotificationsSheet, setShowNotificationsSheet] = useState(false);
  const [showAboutUsSheet, setShowAboutUsSheet] = useState(false);

  useEffect(() => {
    setTheme(JSON.parse(localStorage.getItem("theme")) || "light");
  }, []);

  let requestPermission;
  let checkPermission;
  let userNotificationPermission;

  const showNotificationsAlert = async () => {
    const { value } = await Dialog.confirm({
      title: "Open Settings",
      message: `You currently have notifications turned off for this application, you can open Settings to re-enable them`,
      okButtonTitle: "Settings",
      cancelButtonTitle: "Cancel",
    });

    if (value) {
      if (Capacitor.getPlatform() === "ios") {
        NativeSettings.openIOS({
          option: IOSSettings.App,
        });
      } else if (Capacitor.getPlatform() === "android") {
        NativeSettings.openAndroid({
          option: AndroidSettings.AppNotification,
        });
      }
    }
  };

  async function checkNotificationPermissions() {
    checkPermission = await LocalNotifications.checkPermissions();
    userNotificationPermission = checkPermission.display;

    if (userNotificationPermission === "denied") {
      showNotificationsAlert();
      return;
    } else if (checkPermission.display === "granted") {
      setShowNotificationsSheet(true);
    } else if (
      // checkPermission.display == "denied" ||
      checkPermission.display === "prompt" ||
      checkPermission.display === "prompt-with-rationale"
    ) {
      await requestPermissionFunction();
      setMorningNotification(false);
      setAfternoonNotification(false);
      setEveningNotification(false);
      setShowNotificationsSheet(true);
      // localStorage.setItem("morning-notification", JSON.stringify(false));
    }
  }

  const requestPermissionFunction = async () => {
    requestPermission = await LocalNotifications.requestPermissions();

    if (requestPermission.display === "granted") {
      // setMorningNotification(true);
    } else if (
      requestPermission.display === "denied" ||
      requestPermission.display === "prompt"
    ) {
      setMorningNotification(false);
      setAfternoonNotification(false);
      setEveningNotification(false);
    }
  };

  // async function triggerPurchase(tipAmount) {
  //   try {
  //     if (Capacitor.getPlatform() == "ios") {
  //       const { customerInfo, productIdentifier } =
  //         await Purchases.purchaseProduct(tipAmount);
  //     }
  //   } catch (e) {
  //     // if (!e.userCancelled) {
  //     console.log("ERROR HAS OCCURRED:");
  //     console.log(e);
  //     // console.log(e.userCancelled);

  //     // }
  //   }
  //   try {
  //     if (Capacitor.getPlatform() == "android") {
  //       await Purchases.purchaseProduct(
  //         tipAmount,
  //         null,
  //         Purchases.PURCHASE_TYPE.INAPP
  //       );
  //     }
  //   } catch (e) {
  //     console.log("ERROR", e);
  //     console.log(Purchases.PURCHASE_TYPE.INAPP);
  //   }
  //   // try {
  //   //   await Purchases.purchaseProduct(
  //   //     tipAmount,
  //   //     ({ productIdentifier, customerInfo }) => {
  //   //       // console.log("productIdentifier and customerInfo:");
  //   //       // console.log(productIdentifier);
  //   //       // console.log(customerInfo);
  //   //     },
  //   //     ({ error, userCancelled }) => {
  //   //       // Error making purchase
  //   //       console.log("ERROR HAS OCCURRED:");
  //   //       console.log(error);
  //   //     },
  //   //     null,
  //   //     Purchases.PURCHASE_TYPE.INAPP
  //   //   );
  //   // } catch (e) {
  //   //   console.log("ERROR OCCURRED:");
  //   //   console.log(e);
  //   //   console.log("Purchases.PURCHASE_TYPE.INAPP is:");
  //   //   console.log(Purchases.PURCHASE_TYPE.INAPP);
  //   // }

  //   // console.log("PURCHASE SUCCESSFULL");
  //   // console.log(customerInfo);
  //   // console.log(productIdentifier);

  // }

  const shareThisAppLink = async () => {
    let link;
    if (Capacitor.getPlatform() === "ios") {
      link = "https://apps.apple.com/us/app/my-tasbeeh-app/id6449438967";
    } else if (Capacitor.getPlatform() === "android") {
      link = "https://play.google.com/store/apps/details?id=com.tasbeeh.my";
    }

    await Share.share({
      title: "",
      text: "",
      url: link,
      dialogTitle: "",
    });
  };
  const link = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className="settings-page-wrap">
      <div className="settings-page-header">
        <p>Settings</p>
      </div>

      {/* 
        <ThemeOptions
          formTheme={formTheme}
          theme={theme}
          activeCounter={activeCounter}
          setTheme={setTheme}
        />
      */}

      <div className="settings-page-options-and-info-wrap">
        {/* <div className="individual-section-wrap">
          <div
            className="support-box-wrap"
            onClick={() => {

            }}
          >
            <div className="support-box-icon-and-text-wrap">
              <FaHandHoldingHeart
                style={{
                  fontSize: "32px",
                  color: activeCounter.color,
                }}
              />
              <div className="support-box-text-wrap">
                <p className="support-main-text-heading">Contribute</p>
                <p className="support-sub-text">Support our work</p>
              </div>
            </div>
            <MdOutlineChevronRight className="chevron" />
          </div>

        
            <div className="tip-box-wrap">
              <p
                className="tip-jar-box-first-line-of-text tip-jar-box-text"
                style={{
                  backgroundColor: activeCounter.color,
                }}
              ></p>

              <p
                className="tip-jar-box-text"
                style={{
                  backgroundColor: activeCounter.color,
                }}
              >
                MyUmmahApps Ltd provides free, open source applications for the
                Muslim community, these applications contain no ads.
              </p>

              <p
                className="tip-jar-box-text"
                style={{
                  backgroundColor: activeCounter.color,
                }}
              >
                {" "}
                Your support will help us continue serving the Ummah in this
                endeavor.
              </p>

              <p
                className="tip-jar-box-text"
                style={{
                  backgroundColor: activeCounter.color,
                }}
              >
                {" "}
                May Allah reward you.
              </p>

              {!iapProducts ? (
                <p style={{ padding: "2rem" }}>Loading...</p>
              ) : (
                iapProducts.map((item) => {
                  return (
                    <div
                      className="tip-wrap"
                      onClick={() => {
                        triggerPurchase(item.identifier);

                      }}
                    >
                      <p>{item.title}</p>
                      <p>{item.priceString}</p>
                    </div>
                  );
                })
              )}
            
                {" "}
                <div class="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>

            </div>

        </div>
*/}
        {/* {Capacitor.isNativePlatform() ? ( */}
        <div className="individual-section-wrap">
          <div
            className="notifications-wrap"
            onClick={() => {
              checkNotificationPermissions();
            }}
          >
            <div className="text-wrap" style={{ display: "block" }}>
              <p>Notifications</p>
              <p>Set Notifications</p>
            </div>
            <MdOutlineChevronRight className="chevron" />
          </div>
          <Sheet
            disableDrag={false}
            isOpen={showNotificationsSheet}
            onClose={() => setShowNotificationsSheet(false)}
            detent="content-height"
            tweenConfig={TWEEN_CONFIG}
          >
            <Sheet.Container>
              {/* <Sheet.Header /> */}
              <Sheet.Content>
                {" "}
                <NotificationOptions
                  activeCounter={activeCounter}
                  setMorningNotification={setMorningNotification}
                  morningNotification={morningNotification}
                  afternoonNotification={afternoonNotification}
                  setAfternoonNotification={setAfternoonNotification}
                  eveningNotification={eveningNotification}
                  setEveningNotification={setEveningNotification}
                />
              </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop
              // style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
              onTap={() => setShowNotificationsSheet(false)}
            />
          </Sheet>
        </div>
        {/* // ) : null} */}
        <div className="individual-section-wrap">
          <div className="theme-wrap">
            <div className="text-wrap" style={{ display: "block" }}>
              <p>Dark Theme</p>
              <p>
                Toggle between Light / Dark Theme
                {/* Current Theme: {theme == "light" ? "Light" : "Dark"} */}
                {/* Current Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)} */}
              </p>
            </div>
            {/* <MdOutlineChevronRight className="chevron" /> */}
            <Switch
              checked={theme == "light" ? false : true}
              className={undefined}
              disabled={undefined}
              handleColor="white"
              name={undefined}
              offColor="white"
              onChange={(e) => {
                if (theme == "light") {
                  setTheme("dark");
                  if (Capacitor.isNativePlatform()) {
                    setStatusAndNavBarBackgroundColor("#242424", Style.Dark);
                  }

                  localStorage.setItem("theme", JSON.stringify("dark"));
                  document.body.classList.add("dark");
                } else if (theme == "dark") {
                  setTheme("light");
                  if (Capacitor.isNativePlatform()) {
                    setStatusAndNavBarBackgroundColor("#EDEDED", Style.Light);
                  }

                  localStorage.setItem("theme", JSON.stringify("light"));
                  document.body.classList.remove("dark");
                }
              }}
              onColor={activeCounter.color}
            />
          </div>
        </div>
        <div className="individual-section-wrap">
          {Capacitor.isNativePlatform() && (
            <div className="individual-row-wrap haptic-wrap">
              <div className="text-wrap" style={{ display: "block" }}>
                <p>Haptic Vibration</p>
                <p>Set vibration on every increment</p>
              </div>
              <Switch
                checked={haptics}
                handleColor="white"
                name={undefined}
                offColor="white"
                onChange={(e) => {
                  const newHapticsValue = !haptics;
                  setHaptics(newHapticsValue);
                  localStorage.setItem(
                    "haptics",
                    JSON.stringify(newHapticsValue)
                  );
                }}
                onColor={activeCounter.color}
              />
            </div>
          )}
          <div className="individual-row-wrap">
            <div className="text-wrap" style={{ display: "block" }}>
              <p>Auto Reset Adhkar</p>
              <p>Adhkar will be reset daily</p>
            </div>
            <Switch
              checked={dailyCounterReset}
              handleColor="white"
              name={undefined}
              offColor="white"
              onChange={() => {
                const newResetValue = !dailyCounterReset;
                setDailyCounterReset(newResetValue);
                localStorage.setItem(
                  "dailyCounterReset",
                  JSON.stringify(newResetValue)
                );
              }}
              onColor={activeCounter.color}
            />
          </div>
          <div className="reset-adkhar-text-wrap">
            <p
              onClick={async () => {
                const result = await showConfirmDialog(
                  "Reset All Adhkar",
                  "Are you sure you want to reset all Adkhar to 0?"
                );
                console.log("RESULT IS: ", result);

                if (result) {
                  resetAllCounters();
                  showToast("All Adhkar reset to 0", "bottom", "short");
                }
              }}
            >
              Reset all Adhkar
            </p>
          </div>
        </div>
        <div className="individual-section-wrap">
          {Capacitor.getPlatform() == "android" ? (
            <div
              className="review-wrap"
              onClick={() => {
                link(
                  "https://play.google.com/store/apps/details?id=com.tasbeeh.my"
                );
              }}
            >
              <div className="text-wrap" style={{ display: "block" }}>
                <p>Write a review</p>
                <p>Rate us on the Play Store</p>
              </div>
              <MdOutlineChevronRight className="chevron" />
            </div>
          ) : null}
          {Capacitor.getPlatform() == "ios" ? (
            <div
              className="review-wrap"
              onClick={() => {
                link(
                  "https://apps.apple.com/us/app/my-tasbeeh-app/id6449438967"
                );
              }}
            >
              <div className="text-wrap" style={{ display: "block" }}>
                <p>Write a review</p>
                <p>Rate us on the App Store</p>
              </div>
              <MdOutlineChevronRight className="chevron" />
            </div>
          ) : null}
          {Capacitor.isNativePlatform() ? (
            <div className="share-wrap" onClick={shareThisAppLink}>
              <div className="text-wrap" style={{ display: "block" }}>
                <p>Share</p>
                <p>Share application</p>
              </div>
              <MdOutlineChevronRight className="chevron" />
            </div>
          ) : null}
          <div
            className="feedback-wrap"
            onClick={() => {
              link(
                "mailto: contact@myummahapps.com?subject=My Tasbeeh App Feedback"
              );
            }}
          >
            <div className="text-wrap" style={{ display: "block" }}>
              <p>Feedback</p>
              <p>Send us your feedback</p>
            </div>
            <MdOutlineChevronRight className="chevron" />
          </div>
          <div
            className="website-wrap"
            onClick={() => {
              link("https://myummahapps.com/");
            }}
          >
            <div className="text-wrap" style={{ display: "block" }}>
              <p>Website</p>
              <p>Visit our website</p>
            </div>
            <MdOutlineChevronRight className="chevron" />
          </div>
          {/* {Capacitor.isNativePlatform() ? ( */}
          <div onClick={() => setShowAboutUsSheet(true)}>
            <div className="text-wrap" style={{ display: "block" }}>
              <p>About</p>
              <p>About us</p>
            </div>
            <MdOutlineChevronRight className="chevron" />
            <Sheet
              disableDrag={false}
              isOpen={showAboutUsSheet}
              onClose={() => setShowAboutUsSheet(false)}
              detent="content-height"
              tweenConfig={TWEEN_CONFIG}
            >
              <Sheet.Container>
                {/* <Sheet.Header /> */}
                <Sheet.Content>
                  <AboutUs />
                </Sheet.Content>
              </Sheet.Container>
              <Sheet.Backdrop
                // style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                onTap={() => setShowAboutUsSheet(false)}
              />
            </Sheet>
          </div>
          {/* ) : null} */}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
