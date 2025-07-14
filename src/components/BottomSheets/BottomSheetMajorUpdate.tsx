import { GoRocket } from "react-icons/go";
import { GoZap } from "react-icons/go";
import { MdOutlinePalette } from "react-icons/md";

interface BottomSheetMajorUpdateProps {
  setShowMajorUpdateBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

const BottomSheetMajorUpdate = ({
  setShowMajorUpdateBottomSheet,
}: BottomSheetMajorUpdateProps) => {
  return (
    <section
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgb(36, 36, 36)",
        color: "#fff",
        zIndex: 9999,
        padding: 20,
        overflowY: "auto",
        paddingTop: "calc(env(safe-area-inset-top) + 20px)",
        paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)",
        paddingLeft: "calc(env(safe-area-inset-left) + 20px)",
        paddingRight: "calc(env(safe-area-inset-right) + 20px)",
      }}
    >
      <p className="bg-[#9332ed] p-2 rounded-2xl mt-4 mb-4 inline-block text-sm">
        MAJOR UPDATE
      </p>
      <h1 style={{ color: "#fff" }} className="text-3xl font-bold">
        Auto Tasbeeh Switch
      </h1>
      <p className="mt-2 mb-6 text-sm">
        A new option to automatically switch tasbeehs when a target is reached
        has been added.
      </p>
      <section>
        <div className="flex mb-5 items-center">
          <div>
            <GoRocket className="mr-5 text-3xl text-[#c583f1]" />
          </div>
          <div>
            <h2 style={{ color: "#c583f1" }}>Auto Tasbeeh Switch</h2>
            <p className="text-sm">
              {" "}
              Enable this from the settings page to make your dhikr seamless —
              once a tasbeeh hits its target, the app will automatically move on
              to the next one in your tasbeeh list. You can also re-order your
              list from the settings page to control which tasbeeh comes next.
            </p>
          </div>
        </div>
        <div className="flex mb-5 items-center">
          <div>
            <GoZap className="mr-5 text-3xl text-[#f7cb22]" />
          </div>
          <div>
            <h2 style={{ color: "#f7cb22" }}>Performance Improvements</h2>
            <p className="text-sm">
              {" "}
              Bottom sheets are now smoother and more responsive.
            </p>
          </div>
        </div>
        <div className="flex mb-5 items-center">
          <div>
            <MdOutlinePalette className="mr-5 text-3xl text-[#ee7578]" />
          </div>
          <div>
            <h2 style={{ color: "#ee7578" }}>UX Enhancements</h2>
            <p className="text-sm">
              {" "}
              The reset-all-tasbeeh option has been moved from the settings page
              to the tasbeeh page, so it's now right where your tasbeehs are
              managed, other small improvements have also been made.
            </p>
          </div>
        </div>
      </section>
      <button
        onClick={() => {
          setShowMajorUpdateBottomSheet(false);
        }}
        className="text-center w-full bg-[#9332ed] p-3 rounded-2xl"
      >
        Continue
      </button>
    </section>
  );
};

export default BottomSheetMajorUpdate;
