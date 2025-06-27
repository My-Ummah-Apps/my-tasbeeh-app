import { IonToast } from "@ionic/react";

interface IonToastProps {
  isOpen: boolean;
  message: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  duration?: number;
}

const Toast = ({ isOpen, message, setShow, duration }: IonToastProps) => {
  return (
    <IonToast
      isOpen={isOpen}
      positionAnchor="nav-bar"
      message={message}
      duration={duration || 2000}
      onDidDismiss={() => setShow(false)}
    />
  );
};

export default Toast;
