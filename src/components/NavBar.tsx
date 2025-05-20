import { NavLink } from "react-router-dom";
import { BsFillHouseDoorFill, BsList, BsFillNutFill } from "react-icons/bs";
import { MaterialColor } from "../utils/types";

interface NavBarProps {
  activeColor: MaterialColor;
}

const NavBar = ({ activeColor }: NavBarProps) => {
  return (
    <div className="navbar-wrap">
      <NavLink className="nav-link" to="/SettingsPage">
        {({ isActive }) => (
          <BsFillNutFill
            className="nav-icon"
            color={isActive ? activeColor : "grey"}
          />
        )}
      </NavLink>
      <NavLink className="nav-link" to="/">
        {({ isActive }) => (
          <BsFillHouseDoorFill
            className="nav-icon"
            color={isActive ? activeColor : "grey"}
          />
        )}
      </NavLink>
      <NavLink className="nav-link" to="/CountersPage">
        {({ isActive }) => (
          <BsList
            className="nav-icon"
            color={isActive ? activeColor : "grey"}
          />
        )}
      </NavLink>
    </div>
  );
};

export default NavBar;
