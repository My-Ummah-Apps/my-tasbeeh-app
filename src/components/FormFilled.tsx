import React, { useState, useRef, useEffect } from "react";

import { MdDeleteOutline } from "react-icons/md";
import { showConfirmDialog, showToast } from "../utils/constants";

interface FormFilledProps {
  setIsFormFilledSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modifyTheCountersArray: (
    id: string,
    modifiedCounterName: string,
    modifiedCount: number | string,
    modifiedTarget: number | string
  ) => void;
  currentCounterName: string;
  currentCount: number;
  currentCounterTarget: number;
  currentCounterId: string;
  resetSingleCounter: (id: string) => void;
  deleteSingleCounter: (id: string) => void;
}

const FormFilled = ({
  setIsFormFilledSheetOpen,
  modifyTheCountersArray,
  currentCounterName,
  currentCount,
  currentCounterTarget,
  currentCounterId,
  activeCounter,
  deleteSingleCounter,
}: FormFilledProps) => {
  const counterNameField = useRef<HTMLTextAreaElement | null>(null);
  const counterCountField = useRef<HTMLInputElement | null>(null);
  const counterTargetField = useRef<HTMLInputElement | null>(null);
  const showTargetAlert = useRef<HTMLDivElement | null>(null);
  const showCountAlert = useRef<HTMLDivElement | null>(null);
  const showNameAlert = useRef<HTMLDivElement | null>(null);
  const formFilledRef = useRef<HTMLDivElement | null>(null);

  const [counterNameInput, setCounterNameInput] =
    useState<string>(currentCounterName);
  const [currentCountInput, setcurrentCountInput] = useState<number | string>(
    currentCount
  );
  const [currentTargetInput, setCurrentTarget] = useState<number | string>(
    currentCounterTarget
  );

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

  const submitCounter = () => {
    if (
      !counterNameInput ||
      currentCountInput.toString().length == 0 ||
      currentTargetInput == 0
    ) {
      if (showNameAlert.current) {
        counterNameInput.length == 0
          ? (showNameAlert.current.style.visibility = "visible")
          : (showNameAlert.current.style.visibility = "hidden");
      } else {
        console.error("showNameAlert.current is null");
      }

      if (showCountAlert.current) {
        currentCountInput.toString().length == 0
          ? (showCountAlert.current.style.visibility = "visible")
          : (showCountAlert.current.style.visibility = "hidden");
      } else {
        console.error("showCountAlert.current is null");
      }

      if (showTargetAlert.current) {
        currentTargetInput == 0
          ? (showTargetAlert.current.style.visibility = "visible")
          : (showTargetAlert.current.style.visibility = "hidden");
      } else {
        console.error("showTargetAlert.current is null");
      }

      return;
    }

    modifyTheCountersArray(
      currentCounterId,
      counterNameInput,
      currentCountInput,
      currentTargetInput
    );

    setIsFormFilledSheetOpen(false);
  };

  const increaseTextAreaHeight = (e: any) => {
    if (counterNameField.current) {
      counterNameField.current.style.height = `${e.target.scrollHeight}px`;
    } else {
      console.error("counterNameField.current does not exist");
    }
  };

  return (
    <>
      <div className="form-wrap form-filled">
        <div className="form-filled-save-and-cancel-btn-wrap">
          <div
            onClick={() => {
              setIsFormFilledSheetOpen(false);
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

        <form
        // ref={formFilledRef}
        >
          <div className="form-filled-counter-name-input-wrap">
            <p>Dhikr Name</p>

            <textarea
              dir="auto"
              // onClick={(event) => {
              //   const input = event.target;
              //   // console.log("input: ", input.value);

              //   // // console.log("input: ", input.selectionStart);

              //   // input.selectionStart = input.value.length;
              //   // input.selectionEnd = input.value.length;
              //   // @ts-ignore
              //   // input.focus();
              // }}
              ref={counterNameField}
              // className="form-filled-name-input form-input"
              className="form-textarea"
              onChange={(e) => {
                // if (/\d/.test(e.target.value)) return;
                setCounterNameInput(e.target.value);
                increaseTextAreaHeight(e);
              }}
              // type="text"
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
              deleteSingleCounter(currentCounterId);
              setIsFormFilledSheetOpen(false);
              showToast("Tasbeeh deleted", "bottom", "short");
            }
          }}
        >
          <p>Delete Tasbeeh</p>
          <MdDeleteOutline />
        </button>
      </div>
    </>
  );
};

export default FormFilled;
