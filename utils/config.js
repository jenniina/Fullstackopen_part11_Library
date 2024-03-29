require('dotenv').config()

const PORT = process.env.PORT || 4000

const MONGODB_URI =
  process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI

// const MONGODB_URI =
//   process.env.NODE_ENV === 'test' ? 'mongodb://127.0.0.1:27017' : process.env.MONGODB_URI

const BUILD = process.env.NODE_ENV === 'test' ? 'frontend/build-test' : 'frontend/build'

const AUTH = process.env.AUTH

const CYPRESS_PROJECT_ID = process.env.CYPRESS_PROJECT_ID

module.exports = {
  PORT,
  MONGODB_URI,
  BUILD,
  AUTH,
  CYPRESS_PROJECT_ID,
}
