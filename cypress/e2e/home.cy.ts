import { LATEST_APP_VERSION } from "../../src/utils/changelog";
import { DEFAULT_COUNTERS } from "../../src/utils/constants";
import { counterObjType } from "../../src/utils/types";

const mockCountersArr: counterObjType[] = [
  {
    counter: "Counter 1",
    count: 10,
    color: "#EF5350",
    isActive: true,
    target: 50,
    id: "random identifier 1",
  },
  {
    counter: "Counter 1",
    count: 22,
    color: "#EF5350",
    isActive: false,
    target: 43,
    id: "random identifier 2",
  },
];

const counterIncrementBtn = () =>
  cy.get('[data-testid="counter-increment-button"]');
const counterResetBtn = () => cy.get('[data-testid="counter-reset-btn"]');

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

const expectTestIdToContain = (testId: string, value: string) => {
  cy.get(`[data-testid="${testId}"]`).should("contain", value);
};

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

  it("should initialise with default counters and display the active counter", () => {
    expectTestIdToContain("active-counter-name", "Alhumdulillah");
    expectTestIdToContain("counter-increment-button", "0");
  });

  it("should increment the counter, update value on-screen and store value in localStorage", () => {
    counterIncrementBtn().click().click();
    counterIncrementBtn().should("contain", "2");

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
    expectTestIdToContain("active-counter-name", "Alhumdulillah");
    expectTestIdToContain("counter-increment-button", "0");
  });

  it("should increment the counter, update value on-screen and store value in localStorage", () => {
    counterIncrementBtn().click().click();
    counterIncrementBtn().should("contain", "2");

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
          JSON.stringify(mockCountersArr)
        );
        win.localStorage.setItem("appVersion", LATEST_APP_VERSION);
      },
    });
  });

  it("should display counter with isActive property set to true along with the counters count value from the mockCountersArr array", () => {
    expectTestIdToContain("active-counter-name", "Counter 1");
    expectTestIdToContain("counter-increment-button", "0");
  });

  it("should increment the counter, update value on-screen and store value in localStorage", () => {
    counterIncrementBtn().click().click();
    counterIncrementBtn().should("contain", "2");

    assertLocalStorageActiveCounterValue(12);
    cy.reload();
    assertLocalStorageActiveCounterValue(12);
  });
});

describe("Counter reset and persistence after reload", () => {
  beforeEach(() => {
    // cy.clearLocalStorage();
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "localSavedCountersArray",
          JSON.stringify(mockCountersArr)
        );
        win.localStorage.setItem("appVersion", LATEST_APP_VERSION);
      },
    });
  });

  it("should reset the counter to 0 and persist across page reloads", () => {
    counterIncrementBtn().should("contain", "10");
    counterResetBtn().click();
    assertLocalStorageActiveCounterValue(0);
    cy.reload();
    assertLocalStorageActiveCounterValue(0);
  });

  it("should reset the counter to 0 multiple times, increment and persist across page reloads", () => {
    counterIncrementBtn().should("contain", "10");
    assertLocalStorageActiveCounterValue(10);

    counterResetBtn().click();
    assertLocalStorageActiveCounterValue(0);
    counterIncrementBtn().should("contain", "0");

    counterIncrementBtn().click();
    counterIncrementBtn().should("contain", "1");
    assertLocalStorageActiveCounterValue(1);
    cy.reload();
    assertLocalStorageActiveCounterValue(1);

    counterResetBtn().click();
    assertLocalStorageActiveCounterValue(0);
    counterIncrementBtn().should("contain", "0");
    cy.reload();
    assertLocalStorageActiveCounterValue(0);
    counterIncrementBtn().should("contain", "0");

    counterIncrementBtn().click().click();
    assertLocalStorageActiveCounterValue(2);
    counterIncrementBtn().should("contain", "2");

    counterResetBtn().click();
    assertLocalStorageActiveCounterValue(0);
    counterIncrementBtn().should("contain", "0");
  });
});
