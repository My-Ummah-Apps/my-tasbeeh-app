import { Dialog } from "@capacitor/dialog";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Toast } from "@capacitor/toast";
import { EdgeToEdge } from "@capawesome/capacitor-android-edge-to-edge-support";
import { counterObjType, userPreferencesType } from "./types";
import { EasingDefinition } from "framer-motion";
import { DBSQLiteValues } from "@capacitor-community/sqlite";

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

export const DEFAULT_COUNTERS: Omit<counterObjType, "id">[] = [
  {
    orderIndex: 0,
    counterName: "Alhumdulillah",
    count: 0,
    target: 50,
    color: null,
    isActive: 1,
  },

  {
    orderIndex: 1,
    counterName: "Subhanallah",
    count: 0,
    target: 50,
    color: null,
    isActive: 0,
  },

  {
    orderIndex: 2,
    counterName: "Allahu-Akbar",
    count: 0,
    target: 50,
    color: null,
    isActive: 0,
  },

  {
    orderIndex: 3,
    counterName: "Astagfirullah",
    count: 0,
    target: 50,
    color: null,
    isActive: 0,
  },
  {
    orderIndex: 4,
    counterName: "Subhan-Allahi wa bihamdihi, Subhan-Allahil-Azim",
    count: 0,
    target: 50,
    color: null,
    isActive: 0,
  },
  {
    orderIndex: 5,
    counterName: "La hawla wa la quwwata illa billah",
    count: 0,
    target: 50,
    color: null,
    isActive: 0,
  },
  {
    orderIndex: 6,
    counterName: "La ilaha illallah",
    count: 0,
    target: 50,
    color: null,
    isActive: 0,
  },
  {
    orderIndex: 7,
    counterName: "Subhan-Allahi wa bihamdih",
    count: 0,
    target: 50,
    color: null,
    isActive: 0,
  },
];

export function assertValidDBResult(
  result: DBSQLiteValues | undefined,
  query: string
): asserts result is DBSQLiteValues & { values: any[] } {
  if (!result || !result.values) {
    throw new Error(`${query}.values does not exist`);
  }
}

export const dictPreferencesDefaultValues: userPreferencesType = {
  morningNotification: 0,
  afternoonNotification: 0,
  eveningNotification: 0,
  isExistingUser: 0,
  appLaunchCount: 0,
  haptics: 0,
  previousLaunchDate: "",
  dailyCounterReset: 0,
  launchCount: 0,
  activeColor: materialColors[0],
};

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
