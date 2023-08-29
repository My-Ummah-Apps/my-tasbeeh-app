import { useEffect, useState, useRef } from "react";
import React from "react";
import Modal from "react-modal";
import { MdOutlineChevronRight } from "react-icons/md";
import { FaHandHoldingHeart } from "react-icons/fa";
// import { FaJar } from "react-icons/fa6";
// import { GiMasonJar } from "react-icons/gi";
import Switch from "react-ios-switch";
import NotificationOptions from "../components/NotificationOptions";
import ResetAllCountersAlert from "../components/ResetAllCountersAlert";
import AboutUs from "../components/AboutUs";

import { Purchases } from "@awesome-cordova-plugins/purchases";

import { Share } from "@capacitor/share";

// import {LocalNotifications, LocalNotificationEnabledResult, LocalNotificationActionPerformed, LocalNotification, Device, ScheduleOptions} from "@capacitor/core";

// const {LocalNotifications} = Plugins;

// import "/node_modules/moretoggles/output/moretoggles.min.css";
// import ThemeOptions from "../components/ThemeOptions";

// import { act } from "react-dom/test-utils";

// Override default Modal styles
Modal.defaultStyles.content.border = "none";
Modal.defaultStyles.content.position = "absolute";
Modal.defaultStyles.content.inset = "50% 0% 0% 50%";
Modal.defaultStyles.content.transform = "translate(-50%, -50%)";
// Modal.defaultStyles.content.background = "#f4f4f4";
Modal.defaultStyles.content.overflow = "none";
Modal.defaultStyles.content.borderRadius = "2rem";
Modal.defaultStyles.content.padding = "0";
Modal.defaultStyles.content.height = "fit-content";
Modal.defaultStyles.content.zIndex = "10000";
Modal.defaultStyles.content.width = "90%";

