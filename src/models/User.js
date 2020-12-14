const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { Schema, model } = mongoose

const User = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: [5, 'This field must have at least 5 characters'],
    maxlength: [40, 'This field must have at most 40 characters'],
  },
  lastName: {
    type: String,
    required: true,
    minlength: [5, 'This field must have at least 5 characters'],
    maxlength: [40, 'This field must have at most 40 characters'],
  },
  email1: {
    type: String,
    required: true,
    minlength: [5, 'This field must have at least 5 characters'],
    maxlength: [40, 'This field must have at most 40 characters'],
  },
  password: {
    type: String,
    required: true,
    minlength: [5, 'This field must have at least 5 characters'],
    maxlength: [40, 'This field must have at most 40 characters'],
  },
  description: {
    type: String,
    minlength: [5, 'This field must have at least 5 characters'],
    maxlength: [200, 'This field must have at most 200 characters'],
  },
  email2: {
    type: String,
    minlength: [5, 'This field must have at least 5 characters'],
    maxlength: [40, 'This field must have at most 40 characters'],
  },
  professionalCard: {
    type: String,
    minlength: [5, 'This field must have at least 5 characters'],
    maxlength: [40, 'This field must have at most 40 characters'],
  },
  employmentHistory: {
    type: String,
    minlength: [5, 'This field must have at least 5 characters'],
    maxlength: [40, 'This field must have at most 40 characters'],
  },
  academicHistory: {
    type: String,
    minlength: [5, 'This field must have at least 5 characters'],
    maxlength: [40, 'This field must have at most 40 characters'],
  },
  role: { type: Number, default: 0 },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  subscriptionToCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  subscriptionToAuthors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  savedPublications: [{ type: Schema.Types.ObjectId, ref: 'Publication' }],
  myPublications: [{ type: Schema.Types.ObjectId, ref: 'Publication' }],
})

User.methods.encryptPassword = async password => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

User.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

User.methods.emailIsValid = function (email) {
  var exp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/
  return exp.test(email)
}

User.methods.passwordIsValid = function (password) {
  var exp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
  return exp.test(password)
}

module.exports = model('User', User)
