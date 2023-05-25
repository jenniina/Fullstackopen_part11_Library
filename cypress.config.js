const { defineConfig } = require('cypress')
const mongo = require('cypress-mongodb')
const MONGO_DB_PART = require('./utils/config')

const PART = String(MONGO_DB_PART)

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      mongo.configurePlugin(on)
    },
  },
  env: {
    mongodb: {
      uri: 'mongodb://127.0.0.1:27017',
      database: 'testLibrary',
    },
  },
})
