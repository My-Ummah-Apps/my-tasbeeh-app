import {
  MdShare,
  MdInfoOutline,
  MdOutlineStars,
  MdOutlineChevronRight,
  MdVibration,
  MdOutlineRestartAlt,
} from "react-icons/md";

const SettingsPage = () => {
  return (
    <div className="settings-page-wrap">
      <div className="individual-section-wrap">
        <div>
          <MdVibration className="icon" />
          <p>Haptics</p>
          <MdOutlineChevronRight className="chevron" />
        </div>
        <div>
          <MdOutlineRestartAlt className="icon" />
          <p>Auto Reset Count Daily</p>
          <MdOutlineChevronRight className="chevron" />
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

      <input type="checkbox" id="switch" />
      <label htmlFor="switch">Toggle</label>
    </div>
  );
};

export default SettingsPage;
