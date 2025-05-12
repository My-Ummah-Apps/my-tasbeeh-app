import { useState, useRef, useEffect } from "react";
import { Sheet } from "react-modal-sheet";
import { MdAdd } from "react-icons/md";
import Counter from "../components/Counter";
import { materialColors, TWEEN_CONFIG } from "../utils/constants";
import Form from "../components/Form";

function CountersPage({
  setActiveCounter,
  activeCounter,
  resetSingleCounter,
  countersArr,
  invokeSetActiveCounter,
  modifyCounter,
  addCounter,
  deleteSingleCounter,
  setActivePage,
}) {
  function singleCounterStyles(count, target) {
    return count > 0 ? (count / target) * 100 + "%" : "100%";
  }
  const formFilledRef = useRef(null);
  if (Capacitor.getPlatform() === "ios") {
    // Keyboard.setAccessoryBarVisible({ isVisible: true });
    window.addEventListener("keyboardWillShow", (e) => {
      if (formFilledRef.current) {
        formFilledRef.current.style.marginBottom = e.keyboardHeight + "px";
      }
    });
    window.addEventListener("keyboardWillHide", (e) => {
      if (formFilledRef.current) {
        formFilledRef.current.style.marginBottom = "0px";
      }
    });
  }

  const [showForm, setShowForm] = useState(false);
  const [addNewCounter, setAddNewCounter] = useState(false);

  let nextColorIndex = 0;
  let nextColor;

  const [currentCounterName, setCurrentCounterName] = useState(0);
  const [currentCount, setcurrentCount] = useState(0);
  const [currentCounterTarget, setCounterTarget] = useState(0);
  const [editingCounterId, setEditingCounterId] = useState(0);

  useEffect(() => {
    console.log("currentCounterId: ", editingCounterId);
  }, [editingCounterId]);

  return (
    <div className={`counters-page-wrap`}>
      <div className="counters-page-header">
        <p>Adhkar</p>
        <MdAdd
          onClick={() => {
            setAddNewCounter(true);
            setShowForm(true);
          }}
        />
      </div>

      <Sheet
        style={{ willChange: "transform" }}
        disableDrag={false}
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        detent="full-height"
        tweenConfig={TWEEN_CONFIG}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            {/* <Sheet.Scroller> */}{" "}
            <Form
              activeCounter={activeCounter}
              addNewCounter={addNewCounter}
              editingCounterId={editingCounterId}
              setShowForm={setShowForm}
              modifyCounter={modifyCounter}
              activeCounter={activeCounter}
              currentCounterName={currentCounterName}
              currentCount={currentCount}
              currentCounterTarget={currentCounterTarget}
              currentCounterId={editingCounterId}
              // setLocalSavedCountersArray={setLocalSavedCountersArray}
              countersArr={countersArr}
              addCounter={addCounter}
              resetSingleCounter={resetSingleCounter}
              deleteSingleCounter={deleteSingleCounter}
              setcurrentCount={setcurrentCount}
            />
            {/* </Sheet.Scroller> */}
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setShowForm(false)} />
      </Sheet>

      <div className="counters-wrap">
        {countersArr.map((counterItem) => {
          nextColor = materialColors[nextColorIndex];
          counterItem.color = nextColor;
          nextColorIndex == materialColors.length - 1
            ? (nextColorIndex = 0)
            : (nextColorIndex += 1);
          return (
            <Counter
              key={counterItem.id}
              setEditingCounterId={setEditingCounterId}
              setActivePage={setActivePage}
              setAddNewCounter={setAddNewCounter}
              setActiveCounter={setActiveCounter}
              setShowForm={setShowForm}
              nextColor={nextColor}
              invokeSetActiveCounter={invokeSetActiveCounter}
              counterItem={counterItem}
              setCurrentCounterName={setCurrentCounterName}
              setcurrentCount={setcurrentCount}
              setCounterTarget={setCounterTarget}
              setcurrentCounterId={setEditingCounterId}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CountersPage;
