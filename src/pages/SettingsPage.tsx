import { useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Dialog } from "@capacitor/dialog";
import { motion } from "framer-motion";

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

import {
  // pageTransitionStyles,
  showConfirmDialog,
  showToast,
} from "../utils/constants";
import {
  BinaryValue,
  counterObjType,
  MaterialColor,
  PreferenceKeyType,
  themeType,
  userPreferencesType,
} from "../utils/types";
import SettingIndividual from "../components/SettingIndividual";
import BottomSheetAboutUs from "../components/BottomSheets/BottomSheetAboutUs";
import BottomSheetNotificationsOptions from "../components/BottomSheets/BottomSheetNotificationsOptions";
import BottomSheetThemeOptions from "../components/BottomSheets/BottomSheetThemeOptions";
interface SettingsageProps {
  setUserPreferencesState: React.Dispatch<
    React.SetStateAction<userPreferencesType>
  >;
  userPreferencesState: userPreferencesType;
  updateUserPreference: (
    preferenceName: PreferenceKeyType,
    preferenceValue: number | MaterialColor | themeType
  ) => Promise<void>;
  activeColor: MaterialColor;
  activeCounter: counterObjType;
  resetAllCounters: () => Promise<void>;
  theme: themeType | null;
  setShowChangelogModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingsPage = ({
  // iapProducts,
  updateUserPreference,
  setUserPreferencesState,
  userPreferencesState,
  activeColor,
  activeCounter,
  resetAllCounters,
  theme,
  setShowChangelogModal,
}: SettingsageProps) => {
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
    } else if (checkPermission.display === "granted") {
      setShowNotificationsSheet(true);
    } else if (
      checkPermission.display === "prompt" ||
      checkPermission.display === "prompt-with-rationale"
    ) {
      const requestPermission = await LocalNotifications.requestPermissions();
      if (requestPermission.display === "granted") {
        setShowNotificationsSheet(true);
      }
    }
  }

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
    <motion.main
      // {...pageTransitionStyles}
      className="settings-page-wrap"
    >
      <header className="settings-page-header">
        <p>Settings</p>
      </header>
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
                  color: activeColor,
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
                  backgroundColor: activeColor,
                }}
              ></p>

              <p
                className="tip-jar-box-text"
                style={{
                  backgroundColor: activeColor,
                }}
              >
                MyUmmahApps Ltd provides free, open source applications for the
                Muslim community, these applications contain no ads.
              </p>

              <p
                className="tip-jar-box-text"
                style={{
                  backgroundColor: activeColor,
                }}
              >
                {" "}
                Your support will help us continue serving the Ummah in this
                endeavor.
              </p>

              <p
                className="tip-jar-box-text"
                style={{
                  backgroundColor: activeColor,
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
            updateUserPreference={updateUserPreference}
            activeColor={activeColor}
            activeCounter={activeCounter}
            setShowNotificationsSheet={setShowNotificationsSheet}
            showNotificationsSheet={showNotificationsSheet}
            setUserPreferencesState={setUserPreferencesState}
            userPreferencesState={userPreferencesState}
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
            updateUserPreference={updateUserPreference}
            setShowThemeOptionsSheet={setShowThemeOptionsSheet}
            showThemeOptionsSheet={showThemeOptionsSheet}
            theme={theme}
          />
        </section>
        <section className="individual-section-wrap">
          {/* {Capacitor.isNativePlatform() && ( */}
          <div className="individual-row-wrap haptic-wrap  p-3">
            <div className="text-wrap" style={{ display: "block" }}>
              <p>Haptic Vibration</p>
              <p>Set vibration on every increment</p>
            </div>
            <Switch
              checked={userPreferencesState.haptics === 1 ? true : false}
              handleColor="white"
              name={undefined}
              offColor="white"
              onChange={async () => {
                const hapticsValue = userPreferencesState.haptics === 0 ? 1 : 0;
                await updateUserPreference("haptics", hapticsValue);
              }}
              onColor={activeColor}
            />
          </div>
          {/* // )} */}
          <section className="individual-row-wrap p-3">
            <div className="text-wrap " style={{ display: "block" }}>
              <p>Auto Reset Adhkar</p>
              <p>Adhkar will be reset daily</p>
            </div>
            <Switch
              checked={
                userPreferencesState.dailyCounterReset === 1 ? true : false
              }
              handleColor="white"
              name={undefined}
              offColor="white"
              onChange={async () => {
                const dailyCounterResetValue =
                  userPreferencesState.dailyCounterReset === 0 ? 1 : 0;
                await updateUserPreference(
                  "dailyCounterReset",
                  dailyCounterResetValue
                );
              }}
              onColor={activeColor}
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
                  await resetAllCounters();
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
        </div>
      </div>
    </motion.main>
  );
};

export default SettingsPage;
