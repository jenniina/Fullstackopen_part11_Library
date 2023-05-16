const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    minlength: 8,
    required: true,
  },
  favoriteGenre: {
    type: String,
    required: true,
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
})
schema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
  },
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('User', schema)
