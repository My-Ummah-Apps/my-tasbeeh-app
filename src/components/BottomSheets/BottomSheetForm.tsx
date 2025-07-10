import React, { useState } from "react";
import { showAlert } from "../../utils/constants";
import { counterObjType, MaterialColor } from "../../utils/types";
import { IonModal, IonTextarea, IonItem, IonInput } from "@ionic/react";

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
  const [submitted, setSubmitted] = useState(false);
  const [input, setInput] = useState({ name: "", count: "", target: "" });

  const closeFormCleanup = () => {
    console.log("FORM IS BEING CLEANED UP");
    setShowForm(false);
    setCounterId(null);
    setSubmitted(false);
  };

  const submitCounter = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setSubmitted(true);

    const inputName = input.name.trim();
    const inputCount = Number(input.count);
    const inputTarget = Number(input.target);

    if (inputName === "" || inputCount < 0 || inputTarget < 1) {
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
      ? await modifyCounter(counterId, inputName, inputCount, inputTarget)
      : await addCounter(inputName, inputTarget);

    closeFormCleanup();
  };

  return (
    <IonModal
      mode="ios"
      isOpen={showForm}
      initialBreakpoint={0.97}
      breakpoints={[0, 0.97]}
      onWillPresent={() => {
        const clickedCounter = countersState.find(
          (counter) => counter.id === counterId
        );
        const isEditingCounter = !!clickedCounter;

        setInput({
          name: isEditingCounter ? clickedCounter.name : "",
          count: isEditingCounter ? String(clickedCounter.count) : "",
          target: isEditingCounter ? String(clickedCounter.target) : "",
        });
      }}
      onWillDismiss={() => {
        console.log("onWillDismiss has run");
        closeFormCleanup();
      }}
    >
      <section className="form-wrap">
        <h1 className="text-center mt-7 mb-5 text-lg">
          {counterId ? "Edit Tasbeeh" : "Add Tasbeeh"}
        </h1>
        <section className="form-wrap">
          <form id="form" onSubmit={submitCounter}>
            <IonItem lines="inset">
              <IonTextarea
                className="form-textarea"
                // style={{
                //   "--border-color": activeColor,
                //   "--highlight-color-focused": activeColor,
                // }}
                label="Tasbeeh Name"
                labelPlacement="floating"
                dir="auto"
                autoGrow={true}
                onIonInput={(e) => {
                  const textAreaInputVal = e.detail.value ? e.detail.value : "";
                  setInput((prev) => ({ ...prev, name: textAreaInputVal }));
                }}
                value={input.name}
              ></IonTextarea>
            </IonItem>
            <p
              className="text-xs text-center mb-2"
              style={{
                color: "red",
                visibility:
                  input.name.trim() === "" && submitted ? "visible" : "hidden",
              }}
            >
              Please enter a name
            </p>
            <div className={`flex gap-4 ${!counterId ? "justify-center" : ""}`}>
              {counterId && (
                <IonItem>
                  <IonInput
                    className="form-ion-input"
                    maxlength={5}
                    label="Count"
                    labelPlacement="floating"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    onIonInput={(e) => {
                      const countFieldInputVal = (e.detail.value || "").trim();
                      // if (countFieldInputVal === "") return;
                      // if (/[^0-9]+/.test(countFieldInputVal)) return;
                      setInput((prev) => ({
                        ...prev,
                        count: countFieldInputVal,
                      }));
                    }}
                    value={input.count}
                  ></IonInput>
                </IonItem>
              )}
              <div>
                <IonItem>
                  <IonInput
                    className={`form-ion-input`}
                    fill="outline"
                    maxlength={5}
                    label="Target"
                    labelPlacement="floating"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    onIonInput={(e) => {
                      const targetFieldInputVal = (e.detail.value || "").trim();
                      setInput((prev) => ({
                        ...prev,
                        target: targetFieldInputVal,
                      }));
                      // if (targetFieldInputVal === "") return;
                      // if (/[^0-9]+/.test(targetFieldInputVal)) return;
                    }}
                    value={input.target}
                  />
                </IonItem>
                <p
                  className="block text-xs text-center"
                  style={{
                    color: "red",
                    visibility:
                      Number(input.target) < 1 && submitted
                        ? "visible"
                        : "hidden",
                  }}
                >
                  Target must be above 0
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center mt-2">
              <button
                form="form"
                className="block w-1/3"
                style={{ backgroundColor: activeColor }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  // closeFormCleanup();
                  setShowForm(false);
                }}
                className="block w-1/3"
                style={{ backgroundColor: "transparent" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </section>
    </IonModal>
  );
};

export default BottomSheetForm;
