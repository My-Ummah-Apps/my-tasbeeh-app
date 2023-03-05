import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";

import { MdSettings, MdHome, MdMenu } from "react-icons/md";

const NavBar = () => {
  return (
    <div className="navbar-wrap">
      <NavLink className="nav-link" to="/SettingsPage">
        <MdSettings className="nav-icon" />
        <p>Settings</p>
      </NavLink>

      <NavLink className="nav-link" to="/">
        <MdHome className="nav-icon" />
        <p>Home</p>
      </NavLink>

      <NavLink className="nav-link" to="/CountersPage">
        <MdMenu className="nav-icon" />
        <p>Counters</p>
      </NavLink>
    </div>
  );
};

export default NavBar;
