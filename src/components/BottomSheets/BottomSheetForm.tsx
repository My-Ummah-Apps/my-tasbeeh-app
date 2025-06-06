import React, { useState, useRef, useEffect } from "react";
import { Sheet } from "react-modal-sheet";
import { MdDeleteOutline } from "react-icons/md";
import { showConfirmDialog, showToast } from "../../utils/constants";
import { counterObjType, MaterialColor } from "../../utils/types";
import { tween_config } from "../../utils/constants";

interface BottomSheetFormProps {
  activeColor: MaterialColor;
  countersState: counterObjType[];
  setCounterId: React.Dispatch<React.SetStateAction<string | null>>;
  counterId: string | null;
  deleteSingleCounter: (id: string) => void;
  activeCounter: counterObjType;
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
  countersState,
  setCounterId,
  counterId,
  deleteSingleCounter,
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
      name: isEditingCounter ? clickedCounter.counterName : "",
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

    if (input.name.trim() === "" || input.count < 0 || input.target < 1) {
      return;
    }

    counterId
      ? await modifyCounter(counterId, input.name, input.count, input.target)
      : await addCounter(input.name, Number(input.target));

    closeFormCleanup();
  };

  return (
    <Sheet
      style={{ willChange: "transform" }}
      disableDrag={false}
      isOpen={showForm}
      onClose={() => {
        closeFormCleanup();
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
                  closeFormCleanup();
                }}
                className="form-filled-cancel-btn"
                style={{ backgroundColor: "transparent" }}
              >
                Cancel
              </button>
              <h1 className="form-blank-and-form-filled-header-text">
                {counterId ? "Edit Tasbeeh" : "Add Tasbeeh"}
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
                <div className="count-and-target-input-wrap">
                  {counterId && (
                    <div className="current-count-input-wrap">
                      <p>Count</p>
                      <input
                        className="form-input"
                        maxLength={5}
                        onChange={(e) => {
                          if (/[^0-9]+/.test(e.target.value)) return;

                          setInput((prev) => ({
                            ...prev,
                            count: Number(e.target.value),
                          }));
                        }}
                        value={input.count}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                      />
                      {/* <p
                        style={{
                          color: "red",
                          visibility:
                            !input.count && submitted ? "visible" : "hidden",
                        }}
                      >
                        Target must be above 0
                      </p> */}
                    </div>
                  )}

                  <div className="target-input-wrap">
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
                  </div>
                </div>
              </form>
            </div>
            {counterId && (
              <div className="form-filled-reset-delete-btns-wrap">
                <button
                  className="form-filled-delete-tasbeeh-btn"
                  onClick={async () => {
                    const result = await showConfirmDialog(
                      "Delete Tasbeeh",
                      "Are you sure you want to delete this Tasbeeh?"
                    );
                    if (result) {
                      deleteSingleCounter(counterId);
                      closeFormCleanup();
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
          closeFormCleanup();
        }}
      />
    </Sheet>
  );
};

export default BottomSheetForm;
