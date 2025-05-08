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
  id: number;
  title: string;
  body: string;
  hour: number;
  minute: number;
};

export type InitialiseNotificationParams = NotificationParams & {
  storageKey: string;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
};
