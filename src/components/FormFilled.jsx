import { useState, useRef } from "react";
import { VscDebugRestart } from "react-icons/vsc";
import {
  MdOutlinePlaylistRemove,
  MdOutlineRestartAlt,
  MdDeleteOutline,
} from "react-icons/md";

const FormFilled = ({
  setIsFormFilledSheetOpen,
  activeBackgroundColor,
  modifyTheCountersArray,
  currentCounterName,
  currentCount,
  currentCounterTarget,
  currentCounterId,
  resetSingleCounter,
  deleteSingleCounter,
  setcurrentCount,
}) => {
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

      return;
    }

    modifyTheCountersArray(
      currentCounterId,
      counterNameInput,
      currentCountInput,
      currentTargetInput
    );

    setIsFormFilledSheetOpen(false);
  };

  const [counterNameInput, setCounterName] = useState(currentCounterName);
  const [currentCountInput, setcurrentCountInput] = useState(currentCount);
  const [currentTargetInput, setCurrentTarget] = useState(currentCounterTarget);

  return (
    <form className="form-wrap form-filled">
      <div className="form-filled-icons-wrap">
        <MdDeleteOutline
          onClick={(e) => {
            deleteSingleCounter(currentCounterId);
            e.preventDefault();
            setIsFormFilledSheetOpen(false);
          }}
        />

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
          onClick={(event) => {
            const input = event.target;
            input.selectionStart = input.value.length;
            input.selectionEnd = input.value.length;
            input.focus();
          }}
          ref={counterNameField}
          className="form-filled-name-input form-input"
          onChange={(e) => {
            if (/\d/.test(e.target.value)) return;
            setCounterName(e.target.value);
          }}
          // type="text"
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
            onClick={(event) => {
              const input = event.target;
              input.selectionStart = input.value.length;
              input.selectionEnd = input.value.length;
              input.focus();
            }}
            ref={counterCountField}
            className="form-input"
            maxLength={5}
            onChange={(e) => {
              if (/[a-zA-Z]/.test(e.target.value)) return;
              setcurrentCountInput(e.target.value);
            }}
            // type="text"
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
            onClick={(event) => {
              const input = event.target;
              input.selectionStart = input.value.length;
              input.selectionEnd = input.value.length;
              input.focus();
            }}
            ref={counterTargetField}
            className="form-input"
            maxLength={5}
            onChange={(e) => {
              if (/[a-zA-Z]/.test(e.target.value)) return;
              setCurrentTarget(e.target.value);
            }}
            // type="text"
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
