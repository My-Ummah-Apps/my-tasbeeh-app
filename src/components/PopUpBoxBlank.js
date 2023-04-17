import { useState } from "react";

const PopUpBoxBlank = ({ setShowPopUpBoxBlank, addCounter, counterItem }) => {
  const closePopUpBox = () => {
    setShowPopUpBoxBlank(false);
  };

  const submitCounter = (e) => {
    e.preventDefault();
    // if (!targetInput || !dhikrInput) return;
    if (!dhikrInput) return;
    targetInput
      ? addCounter(dhikrInput, targetInput)
      : addCounter(dhikrInput, 0);
    // addCounter(dhikrInput);
    setDhikrName("");
    setShowPopUpBoxBlank(false);
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
      <div className="pop-up-box-buttons-wrap">
        <button onClick={closePopUpBox}>Cancel</button>
        <input type="submit" value="Submit" onClick={submitCounter}></input>
      </div>
    </form>
  );
};

export default PopUpBoxBlank;
