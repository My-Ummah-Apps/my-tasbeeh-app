import { useState } from "react";

const PopUpBoxBlank = ({
  setShowPopUpBoxBlank,
  addCounter,
  counterItem,
  nextColor,
}) => {
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
    <div style={{ backgroundColor: "rgb(92, 107, 192)" }} class="login-box">
      <form>
        <div class="user-box">
          <input
            onChange={(e) => {
              setDhikrName(e.target.value);
            }}
            type="text"
            required
          ></input>
          <label>Dhikr Name</label>
        </div>
        <div class="user-box">
          <input
            onChange={(e) => {
              setTarget(e.target.value);
            }}
            type="number"
            pattern="[0-9]*"
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

export default PopUpBoxBlank;

{
  /*  <form className="pop-up-box-wrap">
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
    </form> */
}
