const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 5);

const chatSchema = new mongoose.Schema({
  chatId: { type: String, unique: true, default: () => nanoid() },
  type: String,
  participants: [{ type: String }], // Хранит userId
  name: String,
});

module.exports = mongoose.model('Chat', chatSchema);