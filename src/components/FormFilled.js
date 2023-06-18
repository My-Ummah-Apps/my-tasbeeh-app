import { useState } from "react";

const FormFilled = ({
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
  const [alertColor, setAlertColor] = useState("#fff");
  const submitCounter = (e) => {
    e.preventDefault();
    if (!counterNameInput) {
      setAlertColor("#efff00");
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
      <div className="form-filled-counter-name-input-wrap">
        <p>Dhikr Name</p>
        <input
          className="form-filled-name-input"
          onChange={(e) => {
            setCounterName(e.target.value);
          }}
          type="text"
          value={counterNameInput}
          style={{ borderBottom: "1px solid" + alertColor }}
          required
        ></input>
      </div>
      <div className="count-and-target-input-wrap">
        <div className="current-count-input-wrap">
          <p>Count</p>
          <input
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
        <div className="reset-and-save-btn-wrap">
          <input
            className="reset-btn"
            type="button"
            value="Reset"
            onClick={(e) => {
              e.preventDefault();
              resetSingleCounter(currentCounterId);
              setcurrentCountInput(0);
            }}
          ></input>

          <input
            className="form-filled-save-btn"
            type="button"
            value="Save"
            onClick={submitCounter}
          ></input>
        </div>

        <input
          className="delete-btn"
          type="button"
          value="Delete"
          onClick={(e) => {
            deleteSingleCounter(currentCounterId);
            e.preventDefault();
            handleCloseModal();
          }}
        ></input>
      </div>
    </form>
  );
};

export default FormFilled;
