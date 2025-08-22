import React, { useEffect } from 'react';
import Picker from 'emoji-picker-react';
import FilePreview from './FilePreview';

const MessageInput = ({
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
  user,
  files,
  setFiles,
  removeFile,
  fileInputRef,
  handleFileChange,
}) => {
  const handleEmojiButtonClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
    setIsEmojiButtonHovered(false);
  };

  const handleEmojiButtonMouseEnter = () => {
    if (mouseLeaveTimeoutRef.current) {
      clearTimeout(mouseLeaveTimeoutRef.current);
    }
    setIsEmojiButtonHovered(true);
    setShowEmojiPicker(true);
  };

  const handleEmojiButtonMouseLeave = () => {
    mouseLeaveTimeoutRef.current = setTimeout(() => {
      setIsEmojiButtonHovered(false);
      setShowEmojiPicker(false);
    }, 200);
  };

  const handleEmojiPickerMouseEnter = () => {
    if (mouseLeaveTimeoutRef.current) {
      clearTimeout(mouseLeaveTimeoutRef.current);
    }
  };

  const handleEmojiPickerMouseLeave = () => {
    mouseLeaveTimeoutRef.current = setTimeout(() => {
      setShowEmojiPicker(false);
      setIsEmojiButtonHovered(false);
    }, 200);
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (editingMessage && inputRef.current) {
      inputRef.current.innerText = editingMessage.text;
      inputRef.current.focus();
    }
  }, [editingMessage]);

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      {editingMessage && (
        <div className="flex justify-between mb-2">
          <span>Редактирование сообщения</span>
          <button onClick={handleCancelEdit} className="text-red-500">
            Отмена
          </button>
        </div>
      )}
      <FilePreview files={files} removeFile={removeFile} />
      <div className="flex items-center relative">
        <button
          onClick={handleFileButtonClick}
          className="mr-2"
        >
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828L18 9.414V17a1 1 0 001 1h2a1 1 0 001-1V7a1 1 0 00-1-1h-2a1 1 0 00-1 1v2.586l-4.586-4.586a2 2 0 00-2.828 0z"
            />
          </svg>
        </button>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <div
          ref={inputRef}
          contentEditable
          className="flex-1 p-2 border rounded-lg min-h-[40px] max-h-[50px] overflow-y-auto focus:outline-none"
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение..."
          style={{ whiteSpace: 'pre-wrap' }}
        />
        <button
          ref={emojiButtonRef}
          onClick={handleEmojiButtonClick}
          onMouseEnter={handleEmojiButtonMouseEnter}
          onMouseLeave={handleEmojiButtonMouseLeave}
          className={`ml-2 ${isEmojiButtonHovered ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828A4 4 0 0110 16a4 4 0 01-4.828-1.172M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
        <button
          onMouseDown={handleSendButtonMouseDown}
          onMouseUp={handleSendButtonMouseUp}
          className={`ml-2 p-2 rounded-full ${isSendButtonPressed ? 'bg-blue-600' : 'bg-blue-500'} text-white`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            onMouseEnter={handleEmojiPickerMouseEnter}
            onMouseLeave={handleEmojiPickerMouseLeave}
            className="absolute bottom-16 right-0 bg-white shadow-lg rounded-md border border-gray-200 z-50"
          >
            <Picker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInput;