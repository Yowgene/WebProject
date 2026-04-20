import React from 'react';
import NewChatButton from './NewChatButton';

export default function Sidebar({ sessions = [], currentSessionId, onSelectSession, onNewChat }) {
  return (
    <div className="hidden md:flex flex-col w-64 bg-[#1e1f20] h-full border-r border-gray-800 shrink-0">
      <div className="p-4">
        <NewChatButton onClick={onNewChat} />
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Recent</div>
        <div className="space-y-1">
          {sessions.map(session => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg truncate transition-colors ${session.id === currentSessionId ? 'bg-[#2a2b2d] text-white' : 'text-gray-300 hover:bg-[#2a2b2d]'}`}
            >
              {session.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
