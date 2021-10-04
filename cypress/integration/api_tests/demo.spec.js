describe("Google test", () => {
  it("Google test", () => {
    let date = new Date().toISOString();

    cy.time('test');
    cy.request("https://google.com").as("google");
    cy.get('@google').its('status').should('equal', 200);
    cy.timeEnd('test')
      .then(entry => {
        cy.writeFile('./cypress/results/testresults.json', 
          { 
            results: [ {name: "Google Test", time: entry.duration, timestamp: date }] 
          });
    });
  });
});
