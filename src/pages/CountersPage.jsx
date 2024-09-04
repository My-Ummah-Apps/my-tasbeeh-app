import { useState, useReducer } from "react";
import React from "react";
import ReactDOM from "react-dom";
import { Sheet } from "react-modal-sheet";

import { MdModeEditOutline, MdAdd } from "react-icons/md";

import FormBlank from "../components/FormBlank";
import FormFilled from "../components/FormFilled";
import Counter from "../components/Counter";

function CountersPage({
  modalStyles,
  activeBackgroundColor,
  resetSingleCounter,
  invokeSetActiveCounter,
  modifyTheCountersArray,
  setLocalSavedCountersArray,
  localSavedCountersArray,
  addCounter,
  resetAllCounters,
  deleteSingleCounter,
  materialColors,
  setActivePage,
}) {
  function singleCounterStyles(count, target) {
    return count > 0 ? (count / target) * 100 + "%" : "100%";
  }

  const [isFormBlankSheetOpen, setIsFormBlankSheetOpen] = useState(false);
  const [isFormFilledSheetOpen, setIsFormFilledSheetOpen] = useState(false);

  let nextColorIndex = 0;
  let nextColor;

  const [currentCounterName, setCurrentCounterName] = useState(0);
  const [currentCount, setcurrentCount] = useState(0);
  const [currentCounterTarget, setCounterTarget] = useState(0);
  const [currentCounterId, setcurrentCounterId] = useState(0);

  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
  //  ${showAnimation ? "fade-down-animation" : null}

  return (
    <div className={`counters-page-wrap`}>
      <div className="counters-page-header">
        <p>Adhkar</p>
        <MdAdd
          onClick={() => {
            setIsFormBlankSheetOpen(true);
          }}
        />
      </div>

      <Sheet
        isOpen={isFormFilledSheetOpen}
        onClose={() => setIsFormFilledSheetOpen(false)}
        detent="full-height"
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            {" "}
            <FormFilled
              setIsFormFilledSheetOpen={setIsFormFilledSheetOpen}
              activeBackgroundColor={activeBackgroundColor}
              modifyTheCountersArray={modifyTheCountersArray}
              currentCounterName={currentCounterName}
              currentCount={currentCount}
              currentCounterTarget={currentCounterTarget}
              currentCounterId={currentCounterId}
              setLocalSavedCountersArray={setLocalSavedCountersArray}
              localSavedCountersArray={localSavedCountersArray}
              addCounter={addCounter}
              resetSingleCounter={resetSingleCounter}
              deleteSingleCounter={deleteSingleCounter}
              setcurrentCount={setcurrentCount}
            />
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setIsFormFilledSheetOpen(false)} />
      </Sheet>

      <Sheet
        isOpen={isFormBlankSheetOpen}
        onClose={() => setIsFormBlankSheetOpen(false)}
        detent="full-height"
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            {" "}
            <FormBlank
              activeBackgroundColor={activeBackgroundColor}
              nextColor={nextColor}
              setIsFormBlankSheetOpen={setIsFormBlankSheetOpen}
              setLocalSavedCountersArray={setLocalSavedCountersArray}
              localSavedCountersArray={localSavedCountersArray}
              addCounter={addCounter}
            />
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop
          // style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          onTap={() => setIsFormBlankSheetOpen(false)}
        />
      </Sheet>

      <div className="counters-wrap">
        {localSavedCountersArray.map((counterItem) => {
          nextColor = materialColors[nextColorIndex];
          counterItem.color = nextColor;
          nextColorIndex == materialColors.length - 1
            ? (nextColorIndex = 0)
            : (nextColorIndex += 1);
          return (
            <Counter
              setActivePage={setActivePage}
              key={counterItem.id}
              setIsFormFilledSheetOpen={setIsFormFilledSheetOpen}
              nextColor={nextColor}
              invokeSetActiveCounter={invokeSetActiveCounter}
              counterItem={counterItem}
              setCurrentCounterName={setCurrentCounterName}
              setcurrentCount={setcurrentCount}
              setCounterTarget={setCounterTarget}
              setcurrentCounterId={setcurrentCounterId}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CountersPage;
