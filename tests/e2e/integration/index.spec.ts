// https://docs.cypress.io/api/introduction/api.html
describe("Homepage Test", () => {
  it("Shows correct headlines", () => {
    cy.visit(`/`);
    cy.contains("h2", "Vue3 + Vite + Typescript Starter");
  });
});
