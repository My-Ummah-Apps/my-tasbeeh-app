import { materialColors } from "./constants";

export type DBConnectionStateType = "open" | "close";

export type themeType = "light" | "dark";

export interface userPreferencesType {
  morningNotification: 0 | 1;
  afternoonNotification: 0 | 1;
  eveningNotification: 0 | 1;
  isExistingUser: 0 | 1;
  appLaunchCount: number;
  haptics: 0 | 1;
  previousLaunchDate: string;
  dailyCounterReset: 0 | 1;
  activeColor: MaterialColor;
  theme: themeType;
}

export type PreferenceKeyType = keyof userPreferencesType;

export type PreferenceObjType = {
  preferenceName: PreferenceKeyType;
  preferenceValue: 0 | 1 | string;
};

export type counterObjType = {
  id: number;
  orderIndex: number;
  counterName: string;
  count: number;
  target: number;
  color: MaterialColor | null;
  isActive: 0 | 1;
};

export type NotificationParams = {
  storageKey:
    | "morning-notification"
    | "afternoon-notification"
    | "evening-notification";
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
  title: string;
  body: string;
  hour: number;
  minute: number;
};

export type languageDirection = "rtl" | "ltr" | "neutral";

export type MaterialColor = (typeof materialColors)[number];

export type Notifications =
  | "morning-notification"
  | "afternoon-notification"
  | "evening-notification";

// export type InitialiseNotificationParams = NotificationParams & {
//   setState: React.Dispatch<React.SetStateAction<boolean>>;
// };

// export type ActiveCounter = {
//   counterName: string;
//   count: number;
//   target: number;
//   color: string;
// };
