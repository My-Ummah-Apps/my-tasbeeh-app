import { useState } from "react";

import {
  MdShare,
  MdInfoOutline,
  MdOutlineStars,
  MdOutlineChevronRight,
  MdVibration,
  MdOutlineRestartAlt,
} from "react-icons/md";

import "/node_modules/moretoggles/output/moretoggles.min.css";
const SettingsPage = ({ setHaptics, haptics }) => {
  console.log("haptics on settings page: " + haptics);
  console.log(typeof haptics);

  // let isChecked;
  // if (haptics == "true" || haptics == true) {
  //   isChecked = true;
  // } else if (haptics == "false" || haptics == false) {
  //   isChecked = false;
  // }
  // console.log("isChecked: " + isChecked);

  return (
    <div className="settings-page-wrap">
      <div className="individual-section-wrap">
        <div className="individual-row-wrap">
          <div className="icon-and-text-wrap">
            <MdVibration className="icon" />
            <p>Haptics</p>
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
        <div className="individual-row-wrap">
          <div className="icon-and-text-wrap">
            <MdOutlineRestartAlt className="icon" />
            <p>Auto Reset Count Daily</p>
          </div>
          <span className="mt-ios">
            <input id="2" type="checkbox" />
            <label for="2"></label>
          </span>
        </div>
      </div>

      <div className="individual-section-wrap">
        <div>
          <MdOutlineStars className="icon" />
          <p>Rate This App</p>
          <MdOutlineChevronRight className="chevron" />
        </div>
        <div>
          <MdShare className="icon" />
          <p>Share This App</p>
          <MdOutlineChevronRight className="chevron" />
        </div>
        <div>
          <MdInfoOutline className="icon" />
          <p>Info</p>
          <MdOutlineChevronRight className="chevron" />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
