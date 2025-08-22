const mongoose = require('mongoose');

/**
 * Схема для модели сообщения в Mongoose
 */
const messageSchema = new mongoose.Schema({
  chat: String, // ID чата
  username: String, // Имя пользователя
  fullName: String, // Полное имя пользователя
  text: String, // Текст сообщения
  type: String, // Тип сообщения (text)
  timestamp: Date, // Время отправки
  edited: { type: Boolean, default: false }, // Флаг редактирования
});

/**
 * Модель сообщения
 */
module.exports = mongoose.model('Message', messageSchema);