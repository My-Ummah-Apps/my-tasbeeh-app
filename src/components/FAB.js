import { Fab, Action } from "react-tiny-fab";
import "react-tiny-fab/dist/styles.css";
import { MdOutlineMenuOpen, MdAdd, MdOutlineRefresh } from "react-icons/md";

const FAB = ({ setShowPopUpBoxBlank, resetAllCounters }) => {
  return (
    <Fab
      style={{
        bottom: 60,
        right: 15,
        transform: "rotate(-90deg)",
      }}
      mainButtonStyles={{
        backgroundColor: "#dbdddf",
        color: "black",
        transform: "rotate(0deg)",
        fontSize: "1.5rem",
        boxShadow:
          "0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)",
      }}
      icon={<MdAdd />}
    >
      // The Action components are the "buttons" that appear when the Fab is
      open. You can use the out-of-the-box Action // component or you can use a
      custom component of any type and style it any way that you'd like. The
      "text" prop // is the popup label that appears when the Action component
      is hovered.
      <Action
        text="Add"
        onClick={() => {
          setShowPopUpBoxBlank(true);
        }}
      >
        {" "}
        <MdAdd />{" "}
      </Action>
      <Action text="Refresh All" onClick={resetAllCounters}>
        <MdOutlineRefresh />{" "}
      </Action>
      // Using a custom component for this one. See another example in
      "example/src/index.js"
      <div text="Foobar!">
        <i className="fa fa-foo-bar-fa-foo" />
      </div>
    </Fab>
  );
};

export default FAB;
