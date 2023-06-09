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

import { RiEditBoxLine } from "react-icons/ri";

import PopUpBoxBlank from "../components/PopUpBoxBlank";
import PopUpBoxFilled from "../components/PopUpBoxFilled";
import FAB from "../components/FAB";

// ReactModal.setAppElement("#root");

// Override default Modal styles
Modal.defaultStyles.content.border = "none";
Modal.defaultStyles.content.position = "absolute";
// Modal.defaultStyles.content.inset = "15% 50% 50% 50%";
Modal.defaultStyles.content.inset = "15% 50% 50% 10%";
Modal.defaultStyles.content.background = "#f4f4f4";
Modal.defaultStyles.content.overflow = "none";
Modal.defaultStyles.content.borderRadius = "20px";
Modal.defaultStyles.content.padding = "0";
Modal.defaultStyles.content.height = "45%";
Modal.defaultStyles.content.zIndex = "10000";

Modal.defaultStyles.content.marginInline = "auto";
Modal.defaultStyles.content.width = "80%";

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

  function handleClick() {
    forceUpdate();
  }
  console.log(activeBackgroundColor);
  return (
    <div className="counters-page-wrap">
      <div className="counters-page-header">
        {/* <div></div> */}
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
                <div className="single-counter-count">
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
                  // setShowPopUpBoxFilled(true);
                  handleOpenModal();
                }}
              >
                <MdModeEditOutline />
              </div>
            </div>
          );
        })}
      </div>
      <div className="table-wrap"></div>

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
        handleOpenModal2={handleOpenModal2}
        setShowPopUpBoxBlank={setShowPopUpBoxBlank}
        resetAllCounters={resetAllCounters}
        localSavedCountersArray={localSavedCountersArray}
      />
    </div>
  );
}

export default CountersPage;
