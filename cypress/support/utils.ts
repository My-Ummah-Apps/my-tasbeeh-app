export function waitForDBReady(retries = 20): Cypress.Chainable<Window> {
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

export const openDBConnection = () => {
  return waitForDBReady().then((win) => {
    const db = (win as any).dbConnection;
    return db.current.close();
  });
};

export const closeDBConnection = (): Cypress.Chainable => {
  return waitForDBReady().then((win) => {
    const db = (win as any).dbConnection;
    return db.current.isDBOpen().then((isOpen) => {
      if (isOpen.result) {
        return db.current.close();
      }
    });
  });
};
