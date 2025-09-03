import { DBSQLiteValues } from "@capacitor-community/sqlite";
import { LATEST_APP_VERSION } from "../../src/utils/changelog";
import {
  DEFAULT_COUNTERS,
  dictPreferencesDefaultValues,
} from "../../src/utils/constants";
import { counterObjType, userPreferencesType } from "../../src/utils/types";
import { closeDBConnection, waitForDBReady } from "../support/utils";

const counterIncrementBtn = () =>
  cy.get('[data-testid="counter-increment-button"]');
const counterCurrentCountText = () =>
  cy.get('[data-testid="counter-current-count-text"]');
const counterResetBtn = () => cy.get('[data-testid="counter-reset-btn"]');
const counterProgressText = () =>
  cy.get('[data-testid="counter-progress-percent-text"]');
const counterTargetText = () => cy.get('data-testid="counter-target-text"');

const assertDatabaseActiveCounterValue = (num: number) => {
  waitForDBReady().then((win) => {
    const db = (win as any).dbConnection;
    return (
      // db.current.open()
      // .then(() => db.current.query("SELECT * FROM counterDataTable"))
      db.current
        .query("SELECT * FROM counterDataTable")
        .then((countersFromDB: DBSQLiteValues) => {
          if (!countersFromDB || !countersFromDB.values) {
            throw new Error(
              "countersFromDB or countersFromDB.values is undefined"
            );
          }
          const activeCounter = countersFromDB.values.find(
            (counter: counterObjType) => counter.isActive
          );
          if (!activeCounter) throw new Error("No active counter found");
          expect(activeCounter.count).to.equal(num);
        })
    );
    // .then(() => {
    //   return db.current.close();
    // });
  });
};

const resetDBAndLocalStorage = () => {
  cy.visit("/");
  cy.clearLocalStorage();

  return waitForDBReady()
    .then((win) => {
      const db = (win as any).dbConnection;
      return db.current
        .open()
        .then(() => db.current.run("DROP TABLE IF EXISTS counterDataTable"))
        .then(() => db.current.run("DROP TABLE IF EXISTS userPreferencesTable"))
        .then(() => db.current.close());
    })
    .then(() => {
      cy.reload().then(() => {
        waitForDBReady().then((win) => {
          const db = (win as any).dbConnection;
          return db.current.open();
        });
      });
    });
};

const insertDummyCounter = (counter: number) => {
  cy.visit("/");
  return waitForDBReady()
    .then((win) => {
      const db = (win as any).dbConnection;

      return db.current
        .open()
        .then(() => db.current.run("DELETE FROM counterDataTable"))
        .then(() => cy.reload())
        .then(() => {
          const insertStmnt = `INSERT into counterDataTable(orderIndex, name, count, target, color, isActive) VALUES (?, ?, ?, ?, ?, ?)`;

          return db.current.run(insertStmnt, [
            0,
            DUMMY_COUNTERS[counter].name,
            DUMMY_COUNTERS[counter].count,
            DUMMY_COUNTERS[counter].target,
            null,
            1,
          ]);
        })
        .then(() => db.current.close());
    })
    .then(() => cy.reload())
    .then(() => {
      waitForDBReady().then((win) => {
        const db = (win as any).dbConnection;
        return db.current.open();
      });
    });
};

const expectTestIdToContain = (
  testId: string,
  value: string,
  assertion: "contain" | "have.text"
) => {
  cy.get(`[data-testid="${testId}"]`).should(assertion, value);
};

const DUMMY_COUNTERS: Omit<counterObjType, "id">[] = [
  {
    orderIndex: 0,
    name: "Counter 1",
    count: 10,
    color: "#EF5350",
    isActive: 1,
    target: 50,
  },
  {
    orderIndex: 1,
    name: "Counter 2",
    count: 0,
    color: "#EF5350",
    isActive: 0,
    target: 5,
  },
  {
    orderIndex: 2,
    name: "Counter 3",
    count: 0,
    color: "#EF5350",
    isActive: 0,
    target: 3,
  },
];

