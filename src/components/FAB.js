import { Fab, Action } from "react-tiny-fab";
import "react-tiny-fab/dist/styles.css";
import { MdOutlineMenuOpen, MdAdd, MdOutlineRefresh } from "react-icons/md";

const FAB = ({
  setShowPopUpBoxBlank,
  resetAllCounters,
  localSavedCountersArray,
  handleOpenModal,
}) => {
  //   const grabColor = localSavedCountersArray.find((counterItem) =>
  //     counterItem.isActive == true ? counterItem.color : null
  //   );
  const fabColor = "rgb(239, 83, 80)";
  //   console.log(grabColor.color);

  return (
    <Fab
      style={{
        position: "absolute",
        // bottom: 13 + "%",
        // right: 5 + "%",
        transform: "rotate(-90deg)",
      }}
      mainButtonStyles={{
        height: "70px",
        width: "70px",
        backgroundColor: fabColor,
        color: "white",
        transform: "rotate(0deg)",
        fontSize: "1.5rem",
        boxShadow:
          "0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)",
      }}
      actionButtonStyles={{}}
      icon={<MdAdd />}
    >
      // The Action components are the "buttons" that appear when the Fab is
      open. You can use the out-of-the-box Action // component or you can use a
      custom component of any type and style it any way that you'd like. The
      "text" prop // is the popup label that appears when the Action component
      is hovered.
      <Action
        text="Add Dhikr"
        onClick={() => {
          handleOpenModal();
        }}
      >
        {" "}
        <MdAdd />{" "}
      </Action>
      <Action text="Reset All" onClick={resetAllCounters}>
        <MdOutlineRefresh />{" "}
      </Action>
    </Fab>
  );
};

export default FAB;
