import React, { useState } from 'react';

// popup modal for creating threads (shows on /thread or context menu)
export const ThreadCreationModal = ({ isOpen, onClose, initialMessage, onSubmit }) => {
  const [threadName, setThreadName] = useState('');
  const [duration, setDuration] = useState(7);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!threadName.trim()) {
      setError("Thread name is required.");
      return;
    }
    try {
      await onSubmit({ threadName, duration, messageId: initialMessage?.id });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create thread due to permissions.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-white mb-4">Start New Thread</h2>
        
        {initialMessage && (
          <div className="bg-gray-700 p-3 rounded text-sm text-gray-300 mb-4 border-l-4 border-blue-500">
            <span className="font-semibold text-gray-200">{initialMessage.author}:</span> {initialMessage.content}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2">Thread Name</label>
            <input 
              type="text"
              value={threadName}
              onChange={(e) => setThreadName(e.target.value)}
              className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="e.g., Marketing Campaign Discussion"
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2">Archive After Inactivity</label>
            <select 
              value={duration} 
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none"
            >
              <option value={1}>24 Hours</option>
              <option value={3}>3 Days</option>
              <option value={7}>1 Week (Default)</option>
            </select>
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <div className="flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
