import { Dialog } from "@capacitor/dialog";
import { Toast, ToastShowOptions } from "@capacitor/toast";

export const TWEEN_CONFIG = {
  easingDefinition: "ease",
  duration: 0.3,
};

type ToastOptions = Parameters<typeof Toast.show>[0];

export const showConfirmDialog = async (title: string, message: string) => {
  const { value } = await Dialog.confirm({
    title: title,
    message: message,
  });

  return value;
};

export const showToast = async (
  text: string,
  position: ToastOptions["position"],
  duration: ToastOptions["duration"]
) => {
  await Toast.show({
    text: text,
    position: position,
    duration: duration,
  });
};
