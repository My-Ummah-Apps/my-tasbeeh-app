import { useState } from "react";

const PopUpBoxFilled = ({
  modifyTheCountersArray,
  setShowPopUpBoxFilled,
  currentCounterName,
  currentCount,
  currentCounterTarget,
  currentCounterId,
}) => {
  const closePopUpBox = () => {
    setShowPopUpBoxFilled(false);
  };

  const submitCounter = (e) => {
    e.preventDefault();
    if (!counterNameInput) return;
    modifyTheCountersArray(
      currentCounterId,
      counterNameInput,
      currentCountInput,
      currentTargetInput
    );

    setShowPopUpBoxFilled(false);
  };

  const [counterNameInput, setCounterName] = useState(currentCounterName);
  const [currentCountInput, setcurrentCountInput] = useState(currentCount);
  const [currentTargetInput, setTarget] = useState(currentCounterTarget);

  return (
    <div style={{ backgroundColor: "rgb(92, 107, 192)" }} class="login-box">
      <form>
        <div class="user-box">
          <input
            onChange={(e) => {
              setCounterName(e.target.value);
            }}
            type="text"
            value={counterNameInput}
            required
          ></input>
          <label>Dhikr Name</label>
        </div>
        <div class="user-box">
          <input
            onChange={(e) => {
              setcurrentCountInput(e.target.value);
            }}
            type="number"
            value={currentCountInput}
            required
          ></input>
          <label>Count</label>
        </div>
        <div class="user-box">
          <input
            onChange={(e) => {
              setTarget(e.target.value);
            }}
            type="number"
            value={currentTargetInput}
            required
          ></input>
          <label>Target (Default: 0)</label>
        </div>
        <div className="pop-up-box-buttons-wrap">
          <button onClick={closePopUpBox}>Cancel</button>
          <input
            className="submit-input"
            type="submit"
            value="Submit"
            onClick={submitCounter}
          ></input>
        </div>
      </form>
    </div>
  );
};

export default PopUpBoxFilled;
