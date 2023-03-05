import { useState } from "react";

const PopUpBox = ({ setShowPopUpBox, savedCountersArray }) => {
  const closePopUpBox = () => {
    setShowPopUpBox(false);
  };

  const submitCounter = () => {
    alert("submit");
  };

  const [input, setInput] = useState("");

  return (
    <div className="pop-up-box-wrap">
      <input
        onChange={(e) => {
          setInput(e.target.value);
        }}
        type="text"
        placeholder="Dhikr Name"
      ></input>
      <button onClick={closePopUpBox}>Cancel</button>
      <button onClick={submitCounter}>Submit</button>
    </div>
  );
};

export default PopUpBox;