describe("New user flow with no data present in localStorage or DB", () => {
  beforeEach(() => {
    resetDBAndLocalStorage();
  });

  afterEach(() => {
    closeDBConnection();
  });

  it("should initialise counters table with defaults", () => {
    cy.window()
      .then((win) => {
        const db = (win as any).dbConnection;
        return db.current.query("SELECT * FROM counterDataTable");
      })
      .should((countersFromDB) => {
        const removeIdsFromCounters = (arr: counterObjType[]) =>
          arr.map(({ id, ...counter }) => counter);

        expect(removeIdsFromCounters(countersFromDB.values)).to.deep.equal(
          DEFAULT_COUNTERS
        );
      });
  });

  it("should display the default active counter", () => {
    expectTestIdToContain("active-counter-name", "Alhumdulillah", "contain");
  });

  it("should display the default active counters count", () => {
    expectTestIdToContain("counter-current-count-text", "0", "have.text");
  });

  it("displays the correct target value next to the counter", () => {
    expectTestIdToContain("counter-target-text", "of 50", "have.text");
  });

  it("should initialise DB with default user preferences", () => {
    cy.window()
      .then((win) => {
        const db = (win as any).dbConnection;

        return db.current
          .open()
          .then(() => db.current.query("SELECT * FROM userPreferencesTable"));
      })
      .should((userPreferences) => {
        const userPrefsObj = {};

        for (const key of userPreferences.values) {
          if (
            key.preferenceName === "appLaunchCount" ||
            key.preferenceName === "isExistingUser"
          ) {
            userPrefsObj[key.preferenceName] = 0;
          } else {
            userPrefsObj[key.preferenceName] =
              key.preferenceValue === "0" || key.preferenceValue === "1"
                ? Number(key.preferenceValue)
                : key.preferenceValue;
          }
        }

        expect(userPrefsObj).to.deep.equal(dictPreferencesDefaultValues);
      });
  });
});

describe("Existing user flow", () => {
  beforeEach(() => {
    insertDummyCounter(0);
  });

  afterEach(() => {
    closeDBConnection();
  });

  it("should display counter with isActive property set to true", () => {
    expectTestIdToContain("active-counter-name", "Counter 1", "contain");
  });

  it("should display active counters count value", () => {
    expectTestIdToContain("counter-current-count-text", "10", "have.text");
  });

  it("displays the correct target value next to the counter", () => {
    expectTestIdToContain("counter-target-text", "of 50", "have.text");
  });

  it("should increment the counter, update value on-screen and store value in the database", () => {
    counterCurrentCountText().click().click();
    expectTestIdToContain("counter-current-count-text", "12", "have.text");

    assertDatabaseActiveCounterValue(12);
    cy.reload();
    assertDatabaseActiveCounterValue(12);
  });
});

describe("Counter reset and persistence after reload", () => {
  beforeEach(() => {
    insertDummyCounter(0);
  });

  afterEach(() => {
    closeDBConnection();
  });

  it("should reset the counter to 0 and persist across page reloads", () => {
    expectTestIdToContain("counter-current-count-text", "10", "have.text");
    counterResetBtn().click();
    cy.contains("Reset Tasbeeh").click();
    assertDatabaseActiveCounterValue(0);
    cy.reload();
    assertDatabaseActiveCounterValue(0);
  });

  it("should reset the counter to 0 multiple times, increment and persist across page reloads", () => {
    expectTestIdToContain("counter-current-count-text", "10", "have.text");
    assertDatabaseActiveCounterValue(10);

    counterResetBtn().click();
    cy.contains("Reset Tasbeeh").click();
    assertDatabaseActiveCounterValue(0);
    expectTestIdToContain("counter-current-count-text", "0", "have.text");

    counterCurrentCountText().click();
    expectTestIdToContain("counter-current-count-text", "1", "have.text");
    assertDatabaseActiveCounterValue(1);
    cy.reload();
    assertDatabaseActiveCounterValue(1);

    counterResetBtn().click();
    cy.contains("Reset Tasbeeh").click();
    assertDatabaseActiveCounterValue(0);
    expectTestIdToContain("counter-current-count-text", "0", "have.text");
    cy.reload();
    assertDatabaseActiveCounterValue(0);
    expectTestIdToContain("counter-current-count-text", "0", "have.text");

    counterCurrentCountText().click().click();
    assertDatabaseActiveCounterValue(2);
    expectTestIdToContain("counter-current-count-text", "2", "have.text");

    counterResetBtn().click();
    cy.contains("Reset Tasbeeh").click();
    assertDatabaseActiveCounterValue(0);
    expectTestIdToContain("counter-current-count-text", "0", "have.text");
  });
});

