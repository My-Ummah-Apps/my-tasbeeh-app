const SettingsPage = () => {
  const changeThemeWhite = () => {
    document.body.style = "background: #fff;";
  };

  const changeThemeBlack = () => {
    document.body.style = "background: #000;";
  };

  return (
    <div className="settings-page-wrap">
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
