import { mount } from "@cypress/vue";
import Navigation from "./Navigation.vue";

it("Check if Navigation is correctly prompt", () => {
  mount(Navigation, {});

  cy.get(".navigation").find("router-link").should("have.length", 3);
  cy.get(".navigation").find("a.toggleTheme").should("have.length", 1);
});