describe("Counter target text behaviour", () => {
  beforeEach(() => {
    insertDummyCounter(1);
  });

  afterEach(() => {
    closeDBConnection();
  });
  // ! Below test is causing alot of DB race conditions
  // it("updates and persists correct percentage as counter increases and reaches/exceeds target", () => {
  //   expectTestIdToContain("active-counter-name", "Counter 2", "contain");
  //   expectTestIdToContain("counter-current-count-text", "0", "have.text");

  //   counterCurrentCountText().click();
  //   expectTestIdToContain("counter-progress-percent-text", "20%", "have.text");
  //   counterCurrentCountText().click();
  //   expectTestIdToContain("counter-progress-percent-text", "40%", "have.text");
  //   cy.reload();
  //   expectTestIdToContain("counter-progress-percent-text", "40%", "have.text");
  //   counterCurrentCountText().click().click().click();
  //   expectTestIdToContain("counter-progress-percent-text", "100%", "have.text");
  //   cy.reload();
  //   expectTestIdToContain("counter-progress-percent-text", "100%", "have.text");
  //   counterCurrentCountText().click().click();
  //   expectTestIdToContain("counter-progress-percent-text", "100%", "have.text");
  //   cy.reload();
  //   expectTestIdToContain("counter-progress-percent-text", "100%", "have.text");
  // });
});

describe("Counter button accessibility", () => {
  beforeEach(() => {
    insertDummyCounter(1);
  });

  it("should have the correct aria-label", () => {
    counterIncrementBtn()
      .should("have.attr", "aria-label")
      .and(
        "include",
        `Increase counter for ${DUMMY_COUNTERS[1].name}, current value is 0`
      );
  });

  it("should update aria-label correct after incrementing the counter", () => {
    counterIncrementBtn().click();
    counterIncrementBtn()
      .should("have.attr", "aria-label")
      .and(
        "include",
        `Increase counter for ${DUMMY_COUNTERS[1].name}, current value is 1`
      );
  });
});

describe.only("Counter incrementing with auto-switch enabled", () => {
  beforeEach(() => {
    resetDBAndLocalStorage();
    // insertDummyCounter(1);
  });

  it("increments counter and switches to next counter when target is reached", () => {
    cy.visit("SettingsPage");
    cy.get('[data-testid="auto-counter-switch-toggle"]').click();
    cy.visit("/");
    for (let i = 0; i < DEFAULT_COUNTERS[0].target; i++) {
      counterIncrementBtn().click();
    }
    expectTestIdToContain("active-counter-name", "Subhanallah", "contain");
    for (let i = 0; i < DEFAULT_COUNTERS[1].target; i++) {
      counterIncrementBtn().click();
    }
  });

  it("should display switch now and cancel buttons when next counter is being loaded", () => {
    cy.visit("SettingsPage");
    cy.get('[data-testid="auto-counter-switch-toggle"]').click();
    cy.visit("/");
    for (let i = 0; i < DEFAULT_COUNTERS[0].target; i++) {
      counterIncrementBtn().click();
    }

    cy.contains("Cancel").should("be.visible");
    cy.contains("Switch now").should("be.visible");
  });
});
