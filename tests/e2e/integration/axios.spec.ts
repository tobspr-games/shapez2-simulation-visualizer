/// <reference types="cypress" />
describe("Axios Test", () => {
  it("Shows correct headlines", () => {
    cy.visit(`/axios`);
    cy.contains("h1", "Axios page.");
    cy.contains("h3", "Current repository:");
    cy.contains("h3", "My others repositories:");
  });
});
