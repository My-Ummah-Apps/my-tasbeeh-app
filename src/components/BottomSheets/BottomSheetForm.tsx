import React, { useState, useRef, useEffect } from "react";
import { showAlert } from "../../utils/constants";
import { counterObjType, MaterialColor } from "../../utils/types";
import { IonInput, IonItem, IonModal } from "@ionic/react";

interface BottomSheetFormProps {
  activeColor: MaterialColor;
  countersState: counterObjType[];
  setCounterId: React.Dispatch<React.SetStateAction<number | null>>;
  counterId: number | null;
  activeCounter: counterObjType;
  addCounter: (counterToAdd: string, target: number) => Promise<void>;
  modifyCounter: (
    id: number,
    modifiedCounterName: string,
    modifiedCount: number,
    modifiedTarget: number
  ) => Promise<void>;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  showForm: boolean;
}

const BottomSheetForm = ({
  activeColor,
  countersState,
  setCounterId,
  counterId,
  addCounter,
  modifyCounter,
  setShowForm,
  showForm,
}: BottomSheetFormProps) => {
  const counterNameField = useRef<HTMLTextAreaElement | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [input, setInput] = useState({ name: "", count: 0, target: 0 });

  useEffect(() => {
    const clickedCounter = countersState.find(
      (counter) => counter.id === counterId
    );
    const isEditingCounter = !!clickedCounter;

    setInput({
      name: isEditingCounter ? clickedCounter.name : "",
      count: isEditingCounter ? clickedCounter.count : 0,
      target: isEditingCounter ? clickedCounter.target : 0,
    });
  }, [counterId]);

  const increaseTextAreaHeight = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (counterNameField.current) {
      counterNameField.current.style.height = `${e.target.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (counterNameField.current) {
      // if (!counterId) {
      // counterNameField.current.style.height = "1px";
      // }
      // console.log("scrollHeight: ", counterNameField.current.scrollHeight);
      counterNameField.current.style.height = `${
        counterNameField.current.scrollHeight + 0.5
      }px`;
    }
  }, [showForm]);

  const closeFormCleanup = () => {
    setShowForm(false);
    setInput({ name: "", count: 0, target: 0 });
    setCounterId(null);
    setSubmitted(false);
  };

  const submitCounter = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setSubmitted(true);

    const inputName = input.name.trim();

    if (inputName === "" || input.count < 0 || input.target < 1) {
      return;
    }

    const isDuplicate = countersState.some(
      (item) =>
        counterId !== item.id &&
        inputName.toLowerCase() === item.name.trim().toLowerCase()
    );

    if (isDuplicate) {
      showAlert(
        "Duplicate Tasbeeh",
        "A tasbeeh with this name already exists. Please choose a different name."
      );
      return;
    }

    counterId
      ? await modifyCounter(counterId, inputName, input.count, input.target)
      : await addCounter(inputName, Number(input.target));

    closeFormCleanup();
  };

  return (
    <IonModal
      mode="ios"
      isOpen={showForm}
      // ref={ref}
      // trigger={triggerId}
      // className="modal-fit-content"
      initialBreakpoint={0.95}
      breakpoints={[0, 0.95]}
      // handleBehavior="cycle"
      onDidDismiss={() => {
        closeFormCleanup();
      }}
      // onWillDismiss={(event) => onWillDismiss(event)}
    >
      <section className="form-wrap form-blank">
        <h1 className="text-center mt-7 mb-5 text-lg">
          {counterId ? "Edit Tasbeeh" : "Add Tasbeeh"}
        </h1>

        <div className="form-wrap form-filled">
          <form id="form" onSubmit={submitCounter}>
            <div className="form-filled-counter-name-input-wrap">
              <p>Tasbeeh Name</p>
              <textarea
                ref={counterNameField}
                dir="auto"
                className="form-textarea"
                onChange={(e) => {
                  setInput((prev) => ({ ...prev, name: e.target.value }));
                  increaseTextAreaHeight(e);
                }}
                value={input.name}
                required
              />
              <p
                style={{
                  color: "red",
                  visibility:
                    input.name.trim() === "" && submitted
                      ? "visible"
                      : "hidden",
                }}
              >
                Please enter a name
              </p>
            </div>
            <div className="flex gap-3 mx-5">
              {counterId && (
                <IonItem className="form-ion-item">
                  <IonInput
                    className=""
                    pattern="[0-9]*"
                    label="Count"
                    labelPlacement="floating"
                    maxlength={5}
                    required={true}
                    onIonInput={(e) => {
                      const inputVal = e.detail.value || "";
                      if (inputVal === "") return;
                      if (/[^0-9]+/.test(inputVal)) return;
                      setInput((prev) => ({
                        ...prev,
                        count: Number(inputVal),
                      }));
                    }}
                  ></IonInput>
                </IonItem>
                // <div className="current-count-input-wrap">
                //   <p>Count</p>
                //   <input
                //     className="form-input"
                //  onChange={(e) => {
                //                       if (/[^0-9]+/.test(e.target.value)) return;
                //                       setInput((prev) => ({
                //                         ...prev,
                //                         count: Number(e.target.value),
                //                       }));
                //                     }}
                //     value={input.count}
                //     inputMode="numeric"
                //     pattern="[0-9]*"
                //     required
                //   />

                // </div>
              )}

              <IonItem className="form-ion-item">
                <IonInput
                  className=""
                  pattern="[0-9]*"
                  label="Target"
                  labelPlacement="floating"
                  maxlength={5}
                  required={true}
                  onIonInput={(e) => {
                    const inputVal = e.detail.value || "";
                    if (inputVal === "") return;
                    if (/[^0-9]+/.test(inputVal)) return;
                    setInput((prev) => ({
                      ...prev,
                      count: Number(inputVal),
                    }));
                  }}
                ></IonInput>
              </IonItem>
              {/* <div className="target-input-wrap">
                <p>Target</p>
                <input
                  onChange={(e) => {
                    if (/[^0-9]+/.test(e.target.value)) return;
                    setInput((prev) => ({
                      ...prev,
                      target: Number(e.target.value),
                    }));
                  }}
                  className="form-input"
                  maxLength={5}
                  value={input.target}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                />
                <p
                  style={{
                    color: "red",
                    visibility:
                      input.target < 1 && submitted ? "visible" : "hidden",
                  }}
                >
                  Target must be above 0
                </p>
              </div> */}
            </div>
            <div className="flex flex-col items-center">
              <button
                form="form"
                className="block w-1/3"
                style={{ backgroundColor: activeColor }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  closeFormCleanup();
                }}
                className="block w-1/3"
                style={{ backgroundColor: "transparent" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>
    </IonModal>
  );
};

export default BottomSheetForm;
