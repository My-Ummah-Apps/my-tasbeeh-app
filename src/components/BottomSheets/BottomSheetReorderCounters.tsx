import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonReorder,
  IonReorderGroup,
  IonTitle,
  IonToolbar,
  ItemReorderEventDetail,
} from "@ionic/react";
import { counterObjType, DBConnectionStateType } from "../../utils/types";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { useRef } from "react";

interface BottomSheetReorderCountersProps {
  toggleDBConnection: (action: DBConnectionStateType) => Promise<void>;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  countersState: counterObjType[];
  updateCountersState: (arr: counterObjType[]) => void;
}

const BottomSheetReorderCounters = ({
  toggleDBConnection,
  dbConnection,
  countersState,
  updateCountersState,
}: BottomSheetReorderCountersProps) => {
  const modal = useRef<HTMLIonModalElement>(null);

  const handleReorder = async (event: CustomEvent<ItemReorderEventDetail>) => {
    const from = event.detail.from;
    const to = event.detail.to;

    const updatedCountersState = [...countersState];
    const [reorderedItem] = updatedCountersState.splice(from, 1);
    updatedCountersState.splice(to, 0, reorderedItem);
    updatedCountersState.forEach(
      (counter, index) => (counter.orderIndex = index)
    );
    updateCountersState(updatedCountersState);
    event.detail.complete();

    try {
      await toggleDBConnection("open");
      for (const counter of updatedCountersState) {
        await dbConnection.current!.run(
          `UPDATE counterDataTable SET orderIndex = ? WHERE id = ?`,
          [counter.orderIndex, counter.id]
        );
      }
    } catch (error) {
      console.error(`Error saving reordered array to database: `, error);
    } finally {
      await toggleDBConnection("close");
    }
  };
  return (
    <IonModal
      ref={modal}
      trigger="open-reorder-counters-modal"
      // onWillDismiss={(event) => onWillDismiss(event)}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Re-order Your Tasbeeh</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={() => modal.current?.dismiss()}>
              Close
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList className="ion-list-reorder-counters">
          <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
            {countersState.map((counterItem: counterObjType) => {
              return (
                <IonItem key={counterItem.id} mode="ios" className="text-white">
                  <IonLabel>{counterItem.name}</IonLabel>
                  <IonReorder slot="end"></IonReorder>
                </IonItem>
              );
            })}
          </IonReorderGroup>
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetReorderCounters;
