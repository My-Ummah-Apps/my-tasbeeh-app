import { Capacitor } from "@capacitor/core";
import { Dialog } from "@capacitor/dialog";
import { motion } from "framer-motion";

import {
  NativeSettings,
  AndroidSettings,
  IOSSettings,
} from "capacitor-native-settings";

import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";

// import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

// import { Purchases } from "@awesome-cordova-plugins/purchases";
// import { PURCHASE_TYPE } from "cordova-plugin-purchases";
import { Share } from "@capacitor/share";
import { LocalNotifications } from "@capacitor/local-notifications";

import {
  counterObjType,
  DBConnectionStateType,
  MaterialColor,
  PreferenceKeyType,
  themeType,
  userPreferencesType,
} from "../utils/types";
import SettingIndividual from "../components/SettingIndividual";
import BottomSheetAboutUs from "../components/BottomSheets/BottomSheetAboutUs";
import BottomSheetNotificationsOptions from "../components/BottomSheets/BottomSheetNotificationsOptions";
import BottomSheetThemeOptions from "../components/BottomSheets/BottomSheetThemeOptions";

import { IonToggle } from "@ionic/react";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import BottomSheetReorderCounters from "../components/BottomSheets/BottomSheetReorderCounters";
import { useState } from "react";
import { toggleStyles } from "../utils/helpers";
import BottomSheetCounterScrollSpeed from "../components/BottomSheets/BottomSheetCounterScrollSpeed";

