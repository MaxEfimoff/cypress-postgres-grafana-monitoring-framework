describe("Netflix test", () => {
  it("Netflix test", () => {
    let date = new Date().toISOString();
    
    cy.time('test');
    cy.request("https://netflix.com").as("netflix");
    cy.get('@netflix').its('status').should('equal', 200);
    cy.timeEnd('test').then(test => {
      const filename = './cypress/results/testresults.json'

      cy.readFile(filename).then((obj) => {
        obj.results.push({name: "netflix Test", time: test.duration, timestamp: date});
        cy.writeFile(filename, obj);
      });
    });
  });
});