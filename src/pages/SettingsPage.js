import Header from "../components/Header";

const SettingsPage = () => {
  const changeThemeWhite = () => {
    document.body.style = "background: #fff;";
    // document.querySelector(".dhikr-type-wrap").style = "color:black;";
  };

  const changeThemeBlack = () => {
    document.body.style = "background: #000;";
  };

  return (
    <div className="settings-page-wrap">
      {/* <Header text={"Settings"} /> */}
      <div className="theme-selection-wrap">
        <h1>Theme</h1>
        <div className="theme-blocks-container">
          <div className="white-theme-block" onClick={changeThemeWhite}></div>
          <div className="black-theme-block" onClick={changeThemeBlack}></div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
