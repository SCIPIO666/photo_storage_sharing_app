// src/components/Common/ErrorAlert.jsx
import React from 'react';

const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative mb-4">
      <span className="block sm:inline">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
        >
          <span className="text-red-800">×</span>
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;