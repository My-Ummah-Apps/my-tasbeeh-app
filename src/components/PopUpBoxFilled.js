import { useState } from "react";

const PopUpBoxFilled = ({
  modifyTheCountersArray,
  setShowPopUpBoxFilled,
  addCounter,
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

    // setCounterName("");
    setShowPopUpBoxFilled(false);
  };

  const [counterNameInput, setCounterName] = useState(currentCounterName);
  const [currentCountInput, setcurrentCountInput] = useState(currentCount);
  const [currentTargetInput, setTarget] = useState(currentCounterTarget);

  return (
    <form className="pop-up-box-wrap">
      <input
        onChange={(e) => {
          setCounterName(e.target.value);
        }}
        type="text"
        value={counterNameInput}
        placeholder="Counter Name"
        required
      ></input>
      <input
        onChange={(e) => {
          setcurrentCountInput(e.target.value);
        }}
        type="number"
        value={currentCountInput}
        placeholder="Count"
        required
      ></input>
      <input
        onChange={(e) => {
          setTarget(e.target.value);
        }}
        type="number"
        value={currentTargetInput}
        placeholder="Target"
        required
      ></input>
      <div className="pop-up-box-buttons-wrap">
        <button onClick={closePopUpBox}>Cancel</button>
        <input type="submit" value="Submit" onClick={submitCounter}></input>
      </div>
    </form>
  );
};

export default PopUpBoxFilled;
