import React, { useEffect } from 'react';

const ChatMessages = ({ user, selectedChat, messages, selectedMessages, setContextMenu, handleMessageClick, messagesEndRef }) => {
  const handleContextMenu = (e, message) => {
    e.preventDefault();
    console.log('Открыто контекстное меню для сообщения:', message);
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      message,
    });
  };

  useEffect(() => {
    console.log(`Рендеринг сообщений для чата ${selectedChat?.chatId}:`, messages[selectedChat?.chatId] || []);
    if (selectedChat && !messages[selectedChat.chatId]) {
      console.warn(`Сообщения для чата ${selectedChat.chatId} отсутствуют в состоянии`);
    }
    // Прокрутка к последнему сообщению
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat, messages]);

  return (
    <>
      {selectedChat ? (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col scroll-container">
          {(messages[selectedChat.chatId] || []).map((msg, index) => (
            <div
              key={msg._id || `temp-${index}`}
              className={`mb-4 ${msg.username === user ? 'text-right' : 'text-left'} message ${
                selectedMessages.includes(msg._id) ? 'message-selected' : ''
              }`}
              onContextMenu={(e) => handleContextMenu(e, msg)}
              onClick={() => handleMessageClick(msg)}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.username === user ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '70%' }}
              >
                <p className="message-username">{msg.fullName || 'Неизвестный пользователь'}</p>
                {msg.text && <p className="message-text">{msg.text}</p>}
                {msg.files && msg.files.length > 0 && (
                  <div className="mt-2">
                    {msg.files.map((file, fileIndex) => (
                      <div key={fileIndex} className="text-sm text-gray-500">
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          📎 {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </a>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center text-xs text-gray-500">
                  {msg.edited && <span className="mr-4">Изменено</span>}
                  <span>{new Date(msg.timestamp).toLocaleTimeString('ru-RU')}</span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Выберите чат, чтобы начать общение
        </div>
      )}
    </>
  );
};

export default ChatMessages;