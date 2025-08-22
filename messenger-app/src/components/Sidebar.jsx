import React from 'react';

/**
 * Компонент боковой панели для отображения списка чатов и адресной книги
 * @param {Object} props - Свойства компонента
 * @param {Array} props.chats - Список чатов
 * @param {Array} props.users - Список пользователей
 * @param {Object} props.selectedChat - Текущий выбранный чат
 * @param {boolean} props.showAddressBook - Флаг отображения адресной книги
 * @param {Function} props.setShowAddressBook - Установка флага адресной книги
 * @param {Function} props.setSelectedChat - Установка текущего чата
 * @param {Function} props.createPrivateChat - Создание приватного чата
 */
const Sidebar = ({
  chats,
  users,
  selectedChat,
  showAddressBook,
  setShowAddressBook,
  setSelectedChat,
  createPrivateChat,
}) => {
  /**
   * Обработка клика по чату
   * @param {Object} chat - Чат
   */
  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    console.log('Выбран чат:', chat.chatId);
  };

  /**
   * Обработка клика по пользователю для создания чата
   * @param {string} userId - ID пользователя
   */
  const handleUserClick = (userId) => {
    createPrivateChat(userId);
  };

  return (
    <div className="w-64 bg-gray-600 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-50000">
        <button
          className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => setShowAddressBook(!showAddressBook)}
        >
          {showAddressBook ? 'Чаты' : 'Адресная книга'}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {showAddressBook ? (
          <div>
            {users.map((user) => (
              <div
                key={user.userId}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleUserClick(user.userId)}
              >
                {user.fullName} ({user.status})
              </div>
            ))}
          </div>
        ) : (
          <div>
            {chats.map((chat) => (
              <div
                key={chat.chatId} // Уникальный ключ по chatId
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedChat.chatId === chat.chatId ? 'bg-blue-100' : ''}`}
                onClick={() => handleChatClick(chat)}
              >
                {chat.name || chat.chatId}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;