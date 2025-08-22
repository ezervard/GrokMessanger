const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chats');
const messageRoutes = require('./routes/messages');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://10.185.101.19:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors({ origin: 'http://10.185.101.19:5173' }));
app.use(express.json());
app.use(fileUpload());
app.use('/auth', authRoutes);
app.use('/chats', chatRoutes);
app.use('/messages', messageRoutes);
app.use('/Uploads', express.static('Uploads'));

app.set('io', io);

mongoose.connect('mongodb://localhost/grok_messenger_new', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Подключено к MongoDB');
}).catch((err) => {
  console.error('Ошибка подключения к MongoDB:', err.message);
});

io.on('connection', (socket) => {
  console.log('Socket.IO: Пользователь подключился:', socket.id);
  socket.on('joinChat', (chatId) => {
    console.log(`Socket.IO: Пользователь ${socket.id} присоединился к чату ${chatId}`);
    socket.join(chatId);
  });
  socket.on('message', async (message) => {
    console.log('Socket.IO: Получено сообщение:', message);
    try {
      const newMessage = new (require('./models/message'))({
        ...message,
        fullName: message.fullName || 'Неизвестный пользователь',
      });
      await newMessage.save();
      console.log('Socket.IO: Сохранено новое сообщение:', newMessage);
      io.to(message.chat).emit('message', newMessage);
    } catch (err) {
      console.error('Socket.IO: Ошибка сохранения сообщения:', err.message);
    }
  });
  socket.on('disconnect', () => {
    console.log('Socket.IO: Пользователь отключился:', socket.id);
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});