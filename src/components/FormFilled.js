import { useState, useRef } from "react";
import { VscDebugRestart } from "react-icons/vsc";
import { MdOutlinePlaylistRemove, MdOutlineRestartAlt } from "react-icons/md";

const FormFilled = ({
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
  const counterNameField = useRef(null);
  const counterCountField = useRef(null);
  const counterTargetField = useRef(null);
  const submitCounter = (e) => {
    e.preventDefault();
    if (!counterNameInput || !currentCountInput || currentTargetInput == 0) {
      console.log("A field is empty");
      if (!counterNameInput) {
        counterNameField.current.style.border = "1px solid red";
        console.log("!counterNameInput");
      } else {
        counterNameField.current.style.border = "none";
      }
      if (!currentCountInput) {
        counterCountField.current.style.border = "1px solid red";
        console.log("!counterCountField");
      } else {
        counterCountField.current.style.border = "none";
      }
      if (currentTargetInput == 0) {
        counterTargetField.current.style.border = "1px solid red";
        console.log("!counterTargetField");
      } else {
        counterTargetField.current.style.border = "none";
      }

      return;
    }

    modifyTheCountersArray(
      currentCounterId,
      counterNameInput,
      currentCountInput,
      currentTargetInput
    );

    handleCloseModal();
  };

  const [counterNameInput, setCounterName] = useState(currentCounterName);
  const [currentCountInput, setcurrentCountInput] = useState(currentCount);
  const [currentTargetInput, setTarget] = useState(currentCounterTarget);

  return (
    <form className="form-wrap form-filled">
      <div className="form-filled-icons-wrap">
        <MdOutlinePlaylistRemove
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
            setCounterName(e.target.value);
          }}
          type="text"
          value={counterNameInput}
          // style={{ borderBottom: "1px solid" + alertColor }}
          required
        ></input>
      </div>
      <div className="count-and-target-input-wrap">
        <div className="current-count-input-wrap">
          <p>Count</p>
          <input
            ref={counterCountField}
            className="form-input"
            onChange={(e) => {
              setcurrentCountInput(e.target.value);
            }}
            type="number"
            value={currentCountInput}
            required
          ></input>
        </div>
        <div className="target-input-wrap">
          <p>Target</p>
          <input
            ref={counterTargetField}
            className="form-input"
            onChange={(e) => {
              setTarget(e.target.value);
            }}
            type="number"
            value={currentTargetInput}
            required
          ></input>
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
