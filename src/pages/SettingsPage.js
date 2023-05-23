import {
  MdShare,
  MdInfoOutline,
  MdOutlineStars,
  MdOutlineChevronRight,
} from "react-icons/md";

const SettingsPage = () => {
  return (
    <div className="settings-page-wrap">
      <div className="individual-section-wrap">
        <div>
          <MdOutlineStars className="icon" />
          <p>Haptics</p>
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
    </div>
  );
};

export default SettingsPage;
