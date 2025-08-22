// models/message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chat: String, // ID чата
  username: String, // Имя пользователя
  fullName: String, // Полное имя пользователя
  text: String, // Текст сообщения
  type: { type: String, default: 'text' }, // text или file
  timestamp: Date, // Время отправки
  edited: { type: Boolean, default: false }, // Флаг редактирования
  files: [{ // Добавлено поле для файлов
    name: String,
    size: Number,
    type: String,
    url: String,
  }],
});

module.exports = mongoose.model('Message', messageSchema);