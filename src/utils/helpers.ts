import { isPlatform } from "@ionic/react";
import { MaterialColor, userPreferencesType } from "./types";
import { StatusBar, Style } from "@capacitor/status-bar";
import { EdgeToEdge } from "@capawesome/capacitor-android-edge-to-edge-support";
import { Capacitor } from "@capacitor/core";
import { Dialog } from "@capacitor/dialog";
import { DBSQLiteValues } from "@capacitor-community/sqlite";

export const toggleStyles = (
  userPreferencesState: userPreferencesType,
  preference: keyof userPreferencesType,
  activeColor: MaterialColor
) => {
  return {
    "--track-background-checked": activeColor + "90",
    ...(isPlatform("android") && {
      "--handle-background-checked": activeColor,
    }),
    "--ion-color-base":
      userPreferencesState[preference] === 1 ? activeColor : "#ccc",
  };
};

export const setStatusAndNavBarBGColor = async (
  backgroundColor: string,
  textColor: Style
) => {
  if (Capacitor.getPlatform() === "android") {
    await EdgeToEdge.setBackgroundColor({ color: backgroundColor });
  }
  await StatusBar.setStyle({ style: textColor });
};

export const showAlert = async (title: string, message: string) => {
  await Dialog.alert({
    title: title,
    message: message,
  });
};

export function assertValidDBResult(
  result: DBSQLiteValues | undefined,
  query: string
): asserts result is DBSQLiteValues & { values: any[] } {
  if (!result || !result.values) {
    throw new Error(`${query}.values does not exist`);
  }
}
