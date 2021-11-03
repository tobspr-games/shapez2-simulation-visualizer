import { mount } from "@cypress/vue";
import Credits from "./Credits.vue";

it("Check if Credits is correctly prompt", () => {
  mount(Credits, {});

  cy.get("p").should("contain.text", "❤");
  cy.get("a").should("contain.text", "@vinces");
});
