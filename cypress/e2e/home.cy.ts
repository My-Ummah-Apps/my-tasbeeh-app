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
  cy.window().then(async (window) => {
    const db = (window as any).dbConnection;
    await db.current.open();

    const countersFromDB = await db.current.query(
      "SELECT * FROM counterDataTable"
    );
    const countersFromDBValues = countersFromDB.values;

    // const counters = JSON.parse(
    //   window.localStorage.getItem("localSavedCountersArray") || "[]"
    // );
    const activeCounter = countersFromDBValues.find(
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

describe("New user flow with no data present in localStorage or DB", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.wait(2000);

    // cy.window().its("dbReady").should("be.true");

    cy.window().then(async (window) => {
      const db = (window as any).dbConnection;
      console.log("db IS: ", db);

      await db.current.open();
      await db.current.run("DELETE FROM userPreferencesTable");
      const params = Object.keys(dictPreferencesDefaultValues)
        .map((key) => {
          const value =
            dictPreferencesDefaultValues[key as keyof userPreferencesType];
          return [key, Array.isArray(value) ? value.join(",") : value];
        })
        .flat();

      const placeholders = Array(params.length / 2)
        .fill("(?, ?)")
        .join(", ");

      const insertStmnt = `
            INSERT OR IGNORE INTO userPreferencesTable (preferenceName, preferenceValue) 
            VALUES ${placeholders};
            `;

      await db.current.run(insertStmnt, params);

      await db.current.run("DELETE FROM counterDataTable");

      for (let i = 0; i < DEFAULT_COUNTERS.length; i++) {
        const counterObj = DEFAULT_COUNTERS[i];
        const isActive = counterObj.isActive === 1 ? 1 : 0;

        const insertStmnt = `INSERT into counterDataTable(orderIndex, name, count, target, color, isActive) VALUES (?, ?, ?, ?, ?, ?)`;

        await db.current.run(insertStmnt, [
          i,
          counterObj.name,
          counterObj.count,
          counterObj.target,
          null,
          isActive,
        ]);
      }
      await db.current.close();
    });
  });

  it("should match DEFAULT_COUNTERS", () => {
    cy.window().then(async (window) => {
      const db = (window as any).dbConnection;
      await db.current.open();

      const countersFromDB = await db.current.query(
        "SELECT * FROM counterDataTable"
      );
      const countersFromDBValues = countersFromDB.values;
      console.log("countersFromDB.value ", countersFromDB.values);
      console.log("DEFAULT_COUNTERS: ", DEFAULT_COUNTERS);

      expect(countersFromDBValues.length).to.be.greaterThan(0);

      const removeIdsFromCounters = (arr: counterObjType[]) => {
        return arr.map(({ id, ...counter }) => counter);
      };

      expect(removeIdsFromCounters(countersFromDBValues)).to.deep.equal(
        DEFAULT_COUNTERS
      );
    });
  });

  it("should initialise with DEFAULT_COUNTERS and display the active counter", () => {
    expectTestIdToContain("active-counter-name", "Alhumdulillah", "contain");
    expectTestIdToContain("counter-current-count-text", "0", "have.text");
  });

  it("should increment the counter, update value on-screen and store value in the database", () => {
    counterCurrentCountText().click().click();
    expectTestIdToContain("counter-current-count-text", "2", "have.text");

    assertDatabaseActiveCounterValue(2);
    cy.reload();
    cy.wait(2000);
    assertDatabaseActiveCounterValue(2);
  });
});

// describe("New user flow with DEFAULT_COUNTERS inserted", () => {
//   beforeEach(() => {
//     cy.visit("/", {
//       onBeforeLoad(win) {
//         win.localStorage.setItem(
//           "localSavedCountersArray",
//           JSON.stringify(DEFAULT_COUNTERS)
//         );
//         win.localStorage.setItem("appVersion", LATEST_APP_VERSION);
//       },
//     });
//   });

//   it("should display counter with isActive property set to true along with the counters count value", () => {
//     expectTestIdToContain("active-counter-name", "Alhumdulillah", "contain");
//     expectTestIdToContain("counter-current-count-text", "0", "have.text");
//     cy.reload();
//     expectTestIdToContain("active-counter-name", "Alhumdulillah", "contain");
//     expectTestIdToContain("counter-current-count-text", "0", "have.text");
//   });

//   it("should increment the counter, update value on-screen and store value in localStorage", () => {
//     counterCurrentCountText().click().click();
//     expectTestIdToContain("counter-current-count-text", "2", "have.text");

//     assertDatabaseActiveCounterValue(2);
//     cy.reload();
//     assertDatabaseActiveCounterValue(2);
//   });
// });

// describe("Existing user flow", () => {
//   beforeEach(() => {
//     cy.visit("/", {
//       onBeforeLoad(win) {
//         win.localStorage.setItem(
//           "localSavedCountersArray",
//           JSON.stringify([
//             {
//               counter: "Counter 1",
//               count: 10,
//               color: "#EF5350",
//               isActive: true,
//               target: 50,
//               id: "random identifier 1",
//             },
//             {
//               counter: "Counter 2",
//               count: 22,
//               color: "#EF5350",
//               isActive: false,
//               target: 43,
//               id: "random identifier 2",
//             },
//           ])
//         );
//         win.localStorage.setItem("appVersion", LATEST_APP_VERSION);
//       },
//     });
//   });

//   it("should display counter with isActive property set to true along with the counters count value from the mockCountersArr array", () => {
//     expectTestIdToContain("active-counter-name", "Counter 1", "contain");
//     expectTestIdToContain("counter-current-count-text", "10", "have.text");
//   });

//   it("should increment the counter, update value on-screen and store value in localStorage", () => {
//     counterCurrentCountText().click().click();
//     expectTestIdToContain("counter-current-count-text", "12", "have.text");

//     assertDatabaseActiveCounterValue(12);
//     cy.reload();
//     assertDatabaseActiveCounterValue(12);
//   });
// });

// describe("Counter goal text", () => {
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

//   it("displays the correct target value next to the counter", () => {
//     expectTestIdToContain("counter-target-text", "of 5", "have.text");
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
