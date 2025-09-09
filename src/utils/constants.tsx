import { counterObjType, userPreferencesType } from "./types";

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
    name: "Alhumdulillah",
    count: 0,
    target: 50,
    color: null,
    isActive: 1,
  },

  {
    orderIndex: 1,
    name: "Subhanallah",
    count: 0,
    target: 50,
    color: null,
    isActive: 0,
  },

  {
    orderIndex: 2,
    name: "Allahu-Akbar",
    count: 0,
    target: 50,
    color: null,
    isActive: 0,
  },

  {
    orderIndex: 3,
    name: "Astagfirullah",
    count: 0,
    target: 50,
    color: null,
    isActive: 0,
  },
  {
    orderIndex: 4,
    name: "Subhan-Allahi wa bihamdihi, Subhan-Allahil-Azim",
    count: 0,
    target: 50,
    color: null,
    isActive: 0,
  },
  {
    orderIndex: 5,
    name: "La hawla wa la quwwata illa billah",
    count: 0,
    target: 50,
    color: null,
    isActive: 0,
  },
  {
    orderIndex: 6,
    name: "La ilaha illallah",
    count: 0,
    target: 50,
    color: null,
    isActive: 0,
  },
  {
    orderIndex: 7,
    name: "Subhan-Allahi wa bihamdih",
    count: 0,
    target: 50,
    color: null,
    isActive: 0,
  },
];

export const todaysDate = new Date().toLocaleDateString("en-CA");

export const dictPreferencesDefaultValues: userPreferencesType = {
  morningNotification: 0,
  afternoonNotification: 0,
  eveningNotification: 0,
  isExistingUser: 0,
  appLaunchCount: 0,
  haptics: 1,
  previousLaunchDate: todaysDate,
  dailyCounterReset: 0,
  autoSwitchCounter: 0,
  activeColor: materialColors[0],
  theme: "light",
};

export const pageTransitionStyles = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  // exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

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

// type ToastOptions = Parameters<typeof Toast.show>[0];

export const nextCounterDelay = 3000;
