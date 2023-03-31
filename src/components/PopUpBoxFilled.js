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
    targetInput
      ? modifyTheCountersArray(
          currentCounterId,
          currentCounterName,
          currentCount,
          currentCounterTarget
        )
      : modifyTheCountersArray();

    setCounterName("");
    setShowPopUpBoxFilled(false);
  };

  //   const onSubmit = (e) => {
  //     e.preventDefault();
  //   };
  console.log(currentCounterName);
  const [counterNameInput, setCounterName] = useState(currentCounterName);
  const [currentCountInput, setcurrentCountInput] = useState(currentCount);
  const [targetInput, setTarget] = useState(currentCounterTarget);

  return (
    <form className="pop-up-box-wrap">
      <input
        onChange={(e) => {
          setCounterName(e.target.value);
        }}
        type="text"
        value={counterNameInput}
        required
      ></input>
      <input
        onChange={(e) => {
          setcurrentCountInput(e.target.value);
        }}
        type="text"
        value={currentCountInput}
        required
      ></input>
      <input
        onChange={(e) => {
          setTarget(e.target.value);
        }}
        type="text"
        value={targetInput}
        required
      ></input>
      <button onClick={closePopUpBox}>Cancel</button>
      <input type="submit" value="Submit" onClick={submitCounter}></input>
    </form>
  );
};

export default PopUpBoxFilled;
