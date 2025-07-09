import React, { useState, useRef, useEffect } from "react";
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

  const closeFormCleanup = () => {
    setShowForm(false);
    // setTimeout(() => {
    setInput({ name: "", count: 0, target: 0 });
    // }, 500);
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
      onWillDismiss={() => {
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
            <IonItem>
              <IonTextarea
                style={{
                  "--border-color": activeColor,
                  "--highlight-color-focused": activeColor,
                }}
                className="bg-stone-900 mb-5"
                label="Tasbeeh Name"
                labelPlacement="floating"
                dir="auto"
                autoGrow={true}
                onIonInput={(e) => {
                  const textAreaInputVal = e.detail.value ? e.detail.value : "";
                  setInput((prev) => ({ ...prev, name: textAreaInputVal }));
                }}
                value={input.name}
                required
              ></IonTextarea>
            </IonItem>
            {/* <p
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
            </div>  */}

            <div className="flex">
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
                      const countFieldInputVal = e.detail.value || "";
                      if (countFieldInputVal === "") return;
                      if (/[^0-9]+/.test(countFieldInputVal)) return;
                      setInput((prev) => ({
                        ...prev,
                        count: Number(countFieldInputVal),
                      }));
                    }}
                    value={String(input.count)}
                  ></IonInput>
                </IonItem>
              )}
              <div>
                <IonItem>
                  <IonInput
                    className="form-ion-input"
                    fill="outline"
                    maxlength={5}
                    label="Target"
                    labelPlacement="floating"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    errorText="Target must be above 0"
                    required
                    onIonInput={(e) => {
                      const targetFieldInputVal = (e.detail.value || "").trim();
                      if (targetFieldInputVal === "") return;
                      if (/[^0-9]+/.test(targetFieldInputVal)) return;
                      setInput((prev) => ({
                        ...prev,
                        target: Number(targetFieldInputVal),
                      }));
                    }}
                    value={String(input.target)}
                  />
                </IonItem>
                <p
                  className="block"
                  style={{
                    color: "red",
                    visibility: input.target < 1 ? "visible" : "hidden",
                  }}
                >
                  Target must be above 0
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center mt-10">
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
                  setShowForm(false);
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