const SettingsPage = ({
  // fetchedProducts,
  setIapProducts,
  iapProducts,
  resetAllCounters,
  changeThreeHourlyNotificationState,
  setThreeHourlyNotifications,
  morningNotification,
  setMorningNotification,
  afternoonNotification,
  setAfternoonNotification,
  eveningNotification,
  setEveningNotification,
  threeHourlyNotifications,
  modalStyles,
  modalBgColor,
  device,
  setHaptics,
  haptics,
  setDailyCounterReset,
  dailyCounterReset,
  activeBackgroundColor,
  theme,
  setTheme,
}) => {
  console.log("fetchedProducts ON SETTINGS PAGE:");
  console.log(iapProducts);

  // const [iapProducts, setIapProducts] = useState(null);

  const loadingIconRef = useRef(null);

  const [formTheme, setFormTheme] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);

  let subtitle;

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal4, setShowModal4] = useState(false);
  const [showModal5, setShowModal5] = useState(false);
  const [showModal6, setShowModal6] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleOpenModal2 = () => {
    setShowModal2(true);
  };

  const handleOpenModal3 = () => {
    setShowModal3(true);
  };

  const handleOpenModal4 = () => {
    setShowModal4(true);
  };

  const handleOpenModal5 = () => {
    setShowModal5(true);
  };

  const handleOpenModal6 = () => {
    setShowModal6(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseModal2 = () => {
    setShowModal2(false);
  };

  const handleCloseModal3 = () => {
    setShowModal3(false);
  };

  const handleCloseModal4 = () => {
    setShowModal4(false);
  };

  const handleCloseModal5 = () => {
    setShowModal5(false);
  };

  const handleCloseModal6 = () => {
    setShowModal6(false);
  };

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  async function triggerPurchase(tipAmount) {
    // console.log("PURCHASE CLICKED...");

    try {
      const { customerInfo, productIdentifier } =
        await Purchases.purchaseProduct(tipAmount);
      // console.log("PURCHASE SUCCESSFULL");
      // console.log(customerInfo);
      // console.log(productIdentifier);

      handleCloseModal6();
    } catch (e) {
      // if (!e.userCancelled) {
      // console.log("ERROR HAS OCCURRED");
      // console.log(e);
      // console.log(e.userCancelled);

      handleCloseModal6();
      // }
    }
  }

  const shareThisAppLink = async () => {
    let link;
    if (device == "ios") {
      link = "https://apps.apple.com/us/app/my-tasbeeh-app/id6449438967";
    } else if (device == "android") {
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
  Modal.setAppElement("#root");

  return (
    <div className="settings-page-wrap">
      <div className="settings-page-header">
        <p>Settings</p>
      </div>

      {/* <Modal
        style={modalStyles}
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        closeTimeoutMS={250}
        contentLabel="Modal #2 Global Style Override Example"
      >
        <ThemeOptions
          formTheme={formTheme}
          theme={theme}
          activeBackgroundColor={activeBackgroundColor}
          setTheme={setTheme}
        />
      
      </Modal> */}

      <div className="settings-page-options-and-info-wrap">
        <div className="individual-section-wrap">
          <div
            className="support-box-wrap"
            onClick={() => {
              handleOpenModal5();
            }}
          >
            <div className="support-box-icon-and-text-wrap">
              {/* <FaJar */}
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
          <Modal
            style={modalStyles}
            isOpen={showModal5}
            onRequestClose={handleCloseModal5}
            closeTimeoutMS={250}
            contentLabel="Modal #2 Global Style Override Example"
          >
            <div className="tip-box-wrap">
              {/* <div> */}
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

              {/* </div> */}
              {/* {fetchedProducts &&
                fetchedProducts.map((item) => { */}
              {iapProducts &&
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
                })}
              <Modal
                style={modalStyles}
                isOpen={showModal6}
                // onRequestClose={handleCloseModal5}
                closeTimeoutMS={250}
                contentLabel="Modal #2 Global Style Override Example"
              >
                {" "}
                <div class="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </Modal>
            </div>
          </Modal>
        </div>
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
              // checked={darkTheme}
              className={undefined}
              disabled={undefined}
              handleColor="white"
              name={undefined}
              offColor="white"
              onChange={(e) => {
                if (theme == "light") {
                  setTheme("dark");
                  setDarkTheme(true);
                  localStorage.setItem("theme", JSON.stringify("dark"));
                } else if (theme == "dark") {
                  setTheme("light");
                  setDarkTheme(false);
                  localStorage.setItem("theme", JSON.stringify("light"));
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
        <div className="individual-section-wrap" style={{ display: "none" }}>
          <div
            className="notifications-wrap"
            onClick={() => {
              handleOpenModal2();
            }}
          >
            <div className="text-wrap" style={{ display: "block" }}>
              <p>Notifications</p>
              <p>Set Notifications</p>
            </div>
            <MdOutlineChevronRight className="chevron" />
          </div>
          <Modal
            style={modalStyles}
            isOpen={showModal2}
            onRequestClose={handleCloseModal2}
            closeTimeoutMS={250}
            contentLabel="Modal #2 Global Style Override Example"
          >
            <NotificationOptions
              changeThreeHourlyNotificationState={
                changeThreeHourlyNotificationState
              }
              setThreeHourlyNotifications={setThreeHourlyNotifications}
              threeHourlyNotifications={threeHourlyNotifications}
              setMorningNotification={setMorningNotification}
              morningNotification={morningNotification}
              afternoonNotification={afternoonNotification}
              setAfternoonNotification={setAfternoonNotification}
              eveningNotification={eveningNotification}
              setEveningNotification={setEveningNotification}
              activeBackgroundColor={activeBackgroundColor}
            />
          </Modal>
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
                handleOpenModal3();
              }}
            >
              Clear all Adhkar
            </p>
            <Modal
              style={modalStyles}
              isOpen={showModal3}
              onRequestClose={handleCloseModal3}
              closeTimeoutMS={250}
              contentLabel="Modal #2 Global Style Override Example"
            >
              <ResetAllCountersAlert
                resetAllCounters={resetAllCounters}
                handleCloseModal3={handleCloseModal3}
              />
            </Modal>
          </div>
        </div>

        <div className="individual-section-wrap">
          {device == "android" ? (
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
          {device == "ios" ? (
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
          <div className="share-wrap" onClick={shareThisAppLink}>
            <div className="text-wrap" style={{ display: "block" }}>
              <p>Share</p>
              <p>Share application</p>
            </div>
            <MdOutlineChevronRight className="chevron" />
          </div>
          <div
            className="feedback-wrap"
            onClick={() => {
              link(
                "mailto: contact@myummahapps.com?subject=MyTasbeehApp Feedback"
              );
            }}
          >
            <div className="text-wrap" style={{ display: "block" }}>
              <p>Feedback</p>
              <p>Send us your feedback</p>
            </div>
            <MdOutlineChevronRight className="chevron" />
          </div>
          {/* <div
          className="source-code-wrap"
          onClick={() => {
            link("https://github.com/My-Ummah-Apps/my-tasbeeh-app");
          }}
        >
          <MdOutlineFeedback className="icon" />
          <div className="text-wrap" style={{ display: "block" }}>
            <p>Source Code</p>
            <p>View source code on Github</p>
          </div>
          <MdOutlineChevronRight className="chevron" />
        </div> */}
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
          {/* <div
          onClick={() => {
            link("https://sites.google.com/view/mytasbeehprivacypolicy/home");
          }}
        >
          <MdOutlineFeedback className="icon" />
          <div className="text-wrap" style={{ display: "block" }}>
            <p>Privacy Policy</p>
            <p>View our privacy policy</p>
          </div>
          <MdOutlineChevronRight className="chevron" />
        </div> */}
          <div
            onClick={() => {
              handleOpenModal4();
            }}
          >
            {/* <div className="icon" /> */}
            <div className="text-wrap" style={{ display: "block" }}>
              <p>About</p>
              <p>About us</p>
            </div>
            <MdOutlineChevronRight className="chevron" />
          </div>
          <Modal
            style={modalStyles}
            isOpen={showModal4}
            onRequestClose={handleCloseModal4}
            closeTimeoutMS={250}
            contentLabel="Modal #2 Global Style Override Example"
          >
            <AboutUs />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
