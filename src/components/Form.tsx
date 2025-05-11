import React, { useState, useRef, useEffect } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { showConfirmDialog, showToast } from "../utils/constants";
import { counterObjType } from "../utils/types";

interface Form {
  activeCounter: counterObjType;
  addCounter: (counterNameInput: string, counterTargetInput: string) => void;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  addNewCounter: boolean;
}

function Form({
  addNewCounter,
  addCounter,
  setShowForm,
  activeCounter,
  deleteSingleCounter,
}: Form) {
  const counterNameField = useRef<HTMLTextAreaElement | null>(null);
  const counterCountField = useRef<HTMLInputElement | null>(null);
  const counterTargetField = useRef(null);
  const showNameAlert = useRef<HTMLDivElement>(null);
  const showTargetAlert = useRef<HTMLDivElement>(null);

  const [counterTargetInput, setCounterTargetInput] = useState<string>("");
  const showCountAlert = useRef<HTMLDivElement | null>(null);

  //   ! The below will need a conditional statement to set the state to either the existing counter or a blank field for new counter to be inserted
  const [counterNameInput, setCounterNameInput] = useState<string>(
    addNewCounter ? "" : activeCounter.counter
  );
  const [currentCountInput, setcurrentCountInput] = useState<number | string>(
    addNewCounter ? 0 : activeCounter.count
  );
  const [currentTargetInput, setCurrentTarget] = useState<number | string>(
    addNewCounter ? 0 : activeCounter.target
  );

  const increaseTextAreaHeight = (e: any) => {
    if (counterNameField.current) {
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

  const submitCounter = (
    e: React.MouseEvent<HTMLDivElement>,
    action: "add" | "modify"
  ): void => {
    e.preventDefault();

    if (action === "add") {
      addCounter(counterNameInput, counterTargetInput);
      setCounterNameInput("");
      setIsFormBlankSheetOpen(false);
    } else if (action === "modify") {
      modifyTheCountersArray(
        currentCounterId,
        counterNameInput,
        currentCountInput,
        currentTargetInput
      );
    }

    setShowForm(false);
  };

  return (
    <>
      {addNewCounter ? (
        <div className="form-wrap form-blank">
          <div className="form-blank-save-and-cancel-btn-wrap">
            <div
              onClick={() => {
                setShowForm(false);
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
              style={{ backgroundColor: activeCounter.color }}
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
                  ref={counterNameField}
                  className="form-textarea"
                  onChange={(e) => {
                    setCounterNameInput(e.target.value);
                    increaseTextAreaHeight(e);
                  }}
                  required
                />
                <div
                  ref={showNameAlert}
                  className="form-alert-styles"
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
                    if (/[^0-9]+/.test(e.target.value)) return;
                    setCounterTargetInput(e.target.value);
                  }}
                  value={counterTargetInput}
                  className="form-input"
                  maxLength={5}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                />
                <div
                  ref={showTargetAlert}
                  className="form-alert-styles"
                  style={{ visibility: "hidden" }}
                >
                  Target must be above 0
                </div>
              </div>
            </div>
            <div className="pop-up-box-buttons-wrap" />
          </form>
        </div>
      ) : (
        <>
          {" "}
          <div className="form-wrap form-filled">
            <div className="form-filled-save-and-cancel-btn-wrap">
              <div
                onClick={() => {
                  setShowForm(false);
                }}
                className="form-filled-cancel-btn"
                style={{ backgroundColor: "transparent" }}
              >
                Cancel
              </div>
              <h1 className="form-blank-and-form-filled-header-text">
                Edit Tasbeeh
              </h1>
              <div
                className="form-filled-save-btn"
                onClick={submitCounter}
                style={{ backgroundColor: activeCounter.color }}
              >
                Save
              </div>
            </div>

            <form>
              <div className="form-filled-counter-name-input-wrap">
                <p>Dhikr Name</p>

                <textarea
                  dir="auto"
                  ref={counterNameField}
                  className="form-textarea"
                  onChange={(e) => {
                    setCounterNameInput(e.target.value);
                    increaseTextAreaHeight(e);
                  }}
                  value={counterNameInput}
                  required
                />
                <div
                  ref={showNameAlert}
                  className="form-alert-styles"
                  style={{ visibility: "hidden" }}
                >
                  Please enter a name
                </div>
              </div>
              <div className="count-and-target-input-wrap">
                <div className="current-count-input-wrap">
                  <p>Count</p>
                  <input
                    ref={counterCountField}
                    className="form-input"
                    maxLength={5}
                    onChange={(e) => {
                      if (/[^0-9]+/.test(e.target.value)) return;

                      setcurrentCountInput(e.target.value);

                      console.log("e.target.value", e.target.value);
                    }}
                    value={currentCountInput}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                  />
                  <div
                    ref={showCountAlert}
                    className="form-alert-styles"
                    style={{ visibility: "hidden" }}
                  >
                    Please enter a number
                  </div>
                </div>
                <div className="target-input-wrap">
                  <p>Target</p>
                  <input
                    onChange={(e) => {
                      if (/[^0-9]+/.test(e.target.value)) return;

                      setCurrentTarget(e.target.value);
                    }}
                    ref={counterTargetField}
                    className="form-input"
                    maxLength={5}
                    value={currentTargetInput}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                  />
                  <div
                    ref={showTargetAlert}
                    className="form-alert-styles"
                    style={{ visibility: "hidden" }}
                  >
                    Target must be above 0
                  </div>
                </div>
              </div>
              <div className="pop-up-box-buttons-wrap">
                <div className="reset-and-save-btn-wrap" />
              </div>
            </form>
          </div>
          <div className="form-filled-reset-delete-btns-wrap">
            <button
              className="form-filled-delete-tasbeeh-btn"
              onClick={async (e) => {
                e.preventDefault();

                const result = await showConfirmDialog(
                  "Delete Tasbeeh",
                  "Are you sure you want to delete this Tasbeeh?"
                );
                if (result) {
                  deleteSingleCounter(activeCounter.id);
                  setShowForm(false);
                  showToast("Tasbeeh deleted", "bottom", "short");
                }
              }}
            >
              <p>Delete Tasbeeh</p>
              <MdDeleteOutline />
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default Form;
