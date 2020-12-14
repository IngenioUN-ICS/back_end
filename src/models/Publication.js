const mongoose = require('mongoose')
const { Schema } = mongoose

const Publication = new Schema({
  date: { type: Date, default: Date.now },
  title: {
    type: String,
    required: true,
    minlength: [5, 'This field must have at least 5 characters'],
    maxlength: [100, 'This field must have at most 100 characters'],
  },
  abstract: {
    type: String,
    required: true,
    minlength: [5, 'This field must have at least 5 characters'],
    maxlength: [1000, 'This field must have at most 1000 characters'],
  },
  keyWords: { type: [String], required: true },
  text: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User' },
  listCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
})

module.exports = mongoose.model('Publication', Publication)
