const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
  },
  published: {
    type: Number,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author',
  },
  genres: [{ type: String }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

schema.index({ title: 1, author: 1 }, { unique: true })

schema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
  },
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('Book', schema)
