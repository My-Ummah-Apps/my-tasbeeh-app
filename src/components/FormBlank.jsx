import { useState, useRef } from "react";

function FormBlank({
  activeBackgroundColor,
  setShowPopUpBoxBlank,
  addCounter,
  handleCloseModal2,
}) {
  const counterField = useRef(null);
  const counterTargetField = useRef(null);

  const showNameAlert = useRef(null);
  const showTargetAlert = useRef(null);

  const [counterNameInput, setCounterName] = useState("");
  const [counterTargetInput, setCounterTargetInput] = useState("");

  const submitCounter = (e) => {
    e.preventDefault();

    if (
      counterNameInput.length == 0 ||
      counterTargetInput == 0 ||
      counterTargetInput.length == 0 ||
      !counterTargetInput
    ) {
      if (counterNameInput.length == 0) {
        showNameAlert.current.style.visibility = "visible";
      } else {
        showNameAlert.current.style.visibility = "hidden";
      }
      if (
        counterTargetInput == 0 ||
        counterTargetInput.length == 0 ||
        !counterTargetInput
      ) {
        showTargetAlert.current.style.visibility = "visible";
      } else {
        showTargetAlert.current.style.visibility = "hidden";
      }

      return;
    }
    addCounter(counterNameInput, counterTargetInput);
    // counterTargetInput
    //   ? addCounter(counterNameInput, counterTargetInput)
    //   : addCounter(counterNameInput, 100);
    // addCounter(counterNameInput);
    setCounterName("");
    handleCloseModal2();
  };

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
                if (/\d/.test(e.target.value)) return;
                setCounterName(e.target.value);
              }}
              type="text"
              required
            ></input>
            <div
              ref={showNameAlert}
              className={`form-alert-styles`}
              style={{ visibility: "hidden" }}
            >
              Please enter a name
            </div>
          </div>
          <div className="form-blank-target-input-wrap">
            <p>Target</p>
            <input
              ref={counterTargetField}
              className="form-input"
              maxLength={5}
              onChange={(e) => {
                if (/[a-zA-Z]/.test(e.target.value)) return;
                setCounterTargetInput(e.target.value);
              }}
              type="text"
              // pattern="[0-9]*"
              required
            ></input>
            <div
              ref={showTargetAlert}
              className={`form-alert-styles`}
              style={{ visibility: "hidden" }}
            >
              Target must be above 0
            </div>
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
