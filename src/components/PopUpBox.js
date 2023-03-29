import { useState } from "react";

const PopUpBox = ({ setShowPopUpBox, addCounter }) => {
  const closePopUpBox = () => {
    setShowPopUpBox(false);
  };

  const submitCounter = (e) => {
    e.preventDefault();
    if (!targetInput || !dhikrInput) return;
    targetInput
      ? addCounter(dhikrInput, targetInput)
      : addCounter(dhikrInput, 0);
    // addCounter(dhikrInput);
    setDhikrName("");
    setShowPopUpBox(false);
  };

  //   const onSubmit = (e) => {
  //     e.preventDefault();
  //   };

  const [dhikrInput, setDhikrName] = useState("");
  const [targetInput, setTarget] = useState("");

  return (
    <form className="pop-up-box-wrap">
      <input
        onChange={(e) => {
          setDhikrName(e.target.value);
        }}
        type="text"
        placeholder="Dhikr Name"
        required
      ></input>
      <input
        onChange={(e) => {
          setTarget(e.target.value);
        }}
        type="text"
        placeholder="Target (Default: 0)"
        required
      ></input>
      <input
        onChange={(e) => {
          setTarget(e.target.value);
        }}
        type="text"
        placeholder="Counter Start (Default: 0)"
        required
      ></input>
      <button onClick={closePopUpBox}>Cancel</button>
      <input type="submit" value="Submit" onClick={submitCounter}></input>
    </form>
  );
};

export default PopUpBox;
