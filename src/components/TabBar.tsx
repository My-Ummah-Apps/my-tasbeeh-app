import { IonIcon, IonLabel, IonTabBar, IonTabButton } from "@ionic/react";
import { homeOutline, listOutline, settingsOutline } from "ionicons/icons";
import { useLocation } from "react-router-dom";
import { MaterialColor } from "../utils/types";

interface TabBarProps {
  activeColor: MaterialColor;
}

const TabBar = ({ activeColor }: TabBarProps) => {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  //   ion-tab-button color is controlled by 'color:' property, ripple is controlled by  --ripple-color
  //  style={{ '--my-color': myColor }}
  return (
    <IonTabBar
      style={{ "--active-tab-color": activeColor }}
      id="nav-bar"
      slot="bottom"
    >
      <IonTabButton
        style={{ color: isActiveRoute("/HomePage") ? activeColor : "" }}
        tab="HomePage"
        href="/HomePage"
      >
        <IonIcon icon={homeOutline} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
      <IonTabButton
        style={{
          color: isActiveRoute("/CountersPage") ? activeColor : "",
          "--ripple-color": activeColor,
        }}
        tab="CountersPage"
        href="/CountersPage"
      >
        <IonIcon icon={listOutline} />
        {/* <IonIcon icon={reorderFourOutline} /> */}
        <IonLabel>Tasbeehs</IonLabel>
      </IonTabButton>
      <IonTabButton
        style={{ color: isActiveRoute("/SettingsPage") ? activeColor : "" }}
        tab="SettingsPage"
        href="/SettingsPage"
      >
        <IonIcon icon={settingsOutline} />
        <IonLabel>Settings</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default TabBar;
