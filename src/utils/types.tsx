import { materialColors } from "./constants";

export type DBConnectionStateType = "open" | "close";

export type themeType = "light" | "dark" | "system";

export type BinaryValue = 0 | 1;

export type scrollSpeedValue = 0 | 1 | 2 | 3 | 4;

export interface userPreferencesType {
  morningNotification: BinaryValue;
  afternoonNotification: BinaryValue;
  eveningNotification: BinaryValue;
  isExistingUser: BinaryValue;
  appLaunchCount: number;
  haptics: BinaryValue;
  previousLaunchDate: string;
  dailyCounterReset: BinaryValue;
  autoSwitchCounter: BinaryValue;
  activeColor: MaterialColor;
  theme: themeType;
  scrollSpeed: scrollSpeedValue;
}

export type PreferenceKeyType = keyof userPreferencesType;

export type PreferenceObjType = {
  preferenceName: PreferenceKeyType;
  preferenceValue: BinaryValue | string;
};

export type counterObjType = {
  id: number;
  orderIndex: number;
  name: string;
  count: number;
  target: number;
  color: MaterialColor | null;
  isActive: BinaryValue;
};

// export type NotificationParams = {
//   storageKey:
//     | "morning-notification"
//     | "afternoon-notification"
//     | "evening-notification";
//   setState: React.Dispatch<React.SetStateAction<boolean>>;
//   id: number;
//   title: string;
//   body: string;
//   hour: number;
//   minute: number;
// };

export type languageDirection = "rtl" | "ltr" | "neutral";

export type MaterialColor = (typeof materialColors)[number];

export type Notifications =
  | "morning-notification"
  | "afternoon-notification"
  | "evening-notification";

// export type ActiveCounter = {
//   name: string;
//   count: number;
//   target: number;
//   color: string;
// };
