import React from 'react';
import { formatDistanceToNow } from 'date-fns'; // hacky mock for timestamps for now

// renders the indented thread box in the main chat feed
export const ThreadInlineBox = ({ thread, onJoinClick }) => {
  if (!thread) return null;

  return (
    <div className="flex mt-2">
      {/* Reply Connecting Line Graphic */}
      <div className="w-8 ml-4 border-l-2 border-b-2 border-gray-600 rounded-bl-lg mb-4"></div>
      
      {/* Thread Container */}
      <div 
        className="flex-1 ml-2 border border-blue-500 rounded-lg p-3 bg-gray-800 hover:bg-gray-750 cursor-pointer transition-colors"
        onClick={() => onJoinClick(thread.id)}
      >
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-blue-400 font-bold text-sm">
            <span className="mr-1">💬</span> {thread.threadName}
          </h4>
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(thread.lastMessageTimestamp))} ago
          </span>
        </div>
        
        {thread.lastMessage && (
          <div className="flex items-center space-x-2">
            <img 
              src={thread.lastMessage.author.avatarUrl || '/default-pfp.png'} 
              alt="pfp" 
              className="w-5 h-5 rounded-full"
            />
            <span className="text-xs font-semibold text-gray-300">
              {thread.lastMessage.author.username}:
            </span>
            <p className="text-sm text-gray-400 truncate">
              {thread.lastMessage.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
