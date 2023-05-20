import { useState } from "react";

const PopUpBoxBlank = ({ setShowPopUpBoxBlank, addCounter }) => {
  const closePopUpBox = () => {
    setShowPopUpBoxBlank(false);
  };

  const [alertColor, setAlertColor] = useState("#fff");

  const submitCounter = (e) => {
    e.preventDefault();

    if (!counterNameInput) {
      setAlertColor("#efff00");
      return;
    }
    targetInput
      ? addCounter(counterNameInput, targetInput)
      : addCounter(counterNameInput, 0);
    // addCounter(counterNameInput);
    setCounterName("");
    setShowPopUpBoxBlank(false);
  };

  //   const onSubmit = (e) => {
  //     e.preventDefault();
  //   };

  const [counterNameInput, setCounterName] = useState("");
  const [targetInput, setTarget] = useState("");

  return (
    <div style={{ backgroundColor: "rgb(92, 107, 192)" }} class="login-box">
      <form>
        <div class="user-box">
          <input
            onChange={(e) => {
              setCounterName(e.target.value);
            }}
            type="text"
            style={{ borderBottom: "1px solid" + alertColor }}
            required
          ></input>
          <label style={{ color: alertColor }}>Dhikr Name</label>
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
          setCounterName(e.target.value);
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
