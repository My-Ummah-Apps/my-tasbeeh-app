import { IonToast } from "@ionic/react";

interface IonToastProps {
  isOpen: boolean;
  message: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const Toast = ({ isOpen, message, setShow }: IonToastProps) => {
  return (
    <IonToast
      isOpen={isOpen}
      positionAnchor="nav-bar"
      message={message}
      duration={2000}
      onDidDismiss={() => setShow(false)}
    />
  );
};

export default Toast;
