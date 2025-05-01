import { LATEST_APP_VERSION } from "../../src/utils/changelog";

describe("Home Page - Counter", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        const mockCounters = [
          {
            counter: "Counter 1",
            count: 200,
            color: "#EF5350",
            isActive: true,
            target: 10,
            id: 1,
          },

          {
            counter: "Counter 2",
            count: 20,
            color: "#EC407A",
            isActive: false,
            target: 20,
            id: 2,
          },

          {
            counter: "Counter 3",
            count: 3,
            color: "AB47BC",
            isActive: false,
            target: 50,
            id: 3,
          },
        ];
        win.localStorage.setItem(
          "localSavedCountersArray",
          JSON.stringify(mockCounters)
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
      "Counter 1"
    );
    cy.get('[data-testid="counter-increment-button"]').should("contain", "200");
  });

  it("should increment the counter, update value on-screen and store value in localStorage", () => {
    cy.get('[data-testid="counter-increment-button"]').click().click();
    cy.get('[data-testid="counter-increment-button"]').should("contain", "202");

    cy.window().then((win) => {
      const counters = JSON.parse(
        win.localStorage.getItem("localSavedCountersArray") || "[]"
      );
      const activeCounter = counters.find((counter) => counter.isActive);
      expect(activeCounter.count).to.equal(202);
    });
  });
});

//   it('should persist the counter value across reloads', () => {
//     cy.get('[data-testid="increment-button"]').click();
//     cy.reload();
//     cy.get('[data-testid="counter-value"]').should('contain', '1');
//   });
// });
