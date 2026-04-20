import { useState } from 'react';
import Chat from './Chat.jsx';
import Sidebar from './Sidebar.jsx';

export default function MainLayout() {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(() => Math.random().toString(36).substring(7));

  // Get the messages for the currently active session
  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession ? currentSession.messages : [];

  // Custom setMessages function to update the global session state
  const setMessages = (newMessagesFn) => {
    setSessions(prevSessions => {
      const sessionExists = prevSessions.find(s => s.id === currentSessionId);
      const prevMessages = sessionExists ? sessionExists.messages : [];
      const newMessages = typeof newMessagesFn === 'function' ? newMessagesFn(prevMessages) : newMessagesFn;

      const firstUserMsg = newMessages.find(m => m.role === 'user');
      const title = firstUserMsg ? firstUserMsg.text.slice(0, 30) + (firstUserMsg.text.length > 30 ? '...' : '') : 'New Chat';

      if (sessionExists) {
        return prevSessions.map(s => s.id === currentSessionId ? { ...s, title, messages: newMessages } : s);
      } else {
        return [{ id: currentSessionId, title, messages: newMessages }, ...prevSessions];
      }
    });
  };

  const handleNewChat = () => {
    setCurrentSessionId(Math.random().toString(36).substring(7));
  };

  return (
    <div className="flex h-screen w-full bg-[#0d0d0e] text-[#e3e3e3] font-sans overflow-hidden">
      <Sidebar sessions={sessions} currentSessionId={currentSessionId} onSelectSession={setCurrentSessionId} onNewChat={handleNewChat} />
      <div className="flex-1 h-full flex flex-col bg-[#131314] relative">
        {/* Header */}
        <div className="bg-[#1e1f20] px-6 py-4 flex items-center justify-between border-b border-gray-800 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg text-gray-200">AI Assistant</h1>
            </div>
          </div>
        </div>
        
        {/* Chat Component */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Chat sessionId={currentSessionId} messages={messages} setMessages={setMessages} />
        </div>
      </div>
    </div>
  );
}