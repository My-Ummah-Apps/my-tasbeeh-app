import { useState } from "react";

const PopUpBox = ({
  setShowPopUpBox,
  setLocalSavedCountersArray,
  localSavedCountersArray,
  addCounter,
}) => {
  const closePopUpBox = () => {
    setShowPopUpBox(false);
  };

  const submitCounter = (e) => {
    e.preventDefault();
    if (!input) {
      alert("please add counter");
      return;
    }

    addCounter(input);
    setInput("");
    setShowPopUpBox(false);
  };

  //   const onSubmit = (e) => {
  //     e.preventDefault();
  //   };

  const [input, setInput] = useState("");

  return (
    <form className="pop-up-box-wrap">
      <input
        onChange={(e) => {
          setInput(e.target.value);
        }}
        type="text"
        placeholder="Dhikr Name"
      ></input>
      <button onClick={closePopUpBox}>Cancel</button>
      <button onClick={submitCounter}>Submit</button>
    </form>
  );
};

export default PopUpBox;
