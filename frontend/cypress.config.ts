import { defineConfig } from 'cypress'
import { configurePlugin } from 'cypress-mongodb'
import { TEST_MONGODB_URI } from './src/App'
/**
 * @type {Cypress.PluginConfig}
 */

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      configurePlugin(on)
    },
  },
  retries: {
    // Configure retry attempts for `cypress run`
    // Default is 0
    runMode: 2,
    // Configure retry attempts for `cypress open`
    // Default is 0
    openMode: 1,
  },
  env: {
    mongodb: {
      uri: TEST_MONGODB_URI,
    },
  },
})
