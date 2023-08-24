import { useState, useReducer } from "react";
import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";

import { MdModeEditOutline, MdAdd } from "react-icons/md";

import FormBlank from "../components/FormBlank";
import FormFilled from "../components/FormFilled";
import Counter from "../components/Counter";

// Override default Modal styles
Modal.defaultStyles.content.border = "none";
Modal.defaultStyles.content.position = "absolute";
Modal.defaultStyles.content.inset = "50% 0% 0% 50%";
// Modal.defaultStyles.content.inset = "25% 0% 0% 50% !important";
Modal.defaultStyles.content.transform = "translate(-50%, -50%)";
Modal.defaultStyles.content.overflow = "none";
Modal.defaultStyles.content.borderRadius = "20px";
Modal.defaultStyles.content.padding = "0";
// Modal.defaultStyles.content.height = "auto !important";
// Modal.defaultStyles.content.height = "unset !important";
Modal.defaultStyles.content.zIndex = "10000";
Modal.defaultStyles.content.width = "85%";

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
  modalStyles,
  modalBgColor,
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

  let subtitle;

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
  //  ${showAnimation ? "fade-down-animation" : null}
  Modal.setAppElement("#root");
  return (
    <div className={`counters-page-wrap`}>
      <div className="counters-page-header">
        <p>Adhkar</p>
        <MdAdd onClick={handleOpenModal2} />
      </div>

      <Modal
        style={modalStyles}
        class="modal-custom-properties"
        closeTimeoutMS={250}
        isOpen={showModal}
        onRequestClose={handleCloseModal}
      >
        <FormFilled
          activeBackgroundColor={activeBackgroundColor}
          handleCloseModal={handleCloseModal}
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
      </Modal>
      <Modal
        style={modalStyles}
        isOpen={showModal2}
        onRequestClose={handleCloseModal2}
        closeTimeoutMS={250}
        contentLabel="Modal #2 Global Style Override Example"
      >
        <FormBlank
          activeBackgroundColor={activeBackgroundColor}
          nextColor={nextColor}
          handleCloseModal2={handleCloseModal2}
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
            <Counter
              setActivePage={setActivePage}
              key={counterItem.id}
              nextColor={nextColor}
              invokeSetActiveCounter={invokeSetActiveCounter}
              counterItem={counterItem}
              setCurrentCounterName={setCurrentCounterName}
              setcurrentCount={setcurrentCount}
              setCounterTarget={setCounterTarget}
              setcurrentCounterId={setcurrentCounterId}
              handleOpenModal={handleOpenModal}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CountersPage;
