import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { IconContext } from "react-icons";
import { FaHome } from "react-icons/fa";
import { GrHomeRounded } from "react-icons/gr";
import { BsFillHouseDoorFill, BsList, BsFillNutFill } from "react-icons/bs";

import { MdSettings, MdHome, MdMenu } from "react-icons/md";

const NavBar = ({ activeBackgroundColor, setActivePage, activePage }) => {
  return (
    <div className="navbar-wrap">
      <NavLink
        onClick={() => {
          setActivePage("settings");
        }}
        className="nav-link"
        to="/SettingsPage"
      >
        <BsFillNutFill
          className="nav-icon"
          color={activePage == "settings" ? activeBackgroundColor : "grey"}
        />
      </NavLink>

      <NavLink
        onClick={() => {
          setActivePage("home");
        }}
        className="nav-link"
        to="/"
      >
        <div>
          <BsFillHouseDoorFill
            className="nav-icon"
            color={activePage == "home" ? activeBackgroundColor : "grey"}
          />
        </div>
      </NavLink>

      <NavLink
        onClick={() => {
          setActivePage("counters");
        }}
        className="nav-link"
        to="/CountersPage"
      >
        <BsList
          className="nav-icon"
          color={activePage == "counters" ? activeBackgroundColor : "grey"}
        />
      </NavLink>
    </div>
  );
};

export default NavBar;
