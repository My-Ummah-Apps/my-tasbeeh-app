import { useState } from "react";

const PopUpBoxFilled = ({
  setShowPopUpBoxFilled,
  addCounter,
  currentCounterName,
  currentCount,
  currentCounterTarget,
}) => {
  const closePopUpBox = () => {
    setShowPopUpBoxFilled(false);
  };

  const submitCounter = (e) => {
    e.preventDefault();
    if (!targetInput || !dhikrInput) return;
    targetInput
      ? addCounter(dhikrInput, targetInput)
      : addCounter(dhikrInput, 0);
    // addCounter(dhikrInput);
    setDhikrName("");
    setShowPopUpBoxFilled(false);
  };

  //   const onSubmit = (e) => {
  //     e.preventDefault();
  //   };
  console.log(currentCounterName);
  const [dhikrInput, setDhikrName] = useState("");
  const [targetInput, setTarget] = useState("");

  return (
    <form className="pop-up-box-wrap">
      <input
        onChange={(e) => {
          setDhikrName(e.target.value);
        }}
        type="text"
        value={currentCounterName}
        required
      ></input>
      <input
        onChange={(e) => {
          setTarget(e.target.value);
        }}
        type="text"
        value={currentCount}
        required
      ></input>
      <input
        onChange={(e) => {
          setTarget(e.target.value);
        }}
        type="text"
        value={currentCounterTarget}
        required
      ></input>
      <button onClick={closePopUpBox}>Cancel</button>
      <input type="submit" value="Submit" onClick={submitCounter}></input>
    </form>
  );
};

export default PopUpBoxFilled;
