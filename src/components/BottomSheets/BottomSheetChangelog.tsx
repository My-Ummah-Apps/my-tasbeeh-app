import { IonModal } from "@ionic/react";
import { changeLogs, LATEST_APP_VERSION } from "../../utils/changelog";

interface BottomSheetChangelogProps {
  setShowChangelogBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showChangelogBottomSheet: boolean;
}

const BottomSheetChangelog = ({
  setShowChangelogBottomSheet,
  showChangelogBottomSheet,
}: BottomSheetChangelogProps) => {
  return (
    <IonModal
      mode="ios"
      isOpen={showChangelogBottomSheet}
      // ref={ref}
      // className="modal-fit-content"
      initialBreakpoint={0.97}
      breakpoints={[0, 0.97]}
      // handleBehavior="cycle"
      onWillDismiss={() => setShowChangelogBottomSheet(false)}
    >
      <h1 className="modal-header-text">Changelog</h1>
      <section className="ion-content-changelog-wrap pb-30 overflow-auto">
        <h1 className="ml-4 mb-4 text-2xl">Whats new?</h1>
        {changeLogs.map((item, i) => (
          <section key={i} className="mt-4 mx-6 mb-0">
            {/* <p>v{item.versionNum}</p> */}
            <p>
              {item.versionNum === LATEST_APP_VERSION
                ? `v${item.versionNum} - Latest Version`
                : `v${item.versionNum}`}
            </p>
            {item.changes.map((item) => (
              <section
                key={item.heading}
                className="changelog-individual-change-wrap my-4 p-4"
              >
                <h2 className="text-[1.2rem] font-medium mb-2">
                  {item.heading}
                </h2>
                <p>{item.text}</p>
              </section>
            ))}
          </section>
        ))}
        <button
          onClick={() => setShowChangelogBottomSheet(false)}
          className="sheet-changelog-close-btn text-base fixed bottom-[8%] left-1/2 -translate-x-1/2 translate-y-1/2 border-none bg-[#5c6bc0] text-white w-[90%] p-6"
        >
          Close
        </button>
      </section>
    </IonModal>
  );
};

export default BottomSheetChangelog;
