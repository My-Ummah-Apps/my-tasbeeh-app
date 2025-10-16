import {
  getNextCounterInfo,
  incrementCounter,
  incrementCounterInDB,
} from "../components/CounterButton";
import { counterObjType } from "../utils/types";
import { materialColors } from "../utils/constants";
import { vi } from "vitest";

const dummyCounters: counterObjType[] = [
  {
    id: 1,
    orderIndex: 0,
    name: "Counter 1",
    count: 0,
    target: 50,
    color: null,
    isActive: 1,
  },
  {
    id: 2,
    orderIndex: 1,
    name: "Counter 2",
    count: 0,
    target: 50,
    color: null,
    isActive: 0,
  },
];

describe("incrementCounter", () => {
  it("increments only the active counter", () => {
    const updatedCounters = incrementCounter(dummyCounters);
    expect(updatedCounters[0].count).toBe(1);
    expect(updatedCounters[1].count).toBe(0);
  });

  it("returns same counters with same IDs", () => {
    const updatedCounters = incrementCounter(dummyCounters);
    expect(updatedCounters.map((c) => c.id)).toEqual(
      dummyCounters.map((c) => c.id)
    );
    expect(updatedCounters).toHaveLength(dummyCounters.length);
  });
});

describe("AutoSwitchCounter", () => {
  it("returns correct values", () => {
    const currentCounterIndex = 0;
    const updatedCounters = dummyCounters;
    const { nextCounterId, nextCounterColor, nextCounterIndex } =
      getNextCounterInfo(currentCounterIndex, updatedCounters);
    const expectedColor =
      materialColors[nextCounterIndex % materialColors.length];

    expect(nextCounterIndex).toBe(1);
    expect(nextCounterId).toBe(2);
    expect(nextCounterColor).toBe(expectedColor);
  });
});

describe("OpenAndCloseDBConnection", () => {
  let toggleDBConnection: ReturnType<typeof vi.fn>;
  let dbConnection: {
    current: {
      run: ReturnType<typeof vi.fn>;
    };
  };
  let newActiveCounter: counterObjType;

  beforeEach(() => {
    toggleDBConnection = vi.fn().mockResolvedValue(undefined);
    dbConnection = {
      current: {
        run: vi.fn().mockResolvedValue(undefined),
      },
    };
    newActiveCounter = {
      count: 0,
      id: 1,
      orderIndex: 0,
      name: "Test",
      target: 5,
      color: "#EF5350",
      isActive: 1,
    };

    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as any).mockRestore?.();
  });

  it("opens and closes DB connection", async () => {
    await incrementCounterInDB(
      toggleDBConnection,
      // @ts-ignore
      dbConnection,
      newActiveCounter
    );

    expect(toggleDBConnection).toHaveBeenCalledWith("open");
    expect(toggleDBConnection).toHaveBeenNthCalledWith(1, "open");
    expect(dbConnection.current.run).toHaveBeenCalledWith(
      `UPDATE counterDataTable SET count = count + 1 WHERE id = ?`,
      [1]
    );
    expect(toggleDBConnection).toHaveBeenCalledWith("close");
    expect(toggleDBConnection).toHaveBeenNthCalledWith(2, "close");
  });

  it("should catch error and close DB", async () => {
    dbConnection = {
      current: {
        run: vi.fn().mockRejectedValue(new Error("DB fail")),
      },
    };

    await incrementCounterInDB(
      toggleDBConnection,
      // @ts-ignore
      dbConnection,
      newActiveCounter
    );

    expect(toggleDBConnection).toHaveBeenCalledWith("open");
    expect(toggleDBConnection).toHaveBeenNthCalledWith(1, "open");
    expect(dbConnection.current.run).toHaveBeenCalledWith(
      `UPDATE counterDataTable SET count = count + 1 WHERE id = ?`,
      [1]
    );
    expect(console.error).toHaveBeenCalledWith(
      "Error incrementing counter: ",
      expect.any(Error)
    );
    expect(toggleDBConnection).toHaveBeenCalledWith("close");
    expect(toggleDBConnection).toHaveBeenNthCalledWith(2, "close");
  });
});

// ! Add test which checks for target text ('of 50')

// const mockDBConnection = {
//   current: {
//     run: vi.fn().mockResolvedValue(undefined),
//   },
// };

// render(
//   <CounterButton
//     dbConnection={mockDBConnection as any}
//     toggleDBConnection={toggleDBConnection}
//     setShowNextCounterToast={setShowNextCounterToast}
//     cancellableDelayRef={cancellableDelayRef}
//     isAutoSwitchCancelled={isAutoSwitchCancelled}
//     setShowEndOfListAlert={setShowEndOfListAlert}
//     userPreferencesState={userPreferencesState}
//     updateActiveCounter={updateActiveCounter}
//     activeColor={activeColor}
//     countersState={countersState}
//     updateCountersState={updateCountersState}
//     activeCounter={activeCounter}
//   />
// );
