import { useState } from "react";
import React from "react";

const PopUpBox = ({ formTheme, setTheme, activeBackgroundColor }) => {
  if (formTheme) {
    return (
      <div className="theme-options-wrap">
        <div
          onClick={() => {
            setTheme("dark");
            localStorage.setItem("theme", JSON.stringify("dark"));
            console.log("dark selected");
          }}
        >
          Dark
        </div>
        <div
          onClick={() => {
            setTheme("light");
            localStorage.setItem("theme", JSON.stringify("light"));
            console.log("light selected");
          }}
        >
          Light
        </div>
        <div
          onClick={() => {
            setTheme("system");
            localStorage.setItem("theme", JSON.stringify("system"));
            console.log("system selected");
          }}
        >
          System
        </div>
      </div>
    );
  }
};

export default PopUpBox;
