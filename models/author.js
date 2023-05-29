const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  surname: {
    type: String,
    required: true,
  },
  bookCount: {
    type: Number,
  },
  born: {
    type: Number,
  },
})

schema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
  },
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('Author', schema)
