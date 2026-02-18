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
      <section className="overflow-auto ion-content-changelog-wrap pb-30">
        <h1 className="mb-4 ml-4 text-2xl">Whats new?</h1>
        {changeLogs.map((item, i) => (
          <section key={i} className="mx-6 mt-4 mb-0">
            {/* <p>v{item.versionNum}</p> */}
            <p>
              {item.versionNum === LATEST_APP_VERSION ? (
                <span className="font-bold">
                  `v{item.versionNum} - Latest Version`
                </span>
              ) : (
                `v${item.versionNum}`
              )}
            </p>
            {item.changes.map((item) => (
              <section
                key={item.heading}
                className="px-4 pb-4 mb-4 changelog-individual-change-wrap"
              >
                <h2 className="mb-2 text-lg font-medium">{item.heading}</h2>
                <p className="text-sm">{item.text}</p>
              </section>
            ))}
          </section>
        ))}
        <button
          onClick={() => setShowChangelogBottomSheet(false)}
          className="sheet-changelog-close-btn fixed bottom-[10%] left-1/2 -translate-x-1/2 translate-y-1/2 border-none bg-[#5c6bc0] text-white w-[90%] p-6"
        >
          Close
        </button>
      </section>
    </IonModal>
  );
};

export default BottomSheetChangelog;
