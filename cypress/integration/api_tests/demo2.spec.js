describe("Amazon test", () => {
  it("Amazon test", () => {
    let date = new Date().toISOString();

    cy.time('test')
    cy.request("https://amazon.com").as("amazon");
    cy.get('@amazon').its('status').should('equal', 200);
    cy.timeEnd('test').then(test => {
      const filename = './cypress/results/testresults.json'

      cy.readFile(filename).then((obj) => {
        obj.results.push({name: "Amazon Test", time: test.duration, timestamp: date});
        cy.writeFile(filename, obj);
      });
    });
  });
});