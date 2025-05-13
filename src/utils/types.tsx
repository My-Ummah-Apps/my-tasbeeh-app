export type counterObjType = {
  counter: string;
  count: number;
  color: string;
  isActive: boolean;
  target: number;
  id: string;
};

export type themeType = "light" | "dark";

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

// export type InitialiseNotificationParams = NotificationParams & {
//   setState: React.Dispatch<React.SetStateAction<boolean>>;
// };

// export type ActiveCounter = {
//   counterName: string;
//   count: number;
//   target: number;
//   color: string;
// };
