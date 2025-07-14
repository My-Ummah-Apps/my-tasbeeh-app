// import { Capacitor } from "@capacitor/core";
// import { Style } from "@capacitor/status-bar";
import { MaterialColor, PreferenceKeyType, themeType } from "../../utils/types";
import { MdCheck } from "react-icons/md";
import { IonModal } from "@ionic/react";

interface BottomSheetThemeOptionsProps {
  triggerId: string;
  updateUserPreference: (
    preferenceName: PreferenceKeyType,
    preferenceValue: number | MaterialColor | themeType
  ) => Promise<void>;
  theme: themeType | null;
}

const BottomSheetThemeOptions = ({
  triggerId,
  updateUserPreference,
  theme,
}: BottomSheetThemeOptionsProps) => {
  return (
    <IonModal
      mode="ios"
      // ref={ref}
      trigger={triggerId}
      className="modal-fit-content"
      initialBreakpoint={1}
      breakpoints={[0, 1]}
      // handleBehavior="cycle"
      // onWillDismiss={(event) => onWillDismiss(event)}
    >
      <section className="theme-sheet-content-wrap pb-10">
        <h1 className="modal-header-text">Themes</h1>
        <ul className="my-5 notification-ul-wrap">
          {/* // TODO: May need to add aria-pressed to each button */}
          <li className="p-2 flex justify-between ">
            <button
              aria-pressed={theme === "light"}
              className="w-full text-left"
              onClick={async () => {
                if (theme !== "light") {
                  // if (Capacitor.isNativePlatform()) {
                  //   setStatusAndNavBarBGColor("#EDEDED", Style.Light);
                  // }
                  await updateUserPreference("theme", "light");
                }
              }}
            >
              Light
            </button>
            {theme === "light" && <MdCheck />}
          </li>
          <li className="p-2 flex justify-between  ">
            <button
              aria-pressed={theme === "dark"}
              onClick={async () => {
                if (theme !== "dark") {
                  // if (Capacitor.isNativePlatform()) {
                  //   setStatusAndNavBarBGColor("#242424", Style.Dark);
                  // }
                  await updateUserPreference("theme", "dark");
                }
              }}
              className="w-full text-left"
            >
              Dark
            </button>
            {theme === "dark" && <MdCheck />}
          </li>
        </ul>
      </section>
    </IonModal>
  );
};

export default BottomSheetThemeOptions;
