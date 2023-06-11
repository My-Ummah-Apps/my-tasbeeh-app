import { useState, useReducer } from "react";

import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";

import {
  MdOutlineClose,
  MdOutlineRestartAlt,
  MdModeEditOutline,
  MdAdd,
} from "react-icons/md";

import PopUpBoxBlank from "../components/PopUpBoxBlank";
import PopUpBoxFilled from "../components/PopUpBoxFilled";

// ReactModal.setAppElement("#root");

// Override default Modal styles
Modal.defaultStyles.content.border = "none";
Modal.defaultStyles.content.position = "absolute";
Modal.defaultStyles.content.inset = "50% 0% 0% 50%";
// Modal.defaultStyles.content.inset = "10% 50% 50% 10%";
// Modal.defaultStyles.content.top = "50%";
// Modal.defaultStyles.content.left = "50%";
Modal.defaultStyles.content.transform = "translate(-50%, -50%)";

Modal.defaultStyles.content.background = "#f4f4f4";
Modal.defaultStyles.content.overflow = "none";
Modal.defaultStyles.content.borderRadius = "20px";
Modal.defaultStyles.content.padding = "0";
Modal.defaultStyles.content.height = "fit-content";
Modal.defaultStyles.content.zIndex = "10000";

// Modal.defaultStyles.content.marginInline = "auto";
Modal.defaultStyles.content.width = "80%";
// Modal.defaultStyles.content.height = "auto";

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
  const [modal, setModal] = useState("");
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleOpenModal2 = () => {
    setShowModal2(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseModal2 = () => {
    setShowModal2(false);
  };

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
  let counterId;

  function handleClick() {
    forceUpdate();
  }
  console.log(activeBackgroundColor);
  return (
    <div className="counters-page-wrap">
      <div className="counters-page-header">
        <p>Counters</p>
        <MdAdd onClick={handleOpenModal2} />
      </div>
      <Modal
        closeTimeoutMS={1000}
        modal={modal}
        isOpen={showModal}
        onRequestClose={handleCloseModal}
      >
        <PopUpBoxFilled
          handleCloseModal={handleCloseModal}
          modifyTheCountersArray={modifyTheCountersArray}
          currentCounterName={currentCounterName}
          currentCount={currentCount}
          currentCounterTarget={currentCounterTarget}
          currentCounterId={currentCounterId}
          setShowPopUpBoxFilled={setShowPopUpBoxFilled}
          setLocalSavedCountersArray={setLocalSavedCountersArray}
          localSavedCountersArray={localSavedCountersArray}
          addCounter={addCounter}
          resetSingleCounter={resetSingleCounter}
          deleteSingleCounter={deleteSingleCounter}
          setcurrentCount={setcurrentCount}
        />
      </Modal>
      <Modal
        // handleCloseModal={handleCloseModal2}
        modal={modal}
        isOpen={showModal2}
        onRequestClose={handleCloseModal2}
        closeTimeoutMS={1000}
        contentLabel="Modal #2 Global Style Override Example"
      >
        <PopUpBoxBlank
          nextColor={nextColor}
          handleCloseModal2={handleCloseModal2}
          // setShowPopUpBoxBlank={setShowPopUpBoxBlank}
          setLocalSavedCountersArray={setLocalSavedCountersArray}
          localSavedCountersArray={localSavedCountersArray}
          addCounter={addCounter}
        />
      </Modal>
      <div className="counters-wrap">
        {localSavedCountersArray.map((counterItem) => {
          nextColor = materialColors[nextColorIndex];
          counterItem.color = nextColor;
          // counterItem.width = "50%";

          nextColorIndex == materialColors.length - 1
            ? (nextColorIndex = 0)
            : (nextColorIndex += 1);
          return (
            <>
              <div
                className="single-counter"
                style={{
                  //  This style is to do with turning each counter into a progress bar
                  // backgroundColor: nextColor + 50,
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
                  <div className="single-counter-count">
                    {counterItem.count} / {counterItem.target}
                  </div>
                </div>
                <div
                  className="edit-btn-wrap"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentCounterName(counterItem.counter);
                    setcurrentCount(counterItem.count);
                    setCounterTarget(counterItem.target);
                    setcurrentCounterId(counterItem.id);
                    handleOpenModal();
                  }}
                >
                  <MdModeEditOutline />
                </div>
                {/* This style is to do with turning each counter into a progress bar */}
                {/* <div
                  className="single-counter-overlay"
                  style={{
                    backgroundColor: nextColor,
                    width: (counterItem.count / counterItem.target) * 100 + "%",
                  }}
                ></div> */}
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}

export default CountersPage;
