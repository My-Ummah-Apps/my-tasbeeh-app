import { Sheet } from "react-modal-sheet";
import {
  setStatusAndNavBarBackgroundColor,
  tween_config,
} from "../../utils/constants";
import { Capacitor } from "@capacitor/core";
import { Style } from "@capacitor/status-bar";
import { MaterialColor, PreferenceKeyType, themeType } from "../../utils/types";
import { MdCheck } from "react-icons/md";

interface BottomSheetThemeOptionsProps {
  updateUserPreference: (
    preferenceName: PreferenceKeyType,
    preferenceValue: number | MaterialColor | themeType
  ) => Promise<void>;
  setShowThemeOptionsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showThemeOptionsSheet: boolean;
  setTheme: React.Dispatch<React.SetStateAction<themeType | null>>;
  theme: themeType | null;
}

const BottomSheetThemeOptions = ({
  updateUserPreference,
  setShowThemeOptionsSheet,
  showThemeOptionsSheet,
  setTheme,
  theme,
}: BottomSheetThemeOptionsProps) => {
  return (
    <Sheet
      disableDrag={false}
      isOpen={showThemeOptionsSheet}
      onClose={() => setShowThemeOptionsSheet(false)}
      detent="content-height"
      tweenConfig={tween_config}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <section className="mb-10 ">
            <ul className="my-5 notification-ul-wrap">
              {/* // TODO: May need to add aria-pressed to each button */}
              <li className="p-2 flex justify-between ">
                <button
                  aria-pressed={theme === "light"}
                  className="w-full text-left"
                  onClick={() => {
                    if (theme !== "light") {
                      setTheme("light");
                      if (Capacitor.isNativePlatform()) {
                        setStatusAndNavBarBackgroundColor(
                          "#EDEDED",
                          Style.Light
                        );
                      }
                      updateUserPreference("theme", "light");
                      document.body.classList.remove("dark");
                    }
                  }}
                >
                  Light
                </button>
                {theme === "light" && <MdCheck />}
              </li>
              <li className="p-2 flex justify-between  ">
                {" "}
                <button
                  aria-pressed={theme === "dark"}
                  className="w-full text-left"
                  onClick={() => {
                    if (theme !== "dark") {
                      setTheme("dark");
                      if (Capacitor.isNativePlatform()) {
                        setStatusAndNavBarBackgroundColor(
                          "#242424",
                          Style.Dark
                        );
                      }
                      updateUserPreference("theme", "dark");
                      document.body.classList.add("dark");
                    }
                  }}
                >
                  Dark
                </button>
                {theme === "dark" && <MdCheck />}
              </li>
            </ul>
          </section>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        // style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        onTap={() => setShowThemeOptionsSheet(false)}
      />
    </Sheet>
  );
};

export default BottomSheetThemeOptions;
