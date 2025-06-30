import { IonToast, ToastButton } from "@ionic/react";

interface IonToastProps {
  isOpen: boolean;
  message: string;
  buttons?: (string | ToastButton)[] | undefined;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  duration?: number;
}

const Toast = ({
  isOpen,
  message,
  buttons,
  setShow,
  duration,
}: IonToastProps) => {
  return (
    <IonToast
      isOpen={isOpen}
      positionAnchor="nav-bar"
      message={message}
      buttons={buttons}
      duration={duration || 2000}
      onDidDismiss={() => setShow(false)}
    />
  );
};

export default Toast;
