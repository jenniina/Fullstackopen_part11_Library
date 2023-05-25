require('dotenv').config()

const PORT = process.env.PORT || 4000

const MONGODB_URI =
  process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI

const MONGO_DB_PART = process.env.MONGO_DB_PART
module.exports = {
  PORT,
  MONGODB_URI,
  MONGO_DB_PART,
}
