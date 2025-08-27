import { DBSQLiteValues } from "@capacitor-community/sqlite";
import { LATEST_APP_VERSION } from "../../src/utils/changelog";
import {
  DEFAULT_COUNTERS,
  dictPreferencesDefaultValues,
} from "../../src/utils/constants";
import { counterObjType, userPreferencesType } from "../../src/utils/types";

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
      db.current
        // .open()
        .then(() => db.current.query("SELECT * FROM counterDataTable"))
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
    // .finally(() => db.current.close());
  });
};
// const assertDatabaseActiveCounterValue = (num: number) => {
//   cy.window().then(async (window) => {
//     const db = (window as any).dbConnection;
//     await db.current.open();

//     const countersFromDB = await db.current.query(
//       "SELECT * FROM counterDataTable"
//     );
//     const countersFromDBValues = countersFromDB.values;

//     const activeCounter = countersFromDBValues.find(
//       (counter: counterObjType) => counter.isActive
//     );
//     expect(activeCounter.count).to.equal(num);
//     await db.current.close();
//   });
// };

const expectTestIdToContain = (
  testId: string,
  value: string,
  assertion: "contain" | "have.text"
) => {
  cy.get(`[data-testid="${testId}"]`).should(assertion, value);
};

const DUMMY_COUNTERS_EXISTING_USER: Omit<counterObjType, "id">[] = [
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
    count: 22,
    color: "#EF5350",
    isActive: 0,
    target: 43,
  },
];

function waitForDBReady(retries = 20): Cypress.Chainable<Window> {
  if (retries <= 0) {
    throw new Error("DBReady hasn't become true");
  }

  return cy.window().then((win) => {
    if (win.dbReady) {
      return win;
    } else {
      cy.wait(250);
      return waitForDBReady(retries - 1);
    }
  });
}

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

describe("New user flow with no data present in localStorage or DB", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.clearLocalStorage();

    waitForDBReady()
      .then((win) => {
        const db = (win as any).dbConnection;
        return db.current
          .open()
          .then(() => db.current.run("DELETE FROM userPreferencesTable"))
          .then(() => db.current.run("DELETE FROM counterDataTable"));
      })
      .then(() => {
        cy.reload().then(() => {
          waitForDBReady().then((win) => {
            const db = (win as any).dbConnection;
            return db.current.open();
          });
        });
      });
  });

  afterEach(() => {
    waitForDBReady().then((win) => {
      // cy.window().then((win) => {
      const db = (win as any).dbConnection;
      return db.current.close();
    });
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

        console.log("OBJ: ", userPrefsObj);
        console.log(
          "dictPreferencesDefaultValues: ",
          dictPreferencesDefaultValues
        );

        expect(userPrefsObj).to.deep.equal(dictPreferencesDefaultValues);
      });
  });

  // it("should increment the counter, update value on-screen and store value in the database", () => {
  //   counterCurrentCountText().click().click();
  //   expectTestIdToContain("counter-current-count-text", "2", "have.text");

  //   assertDatabaseActiveCounterValue(2);
  //   cy.reload();
  //   assertDatabaseActiveCounterValue(2);
  // });
});

// describe("New user flow with DEFAULT_COUNTERS inserted", () => {
//   beforeEach(() => {
//     cy.visit("/");
//     cy.wait(2000);
//     // ! Ideally, cy.wait here needs to be replaced by something like the below, where a flag is checked before proceeding as opposed to an arbitray wait time
//     // cy.window().its("dbReady").should("be.true");

//     cy.window()
//       .then(async (window) => {
//         const db = (window as any).dbConnection;

//         await db.current.open();
//         await db.current.run("DELETE FROM counterDataTable");

//         for (let i = 0; i < DEFAULT_COUNTERS.length; i++) {
//           const counterObj = DEFAULT_COUNTERS[i];
//           const isActive = counterObj.isActive === 1 ? 1 : 0;

//           const insertStmnt = `INSERT into counterDataTable(orderIndex, name, count, target, color, isActive) VALUES (?, ?, ?, ?, ?, ?)`;

//           await db.current.run(insertStmnt, [
//             i,
//             counterObj.name,
//             counterObj.count,
//             counterObj.target,
//             null,
//             isActive,
//           ]);
//         }
//         // await db.current.close();
//       })
//       .then(() => {
//         cy.reload();
//       });
//   });

//   it("should display counter with isActive property set to true along with the counters count value", () => {
//     expectTestIdToContain("active-counter-name", "Alhumdulillah", "contain");
//     expectTestIdToContain("counter-current-count-text", "0", "have.text");
//     cy.reload();
//     expectTestIdToContain("active-counter-name", "Alhumdulillah", "contain");
//     expectTestIdToContain("counter-current-count-text", "0", "have.text");
//   });

