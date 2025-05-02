import { LATEST_APP_VERSION } from "../../src/utils/changelog";
import { DEFAULT_COUNTERS } from "../../src/utils/constants";
import { counterObjType } from "../../src/utils/types";

const mockCounters: counterObjType[] = [
  {
    counter: "Counter 1",
    count: 0,
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

const assertLocalStorageValue = () => {
  cy.window().then((win) => {
    const counters = JSON.parse(
      win.localStorage.getItem("localSavedCountersArray") || "[]"
    );
    const activeCounter = counters.find(
      (counter: counterObjType) => counter.isActive
    );
    expect(activeCounter.count).to.equal(2);
  });
};

const expectTestIdToContain = (testId, value) => {
  cy.get(`[data-testid="${testId}"]`).should("contain", value);
};

describe("New user flow", () => {
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
    cy.get('[data-testid="counter-increment-button"]').click().click();
    cy.get('[data-testid="counter-increment-button"]').should("contain", "2");

    assertLocalStorageValue();
    cy.reload();
    assertLocalStorageValue();
  });
});

describe("Existing user flow", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "localSavedCountersArray",
          JSON.stringify(mockCounters)
        );
        win.localStorage.setItem("appVersion", LATEST_APP_VERSION);
      },
    });
  });

  it("should display counter with isActive property set to true along with the counters count value from the mockCounters array", () => {
    expectTestIdToContain("active-counter-name", "Counter 1");
    expectTestIdToContain("counter-increment-button", "0");
  });

  it("should increment the counter, update value on-screen and store value in localStorage", () => {
    cy.get('[data-testid="counter-increment-button"]').click().click();
    cy.get('[data-testid="counter-increment-button"]').should("contain", "2");

    assertLocalStorageValue();
    cy.reload();
    assertLocalStorageValue();
  });
});
