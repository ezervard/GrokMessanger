const express = require('express');
const Message = require('../models/message');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.get('/:chatId', authenticateToken, async (req, res) => {
  console.log(`GET /messages/${req.params.chatId}`);
  try {
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
    
    const forwardedMessage = new Message({
      username: req.user.username,
      chat: targetChatId,
      text: `Переслано от ${originalMessage.fullName}: ${originalMessage.text}`,
      fullName: req.user.fullName || 'Неизвестный пользователь',
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

module.exports = router;