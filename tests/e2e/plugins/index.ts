import path from "path";
import { startDevServer } from "@cypress/vite-dev-server";
/// <reference types="cypress" />

module.exports = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): void | Cypress.ConfigOptions | Promise<Cypress.ConfigOptions> => {
  on("dev-server:start", async (options: Cypress.DevServerConfig) => {
    return startDevServer({
      options,
      /*
      viteConfig: {
        configFile: path.resolve(__dirname, "..", "..", "..", "vite.config.ts"),
      },
      */
    });
  });
};
