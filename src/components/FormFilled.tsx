import { useState, useRef, useEffect } from "react";
import React from "react";
import {
  IonButton,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonToast,
  IonTextarea,
  IonList,
  IonItem,
} from "@ionic/react";
import { VscDebugRestart } from "react-icons/vsc";
import { Keyboard } from "@capacitor/keyboard";
import {
  MdOutlinePlaylistRemove,
  MdOutlineRestartAlt,
  MdDeleteOutline,
} from "react-icons/md";
import { Capacitor } from "@capacitor/core";

interface FormFilledProps {
  setIsFormFilledSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeBackgroundColor: string;
  modifyTheCountersArray: (
    id: string,
    modifiedCounterName: string,
    modifiedCount: number,
    modifiedTarget: number
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
  activeBackgroundColor,
  modifyTheCountersArray,
  currentCounterName,
  currentCount,
  currentCounterTarget,
  currentCounterId,
  resetSingleCounter,
  deleteSingleCounter, // setcurrentCount,
}: FormFilledProps) => {
  const counterNameField = useRef<HTMLTextAreaElement | null>(null);
  const counterCountField = useRef<HTMLInputElement | null>(null);
  const counterTargetField = useRef<HTMLInputElement | null>(null);
  const showTargetAlert = useRef<HTMLDivElement | null>(null);
  const showCountAlert = useRef<HTMLDivElement | null>(null);
  const showNameAlert = useRef<HTMLDivElement | null>(null);
  const formFilledRef = useRef<HTMLDivElement | null>(null);

  const [counterNameInput, setCounterNameInput] = useState(currentCounterName);
  const [currentCountInput, setcurrentCountInput] = useState(currentCount);
  const [currentTargetInput, setCurrentTarget] = useState(currentCounterTarget);

  // if (Capacitor.getPlatform() === "ios") {
  //   Keyboard.setAccessoryBarVisible({ isVisible: true });
  //   // window.addEventListener("keyboardWillShow", (e) => {
  //   //   if (formFilledRef.current) {
  //   //     formFilledRef.current.style.marginBottom =
  //   //       (e as any).keyboardHeight + "px";
  //   //   }
  //   // });
  //   // window.addEventListener("keyboardWillHide", (e) => {
  //   //   if (formFilledRef.current) {
  //   //     formFilledRef.current.style.marginBottom = "0px";
  //   //   }
  //   // });
  // }

  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (counterNameField.current) {
      // ! Unsure if below line will work across all devices as its being set to 1px
      counterNameField.current.style.height = "1px";
      counterNameField.current.style.height = `${counterNameField.current.scrollHeight}px`;
    } else {
      console.error("counterNameField.current does not exist");
    }
  }, []);

  const submitCounter = () => {
    // e.preventDefault();
    // console.log("counterNameInput; ", counterNameInput);
    // console.log("currentCountInput", currentCountInput);
    // console.log("currentTargetInput, ", currentTargetInput);

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
      // counterNameField.current.style.height = "auto";
      counterNameField.current.style.height = `${e.target.scrollHeight}px`;
    } else {
      console.error("counterNameField.current does not exist");
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  // console.log("isOpen: ", isOpen);
  // console.log("activeBackgroundColor:", activeBackgroundColor);

  return (
    <>
      <div ref={formFilledRef} className="form-wrap form-filled">
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
            style={{ backgroundColor: "#3b82f6" }}
          >
            Save
          </div>
        </div>

        <form>
          <div className="form-filled-counter-name-input-wrap">
            <p>Dhikr Name</p>

            <textarea
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
                if (/\d/.test(e.target.value)) return;
                setCounterNameInput(e.target.value);
                increaseTextAreaHeight(e);
              }}
              // type="text"
              value={counterNameInput}
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
          <div className="count-and-target-input-wrap">
            <div className="current-count-input-wrap">
              <p>Count</p>
              <input
                // onClick={(event) => {
                //   const input = event.target;
                //   // input.selectionStart = input.value.length;
                //   // input.selectionEnd = input.value.length;
                //   // input.focus();
                // }}
                ref={counterCountField}
                className="form-input"
                maxLength={5}
                onChange={(e) => {
                  if (/[a-zA-Z]/.test(e.target.value)) return;
                  setcurrentCountInput(Number(e.target.value));
                }}
                // type="text"
                value={currentCountInput}
                // pattern="[0-9]*"
                required
              ></input>
              <div
                ref={showCountAlert}
                className={`form-alert-styles`}
                style={{ visibility: "hidden" }}
              >
                Please enter a number
              </div>
            </div>
            <div className="target-input-wrap">
              <p>Target</p>
              <input
                // onClick={(event) => {
                //   const input = event.target;
                //   // input.selectionStart = input.value.length;
                //   // input.selectionEnd = input.value.length;
                //   // input.focus();
                // }}
                ref={counterTargetField}
                className="form-input"
                maxLength={5}
                onChange={(e) => {
                  if (/[a-zA-Z]/.test(e.target.value)) return;
                  setCurrentTarget(Number(e.target.value));
                }}
                // type="text"
                value={currentTargetInput}
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
            <div className="reset-and-save-btn-wrap"></div>
          </div>
        </form>
        <div className="form-filled-icons-wrap">
          {/* <button className="form-filled-reset-delete-btns-wrap">
            <p>Reset Counter</p>
            <MdOutlineRestartAlt
              onClick={(e) => {
                e.preventDefault();
                resetSingleCounter(currentCounterId);
                setcurrentCountInput(0);
              }}
            />
          </button> */}
          <button
            className="form-filled-reset-delete-btns-wrap"
            onClick={(e) => {
              setIsOpen(true);
              deleteSingleCounter(currentCounterId);
              e.preventDefault();
              setIsFormFilledSheetOpen(false);
            }}
          >
            <p>Delete Counter</p>
            <MdDeleteOutline />
          </button>
        </div>
      </div>

      <IonToast
        isOpen={isOpen}
        message="This toast will close in 5 seconds"
        onDidDismiss={() => setIsOpen(false)}
        duration={5000}
      ></IonToast>
    </>
  );
};

export default FormFilled;
