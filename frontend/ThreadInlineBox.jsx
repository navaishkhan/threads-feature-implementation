import React from 'react';
import { formatDistanceToNow } from 'date-fns';

export const ThreadInlineBox = ({ thread, onJoinClick }) => {
  if (!thread) return null;

  return (
    <div className="flex mt-2 relative w-[500px]">
      
      {/* Reply Connecting Line Graphic (Spine) */}
      <div className="w-8 ml-6 border-l-2 border-b-2 border-[#4E5058] rounded-bl-xl mb-6 mt-[-10px]"></div>
      
      {/* Thread Container */}
      <div 
        className="flex-1 ml-2 border border-[#202225] rounded bg-[#2B2D31] hover:bg-[#313338] cursor-pointer transition-colors shadow-sm overflow-hidden"
        onClick={() => onJoinClick && onJoinClick(thread.id)}
      >
        <div className="p-2.5">
          <div className="flex justify-between items-center mb-1.5">
            <h4 className="text-white font-bold text-sm flex items-center">
              <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
              {thread.threadName || thread.name}
            </h4>
            <span className="text-xs text-gray-400 font-semibold">
              {thread.lastMessageTimestamp ? formatDistanceToNow(new Date(thread.lastMessageTimestamp)) : 'just now'} ago
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-400 hover:text-gray-300 transition-colors">
              {thread.msgCount || 0} Messages
            </span>
            <div className="flex items-center">
              <div className="flex -space-x-1.5 items-center mr-2">
                 <div className="w-4 h-4 rounded-full bg-blue-500 border border-[#2B2D31]"></div>
                 <div className="w-4 h-4 rounded-full bg-red-500 border border-[#2B2D31]"></div>
              </div>
              <span className="text-xs text-blue-400 font-bold hover:underline">View Thread ›</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
