// @ts-ignore
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import MyUmmahAppsLogo from "/src//images/My-Ummah-Apps-72ppi.png";
import { IonModal } from "@ionic/react";

interface BottomSheetAboutUsProps {
  ref?: any;
  triggerId: string;
}

const BottomSheetAboutUs = ({ ref, triggerId }: BottomSheetAboutUsProps) => {
  return (
    <IonModal
      ref={ref}
      mode="ios"
      expandToScroll={false}
      // canDismiss={true}
      className="modal-fit-content"
      trigger={triggerId}
      initialBreakpoint={1}
      breakpoints={[0, 1]}
    >
      <section className="my-15 rounded-lg">
        <div className="text-center">
          <img
            className="block mx-auto mb-2"
            src={MyUmmahAppsLogo}
            height="50"
            width="40%"
            alt=""
          />
          <p className="p-4 text-sm leading-5">
            MyUmmahApps Ltd is an organization driven by a passionate commitment
            to empower the Muslim community through privacy friendly Open Source
            Mobile Applications.{" "}
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
    </IonModal>
  );
};

export default BottomSheetAboutUs;

// <Sheet
//   detent="content-height"
//   tweenConfig={tween_config}
//   isOpen={showAboutUsSheet}
//   onClose={() => setShowAboutUsSheet(false)}
// >
//   <Sheet.Container style={bottomSheetContainerStyles}>
//     <Sheet.Header style={bottomSheetHeaderHeight} />
//     <Sheet.Content>
//       <section className="pt-4 pb-6 rounded-lg">
//         <div className="text-center">
//           <img
//             className="block mx-auto mb-2"
//             src={MyUmmahAppsLogo}
//             height="50"
//             width="40%"
//             alt=""
//           />
//           <p className="p-4 text-sm leading-5">
//             MyUmmahApps Ltd is an organization driven by a passionate
//             commitment to empower the Muslim community through privacy
//             friendly Open Source Mobile Applications.{" "}
//           </p>
//         </div>
//         <div className="mx-4 mt-5 text-xs text-center">
//           <p className="mb-[0.2rem]">App Icon by: </p>
//           <a
//             className="text-xs underline text-inherit"
//             href="https://www.flaticon.com/free-icons/number"
//             title="number icons"
//           >
//             Zane Priedite - Flaticon
//           </a>
//         </div>
//       </section>
//     </Sheet.Content>
//   </Sheet.Container>
//   <Sheet.Backdrop
//     style={sheetBackdropColor}
//     onTap={() => setShowAboutUsSheet(false)}
//   />
// </Sheet>
