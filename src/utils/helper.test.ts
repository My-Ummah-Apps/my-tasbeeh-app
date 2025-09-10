import { incrementCounter } from "./helpers";
import { counterObjType } from "./types";

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
  const updatedCounters = incrementCounter(dummyCounters);

  it("increments only the active counter", () => {
    expect(updatedCounters[0].count).toBe(1);
    expect(updatedCounters[1].count).toBe(0);
  });

  it("returns same counters with same IDs", () => {
    expect(updatedCounters.map((c) => c.id)).toEqual(
      dummyCounters.map((c) => c.id)
    );
    expect(updatedCounters).toHaveLength(dummyCounters.length);
  });
});
