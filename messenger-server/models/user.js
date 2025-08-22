const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 5);

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, default: () => nanoid() },
  username: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  patronymic: String,
  fullName: String,
  status: { type: String, default: 'offline' },
});

module.exports = mongoose.model('User', userSchema);