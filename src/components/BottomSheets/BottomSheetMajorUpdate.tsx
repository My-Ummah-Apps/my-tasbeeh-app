import { GoRocket } from "react-icons/go";
import { GoZap } from "react-icons/go";
import { LATEST_APP_VERSION } from "../../utils/changelog";
// import { MdOutlinePalette } from "react-icons/md";

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
        Version {LATEST_APP_VERSION}
      </p>
      <h1 style={{ color: "#fff" }} className="text-3xl font-bold">
        New Feature & Minor Improvements
      </h1>
      {/* <p className="mt-2 mb-6 text-sm">
        Set how fast counters move on your screen.{" "}
      </p> */}
      <section>
        <div className="flex items-center mb-5">
          <div>
            <GoRocket className="mr-5 text-3xl text-[#c583f1]" />
          </div>
          <div>
            <h2 style={{ color: "#c583f1" }}>Scroll Speed Control</h2>
            <p className="text-sm">
              {" "}
              You can now adjust the scroll speed for long tasbeehs from the
              settings page.
            </p>
          </div>
        </div>
        <div className="flex items-center mb-5">
          <div>
            <GoZap className="mr-5 text-3xl text-[#ee7578]" />
          </div>
          <div>
            <h2 style={{ color: "#ee7578" }}>Minor UX Improvements</h2>
            <p className="text-sm">
              {" "}
              Counter numbers now automatically adjust their font size as they
              grow to stay neatly inside the circle, notifications have more
              variety with randomised messages, and deleting a counter now
              features a smooth animation for a better experience.
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
