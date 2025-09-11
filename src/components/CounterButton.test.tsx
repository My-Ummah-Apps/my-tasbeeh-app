import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// import { vi } from "vitest";

import {
  getNextCounterInfo,
  incrementCounter,
} from "../components/CounterButton";
import { counterObjType } from "../utils/types";
import { materialColors } from "../utils/constants";

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

// screen.logTestingPlaygroundURL();

// test.skip("increases number upon button being tapped", async () => {
//   //   render(
//   //     <CounterButton
//   //       setHaptics={vi.fn()}
//   //       haptics={false}
//   //       // saveArrayLocally={vi.fn()}
//   //       // localSavedCountersArray={[
//   //       //   {
//   //       //     counter: "Alhumdulillah",
//   //       //     count: 0,
//   //       //     color: "#EF5350",
//   //       //     isActive: true,
//   //       //     target: 50,
//   //       //     id: 1,
//   //       //   },
//   //       // ]}
//   //       // setActiveCounterNumber={vi.fn()}
//   //       // activeCounterNumber={0}
//   //       // activeCounterTarget={3}
//   //     />
//   //   );
//   const btn = screen.getByRole("button", {
//     name: /Increase counter, current value is 0/i,
//   });
//   expect(btn).toBeInTheDocument();
//   expect(btn).toHaveAttribute(
//     "aria-label",
//     "Increase counter, current value is 0"
//   );
//   userEvent.click(btn);
//   await waitFor(() => {
//     expect(btn).toHaveAttribute(
//       "aria-label",
//       "Increase counter, current value is 1"
//     );
//   });
// });
