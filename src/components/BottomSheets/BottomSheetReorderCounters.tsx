import {
  IonItem,
  IonLabel,
  IonList,
  IonReorder,
  IonReorderGroup,
  ItemReorderEventDetail,
} from "@ionic/react";
import { counterObjType, DBConnectionStateType } from "../../utils/types";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { Sheet } from "react-modal-sheet";
import { bottomSheetHeaderHeight, tween_config } from "../../utils/constants";

interface BottomSheetReorderCountersProps {
  setShowReorderCountersModal: React.Dispatch<React.SetStateAction<boolean>>;
  showReorderCountersModal: boolean;
  toggleDBConnection: (action: DBConnectionStateType) => Promise<void>;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  countersState: counterObjType[];
  updateCountersState: (arr: counterObjType[]) => void;
}

const BottomSheetReorderCounters = ({
  setShowReorderCountersModal,
  showReorderCountersModal,
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
    <Sheet
      isOpen={showReorderCountersModal}
      onClose={() => setShowReorderCountersModal(false)}
      detent="content-height"
      tweenConfig={tween_config}
      drag={false}
    >
      <Sheet.Container>
        <Sheet.Header style={bottomSheetHeaderHeight} />
        <Sheet.Content className="sheet-changelog">
          <h1 className="text-sm text-center">Re-order your Tasabeeh</h1>
          <IonList mode="ios">
            <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
              {countersState.map((counterItem: counterObjType) => {
                return (
                  <IonItem
                    key={counterItem.id}
                    mode="ios"
                    className="text-white"
                  >
                    <IonLabel>{counterItem.name}</IonLabel>
                    <IonReorder slot="end"></IonReorder>
                  </IonItem>
                );
              })}
            </IonReorderGroup>
          </IonList>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        // style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        onTap={() => setShowReorderCountersModal(false)}
      />
    </Sheet>
  );
};

export default BottomSheetReorderCounters;
