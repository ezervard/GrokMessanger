// routes/messages.js (замените существующий файл)
const express = require('express');
const Message = require('../models/message');
const Chat = require('../models/chat');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.get('/:chatId', authenticateToken, async (req, res) => {
  console.log(`GET /messages/${req.params.chatId}`);
  try {
    const chat = await Chat.findOne({ chatId: req.params.chatId });
    if (!chat || !chat.participants.includes(req.user.userId)) {
      return res.status(403).json({ error: 'Нет доступа к чату' });
    }
    const messages = await Message.find({ chat: req.params.chatId });
    console.log(`Загружены сообщения для чата ${req.params.chatId}:`, messages.length);
    res.json(messages);
  } catch (err) {
    console.error('Ошибка загрузки сообщений:', err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.put('/:messageId', authenticateToken, async (req, res) => {
  console.log(`PUT /messages/${req.params.messageId}`);
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ error: 'Сообщение не найдено' });
    const chat = await Chat.findOne({ chatId: message.chat });
    if (!chat || !chat.participants.includes(req.user.userId)) {
      return res.status(403).json({ error: 'Нет доступа к чату' });
    }
    if (message.username !== req.user.username) {
      return res.status(403).json({ error: 'Нет прав для редактирования' });
    }
    message.text = req.body.text;
    message.edited = true;
    await message.save();
    req.app.get('io').to(message.chat).emit('messageUpdated', message);
    console.log('Сообщение обновлено:', message);
    res.json(message);
  } catch (err) {
    console.error('Ошибка редактирования сообщения:', err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.delete('/:messageId', authenticateToken, async (req, res) => {
  console.log(`DELETE /messages/${req.params.messageId}`);
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ error: 'Сообщение не найдено' });
    const chat = await Chat.findOne({ chatId: message.chat });
    if (!chat || !chat.participants.includes(req.user.userId)) {
      return res.status(403).json({ error: 'Нет доступа к чату' });
    }
    if (message.username !== req.user.username) {
      return res.status(403).json({ error: 'Нет прав для удаления' });
    }
    await message.deleteOne();
    req.app.get('io').to(message.chat).emit('messageDeleted', {
      messageId: req.params.messageId,
      chatId: message.chat,
    });
    console.log('Сообщение удалено:', req.params.messageId);
    res.status(204).send();
  } catch (err) {
    console.error('Ошибка удаления сообщения:', err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/forward', authenticateToken, async (req, res) => {
  console.log('POST /messages/forward');
  try {
    const { messageId, targetChatId } = req.body;
    const originalMessage = await Message.findById(messageId);
    if (!originalMessage) return res.status(404).json({ error: 'Сообщение не найдено' });
    const originalChat = await Chat.findOne({ chatId: originalMessage.chat });
    const targetChat = await Chat.findOne({ chatId: targetChatId });
    if (!originalChat || !originalChat.participants.includes(req.user.userId) ||
        !targetChat || !targetChat.participants.includes(req.user.userId)) {
      return res.status(403).json({ error: 'Нет доступа к чату' });
    }
    const forwardedMessage = new Message({
      username: req.user.username,
      chat: targetChatId,
      text: `Переслано от ${originalMessage.fullName}: ${originalMessage.text}`,
      fullName: req.user.fullName,
      type: originalMessage.type,
      timestamp: new Date(),
    });
    await forwardedMessage.save();
    req.app.get('io').to(targetChatId).emit('message', forwardedMessage);
    console.log('Сообщение переслано:', forwardedMessage);
    res.json(forwardedMessage);
  } catch (err) {
    console.error('Ошибка пересылки сообщения:', err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/upload', authenticateToken, async (req, res) => {
  console.log('POST /messages/upload');
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'Файлы не загружены' });
    }
    const { chatId, username, fullName, text } = req.body;
    const chat = await Chat.findOne({ chatId });
    if (!chat || !chat.participants.includes(req.user.userId)) {
      return res.status(403).json({ error: 'Нет доступа к чату' });
    }
    if (username !== req.user.username) {
      return res.status(403).json({ error: 'Неверный пользователь' });
    }
    const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
    const fileUrls = [];
    for (const file of files) {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(__dirname, '../Uploads', fileName);
      await file.mv(filePath);
      fileUrls.push(`/Uploads/${fileName}`);
    }
    const message = new Message({
      username,
      chat: chatId,
      text: text || '',
      fullName: fullName || 'Неизвестный пользователь',
      type: 'file',
      files: fileUrls.map((url, index) => ({
        name: files[index].name,
        size: files[index].size,
        type: files[index].type,
        url,
      })),
      timestamp: new Date(),
    });
    await message.save();
    req.app.get('io').to(chatId).emit('message', message);
    console.log('Файлы загружены, сообщение создано:', message);
    res.json({ fileUrls });
  } catch (err) {
    console.error('Ошибка загрузки файлов:', err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;