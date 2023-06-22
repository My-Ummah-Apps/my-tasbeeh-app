import { useState, useRef } from "react";

function FormBlank({
  activeBackgroundColor,
  setShowPopUpBoxBlank,
  addCounter,
  handleCloseModal2,
}) {
  const [alertColor, setAlertColor] = useState("#fff");
  const counterField = useRef(null);
  const counterTargetField = useRef(null);

  const submitCounter = (e) => {
    e.preventDefault();

    if (!counterNameInput || !counterTargetInput) {
      if (!counterNameInput) {
        counterField.current.style.border = "1px solid red";
      } else {
        counterField.current.style.border = "none";
      }
      if (!counterTargetInput == 0) {
        counterTargetField.current.style.border = "1px solid red";
      } else {
        counterTargetField.current.style.border = "none";
      }

      return;
    }
    addCounter(counterNameInput, counterTargetInput);
    // counterTargetInput
    //   ? addCounter(counterNameInput, counterTargetInput)
    //   : addCounter(counterNameInput, 100);
    // addCounter(counterNameInput);
    setCounterName("");
    // setShowPopUpBoxBlank(false);
    handleCloseModal2();
  };

  const [counterNameInput, setCounterName] = useState("");
  const [counterTargetInput, setCounterTargetInput] = useState("");

  return (
    <div className="form-wrap form-blank">
      <form>
        <div className="form-blank-counter-name-input-wrap">
          <div className="form-blank-name-and-target-wrap">
            <p>Dhikr Name</p>
            <input
              ref={counterField}
              className="form-input"
              onChange={(e) => {
                setCounterName(e.target.value);
              }}
              // placeholder="Dhikr"
              type="text"
              required
            ></input>
            {/* <label style={{ color: alertColor }}>Dhikr Name</label> */}
          </div>
          <div className="form-blank-target-input-wrap">
            <p>Target</p>
            <input
              ref={counterTargetField}
              className="form-input"
              onChange={(e) => {
                if (!Number(e.target.value)) {
                  return;
                }
                setCounterTargetInput(e.target.value);
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
          <div
            className="form-blank-save-btn"
            onClick={submitCounter}
            style={{ backgroundColor: activeBackgroundColor }}
          >
            Save
          </div>
        </div>
      </form>
    </div>
  );
}

export default FormBlank;
