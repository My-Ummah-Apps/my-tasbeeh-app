import { LATEST_APP_VERSION } from "../../src/utils/changelog";
import { DEFAULT_COUNTERS } from "../../src/utils/constants";
import { counterObjType } from "../../src/utils/types";

const counterIncrementBtn = () =>
  cy.get('[data-testid="counter-current-count-text"]');
const counterResetBtn = () => cy.get('[data-testid="counter-reset-btn"]');
const counterProgressText = () =>
  cy.get('[data-testid="counter-progress-percent-text"]');
const counterTargetText = () => cy.get('data-testid="counter-target-text"');

const assertLocalStorageActiveCounterValue = (num: number) => {
  cy.window().then((win) => {
    const counters = JSON.parse(
      win.localStorage.getItem("localSavedCountersArray") || "[]"
    );
    const activeCounter = counters.find(
      (counter: counterObjType) => counter.isActive
    );
    expect(activeCounter.count).to.equal(num);
  });
};

const expectTestIdToContain = (
  testId: string,
  value: string,
  assertion: "contain" | "have.text"
) => {
  cy.get(`[data-testid="${testId}"]`).should(assertion, value);
};

// const clickIncrement = (element, times: number) => {
//   for (let i = 0; i < times; i++) {
//     element.click();
//   }
// };

// describe("Deal with malformed localStorage counters data", () => {
//   beforeEach(() => {
//     // cy.clearLocalStorage();
//     cy.visit("/", {
//       onBeforeLoad(win) {
//         win.localStorage.setItem("localSavedCountersArray", "{invalid json}");
//         win.localStorage.setItem("appVersion", LATEST_APP_VERSION);
//       },
//     });
//   });

//   it("should not crash and fall back to DEFAULT_COUNTERS", () => {
//     cy.window().then((win) => {
//       const storedCounters = JSON.parse(
//         win.localStorage.getItem("localSavedCountersArray") || "[]"
//       );
//       expect(storedCounters.length).to.equal(DEFAULT_COUNTERS.length);
//     });

//     expectTestIdToContain(
//       "active-counter-name",
//       DEFAULT_COUNTERS[0].counter,
//       "contain"
//     );
//   });
// });

describe("New user flow with no data present in localStorage", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/");
  });

  it("should match DEFAULT_COUNTERS", () => {
    cy.window().then((win) => {
      const waitForCounters = () =>
        JSON.parse(win.localStorage.getItem("localSavedCountersArray") || "[]");

      cy.wrap(null).should(() => {
        const counters = waitForCounters();
        expect(counters.length).to.be.greaterThan(0);

        const removeIds = (arr: counterObjType[]) =>
          arr.map(({ id, ...counter }) => counter);
        expect(removeIds(counters)).to.deep.equal(removeIds(DEFAULT_COUNTERS));
      });
    });
  });

  it("should initialise with DEFAULT_COUNTERS and display the active counter", () => {
    expectTestIdToContain("active-counter-name", "Alhumdulillah", "contain");
    expectTestIdToContain("counter-current-count-text", "0", "have.text");
  });

  it("should increment the counter, update value on-screen and store value in localStorage", () => {
    counterIncrementBtn().click().click();
    expectTestIdToContain("counter-current-count-text", "2", "have.text");

    assertLocalStorageActiveCounterValue(2);
    cy.reload();
    assertLocalStorageActiveCounterValue(2);
  });
});

describe("New user flow with DEFAULT_COUNTERS inserted", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "localSavedCountersArray",
          JSON.stringify(DEFAULT_COUNTERS)
        );
        win.localStorage.setItem("appVersion", LATEST_APP_VERSION);
      },
    });
  });

  it("should display counter with isActive property set to true along with the counters count value", () => {
    expectTestIdToContain("active-counter-name", "Alhumdulillah", "contain");
    expectTestIdToContain("counter-current-count-text", "0", "have.text");
    cy.reload();
    expectTestIdToContain("active-counter-name", "Alhumdulillah", "contain");
    expectTestIdToContain("counter-current-count-text", "0", "have.text");
  });

  it("should increment the counter, update value on-screen and store value in localStorage", () => {
    counterIncrementBtn().click().click();
    expectTestIdToContain("counter-current-count-text", "2", "have.text");

    assertLocalStorageActiveCounterValue(2);
    cy.reload();
    assertLocalStorageActiveCounterValue(2);
  });
});

