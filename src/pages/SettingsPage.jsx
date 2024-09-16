import { useEffect, useState, useRef } from "react";
import React from "react";
import { Capacitor } from "@capacitor/core";
import { Dialog } from "@capacitor/dialog";
import {
  NativeSettings,
  AndroidSettings,
  IOSSettings,
} from "capacitor-native-settings";

import { MdOutlineChevronRight } from "react-icons/md";
import { FaHandHoldingHeart } from "react-icons/fa";
import { Sheet } from "react-modal-sheet";

// import { FaJar } from "react-icons/fa6";
// import { GiMasonJar } from "react-icons/gi";
import Switch from "react-ios-switch";
import NotificationOptions from "../components/NotificationOptions";
import AboutUs from "../components/AboutUs";

// import { Purchases } from "@awesome-cordova-plugins/purchases";
// import { PURCHASE_TYPE } from "cordova-plugin-purchases";
import { Share } from "@capacitor/share";
import { LocalNotifications } from "@capacitor/local-notifications";
import { StatusBar, Style } from "@capacitor/status-bar";
import { ActionSheet, ActionSheetButtonStyle } from "@capacitor/action-sheet";
import { Toast } from "@capacitor/toast";

// import ThemeOptions from "../components/ThemeOptions";

const SettingsPage = ({
  // iapProducts,
  resetAllCounters,
  morningNotification,
  setMorningNotification,
  afternoonNotification,
  setAfternoonNotification,
  eveningNotification,
  setEveningNotification,
  modalStyles,
  setHaptics,
  haptics,
  setDailyCounterReset,
  dailyCounterReset,
  activeBackgroundColor,
}) => {
  const [theme, setTheme] = useState(JSON.parse(localStorage.getItem("theme")));

  useEffect(() => {
    setTheme(JSON.parse(localStorage.getItem("theme")));
  }, [theme]);
  const [showNotificationsSheet, setShowNotificationsSheet] = useState(false);
  const [showAboutUsSheet, setShowAboutUsSheet] = useState(false);

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

    if (userNotificationPermission == "denied") {
      // showNotificationsAlert();
      // alert("Please turn notifications back on from within system settings");
      showNotificationsAlert();

      // NativeSettings.openIOS({
      //   option: IOSSettings.App,
      // });
      return;
    } else if (checkPermission.display == "granted") {
      setShowNotificationsSheet(true);
    } else if (
      // checkPermission.display == "denied" ||
      checkPermission.display == "prompt" ||
      checkPermission.display == "prompt-with-rationale"
    ) {
      await requestPermissionFunction();
      setShowNotificationsSheet(true);
      setMorningNotification(false);
      setAfternoonNotification(false);
      setEveningNotification(false);
      localStorage.setItem("morning-notification", JSON.stringify(false));
    }
  }

  const requestPermissionFunction = async () => {
    requestPermission = await LocalNotifications.requestPermissions();

    if (requestPermission.display == "granted") {
      handleOpenModal2();
      // setMorningNotification(true);
    } else if (requestPermission.display == "denied") {
      handleCloseModal2();
      setMorningNotification(false);
      setAfternoonNotification(false);
      setEveningNotification(false);
    } else if (requestPermission.display == "prompt") {
      setMorningNotification(false);
      setAfternoonNotification(false);
      setEveningNotification(false);
    }
  };

  const showResetAllCountersActionSheet = async () => {
    const result = await ActionSheet.showActions({
      title: "Reset All Adhkar",
      message: "Are you sure you want to reset all Adkhar to 0?",
      options: [
        {
          title: "Reset",
          style: ActionSheetButtonStyle.Destructive,
        },
        {
          title: "Cancel",
          style: ActionSheetButtonStyle.Cancel,
        },
      ],
    });

    const showAllCounterResetToast = async () => {
      await Toast.show({
        text: "All Adhkar Reset",
        position: "top",
        duration: "short",
      });
    };

    if (result.index === 0) {
      resetAllCounters();
      showAllCounterResetToast();
    } else if (result.index === 1) {
      // console.log("Res action cancelled");
    }

    // console.log("Action Sheet result:", result);
  };

  const loadingIconRef = useRef(null);

  const [formTheme, setFormTheme] = useState(false);

  let subtitle;

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

  //     handleCloseModal6();
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
  //     console.log("ERROR");
  //     console.log(e);
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

  //   handleCloseModal6();
  // }

  const shareThisAppLink = async () => {
    let link;
    if (Capacitor.getPlatform() == "ios") {
      link = "https://apps.apple.com/us/app/my-tasbeeh-app/id6449438967";
    } else if (Capacitor.getPlatform() == "android") {
      link = "https://play.google.com/store/apps/details?id=com.tasbeeh.my";
    }

    await Share.share({
      title: "",
      text: "",
      url: link,
      dialogTitle: "",
    });
  };
  const link = (url) => {
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
          activeBackgroundColor={activeBackgroundColor}
          setTheme={setTheme}
        />
      */}

      <div className="settings-page-options-and-info-wrap">
        {/* <div className="individual-section-wrap">
          <div
            className="support-box-wrap"
            onClick={() => {
              handleOpenModal5();
            }}
          >
            <div className="support-box-icon-and-text-wrap">
              <FaHandHoldingHeart
                style={{
                  fontSize: "32px",
                  color: activeBackgroundColor,
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
                  backgroundColor: activeBackgroundColor,
                }}
              ></p>

              <p
                className="tip-jar-box-text"
                style={{
                  backgroundColor: activeBackgroundColor,
                }}
              >
                MyUmmahApps Ltd provides free, open source applications for the
                Muslim community, these applications contain no ads.
              </p>

              <p
                className="tip-jar-box-text"
                style={{
                  backgroundColor: activeBackgroundColor,
                }}
              >
                {" "}
                Your support will help us continue serving the Ummah in this
                endeavor.
              </p>

              <p
                className="tip-jar-box-text"
                style={{
                  backgroundColor: activeBackgroundColor,
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
                        handleOpenModal6();
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
        {Capacitor.isNativePlatform() ? (
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
              tweenConfig={{ ease: "easeOut", duration: 0.3 }}
            >
              <Sheet.Container>
                {/* <Sheet.Header /> */}
                <Sheet.Content>
                  {" "}
                  <NotificationOptions
                    setMorningNotification={setMorningNotification}
                    morningNotification={morningNotification}
                    afternoonNotification={afternoonNotification}
                    setAfternoonNotification={setAfternoonNotification}
                    eveningNotification={eveningNotification}
                    setEveningNotification={setEveningNotification}
                    activeBackgroundColor={activeBackgroundColor}
                  />
                </Sheet.Content>
              </Sheet.Container>
              <Sheet.Backdrop
                // style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                onTap={() => setShowNotificationsSheet(false)}
              />
            </Sheet>
          </div>
        ) : null}
        <div className="individual-section-wrap">
          <div
            className="theme-wrap"
            onClick={() => {
              handleOpenModal();
              setFormTheme(true);
            }}
          >
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
                    StatusBar.setBackgroundColor({ color: "#242424" });
                    StatusBar.setStyle({ style: Style.Dark });
                  }

                  localStorage.setItem("theme", JSON.stringify("dark"));
                  document.body.classList.add("dark");
                } else if (theme == "dark") {
                  setTheme("light");
                  if (Capacitor.isNativePlatform()) {
                    StatusBar.setBackgroundColor({ color: "#EDEDED" });
                    StatusBar.setStyle({ style: Style.Light });
                  }

                  localStorage.setItem("theme", JSON.stringify("light"));
                  document.body.classList.remove("dark");
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
        <div className="individual-section-wrap">
          <div className="individual-row-wrap haptic-wrap">
            <div className="text-wrap" style={{ display: "block" }}>
              <p>Haptic Vibration</p>
              <p>Set vibration on every increment</p>
            </div>
            <Switch
              checked={haptics}
              className={undefined}
              disabled={undefined}
              handleColor="white"
              name={undefined}
              offColor="white"
              onChange={(e) => {
                if (JSON.parse(localStorage.getItem("haptics")) == true) {
                  setHaptics(false);
                  localStorage.setItem("haptics", JSON.stringify(false));
                } else if (
                  JSON.parse(localStorage.getItem("haptics")) == false
                ) {
                  setHaptics(true);
                  localStorage.setItem("haptics", JSON.stringify(true));
                }
              }}
              onColor={activeBackgroundColor}
              pendingOffColor={undefined}
              pendingOnColor={undefined}
              readOnly={undefined}
              style={undefined}
            />
            {/* <span className="mt-ios">
            <input id="1" type="checkbox" checked={haptics} />
            <label
              style={
                {
                  // boxShadow: `inset 0 0 0 1.5em ${activeBackgroundColor},0 0 0 .1875em ${activeBackgroundColor}`,
                  // boxShadow: 0 0 0 .1875em transparent,0 .375em .375em rgba(0,0,0,.3),
                }
              }
              for="1"
              onClick={(e) => {
                if (JSON.parse(localStorage.getItem("haptics")) == true) {
                  setHaptics(false);
                  localStorage.setItem("haptics", JSON.stringify(false));
                } else if (
                  JSON.parse(localStorage.getItem("haptics")) == false
                ) {
                  setHaptics(true);
                  localStorage.setItem("haptics", JSON.stringify(true));
                }
              }}
            ></label>
          </span> */}
          </div>
          <div className="individual-row-wrap">
            <div className="text-wrap" style={{ display: "block" }}>
              <p>Auto Reset Adhkar</p>
              <p>Adhkar will be reset daily</p>
            </div>
            <Switch
              checked={dailyCounterReset}
              className={undefined}
              disabled={undefined}
              handleColor="white"
              name={undefined}
              offColor="white"
              onChange={(e) => {
                if (
                  JSON.parse(localStorage.getItem("dailyCounterReset")) == true
                ) {
                  setDailyCounterReset(false);
                  localStorage.setItem(
                    "dailyCounterReset",
                    JSON.stringify(false)
                  );
                } else if (
                  JSON.parse(localStorage.getItem("dailyCounterReset")) == false
                ) {
                  setDailyCounterReset(true);
                  localStorage.setItem(
                    "dailyCounterReset",
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
            {/* <span className="mt-ios">
            <input id="2" type="checkbox" checked={dailyCounterReset} />
            <label
              for="2"
              onClick={(e) => {
                if (
                  JSON.parse(localStorage.getItem("dailyCounterReset")) == true
                ) {
                  setDailyCounterReset(false);
                  localStorage.setItem(
                    "dailyCounterReset",
                    JSON.stringify(false)
                  );
                } else if (
                  JSON.parse(localStorage.getItem("dailyCounterReset")) == false
                ) {
                  setDailyCounterReset(true);
                  localStorage.setItem(
                    "dailyCounterReset",
                    JSON.stringify(true)
                  );
                }
              }}
            ></label>
          </span> */}
          </div>
          <div className="reset-adkhar-text-wrap">
            <p
              onClick={() => {
                // handleOpenModal3();
                showResetAllCountersActionSheet();
              }}
            >
              Reset all Adhkar
            </p>

            {/* <ResetAllCountersAlert
              resetAllCounters={resetAllCounters}
              handleCloseModal3={handleCloseModal3}
            /> */}
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
              tweenConfig={{ ease: "easeOut", duration: 0.3 }}
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
