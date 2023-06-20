import { useState } from "react";
import React from "react";
import Modal from "react-modal";
import { MdOutlineChevronRight } from "react-icons/md";
import Switch from "react-ios-switch";

import { Share } from "@capacitor/share";
// import "/node_modules/moretoggles/output/moretoggles.min.css";
import PopUpBox from "../components/PopUpBox";
import { act } from "react-dom/test-utils";

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
Modal.defaultStyles.content.width = "85%";
// Modal.defaultStyles.content.background = "blue";

const SettingsPage = ({
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
  const [formTheme, setFormTheme] = useState(false);

  let subtitle;
  const [showModal, setShowModal] = useState(false);

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const shareThisAppLink = async () => {
    await Share.share({
      title: "",
      text: "",
      url: "https://play.google.com/store/apps/details?id=com.tasbeeh.my",
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

      <Modal
        style={modalStyles}
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        closeTimeoutMS={1000}
        contentLabel="Modal #2 Global Style Override Example"
      >
        <PopUpBox
          formTheme={formTheme}
          theme={theme}
          activeBackgroundColor={activeBackgroundColor}
          setTheme={setTheme}
        />
      </Modal>

      <div className="settings-page-options-and-info-wrap">
        <div className="individual-section-wrap">
          <div
            className="theme-wrap"
            onClick={() => {
              handleOpenModal();
              setFormTheme(true);
            }}
          >
            <div className="text-wrap" style={{ display: "block" }}>
              <p>Theme</p>
              <p>
                Current Theme: {theme}
                {/* Current Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)} */}
              </p>
            </div>
            <MdOutlineChevronRight className="chevron" />
          </div>
        </div>
        <div className="individual-section-wrap" style={{ marginTop: "3rem" }}>
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
              <p>Auto Reset Count</p>
              <p>Counters will be reset daily</p>
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
          {/* <div>
          <MdInfoOutline className="icon" />
          <p>Info</p>
          <MdOutlineChevronRight className="chevron" />
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