describe("Existing user flow", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "localSavedCountersArray",
          JSON.stringify([
            {
              counter: "Counter 1",
              count: 10,
              color: "#EF5350",
              isActive: true,
              target: 50,
              id: "random identifier 1",
            },
            {
              counter: "Counter 2",
              count: 22,
              color: "#EF5350",
              isActive: false,
              target: 43,
              id: "random identifier 2",
            },
          ])
        );
        win.localStorage.setItem("appVersion", LATEST_APP_VERSION);
      },
    });
  });

  it("should display counter with isActive property set to true along with the counters count value from the mockCountersArr array", () => {
    expectTestIdToContain("active-counter-name", "Counter 1", "contain");
    expectTestIdToContain("counter-current-count-text", "10", "have.text");
  });

  it("should increment the counter, update value on-screen and store value in localStorage", () => {
    counterIncrementBtn().click().click();
    expectTestIdToContain("counter-current-count-text", "12", "have.text");

    assertLocalStorageActiveCounterValue(12);
    cy.reload();
    assertLocalStorageActiveCounterValue(12);
  });
});

describe("Counter goal text", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "localSavedCountersArray",
          JSON.stringify([
            {
              counter: "Dummy Counter",
              count: 0,
              color: "#EF5350",
              isActive: true,
              target: 5,
              id: "random identifier 1",
            },
          ])
        );
        win.localStorage.setItem("appVersion", LATEST_APP_VERSION);
      },
    });
  });

  it("displays the correct target value next to the counter", () => {
    expectTestIdToContain("counter-target-text", "of 5", "have.text");
  });
});

describe("Counter reset and persistence after reload", () => {
  beforeEach(() => {
    // cy.clearLocalStorage();
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "localSavedCountersArray",
          JSON.stringify([
            {
              counter: "Dummy Counter",
              count: 10,
              color: "#EF5350",
              isActive: true,
              target: 50,
              id: "random identifier 1",
            },
          ])
        );
        win.localStorage.setItem("appVersion", LATEST_APP_VERSION);
      },
    });
  });

  it("should reset the counter to 0 and persist across page reloads", () => {
    expectTestIdToContain("counter-current-count-text", "10", "have.text");
    counterResetBtn().click();
    assertLocalStorageActiveCounterValue(0);
    cy.reload();
    assertLocalStorageActiveCounterValue(0);
  });

  it("should reset the counter to 0 multiple times, increment and persist across page reloads", () => {
    expectTestIdToContain("counter-current-count-text", "10", "have.text");
    assertLocalStorageActiveCounterValue(10);

    counterResetBtn().click();
    assertLocalStorageActiveCounterValue(0);
    expectTestIdToContain("counter-current-count-text", "0", "have.text");

    counterIncrementBtn().click();
    expectTestIdToContain("counter-current-count-text", "1", "have.text");
    assertLocalStorageActiveCounterValue(1);
    cy.reload();
    assertLocalStorageActiveCounterValue(1);

    counterResetBtn().click();
    assertLocalStorageActiveCounterValue(0);
    expectTestIdToContain("counter-current-count-text", "0", "have.text");
    cy.reload();
    assertLocalStorageActiveCounterValue(0);
    expectTestIdToContain("counter-current-count-text", "0", "have.text");

    counterIncrementBtn().click().click();
    assertLocalStorageActiveCounterValue(2);
    expectTestIdToContain("counter-current-count-text", "2", "have.text");

    counterResetBtn().click();
    assertLocalStorageActiveCounterValue(0);
    expectTestIdToContain("counter-current-count-text", "0", "have.text");
  });
});

describe("Counter target text behaviour", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "localSavedCountersArray",
          JSON.stringify([
            {
              counter: "Dummy Counter",
              count: 0,
              color: "#EF5350",
              isActive: true,
              target: 5,
              id: "random identifier 1",
            },
          ])
        );
        win.localStorage.setItem("appVersion", LATEST_APP_VERSION);
      },
    });
  });

  it("updates and persists correct percentage as counter increases and reaches/exceeds target", () => {
    expectTestIdToContain("active-counter-name", "Dummy Counter", "contain");
    expectTestIdToContain("counter-current-count-text", "0", "have.text");

    counterIncrementBtn().click();
    expectTestIdToContain("counter-progress-percent-text", "20%", "have.text");
    counterIncrementBtn().click();
    expectTestIdToContain("counter-progress-percent-text", "40%", "have.text");
    cy.reload();
    expectTestIdToContain("counter-progress-percent-text", "40%", "have.text");
    counterIncrementBtn().click().click().click();
    // clickIncrement(counterIncrementBtn(), 3);
    expectTestIdToContain("counter-progress-percent-text", "100%", "have.text");
    cy.reload();
    expectTestIdToContain("counter-progress-percent-text", "100%", "have.text");
    counterIncrementBtn().click().click();
    expectTestIdToContain("counter-progress-percent-text", "100%", "have.text");
    cy.reload();
    expectTestIdToContain("counter-progress-percent-text", "100%", "have.text");
  });
});
