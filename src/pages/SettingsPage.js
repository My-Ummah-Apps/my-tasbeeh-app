import { MdOutlineChevronRight } from "react-icons/md";

import { Share } from "@capacitor/share";

import "/node_modules/moretoggles/output/moretoggles.min.css";
const SettingsPage = ({
  setHaptics,
  haptics,
  setDailyCounterReset,
  dailyCounterReset,
}) => {
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
  console.log("dailyReset Counter is: " + dailyCounterReset);
  return (
    <div className="settings-page-wrap">
      <div className="individual-section-wrap" style={{ marginTop: "5rem" }}>
        <div className="individual-row-wrap">
          <div className="text-wrap" style={{ display: "block" }}>
            <p>Haptic Vibration</p>
            <p>Set vibration on every increment</p>
          </div>
          <span className="mt-ios">
            <input id="1" type="checkbox" checked={haptics} />
            <label
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
          </span>
        </div>
      </div>

      <div className="individual-section-wrap">
        <div className="individual-row-wrap">
          <div className="text-wrap" style={{ display: "block" }}>
            <p>Auto Reset Count</p>
            <p>Counter will be reset daily</p>
          </div>
          <span className="mt-ios">
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
          </span>
        </div>
      </div>

      <div className="individual-section-wrap">
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
  );
};

export default SettingsPage;
