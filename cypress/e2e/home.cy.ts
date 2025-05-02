import { LATEST_APP_VERSION } from "../../src/utils/changelog";
import { DEFAULT_COUNTERS } from "../../src/utils/constants";
import { counterObjType } from "../../src/utils/types";

describe("Home Page - Counter", () => {
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

  it("should display homepage heading", () => {
    cy.contains("Home");
  });

  it("should display the counter name and initial count value", () => {
    cy.get('[data-testid="active-counter-name"]').should(
      "contain",
      "Alhumdulillah"
    );
    cy.get('[data-testid="counter-increment-button"]').should("contain", "0");
  });

  it("should increment the counter, update value on-screen and store value in localStorage", () => {
    cy.get('[data-testid="counter-increment-button"]').click().click();
    cy.get('[data-testid="counter-increment-button"]').should("contain", "2");

    cy.window().then((win) => {
      const counters = JSON.parse(
        win.localStorage.getItem("localSavedCountersArray") || "[]"
      );
      const activeCounter = counters.find(
        (counter: counterObjType) => counter.isActive
      );
      expect(activeCounter.count).to.equal(2);
    });
  });
});

//   it('should persist the counter value across reloads', () => {
//     cy.get('[data-testid="increment-button"]').click();
//     cy.reload();
//     cy.get('[data-testid="counter-value"]').should('contain', '1');
//   });
// });