//   it("should increment the counter, update value on-screen and store value in the database", () => {
//     counterCurrentCountText().click().click();
//     expectTestIdToContain("counter-current-count-text", "2", "have.text");

//     assertDatabaseActiveCounterValue(2);
//     cy.reload();
//     // cy.wait(2000);
//     cy.window()
//       .its("dbReady", { timeout: 4000 })
//       .should("exist")
//       .and("be.true");
//     assertDatabaseActiveCounterValue(2);
//   });
// });

// describe("Existing user flow", () => {
//   beforeEach(() => {
//     cy.visit("/");
//     cy.wait(2000);
//     // ! Ideally, cy.wait here needs to be replaced by something like the below, where a flag is checked before proceeding as opposed to an arbitray wait time
//     // cy.window().its("dbReady").should("be.true");

//     cy.window()
//       .then(async (window) => {
//         const db = (window as any).dbConnection;

//         await db.current.open();
//         await db.current.run("DELETE FROM counterDataTable");

//         for (let i = 0; i < DUMMY_COUNTERS_EXISTING_USER.length; i++) {
//           const counterObj = DUMMY_COUNTERS_EXISTING_USER[i];
//           const isActive = counterObj.isActive === 1 ? 1 : 0;

//           const insertStmnt = `INSERT into counterDataTable(orderIndex, name, count, target, color, isActive) VALUES (?, ?, ?, ?, ?, ?)`;

//           await db.current.run(insertStmnt, [
//             i,
//             counterObj.name,
//             counterObj.count,
//             counterObj.target,
//             null,
//             isActive,
//           ]);
//         }
//         await db.current.close();
//       })
//       .then(() => {
//         cy.reload();
//       });
//   });

//   afterEach(() => {
//     cy.window().then(async (window) => {
//       const db = (window as any).dbConnection;
//       await db.current.close();
//     });
//   });

//   it("should display counter with isActive property set to true along with the counters count value from the mockCountersArr array", () => {
//     expectTestIdToContain("active-counter-name", "Counter 1", "contain");
//     expectTestIdToContain("counter-current-count-text", "10", "have.text");
//   });

//   it("should increment the counter, update value on-screen and store value in the database", () => {
//     counterCurrentCountText().click().click();
//     expectTestIdToContain("counter-current-count-text", "12", "have.text");

//     assertDatabaseActiveCounterValue(12);
//     cy.reload();
//     cy.wait(2000);
//     assertDatabaseActiveCounterValue(12);
//   });
// });

// describe("Counter goal text", () => {
//   beforeEach(() => {
//     cy.visit("/");
//     cy.wait(2000);
//     // ! Ideally, cy.wait here needs to be replaced by something like the below, where a flag is checked before proceeding as opposed to an arbitray wait time
//     // cy.window().its("dbReady").should("be.true");

//     cy.window()
//       .then(async (window) => {
//         const db = (window as any).dbConnection;

//         await db.current.open();
//         await db.current.run("DELETE FROM counterDataTable");

//         for (let i = 0; i < DUMMY_COUNTERS_EXISTING_USER.length; i++) {
//           const counterObj = DUMMY_COUNTERS_EXISTING_USER[i];
//           const isActive = counterObj.isActive === 1 ? 1 : 0;

//           const insertStmnt = `INSERT into counterDataTable(orderIndex, name, count, target, color, isActive) VALUES (?, ?, ?, ?, ?, ?)`;

//           await db.current.run(insertStmnt, [
//             i,
//             counterObj.name,
//             counterObj.count,
//             counterObj.target,
//             null,
//             isActive,
//           ]);
//         }
//         await db.current.close();
//       })
//       .then(() => {
//         cy.reload();
//       });
//   });

//   it("displays the correct target value next to the counter", () => {
//     expectTestIdToContain("counter-target-text", "of 50", "have.text");
//   });
// });

// describe("Counter reset and persistence after reload", () => {
//   beforeEach(() => {
//     // cy.clearLocalStorage();
//     cy.visit("/", {
//       onBeforeLoad(win) {
//         win.localStorage.setItem(
//           "localSavedCountersArray",
//           JSON.stringify([
//             {
//               counter: "Dummy Counter 1",
//               count: 10,
//               color: "#EF5350",
//               isActive: true,
//               target: 50,
//               id: "random identifier 1",
//             },
//             // {
//             //   counter: "Dummy Counter 2",
//             //   count: 99,
//             //   color: "#EF5350",
//             //   isActive: true,
//             //   target: 100,
//             //   id: "random identifier 2",
//             // },
//           ])
//         );
//         win.localStorage.setItem("appVersion", LATEST_APP_VERSION);
//       },
//     });
//   });

