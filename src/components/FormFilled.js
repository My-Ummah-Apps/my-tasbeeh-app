import { useState, useRef } from "react";
import { VscDebugRestart } from "react-icons/vsc";
import {
  MdOutlinePlaylistRemove,
  MdOutlineRestartAlt,
  MdDeleteOutline,
} from "react-icons/md";

import { RateApp } from "capacitor-rate-app";

const FormFilled = ({
  showReviewPrompt,
  reviewPrompt,
  activeBackgroundColor,
  modifyTheCountersArray,
  currentCounterName,
  currentCount,
  currentCounterTarget,
  currentCounterId,
  handleCloseModal,
  resetSingleCounter,
  deleteSingleCounter,
  setcurrentCount,
}) => {
  console.log("reviewPrompt: ");
  console.log(reviewPrompt);
  const counterNameField = useRef(null);
  const counterCountField = useRef(null);
  const counterTargetField = useRef(null);
  const showTargetAlert = useRef(null);
  const showCountAlert = useRef(null);
  const showNameAlert = useRef(null);

  const submitCounter = (e) => {
    e.preventDefault();

    if (
      !counterNameInput ||
      currentCountInput.length == 0 ||
      currentTargetInput == 0
    ) {
      counterNameInput.length == 0
        ? (showNameAlert.current.style.visibility = "visible")
        : (showNameAlert.current.style.visibility = "hidden");

      currentCountInput.length == 0
        ? (showCountAlert.current.style.visibility = "visible")
        : (showCountAlert.current.style.visibility = "hidden");

      currentTargetInput == 0
        ? (showTargetAlert.current.style.visibility = "visible")
        : (showTargetAlert.current.style.visibility = "hidden");

      // if (counterNameInput.length == 0) {
      //   showNameAlert.current.style.visibility = "visible";
      // } else {
      //   showNameAlert.current.style.visibility = "hidden";
      // }
      // if (currentCountInput.length == 0) {
      //   showCountAlert.current.style.visibility = "visible";
      // } else {
      //   showCountAlert.current.style.visibility = "hidden";
      // }
      // if (currentTargetInput == 0) {
      //   showTargetAlert.current.style.visibility = "visible";
      // } else {
      //   showTargetAlert.current.style.visibility = "hidden";
      // }

      return;
    }

    modifyTheCountersArray(
      currentCounterId,
      counterNameInput,
      currentCountInput,
      currentTargetInput
    );

    handleCloseModal();
    // Ask for review
    if (reviewPrompt) {
      RateApp.requestReview();
      showReviewPrompt(false);
      let launchCount = 0;
      localStorage.setItem("launch-count", JSON.stringify(launchCount));
    }
  };

  const [counterNameInput, setCounterName] = useState(currentCounterName);
  const [currentCountInput, setcurrentCountInput] = useState(currentCount);
  const [currentTargetInput, setCurrentTarget] = useState(currentCounterTarget);

  return (
    <form className="form-wrap form-filled">
      <div className="form-filled-icons-wrap">
        {/* <MdOutlinePlaylistRemove */}
        <MdDeleteOutline
          onClick={(e) => {
            deleteSingleCounter(currentCounterId);
            e.preventDefault();
            handleCloseModal();
          }}
        />
        {/* <VscDebugRestart */}
        <MdOutlineRestartAlt
          onClick={(e) => {
            e.preventDefault();
            resetSingleCounter(currentCounterId);
            setcurrentCountInput(0);
          }}
        />
      </div>
      <div className="form-filled-counter-name-input-wrap">
        <p>Dhikr Name</p>
        <input
          ref={counterNameField}
          className="form-filled-name-input form-input"
          onChange={(e) => {
            if (/\d/.test(e.target.value)) return;
            setCounterName(e.target.value);
          }}
          type="text"
          value={counterNameInput}
          required
        ></input>
        <div
          ref={showNameAlert}
          className={`form-alert-styles`}
          style={{ visibility: "hidden" }}
        >
          Please enter a name
        </div>
      </div>
      <div className="count-and-target-input-wrap">
        <div className="current-count-input-wrap">
          <p>Count</p>
          <input
            ref={counterCountField}
            className="form-input"
            maxLength={5}
            onChange={(e) => {
              // if (/[a-zA-Z]/.test(e.target.value)) return;
              setcurrentCountInput(e.target.value);
            }}
            type="text"
            value={currentCountInput}
            // pattern="[0-9]*"
            required
          ></input>
          <div
            ref={showCountAlert}
            className={`form-alert-styles`}
            style={{ visibility: "hidden" }}
          >
            Please enter a number
          </div>
        </div>
        <div className="target-input-wrap">
          <p>Target</p>
          <input
            ref={counterTargetField}
            className="form-input"
            maxLength={5}
            onChange={(e) => {
              if (/[a-zA-Z]/.test(e.target.value)) return;
              setCurrentTarget(e.target.value);
            }}
            type="text"
            value={currentTargetInput}
            // pattern="[0-9]*"
            required
          ></input>
          <div
            ref={showTargetAlert}
            className={`form-alert-styles`}
            style={{ visibility: "hidden" }}
          >
            Target must be above 0
          </div>
        </div>
      </div>
      <div className="pop-up-box-buttons-wrap">
        <div className="reset-and-save-btn-wrap"></div>
        <div
          className="form-filled-save-btn"
          style={{ backgroundColor: activeBackgroundColor }}
          onClick={submitCounter}
        >
          Done
        </div>
      </div>
    </form>
  );
};

export default FormFilled;
