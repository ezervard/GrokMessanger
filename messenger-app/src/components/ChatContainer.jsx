import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';
import ContextMenu from './ContextMenu';
import ForwardModal from './ForwardModal';

const ChatContainer = ({
  user,
  chats,
  users,
  selectedChat,
  showAddressBook,
  setShowAddressBook,
  setSelectedChat,
  createPrivateChat,
  selectedMessages,
  handleLogout,
  messages,
  handleMessageClick,
  messagesEndRef,
  input,
  setInput,
  inputRef,
  editingMessage,
  showEmojiPicker,
  setShowEmojiPicker,
  isSendButtonPressed,
  setIsSendButtonPressed,
  isEmojiButtonHovered,
  setIsEmojiButtonHovered,
  emojiButtonRef,
  emojiPickerRef,
  mouseLeaveTimeoutRef,
  handleEmojiClick,
  handleSendButtonMouseDown,
  handleSendButtonMouseUp,
  handleKeyDown,
  handleInput,
  handleCancelEdit,
  sendMessage,
  contextMenu,
  setContextMenu,
  contextMenuRef,
  handleEditMessage,
  handleDeleteMessage,
  handleSelectMessage,
  handleForwardMessage,
  showForwardModal,
  setShowForwardModal,
  setForwardMessage,
  handleForwardToChat,
  files,
  setFiles,
  removeFile,
  fileInputRef,
  handleFileChange,
}) => {
  console.log('ChatContainer: Рендеринг с selectedChat:', selectedChat?.chatId);

  const handleContainerContextMenu = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenu.visible && contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        console.log('Клик вне контекстного меню, закрытие');
        setContextMenu({ visible: false, x: 0, y: 0, message: null });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu, setContextMenu]);

  return (
    <div className="flex h-screen bg-gray-100 chat-container" onContextMenu={handleContainerContextMenu}>
      <Sidebar
        chats={chats}
        users={users}
        selectedChat={selectedChat}
        showAddressBook={showAddressBook}
        setShowAddressBook={setShowAddressBook}
        setSelectedChat={setSelectedChat}
        createPrivateChat={createPrivateChat}
      />
      <div className="flex-1 flex flex-col">
        <ChatHeader
          selectedChat={selectedChat}
          selectedMessages={selectedMessages}
          handleLogout={handleLogout}
        />
        <ChatMessages
          user={user}
          selectedChat={selectedChat}
          messages={messages}
          selectedMessages={selectedMessages}
          setContextMenu={setContextMenu}
          handleMessageClick={handleMessageClick}
          messagesEndRef={messagesEndRef}
        />
        <ContextMenu
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          contextMenuRef={contextMenuRef}
          handleEditMessage={handleEditMessage}
          handleDeleteMessage={handleDeleteMessage}
          handleSelectMessage={handleSelectMessage}
          handleForwardMessage={handleForwardMessage}
          user={user}
          selectedMessages={selectedMessages}
        />
        <ForwardModal
          showForwardModal={showForwardModal}
          setShowForwardModal={setShowForwardModal}
          setForwardMessage={setForwardMessage}
          chats={chats}
          handleForwardToChat={handleForwardToChat}
        />
        {selectedChat && (
          <MessageInput
            input={input}
            setInput={setInput}
            inputRef={inputRef}
            editingMessage={editingMessage}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            isSendButtonPressed={isSendButtonPressed}
            setIsSendButtonPressed={setIsSendButtonPressed}
            isEmojiButtonHovered={isEmojiButtonHovered}
            setIsEmojiButtonHovered={setIsEmojiButtonHovered}
            emojiButtonRef={emojiButtonRef}
            emojiPickerRef={emojiPickerRef}
            mouseLeaveTimeoutRef={mouseLeaveTimeoutRef}
            handleEmojiClick={handleEmojiClick}
            handleSendButtonMouseDown={handleSendButtonMouseDown}
            handleSendButtonMouseUp={handleSendButtonMouseUp}
            handleKeyDown={handleKeyDown}
            handleInput={handleInput}
            handleCancelEdit={handleCancelEdit}
            sendMessage={sendMessage}
            user={user}
            files={files}
            setFiles={setFiles}
            removeFile={removeFile}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
          />
        )}
      </div>
    </div>
  );
};

export default ChatContainer;