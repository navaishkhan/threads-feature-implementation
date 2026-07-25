import React, { useState } from 'react';

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
      setError(err.message || "Failed to create thread.");
    }
  };

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 animate-[fadeIn_0.15s_ease-out]">
      <div className="bg-[#313338] w-[460px] rounded-lg shadow-2xl flex flex-col overflow-hidden border border-[#1E1F22]">
        
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-100 flex items-center">
               <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
               Create Thread
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <p className="text-sm text-gray-400">Start a new conversation based on this message.</p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="px-6 flex-1">
          <div className="space-y-5 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-2">Thread Name</label>
              <input 
                type="text" 
                value={threadName}
                onChange={(e) => setThreadName(e.target.value)}
                placeholder="Name your thread..."
                className="w-full bg-[#1E1F22] text-gray-100 px-3 py-2.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-2">Archive After Inactivity</label>
              <select 
                value={duration} 
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-[#1E1F22] text-gray-100 px-3 py-2.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value={1}>1 Hour</option>
                <option value={24}>24 Hours</option>
                <option value={72}>3 Days</option>
                <option value={168}>1 Week</option>
              </select>
            </div>
          </div>
          
          {error && <div className="text-red-400 text-xs font-bold mb-4">{error}</div>}
        </form>

        {/* Footer */}
        <div className="bg-[#2B2D31] p-4 flex justify-end items-center px-6">
          <button 
            type="button" 
            onClick={onClose} 
            className="text-white text-sm font-semibold hover:underline mr-6 cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-semibold px-6 py-2.5 rounded transition-colors"
          >
            Create Thread
          </button>
        </div>
      </div>
    </div>
  );
};
