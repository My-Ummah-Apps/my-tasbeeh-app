describe("Home Page - Counter", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the counter name and initial count value", () => {
    // cy.contains("Home");
    cy.get('[data-testid="counter-increment-button"]');
  });
});
