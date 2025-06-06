import { Dialog } from "@capacitor/dialog";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Toast } from "@capacitor/toast";
import { EdgeToEdge } from "@capawesome/capacitor-android-edge-to-edge-support";
import { v4 as uuidv4 } from "uuid";
import { counterObjType } from "./types";
import { EasingDefinition } from "framer-motion";

export const materialColors = [
  "#EF5350",
  "#EC407A",
  "#AB47BC",
  "#7E57C2",
  "#5C6BC0",
  "#42A5F5",
  "#29B6F6",
  "#26C6DA",
  "#26A69A",
  "#66BB6A",
  "#9CCC65",
  "#FF7043",
] as const;

export const DEFAULT_COUNTERS: counterObjType[] = [
  {
    counter: "Alhumdulillah",
    count: 0,
    isActive: true,
    target: 50,
    id: uuidv4(),
  },

  {
    counter: "Subhanallah",
    count: 0,
    isActive: false,
    target: 50,
    id: uuidv4(),
  },

  {
    counter: "Allahu-Akbar",
    count: 0,
    isActive: false,
    target: 50,
    id: uuidv4(),
  },

  {
    counter: "Astagfirullah",
    count: 0,
    isActive: false,
    target: 50,
    id: uuidv4(),
  },
  {
    counter: "Subhan-Allahi wa bihamdihi, Subhan-Allahil-Azim",
    count: 0,
    isActive: false,
    target: 50,
    id: uuidv4(),
  },
  {
    counter: "La hawla wa la quwwata illa billah",
    count: 0,
    isActive: false,
    target: 50,
    id: uuidv4(),
  },
  {
    counter: "La ilaha illallah",
    count: 0,
    isActive: false,
    target: 50,
    id: uuidv4(),
  },
  {
    counter: "Subhan-Allahi wa bihamdih",
    count: 0,
    isActive: false,
    target: 50,
    id: uuidv4(),
  },
];

// export const pageTransitionStyles = {
//   initial: { opacity: 0 },
//   animate: { opacity: 1 },
//   // exit: { opacity: 0 },
//   transition: { duration: 0.2 },
// };

export const bottomSheetHeaderHeight = {
  height: "60px",
  // backgroundColor: "black",
};

export const bottomSheetContainerStyles = {
  borderRadius: "1.5rem 1.5rem 0 0",
  overflow: "hidden",
  backgroundColor: "rgb(33, 36, 38)",
};

export const sheetBackdropColor = {
  backgroundColor: "rgba(0, 0, 0, 0.7)",
};

export const tween_config = {
  ease: "easeInOut" as EasingDefinition,
  duration: 0.5,
};

type ToastOptions = Parameters<typeof Toast.show>[0];

export const showConfirmDialog = async (title: string, message: string) => {
  const { value } = await Dialog.confirm({
    title,
    message,
  });

  return value;
};

export const showToast = async (
  text: string,
  position: ToastOptions["position"],
  duration: ToastOptions["duration"]
) => {
  await Toast.show({
    text,
    position,
    duration,
  });
};

export const showerAlert = async (title: string, message: string) => {
  await Dialog.alert({
    title: title,
    message: message,
  });
};

export const setStatusAndNavBarBackgroundColor = async (
  backgroundColor: string,
  textColor: Style
) => {
  await EdgeToEdge.setBackgroundColor({ color: backgroundColor });
  await StatusBar.setStyle({ style: textColor });
};
