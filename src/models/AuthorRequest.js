const mongoose = require('mongoose')
const { Schema } = mongoose

const AuthorRequest = new Schema({
  date: { type: Date, default: Date.now },
  email2: {
    type: String,
    required: [true, 'This field is required'],
    minlength: [5, 'This field must have at least 5 characters'],
    maxlength: [40, 'This field must have at most 40 characters'],
  },
  professionalCard: {
    type: String,
    required: [true, 'This field is required'],
    minlength: [5, 'This field must have at least 5 characters'],
    maxlength: [40, 'This field must have at most 40 characters'],
  },
  employmentHistory: {
    type: String,
    required: [true, 'This field is required'],
    minlength: [5, 'This field must have at least 5 characters'],
    maxlength: [40, 'This field must have at most 40 characters'],
  },
  academicHistory: {
    type: String,
    required: [true, 'This field is required'],
    minlength: [5, 'This field must have at least 5 characters'],
    maxlength: [40, 'This field must have at most 40 characters'],
  },
  userId: { type: Schema.ObjectId, ref: 'User' },
})

module.exports = mongoose.model('AuthorRequest', AuthorRequest)
