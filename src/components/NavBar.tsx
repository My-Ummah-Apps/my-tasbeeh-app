import { NavLink } from "react-router-dom";
import { BsFillHouseDoorFill, BsList, BsFillNutFill } from "react-icons/bs";

const NavBar = ({ activeCounterColor, setActivePage, activePage }) => {
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
          color={activePage == "settings" ? activeCounterColor : "grey"}
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
            color={activePage == "home" ? activeCounterColor : "grey"}
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
          color={activePage == "counters" ? activeCounterColor : "grey"}
        />
      </NavLink>
    </div>
  );
};

export default NavBar;
