const mongoose = require('mongoose')
//Model for Medium Articles
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountype: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})
module.exports = mongoose.model('users', UserSchema)