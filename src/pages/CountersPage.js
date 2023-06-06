import { useState, useReducer } from "react";

import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";

import {
  MdOutlineClose,
  MdOutlineRestartAlt,
  MdModeEditOutline,
} from "react-icons/md";

import { RiEditBoxLine } from "react-icons/ri";

import PopUpBoxBlank from "../components/PopUpBoxBlank";
import PopUpBoxFilled from "../components/PopUpBoxFilled";
import FAB from "../components/FAB";

// ReactModal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function CountersPage({
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
  showAnimation,
}) {
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function handleOpenModal() {
    setIsOpen(true);
  }

  function handleCloseModal() {
    setIsOpen(false);
  }

  let nextColorIndex = 0;
  let nextColor;

  const [showPopUpBoxBlank, setShowPopUpBoxBlank] = useState(false);
  const [showPopUpBoxFilled, setShowPopUpBoxFilled] = useState(false);

  const [currentCounterName, setCurrentCounterName] = useState(0);
  const [currentCount, setcurrentCount] = useState(0);
  const [currentCounterTarget, setCounterTarget] = useState(0);
  const [currentCounterId, setcurrentCounterId] = useState(0);

  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  let border;

  function handleClick() {
    forceUpdate();
  }
  console.log(activeBackgroundColor);
  return (
    <>
      <button onClick={handleOpenModal}>Trigger Modal</button>
      <Modal
        // isOpen={showModal}
        contentLabel="onRequestClose Example"
        onRequestClose={handleCloseModal}
      >
        <p>Modal text!</p>
        <button onClick={handleCloseModal}>Close Modal</button>
      </Modal>
      <div className="counters-wrap">
        {localSavedCountersArray.map((counterItem) => {
          nextColor = materialColors[nextColorIndex];
          counterItem.color = nextColor;
          nextColorIndex == materialColors.length - 1
            ? (nextColorIndex = 0)
            : (nextColorIndex += 1);
          return (
            <div
              className="single-counter"
              style={{
                backgroundColor: nextColor,
              }}
              onClick={() => {
                invokeSetActiveCounter(counterItem.id);
              }}
            >
              <div className="single-counter-name-and-count-wrap">
                <div className="single-counter-counter-name">
                  {counterItem.counter}
                </div>
                <div>
                  {counterItem.count} / {counterItem.target}
                </div>
              </div>
              <div
                className="edit-btn-wrap"
                onClick={(e) => {
                  setCurrentCounterName(counterItem.counter);
                  setcurrentCount(counterItem.count);
                  setCounterTarget(counterItem.target);
                  setcurrentCounterId(counterItem.id);
                  setShowPopUpBoxFilled(true);
                }}
              >
                <RiEditBoxLine />
              </div>
            </div>
          );
        })}
      </div>
      <div className="table-wrap">
        <table className="counters-wrap">
          {localSavedCountersArray.map((counterItem) => {
            nextColor = materialColors[nextColorIndex];
            counterItem.color = nextColor;
            nextColorIndex == materialColors.length - 1
              ? (nextColorIndex = 0)
              : (nextColorIndex += 1);

            counterItem.isActive
              ? (border = { border: " 1px solid white" })
              : (border = { border: " 1px solid black" });

            return (
              <tbody>
                <tr
                  className={`counter-page-single-counter ${
                    counterItem.isActive ? "active" : "not-active"
                  }`}
                  key={counterItem.id}
                  style={{
                    backgroundColor: nextColor,
                  }}
                >
                  <td
                    colSpan="2"
                    className="counter"
                    onClick={() => {
                      invokeSetActiveCounter(counterItem.id);
                    }}
                  >
                    <span
                      className="counter-name-td"
                      style={{ border: "none", textAlign: "center" }}
                    >
                      {counterItem.counter}
                    </span>
                  </td>
                  <td
                    style={{ textAlign: "center" }}
                    onClick={() => {
                      invokeSetActiveCounter(counterItem.id);
                    }}
                  >
                    {counterItem.count} / {counterItem.target}
                  </td>

                  <td
                    style={{ textAlign: "center" }}
                    onClick={(e) => {
                      setCurrentCounterName(counterItem.counter);
                      setcurrentCount(counterItem.count);
                      setCounterTarget(counterItem.target);
                      setcurrentCounterId(counterItem.id);
                      setShowPopUpBoxFilled(true);
                    }}
                  >
                    <MdModeEditOutline />
                  </td>
                  <td
                    style={{ textAlign: "center" }}
                    onClick={() => {
                      resetSingleCounter(counterItem.id);
                      if (counterItem.isActive) {
                        invokeSetActiveCounter(counterItem.id);
                      }
                      handleClick();
                    }}
                  >
                    <MdOutlineRestartAlt />
                  </td>
                  <td
                    onClick={() => {
                      deleteSingleCounter(counterItem.id);
                    }}
                    style={{ textAlign: "center" }}
                  >
                    <MdOutlineClose />
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>

      <div>
        {showPopUpBoxBlank ? (
          <PopUpBoxBlank
            nextColor={nextColor}
            setShowPopUpBoxBlank={setShowPopUpBoxBlank}
            setLocalSavedCountersArray={setLocalSavedCountersArray}
            localSavedCountersArray={localSavedCountersArray}
            addCounter={addCounter}
          />
        ) : null}
      </div>
      <div>
        {showPopUpBoxFilled ? (
          <PopUpBoxFilled
            modifyTheCountersArray={modifyTheCountersArray}
            currentCounterName={currentCounterName}
            currentCount={currentCount}
            currentCounterTarget={currentCounterTarget}
            currentCounterId={currentCounterId}
            setShowPopUpBoxFilled={setShowPopUpBoxFilled}
            setLocalSavedCountersArray={setLocalSavedCountersArray}
            localSavedCountersArray={localSavedCountersArray}
            addCounter={addCounter}
          />
        ) : null}
      </div>
      <FAB
        setShowPopUpBoxBlank={setShowPopUpBoxBlank}
        resetAllCounters={resetAllCounters}
        localSavedCountersArray={localSavedCountersArray}
      />
    </>
  );
}

export default CountersPage;
