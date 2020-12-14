const mongoose = require('mongoose')
const { Schema } = mongoose

const Category = new Schema({
  name: {
    type: String,
    required: [true, 'This field is required'],
    minlength: [5, 'This field must have at least 5 characters'],
    maxlength: [40, 'This field must have at most 40 characters'],
  },
  description: {
    type: String,
    required: [true, 'This field is required'],
    minlength: [5, 'This field must have at least 5 characters'],
    maxlength: [100, 'This field must have at most 100 characters'],
  },
  publications: { type: Number, default: 0 },
})

module.exports = mongoose.model('Category', Category)
