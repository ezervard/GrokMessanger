import React from 'react';

const Sidebar = ({
  chats,
  users,
  selectedChat,
  showAddressBook,
  setShowAddressBook,
  setSelectedChat,
  createPrivateChat,
}) => {
  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    console.log('Выбран чат:', chat.chatId);
  };

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
            {chats.length > 0 ? (
              chats.map((chat) => (
                <div
                  key={chat.chatId}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    selectedChat && selectedChat.chatId === chat.chatId ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => handleChatClick(chat)}
                >
                  {chat.name || chat.chatId}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">Нет доступных чатов</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;