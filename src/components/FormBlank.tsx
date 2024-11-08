import { useState, useRef, useEffect } from "react";

import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";

interface FormBlankProps {
  activeBackgroundColor: string;
  addCounter: (counterNameInput: string, counterTargetInput: string) => void;
  setIsFormBlankSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function FormBlank({
  activeBackgroundColor,
  addCounter,
  setIsFormBlankSheetOpen,
}: FormBlankProps) {
  const counterNameField = useRef<HTMLTextAreaElement | null>(null);
  const counterField = useRef(null);
  const counterTargetField = useRef(null);

  const showNameAlert = useRef<HTMLDivElement>(null);
  const showTargetAlert = useRef<HTMLDivElement>(null);

  const [counterNameInput, setCounterNameInput] = useState<string>("");
  const [counterTargetInput, setCounterTargetInput] = useState<string>("");

  const formBlankRef = useRef<HTMLDivElement | null>(null);

  // if (Capacitor.getPlatform() === "ios") {
  //   Keyboard.setAccessoryBarVisible({ isVisible: true });

  //   // window.addEventListener("keyboardWillShow", (e) => {
  //   //   if (formBlankRef.current) {
  //   //     formBlankRef.current.style.marginBottom =
  //   //       (e as any).keyboardHeight + "px";
  //   //   }
  //   // });
  //   // window.addEventListener("keyboardWillHide", (e) => {
  //   //   if (formBlankRef.current) {
  //   //     formBlankRef.current.style.marginBottom = "0px";
  //   //   }
  //   // });
  // }

  const increaseTextAreaHeight = (e: any) => {
    if (counterNameField.current) {
      // counterNameField.current.style.height = "auto";
      counterNameField.current.style.height = `${e.target.scrollHeight}px`;
    } else {
      console.error("counterNameField.current does not exist");
    }
  };

  useEffect(() => {
    if (counterNameField.current) {
      counterNameField.current.style.height = "1px";
      counterNameField.current.style.height = `${
        counterNameField.current.scrollHeight + 0.5
      }px`;
    } else {
      console.error("counterNameField.current does not exist");
    }
  }, []);

  const submitCounter = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();

    if (
      counterNameInput.length === 0 ||
      counterTargetInput === "0" ||
      counterTargetInput.length === 0 ||
      !counterTargetInput
    ) {
      if (counterNameInput.length === 0) {
        showNameAlert.current!.style.visibility = "visible";
      } else {
        showNameAlert.current!.style.visibility = "hidden";
      }
      if (
        counterTargetInput === "0" ||
        counterTargetInput.length === 0 ||
        !counterTargetInput
      ) {
        showTargetAlert.current!.style.visibility = "visible";
      } else {
        showTargetAlert.current!.style.visibility = "hidden";
      }

      return;
    }
    addCounter(counterNameInput, counterTargetInput);
    setCounterNameInput("");
    setIsFormBlankSheetOpen(false);
  };

  return (
    <>
      <div ref={formBlankRef} className="form-wrap form-blank">
        <div className="form-blank-save-and-cancel-btn-wrap">
          <div
            onClick={() => {
              setIsFormBlankSheetOpen(false);
            }}
            className="form-blank-cancel-btn"
            style={{ backgroundColor: "transparent" }}
          >
            Cancel
          </div>
          <h1 className="form-blank-and-form-filled-header-text">
            Add Tasbeeh
          </h1>
          <div
            className="form-blank-save-btn"
            onClick={submitCounter}
            style={{ backgroundColor: activeBackgroundColor }}
          >
            Save
          </div>
        </div>

        <form>
          <div className="form-blank-counter-name-input-wrap">
            <div className="form-blank-name-and-target-wrap">
              <p>Dhikr Name</p>
              <textarea
                dir="auto"
                // ref={counterField}
                ref={counterNameField}
                className="form-textarea"
                onChange={(e) => {
                  // if (/\d/.test(e.target.value)) return;
                  setCounterNameInput(e.target.value);
                  increaseTextAreaHeight(e);
                }}
                required
              ></textarea>
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
                onChange={(e) => {
                  // if (/[a-zA-Z]/.test(e.target.value)) return;
                  if (/[^0-9]+/.test(e.target.value)) return;
                  setCounterTargetInput(e.target.value);
                }}
                value={counterTargetInput}
                className="form-input"
                maxLength={5}
                inputMode="numeric"
                pattern="[0-9]*"
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
          <div className="pop-up-box-buttons-wrap"></div>
        </form>
      </div>
    </>
  );
}

export default FormBlank;
