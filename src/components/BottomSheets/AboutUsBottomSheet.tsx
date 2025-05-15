import { Sheet } from "react-modal-sheet";
import {
  bottomSheetContainerStyles,
  sheetBackdropColor,
  bottomSheetHeaderHeight,
  TWEEN_CONFIG,
} from "../../utils/constants";
import MyUmmahAppsLogo from "/src//images/My-Ummah-Apps-72ppi.png";

interface BottomSheetAboutUsProps {
  setShowAboutUsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showAboutUsSheet: boolean;
}

const BottomSheetAboutUs = ({
  setShowAboutUsSheet,
  showAboutUsSheet,
}: BottomSheetAboutUsProps) => {
  return (
    <Sheet
      detent="content-height"
      tweenConfig={TWEEN_CONFIG}
      isOpen={showAboutUsSheet}
      onClose={() => setShowAboutUsSheet(false)}
    >
      <Sheet.Container style={bottomSheetContainerStyles}>
        <Sheet.Header style={bottomSheetHeaderHeight} />
        <Sheet.Content>
          <section className="pt-4 pb-6 rounded-lg">
            <div className="text-center">
              <img
                className="block mx-auto mb-2"
                src={MyUmmahAppsLogo}
                height="50"
                width="40%"
                alt=""
              />
              <p className="p-4 text-sm leading-5">
                MyUmmahApps Ltd is an organization driven by a passionate
                commitment to empower the Muslim community through privacy
                friendly Open Source Mobile Applications.{" "}
              </p>
            </div>
            <div className="mx-4 mt-5 text-xs text-center">
              <p className="mb-[0.2rem]">App Icon by: </p>
              <a
                className="text-xs underline text-inherit"
                href="https://www.flaticon.com/free-icons/number"
                title="number icons"
              >
                Zane Priedite - Flaticon
              </a>
            </div>
          </section>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        style={sheetBackdropColor}
        onTap={() => setShowAboutUsSheet(false)}
      />
    </Sheet>
  );
};

export default BottomSheetAboutUs;
