import { useState } from "react";

import {
  MdShare,
  MdInfoOutline,
  MdOutlineStars,
  MdOutlineChevronRight,
  MdVibration,
  MdOutlineRestartAlt,
  MdOutlineFeedback,
} from "react-icons/md";

import { Share } from "@capacitor/share";

import "/node_modules/moretoggles/output/moretoggles.min.css";
const SettingsPage = ({ setHaptics, haptics }) => {
  const rateThisAppLink = () => {
    window.location.href =
      "https://play.google.com/store/apps/details?id=com.tasbeeh.my";
  };
  const shareThisAppLink = async () => {
    await Share.share({
      title: "",
      text: "",
      url: "https://play.google.com/store/apps/details?id=com.tasbeeh.my",
      dialogTitle: "",
    });
  };
  const sendFeedbackLink = () => {
    window.location.href =
      "mailto: contact@myummahapps.com?subject=MyTasbeehApp Feedback";
  };

  return (
    <div className="settings-page-wrap">
      <div className="individual-section-wrap">
        <div className="individual-row-wrap">
          <div className="icon-and-text-wrap">
            {/* <MdVibration className="icon" /> */}
            <div className="text-wrap" style={{ display: "block" }}>
              <p>Haptic Vibration</p>
              <p>Set vibration on every increment</p>
            </div>
          </div>
          <span className="mt-ios">
            <input id="1" type="checkbox" checked={haptics} />
            <label
              for="1"
              onClick={(e) => {
                console.log("checkbox status is " + !e.target.control.checked);
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
          </span>
        </div>
        {/* <div className="individual-row-wrap">
          <div className="icon-and-text-wrap">
            <MdOutlineRestartAlt className="icon" />
            <p>Auto Reset Count Daily</p>
          </div>
          <span className="mt-ios">
            <input id="2" type="checkbox" />
            <label for="2"></label>
          </span>
        </div> */}
      </div>

      <div className="individual-section-wrap">
        <div className="review-wrap" onClick={rateThisAppLink}>
          {/* <MdOutlineStars className="icon" /> */}
          <div className="text-wrap" style={{ display: "block" }}>
            <p>Write a review</p>
            <p>Rate us on the Play Store</p>
          </div>
          <MdOutlineChevronRight className="chevron" />
        </div>
        <div className="share-wrap" onClick={shareThisAppLink}>
          {/* <MdShare className="icon" /> */}
          <div className="text-wrap" style={{ display: "block" }}>
            <p>Share</p>
            <p>Share application</p>
          </div>
          <MdOutlineChevronRight className="chevron" />
        </div>
        <div onClick={sendFeedbackLink}>
          {/* <MdOutlineFeedback className="icon" /> */}
          <div className="text-wrap" style={{ display: "block" }}>
            <p>Feedback</p>
            <p>Send us your feedback</p>
          </div>
          <MdOutlineChevronRight className="chevron" />
        </div>
        {/* <div>
          <MdInfoOutline className="icon" />
          <p>Info</p>
          <MdOutlineChevronRight className="chevron" />
        </div> */}
      </div>
    </div>
  );
};

export default SettingsPage;
