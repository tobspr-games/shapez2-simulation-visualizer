/// <reference types="cypress" />
describe("About Test", () => {
  it("Shows correct headlines", () => {
    cy.visit(`/about`);
    cy.contains("h1", "About page.");
  });
});
