const { defineConfig } = require('cypress')
const mongo = require('cypress-mongodb')
const { CYPRESS_PROJECT_ID } = require('./utils/config')

module.exports = defineConfig({
  projectId: CYPRESS_PROJECT_ID,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      mongo.configurePlugin(on)
    },
  },
})
