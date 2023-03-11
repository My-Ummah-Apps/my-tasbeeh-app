import { useState } from "react";

const PopUpBox = ({ setShowPopUpBox, addCounter }) => {
  const closePopUpBox = () => {
    setShowPopUpBox(false);
  };

  const submitCounter = (e) => {
    e.preventDefault();

    addCounter(dhikrInput);
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
      <input type="text" placeholder="Daily Target (optional)"></input>
      <button onClick={closePopUpBox}>Cancel</button>
      <button onClick={submitCounter}>Submit</button>
    </form>
  );
};

export default PopUpBox;
