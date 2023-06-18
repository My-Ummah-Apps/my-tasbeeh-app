import { useState } from "react";

function FormBlank({ setShowPopUpBoxBlank, addCounter, handleCloseModal2 }) {
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
    // setShowPopUpBoxBlank(false);
    handleCloseModal2();
  };

  const [counterNameInput, setCounterName] = useState("");
  const [targetInput, setTarget] = useState("");

  return (
    <div className="form-wrap form-blank">
      <form>
        <div className="form-blank-counter-name-input-wrap">
          <div className="form-blank-name-and-target-wrap">
            <p>Dhikr Name</p>
            <input
              onChange={(e) => {
                setCounterName(e.target.value);
              }}
              placeholder="Alhumdulillah"
              type="text"
              style={{ borderBottom: "1px solid" + alertColor }}
              required
            ></input>
            {/* <label style={{ color: alertColor }}>Dhikr Name</label> */}
          </div>
          <div className="form-blank-target-input-wrap">
            <p>Target</p>
            <input
              onChange={(e) => {
                if (!Number(e.target.value)) {
                  return;
                }
                setTarget(e.target.value);
              }}
              placeholder="0"
              maxLength={5}
              type="text"
              pattern="[0-9]*"
              required
            ></input>
            {/* <label>Target (Default: 0)</label> */}
          </div>
        </div>
        <div className="pop-up-box-buttons-wrap">
          <input
            className="form-blank-save-btn"
            type="submit"
            value="Save"
            onClick={submitCounter}
          ></input>
        </div>
      </form>
    </div>
  );
}

export default FormBlank;

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
