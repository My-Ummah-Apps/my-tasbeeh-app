import React, { useState, useRef, useEffect } from "react";
import { Sheet } from "react-modal-sheet";
import { MdDeleteOutline } from "react-icons/md";
import { showConfirmDialog, showToast } from "../../utils/constants";
import { counterObjType, MaterialColor } from "../../utils/types";
import { tween_config } from "../../utils/constants";

interface BottomSheetFormProps {
  activeColor: MaterialColor;
  countersArr: counterObjType[];
  setIsEditingCounter: (value: React.SetStateAction<boolean>) => void;
  setEditingCounterId: React.Dispatch<React.SetStateAction<string>>;
  editingCounterId: string;
  deleteSingleCounter: (id: string) => void;
  activeCounter: counterObjType;
  isEditingCounter: boolean;
  addCounter: (counterToAdd: string, target: number) => void;
  modifyCounter: (
    id: string,
    modifiedCounterName: string,
    modifiedCount: number,
    modifiedTarget: number
  ) => void;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  showForm: boolean;
}

const BottomSheetForm = ({
  activeColor,
  countersArr,
  setIsEditingCounter,
  setEditingCounterId,
  editingCounterId,
  deleteSingleCounter,
  isEditingCounter,
  addCounter,
  modifyCounter,
  setShowForm,
  showForm,
}: BottomSheetFormProps) => {
  const counterNameField = useRef<HTMLTextAreaElement | null>(null);

  const [nameInputValue, setNameInputValue] = useState<string>("");
  const [countInputValue, setCountInputValue] = useState<number>(0);
  const [targetInputValue, setTargetInputValue] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const clickedCounter = countersArr.find(
      (counter) => counter.id === editingCounterId
    );
    console.log("clickedCounter is: ", clickedCounter);

    if (!clickedCounter) {
      console.log("clickedCounter does not exist");
      return;
    }

    setNameInputValue(isEditingCounter ? clickedCounter.counter : "");
    setCountInputValue(isEditingCounter ? clickedCounter.count : 0);
    setTargetInputValue(isEditingCounter ? clickedCounter.target : 0);

    return () => {
      setSubmitted(false);
      setNameInputValue("");
      setCountInputValue(0);
      setTargetInputValue(0);
      setIsEditingCounter(false);
      setEditingCounterId("");
    };
  }, [showForm]);

  const increaseTextAreaHeight = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (counterNameField.current) {
      counterNameField.current.style.height = `${e.target.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (counterNameField.current) {
      counterNameField.current.style.height = "1px";
      counterNameField.current.style.height = `${
        counterNameField.current.scrollHeight + 0.5
      }px`;
    }
  }, []);

  const submitCounter = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSubmitted(true);

    if (
      nameInputValue.trim() === "" ||
      countInputValue < 0 ||
      targetInputValue < 1
    ) {
      return;
    }

    isEditingCounter
      ? modifyCounter(
          editingCounterId,
          nameInputValue,
          countInputValue,
          targetInputValue
        )
      : addCounter(nameInputValue, Number(targetInputValue));

    setShowForm(false);
  };

  return (
    <Sheet
      style={{ willChange: "transform" }}
      disableDrag={false}
      isOpen={showForm}
      onClose={() => {
        setShowForm(false);
      }}
      detent="full-height"
      tweenConfig={tween_config}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <section className="form-wrap form-blank">
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
                {isEditingCounter ? "Edit Tasbeeh" : "Add Tasbeeh"}
              </h1>
              <button
                form="form"
                className="form-filled-save-btn"
                style={{ backgroundColor: activeColor }}
              >
                Save
              </button>
            </div>

            <div className="form-wrap form-filled">
              <form id="form" onSubmit={submitCounter}>
                <div className="form-filled-counter-name-input-wrap">
                  <p>Dhikr Name</p>
                  <textarea
                    ref={counterNameField}
                    dir="auto"
                    className="form-textarea"
                    onChange={(e) => {
                      setNameInputValue(e.target.value);
                      increaseTextAreaHeight(e);
                    }}
                    value={nameInputValue}
                    required
                  />
                  <p
                    style={{
                      color: "red",
                      visibility:
                        nameInputValue.trim() === "" && submitted
                          ? "visible"
                          : "hidden",
                    }}
                  >
                    Please enter a name
                  </p>
                </div>
                <div className="count-and-target-input-wrap">
                  {isEditingCounter && (
                    <div className="current-count-input-wrap">
                      <p>Count</p>
                      <input
                        className="form-input"
                        maxLength={5}
                        onChange={(e) => {
                          if (/[^0-9]+/.test(e.target.value)) return;
                          setCountInputValue(Number(e.target.value));
                        }}
                        value={countInputValue}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                      />
                      <p
                        style={{
                          color: "red",
                          visibility:
                            !countInputValue && submitted
                              ? "visible"
                              : "hidden",
                        }}
                      >
                        Target must be above 0
                      </p>
                    </div>
                  )}

                  <div className="target-input-wrap">
                    <p>Target</p>
                    <input
                      onChange={(e) => {
                        if (/[^0-9]+/.test(e.target.value)) return;

                        setTargetInputValue(Number(e.target.value));
                      }}
                      className="form-input"
                      maxLength={5}
                      value={targetInputValue}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                    />
                    <p
                      style={{
                        color: "red",
                        visibility:
                          targetInputValue < 1 && submitted
                            ? "visible"
                            : "hidden",
                      }}
                    >
                      Target must be above 0
                    </p>
                  </div>
                </div>
              </form>
            </div>
            {isEditingCounter && (
              <div className="form-filled-reset-delete-btns-wrap">
                <button
                  className="form-filled-delete-tasbeeh-btn"
                  onClick={async () => {
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
          </section>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        onTap={() => {
          setShowForm(false);
        }}
      />
    </Sheet>
  );
};

export default BottomSheetForm;
