import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonReorder,
  IonReorderGroup,
  ItemReorderEventDetail,
} from "@ionic/react";
import { counterObjType, DBConnectionStateType } from "../../utils/types";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";

interface BottomSheetReorderCountersProps {
  // ref: HTMLIonModalElement | null;
  triggerId: string;
  toggleDBConnection: (action: DBConnectionStateType) => Promise<void>;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  countersState: counterObjType[];
  updateCountersState: (arr: counterObjType[]) => void;
}

const BottomSheetReorderCounters = ({
  // ref,
  triggerId,
  toggleDBConnection,
  dbConnection,
  countersState,
  updateCountersState,
}: BottomSheetReorderCountersProps) => {
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
      mode="ios"
      // ref={ref}
      trigger={triggerId}
      // className="modal-fit-content"
      initialBreakpoint={1}
      breakpoints={[0, 1]}
      // handleBehavior="cycle"
      // onWillDismiss={(event) => onWillDismiss(event)}
    >
      <h1 className="modal-header py-10 text-center text-2xl">
        Re-order Tasbeehs
      </h1>
      <IonContent className="ion-padding">
        <IonList className="ion-list-reorder-counters">
          <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
            {countersState.map((counterItem: counterObjType) => {
              return (
                <IonItem
                  key={counterItem.id}
                  mode="ios"
                  className="text-white py-1"
                >
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
