import React, { useState, useRef, useEffect } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { showConfirmDialog, showerAlert, showToast } from "../utils/constants";
import { counterObjType } from "../utils/types";

interface Form {
  editingCounterId: string;
  activeCounter: counterObjType;
  addCounter: (counterNameInput: string, counterTargetInput: string) => void;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  addNewCounter: boolean;
}

function Form({
  countersArr,
  editingCounterId,
  deleteSingleCounter,
  addNewCounter,
  addCounter,
  modifyCounter,
  setShowForm,
  activeCounter,
}: Form) {
  const counterNameField = useRef<HTMLTextAreaElement | null>(null);
  const counterCountField = useRef<HTMLInputElement | null>(null);
  const counterTargetField = useRef(null);
  const showNameAlert = useRef<HTMLDivElement>(null);
  const showTargetAlert = useRef<HTMLDivElement>(null);
  const showCountAlert = useRef<HTMLDivElement | null>(null);

  const clickedCounter = countersArr.find(
    (counter: counterObjType) => counter.id === editingCounterId
  );

  const [counterNameInputValue, setCounterNameInputValue] = useState<string>(
    addNewCounter ? "" : clickedCounter.counter
  );
  const [currentCountInputValue, setcurrentCountInputValue] = useState<
    number | string
  >(addNewCounter ? 0 : clickedCounter.count);
  const [targetInputValue, setTargetInputValue] = useState<number | string>(
    addNewCounter ? 0 : clickedCounter.target
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

    action === "add"
      ? addCounter(counterNameInputValue, Number(targetInputValue))
      : modifyCounter(
          editingCounterId,
          counterNameInputValue,
          currentCountInputValue,
          targetInputValue
        );
    setShowForm(false);
  };

  return (
    <>
      <div className="form-wrap form-blank">
        <div className="form-filled-save-and-cancel-btn-wrap">
          <button
            onClick={() => {
              setShowForm(false);
            }}
            className="form-filled-cancel-btn"
            style={{ backgroundColor: "transparent" }}
          >
            Cancel
          </button>
          <h1 className="form-blank-and-form-filled-header-text">
            {addNewCounter ? "Add Tasbeeh" : "Edit Tasbeeh"}
          </h1>
          <button
            form="form"
            className="form-filled-save-btn"
            style={{ backgroundColor: activeCounter.color }}
          >
            Save
          </button>
        </div>

        <div className="form-wrap form-filled">
          <form
            id="form"
            onSubmit={(e) => {
              submitCounter(e, addNewCounter ? "add" : "modify");
            }}
          >
            <div className="form-filled-counter-name-input-wrap">
              <p>Dhikr Name</p>
              <textarea
                dir="auto"
                ref={counterNameField}
                className="form-textarea"
                onChange={(e) => {
                  setCounterNameInputValue(e.target.value);
                  increaseTextAreaHeight(e);
                }}
                value={counterNameInputValue}
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
              {!addNewCounter && (
                <div className="current-count-input-wrap">
                  <p>Count</p>
                  <input
                    ref={counterCountField}
                    className="form-input"
                    maxLength={5}
                    onChange={(e) => {
                      if (/[^0-9]+/.test(e.target.value)) return;

                      setcurrentCountInputValue(e.target.value);

                      console.log("e.target.value", e.target.value);
                    }}
                    value={currentCountInputValue}
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
              )}

              <div className="target-input-wrap">
                <p>Target</p>
                <input
                  onChange={(e) => {
                    if (/[^0-9]+/.test(e.target.value)) return;

                    setTargetInputValue(e.target.value);
                  }}
                  ref={counterTargetField}
                  className="form-input"
                  maxLength={5}
                  value={targetInputValue}
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
        {!addNewCounter && (
          <div className="form-filled-reset-delete-btns-wrap">
            <button
              className="form-filled-delete-tasbeeh-btn"
              onClick={async (e) => {
                const result = await showConfirmDialog(
                  "Delete Tasbeeh",
                  "Are you sure you want to delete this Tasbeeh?"
                );
                if (result) {
                  deleteSingleCounter(editingCounterId);
                  setShowForm(false);
                  showToast("Tasbeeh deleted", "bottom", "short");
                }
              }}
            >
              <p>Delete Tasbeeh</p>
              <MdDeleteOutline />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Form;
