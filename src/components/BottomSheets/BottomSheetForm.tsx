import React, { useState, useRef, useEffect } from "react";
import { Sheet } from "react-modal-sheet";
import { MdDeleteOutline } from "react-icons/md";
import { showConfirmDialog, showToast } from "../../utils/constants";
import { counterObjType, MaterialColor } from "../../utils/types";
import { tween_config } from "../../utils/constants";

interface BottomSheetFormProps {
  activeColor: MaterialColor;
  countersArr: counterObjType[];
  editingCounterId: string | null;
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
  countersArr,
  editingCounterId,
  deleteSingleCounter,
  addCounter,
  modifyCounter,
  setShowForm,
  showForm,
}: BottomSheetFormProps) => {
  const counterNameField = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState({
    name: "",
    count: 0,
    target: 0,
  });

  // useEffect(() => {
  //   console.log("input: ", input);
  // }, [input]);

  const [submitted, setSubmitted] = useState(false);

  const clickedCounter = countersArr.find(
    (counter) => counter.id === editingCounterId
  );
  console.log("clickedCounter is: ", clickedCounter);

  const isEditingCounter = clickedCounter !== undefined;
  console.log("Is editing? ", isEditingCounter);

  useEffect(() => {
    if (!clickedCounter) {
      console.log("clickedCounter does not exist");
      return;
    }

    setInput({
      name: isEditingCounter ? clickedCounter.counter : "",
      count: isEditingCounter ? clickedCounter.count : 0,
      target: isEditingCounter ? clickedCounter.target : 0,
    });

    // return () => {
    //   setSubmitted(false);
    //   setInput({
    //     name: "",
    //     count: 0,
    //     target: 0,
    //   });
    //   setIsEditingCounter(false);
    //   setEditingCounterId("");
    // };
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

    if (input.name.trim() === "" || input.count < 0 || input.target < 1) {
      return;
    }

    isEditingCounter
      ? modifyCounter(editingCounterId, input.name, input.count, input.target)
      : addCounter(input.name, Number(input.target));

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
                  {isEditingCounter && (
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
                      <p
                        style={{
                          color: "red",
                          visibility:
                            !input.count && submitted ? "visible" : "hidden",
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
