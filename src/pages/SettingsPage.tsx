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

import { Share } from "@capacitor/share";
import { LocalNotifications } from "@capacitor/local-notifications";

import {
  counterObjType,
  DBConnectionStateType,
  languageDirection,
  MaterialColor,
  PreferenceKeyType,
  scrollSpeedValue,
  themeType,
  userPreferencesType,
} from "../utils/types";
import SettingIndividual from "../components/SettingIndividual";
// import BottomSheetAboutUs from "../components/BottomSheets/BottomSheetAboutUs";
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
    preferenceValue: number | MaterialColor | themeType,
  ) => Promise<void>;
  updateCountersState: (arr: counterObjType[]) => void;
  activeColor: MaterialColor;
  activeCounter: counterObjType;
  countersState: counterObjType[];
  setLanguageDirection: React.Dispatch<React.SetStateAction<languageDirection>>;
  closeSlidingItems: () => void;
  theme: themeType | null;
  setShowChangelogBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
  setScrollSpeed: React.Dispatch<React.SetStateAction<scrollSpeedValue>>;
  scrollSpeed: scrollSpeedValue;
}

const SettingsPage = ({
  dbConnection,
  toggleDBConnection,
  updateUserPreference,
  updateCountersState,
  userPreferencesState,
  activeColor,
  activeCounter,
  countersState,
  setLanguageDirection,
  theme,
  setShowChangelogBottomSheet,
  setScrollSpeed,
  scrollSpeed,
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
                        activeColor,
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
                      activeColor,
                    )}
                    checked={userPreferencesState.dailyCounterReset === 1}
                    onIonChange={async (e) => {
                      const dailyCounterResetValue = e.detail.checked ? 1 : 0;
                      await updateUserPreference(
                        "dailyCounterReset",
                        dailyCounterResetValue,
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
                      activeColor,
                    )}
                    checked={userPreferencesState.autoSwitchCounter === 1}
                    onIonChange={async (e) => {
                      const autoSwitchCounterValue = e.detail.checked ? 1 : 0;
                      await updateUserPreference(
                        "autoSwitchCounter",
                        autoSwitchCounterValue,
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
                  setLanguageDirection={setLanguageDirection}
                  setScrollSpeed={setScrollSpeed}
                  scrollSpeed={scrollSpeed}
                  updateUserPreference={updateUserPreference}
                  userPreferencesState={userPreferencesState}
                  // theme={theme}
                />
              </section>

              <section className="individual-section-wrap setting-bottom-border">
                {Capacitor.getPlatform() === "android" && (
                  <SettingIndividual
                    headingText={"Review"}
                    subText={"Rate the app on the Google Play Store"}
                    onClick={() => {
                      link(
                        "https://play.google.com/store/apps/details?id=com.tasbeeh.my",
                      );
                    }}
                  />
                )}
                {Capacitor.getPlatform() === "ios" && (
                  <SettingIndividual
                    headingText={"Review"}
                    subText={"Rate the app on the App Store"}
                    onClick={() => {
                      link(
                        "https://apps.apple.com/us/app/my-tasbeeh-app/id6449438967",
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
                          "https://play.google.com/store/apps/details?id=com.tasbeeh.my",
                        );
                      } else if (Capacitor.getPlatform() === "ios") {
                        shareThisAppLink(
                          "https://apps.apple.com/us/app/my-tasbeeh-app/id6449438967",
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
                  subText={"Report Bugs / Request Features"}
                  onClick={() => {
                    link(
                      "mailto: mohammed@mohammedpatel.dev?subject=My Tasbeeh App Feedback",
                    );
                  }}
                />
                {/* <SettingIndividual
                  headingText={"Website"}
                  subText={"Visit our website"}
                  onClick={() => {
                    link("");
                  }}
                /> */}
                <SettingIndividual
                  headingText={"Privacy Policy"}
                  subText={"View Privacy Policy"}
                  onClick={() => {
                    link(
                      "https://sites.google.com/view/mytasbeehprivacypolicy/home",
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
                {/* <SettingIndividual
                  id="open-about-us-modal"
                  headingText={"About"}
                  subText={"About us"}
                  indvidualStyles={"rounded-b-md border-0"}
                /> */}
                {/* <BottomSheetAboutUs triggerId="open-about-us-modal" /> */}
              </section>
            </div>
          </motion.main>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
