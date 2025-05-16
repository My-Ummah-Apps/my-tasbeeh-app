import { useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Dialog } from "@capacitor/dialog";
import {
  NativeSettings,
  AndroidSettings,
  IOSSettings,
} from "capacitor-native-settings";
// @ts-ignore
import Switch from "react-ios-switch";
// import { Purchases } from "@awesome-cordova-plugins/purchases";
// import { PURCHASE_TYPE } from "cordova-plugin-purchases";
import { Share } from "@capacitor/share";
import { LocalNotifications } from "@capacitor/local-notifications";

import { showConfirmDialog, showToast } from "../utils/constants";
import { counterObjType, themeType } from "../utils/types";
import SettingIndividual from "../components/SettingIndividual";
import BottomSheetAboutUs from "../components/BottomSheets/AboutUsBottomSheet";
import BottomSheetNotificationsOptions from "../components/BottomSheets/BottomSheetNotificationsOptions";
import BottomSheetThemeOptions from "../components/BottomSheets/BottomSheetThemeOptions";
interface SettingsageProps {
  activeCounter: counterObjType;
  setHaptics: React.Dispatch<React.SetStateAction<boolean | null>>;
  haptics: boolean | null;
  resetAllCounters: () => void;
  setDailyCounterReset: React.Dispatch<React.SetStateAction<boolean>>;
  dailyCounterReset: boolean;
  setTheme: React.Dispatch<React.SetStateAction<themeType | null>>;
  theme: themeType | null;
  setShowChangelogModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingsPage = ({
  // iapProducts,
  activeCounter,
  setHaptics,
  haptics,
  resetAllCounters,
  setDailyCounterReset,
  dailyCounterReset,
  setTheme,
  theme,
  setShowChangelogModal,
}: SettingsageProps) => {
  const [morningNotification, setMorningNotification] = useState(false);
  const [afternoonNotification, setAfternoonNotification] = useState(false);
  const [eveningNotification, setEveningNotification] = useState(false);
  const [showNotificationsSheet, setShowNotificationsSheet] = useState(false);
  const [showAboutUsSheet, setShowAboutUsSheet] = useState(false);
  const [showThemeOptionsSheet, setShowThemeOptionsSheet] = useState(false);

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
    const checkPermission = await LocalNotifications.checkPermissions();
    const userNotificationPermission = checkPermission.display;

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
    const requestPermission = await LocalNotifications.requestPermissions();

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

  const shareThisAppLink = async (link: string) => {
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
        <section className="individual-section-wrap">
          <SettingIndividual
            // indvidualStyles={"rounded-t-md"}
            headingText={"Notifications"}
            subText={"Set Notifications"}
            onClick={() => {
              checkNotificationPermissions();
            }}
          />
          <BottomSheetNotificationsOptions
            activeCounter={activeCounter}
            setShowNotificationsSheet={setShowNotificationsSheet}
            showNotificationsSheet={showNotificationsSheet}
            setMorningNotification={setMorningNotification}
            morningNotification={morningNotification}
            setAfternoonNotification={setAfternoonNotification}
            afternoonNotification={afternoonNotification}
            setEveningNotification={setEveningNotification}
            eveningNotification={eveningNotification}
          />
        </section>
        {/* // ) : null} */}
        <section className="individual-section-wrap">
          <SettingIndividual
            // indvidualStyles={"rounded-t-md"}
            headingText={"Theme"}
            subText={"Select Theme"}
            onClick={() => {
              setShowThemeOptionsSheet(true);
            }}
          />
          <BottomSheetThemeOptions
            setShowThemeOptionsSheet={setShowThemeOptionsSheet}
            showThemeOptionsSheet={showThemeOptionsSheet}
            setTheme={setTheme}
            theme={theme}
          />
        </section>
        <section className="individual-section-wrap">
          {Capacitor.isNativePlatform() && (
            <div className="individual-row-wrap haptic-wrap  p-3">
              <div className="text-wrap" style={{ display: "block" }}>
                <p>Haptic Vibration</p>
                <p>Set vibration on every increment</p>
              </div>
              <Switch
                checked={haptics}
                handleColor="white"
                name={undefined}
                offColor="white"
                onChange={() => {
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
          <section className="individual-row-wrap p-3">
            <div className="text-wrap " style={{ display: "block" }}>
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
          </section>
          <div className="reset-adkhar-text-wrap pl-1">
            <p
              onClick={async () => {
                const result = await showConfirmDialog(
                  "Reset All Adhkar",
                  "Are you sure you want to reset all Adkhar to 0?"
                );
                if (result) {
                  resetAllCounters();
                  showToast("All Adhkar reset to 0", "bottom", "short");
                }
              }}
            >
              Reset all Adhkar
            </p>
          </div>
        </section>
        <div className="individual-section-wrap">
          {Capacitor.getPlatform() === "android" && (
            <SettingIndividual
              // indvidualStyles={"rounded-t-md"}
              headingText={"Review"}
              subText={"Rate us on the Google Play Store"}
              onClick={() => {
                link(
                  "https://play.google.com/store/apps/details?id=com.tasbeeh.my"
                );
              }}
            />
          )}
          {Capacitor.getPlatform() === "ios" && (
            <SettingIndividual
              // indvidualStyles={"rounded-t-md"}
              headingText={"Review"}
              subText={"Rate us on the App Store"}
              onClick={() => {
                link(
                  "https://apps.apple.com/us/app/my-tasbeeh-app/id6449438967"
                );
              }}
            />
          )}
          {Capacitor.isNativePlatform() && (
            <SettingIndividual
              // indvidualStyles={"rounded-t-md"}
              headingText={"Share"}
              subText={"Share application"}
              onClick={() => {
                if (Capacitor.getPlatform() === "android") {
                  shareThisAppLink(
                    "https://play.google.com/store/apps/details?id=com.tasbeeh.my"
                  );
                } else if (Capacitor.getPlatform() === "ios") {
                  shareThisAppLink(
                    "https://apps.apple.com/us/app/my-tasbeeh-app/id6449438967"
                  );
                }
              }}
            />
          )}
          <SettingIndividual
            headingText={"Changelog"}
            subText={"View Changelog"}
            onClick={() => {
              setShowChangelogModal(true);
            }}
          />
          <SettingIndividual
            headingText={"Feedback"}
            subText={"Send us your feedback"}
            // indvidualStyles={"rounded-b-md"}
            onClick={() => {
              link(
                "mailto: contact@myummahapps.com?subject=My Tasbeeh App Feedback"
              );
            }}
          />
          <SettingIndividual
            headingText={"Website"}
            subText={"Visit our website"}
            // indvidualStyles={"rounded-b-md"}
            onClick={() => {
              link("https://myummahapps.com/");
            }}
          />
          <SettingIndividual
            headingText={"Privacy Policy"}
            subText={"View Privacy Policy"}
            onClick={() => {
              link("https://sites.google.com/view/mytasbeehprivacypolicy/home");
            }}
          />
          <SettingIndividual
            headingText={"Source Code"}
            subText={"View Source Code"}
            onClick={() => {
              link("https://github.com/My-Ummah-Apps/my-tasbeeh-app");
            }}
          />
          <SettingIndividual
            headingText={"About"}
            subText={"About us"}
            // indvidualStyles={"rounded-b-md"}
            onClick={() => setShowAboutUsSheet(true)}
          />
          <BottomSheetAboutUs
            setShowAboutUsSheet={setShowAboutUsSheet}
            showAboutUsSheet={showAboutUsSheet}
          />
          {/* <div onClick={() => setShowAboutUsSheet(true)}>
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
              tweenConfig={tween_config}
            >
              <Sheet.Container>
                <Sheet.Header />
                <Sheet.Content>
                  <AboutUs />
                </Sheet.Content>
              </Sheet.Container>
              <Sheet.Backdrop
                // style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                onTap={() => setShowAboutUsSheet(false)}
              />
            </Sheet>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
