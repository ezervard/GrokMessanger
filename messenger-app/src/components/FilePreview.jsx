import React from 'react';

const FilePreview = ({ files, removeFile }) => {
  if (!files || files.length === 0) return null;

  return (
    <div className="mb-2 flex flex-wrap gap-2">
      {files.map((file, index) => (
        <div
          key={`${file.name}-${index}`}
          className="flex items-center bg-gray-100 p-2 rounded-md"
        >
          <span className="text-sm text-gray-700 mr-2">
            {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </span>
          <button
            onClick={() => removeFile(file)}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default FilePreview;