//   it("should reset the counter to 0 and persist across page reloads", () => {
//     expectTestIdToContain("counter-current-count-text", "10", "have.text");
//     counterResetBtn().click();
//     assertDatabaseActiveCounterValue(0);
//     cy.reload();
//     assertDatabaseActiveCounterValue(0);
//   });

//   it("should reset the counter to 0 multiple times, increment and persist across page reloads", () => {
//     expectTestIdToContain("counter-current-count-text", "10", "have.text");
//     assertDatabaseActiveCounterValue(10);

//     counterResetBtn().click();
//     assertDatabaseActiveCounterValue(0);
//     expectTestIdToContain("counter-current-count-text", "0", "have.text");

//     counterCurrentCountText().click();
//     expectTestIdToContain("counter-current-count-text", "1", "have.text");
//     assertDatabaseActiveCounterValue(1);
//     cy.reload();
//     assertDatabaseActiveCounterValue(1);

//     counterResetBtn().click();
//     assertDatabaseActiveCounterValue(0);
//     expectTestIdToContain("counter-current-count-text", "0", "have.text");
//     cy.reload();
//     assertDatabaseActiveCounterValue(0);
//     expectTestIdToContain("counter-current-count-text", "0", "have.text");

//     counterCurrentCountText().click().click();
//     assertDatabaseActiveCounterValue(2);
//     expectTestIdToContain("counter-current-count-text", "2", "have.text");

//     counterResetBtn().click();
//     assertDatabaseActiveCounterValue(0);
//     expectTestIdToContain("counter-current-count-text", "0", "have.text");
//   });
// });

// describe("Counter target text behaviour", () => {
//   beforeEach(() => {
//     cy.visit("/", {
//       onBeforeLoad(win) {
//         win.localStorage.setItem(
//           "localSavedCountersArray",
//           JSON.stringify([
//             {
//               counter: "Dummy Counter",
//               count: 0,
//               color: "#EF5350",
//               isActive: true,
//               target: 5,
//               id: "random identifier 1",
//             },
//           ])
//         );
//         win.localStorage.setItem("appVersion", LATEST_APP_VERSION);
//       },
//     });
//   });

//   it("updates and persists correct percentage as counter increases and reaches/exceeds target", () => {
//     expectTestIdToContain("active-counter-name", "Dummy Counter", "contain");
//     expectTestIdToContain("counter-current-count-text", "0", "have.text");

//     counterCurrentCountText().click();
//     expectTestIdToContain("counter-progress-percent-text", "20%", "have.text");
//     counterCurrentCountText().click();
//     expectTestIdToContain("counter-progress-percent-text", "40%", "have.text");
//     cy.reload();
//     expectTestIdToContain("counter-progress-percent-text", "40%", "have.text");
//     counterCurrentCountText().click().click().click();
//     // clickIncrement(counterCurrentCountText(), 3);
//     expectTestIdToContain("counter-progress-percent-text", "100%", "have.text");
//     cy.reload();
//     expectTestIdToContain("counter-progress-percent-text", "100%", "have.text");
//     counterCurrentCountText().click().click();
//     expectTestIdToContain("counter-progress-percent-text", "100%", "have.text");
//     cy.reload();
//     expectTestIdToContain("counter-progress-percent-text", "100%", "have.text");
//   });
// });

// describe("Counter button accessibility", () => {
//   beforeEach(() => {
//     cy.visit("/", {
//       onBeforeLoad(win) {
//         win.localStorage.setItem(
//           "localSavedCountersArray",
//           JSON.stringify([
//             {
//               counter: "Dummy Counter",
//               count: 0,
//               color: "#EF5350",
//               isActive: true,
//               target: 5,
//               id: "random identifier 1",
//             },
//           ])
//         );
//         win.localStorage.setItem("appVersion", LATEST_APP_VERSION);
//       },
//     });
//   });
//   it("should have the correct aria-label", () => {
//     counterIncrementBtn()
//       .should("have.attr", "aria-label")
//       .and("include", "Increase counter for Dummy Counter, current value is 0");
//   });

//   it("should update aria-label correct after incrementing the counter", () => {
//     counterIncrementBtn().click();
//     counterIncrementBtn()
//       .should("have.attr", "aria-label")
//       .and("include", "Increase counter for Dummy Counter, current value is 1");
//   });
// });
