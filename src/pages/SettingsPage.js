import {
  MdShare,
  MdInfoOutline,
  MdOutlineStars,
  MdOutlineChevronRight,
  MdVibration,
  MdOutlineRestartAlt,
} from "react-icons/md";

import "/node_modules/moretoggles/output/moretoggles.min.css";

const SettingsPage = () => {
  return (
    <div className="settings-page-wrap">
      <div className="individual-section-wrap">
        <div className="individual-row-wrap">
          <div className="icon-and-text-wrap">
            <MdVibration className="icon" />
            <p>Haptics</p>
          </div>
          <span className="mt-ios">
            <input id="1" type="checkbox" />
            <label for="1"></label>
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
