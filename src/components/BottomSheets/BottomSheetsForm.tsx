import React, { useState, useRef, useEffect } from "react";
import { Sheet } from "react-modal-sheet";
import { MdDeleteOutline } from "react-icons/md";
import { showConfirmDialog, showToast } from "../../utils/constants";
import { counterObjType } from "../../utils/types";
import { tween_config } from "../../utils/constants";

interface BottomSheetFormProps {
  countersArr: counterObjType[];
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
  countersArr,
  editingCounterId,
  deleteSingleCounter,
  activeCounter,
  isEditingCounter,
  addCounter,
  modifyCounter,
  setShowForm,
  showForm,
}: BottomSheetFormProps) => {
  const counterNameField = useRef<HTMLTextAreaElement | null>(null);
  const counterCountField = useRef<HTMLInputElement | null>(null);
  const counterTargetField = useRef(null);
  const showNameAlert = useRef<HTMLDivElement>(null);
  const showTargetAlert = useRef<HTMLDivElement>(null);
  const showCountAlert = useRef<HTMLDivElement | null>(null);

  const [nameInputValue, setNameInputValue] = useState<string>("");
  const [countInputValue, setCountInputValue] = useState<number>(0);
  const [targetInputValue, setTargetInputValue] = useState<number>(0);

  useEffect(() => {
    const clickedCounter = countersArr.find(
      (counter: counterObjType) => counter.id === editingCounterId
    );

    if (!clickedCounter) {
      console.log("clickedCounter does not exist");
      return;
    }

    setNameInputValue(isEditingCounter ? clickedCounter.counter : "");
    setCountInputValue(isEditingCounter ? clickedCounter.count : 0);
    setTargetInputValue(isEditingCounter ? clickedCounter.target : 0);
  }, [showForm]);

  const increaseTextAreaHeight = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
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
      console.log("counterNameField.current does not exist");
    }
  }, []);

  const submitCounter = (
    e: React.FormEvent<HTMLFormElement>,
    action: "add" | "modify"
  ): void => {
    e.preventDefault();

    action === "add"
      ? addCounter(nameInputValue, Number(targetInputValue))
      : modifyCounter(
          editingCounterId,
          nameInputValue,
          countInputValue,
          targetInputValue
        );
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
          {/* <Sheet.Scroller> */}{" "}
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
                {isEditingCounter ? "Edit Tasbeeh" : "Add Tasbeeh"}
              </h1>
              <button
                onClick={() => {
                  setShowForm(false);
                }}
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
                  submitCounter(e, isEditingCounter ? "modify" : "add");
                }}
              >
                <div className="form-filled-counter-name-input-wrap">
                  <p>Dhikr Name</p>
                  <textarea
                    dir="auto"
                    ref={counterNameField}
                    className="form-textarea"
                    onChange={(e) => {
                      setNameInputValue(e.target.value);
                      increaseTextAreaHeight(e);
                    }}
                    value={nameInputValue}
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
                  {isEditingCounter && (
                    <div className="current-count-input-wrap">
                      <p>Count</p>
                      <input
                        ref={counterCountField}
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

                        setTargetInputValue(Number(e.target.value));
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
          </div>
          {/* </Sheet.Scroller> */}
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