interface SettingsageProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  toggleDBConnection: (action: DBConnectionStateType) => Promise<void>;
  userPreferencesState: userPreferencesType;
  updateUserPreference: (
    preferenceName: PreferenceKeyType,
    preferenceValue: number | MaterialColor | themeType
  ) => Promise<void>;
  updateCountersState: (arr: counterObjType[]) => void;
  activeColor: MaterialColor;
  activeCounter: counterObjType;
  countersState: counterObjType[];
  closeSlidingItems: () => void;
  theme: themeType | null;
  setShowChangelogBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingsPage = ({
  dbConnection,
  toggleDBConnection,
  // iapProducts,
  updateUserPreference,
  updateCountersState,
  userPreferencesState,
  activeColor,
  activeCounter,
  countersState,
  theme,
  setShowChangelogBottomSheet,
}: SettingsageProps) => {
  const [showNotificationsSheet, setShowNotificationsSheet] = useState(false);

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
      } else if (requestPermission.display === "denied") {
        setShowNotificationsSheet(false);
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
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="header-toolbar">
          <IonTitle className="">Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <section className="settings-page-wrap">
          <motion.main
            // {...pageTransitionStyles}
            className="settings-page-content-wrap"
          >
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
              {Capacitor.isNativePlatform() && (
                <section className="individual-section-wrap">
                  <SettingIndividual
                    // indvidualStyles={"rounded-t-md"}
                    id="open-notifications-sheet"
                    headingText={"Notifications"}
                    subText={"Set Notifications"}
                    onClick={() => {
                      checkNotificationPermissions();
                    }}
                  />
                  <BottomSheetNotificationsOptions
                    // triggerId="open-notifications-sheet"
                    setShowNotificationsSheet={setShowNotificationsSheet}
                    showNotificationsSheet={showNotificationsSheet}
                    updateUserPreference={updateUserPreference}
                    activeColor={activeColor}
                    activeCounter={activeCounter}
                    userPreferencesState={userPreferencesState}
                  />
                </section>
              )}
              <section className="individual-section-wrap theme-setting-wrap">
                <SettingIndividual
                  id="open-theme-options-sheet"
                  headingText={"Theme"}
                  subText={"Select Theme"}
                />
                <BottomSheetThemeOptions
                  triggerId="open-theme-options-sheet"
                  updateUserPreference={updateUserPreference}
                  theme={theme}
                />
              </section>
              {Capacitor.isNativePlatform() && (
                <section className="individual-section-wrap">
                  <div className="p-3 individual-row-wrap">
                    <div className="text-wrap" style={{ display: "block" }}>
                      <p className="pt-[0.3rem] pb-[0.1rem]">
                        Haptic Vibration
                      </p>
                      <p className="pt-[0.3rem]  pb-[0.1rem] text-[0.8rem] font-light">
                        Set vibration on every increment
                      </p>
                    </div>
                    <IonToggle
                      color={isPlatform("ios") ? activeColor : ""}
                      style={toggleStyles(
                        userPreferencesState,
                        "haptics",
                        activeColor
                      )}
                      checked={userPreferencesState.haptics === 1}
                      onIonChange={async (e) => {
                        const hapticsValue = e.detail.checked ? 1 : 0;
                        await updateUserPreference("haptics", hapticsValue);
                      }}
                    ></IonToggle>
                  </div>
                </section>
              )}

              <section className="individual-section-wrap">
                <section className="p-3 individual-row-wrap">
                  <div className="text-wrap " style={{ display: "block" }}>
                    <p className="pt-[0.3rem] pb-[0.1rem]">
                      Daily Tasbeeh Reset
                    </p>
                    <p className="pt-[0.3rem] pb-[0.1rem] text-[0.8rem] font-light">
                      All tasbeehs will be reset daily
                    </p>
                  </div>
                  <IonToggle
                    color={isPlatform("ios") ? activeColor : ""}
                    style={toggleStyles(
                      userPreferencesState,
                      "dailyCounterReset",
                      activeColor
                    )}
                    checked={userPreferencesState.dailyCounterReset === 1}
                    onIonChange={async (e) => {
                      const dailyCounterResetValue = e.detail.checked ? 1 : 0;
                      await updateUserPreference(
                        "dailyCounterReset",
                        dailyCounterResetValue
                      );
                    }}
                  ></IonToggle>
                </section>
              </section>
              <section className="individual-section-wrap">
                <section className="p-3 individual-row-wrap border-b border-[var(--settings-page-borders)]">
                  <div className="text-wrap " style={{ display: "block" }}>
                    <p className="pt-[0.3rem] pb-[0.1rem]">
                      Auto-Switch Tasbeeh
                    </p>
                    <p className="pt-[0.3rem] pb-[0.1rem] text-[0.8rem] font-light">
                      Automatically switch to the next tasbeeh once the current
                      tasbeeh reaches its target
                    </p>
                  </div>
                  <IonToggle
                    data-testid="auto-counter-switch-toggle"
                    color={isPlatform("ios") ? activeColor : ""}
                    style={toggleStyles(
                      userPreferencesState,
                      "autoSwitchCounter",
                      activeColor
                    )}
                    checked={userPreferencesState.autoSwitchCounter === 1}
                    onIonChange={async (e) => {
                      const autoSwitchCounterValue = e.detail.checked ? 1 : 0;
                      await updateUserPreference(
                        "autoSwitchCounter",
                        autoSwitchCounterValue
                      );
                    }}
                  ></IonToggle>
                </section>
                <SettingIndividual
                  id="open-reorder-counters-modal"
                  headingText={"Re-order tasbeehs"}
                  subText={"Customise the sequence of your tasbeeh list"}
                />
              </section>
              <BottomSheetReorderCounters
                // modalRef={modalRef}
                triggerId="open-reorder-counters-modal"
                toggleDBConnection={toggleDBConnection}
                dbConnection={dbConnection}
                countersState={countersState}
                updateCountersState={updateCountersState}
              />

              <section className="individual-section-wrap theme-setting-wrap">
                <SettingIndividual
                  id="open-counter-scroll-speed-sheet"
                  headingText={"Scrolling speed"}
                  subText={
                    "Adjust how fast long tasbeeh names move across the screen"
                  }
                />
                <BottomSheetCounterScrollSpeed
                  triggerId="open-counter-scroll-speed-sheet"
                  // updateUserPreference={updateUserPreference}
                  // theme={theme}
                />
              </section>

              <section className="individual-section-wrap setting-bottom-border">
                {Capacitor.getPlatform() === "android" && (
                  <SettingIndividual
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
                  id="open-changelog-modal"
                  headingText={"Changelog"}
                  subText={"View Changelog"}
                  onClick={() => {
                    setShowChangelogBottomSheet(true);
                  }}
                />
                <SettingIndividual
                  headingText={"Feedback"}
                  subText={"Send us your feedback"}
                  onClick={() => {
                    link(
                      "mailto: contact@myummahapps.com?subject=My Tasbeeh App Feedback"
                    );
                  }}
                />
                <SettingIndividual
                  headingText={"Website"}
                  subText={"Visit our website"}
                  onClick={() => {
                    link("https://myummahapps.com/");
                  }}
                />
                <SettingIndividual
                  headingText={"Privacy Policy"}
                  subText={"View Privacy Policy"}
                  onClick={() => {
                    link(
                      "https://sites.google.com/view/mytasbeehprivacypolicy/home"
                    );
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
                  id="open-about-us-modal"
                  headingText={"About"}
                  subText={"About us"}
                  indvidualStyles={"rounded-b-md border-0"}
                />
                <BottomSheetAboutUs triggerId="open-about-us-modal" />
              </section>
            </div>
          </motion.main>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
